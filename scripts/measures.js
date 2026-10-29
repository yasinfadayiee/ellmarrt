// Per-size measurements read from the product's own Basalam text («XL عرض سینه: 52 قد: 70 ...»).
// p.sizeText = [description, ...attribute values]; the seller often writes a size chart in one of them.
// Returns { cols, rows: [[size, {col: value}]] } or null. Only sizes the product really has, only numbers
// written in the text; a table needs ≥2 sizes so a stray line is never shown as a chart.
const LABELS = [
  ["عرض سینه", /^عرض\s*سینه$/], ["عرض شانه", /^((عرض\s*)?سر\s*شانه|عرض\s*شانه|سرشانه)$/], ["قد آستین", /^(قد\s*)?آستین$/],
  ["قد", /^قد(\s*(لباس|کار|تیشرت|بلوز|شلوار))?$/], ["دور کمر", /^((دور\s*)?کمر(\s*کشی)?|کمر)$/], ["فاق", /^فاق$/],
  ["عرض ران", /^عرض\s*ران$/], ["عرض دمپا", /^عرض\s*دمپا$/], ["طول پا", /^طول\s*پا$/],
];
const FA = "؀-ۿ";
const norm = (s) => String(s).toUpperCase().replace(/\s+/g, "").replace(/^XXXL$/, "3XL").replace(/^XXL$/, "2XL");
const digits = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

function parse(raw, want) {
  const text = digits(raw)
    .replace(/[*•▪📏✅✔|_️]/g, " ").replace(/‌/g, " ")
    .replace(/سانتی\s*متر|سانتیمتر|سانت|cm/gi, " ");
  // Segments start at a size token («سایز XL», «XL:», «41:») the product really sells.
  const tok = /(?:سایز\s*)?(?<![A-Za-z0-9])(\d?X{0,3}L|XS|S|M|\d{2,3})(?![A-Za-z0-9])\s*[:：]?/gi;
  const hits = [];
  for (let m; (m = tok.exec(text));) if (want.has(norm(m[1]))) hits.push({ size: want.get(norm(m[1])), at: m.index, end: tok.lastIndex });
  const rows = new Map();
  const re = new RegExp(`([${FA}][${FA}\\s]{0,14}?)\\s*[:：]?\\s*(\\d{2,3}(?:\\.\\d+)?)(?:\\s*تا\\s*(\\d{2,3}))?`, "g");
  for (let i = 0; i < hits.length; i++) {
    const seg = text.slice(hits[i].end, i + 1 < hits.length ? hits[i + 1].at : hits[i].end + 160).slice(0, 160);
    const vals = {};
    for (let m; (m = re.exec(seg));) {
      const words = m[1].trim().split(/\s+/);
      // label = last 1–2 words before the number («... قد آستین: 63» → «قد آستین»)
      const cand = [words.slice(-2).join(" "), words.slice(-1).join(" ")];
      const hit = LABELS.find(([, rx]) => cand.some((c) => rx.test(c)));
      if (hit && !vals[hit[0]]) vals[hit[0]] = m[3] ? `${m[2]} تا ${m[3]}` : m[2];
    }
    if (Object.keys(vals).length && !rows.has(hits[i].size)) rows.set(hits[i].size, vals);
  }
  return rows;
}

function measures(p) {
  if (!p.sizes || p.sizes.length < 2 || !p.sizeText) return null;
  const want = new Map(p.sizes.map((s) => [norm(s), s]));
  // The fullest chart wins (sellers sometimes paste a short and a long one; never mix them).
  let best = null, score = 0;
  for (const raw of p.sizeText) {
    const rows = parse(raw, want);
    const cols = LABELS.map(([k]) => k).filter((k) => [...rows.values()].filter((v) => v[k]).length >= 2);
    const order = p.sizes.filter((s) => rows.has(s) && cols.some((k) => rows.get(s)[k]));
    const n = order.reduce((a, s) => a + cols.filter((k) => rows.get(s)[k]).length, 0);
    if (order.length >= 2 && n > score) { score = n; best = { cols, rows: order.map((s) => [s, rows.get(s)]) }; }
  }
  return best;
}

module.exports = { measures };

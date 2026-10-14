// Pulls the live product list, prices, variants and stock of the Basalam store (piraysh) into data-raw/.
// Run by .github/workflows/sync.yml on a schedule, then images.js + build.js regenerate the site.
// New products get their original photos downloaded so images.js can build a hero from them.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "data-raw");
const ORIG = path.join(ROOT, "src-images/orig");
const VENDOR = "piraysh";
const UA = { "user-agent": "Mozilla/5.0 (compatible; ellmarrt-sync/1.0; +https://ellmarrt.ir)" };

const get = async (url, tries = 4) => {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return r;
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
};

(async () => {
  fs.mkdirSync(RAW, { recursive: true });
  fs.mkdirSync(ORIG, { recursive: true });
  const list = [];
  for (let from = 0; from < 1000; from += 12) {
    const r = await get(`https://search.basalam.com/ai-engine/api/v2.0/product/search?filters.vendorIdentifier=${VENDOR}&rows=12&from=${from}`);
    const j = await r.json();
    list.push(...j.products);
    if (j.products.length < 12 || list.length >= j.meta.count) break;
  }
  const uniq = [...new Map(list.map((p) => [p.id, p])).values()];
  // safety net: an empty/short response must never wipe the catalog
  const prev = fs.existsSync(path.join(RAW, "_search.json")) ? JSON.parse(fs.readFileSync(path.join(RAW, "_search.json"))) : [];
  if (uniq.length === 0 || (prev.length && uniq.length < prev.length * 0.5)) {
    console.error(`sync aborted: got ${uniq.length} products (previously ${prev.length})`);
    process.exit(1);
  }

  let changed = 0, added = [];
  for (const s of uniq) {
    const r = await get(`https://core.basalam.com/v4/products/${s.id}`);
    const full = await r.json();
    // drop fields that change on every request (views, vendor activity) to keep commits meaningful
    for (const k of ["view_count", "vendor", "navigation", "status_changes", "revision"]) delete full[k];
    const text = JSON.stringify(full, null, 1);
    const file = path.join(RAW, `${s.id}.json`);
    if (!fs.existsSync(file)) added.push(s.id);
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) { fs.writeFileSync(file, text); changed++; }
    // originals for products we have never seen (needed for their hero image)
    if (!fs.existsSync(path.join(ORIG, `${s.id}-0.jpg`))) {
      const d = full;
      const photos = [d.photo, ...(d.photos || [])].filter(Boolean);
      const seen = new Set();
      let n = 0;
      for (const p of photos) {
        if (seen.has(p.id) || n >= 6) continue;
        seen.add(p.id);
        const img = await get(p.original);
        fs.writeFileSync(path.join(ORIG, `${s.id}-${n++}.jpg`), Buffer.from(await img.arrayBuffer()));
      }
    }
  }
  const slim = uniq.map((p) => ({ id: p.id, name: p.name, price: p.price, stock: p.stock, sales_count: p.sales_count, rating: p.rating, categoryTitle: p.categoryTitle, video: p.video ? { PRIMARY: p.video.PRIMARY } : null }));
  fs.writeFileSync(path.join(RAW, "_search.json"), JSON.stringify(slim, null, 1));
  const removed = prev.filter((p) => !uniq.some((u) => u.id === p.id)).map((p) => p.id);
  console.log(`sync ok: ${uniq.length} products, ${changed} updated, new: [${added.join(",")}], removed: [${removed.join(",")}]`);
})().catch((e) => { console.error(e); process.exit(1); });

// Size-chart pages per garment, for «جدول سایز تیشرت مردانه» / «جدول سایز شلوار اسلش مردانه» (search console: these
// questions reach page 1 with /size-guide/):
//   /size/tshirt/  /size/pants/
// = the size-guide rows for that garment + every in-stock model's own chart (seller numbers, measured flat) + the
// in-stock models. Nothing is typed per page; numbers come from SIZE_ROWS, PANTS and measures().
const { measures } = require("./measures");

const GARMENTS = {
  tshirt: { cats: ["tshirt", "polo", "sweat"], h1: "جدول سایز تیشرت مردانه", noun: "تیشرت", cols: ["عرض سینه", "قد", "عرض شانه", "قد آستین"], key: "عرض سینه", also: "پولوشرت، هودی و بلوز" },
  pants: { cats: ["pants", "shorts"], h1: "جدول سایز شلوار اسلش مردانه", noun: "شلوار", cols: ["دور کمر", "قد", "فاق", "عرض ران", "عرض دمپا"], key: "قد", also: "شلوار راحتی، کارگو و شلوارک" },
};
// same groups as the pants table on /size-guide/ (weight, pants length)
const PANTS = { L: ["۶۵ تا ۸۵", "۱۰۰"], XL: ["۶۵ تا ۸۵", "۱۰۰"], "2XL": ["۸۵ تا ۹۵", "۱۰۵"], "3XL": ["۹۰ تا ۱۰۵", "۱۱۰"], "4XL": ["۱۰۵ تا ۱۲۰", "۱۱۰"], "5XL": ["۱۲۰ به بالا", "۱۱۰"], "6XL": ["۱۲۰ به بالا", "۱۱۰"] };

module.exports = ({ layout, crumbs, crumbSchema, faqSchema, itemList, card, SIZE_ROWS, fa, fa0 }) => {
  const ORDER = SIZE_ROWS.map((r) => r[0]);
  const rank = (a, b) => (b.sales || 0) - (a.sales || 0) || a.price - b.price;
  const sizeLink = (ctx, z) => `<a href="${ctx.BASE}/size/${z.toLowerCase()}/">${z}</a>`;

  const garmentList = (ctx, k) => ctx.products.filter((p) => p.inStock && GARMENTS[k].cats.includes(p.cat)).sort(rank);
  const garmentCharts = (ctx, k) => garmentList(ctx, k).map((p) => ({ p, m: measures(p) }))
    .filter((x) => x.m && x.m.rows.some(([, v]) => GARMENTS[k].cols.some((c) => v[c])));
  const garmentKinds = (ctx) => Object.keys(GARMENTS).filter((k) => garmentList(ctx, k).length >= 4);

  function garmentPage(ctx, k) {
    const { BASE } = ctx;
    const G = GARMENTS[k];
    const list = garmentList(ctx, k);
    const charts = garmentCharts(ctx, k);
    const path = `/size/${k}/`;
    const items = [["/", "خانه"], ["/size-guide/", "سایزیاب و جدول سایز"], [path, G.h1]];
    const cols = G.cols.filter((c) => charts.some(({ m }) => m.rows.some(([, v]) => v[c])));
    // one measure of one size across all charted models: [min, max, count]
    const spread = (z, c) => {
      const n = charts.map(({ m }) => { const r = m.rows.find(([q]) => q === z); return r ? parseFloat(r[1][c]) : NaN; }).filter((x) => !isNaN(x));
      return n.length ? [Math.min(...n), Math.max(...n), n.length] : null;
    };
    const qa = ORDER.map((z) => [z, spread(z, G.key)]).filter(([, r]) => r && r[2] >= 2).slice(0, 4).map(([z, r]) => [
      `${G.key} ${G.noun} سایز ${z} چند سانت است؟`,
      `در ${fa(r[2])} مدل المارت که جدول اندازه دارند، ${G.key} سایز ${z} ${r[0] === r[1] ? fa0(r[0]) : `از ${fa0(r[0])} تا ${fa0(r[1])}`} سانتی‌متر است (لباس صاف روی میز).`,
    ]);
    qa.push(k === "tshirt"
      ? ["عرض سینه را چطور اندازه بگیرم؟", "تیشرتی که اندازه‌تان است را صاف روی میز بگذارید و فاصله زیر یک بغل تا زیر بغل دیگر را اندازه بگیرید؛ این عدد را با ستون «عرض سینه» مقایسه کنید. دور سینه تقریباً دو برابر این عدد است."]
      : ["دور کمر و فاق شلوار را چطور اندازه بگیرم؟", "شلواری که اندازه‌تان است را صاف روی میز بگذارید. عرض کمر را از یک لبه تا لبه دیگر و فاق را از درز وسط پا تا لبه کمر اندازه بگیرید و با جدول مقایسه کنید. در شلوارهای کمرکش، عدد کمتر حالت آزاد و عدد بیشتر حالت کشیده است."]);

    const general = k === "tshirt"
      ? `<table><thead><tr><th>سایز</th><th>وزن (کیلوگرم)</th><th>قد شما (سانتی‌متر)</th><th>عرض سینه تیشرت</th><th>قد تیشرت</th></tr></thead><tbody>${SIZE_ROWS.map((r) => `<tr><td style="direction:ltr;font-weight:800">${sizeLink(ctx, r[0])}</td><td>${r[2]}</td><td>${r[1]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}</tbody></table>`
      : `<table><thead><tr><th>سایز</th><th>وزن (کیلوگرم)</th><th>قد شلوار (سانتی‌متر)</th></tr></thead><tbody>${ORDER.map((z) => `<tr><td style="direction:ltr;font-weight:800">${sizeLink(ctx, z)}</td><td>${PANTS[z][0]}</td><td>${PANTS[z][1]}</td></tr>`).join("")}</tbody></table>`;
    const modelTable = ({ p, m }) => {
      const c = cols.filter((x) => m.rows.some(([, v]) => v[x]));
      return `<h3><a href="${BASE}/p/${p.id}/">${p.title}</a></h3><div class="msr-t"><table><thead><tr><th>سایز</th>${c.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${m.rows.map(([z, v]) => `<tr><td style="direction:ltr;font-weight:800">${z}</td>${c.map((x) => `<td class="num">${v[x] ? fa0(v[x]) : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    };
    const min = Math.min(...list.map((p) => p.price));
    const others = garmentKinds(ctx).filter((x) => x !== k).map((x) => ` · <a href="${BASE}/size/${x}/">${GARMENTS[x].h1}</a>`).join("");

    return layout(ctx, {
      path,
      title: `${G.h1} | سایز L تا {MAX:${G.cats[0]}} به سانتی‌متر | المارت`,
      desc: `${G.h1} بر اساس قد و وزن${charts.length ? ` و اندازه واقعی ${fa(charts.length)} مدل (${cols.slice(0, 3).join("، ")})` : ""} به سانتی‌متر؛ روش اندازه‌گیری در خانه و ${fa(list.length)} مدل موجود از ${fa(min)} تومان.`,
      image: `${ctx.SITE_URL}/assets/og/${list[0].id}.jpg`,
      schema: [crumbSchema(ctx, items), faqSchema(qa), itemList(ctx, list)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>${G.h1}</h1><p>اول با قد و وزن سایز تقریبی را پیدا کنید، بعد آن را با اندازه واقعی همان مدل مقایسه کنید. ${G.also} هم در این صفحه آمده‌اند.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap prose" style="max-width:820px">
<h2>سایز ${G.noun} بر اساس قد و وزن</h2>${general}
${charts.length ? `<h2>اندازه واقعی هر مدل (سانتی‌متر)</h2><p>این اعداد را فروشنده برای هر مدل با لباس صاف روی میز نوشته است؛ دو مدل با یک اسم سایز می‌توانند چند سانت فرق داشته باشند.</p>${charts.map(modelTable).join("")}` : ""}
<h2>سوالات سایز ${G.noun}</h2><div class="faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
<p>بیشتر: <a href="${BASE}/size-guide/">سایزیاب با قد و وزن</a> · <a href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a>${others}</p>
</div></section>
<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">موجود الان</span><h2>${G.noun} مردانه در همه سایزها</h2></div></div><div class="grid">${list.slice(0, 12).map((p, i) => card(ctx, p, i < 2)).join("")}</div></div></section>`,
    });
  }

  return { garmentKinds, garmentPage, GARMENTS };
};

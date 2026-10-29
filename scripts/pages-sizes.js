// Search landing pages built only from the site's own data:
//   /size/<s>/        «سایز 4XL چند کیلو است؟» — the size-guide table + real measurements of our models in that size
//   /big-size/<cat>/  «تیشرت سایز بزرگ مردانه» — in-stock products of one category that have 3XL or larger
// Nothing here is typed by hand per page: weights/heights come from SIZE_ROWS (same table as /size-guide/),
// measurements from measures() (the seller's own chart), products and prices from the live catalogue.
const { measures } = require("./measures");

module.exports = ({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, sizer, SIZE_ROWS, STORE, fa, fa0 }) => {
  const ORDER = SIZE_ROWS.map((r) => r[0]);
  const ALIAS = { L: ["لارج"], XL: ["ایکس لارج"], "2XL": ["XXL", "دو ایکس لارج"], "3XL": ["XXXL", "سه ایکس لارج"], "4XL": ["XXXXL", "چهار ایکس لارج"], "5XL": ["XXXXXL", "پنج ایکس لارج"], "6XL": ["XXXXXXL", "شش ایکس لارج"] };
  // same groups as the pants table on /size-guide/
  const PANTS = { L: ["۶۵ تا ۸۵", "۱۰۰"], XL: ["۶۵ تا ۸۵", "۱۰۰"], "2XL": ["۸۵ تا ۹۵", "۱۰۵"], "3XL": ["۹۰ تا ۱۰۵", "۱۱۰"], "4XL": ["۱۰۵ تا ۱۲۰", "۱۱۰"], "5XL": ["۱۲۰ به بالا", "۱۱۰"], "6XL": ["۱۲۰ به بالا", "۱۱۰"] };
  const slug = (s) => s.toLowerCase();
  const range = (s) => s.replace("–", " تا ").replace("+", " به بالا");
  const rank = (a, b) => (b.sales || 0) - (a.sales || 0) || a.price - b.price;
  const BIG = ["3XL", "4XL", "5XL", "6XL"];

  const inSize = (ctx, s) => ctx.products.filter((p) => p.inStock && liveSizes(p).includes(s)).sort(rank);
  // real per-model numbers for one size: [{p, v}] where v = measures row
  const realRows = (list, s) => list.map((p) => { const m = measures(p); const r = m && m.rows.find(([z]) => z === s); return r ? { p, v: r[1] } : null; }).filter(Boolean);
  const span = (rows, k) => { const n = rows.map((r) => parseFloat(r.v[k])).filter((x) => !isNaN(x)); return n.length >= 2 ? [Math.min(...n), Math.max(...n)] : null; };
  const realTable = (ctx, rows, cols) => `<div class="msr-t"><table><thead><tr><th>مدل</th>${cols.map((k) => `<th>${k}</th>`).join("")}</tr></thead><tbody>${rows.map(({ p, v }) => `<tr><td style="text-align:start;white-space:normal"><a href="${ctx.BASE}/p/${p.id}/">${p.title}</a></td>${cols.map((k) => `<td class="num">${v[k] ? fa0(v[k]) : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const pickCols = (rows) => ["عرض سینه", "قد", "قد آستین", "دور کمر"].filter((k) => rows.filter((r) => r.v[k]).length >= 1);

  const sizePages = ORDER;

  function sizePage(ctx, s) {
    const { BASE } = ctx;
    const i = ORDER.indexOf(s), [, h, w, chest, len] = SIZE_ROWS[i];
    const prev = ORDER[i - 1], next = ORDER[i + 1];
    const list = inSize(ctx, s);
    const real = realRows(list, s);
    const LOW = ["pants", "shorts", "kids"];
    const tops = real.filter((r) => !LOW.includes(r.p.cat)), lows = real.filter((r) => LOW.includes(r.p.cat));
    const ch = span(tops, "عرض سینه");
    const alias = ALIAS[s] || [];
    const path = `/size/${slug(s)}/`;
    const items = [["/", "خانه"], ["/size-guide/", "سایزیاب و جدول سایز"], [path, `سایز ${s}`]];
    const qa = [
      [`سایز ${s} چند کیلو است؟`, `در جدول سایز المارت، ${s} برای وزن حدود ${range(w)} کیلوگرم است. اگر شکم یا سرشانه پهن‌تری دارید یا لباس آزاد دوست دارید، یک سایز بالاتر را هم ببینید.`],
      [`سایز ${s} برای چه قدی مناسب است؟`, `برای قد حدود ${range(h)} سانتی‌متر. اگر قدتان ۱۸۸ سانتی‌متر یا بیشتر است، قد لباس و شلوار را در صفحه همان مدل نگاه کنید یا یک سایز بزرگ‌تر بگیرید.`],
      ...(next ? [[`فرق سایز ${s} با ${next} چیست؟`, `${s} برای وزن ${range(w)} و ${next} برای وزن ${range(SIZE_ROWS[i + 1][2])} کیلوگرم است. عرض سینه تیشرت در جدول ما از حدود ${chest} به ${SIZE_ROWS[i + 1][3]} سانتی‌متر می‌رسد.`]] : []),
      [`شلوار سایز ${s} برای چه وزنی است؟`, `شلوار اسلش و راحتی سایز ${s} برای وزن ${PANTS[s][0]} کیلوگرم است و قد آن حدود ${PANTS[s][1]} سانتی‌متر است.`],
      ...(alias.length ? [[`${s} همان ${alias[0]} است؟`, `بله. ${s}${alias[1] ? ` یا «${alias[1]}»` : ""} همان ${alias[0]} است؛ فروشگاه‌ها هر دو شکل را می‌نویسند.`]] : []),
    ];
    return layout(ctx, {
      path,
      title: `سایز ${s} چند کیلو است؟ جدول وزن و قد سایز ${s} مردانه`,
      desc: `سایز ${s} مردانه برای وزن حدود ${range(w)} کیلو و قد ${range(h)} سانتی‌متر است.${ch ? ` عرض سینه ${s} در مدل‌های ما ${fa0(ch[0])} تا ${fa0(ch[1])} سانت.` : ""}${list.length ? ` ${fa(list.length)} مدل موجود در سایز ${s}.` : ""}`,
      schema: [crumbSchema(ctx, items), faqSchema(qa), ...(list.length ? [itemList(ctx, list)] : [])],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>سایز ${s} مردانه چند کیلو است؟</h1><p>سایز <b>${s}</b>${alias.length ? ` (${alias.join("، ")})` : ""} در جدول المارت برای وزن <b>${range(w)} کیلوگرم</b> و قد <b>${range(h)} سانتی‌متر</b> است. عرض سینه تیشرت در این سایز حدود ${chest} و قد لباس حدود ${len} سانتی‌متر است.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap prose">
<table><thead><tr><th>سایز</th><th>وزن (کیلوگرم)</th><th>قد (سانتی‌متر)</th><th>عرض سینه تیشرت</th><th>قد شلوار</th></tr></thead><tbody>${[prev, s, next].filter(Boolean).map((z) => { const r = SIZE_ROWS[ORDER.indexOf(z)]; return `<tr${z === s ? ' style="background:var(--gold-soft)"' : ""}><td style="direction:ltr;font-weight:800">${z === s ? z : `<a href="${BASE}/size/${slug(z)}/">${z}</a>`}</td><td>${r[2]}</td><td>${r[1]}</td><td>${r[3]}</td><td>${PANTS[z][1]}</td></tr>`; }).join("")}</tbody></table>
${real.length ? `<h2>اندازه واقعی سایز ${s} در مدل‌های المارت</h2><p>این اعداد را فروشنده برای هر مدل نوشته است (سانتی‌متر، لباس صاف روی میز).${ch ? ` عرض سینه ${s} از ${fa0(ch[0])} تا ${fa0(ch[1])} سانتی‌متر فرق می‌کند؛ برای همین فقط به اسم سایز اکتفا نکنید.` : ""}</p>${tops.length ? `<h3>تیشرت، هودی و بلوز</h3>${realTable(ctx, tops, pickCols(tops))}` : ""}${lows.length ? `<h3>شلوار و شلوارک</h3>${realTable(ctx, lows, ["قد", "دور کمر", "فاق", "عرض ران"].filter((k) => lows.some((r) => r.v[k])))}` : ""}` : ""}
<h2>بین دو سایز هستید؟</h2>
<p>${prev ? `اگر وزنتان نزدیک ${range(SIZE_ROWS[i - 1][2])} است، <a href="${BASE}/size/${slug(prev)}/">سایز ${prev}</a> را ببینید` : ""}${prev && next ? "؛ " : ""}${next ? `اگر لباس آزاد دوست دارید یا هودی را روی لباس دیگر می‌پوشید، <a href="${BASE}/size/${slug(next)}/">سایز ${next}</a> مناسب‌تر است` : ""}. برای جواب دقیق، قد و وزنتان را در سایزیاب زیر وارد کنید.</p>
</div></section>
<section class="sec-sm"><div class="wrap" style="max-width:640px">${sizer()}</div></section>
${list.length ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">موجود الان</span><h2>${fa(list.length)} مدل در سایز ${s}</h2></div><a class="link" href="${BASE}/shop/?size=${encodeURIComponent(s)}">همه در فروشگاه</a></div><div class="grid">${list.slice(0, 12).map((p, k) => card(ctx, p, k < 2)).join("")}</div></div></section>` : ""}
<section class="sec-sm bg-cream"><div class="wrap faq"><h2>سوالات سایز ${s}</h2>${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
<section class="sec-sm"><div class="wrap"><p class="note-sm">سایزهای دیگر: ${sizePages.filter((z) => z !== s).map((z) => `<a class="link" href="${BASE}/size/${slug(z)}/">${z}</a>`).join(" · ")} · <a class="link" href="${BASE}/size-guide/">جدول کامل سایز</a>${BIG.includes(s) ? ` · <a class="link" href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a>` : ""}</p></div></section>`,
    });
  }

  const BIG_CATS = {
    tshirt: { h1: "تیشرت سایز بزرگ مردانه", what: "تیشرت" },
    pants: { h1: "شلوار اسلش و راحتی سایز بزرگ مردانه", what: "شلوار" },
    sweat: { h1: "هودی و دورس سایز بزرگ مردانه", what: "هودی و دورس" },
    polo: { h1: "پولوشرت سایز بزرگ مردانه", what: "پولوشرت" },
  };
  const bigList = (ctx, cat) => ctx.products.filter((p) => p.inStock && p.cat === cat && liveSizes(p).some((z) => BIG.includes(z)))
    .sort((a, b) => ORDER.indexOf(liveSizes(b).slice(-1)[0]) - ORDER.indexOf(liveSizes(a).slice(-1)[0]) || rank(a, b));
  const bigCats = (ctx) => Object.keys(BIG_CATS).filter((k) => bigList(ctx, k).length >= 4);

  function bigCat(ctx, cat) {
    const { BASE, CATEGORIES } = ctx;
    const c = CATEGORIES[cat], B = BIG_CATS[cat];
    const list = bigList(ctx, cat);
    const sizes = BIG.filter((z) => list.some((p) => liveSizes(p).includes(z)));
    const top = sizes[sizes.length - 1];
    const prices = list.map((p) => p.price);
    const min = Math.min(...prices), max = Math.max(...prices);
    const real = [];
    for (const z of sizes.slice().reverse()) for (const r of realRows(list, z)) if (!real.some((x) => x.p.id === r.p.id)) real.push({ ...r, z });
    const cols = pickCols(real);
    const path = `/big-size/${c.slug}/`;
    const items = [["/", "خانه"], ["/big-size/", "لباس سایز بزرگ مردانه"], [path, B.h1]];
    const w = (z) => range(SIZE_ROWS[ORDER.indexOf(z)][2]);
    const qa = [
      [`${B.h1} تا چه سایزی دارید؟`, `الان ${B.what} در سایزهای ${sizes.join("، ")} موجود است؛ بزرگ‌ترین سایز موجود ${top} است. موجودی هر چند ساعت از غرفه باسلام به‌روز می‌شود.`],
      [`قیمت ${B.h1} چقدر است؟`, `قیمت ${fa(list.length)} مدل موجود از ${fa(min)} تا ${fa(max)} تومان است و خرید از غرفه رسمی المارت در باسلام انجام می‌شود.`],
      [`برای وزن ${w(top)} کیلو چه سایزی بگیرم؟`, `در جدول سایز المارت این وزن با سایز ${top} جور است. جدول دقیق هر مدل در صفحه همان محصول، زیر انتخاب سایز آمده است.`],
    ];
    return layout(ctx, {
      path,
      title: `${B.h1} | ${sizes.length > 2 ? `${sizes[0]} تا ${top}` : sizes.join("، ")} از ${fa(min)} تومان`,
      desc: `${fa(list.length)} مدل ${B.what} مردانه در سایز ${sizes[0]} تا ${top}، موجود و آماده ارسال از بازار تبریز. اندازه واقعی هر سایز، قیمت از ${fa(min)} تومان و خرید امن از باسلام.`,
      schema: [crumbSchema(ctx, items), itemList(ctx, list), faqSchema(qa)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>${B.h1}</h1><p>${fa(list.length)} مدل ${B.what} که الان در سایز ${sizes.join("، ")} موجود است؛ قیمت از <b class="num">${fa(min)}</b> تا <b class="num">${fa(max)}</b> تومان. اول بزرگ‌ترین سایزها آمده‌اند.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap"><div class="grid">${list.map((p, k) => card(ctx, p, k < 2)).join("")}</div></div></section>
${real.length ? `<section class="sec-sm"><div class="wrap prose"><h2>اندازه واقعی سایزهای بزرگ</h2><p>عددها از جدول سایز خود هر مدل است (سانتی‌متر). سایز هر ردیف کنار نام مدل آمده است.</p>${realTable(ctx, real.map((r) => ({ ...r, p: { ...r.p, title: `${r.p.title} — ${r.z}` } })), cols)}</div></section>` : ""}
<section class="sec-sm"><div class="wrap prose"><h2>کدام سایز؟</h2><table><thead><tr><th>سایز</th><th>وزن (کیلوگرم)</th><th>قد (سانتی‌متر)</th></tr></thead><tbody>${sizes.map((z) => { const r = SIZE_ROWS[ORDER.indexOf(z)]; return `<tr><td style="direction:ltr;font-weight:800"><a href="${BASE}/size/${slug(z)}/">${z}</a></td><td>${r[2]}</td><td>${r[1]}</td></tr>`; }).join("")}</tbody></table></div></section>
<section class="sec-sm bg-cream"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
<section class="sec-sm"><div class="wrap"><p class="note-sm">${bigCats(ctx).filter((k) => k !== cat).map((k) => `<a class="link" href="${BASE}/big-size/${CATEGORIES[k].slug}/">${BIG_CATS[k].h1}</a>`).join(" · ")} · <a class="link" href="${BASE}/big-size/">همه لباس‌های سایز بزرگ</a> · <a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a></p></div></section>`,
    });
  }

  return { sizePages, sizePage, bigCats, bigCat, BIG_CATS };
};

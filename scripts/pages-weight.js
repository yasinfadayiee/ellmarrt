// Search landing pages for two low-competition query groups (Google suggest + SERP check, Nov 2026):
//   /size/weight/            «سایز لباس مردانه بر اساس وزن» — hub table
//   /size/weight/<kg>/       «سایز لباس مردانه برای وزن 100 کیلو» — the size-guide row for that weight, the pants
//                            group, real chest widths of our models in that size and the in-stock models
//   /big-size/tabriz/        «لباس سایز بزرگ مردانه در تبریز» — results were only small local shops and Instagram
// Weights and sizes come only from SIZE_ROWS / PANTS (the /size-guide/ tables); measurements from measures().
const { measures } = require("./measures");

const WEIGHTS = [65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 140, 150];
// pants groups of the /size-guide/ pants table: [size, from kg, to kg]
const PANTS_W = [["XL", 65, 85], ["2XL", 85, 95], ["3XL", 90, 105], ["4XL", 105, 120], ["5XL", 120, 999], ["6XL", 120, 999]];

const num = (s) => Number(String(s).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

module.exports = ({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, SIZE_ROWS, STORE, fa, fa0, esc }) => {
  const rank = (a, b) => (b.sales || 0) - (a.sales || 0) || a.price - b.price;
  // [size, fromKg, toKg] from the size-guide rows («۶۶–۷۵», «۱۳۲+»)
  const TOPS = SIZE_ROWS.map((r) => { const [a, b] = r[2].split(/[–+]/); return [r[0], num(a), b ? num(b) : 999]; });
  const topFor = (w) => TOPS.filter(([, a, b]) => w >= a && w <= b).map((x) => x[0]);
  const pantsFor = (w) => PANTS_W.filter(([, a, b]) => w >= a && w <= b).map((x) => x[0]);
  const rowOf = (z) => SIZE_ROWS.find((r) => r[0] === z);
  const inSize = (ctx, z, cats) => ctx.products.filter((p) => p.inStock && cats.includes(p.cat) && liveSizes(p).includes(z)).sort(rank);
  const chestSpan = (ctx, z) => {
    const n = ctx.products.filter((p) => p.inStock).map((p) => { const m = measures(p); const r = m && m.rows.find(([q]) => q === z); return r ? parseFloat(r[1]["عرض سینه"]) : NaN; }).filter((x) => !isNaN(x));
    return n.length >= 2 ? [Math.min(...n), Math.max(...n)] : null;
  };
  const both = (a) => a.length > 1 ? `${a[0]} یا ${a[1]}` : a[0];
  const TOP_CATS = ["tshirt", "polo", "shirt", "sweat"], LOW_CATS = ["pants", "shorts"];

  const weightPages = WEIGHTS.filter((w) => topFor(w).length);
  const wLink = (ctx, w) => `<a href="${ctx.BASE}/size/weight/${w}/">${fa0(w)} کیلو</a>`;

  function weightHub(ctx) {
    const path = "/size/weight/";
    const items = [["/", "خانه"], ["/size-guide/", "سایزیاب و جدول سایز"], [path, "سایز لباس بر اساس وزن"]];
    const qa = [
      ["سایز لباس مردانه را با وزن چطور پیدا کنم؟", "وزن خود را در جدول پیدا کنید؛ ستون اول سایز تیشرت، هودی و پیراهن و ستون دوم سایز شلوار را نشان می‌دهد. اگر وزنتان روی مرز دو سایز است یا شکم دارید، سایز بزرگ‌تر راحت‌تر است."],
      ["آیا فقط وزن برای انتخاب سایز کافی است؟", "وزن نقطه شروع خوبی است، اما قد و فرم بدن هم مهم است. بعد از پیدا کردن سایز، عرض سینه و قد همان مدل را در صفحه محصول با لباسی که اندازه‌تان است مقایسه کنید."],
    ];
    return layout(ctx, {
      path,
      title: "سایز لباس مردانه بر اساس وزن | جدول وزن به سایز تیشرت و شلوار (L تا {MAX})",
      desc: `جدول سایز لباس مردانه بر اساس وزن: برای هر وزن از ${fa0(WEIGHTS[0])} تا ${fa0(WEIGHTS[WEIGHTS.length - 1])} کیلو سایز تیشرت، هودی و شلوار را ببینید؛ از L تا {MAX} با اندازه واقعی مدل‌های المارت.`,
      schema: [crumbSchema(ctx, items), faqSchema(qa)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>سایز لباس مردانه بر اساس وزن</h1><p>وزنتان را پیدا کنید تا سایز تیشرت و شلوار را ببینید. روی هر وزن بزنید تا اندازه دقیق و مدل‌های موجود همان سایز را ببینید.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap prose" style="max-width:760px">
<table><thead><tr><th>وزن</th><th>تیشرت، هودی، پیراهن</th><th>شلوار</th></tr></thead><tbody>${weightPages.map((w) => `<tr><td style="font-weight:800">${wLink(ctx, w)}</td><td style="direction:ltr">${topFor(w).join(" / ")}</td><td style="direction:ltr">${pantsFor(w).join(" / ") || "—"}</td></tr>`).join("")}</tbody></table>
<h2>سوالات</h2><div class="faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
<p>بیشتر: <a href="${ctx.BASE}/size-guide/">سایزیاب با قد و وزن</a> · <a href="${ctx.BASE}/size/tshirt/">جدول سایز تیشرت مردانه</a> · <a href="${ctx.BASE}/size/pants/">جدول سایز شلوار اسلش مردانه</a> · <a href="${ctx.BASE}/big-size/">لباس سایز بزرگ مردانه</a></p>
</div></section>`,
    });
  }

  function weightPage(ctx, w) {
    const { BASE } = ctx;
    const tops = topFor(w), pants = pantsFor(w);
    const main = tops[tops.length - 1]; // on a border, the larger size is the safer pick
    const r = rowOf(main);
    const ch = chestSpan(ctx, main);
    const topList = inSize(ctx, main, TOP_CATS), lowList = pants.length ? inSize(ctx, pants[pants.length - 1], LOW_CATS) : [];
    const list = [...topList.slice(0, 8), ...lowList.slice(0, 4)];
    const i = weightPages.indexOf(w), prev = weightPages[i - 1], next = weightPages[i + 1];
    const path = `/size/weight/${w}/`;
    const items = [["/", "خانه"], ["/size/weight/", "سایز لباس بر اساس وزن"], [path, `وزن ${fa0(w)} کیلو`]];
    const qa = [
      [`سایز تیشرت برای وزن ${fa0(w)} کیلو چیست؟`, `در جدول المارت وزن ${fa0(w)} کیلو با سایز ${both(tops)} جور است${tops.length > 1 ? `؛ چون روی مرز دو سایز هستید، ${main} راحت‌تر است` : ""}. عرض سینه تیشرت ${main} در جدول ما حدود ${r[3]} سانتی‌متر و قد لباس حدود ${r[4]} سانتی‌متر است.`],
      ...(pants.length ? [[`سایز شلوار برای وزن ${fa0(w)} کیلو چیست؟`, `برای شلوار اسلش و راحتی، وزن ${fa0(w)} کیلو در گروه سایز ${both(pants)} قرار می‌گیرد. شلوارهای کمرکش و کتان کشی جای کمر را بهتر تنظیم می‌کنند.`]] : []),
      [`اگر ${fa0(w)} کیلو هستم و شکم دارم چه سایزی بگیرم؟`, `اگر شکم دارید یا لباس آزاد دوست دارید، یک سایز بالاتر از ${main} را ببینید و عرض سینه آن را با لباسی که اندازه‌تان است مقایسه کنید.`],
    ];
    return layout(ctx, {
      path,
      title: `سایز لباس مردانه برای وزن ${w} کیلو | تیشرت ${main}${pants.length ? `، شلوار ${pants[pants.length - 1]}` : ""} | المارت`,
      desc: `برای وزن ${fa0(w)} کیلو سایز تیشرت و هودی ${both(tops)}${pants.length ? ` و سایز شلوار ${both(pants)}` : ""} مناسب است. عرض سینه و قد این سایز به سانتی‌متر${list.length ? ` و ${fa(list.length)} مدل موجود در همین سایز` : ""}.`,
      schema: [crumbSchema(ctx, items), faqSchema(qa), ...(list.length ? [itemList(ctx, list)] : [])],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>سایز لباس مردانه برای وزن ${fa0(w)} کیلو</h1><p>برای وزن <b>${fa0(w)} کیلوگرم</b> سایز تیشرت، هودی و پیراهن <b style="direction:ltr;display:inline-block">${both(tops)}</b>${pants.length ? ` و سایز شلوار <b style="direction:ltr;display:inline-block">${both(pants)}</b>` : ""} مناسب است.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap prose" style="max-width:760px">
<table><thead><tr><th>سایز</th><th>وزن (کیلوگرم)</th><th>قد شما (سانتی‌متر)</th><th>عرض سینه تیشرت</th><th>قد تیشرت</th></tr></thead><tbody>${tops.map((z) => { const q = rowOf(z); return `<tr><td style="direction:ltr;font-weight:800"><a href="${BASE}/size/${z.toLowerCase()}/">${z}</a></td><td>${q[2]}</td><td>${q[1]}</td><td>${q[3]}</td><td>${q[4]}</td></tr>`; }).join("")}</tbody></table>
<p>قد معمول سایز ${main} در جدول ما ${r[1]} سانتی‌متر است؛ اگر بلندتر هستید، قد لباس را در صفحه محصول ببینید.${ch ? ` عرض سینه ${main} در مدل‌های المارت ${ch[0] === ch[1] ? fa0(ch[0]) : `از ${fa0(ch[0])} تا ${fa0(ch[1])}`} سانتی‌متر است (لباس صاف روی میز).` : ""}</p>
<h2>سوالات</h2><div class="faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
<p>${prev ? `وزن کمتر: ${wLink(ctx, prev)} · ` : ""}${next ? `وزن بیشتر: ${wLink(ctx, next)} · ` : ""}<a href="${BASE}/size/weight/">جدول کامل وزن و سایز</a> · <a href="${BASE}/size/${main.toLowerCase()}/">سایز ${main} چند کیلو است؟</a>${w >= 105 ? ` · <a href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a>` : ""}</p>
</div></section>
${list.length ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">موجود در سایز شما</span><h2>مدل‌های ${main}${lowList.length && pants[pants.length - 1] !== main ? ` و شلوار ${pants[pants.length - 1]}` : ""}</h2></div></div><div class="grid">${list.map((p, k) => card(ctx, p, k < 2)).join("")}</div></div></section>` : ""}`,
    });
  }

  function bigTabriz(ctx) {
    const { BASE, CATEGORIES } = ctx;
    const BIG = ["3XL", "4XL", "5XL", "6XL"];
    const list = ctx.products.filter((p) => p.inStock && liveSizes(p).some((z) => BIG.includes(z))).sort(rank);
    const cats = Object.entries(CATEGORIES).filter(([k]) => list.some((p) => p.cat === k));
    const path = "/big-size/tabriz/";
    const items = [["/", "خانه"], ["/big-size/", "لباس سایز بزرگ مردانه"], [path, "لباس سایز بزرگ مردانه در تبریز"]];
    const min = Math.min(...list.map((p) => p.price));
    const qa = [
      ["فروشگاه لباس سایز بزرگ مردانه در تبریز کجاست؟", `غرفه المارت در ${esc(STORE.address)} است. می‌توانید حضوری بیایید و لباس را امتحان کنید یا از همین سایت سفارش دهید.`],
      ["لباس سایز بزرگ مردانه تا چه سایزی دارید؟", "تیشرت تا {MAX:tshirt}، شلوار تا {MAX:pants} و هودی و دورس تا {MAX:sweat}؛ سایزهای موجود هر مدل روی کارت همان مدل آمده است."],
      ["در تبریز پیک دارید؟", "بله؛ برای سفارش داخل شهر تبریز پیک موتوری داریم. مدل و سایز را تلفنی یا پیامکی بگویید تا هماهنگ شود."],
    ];
    return layout(ctx, {
      path,
      title: "لباس سایز بزرگ مردانه در تبریز | تیشرت، شلوار و هودی تا {MAX} | المارت",
      desc: `خرید لباس سایز بزرگ مردانه در تبریز از غرفه المارت در بازار سرپوشیده: ${fa(list.length)} مدل تیشرت، شلوار اسلش و هودی از 3XL تا {MAX}، از ${fa(min)} تومان؛ خرید حضوری، پیک در تبریز و ارسال به سراسر ایران.`,
      schema: [crumbSchema(ctx, items), faqSchema(qa), itemList(ctx, list)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>لباس سایز بزرگ مردانه در تبریز</h1><p>المارت ${fa(STORE.years)} سال است در بازار سرپوشیده تبریز پوشاک مردانه می‌فروشد و سایز بزرگ واقعی از 3XL تا {MAX} دارد. الان <b>${fa(list.length)} مدل</b> در سایز بزرگ موجود است.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap"><div class="grid">${list.slice(0, 12).map((p, k) => card(ctx, p, k < 2)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap prose" style="max-width:760px">
<h2>خرید حضوری در بازار تبریز</h2><p>نشانی غرفه: ${esc(STORE.address)}. اگر در تبریز هستید، بیایید و سایز را امتحان کنید؛ برای سفارش داخل شهر پیک موتوری هم داریم. تماس: ${STORE.phones.map((p) => `<a href="tel:${p}" class="num">${fa0(p)}</a>`).join(" · ")}</p>
<h2>سایز بزرگ در هر دسته</h2><p>${cats.map(([k, c]) => `<a href="${BASE}/c/${c.slug}/">${c.name}</a> (${fa(list.filter((p) => p.cat === k).length)} مدل)`).join(" · ")}</p>
<h2>سوالات</h2><div class="faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
<p>بیشتر: <a href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a> · <a href="${BASE}/size/weight/">سایز لباس بر اساس وزن</a> · <a href="${BASE}/tabriz-bazaar/">فروشگاه لباس مردانه در تبریز</a></p>
</div></section>`,
    });
  }

  return { weightPages, weightHub, weightPage, bigTabriz };
};

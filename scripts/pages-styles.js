// Style landing pages built only from the live catalogue, for the modifiers people type after the product name
// (Google suggest, Nov 2026: «شلوار بغل نوار مردانه»، «شلوار کارگو مردانه»، «تیشرت مردانه باکسی»، «دورس مردانه نیم زیپ» …):
//   /c/<cat>/<style>/
// A product belongs to a style when its curated title, focus keyword or Basalam title matches the style's pattern.
// A page exists only while at least MIN matching products are in stock, so it is never empty.
const MIN = 2;

// [cat, slug, h1, pattern, short note on what the style is and how to wear it]
const STYLES = [
  ["pants", "side-stripe", "شلوار بغل‌نوار مردانه", /بغل ?نوار|سه ?خط/,
    "شلوار بغل‌نوار نواری در دو طرف پا دارد که قد را بلندتر و استایل را اسپرت‌تر نشان می‌دهد. با تیشرت ساده، هودی و کفش اسپرت ست می‌شود و هم برای بیرون و هم برای باشگاه مناسب است."],
  ["pants", "cargo", "شلوار کارگو و جیب‌دار مردانه", /کارگو|شش ?جیب|چهار ?جیب|4 ?جیب/,
    "شلوار کارگو جیب‌های اضافه روی پا دارد؛ گوشی، کیف پول و کلید را بدون کیف جا می‌دهد. دمپای مچی یا کش‌دار آن با کفش اسپرت و نیم‌بوت خوش‌فرم می‌نشیند و برای سفر، کار و بیرون رفتن کاربردی است."],
  ["pants", "katan", "شلوار کتان مردانه", /کتان/,
    "کتان پارچه‌ای محکم‌تر از اسپان و نخ است؛ فرمش را بهتر نگه می‌دارد و دیرتر زانو می‌اندازد. کتان کشی هنگام نشستن و راه رفتن راحت است و برای بیرون رفتن مرتب‌تر از شلوار راحتی به نظر می‌رسد."],
  ["pants", "cotton", "شلوار راحتی نخی مردانه", /نخی|تمام ?نخ|نخ و پنبه|اسپان/,
    "شلوار نخی سبک و تنفس‌پذیر است و برای خانه، پیاده‌روی و سفر انتخاب راحتی است. بهتر است با آب سرد و پشت‌ورو شسته شود تا رنگ و فرمش بماند."],
  ["tshirt", "boxy", "تیشرت باکسی و اورسایز مردانه", /باکسی|اورسایز/,
    "تیشرت باکسی برش گشاد و شانه افتاده دارد و قدش کوتاه‌تر از عرضش است؛ همان فرم ترندی که با شلوار بگ، کارگو و جین خوب ست می‌شود. اگر فرم جذب‌تر می‌خواهید، یک سایز کوچک‌تر بردارید."],
  ["tshirt", "printed", "تیشرت طرح‌دار مردانه", /طرح(?! ساده| متفاوت)|چاپ/,
    "تیشرت طرح‌دار با یک شلوار ساده یک‌رنگ بهتر دیده می‌شود. برای ماندگاری چاپ، تیشرت را پشت‌ورو و با آب سرد بشویید و روی چاپ اتو نکشید."],
  ["tshirt", "plain", "تیشرت ساده مردانه", /ساده|مشکی مردانه پنبه/,
    "تیشرت ساده پایه کمد لباس است؛ زیر سویشرت و پیراهن باز، یا تنها با شلوار اسلش و جین پوشیده می‌شود. پنبه با نمره بالاتر ضخیم‌تر است و دیرتر فرمش را از دست می‌دهد."],
  ["polo", "collar", "تیشرت یقه‌دار مردانه", /یقه ?دار|یقه انگلیسی|دو دکمه/,
    "تیشرت یقه‌دار (پولو) از تیشرت معمولی رسمی‌تر و از پیراهن راحت‌تر است؛ برای محل کار، مهمانی ساده و بیرون رفتن مناسب است و با شلوار کتان و جین ست می‌شود."],
  ["polo", "half-zip", "پولوشرت نیم‌زیپ مردانه", /نیم ?زیپ/,
    "نیم‌زیپ یقه‌ای دارد که با زیپ کوتاه باز و بسته می‌شود؛ بسته‌اش مرتب و رسمی است و بازش اسپرت. روی تیشرت سفید یا مشکی و با شلوار کتان خیلی خوب می‌نشیند."],
  ["sweat", "hoodie", "هودی و سویشرت کلاه‌دار مردانه", /هودی|کلاه ?دار/,
    "هودی کلاه دارد و برای روزهای سرد و باد گرم‌تر از دورس است؛ با شلوار اسلش، کارگو و جین ست می‌شود. اگر می‌خواهید روی تیشرت یا بلوز بپوشید، جای کافی در سینه و شانه داشته باشد."],
  ["sweat", "dorce", "دورس مردانه", /دورس/,
    "دورس پارچه‌ای ضخیم‌تر از تیشرت است که داخلش معمولاً کرکی یا حوله‌ای است؛ گرم و نرم است و برای پاییز و زمستان، تنها یا زیر کاپشن، انتخاب راحتی است."],
  ["sweat", "long-sleeve", "بلوز و تیشرت آستین‌بلند مردانه", /آستین ?بلند|لانگ ?اسلیو/,
    "بلوز آستین‌بلند پنبه برای پاییز و روزهای خنک است؛ تنها یا زیر کاپشن و سویشرت پوشیده می‌شود. اگر می‌خواهید زیر لباس دیگری بپوشید، سایز همیشگی‌تان را بردارید تا جمع نشود."],
];

// other names people search for the same style (Search Console: «پولوشرت یقه دار»، «پلوشرت یقه دار»)
const ALT = { collar: "پولوشرت" };

module.exports = ({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, fa, STORE }) => {
  const rank = (a, b) => (b.sales || 0) - (a.sales || 0) || a.price - b.price;
  const hay = (p) => `${p.title} ${p.keyword || ""} ${p.basalamTitle || ""}`.replace(/‌/g, " ");
  const listOf = (ctx, s) => ctx.products.filter((p) => p.inStock && p.cat === s[0] && s[3].test(hay(p))).sort(rank);

  const stylePages = (ctx) => STYLES.filter((s) => ctx.CATEGORIES[s[0]])
    .map((s) => ({ cat: s[0], slug: s[1], h1: s[2], note: s[4], list: listOf(ctx, s) }))
    .map((x) => {
      if (x.list.length >= MIN || !ctx.prev || !ctx.prev.has(`/c/${ctx.CATEGORIES[x.cat].slug}/${x.slug}/`)) return x;
      // already in Google: keep the page with sold-out models of the same style
      const s = STYLES.find((y) => y[0] === x.cat && y[1] === x.slug);
      return { ...x, list: [...x.list, ...ctx.products.filter((p) => !p.inStock && p.cat === x.cat && s[3].test(hay(p))).sort(rank)].slice(0, 8) };
    })
    .filter((x) => x.list.length >= MIN || (x.list.length && ctx.prev && ctx.prev.has(`/c/${ctx.CATEGORIES[x.cat].slug}/${x.slug}/`)));
  const pathOf = (ctx, pg) => `/c/${ctx.CATEGORIES[pg.cat].slug}/${pg.slug}/`;
  const link = (ctx, pg) => `<a class="link" href="${ctx.BASE}${pathOf(ctx, pg)}">${pg.h1}</a>`;

  // «مدل‌ها» links for a category page / home
  const styleLinks = (ctx, cat) => {
    const pg = stylePages(ctx).filter((x) => cat == null || x.cat === cat);
    return pg.length ? `<p class="note-sm">${cat == null ? "خرید بر اساس مدل" : "مدل‌ها"}: ${pg.map((x) => link(ctx, x)).join(" · ")}</p>` : "";
  };
  // style pages a product page should link to
  const stylesOf = (ctx, p) => stylePages(ctx).filter((x) => x.list.includes(p));

  function stylePage(ctx, pg) {
    const { BASE, CATEGORIES } = ctx;
    const { cat, h1, list, note } = pg;
    const c = CATEGORIES[cat];
    const path = pathOf(ctx, pg);
    const items = [["/", "خانه"], ["/shop/", "فروشگاه"], [`/c/${c.slug}/`, c.name], [path, h1]];
    const prices = list.map((p) => p.price);
    const min = Math.min(...prices), max = Math.max(...prices);
    const ORD = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
    const sizes = [...new Set(list.filter((p) => p.inStock).flatMap((p) => liveSizes(p)))].sort((a, b) => (ORD.indexOf(a) + 1 || 99 + parseFloat(a)) - (ORD.indexOf(b) + 1 || 99 + parseFloat(b)));
    const nIn = list.filter((p) => p.inStock).length;
    const sizeTxt = sizes.length > 1 ? `از ${sizes[0]} تا ${sizes[sizes.length - 1]}` : sizes[0] || "";
    const first = list[0];
    const others = stylePages(ctx).filter((x) => x.cat === cat && x.slug !== pg.slug);
    const qa = [
      [`قیمت ${h1} چقدر است؟`, `${h1} در المارت از ${fa(min)} تا ${fa(max)} تومان است و ${fa(list.length)} مدل از آن را می‌توانید همین حالا سفارش دهید. قیمت‌ها هر چند ساعت از غرفه باسلام به‌روز می‌شود.`],
      [`${h1} چه سایزهایی دارد؟`, sizes.length ? `سایزهای ${sizes.join("، ")}. جدول اندازه هر مدل در صفحه همان محصول، زیر انتخاب سایز آمده است.` : `سایز هر مدل در صفحه همان محصول آمده است.`],
      [`${h1} را از کجا بخرم؟`, `المارت ${fa(STORE.years)} سال سابقه در ${STORE.bazaar} دارد. مدل را باز کنید، رنگ و سایز را انتخاب کنید و از غرفه رسمی المارت در باسلام یا با «سفارش مستقیم» (تلفن و پیامک) خرید کنید.`],
    ];
    return layout(ctx, {
      path,
      title: `خرید ${h1}${ALT[pg.slug] ? ` (${ALT[pg.slug]})` : ""} | ${fa(nIn || list.length)} مدل از ${fa(min)} تومان | المارت`,
      desc: `${fa(nIn || list.length)} مدل ${h1}${ALT[pg.slug] ? ` یا ${ALT[pg.slug]}` : ""}${sizeTxt ? ` در سایز ${sizeTxt}` : ""} از بازار تبریز؛ قیمت از ${fa(min)} تومان، ارسال به سراسر ایران و خرید امن از باسلام.`,
      image: `${ctx.SITE_URL}/assets/og/${first.id}.jpg`,
      schema: [crumbSchema(ctx, items), itemList(ctx, list), faqSchema(qa)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>${h1}</h1><p>${fa(list.length)} مدل${sizeTxt ? ` در سایز ${sizeTxt}` : ""}؛ قیمت از <b class="num">${fa(min)}</b> تا <b class="num">${fa(max)}</b> تومان. پرفروش‌ترین‌ها اول آمده‌اند.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap"><div class="grid">${list.map((p, k) => card(ctx, p, k < 2)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap prose"><h2>${h1} چیست و با چه ست می‌شود؟</h2><p>${note}</p><p>همه این مدل‌ها از ${c.name} المارت هستند و مستقیم از ${STORE.bazaar} ارسال می‌شوند. اگر سایزتان را نمی‌دانید، <a href="${BASE}/size-guide/">سایزیاب</a> را با قد و وزنتان امتحان کنید.</p></div></section>
<section class="sec-sm bg-cream"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
<section class="sec-sm"><div class="wrap">${others.length ? `<p class="note-sm">مدل‌های دیگر: ${others.map((x) => link(ctx, x)).join(" · ")}</p>` : ""}<p class="note-sm"><a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a> · <a class="link" href="${BASE}/shop/">فروشگاه</a> · <a class="link" href="${BASE}/size-guide/">سایزیاب</a></p></div></section>`,
    });
  }

  return { stylePages, stylePage, stylePath: pathOf, styleLinks, stylesOf, styleImages: (ctx, pg) => [`${ctx.SITE_URL}/assets/p/${pg.list[0].id}-960.webp`] };
};

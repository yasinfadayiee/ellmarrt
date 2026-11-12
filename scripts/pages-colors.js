// Colour landing pages built only from the live catalogue:
//   /c/<cat>/<colour>/   «تیشرت مشکی مردانه» — in-stock products of one category that come in one colour
// A page exists only while at least MIN products of that category are in stock in that colour, so it is never empty.
// The colour shown on each card is the colour being searched (the studio shot of that colour).
const MIN = 2;

// base colour group -> [url slug, short styling note]. Colours not listed here get no page.
const COLORS = {
  "مشکی": ["black", "مشکی رنگ همیشگی انتخاب مردهاست؛ با هر رنگ دیگری ست می‌شود، لک و ردپای شست‌وشو را کمتر نشان می‌دهد و هم برای محل کار و هم برای بیرون رفتن مناسب است."],
  "سفید": ["white", "سفید تمیز و تابستانی است و با شلوار تیره، جین و کفش اسپرت ست می‌شود. برای نگه‌داشتن سفیدی، آن را جدا و با آب سرد بشویید."],
  "کرمی": ["cream", "کرمی از سفید گرم‌تر و ملایم‌تر است؛ با شلوار سرمه‌ای، قهوه‌ای و مشکی ست می‌شود و کمتر از سفید خودنمایی می‌کند."],
  "یشمی": ["jade", "یشمی سبزِ سرد و آرام است؛ با مشکی، طوسی و کرمی ست می‌شود و لباس را از رنگ‌های معمولی جدا می‌کند."],
  "نسکافه‌ای": ["nescafe", "نسکافه‌ای قهوه‌ایِ روشن و گرم است؛ با مشکی، سفید و سرمه‌ای ست می‌شود و برای پاییز بسیار مناسب است."],
  "طوسی": ["gray", "طوسی رنگی خنثی و کاربردی است؛ با تقریباً هر رنگی ست می‌شود و برای استفاده روزانه گزینه‌ای بدون ریسک است."],
  "سرمه‌ای": ["navy", "سرمه‌ای شکل رسمی‌تر و خوش‌دست‌تر از مشکی دارد؛ با سفید، کرمی و طوسی ست می‌شود."],
  "نارنجی": ["orange", "نارنجی رنگی پرانرژی و متفاوت است؛ بهتر است با مشکی، سرمه‌ای یا طوسی ست شود تا لباس اصلی دیده شود."],
  "زرشکی": ["burgundy", "زرشکی رنگی گرم و پاییزی است؛ با مشکی، طوسی و سرمه‌ای ست می‌شود و شیک‌تر از رنگ‌های روشن به نظر می‌رسد."],
  "قهوه‌ای": ["brown", "قهوه‌ای رنگ گرم و کلاسیک است؛ با کرمی، سفید و مشکی ست می‌شود و برای فصل سرد بسیار مناسب است."],
  "پسته‌ای": ["pistachio", "پسته‌ای سبز ملایم و روشن است؛ با سفید، کرمی و طوسی ست می‌شود و حس تازه‌ای به لباس می‌دهد."],
  "آبی": ["blue", "آبی رنگی تمیز و دوست‌داشتنی است؛ با سفید، طوسی و سرمه‌ای ست می‌شود."],
  "هوایی": ["sky", "هوایی (آبی روشن) رنگی سبک است؛ با سفید، طوسی و سرمه‌ای ست می‌شود و برای فصل گرم مناسب است."],
  "سبز": ["green", "سبز رنگی طبیعی و جوان‌پسند است؛ با مشکی، سفید و کرمی ست می‌شود."],
  "سبز ساقه‌ای": ["stem-green", "سبز ساقه‌ای تیره‌تر از سبز معمولی و رنگی شیک است؛ با مشکی، کرمی و طوسی ست می‌شود."],
};

const NOUN = {
  tshirt: ["تیشرت", "مردانه"],
  polo: ["پولوشرت", "مردانه"],
  shirt: ["پیراهن", "مردانه"],
  sweat: ["دورس و هودی", "مردانه"], // «دورس سفید/مشکی/طوسی» is searched more than «هودی …» (Search Console, Nov 2026)
  pants: ["شلوار", "مردانه"],
  shorts: ["شلوارک", "مردانه"],
  shoes: ["کفش اسپرت", "مردانه"],
  kids: ["لباس", "پسرانه"],
};

const group = (c) => c.replace(/ (روشن|تیره)$/, "");
// other words people use for the same colour (Search Console queries: «دورس خاکستری»، «هودی سیاه»)
const ALT = { "طوسی": "خاکستری", "مشکی": "سیاه", "قهوه‌ای": "شکلاتی", "سرمه‌ای": "سورمه‌ای", "هوایی": "آبی روشن" };
const SIZE_ORDER = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const bySize = (a, b) => (SIZE_ORDER.indexOf(a) + 1 || 99 + parseFloat(a)) - (SIZE_ORDER.indexOf(b) + 1 || 99 + parseFloat(b));

module.exports = ({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, fa, STORE, SIZE_ROWS }) => {
  const rank = (a, b) => (b.sales || 0) - (a.sales || 0) || a.price - b.price;
  // the product with the colour switched to g, so its card shows that colour's studio shot
  const asColor = (p, g) => {
    const i = p.colors.findIndex((c, k) => group(c) === g && p.colorInStock.includes(k) && p.colorImages.includes(k));
    return i >= 0 ? { ...p, mainColor: i } : p;
  };
  const listOf = (ctx, cat, g) => ctx.products
    .filter((p) => p.inStock && p.cat === cat && p.colors.some((c, k) => group(c) === g && p.colorInStock.includes(k)))
    .sort(rank);
  // sold-out models that come in colour g (used only to keep a page Google already knows)
  const soldOf = (ctx, cat, g) => ctx.products
    .filter((p) => !p.inStock && p.cat === cat && p.colors.some((c) => group(c) === g))
    .sort(rank);

  // every page that exists right now: [{ cat, g, slug, list }]
  const colorPages = (ctx) => {
    const out = [];
    for (const cat of Object.keys(NOUN)) {
      if (!ctx.CATEGORIES[cat]) continue;
      for (const g of Object.keys(COLORS)) {
        const list = listOf(ctx, cat, g);
        if (list.length >= MIN) out.push({ cat, g, slug: COLORS[g][0], list });
        else if (ctx.prev && ctx.prev.has(`/c/${ctx.CATEGORIES[cat].slug}/${COLORS[g][0]}/`)) {
          // page is already in Google: keep it while at least one model (in stock or not) has the colour
          const keep = [...list, ...soldOf(ctx, cat, g)].slice(0, 8);
          if (keep.length) out.push({ cat, g, slug: COLORS[g][0], list: keep });
        }
      }
    }
    return out;
  };
  const pathOf = (ctx, cat, g) => `/c/${ctx.CATEGORIES[cat].slug}/${COLORS[g][0]}/`;
  const h1Of = (cat, g) => `${NOUN[cat][0]} ${g} ${NOUN[cat][1]}`;

  // «رنگ‌های موجود» links for a category page
  const colorLinks = (ctx, cat) => {
    const pg = colorPages(ctx).filter((x) => x.cat === cat);
    return pg.length ? `<p class="note-sm">رنگ‌های موجود: ${pg.map((x) => `<a class="link" href="${ctx.BASE}${pathOf(ctx, cat, x.g)}">${h1Of(cat, x.g)}</a>`).join(" · ")}</p>` : "";
  };

  function colorPage(ctx, pg) {
    const { BASE, CATEGORIES } = ctx;
    const { cat, g, list } = pg;
    const c = CATEGORIES[cat];
    const h1 = h1Of(cat, g);
    const path = pathOf(ctx, cat, g);
    const items = [["/", "خانه"], ["/shop/", "فروشگاه"], [`/c/${c.slug}/`, c.name], [path, h1]];
    const live = list.filter((p) => p.inStock);
    const prices = (live.length ? live : list).map((p) => p.price);
    const min = Math.min(...prices), max = Math.max(...prices);
    const sizes = [...new Set(live.flatMap((p) => liveSizes(p)))].sort(bySize);
    const first = list[0], top = asColor(first, g);
    const alt = ALT[g] ? ` (${ALT[g]})` : "";
    const nIn = live.length;
    const base = top.mainColor != null ? `${top.id}-k${top.mainColor}` : `${top.id}`;
    const noun = NOUN[cat][0];
    const sizeTxt = sizes.length > 1 ? `از ${sizes[0]} تا ${sizes[sizes.length - 1]}` : sizes[0] || "";
    const L = SIZE_ROWS && SIZE_ROWS.find((r) => r[0] === sizes[0]);
    const qa = [
      [`${h1} چه سایزهایی دارد؟`, nIn ? `${fa(nIn)} مدل ${noun} ${g} الان موجود است${sizes.length ? ` و سایزهای ${sizes.join("، ")} را دارد` : ""}. سایز دقیق هر مدل در صفحه همان محصول زیر انتخاب سایز آمده است و موجودی هر چند ساعت از غرفه باسلام به‌روز می‌شود.` : `مدل‌های ${noun} ${g} الان تمام شده‌اند؛ موجودی هر چند ساعت از غرفه باسلام به‌روز می‌شود و سایز هر مدل در صفحه همان محصول آمده است.`],
      ...(cat === "sweat" && L ? [[`${noun} ${g} برای پسر نوجوان هم مناسب است؟`, `کوچک‌ترین سایز این مدل‌ها ${L[0]} است که در جدول المارت برای قد ${L[1]} سانتی‌متر و وزن ${L[2]} کیلوگرم است. پسر نوجوانی که در این محدوده است می‌تواند ${L[0]} را بپوشد؛ برای کوچک‌ترها بخش لباس پسرانه المارت را ببینید.`]] : []),
      [`قیمت ${h1} چقدر است؟`, nIn ? `قیمت مدل‌های موجود ${noun} ${g} از ${fa(min)} تا ${fa(max)} تومان است. قیمت نهایی را در باسلام بررسی کنید.` : `این مدل‌ها فعلاً ناموجودند. قیمت و موجودی نهایی را در صفحه محصول بررسی کنید.`],
      [`${noun} ${g} را از کجا بخرم؟`, `المارت ${fa(STORE.years)} سال سابقه در ${STORE.bazaar} دارد. مدل مورد نظر را باز کنید، سایز و رنگ ${g} را انتخاب کنید و از باسلام یا با «سفارش مستقیم» خرید کنید.`],
    ];
    return layout(ctx, {
      path,
      title: nIn >= MIN ? `خرید ${h1}${alt} | ${fa(nIn)} مدل از ${fa(min)} تومان` : `${h1}${alt} | قیمت و مدل‌ها`,
      desc: nIn ? `${fa(nIn)} مدل ${noun} ${g}${alt} ${NOUN[cat][1]}${sizeTxt ? ` در سایز ${sizeTxt}` : ""}، از بازار تبریز. مشاهده مدل‌ها، قیمت و خرید از باسلام.` : `مدل‌های ${noun} ${g}${alt} ${NOUN[cat][1]} المارت از بازار تبریز؛ قیمت و موجودی هر چند ساعت از باسلام به‌روز می‌شود.`,
      image: `${ctx.SITE_URL}/assets/og/${first.id}.jpg`,
      schema: [crumbSchema(ctx, items), itemList(ctx, list), faqSchema(qa)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>${h1}</h1><p>${nIn ? `${fa(nIn)} مدل ${noun} ${g}${alt} که الان موجود است${sizeTxt ? ` در سایز ${sizeTxt}` : ""}. پرفروش‌ترین‌ها اول آمده‌اند.` : `مدل‌های ${noun} ${g}${alt} المارت فعلاً تمام شده‌اند و با شارژ دوباره همین‌جا موجود می‌شوند.`} رنگ و موجودی هر مدل را در صفحه محصول بررسی کنید.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap"><div class="grid">${list.map((p, k) => card(ctx, asColor(p, g), k < 2)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap prose"><h2>درباره رنگ ${g}</h2><p>${COLORS[g][1]}</p><p>همه مدل‌های بالا اصلی و از ${ctx.CATEGORIES[cat].name} مجموعه المارت هستند. اگر درباره سایز مطمئن نیستید، <a href="${BASE}/size-guide/">سایزیاب</a> را با قد و وزنتان امتحان کنید.</p></div></section>
<section class="sec-sm bg-cream"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
<section class="sec-sm"><div class="wrap">${colorLinks(ctx, cat)}<p class="note-sm"><a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a> · <a class="link" href="${BASE}/shop/">فروشگاه</a> · <a class="link" href="${BASE}/size-guide/">سایزیاب</a></p></div></section>`,
    });
  }

  return { colorPages, colorPage, colorLinks, colorTitle: h1Of, colorPath: pathOf, colorImages: (ctx, pg) => { const t = asColor(pg.list[0], pg.g); return t.mainColor != null ? [`${ctx.SITE_URL}/assets/p/${t.id}-k${t.mainColor}-960.webp`] : []; } };
};

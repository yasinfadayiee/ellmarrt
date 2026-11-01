// Budget landing pages from the live catalogue: «پوشاک مردانه زیر ۱ میلیون تومان», «شلوار مردانه زیر ۱ میلیون تومان».
//   /price/under-<n>m/        every in-stock product at or under the limit
//   /c/<cat>/under-<n>m/      one category, only when it is a real subset (>= MIN items and fewer than the category's in-stock items)
// Counts and prices are read at build time, so a page disappears by itself when stock or prices move.
const MIN = 3;
const LIMITS = [[1000000, "1m", "۱ میلیون"], [1500000, "1500k", "۱٫۵ میلیون"], [2000000, "2m", "۲ میلیون"]];
const NOUN = { tshirt: "تیشرت", polo: "پولوشرت", shirt: "پیراهن", sweat: "هودی و دورس", pants: "شلوار", shorts: "شلوارک", shoes: "کفش اسپرت", kids: "لباس پسرانه" };

module.exports = ({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, fa }) => {
  const cheap = (a, b) => a.price - b.price || (b.sales || 0) - (a.sales || 0);
  const under = (ctx, limit, cat) => ctx.products.filter((p) => p.inStock && p.price <= limit && (cat ? p.cat === cat : p.cat !== "kids")).sort(cheap);

  const pricePages = (ctx) => {
    const out = [];
    for (const [limit, slug, label] of LIMITS) {
      const all = under(ctx, limit);
      // a limit that already covers everything (or nothing new over the smaller one) adds no page
      if (all.length >= MIN && all.length < ctx.products.filter((p) => p.inStock && p.cat !== "kids").length) out.push({ limit, slug, label, cat: null, list: all });
      for (const cat of Object.keys(NOUN)) {
        if (!ctx.CATEGORIES[cat]) continue;
        const list = under(ctx, limit, cat), total = ctx.products.filter((p) => p.inStock && p.cat === cat).length;
        if (list.length >= MIN && list.length < total) out.push({ limit, slug, label, cat, list });
      }
    }
    return out;
  };
  const pathOf = (ctx, pg) => (pg.cat ? `/c/${ctx.CATEGORIES[pg.cat].slug}/under-${pg.slug}/` : `/price/under-${pg.slug}/`);
  const h1Of = (pg) => `${pg.cat ? NOUN[pg.cat] + (pg.cat === "kids" ? "" : " مردانه") : "پوشاک مردانه"} زیر ${pg.label} تومان`;

  function pricePage(ctx, pg) {
    const { BASE, CATEGORIES } = ctx;
    const { list, cat, label } = pg;
    const h1 = h1Of(pg), path = pathOf(ctx, pg);
    const c = cat ? CATEGORIES[cat] : null;
    const items = [["/", "خانه"], ["/shop/", "فروشگاه"], ...(c ? [[`/c/${c.slug}/`, c.name]] : []), [path, h1]];
    const min = list[0].price, max = list[list.length - 1].price;
    const cats = [...new Set(list.map((p) => p.cat))].filter((k) => CATEGORIES[k]);
    const what = cat ? NOUN[cat] : "پوشاک";
    const qa = [
      [`${h1} چه مدل‌هایی دارد؟`, `${fa(list.length)} مدل ${cat ? NOUN[cat] : "لباس"} با قیمت از ${fa(min)} تا ${fa(max)} تومان${cats.length > 1 ? `؛ از دسته‌های ${cats.map((k) => CATEGORIES[k].name).join("، ")}` : ""}. فهرست با ارزان‌ترین مدل شروع می‌شود.`],
      ["قیمت‌ها نهایی است؟", "قیمت هر مدل همان است که در غرفه المارت در باسلام ثبت شده و هر چند ساعت یک‌بار به‌روز می‌شود؛ هنگام خرید، قیمت نهایی را در صفحه سفارش باسلام می‌بینید."],
      ["سایز مناسب را چطور پیدا کنم؟", "قد و وزنتان را در سایزیاب وارد کنید یا جدول اندازه همان مدل را ببینید؛ سایز هر کارت همین الان موجود بودن آن را نشان می‌دهد."],
    ];
    return layout(ctx, {
      path,
      title: `${h1} | ${fa(list.length)} مدل از ${fa(min)} تومان`,
      desc: `${fa(list.length)} مدل ${what} مردانه با قیمت ${fa(min)} تا ${fa(max)} تومان، موجود از بازار تبریز. سایز و رنگ هر مدل را ببینید و از باسلام یا سفارش مستقیم بخرید.`,
      image: `${ctx.SITE_URL}/assets/og/${list[0].id}.jpg`,
      schema: [crumbSchema(ctx, items), itemList(ctx, list), faqSchema(qa)],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>${h1}</h1><p>${fa(list.length)} مدل موجود؛ قیمت از <b class="num">${fa(min)}</b> تا <b class="num">${fa(max)}</b> تومان. ارزان‌ترین‌ها اول آمده‌اند.</p></header>
<section class="sec-sm" style="padding-top:8px"><div class="wrap"><div class="grid">${list.map((p, k) => card(ctx, p, k < 2)).join("")}</div></div></section>
<section class="sec-sm bg-cream"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
<section class="sec-sm"><div class="wrap"><p class="note-sm">${c ? `<a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a> · ` : ""}<a class="link" href="${BASE}/shop/">فروشگاه</a> · <a class="link" href="${BASE}/size-guide/">سایزیاب</a>${cats.length > 1 ? " · " + cats.map((k) => `<a class="link" href="${BASE}/c/${CATEGORIES[k].slug}/">${CATEGORIES[k].name}</a>`).join(" · ") : ""}</p></div></section>`,
    });
  }

  const priceLinks = (ctx, cat) => {
    const pg = pricePages(ctx).filter((x) => (x.cat || null) === (cat || null));
    return pg.length ? `<p class="note-sm">بر اساس بودجه: ${pg.map((x) => `<a class="link" href="${ctx.BASE}${pathOf(ctx, x)}">${h1Of(x)}</a>`).join(" · ")}</p>` : "";
  };

  return { pricePages, pricePage, pricePath: pathOf, priceTitle: h1Of, priceLinks, priceImages: (ctx, pg) => [`${ctx.SITE_URL}/assets/p/${pg.list[0].id}-960.webp`] };
};

// Page templates for the ELLMARRT static site.
const { CAT } = require("./copy");
const { measures } = require("./measures");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fa = (n) => Number(n).toLocaleString("fa-IR");
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

const STORE = {
  name: "المارت",
  latin: "ELLMARRT",
  full: "تولیدی و پخش پوشاک مردانه المارت",
  city: "تبریز",
  region: "آذربایجان شرقی",
  bazaar: "بازار بزرگ (سرپوشیده) تبریز",
  instagram: "https://instagram.com/ellmarrt",
  igHandle: "ellmarrt",
  igDm: "https://ig.me/m/ellmarrt",
  basalam: "https://basalam.com/piraysh",
  rubika: "https://rubika.ir/ellmarrt",
  rubikaOrder: "https://rubika.ir/aliegbal",
  phones: ["09228167268", "09935291942"],
  address: "تبریز، بازار سرپوشیده، راسته بازار، روبروی بانک سپه",
  years: 60,
};

// ---- editable site settings (admin panel -> data/overrides.json) ----
const { overrides: OVR } = require("./overrides");
const SITE = OVR.site || {};
{
  const C0 = SITE.contact || {};
  if (Array.isArray(C0.phones) && C0.phones.filter(Boolean).length) STORE.phones = C0.phones.filter(Boolean).map((x) => String(x).replace(/\D/g, ""));
  if (C0.address) STORE.address = C0.address;
  if (C0.igHandle) { STORE.igHandle = C0.igHandle.replace(/^@/, ""); STORE.instagram = "https://instagram.com/" + STORE.igHandle; STORE.igDm = "https://ig.me/m/" + STORE.igHandle; }
  if (C0.rubika) STORE.rubika = C0.rubika;
  if (C0.rubikaOrder) STORE.rubikaOrder = C0.rubikaOrder;
  if (SITE.years) STORE.years = +SITE.years || STORE.years;
}
const hero = (k, d) => (SITE.hero && SITE.hero[k]) || d;
const promoOn = () => SITE.promo && SITE.promo.active && SITE.promo.code;

const fa0 = (s) => String(s).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]).replace(/([۰-۹])\.(?=[۰-۹])/g, "$1٫");
// which categories complete an outfit with each category ("با این ست کنید" on product pages)
const PAIRS = { tshirt: ["pants", "shorts"], polo: ["pants", "shorts"], shirt: ["pants", "shorts"], sweat: ["pants"], pants: ["tshirt", "polo", "sweat"], shorts: ["tshirt", "polo", "shirt"], shoes: ["pants", "shorts"], kids: [] };
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.6 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 14-14 4 4L7 21z"/><path d="m7 9 2 2M10 6l2 2M13 13l2 2M4 14l2 2"/></svg>',
  arch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V11c0-4 3.5-6.5 8-8 4.5 1.5 8 4 8 8v10"/><path d="M8 21v-7c0-2 1.8-3.4 4-4.2 2.2.8 4 2.2 4 4.2v7"/></svg>',
  thread: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 3h10M7 21h10M8 3v18M16 3v18"/><path d="M8 8c3 1 5 1 8 0M8 13c3 1 5 1 8 0" stroke-dasharray="2 2"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9 5.5 4h13L20 9M4 9h16v11H4zM4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
};


/* ---------------- size claims ---------------- */
// «تا {MAX}» / «تا {MAX:pants}» in copy becomes the largest size in stock at build time, so the
// Basalam sync can never leave a "up to 6XL" claim that the shelf no longer backs up.
const LETTER = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const maxSizes = new WeakMap();
function sizeMax(ctx) {
  if (!maxSizes.has(ctx)) {
    const top = (list) => list.flatMap((p) => p.variants.filter((v) => v.stock > 0).map((v) => v.size)).filter((s) => LETTER.includes(s)).sort((a, b) => LETTER.indexOf(b) - LETTER.indexOf(a))[0];
    const listed = (list) => list.flatMap((p) => p.sizes).filter((s) => LETTER.includes(s)).sort((a, b) => LETTER.indexOf(b) - LETTER.indexOf(a))[0];
    const live = ctx.products.filter((p) => p.inStock);
    const m = { "": top(live) || listed(ctx.products) || "6XL" };
    for (const k of Object.keys(ctx.CATEGORIES)) m[k] = top(live.filter((p) => p.cat === k)) || listed(ctx.products.filter((p) => p.cat === k)) || m[""];
    maxSizes.set(ctx, m);
  }
  return maxSizes.get(ctx);
}
const fillSizes = (ctx, html) => html.replace(/\{MAX(?::(\w+))?\}/g, (_, k) => sizeMax(ctx)[k || ""]).split("{YEARS}").join(fa(STORE.years));

/* ---------------- layout ---------------- */
function layout(ctx, o) {
  const { SITE_URL, BASE, VERSION } = ctx;
  const url = SITE_URL + o.path;
  const title = o.title.includes(STORE.name) ? o.title : `${o.title} | ${STORE.name}`;
  const image = o.image || `${SITE_URL}/assets/og/site.jpg`;
  const navLinks = [
    ["/shop/", "فروشگاه"],
    ["/c/tshirt/", "تیشرت"],
    ["/c/pants/", "شلوار"],
    ["/c/sweatshirt/", "هودی و دورس"],
    ["/big-size/", "سایز بزرگ"],
    ["/size-guide/", "سایزیاب"],
    ["/about/", "داستان ما"],
    ["/contact/", "تماس"],
  ];
  const topItems = [
    ...(promoOn() ? [`کد تخفیف ${SITE.promo.code}${SITE.promo.text ? " — " + SITE.promo.text : ""}`] : []),
    ...((SITE.announcements || []).filter(Boolean).length
      ? SITE.announcements.filter(Boolean)
      : ["ارسال از روز اول کاری به کل ایران", `${fa(STORE.years)} سال سابقه در ${STORE.bazaar}`, "سایزبندی واقعی تا {MAX} · ضمانت باسلام"]),
  ].slice(0, 3);
  return fillSizes(ctx, `<!doctype html>
<html lang="fa" dir="rtl" data-base="${BASE}">
<head>
<meta charset="utf-8">
${o.path === "/" ? '<meta name="enamad" content="25394575"/>' : ""}
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${url}">
${o.noindex ? '<meta name="robots" content="noindex">' : `<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="alternate" hreflang="fa-IR" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">`}
<link rel="alternate" type="text/plain" href="${SITE_URL}/llms.txt" title="LLM Context — ELLMARRT">
<link rel="alternate" type="application/rss+xml" href="${SITE_URL}/feed.xml" title="${STORE.name} — محصولات و راهنماهای خرید">
<meta name="theme-color" content="#1D4ED8">
<meta name="google-site-verification" content="uXxAD7CF1q8Fo0xZpy1_uE84WzXJWtndZYkGuYqUT9A">
<meta name="msvalidate.01" content="E832DBD41A08E553E3013637AB159DEE">
<meta property="og:type" content="${o.ogType || "website"}">
<meta property="og:site_name" content="${STORE.name} | ${STORE.latin}">
<meta property="og:locale" content="fa_IR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${image}">
${o.extraHead || ""}
<link rel="icon" href="${BASE}/assets/img/mark.svg" type="image/svg+xml">
<link rel="icon" href="${BASE}/favicon.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="${BASE}/assets/img/apple-touch-icon.png">
<link rel="manifest" href="${BASE}/manifest.webmanifest">
${SITE.analytics && SITE.analytics.goatcounter ? `<script data-goatcounter="https://${esc(SITE.analytics.goatcounter)}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>` : ""}
<link rel="preload" href="${BASE}/assets/fonts/Vazirmatn-wght.woff2" as="font" type="font/woff2" crossorigin>
${o.preload ? `<link rel="preload" as="image" href="${o.preload}"${o.preloadSet ? ` imagesrcset="${o.preloadSet}" imagesizes="${o.preloadSizes}"` : ""} fetchpriority="high">` : ""}
<script>document.documentElement.classList.add("js");try{if(localStorage.getItem("elm-theme")==="shab")document.documentElement.setAttribute("data-theme","shab")}catch(e){}</script>
<link rel="stylesheet" href="${BASE}/assets/css/site.css?v=${VERSION}">
${(o.schema || []).map((s) => `<script type="application/ld+json">${json(s)}</script>`).join("\n")}
</head>
<body${o.bodyClass ? ` class="${o.bodyClass}"` : ""}>
<a class="skip" href="#main">رفتن به محتوای اصلی</a>
<div class="topbar" aria-label="مزایای خرید"><div class="wrap topbar-in">${topItems.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>
<header class="hdr">
  <div class="wrap hdr-in">
    <button type="button" class="ibtn menu-btn" aria-label="منو">${I.menu}</button>
    <a class="brand" href="${BASE}/" aria-label="${STORE.name} — صفحه اصلی"><span class="brand-emblem"><img src="${BASE}/assets/img/mark.svg" alt="" width="38" height="38" decoding="async"></span><span class="brand-lockup"><span class="brand-fa"><b>${STORE.name}</b><i class="brand-dot" aria-hidden="true"></i></span><small class="brand-en">ELLMARRT <span>·</span> TABRIZ</small></span></a>
    <nav class="nav" aria-label="منوی اصلی"><div class="nav-h"><span class="nav-brand"><span class="brand-emblem"><img src="${BASE}/assets/img/mark.svg" alt="" width="34" height="34" loading="lazy" decoding="async"></span><span class="brand-lockup"><span class="brand-fa"><b>${STORE.name}</b><i class="brand-dot" aria-hidden="true"></i></span><small class="brand-en">ELLMARRT <span>·</span> TABRIZ</small></span></span><button type="button" class="ibtn nav-x" aria-label="بستن منو">✕</button></div>${navLinks.map(([h, t]) => `<a href="${BASE}${h}"${o.path === h ? ' aria-current="page"' : ""}>${t}</a>`).join("")}<button type="button" class="nav-theme theme-tg" data-theme-toggle aria-pressed="false">${I.moon}${I.sun}<span>حالت شب</span></button></nav>
    <form class="hdr-search" action="${BASE}/shop/" role="search">${I.search}<input name="q" type="search" placeholder="جستجو در المارت…" aria-label="جستجو در محصولات"></form>
    <div class="hdr-act">
      <button type="button" class="ibtn theme-tg d-only" id="theme-toggle" data-theme-toggle aria-label="حالت شب" aria-pressed="false">${I.moon}${I.sun}</button>
      <a class="ibtn hdr-search-ico" href="${BASE}/shop/#q" aria-label="جستجو">${I.search}</a>
      <button type="button" class="ibtn open-favs d-only" aria-label="علاقه‌مندی‌ها">${I.heart}<span class="badge fav-count"></span></button>
      <a class="ibtn hdr-store d-only" href="${STORE.basalam}" rel="noopener" target="_blank" aria-label="غرفه المارت در باسلام">${I.bag}</a>
    </div>
  </div>
</header>
<div class="scrim"></div>
<main id="main">
${o.body}
</main>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-trust">
      <span>${I.shield} پرداخت امن با ضمانت باسلام</span>
      <span>${I.arch} ${fa(STORE.years)} سال حضور در بازار سرپوشیده تبریز</span>
      <span>${I.truck} ارسال از روز اول کاری به سراسر ایران</span>
      <span>${I.camera} کد تأیید دامنه اینماد · ۲۵۳۹۴۵۷۵</span>
    </div>
    <div class="ftr-g">
      <div>
        <div class="ftr-brand"><img src="${BASE}/assets/img/mark-light.svg" alt="${STORE.latin} — ${STORE.name}" width="48" height="48" loading="lazy" decoding="async"><div><span class="brand-fa"><b>${STORE.name}</b><i class="brand-dot" aria-hidden="true"></i></span><small class="brand-en">ELLMARRT <span>·</span> EST. TABRIZ</small></div></div>
        <p>${SITE.footer && SITE.footer.blurb ? esc(SITE.footer.blurb) : `${STORE.full}؛ بیش از ${fa(STORE.years)} سال فعالیت در ${STORE.bazaar}.`} پوشاک روزمره مردانه با پارچه انتخابی، قیمت بازار و سایزبندی واقعی تا {MAX}.</p>
        <div class="social"><a href="${STORE.instagram}" target="_blank" rel="noopener" aria-label="اینستاگرام المارت">${I.ig}</a><a href="${STORE.basalam}" target="_blank" rel="noopener" aria-label="غرفه باسلام">${I.store}</a><a href="${STORE.rubika}" target="_blank" rel="noopener" aria-label="کانال روبیکا">${I.share}</a></div>
      </div>
      <div><h2>فروشگاه</h2><ul>${Object.values(ctx.CATEGORIES).map((c) => `<li><a href="${BASE}/c/${c.slug}/">${c.name}</a></li>`).join("")}${col.colorPages(ctx).sort((x, y) => y.list.length - x.list.length).slice(0, 2).map((x) => `<li><a href="${BASE}${col.colorPath(ctx, x.cat, x.g)}">${col.colorTitle(x.cat, x.g)}</a></li>`).join("")}${price.pricePages(ctx).filter((x) => !x.cat).slice(0, 1).map((x) => `<li><a href="${BASE}${price.pricePath(ctx, x)}">${price.priceTitle(x)}</a></li>`).join("")}</ul></div>
      <div><h2>راهنما</h2><ul><li><a href="${BASE}/size-guide/">سایزیاب و جدول سایز</a></li><li><a href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a></li><li><a href="${BASE}/guide/">راهنمای خرید</a></li><li><a href="${BASE}/faq/">سوالات متداول</a></li><li><a href="${BASE}/shipping-returns/">ارسال و مرجوعی</a></li><li><a href="${BASE}/terms/">قوانین و مقررات</a></li><li><a href="${BASE}/privacy/">حریم خصوصی</a></li><li><a href="${BASE}/contact/">تماس با ما</a></li></ul></div>
      <div><h2>المارت</h2><ul><li><a href="${BASE}/about/">داستان ما</a></li><li><a href="${BASE}/tabriz-bazaar/">حجره بازار تبریز</a></li><li><a href="${BASE}/wholesale/">خرید عمده</a></li><li><a href="${STORE.instagram}" target="_blank" rel="noopener">اینستاگرام <bdi dir="ltr" class="handle">@${STORE.igHandle}</bdi></a></li><li><a href="${STORE.basalam}" target="_blank" rel="noopener">غرفه در باسلام</a></li><li><a href="${STORE.rubika}" target="_blank" rel="noopener">کانال روبیکا</a></li>${STORE.phones.map((p)=>`<li><a href="tel:${p}" class="num">${fa0(p)}</a></li>`).join("")}<li>${STORE.address}</li></ul></div>
    </div>
    <div class="ftr-wordmark" aria-hidden="true">ELLMARRT</div>
    <div class="ftr-b"><span>© ${new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())} ${STORE.latin} — ${STORE.name}. همه حقوق محفوظ است.</span><span>بازار سرپوشیده تبریز · راسته بازار</span></div>
  </div>
</footer>
<nav class="bnav" aria-label="ناوبری سریع">
<a href="${BASE}/"${o.path==="/"?" aria-current=\"page\"":""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg><span>خانه</span></a>
<a href="${BASE}/shop/"${o.path==="/shop/"?" aria-current=\"page\"":""}>${I.bag}<span>فروشگاه</span></a>
<a href="${BASE}/size-guide/"${o.path==="/size-guide/"?" aria-current=\"page\"":""}>${I.ruler}<span>سایزیاب</span></a>
<button class="open-favs">${I.heart}<span>علاقه‌مندی</span><i class="badge fav-count"></i></button>
<a href="${BASE}/contact/"${o.path==="/contact/"?" aria-current=\"page\"":""}>${I.phone}<span>تماس</span></a>
</nav>
<a class="fab" href="tel:${STORE.phones[0]}" aria-label="تماس برای سفارش">${I.phone}<span>سفارش تلفنی</span></a>
<aside class="drawer" aria-label="علاقه‌مندی‌ها"><div class="drawer-h"><b>علاقه‌مندی‌های شما</b><button class="ibtn drawer-x" aria-label="بستن">✕</button></div><div class="drawer-b"></div></aside>
<div class="lb" role="dialog" aria-label="نمایش بزرگ تصویر"><button class="lb-x" aria-label="بستن">✕</button><button class="lb-n lb-prev" aria-label="قبلی">›</button><img alt="" width="960" height="1200" loading="lazy" decoding="async" style="width:auto;height:auto"><button class="lb-n lb-next" aria-label="بعدی">‹</button></div>
<div class="modal" id="order-modal" role="dialog" aria-modal="true" aria-labelledby="om-t"><div class="modal-c"><button class="ibtn modal-x" aria-label="بستن">✕</button>
<h2 id="om-t">سفارش مستقیم از المارت</h2><p class="om-p"></p>
<div class="om-code"><span>کد پیگیری سفارش شما</span><b class="num" id="om-code"></b><small>این کد را هنگام تماس یا در پیام بگویید.</small></div>
<div class="om-act"><a class="btn btn-ink btn-block" id="om-sms" href="#">ارسال پیامک سفارش</a>${STORE.phones.map((p,i)=>`<a class="btn btn-ghost btn-block om-call" href="tel:${p}">${I.phone} تماس: <span class="num">${fa0(p)}</span></a>`).join("")}<a class="btn btn-ghost btn-block" href="${STORE.rubikaOrder}" target="_blank" rel="noopener">پیام در روبیکا (<bdi dir="ltr" class="handle">@aliegbal</bdi>)</a></div></div></div>
<script>window.__STORE__=${json({phones:STORE.phones})}</script>
<script src="${BASE}/assets/js/site.js?v=${VERSION}" defer></script>
</body>
</html>`);
}

/* ---------------- shared pieces ---------------- */
const HEX = { "مشکی": "#151515", "سفید": "#f7f7f5", "کرمی": "#eadfc8", "کله‌غازی": "#21566a", "استخوانی": "#ece6d8", "نسکافه‌ای": "#7a5a43", "هوایی": "#a9cbe6", "یشمی": "#8fa697", "شکلاتی": "#4a2f22", "طوسی": "#9a9a9a", "طوسی تیره": "#4b4b4f", "طوسی روشن": "#c9c9c9", "پرتقالی": "#f07a1f", "زرد": "#e1b43a", "قرمز": "#c23a35", "مشکی ساده": "#151515", "مشکی طرح لوزی": "#2a2a2a", "سبز": "#2f6b45", "سرمه‌ای": "#1f2a4d", "نارنجی": "#c8642d", "آبی": "#1f5fc4", "پسته‌ای": "#bcd49a", "قهوه‌ای": "#6b4a33", "زرشکی": "#6e1f2c", "مشکی سفید": "linear-gradient(90deg,#151515 50%,#f7f7f5 50%)", "سبز ساقه‌ای": "#6f7d3c", "سفید مشکی": "linear-gradient(90deg,#f7f7f5 50%,#151515 50%)", "زیتونی": "#6b6b3a", "زغالی": "#3a3a3c", "سبز ساقه ای": "#6f7d3c", "آبی تیره": "#1b3a73", "آبی روشن": "#7fb0e0", "زیتونی دودی": "#5c6452", "خاکستری گرافیتی": "#4a4d52", "خاکستری گرافیت": "#4a4d52", "سرمه ای نیمه شب": "#16203a", "بژ شنی": "#d8c8ae", "آبی سیج": "#6d8896" };
const dotsHtml = (ctx, p) => {
  const sw = p.colors.map((c, i) => ({ c, i })).filter((x) => p.colorInStock.includes(x.i));
  if (sw.length <= 1) return "";
  return `<div class="dots" aria-label="رنگ‌های موجود">${sw.slice(0, 5).map(({ c, i }) => {
    const hasImg = (p.colorImages || []).includes(i);
    const active = i === p.mainColor ? " on" : "";
    return hasImg
      ? `<button type="button" class="dot${active}" data-sw-img="${ctx.BASE}/assets/p/${p.id}-k${i}-480.webp" data-sw-srcset="${ctx.BASE}/assets/p/${p.id}-k${i}-480.webp 480w, ${ctx.BASE}/assets/p/${p.id}-k${i}-960.webp 960w" aria-label="نمایش رنگ ${esc(c)}" title="${esc(c)}" style="background:${HEX[c] || "#bbb"}"></button>`
      : `<i class="dot" title="${esc(c)}" style="background:${HEX[c] || "#bbb"}"></i>`;
  }).join("")}${sw.length > 5 ? `<small>+${sw.length - 5}</small>` : ""}</div>`;
};
const stars = (n) => `<span class="rstars" aria-label="${n} از ۵">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= Math.round(n) ? "on" : ""}">★</i>`).join("")}</span>`;
const faDate = (d) => { try { return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long" }).format(new Date(d)); } catch { return ""; } };
const reviewCard = (ctx, r, withProduct) => { const p = withProduct && ctx.products.find((x) => x.id === r.productId); return `<figure class="rv-card rv"><div class="rv-top">${stars(r.star)}<span class="rv-date">${faDate(r.date)}</span></div><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name || "خریدار باسلام")}</b><span>خرید تأییدشده در باسلام${p ? ` · <a href="${pUrl(ctx, p)}">${esc(short(p))}</a>` : ""}</span></figcaption></figure>`; };
// products without their own reviews: show the store's best written reviews (same category first).
// No aggregateRating here: store-level reviews must not be marked up as this product's rating.
const storeReviewsBlock = (ctx, p) => {
  const RV = ctx.storeReviews; if (!RV || !RV.count) return "";
  const catOf = (r) => (ctx.products.find((x) => x.id === r.productId) || {}).cat;
  const picks = RV.reviews.filter((r) => r.text && r.text.length >= 15 && r.star >= 4 && r.productId !== p.id)
    .sort((a, b) => (catOf(b) === p.cat) - (catOf(a) === p.cat) || b.star - a.star || b.text.length - a.text.length).slice(0, 3);
  if (!picks.length) return "";
  return `<section class="sec-sm" id="reviews"><div class="wrap"><div class="sec-head"><div><span class="kicker">نظر خریداران غرفه</span><h2>${fa(RV.average)} از ۵ <small class="h-sub">از ${fa(RV.count)} امتیاز خریداران المارت در باسلام</small></h2></div><a class="link" href="${STORE.basalam}" target="_blank" rel="noopener">همه نظرها در باسلام</a></div><div class="rv-grid">${picks.map((r) => reviewCard(ctx, r, true)).join("")}</div></div></section>`;
};
// the booth rating exactly as Basalam reports it; empty when the sync has no reviews
const storeRating = (ctx, href) => { const RV = ctx.storeReviews; return RV && RV.count ? `<a class="srating" href="${href}">${stars(RV.average)}<b class="num">${fa(RV.average)}</b><span>از ${fa(RV.count)} امتیاز خریداران در باسلام</span></a>` : ""; };
const catOf = (ctx, p) => ctx.CATEGORIES[p.cat];
const guideFor = (p) => guides.find((g) => g.cats.includes(p.cat));
const short = (p) => p.title.split(" | ")[0];
const mainBase = (p) => (p.mainColor != null ? `${p.id}-k${p.mainColor}` : `${p.id}`);
const pUrl = (ctx, p) => `${ctx.BASE}/p/${p.id}/`;
// Curated real unretouched booth/flatlay/macro index per product so "عکس واقعی" & editorial slots show honest product photography rather than collages
const REAL_IDX = { 50436324: 1, 49701761: 1, 53765502: 2, 47475290: 1, 68137613: 0, 65852930: 2, 60937967: 2, 42724724: 0, 43999644: 0, 36616537: 0, 53614296: 1, 46295449: 1, 45029484: 1, 43994736: 1, 44438413: 1, 50425812: 2 };
const realPick = (p) => {
  const gs = (p && p.images && p.images.gallery) || [];
  if (!gs.length) return null;
  const idx = REAL_IDX[p.id];
  return (idx != null && gs[idx]) || gs[1] || gs[0];
};
// sizes a shopper can buy right now, in the listed order (sold-out products keep their listed sizes)
const liveSizes = (p) => { if (!p.inStock) return p.sizes; const ok = new Set(p.variants.filter((v) => v.stock > 0).map((v) => v.size)); return p.sizes.filter((z) => ok.has(z)); };
// long size runs keep the smallest and the three largest, so 6XL is never cut off a card
const cardSizes = (z) => (z.length > 5 ? [z[0], "…", ...z.slice(-3)] : z);
const isBig = (p) => liveSizes(p).some((s) => ["4XL", "5XL", "6XL"].includes(s));
const tagFor = (p) => {
  if (!p.inStock) return ["ناموجود", "tag-ink"];
  if (p.sales >= 10) return ["پرفروش", "tag-gold"];
  if (isBig(p)) return ["سایز بزرگ", "tag-brick"];
  if (Date.now() - new Date(p.created).getTime() < 1000 * 60 * 60 * 24 * 60) return ["جدید", ""];
  return null;
};
function cardData(ctx, p) {
  const t = tagFor(p);
  const rp = realPick(p);
  const realUrl = rp ? `${ctx.BASE}/assets/p/${rp.file}` : null;
  return {
    id: p.id, t: short(p), c: p.cat, cn: catOf(ctx, p).name, p: p.price, s: liveSizes(p), st: p.inStock, sales: p.sales, d: p.created, k: p.keyword,
    msr: !!measures(p),
    url: pUrl(ctx, p), img: `${ctx.BASE}/assets/p/${mainBase(p)}-480.webp`,
    real: realUrl,
    alt: realUrl ? null : (() => { const o = p.colorImages.find((i) => i !== p.mainColor && p.colorInStock.includes(i)); return o != null ? `${ctx.BASE}/assets/p/${p.id}-k${o}-480.webp` : null; })(),
    tag: t && t[0], tagc: t && t[1], dots: dotsHtml(ctx, p), rate: p.rating && p.rating.avg ? fa0(p.rating.avg) : "",
  };
}
function card(ctx, p, eager = false) {
  const d = cardData(ctx, p);
  return `<article class="card rv${d.st ? "" : " out"}">
<div class="card-media"><img src="${d.img}" srcset="${d.img} 480w, ${d.img.replace(/-480\.webp$/, '-960.webp')} 960w" sizes="(max-width:600px) 50vw, 25vw" alt="${esc(p.title)}" width="480" height="600" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${!d.real && d.alt ? `<img class="alt" src="${d.alt}" srcset="${d.alt} 480w, ${d.alt.replace(/-480\.webp$/, '-960.webp')} 960w" sizes="(max-width:600px) 50vw, 25vw" alt="${esc(`${p.title} — نمای دوم`.slice(0, 120))}" width="480" height="600" loading="lazy" decoding="async">` : ""}
<div class="card-tags">${d.tag ? `<span class="tag ${d.tagc}">${d.tag}</span>` : ""}</div>
<button type="button" class="fav" data-id="${p.id}" aria-label="افزودن ${esc(p.title)} به علاقه‌مندی‌ها">${I.heart}</button>${d.real ? `<button type="button" class="real-tg" data-real="${d.real}" aria-pressed="false" aria-label="${esc(`نمایش عکس واقعی ${short(p)}`)}">${I.camera}<span>عکس واقعی</span></button>` : ""}</div>
<div class="card-body"><div class="card-top"><span class="card-cat">${d.cn}${d.msr ? " · جدول سایز دارد" : ""}</span>${d.rate ? `<span class="card-rate num"><i>★</i>${d.rate}</span>` : ""}</div><h3 class="card-title"><a href="${d.url}">${esc(short(p))}</a></h3>
<div class="price"><b class="num">${fa(p.price)}</b><small>تومان</small><span class="card-cta" aria-hidden="true">مشاهده ←</span></div>${d.dots}<div class="card-sizes">${cardSizes(liveSizes(p)).map((s) => s === "…" ? `<i>…</i>` : `<span>${s}</span>`).join("")}</div></div></article>`;
}
const crumbs = (ctx, items) => `<nav class="crumbs wrap" aria-label="مسیر"><ol>${items.map(([h, t], i) => `<li>${i < items.length - 1 ? `<a href="${ctx.BASE}${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join("")}</ol></nav>`;
const crumbSchema = (ctx, items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([h, t], i) => ({ "@type": "ListItem", position: i + 1, name: t, item: ctx.SITE_URL + h })),
});
const orgSchema = (ctx) => ({
  "@context": "https://schema.org", "@type": ["ClothingStore", "LocalBusiness"], "@id": `${ctx.SITE_URL}/#store`,
  name: `${STORE.name} (${STORE.latin})`, alternateName: [STORE.latin, STORE.full, "ال‌مارت", "ال مارت", "ELLMART", "پیرایش"],
  url: `${ctx.SITE_URL}/`, logo: `${ctx.SITE_URL}/assets/img/icon-512.png`, image: [`${ctx.SITE_URL}/assets/og/site.jpg`, `${ctx.SITE_URL}/assets/og/hojreh.jpg`],
  description: `فروشگاه پوشاک مردانه ${STORE.name} از ${STORE.bazaar}؛ تیشرت، شلوار اسلش، هودی و لباس سایز بزرگ مردانه تا {MAX}.`,
  disambiguatingDescription: `فروشگاه و تولیدی پوشاک مردانه المارت (ellmarrt.ir) در بازار سرپوشیده تبریز با {YEARS} سال سابقه؛ مستقل از فروشگاه‌های همنام در سایر شهرها.`,
  address: { "@type": "PostalAddress", streetAddress: STORE.address, addressLocality: STORE.city, addressRegion: STORE.region, addressCountry: "IR" },
  geo: { "@type": "GeoCoordinates", latitude: 38.0805, longitude: 46.294 },
  hasMap: "https://www.google.com/maps/search/?api=1&query=38.0805,46.2940",
  areaServed: { "@type": "Country", name: "Iran" }, currenciesAccepted: "IRR", priceRange: "$$",
  foundingDate: String(new Date().getFullYear() - STORE.years),
  knowsAbout: ["پوشاک مردانه", "لباس سایز بزرگ مردانه تا {MAX}", "شلوار اسلش مردانه", "تیشرت نخ پنبه مردانه", "هودی و دورس مردانه", "بازار سرپوشیده تبریز", "پخش عمده پوشاک مردانه"],
  identifier: { "@type": "PropertyValue", name: "کد تأیید دامنه اینماد", value: "25394575" },
  sameAs: [STORE.instagram, STORE.basalam, STORE.rubika],
  telephone: "+98" + STORE.phones[0].slice(1),
  contactPoint: STORE.phones.map((p) => ({ "@type": "ContactPoint", telephone: "+98" + p.slice(1), contactType: "sales", areaServed: "IR", availableLanguage: ["fa", "az"] })),
  ...(ctx.storeReviews && ctx.storeReviews.count ? { aggregateRating: { "@type": "AggregateRating", ratingValue: ctx.storeReviews.average, ratingCount: ctx.storeReviews.count, bestRating: 5, worstRating: 1 } } : {}),
});
const faqSchema = (qa) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });

const sizer = (title = "سایزیاب هوشمند المارت") => `<div class="sizer" aria-label="${title}">
<div class="sizer-row"><div><label for="sz-h">قد <small>(سانتی‌متر)</small></label><div class="field"><input id="sz-h" name="h" type="number" inputmode="numeric" min="140" max="215" placeholder="مثلاً ۱۷۸"></div></div>
<div><label for="sz-w">وزن <small>(کیلوگرم)</small></label><div class="field"><input id="sz-w" name="w" type="number" inputmode="numeric" min="40" max="190" placeholder="مثلاً ۹۵"></div></div></div>
<label>مدل تن‌خور دلخواه:</label>
<div class="seg" role="group"><button type="button" data-fit="slim" aria-pressed="false">جذب</button><button type="button" data-fit="regular" aria-pressed="true">معمولی</button><button type="button" data-fit="loose" aria-pressed="false">آزاد / اورسایز</button></div>
<div class="sizer-presets" role="group" aria-label="نمونه وزن‌های پرکاربرد"><button type="button" data-preset-h="175" data-preset-w="75">۷۵ کیلو (L–XL)</button><button type="button" data-preset-h="178" data-preset-w="95">۹۵ کیلو (2XL)</button><button type="button" data-preset-h="182" data-preset-w="112">۱۱۰+ کیلو (4XL)</button><button type="button" data-preset-h="185" data-preset-w="130">۱۳۰ کیلو (5XL)</button></div>
<div class="sizer-out" aria-live="polite"></div></div>`;

const HOME_FAQ_DEFAULT = [
  ["خرید از المارت چطور انجام می‌شود؟", "مدل مورد نظر را در سایت انتخاب کنید و روی «خرید امن از باسلام» بزنید. در صفحه باسلام سایز و رنگ را دوباره انتخاب و قیمت و موجودی نهایی را بررسی کنید؛ سفارش و پرداخت در باسلام انجام می‌شود."],
  ["ارسال چقدر طول می‌کشد؟", "سفارش‌ها از روز اول کاری بعد از ثبت، با پست پیشتاز یا سفارشی به سراسر ایران ارسال می‌شوند. برای تبریز ارسال با پیک موتوری هم امکان‌پذیر است."],
  ["سایز مناسب خودم را چطور پیدا کنم؟", "از سایزیاب المارت استفاده کنید: قد و وزن خود را وارد کنید تا سایز پیشنهادی را ببینید. همچنین در صفحه هر محصول اندازه‌های واقعی آن آمده است و می‌توانید قبل از خرید در اینستاگرام از ما بپرسید."],
  ["آیا لباس سایز بزرگ دارید؟", "بله. بخش بزرگی از محصولات المارت در سایزهای بزرگ دوخته می‌شوند؛ تیشرت تا {MAX:tshirt} و شلوار تا {MAX:pants}. صفحه «سایز بزرگ» همه این محصولات را یک‌جا نشان می‌دهد."],
  ["عکس محصولات واقعی است؟", "بعضی تصاویر اصلی بازسازی استودیویی هستند. عکس‌های واقعی غرفه را نیز در صفحه محصول ببینید؛ رنگ ممکن است بسته به نور و نمایشگر متفاوت دیده شود."],
];

const HOME_FAQ = (SITE.faq || []).filter((x) => x && x[0] && x[1]).length ? SITE.faq.filter((x) => x && x[0] && x[1]) : HOME_FAQ_DEFAULT;

/* ---------------- pages ---------------- */
function home(ctx) {
  const { products: P, CATEGORIES: C, BASE } = ctx;
  const syncedLabel = ctx.syncedAt ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tehran" }).format(new Date(ctx.syncedAt)) : "";
  const pNow = +String(new Intl.DateTimeFormat("en-u-ca-persian", { year: "numeric" }).format(new Date())).replace(/\D/g, "") || 1405;
  const startYear = fa0(pNow - STORE.years);
  const cold = [8, 9, 10, 11, 0, 1].includes(new Date().getMonth());
  const COLD_GUIDE_SLUGS = ["yalda-outfit-men", "winter-outfit-men", "big-size-winter-men"];
  const homeGuides = (cold
    ? [...COLD_GUIDE_SLUGS.map((s) => guides.find((g) => g.slug === s)).filter(Boolean), ...guides.filter((g) => !COLD_GUIDE_SLUGS.includes(g.slug))]
    : guides).slice(0, 3);
  const WINTER_PICKS = [60937967, 63645940, 62560754, 64343889];
  const winterExtra = P.filter((p) => p.cat === "sweat" && p.inStock && !WINTER_PICKS.includes(p.id)).sort((a, b) => (b.featured - a.featured) || (b.sales - a.sales));
  const winterGrid = cold ? [...WINTER_PICKS.map((id) => P.find((p) => p.id === id && p.inStock)).filter(Boolean), ...winterExtra].slice(0, 4) : [];
  const usedWinter = new Set(winterGrid);
  const best = [...P].filter((p) => p.inStock && !usedWinter.has(p)).sort((a, b) => (b.featured - a.featured) || (b.sales - a.sales)).slice(0, 8);
  const fresh = [...P].filter((p) => p.inStock && !best.includes(p) && !usedWinter.has(p)).sort((a, b) => b.created.localeCompare(a.created)).slice(0, 4);
  const big = P.filter((p) => isBig(p) && p.inStock).slice(0, 4);

  const CAT_PICK = { tshirt: 46295449, polo: 53765502, shirt: 47475290, sweat: 60937967, pants: 54126455, shorts: 42724724, shoes: 43999644, kids: 36616537 };
  const cats = Object.entries(C).map(([k, c]) => {
    const list = P.filter((p) => p.cat === k);
    if (!list.length) return null;
    const minP = Math.min(...list.map((p) => p.price));
    const pick = P.find((p) => p.id === CAT_PICK[k]) || list[0];
    return { k, c, n: list.length, minP, imgBase: mainBase(pick) };
  }).filter(Boolean);

  const inStockCategories = Object.entries(C).filter(([key]) => P.some((p) => p.inStock && p.cat === key));
  const allColors = col.colorPages(ctx).sort((x, y) => y.list.length - x.list.length);
  const mustColors = allColors.filter((x) => (x.cat === "pants" && x.g === "طوسی") || (x.cat === "tshirt" && x.g === "کرمی"));
  const colorList = [...new Map([...allColors.slice(0, 22), ...mustColors].map((x) => [`${x.cat}:${x.g}`, x])).values()];
  const heroFloats = [43999644, 42719795].map((id) => P.find((p) => p.id === id && p.inStock)).filter(Boolean);
  if (heroFloats.length < 2) {
    for (const p of best) if (heroFloats.length < 2 && !heroFloats.includes(p)) heroFloats.push(p);
  }
  const heroPreload = `${BASE}/assets/img/hero-campaign-1600.webp`;
  const heroPreloadSet = `${BASE}/assets/img/hero-campaign-800.webp 800w, ${BASE}/assets/img/hero-campaign-1600.webp 1600w`;
  const heroPreloadSizes = "(max-width:980px) 100vw, 1320px";

  const body = `
<section class="hero-sec"><div class="wrap">
  <div class="hero-stage">
    <img class="hero-bg" src="${heroPreload}" srcset="${heroPreloadSet}" sizes="${heroPreloadSizes}" width="1600" height="1000" fetchpriority="high" decoding="async" alt="کالکشن پوشاک مردانه المارت">
    <div class="hero-copy">
      <div class="hero-meta">${ctx.syncedAt ? `<span class="live" data-synced="${esc(ctx.syncedAt)}"><i class="live-dot" aria-hidden="true"></i><span>موجودی به‌روز باسلام</span></span>` : ""}${storeRating(ctx, "#reviews")}</div>
      <h1>${esc(hero("line1", "شیک بپوش،"))} <br>${esc(hero("pre", "مثل"))} <em>${esc(hero("em", "بازاری‌ها"))}</em> ${esc(hero("post", "بخر."))}</h1>
      <p class="hero-lead">${hero("lead", "") ? esc(hero("lead", "")) : `پوشاک روزمره مردانه با پارچه نخ‌پنبه و کتان کشی اعلا، سایزبندی واقعی تا <b class="num">{MAX}</b> و ارسال از روز اول.`}</p>
      <div class="hero-cta"><a class="btn btn-accent" href="${BASE}/shop/">${esc(hero("cta1", "مشاهده و خرید"))} ${I.arrow}</a><a class="btn btn-glass" href="${BASE}/size-guide/">${esc(hero("cta2", "سایزیاب ۱۰ ثانیه‌ای"))}</a></div>
      <div class="hero-kpis d-only"><span><b class="num">{YEARS}+</b> سال بازار تبریز</span><span><b class="num">${fa(P.filter((p) => p.inStock).length)}</b> مدل آماده ارسال</span><span>تا <b class="num">{MAX}</b> واقعی</span></div>
    </div>
    ${heroFloats.length ? `<div class="hero-floats d-only">${heroFloats.map((fp) => `<a class="hero-float" href="${pUrl(ctx, fp)}"><img src="${BASE}/assets/p/${mainBase(fp)}-480.webp" width="480" height="600" loading="lazy" decoding="async" alt="${esc(short(fp))}"><div class="hero-float-in"><small>${catOf(ctx, fp).name}</small><b>${esc(short(fp))}</b><span><i class="num">${fa(fp.price)}</i> تومان ${I.arrow}</span></div></a>`).join("")}</div>` : ""}
  </div>
</div></section>

<section class="qcats-sec story-cats-sec" aria-label="دسته‌بندی‌های سریع"><div class="wrap"><div class="qcats story-cats">
  <a class="qcat qcat-all" href="${BASE}/shop/"><span class="qcat-ring"><span class="qcat-img qcat-ico">${I.bag}</span></span><span class="qcat-txt"><b>همه</b><small class="num">${fa(P.length)} مدل</small></span></a>
  ${cats.map(({ c, n, imgBase }) => `<a class="qcat" href="${BASE}/c/${c.slug}/"><span class="qcat-ring"><span class="qcat-img"><img src="${BASE}/assets/p/${imgBase}-480.webp" width="480" height="600" loading="lazy" decoding="async" alt="${esc(c.name)}"></span></span><span class="qcat-txt"><b>${c.name}</b><small class="num">${fa(n)} مدل</small></span></a>`).join("")}
  <a class="qcat qcat-big" href="${BASE}/big-size/"><span class="qcat-ring qcat-ring-coral"><span class="qcat-img qcat-ico qcat-ico-coral">${I.ruler}</span></span><span class="qcat-txt"><b>سایز بزرگ</b><small class="num">تا {MAX}</small></span></a>
</div></div></section>

<section class="sec sec-first" id="best"><div class="wrap">
  <div class="sec-head"><div><span class="kicker">پرفروش‌ترین‌های المارت</span><h2>انتخاب مشتری‌های همیشگی</h2></div><a class="link" href="${BASE}/shop/">همه (${fa(P.length)})</a></div>
  <div class="home-tabs" role="tablist" aria-label="فیلتر سریع محصولات">
    <button type="button" class="htab" role="tab" data-htab="best" aria-selected="true">پرفروش‌ها</button>
    <button type="button" class="htab" role="tab" data-htab="tops" aria-selected="false">تیشرت و پولوشرت</button>
    <button type="button" class="htab" role="tab" data-htab="pants" aria-selected="false">شلوار و اسلش</button>
    <button type="button" class="htab" role="tab" data-htab="sweat" aria-selected="false">هودی و دورس</button>
    <button type="button" class="htab" role="tab" data-htab="big" aria-selected="false">سایز بزرگ تا {MAX}</button>
    <button type="button" class="htab" role="tab" data-htab="shoes" aria-selected="false">کفش اسپرت</button>
  </div>
  <div class="grid">${best.map((p) => card(ctx, p)).join("")}</div>
</div></section>

<section class="sec-sm home-trust" aria-label="ضمانت خرید از المارت"><div class="wrap"><div class="trust">
  <div>${I.truck}<p style="margin:0"><em>ارسال روز اول</em><b>تحویل فوری به کل ایران</b><span>پست پیشتاز، سفارشی و پیک تبریز</span></p></div>
  <div>${I.shield}<p style="margin:0"><em>خرید امن باسلام</em><b>پرداخت مطمئن و بازگشت وجه</b><span>دارای نماد اعتماد دامنه ۲۵۳۹۴۵۷۵</span></p></div>
  <div>${I.ruler}<p style="margin:0"><em>تا {MAX} واقعی</em><b>الگوی استاندارد و سایزیاب دقیق</b><span>اندازه دقیق هر مدل در سانتی‌متر</span></p></div>
  <div>${I.camera}<p style="margin:0"><em>کنترل کیفیت حجره</em><b>تصاویر واقعی و دوخت مطمئن</b><span>بررسی تک‌به‌تک پیش از بسته‌بندی</span></p></div>
</div></div></section>

${winterGrid.length ? `<section class="sec lookbook-sec"><div class="wrap">
  <div class="lookbook-box rv">
    <div class="lookbook-grid">
      <div class="lookbook-poster">
        <img src="${BASE}/assets/img/campaign-winter.webp" alt="کالکشن پاییز و زمستان المارت" width="1200" height="900" loading="lazy" decoding="async">
        <div class="lookbook-copy">
          <span class="kicker">لوک‌بوک پاییز و زمستان</span>
          <h2>گرم، خوش‌فرم و مناسب هوای سرد</h2>
          <p>هودی‌های دورس سه‌نخ توکرک و سویشرت‌های تمام‌زیپ با پارچه متراکم و قواره استاندارد بازار تبریز.</p>
          <ul class="campaign-specs"><li>دورس دو نخ و سه نخ اعلا</li><li>سایزبندی تا {MAX:sweat}</li><li>ارسال فوری</li></ul>
          <a class="btn btn-accent" href="${BASE}/c/${C.sweat.slug}/">مشاهده همه ${C.sweat.plural} ${I.arrow}</a>
        </div>
      </div>
      <div class="lookbook-cards">
        <div class="lookbook-cards-head"><b>منتخب فضای باز پاییزه</b><a href="${BASE}/c/${C.sweat.slug}/">همه مدل‌ها ${I.arrow}</a></div>
        <div class="grid">${winterGrid.map((p) => card(ctx, p)).join("")}</div>
      </div>
    </div>
  </div>
</div></section>` : ""}

<section class="sec-sm"><div class="wrap"><div class="fit rv">
  <div class="fit-copy">
    <span class="kicker">سایزیاب هوشمند المارت</span>
    <h2>سایزت رو در ۱۰ ثانیه پیدا کن.</h2>
    <p>قد و وزن خودت را وارد کن تا بر اساس الگوی دوخت المارت، سایز دقیق را از <b>S</b> تا <b>{MAX}</b> پیشنهاد بدهیم و مدل‌های موجود همان سایز را ببینی.</p>
    <a class="link" href="${BASE}/size-guide/">جدول کامل اندازه‌های سانتی‌متری</a>
  </div>
  ${sizer()}
</div></div></section>

<section class="sec"><div class="wrap">
  <div class="campaign-wrap"><div class="campaign rv">
    <div class="campaign-media"><img src="${BASE}/assets/img/campaign-bigsize.webp" alt="لباس سایز بزرگ مردانه المارت" width="1200" height="900" loading="lazy" decoding="async"></div>
    <div class="campaign-body">
      <span class="kicker">تخصص سایز بزرگ</span>
      <h2>لباس سایز بزرگ مردانه؛ با قواره واقعی.</h2>
      <p>پیدا کردن لباسی که هم راحت باشد و هم روی شانه و سینه شیک بایستد نباید سخت باشد. الگوی اختصاصی از 3XL تا {MAX} با قد استاندارد.</p>
      <ul class="campaign-specs"><li>از 3XL تا {MAX}</li><li>قد شلوار ۱۱۰ سانت</li><li>عرض سینه تا ۶۸ سانت</li></ul>
      <a class="btn btn-ink" href="${BASE}/big-size/">کالکشن سایز بزرگ ${I.arrow}</a>
    </div>
  </div></div>
  <div class="grid">${big.map((p) => card(ctx, p)).join("")}</div>
</div></section>

<section class="sec bg-cream"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">تازه‌های کالکشن</span><h2>تازه رسیده‌ها</h2></div><a class="link" href="${BASE}/shop/?sort=new">همه جدیدها</a></div>
  <div class="grid">${fresh.map((p) => card(ctx, p)).join("")}</div>
</div></section>

${(() => { const RV = ctx.storeReviews; if (!RV || !RV.count) return ""; const good = RV.reviews.filter((r) => r.text && r.star >= 4).sort((a, b) => (b.text.length >= 25) - (a.text.length >= 25) || b.star - a.star || Math.min(b.text.length, 180) - Math.min(a.text.length, 180)).slice(0, 6); const total = Object.values(RV.groups).reduce((a, b) => a + b, 0) || 1;
return `<section class="sec reviews" id="reviews"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">بازخورد خریداران</span><h2>نظر خریداران واقعی در باسلام</h2><p>دیدگاه‌های ثبت‌شده پس از تحویل سفارش در غرفه رسمی المارت؛ بدون ویرایش.</p></div><a class="link" href="${STORE.basalam}" target="_blank" rel="noopener">همه نظرها در باسلام</a></div>
  <div class="rv-wrap">
    <div class="rv-score rv"><b class="num">${fa(RV.average)}</b>${stars(RV.average)}<span>از ${fa(RV.count)} امتیاز خریداران</span>
      <ul>${[5, 4, 3, 2, 1].map((n) => `<li><span>${fa(n)} ★</span><i><em style="width:${Math.round(((RV.groups[n] || 0) / total) * 100)}%"></em></i><small class="num">${fa(RV.groups[n] || 0)}</small></li>`).join("")}</ul>
      <a class="btn btn-glass btn-block rv-score-btn" href="${STORE.basalam}" target="_blank" rel="noopener">مشاهده همه نظرات در باسلام ${I.arrow}</a></div>
    <div class="rv-grid">${good.map((r) => reviewCard(ctx, r, true)).join("")}</div>
  </div></div></section>`; })()}

<section class="sec bg-cream"><div class="wrap story">
  <div class="story-media rv">
    <div class="arch arch-landscape"><img src="${BASE}/assets/img/campaign-craft.webp" alt="انتخاب پارچه و کیفیت دوخت المارت" width="1200" height="900" loading="lazy" decoding="async"></div>
    <div class="badge-yr"><b class="num">{YEARS}</b>سال تجربه · از ${startYear}</div>
  </div>
  <div class="rv">
    <span class="kicker">کیفیت و اصالت</span>
    <h2>${SITE.story && SITE.story.title ? esc(SITE.story.title) : `تجربه ${fa(STORE.years)} ساله،<br>برای کمد امروز شما.`}</h2>
    <p>${SITE.story && SITE.story.text ? esc(SITE.story.text) : `المارت حاصل بیش از ${fa(STORE.years)} سال تجربه خانوادگی در انتخاب پارچه، دوخت و عرضه پوشاک مردانه از تبریز است. هر مدل را پیش از ارسال بررسی می‌کنیم تا با خیال راحت خرید کنید.`}</p>
    <div class="feat">
      <div><i>${I.thread}</i><p style="margin:0"><b>پارچه انتخابی</b><span>نخ پنبه، کتان کشی، اسپان و دورس اعلا</span></p></div>
      <div><i>${I.arch}</i><p style="margin:0"><b>ریشه در بازار تبریز</b><span>${fa(STORE.years)} سال فعالیت مستمر و خرید حضوری</span></p></div>
      <div><i>${I.ruler}</i><p style="margin:0"><b>تخصص سایز بزرگ</b><span>تن‌خور درست برای هیکل‌های درشت تا {MAX}</span></p></div>
      <div><i>${I.box}</i><p style="margin:0"><b>بسته‌بندی و ارسال سریع</b><span>تحویل به پست از روز اول کاری</span></p></div>
    </div>
    <p style="margin-top:24px"><a class="btn btn-ink" href="${BASE}/about/">آشنایی با داستان المارت ${I.arrow}</a></p>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">سوالات پرتکرار و راهنما</span><h2>قبل از خرید بدانید</h2></div><a class="link" href="${BASE}/guide/">همه راهنماهای خرید</a></div>
  <div class="faq rv">${HOME_FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
  <div class="gcards rv" style="margin-top:36px">${homeGuides.map((g) => gcard(ctx, g)).join("")}</div>
  <p style="text-align:center;margin-top:24px"><a class="btn btn-ghost" href="${STORE.igDm}" target="_blank" rel="noopener">${I.ig} سوال دیگری دارید؟ در اینستاگرام بپرسید</a></p>
</div></section>

<section class="sec-sm bg-cream seo-dir"><div class="wrap">
  <div class="sec-head"><div><span class="kicker">راهنمای مسیرها</span><h2>پوشاک مردانه از بازار سرپوشیده تبریز</h2></div></div>
  <p class="seo-intro">فروشگاه و تولیدی پوشاک مردانه المارت (<bdi dir="ltr">ellmarrt.ir</bdi>) در بازار سرپوشیده تبریز با ${fa(STORE.years)} سال سابقه خانوادگی فعالیت می‌کند و مستقل از فروشگاه‌های همنام در سایر شهرها است. هر مدل را پیش از ارسال از نظر جنس، دوخت و سایز بررسی می‌کنیم و سفارش‌ها از روز اول کاری به سراسر ایران ارسال می‌شوند.</p>
  <div class="dir-grid">
    <div><h3>دسته‌بندی و مدل‌ها</h3><p class="dir-links">${inStockCategories.map(([, c]) => `<a class="link" href="${BASE}/c/${c.slug}/">${c.name}</a>`).join(" · ")}</p>${sty.styleLinks(ctx, null)}</div>
    <div><h3>خرید بر اساس رنگ و بودجه</h3><p class="dir-links">${colorList.map((x) => `<a class="link" href="${BASE}${col.colorPath(ctx, x.cat, x.g)}">${col.colorTitle(x.cat, x.g)}</a>`).join(" · ")}</p>${price.priceLinks(ctx, null)}</div>
    <div><h3>سایز، راهنما و بازار تبریز</h3><p class="dir-links"><a class="link" href="${BASE}/tabriz-bazaar/">فروشگاه لباس مردانه در تبریز</a> · <a class="link" href="${BASE}/guide/">راهنمای خرید</a> · ${homeGuides.map((g) => `<a class="link" href="${BASE}/guide/${g.slug}/">${g.title}</a>`).join(" · ")} · <a class="link" href="${BASE}/size-guide/">سایزیاب و جدول سایز</a>${gar.garmentKinds(ctx).map((k) => ` · <a class="link" href="${BASE}/size/${k}/">${gar.GARMENTS[k].h1}</a>`).join("")}${sz.shoeChart(ctx) ? ` · <a class="link" href="${BASE}/size/shoes/">جدول سایز کفش مردانه</a>` : ""} · <a class="link" href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a>${sz.bigCats(ctx).map((k) => ` · <a class="link" href="${BASE}/big-size/${ctx.CATEGORIES[k].slug}/">${sz.BIG_CATS[k].h1}</a>`).join("")} · <a class="link" href="${BASE}/size/4xl/">سایز 4XL چند کیلو است؟</a> · <a class="link" href="${BASE}/size/weight/">سایز لباس بر اساس وزن</a> · <a class="link" href="${BASE}/big-size/tabriz/">لباس سایز بزرگ مردانه در تبریز</a> · <a class="link" href="${BASE}/wholesale/">خرید عمده پوشاک مردانه</a></p></div>
  </div>
</div></section>`;
  return layout(ctx, {
    path: "/",
    title: `${STORE.name} | پوشاک مردانه بازار تبریز و سایز بزرگ تا {MAX}`,
    desc: `خرید پوشاک مردانه از ${STORE.name} در بازار تبریز ({YEARS} سال سابقه): تیشرت، شلوار اسلش، هودی و سایز بزرگ تا {MAX} با ارسال به سراسر ایران.`,
    preload: heroPreload,
    preloadSet: heroPreloadSet,
    preloadSizes: heroPreloadSizes,
    schema: [orgSchema(ctx), { "@context": "https://schema.org", "@type": "WebSite", name: STORE.name, alternateName: STORE.latin, url: `${ctx.SITE_URL}/`, inLanguage: "fa-IR", potentialAction: { "@type": "SearchAction", target: `${ctx.SITE_URL}/shop/?q={search_term_string}`, "query-input": "required name=search_term_string" } }, faqSchema(HOME_FAQ)],
    body,
  });
}

function filters(ctx, activeCat) {
  const { products: P, CATEGORIES: C, BASE } = ctx;
  const sizes = ["L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
  return `<div class="toolbar"><div class="wrap">
<div class="chips" role="group" aria-label="دسته‌بندی">
<button class="chip" data-cat-f="all" data-href="${BASE}/shop/" aria-pressed="${!activeCat}">همه <small class="num">${fa(P.length)}</small></button>
${Object.entries(C).map(([k, c]) => { const n = P.filter((p) => p.cat === k).length; return n ? `<button class="chip" data-cat-f="${k}" data-href="${BASE}/c/${c.slug}/" aria-pressed="${activeCat === k}">${c.name} <small class="num">${fa(n)}</small></button>` : ""; }).join("")}
</div>
<div class="tb-row">
<label class="search">${I.search}<input id="q" type="search" placeholder="جستجو: شلوار اسلش، تیشرت 4XL، هودی…" aria-label="جستجو در محصولات"></label>
<button class="chip tb-toggle" type="button" aria-expanded="false" aria-controls="tb-more">${I.ruler} سایز و ترتیب</button>
<div class="tb-more" id="tb-more">
<select id="sort" class="sel" aria-label="مرتب‌سازی"><option value="featured">پیشنهاد المارت</option><option value="best">پرفروش‌ترین</option><option value="new">جدیدترین</option><option value="low">ارزان‌ترین</option><option value="high">گران‌ترین</option></select>
<div class="sizes-f" role="group" aria-label="سایز">${sizes.map((s) => `<button data-size-f="${s}" aria-pressed="false">${s}</button>`).join("")}</div>
<button class="chip" id="stock-f" aria-pressed="false">فقط موجودها</button>
</div>
<span class="count" id="shop-count">${fa(activeCat ? P.filter((p) => p.cat === activeCat).length : P.length)} محصول</span>
</div></div></div>`;
}

function shop(ctx) {
  const { products: P, BASE } = ctx;
  const sorted = [...P].sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock) || (b.sales - a.sales));
  const items = [["/", "خانه"], ["/shop/", "فروشگاه"]];
  const topColors = col.colorPages(ctx).sort((x, y) => y.list.length - x.list.length).slice(0, 10);
  return layout(ctx, {
    path: "/shop/",
    title: "فروشگاه پوشاک مردانه المارت؛ همه محصولات از بازار تبریز",
    desc: `همه ${fa(P.length)} مدل پوشاک مردانه المارت: تیشرت، پولوشرت، پیراهن، هودی، دورس، شلوار اسلش، شلوارک، کفش و لباس پسرانه؛ فیلتر بر اساس سایز تا {MAX}.`,
    schema: [crumbSchema(ctx, items), itemList(ctx, sorted)],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="wrap bt"><span class="kicker">کالکشن کامل · ${fa(P.length)} مدل</span><h1>فروشگاه المارت</h1><p>کل کالکشن پوشاک مردانه در یک صفحه. با فیلتر سایز و دسته‌بندی، مدل‌های موجود در سایز خودتان را فوری پیدا کنید.</p></div></header>
<section id="shop">${filters(ctx, null)}<div class="wrap"><h2 class="sr">محصولات</h2><div class="grid" id="shop-grid">${sorted.map((p, i) => card(ctx, p, i < 2)).join("")}</div></div></section>
<section class="sec-sm bg-cream"><div class="wrap"><div class="sec-head"><div><span class="kicker">دسترسی سریع</span><h2>جست‌وجو بر اساس مدل، رنگ و بودجه</h2></div></div>
${sty.styleLinks(ctx, null)}
${topColors.length ? `<p class="note-sm">رنگ‌های پرطرفدار: ${topColors.map((x) => `<a class="link" href="${BASE}${col.colorPath(ctx, x.cat, x.g)}">${col.colorTitle(x.cat, x.g)}</a>`).join(" · ")}</p>` : ""}
${price.priceLinks(ctx, null)}
<p class="note-sm">ابزار و راهنما: <a class="link" href="${BASE}/big-size/">لباس سایز بزرگ تا {MAX}</a> · <a class="link" href="${BASE}/size-guide/">سایزیاب با قد و وزن</a> · <a class="link" href="${BASE}/size/weight/">سایز بر اساس وزن</a> · <a class="link" href="${BASE}/guide/">همه راهنماهای خرید</a></p>
</div></section>`,
  });
}

function itemList(ctx, list) {
  return { "@context": "https://schema.org", "@type": "ItemList", numberOfItems: list.length, itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${ctx.SITE_URL}/p/${p.id}/`, name: p.title })) };
}

/* CTR titles/descriptions: first candidate that fits the SERP limits (title <= 70 chars incl. brand suffix, desc <= 160) */
const TITLE_MAX = 70, DESC_MAX = 160;
function ctrTitle(c, min) {
  const withBrand = (t) => (t.includes(STORE.name) ? t : `${t} | ${STORE.name}`);
  const options = [
    `خرید ${c.h1} از بازار تبریز | از ${fa(min)} تومان`,
    `خرید ${c.h1} از بازار تبریز`,
    `خرید ${c.name} از بازار تبریز | از ${fa(min)} تومان`,
    `خرید ${c.name} از بازار تبریز`,
    `خرید ${c.h1} | قیمت از ${fa(min)} تومان`,
  ];
  return options.map(withBrand).find((t) => t.length <= TITLE_MAX) || withBrand(options[options.length - 1]);
}
function ctrDesc(base) {
  const ships = base.includes("ارسال به سراسر ایران");
  const options = ships
    ? [`${base} خرید از باسلام یا سفارش مستقیم.`]
    : [`${base} خرید از باسلام یا سفارش مستقیم؛ ارسال به سراسر ایران.`, `${base} خرید از باسلام یا سفارش مستقیم.`, `${base} ارسال به سراسر ایران.`];
  return options.find((d) => d.length <= DESC_MAX) || base;
}
// Google product taxonomy (Search Console flagged the Persian category name as "Invalid value in field category")
const GOOGLE_CAT = {
  tshirt: "Apparel & Accessories > Clothing > Shirts & Tops", polo: "Apparel & Accessories > Clothing > Shirts & Tops",
  shirt: "Apparel & Accessories > Clothing > Shirts & Tops", sweat: "Apparel & Accessories > Clothing > Shirts & Tops",
  pants: "Apparel & Accessories > Clothing > Pants", shorts: "Apparel & Accessories > Clothing > Shorts",
  shoes: "Apparel & Accessories > Shoes", kids: "Apparel & Accessories > Clothing",
};
function category(ctx, c) {
  const { products: P } = ctx;
  const key = Object.keys(ctx.CATEGORIES).find((k) => ctx.CATEGORIES[k] === c);
  const list = P.filter((p) => p.cat === key).sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock) || (b.sales - a.sales));
  const items = [["/", "خانه"], ["/shop/", "فروشگاه"], [`/c/${c.slug}/`, c.name]];
  const min = Math.min(...list.map((p) => p.price)), max = Math.max(...list.map((p) => p.price));
  const copy = CAT[key];
  const qa = copy.faq;
  return layout(ctx, {
    path: `/c/${c.slug}/`,
    title: ctrTitle(c, min),
    desc: ctrDesc(c.desc),
    image: `${ctx.SITE_URL}/assets/og/${list[0].id}.jpg`,
    preload: `${ctx.BASE}/assets/p/${mainBase(list[0])}-480.webp`,
    preloadSet: `${ctx.BASE}/assets/p/${mainBase(list[0])}-480.webp 480w, ${ctx.BASE}/assets/p/${mainBase(list[0])}-960.webp 960w`,
    preloadSizes: "(max-width:600px) 50vw, 25vw",
    schema: [crumbSchema(ctx, items), itemList(ctx, list), ...(qa.length ? [faqSchema(qa)] : [])],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="wrap bt"><span class="kicker">کالکشن ${c.name} · ${fa(list.length)} مدل</span><h1>${c.h1}</h1><p>${c.desc} قیمت‌ها از <b class="num">${fa(min)}</b> تا <b class="num">${fa(max)}</b> تومان.</p></div></header>
<section id="shop" data-cat="${key}">${filters(ctx, key)}<div class="wrap"><h2 class="sr">محصولات</h2><div class="grid" id="shop-grid">${list.map((p, i) => card(ctx, p, i === 0)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap prose">${copy.long.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div></section>
${guides.some((g) => g.cats.includes(key)) ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><h2>پیش از خرید بخوانید</h2></div><div class="gcards">${guides.filter((g) => g.cats.includes(key)).map((g) => gcard(ctx, g)).join("")}</div></div></section>` : ""}
${sz.bigCats(ctx).includes(c.key || Object.keys(ctx.CATEGORIES).find((k) => ctx.CATEGORIES[k] === c)) ? `<section class="sec-sm" style="padding-bottom:0"><div class="wrap"><p class="note-sm">سایز 3XL به بالا می‌خواهید؟ <a class="link" href="${ctx.BASE}/big-size/${c.slug}/">${sz.BIG_CATS[Object.keys(ctx.CATEGORIES).find((k) => ctx.CATEGORIES[k] === c)].h1}</a></p></div></section>` : ""}
${sty.styleLinks(ctx, key) + col.colorLinks(ctx, key) + price.priceLinks(ctx, key) ? `<section class="sec-sm" style="padding-bottom:0"><div class="wrap">${sty.styleLinks(ctx, key)}${col.colorLinks(ctx, key)}${price.priceLinks(ctx, key)}</div></section>` : ""}
${qa.length ? `<section class="sec-sm"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>` : ""}`,
  });
}

function product(ctx, p) {
  const { BASE, SITE_URL, products: P } = ctx;
  const c = catOf(ctx, p);
  const g = guideFor(p);
  const items = [["/", "خانه"], [`/c/${c.slug}/`, c.name], [`/p/${p.id}/`, short(p)]];
  const hero = `${BASE}/assets/p/${mainBase(p)}-960.webp`;
  // gallery = main studio shot + one studio shot per colour (no duplicate crops)
  const colorImg = (i) => p.colorImages.includes(i) ? `${BASE}/assets/p/${p.id}-k${i}-960.webp` : null;
  const colorShots = p.colors.map((c, i) => colorImg(i) && { i, full: colorImg(i), thumb: `${BASE}/assets/p/${p.id}-k${i}-480.webp`, label: c, color: c }).filter(Boolean)
    .sort((a, b) => p.colorInStock.includes(b.i) - p.colorInStock.includes(a.i));
  const gal = colorShots.length ? colorShots : [{ full: hero, thumb: `${BASE}/assets/p/${p.id}-480.webp`, label: "نمای اصلی", color: "" }];
  const real = p.images.gallery.map((g) => `${BASE}/assets/p/${g.file}`);
  const allThumbs = [
    ...gal.map((g) => ({ ...g, w: 76, h: 95, isReal: false })),
    ...p.images.gallery.map((g, i) => ({ full: `${BASE}/assets/p/${g.file}`, thumb: `${BASE}/assets/p/${g.file}`, w: g.w, h: g.h, label: `عکس واقعی ${fa(i + 1)}`, color: "", isReal: true })),
  ];
  const colors = p.colors;
  const sizes = p.sizes;
  const msr = measures(p);
  const low =p.inStock && p.stock <= 3;
  // "complete the look": tops pair with bottoms and the other way round; items sharing a size with this one come first
  const fit = (x) => x.sizes.filter((z) => sizes.includes(z)).length;
  const rank = (a, b) => (fit(b) > 0) - (fit(a) > 0) || (b.sales || 0) - (a.sales || 0);
  const pairCats = PAIRS[p.cat] || [];
  const pair = P.filter((x) => x.inStock && pairCats.includes(x.cat)).sort(rank).slice(0, 4);
  const related = P.filter((x) => x.id !== p.id && x.cat === p.cat && x.inStock).sort(rank).slice(0, 4);
  const more = related.length < 4 ? P.filter((x) => x.id !== p.id && x.cat !== p.cat && x.inStock && !related.includes(x)).slice(0, 4 - related.length) : [];
  const desc = `${p.title} از ${STORE.name}، بازار تبریز${p.material ? `؛ جنس ${p.material}` : ""}${sizes.length ? `، سایز ${sizes[0]} تا ${sizes[sizes.length - 1]}` : ""}. قیمت ${fa(p.price)} تومان، خرید امن و ارسال به سراسر ایران.`;
  const offerAvail = p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const priceValidUntil = new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10);
  const writtenReviews = (p.reviews || []).filter((r) => r.text && r.text.trim().length >= 3).slice(0, 5);
  const schema = {
    "@context": "https://schema.org", "@type": "Product", "@id": `${SITE_URL}/p/${p.id}/#product`,
    name: p.title, sku: String(p.id), mpn: String(p.id), category: GOOGLE_CAT[p.cat] || "Apparel & Accessories > Clothing",
    brand: { "@type": "Brand", name: `${STORE.name} (${STORE.latin})` },
    image: [...new Set([`${SITE_URL}/assets/p/${mainBase(p)}-960.webp`, ...p.images.gallery.map((g) => `${SITE_URL}/assets/p/${g.file}`)])].slice(0, 5),
    description: p.copy.plain.slice(0, 4900),
    ...(p.material ? { material: p.material } : {}),
    ...(colors.length ? { color: colors.join("، ") } : {}),
    ...(sizes.length ? { size: sizes.join(", ") } : {}),
    audience: { "@type": "PeopleAudience", suggestedGender: p.cat === "kids" ? "unisex" : "male" },
    ...(p.price > 0 ? { offers: {
      "@type": "Offer", url: `${SITE_URL}/p/${p.id}/`, priceCurrency: "IRR", price: p.price * 10,
      priceValidUntil,
      availability: offerAvail,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", "@id": `${SITE_URL}/#store`, name: STORE.name, url: `${SITE_URL}/` },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IR" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        merchantReturnLink: `${SITE_URL}/shipping-returns/`,
      },
    } } : {}),
    ...(p.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.avg, reviewCount: p.rating.count, bestRating: 5, worstRating: 1 } } : {}),
    ...(writtenReviews.length ? { review: writtenReviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name || "خریدار باسلام" },
      datePublished: String(r.date || "").slice(0, 10),
      reviewBody: r.text.trim(),
      reviewRating: { "@type": "Rating", ratingValue: r.star, bestRating: 5, worstRating: 1 },
    })) } : {}),
  };
  const data = { id: p.id, hero: true, variants: p.variants.map(({ color, size, stock, price }) => ({ color, size, stock, price })) };
  const priceBlock = `<div class="pprice" aria-live="polite"><span id="price-from"${new Set(p.variants.filter((v) => v.stock > 0).map((v) => v.price)).size > 1 ? "" : " hidden"}>از</span><b class="num" id="product-price">${fa(p.price)}</b><small>تومان</small><span id="stock" class="stock${p.inStock ? (low ? " low" : "") : " no"}">${p.inStock ? (low ? `فقط ${fa(p.stock)} عدد باقی‌مانده` : "موجود در انبار") : "ناموجود"}</span></div>`;
  const pz = liveSizes(p), pcol = p.colors.filter((k, i) => p.colorInStock.includes(i));
  const pfaq = p.inStock ? [
    ...(pz.length ? [[`${short(p)} در چه سایزهایی موجود است؟`, `الان سایز ${pz.join("، ")} موجود است. اگر قد و وزنتان را می‌دانید، سایزیاب المارت سایز مناسب را پیشنهاد می‌دهد؛ موجودی هر چند ساعت از غرفه باسلام به‌روز می‌شود.`]] : []),
    ...(pcol.length ? [[`${short(p)} چه رنگ‌هایی دارد؟`, pcol.length > 1 ? `رنگ‌های موجود: ${pcol.join("، ")}. برای رنگ‌هایی که عکس جداگانه دارند، با انتخاب رنگ تصویر آن نمایش داده می‌شود.` : `رنگ موجود این مدل ${pcol[0]} است.`]] : []),
    [`${short(p)} را چطور بخرم؟`, `سایز و رنگ را انتخاب کنید و روی «خرید امن از غرفه المارت در باسلام» بزنید. در باسلام دوباره سایز و رنگ را انتخاب و قیمت و موجودی نهایی را بررسی کنید. برای سفارش تلفنی یا پیامکی هم می‌توانید از دکمه مربوط استفاده کنید.`],
  ].filter(([, a]) => a) : [];
  const body = `${crumbs(ctx, items)}
<div class="wrap pdp" id="pdp">
  <div class="gal">
    <div class="gal-main"><img class="cover" src="${hero}" srcset="${BASE}/assets/p/${mainBase(p)}-480.webp 480w, ${hero} 960w" sizes="(max-width:900px) 92vw, 46vw" alt="${esc(p.title)}" width="960" height="1200" fetchpriority="high" decoding="async"><span class="gal-count num" id="gal-count">${fa(1)} / ${fa(allThumbs.length)}</span><span class="gal-hint">برای بزرگ‌نمایی بزنید</span></div>
    <div class="thumbs">${allThumbs.map((g, i) => `<button type="button" data-full="${g.full}" data-tc="${esc(g.color)}"${g.isReal ? ' data-real="1"' : ' data-kind="studio"'} aria-label="${esc(g.label)}" aria-current="${i === 0}"><img src="${g.thumb}" alt="${esc(`${p.title} — ${g.label || `نمای ${fa(i + 1)}`}`.slice(0, 120))}" loading="lazy" width="${g.w}" height="${g.h}" decoding="async">${g.isReal ? `<span class="thumb-tag">واقعی</span>` : ""}</button>`).join("")}</div>
  </div>
  <div class="pinfo">
    <a class="kicker" href="${BASE}/c/${c.slug}/">${c.name}</a>
    <h1>${esc(p.title)}</h1>
    <div class="pmeta">${p.rating ? `<span class="stars">${I.star}<span class="num">${fa(p.rating.avg)}</span></span><span>${fa(p.rating.count)} نظر در باسلام</span>` : ""}${p.sales ? `<span>${fa(p.sales)} فروش موفق</span>` : ""}<span>کد کالا: <span class="num">${p.id}</span></span></div>
    ${priceBlock}
    ${promoOn() ? `<div class="promo"><b>کد تخفیف ${esc(SITE.promo.code)}</b><span>${esc(SITE.promo.text || "هنگام پرداخت در باسلام وارد کنید")}</span><button type="button" data-copy="${esc(SITE.promo.code)}">کپی کد</button></div>` : ""}
    ${colors.length > 1 ? `<div class="opt"><div class="opt-h"><span class="opt-t"><i class="step num">${fa(1)}</i>رنگ: <span id="sel-color">انتخاب کنید</span></span></div><div class="opts">${colors.map((x, i) => `<button data-color="${esc(x)}"${colorImg(i) ? ` data-img="${colorImg(i)}" class="sw"` : ""}>${colorImg(i) ? `<img src="${BASE}/assets/p/${p.id}-k${i}-480.webp" alt="" width="28" height="35" loading="lazy" decoding="async">` : ""}${esc(x)}</button>`).join("")}</div></div>` : colors.length === 1 ? `<p><b>رنگ:</b> ${esc(colors[0])}</p>` : ""}
    ${sizes.length ? `<div class="opt"><div class="opt-h"><span class="opt-t">${colors.length > 1 ? `<i class="step num">${fa(2)}</i>` : ""}سایز: <span id="sel-size">انتخاب کنید</span></span> <a class="link" href="${BASE}/size-guide/" style="font-size:13px">سایزم را نمی‌دانم</a></div><div class="opts">${sizes.map((s) => `<button class="sz" data-size="${s}">${s}</button>`).join("")}</div>${msr ? `<details class="msr"><summary>اندازه‌های هر سایز (سانتی‌متر)</summary><div class="msr-t"><table><thead><tr><th>سایز</th>${msr.cols.map((k) => `<th>${k}</th>`).join("")}</tr></thead><tbody>${msr.rows.map(([s, v]) => `<tr data-msr="${s}"><th>${s}</th>${msr.cols.map((k) => `<td class="num">${v[k] ? fa0(v[k]) : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p>از توضیحات همین مدل در غرفه باسلام. لباس خوش‌اندازه‌تان را صاف روی میز بگذارید و با این اعداد مقایسه کنید.</p></details>` : ""}</div>` : ""}
    <div class="buy">
      ${p.inStock ? `<a class="btn btn-ink btn-block buy-go" href="${p.buyUrl}" target="_blank" rel="noopener">${I.bag} خرید امن از غرفه المارت در باسلام</a>` : `<div class="oos"><b>این مدل فعلاً ناموجود است</b><span>موجودی هر ۶ ساعت از باسلام به‌روز می‌شود. برای خبر شدن از شارژ مجدد پیام بدهید.</span></div><a class="btn btn-ink btn-block" href="${STORE.rubikaOrder}" target="_blank" rel="noopener">خبرم کن وقتی موجود شد</a>`}
      ${p.inStock ? "" : "<!--"}<button class="btn btn-ghost btn-block" id="direct-order" data-direct-order>${I.phone} یا سفارش تلفنی / پیامکی</button>${p.inStock ? "" : "-->"}
      <p class="buy-note">در صفحه باسلام، سایز و رنگ را دوباره انتخاب کنید و قیمت و موجودی نهایی را بررسی کنید. پرداخت از طریق باسلام انجام می‌شود.</p>
      ${p.inStock ? storeRating(ctx, "#reviews") : ""}
      <div class="buy-more">
        <a href="${STORE.igDm}" target="_blank" rel="noopener">${I.ig} سوال قبل از خرید</a>
        <button class="fav" data-id="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">${I.heart}</button>
        <button id="share" aria-label="اشتراک‌گذاری">${I.share}</button>
      </div>
    </div>
    <div class="perks"><div>${I.truck}ارسال سراسری</div><div>${I.shield}ضمانت باسلام</div><div>${I.camera}بررسی قبل از ارسال</div></div>
    <div class="pbox">
      <details open><summary>توضیحات محصول</summary><div class="copy"><p class="lead">${esc(p.copy.lead)}</p><p>${esc(p.copy.paragraph)}</p>${p.copy.bullets.length ? `<ul class="ticks">${p.copy.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div></details>
      <details><summary>ارسال و خرید</summary><div class="desc">سفارش از طریق غرفه رسمی المارت در باسلام ثبت و پرداخت می‌شود. ارسال با پست پیشتاز یا سفارشی به سراسر کشور و برای تبریز با پیک انجام می‌شود. هر سفارش قبل از ارسال بررسی و ایمن بسته‌بندی می‌شود.</div></details>
    </div>
  </div>
</div>
${(() => {
  const keys = new Set(p.copy.facts.map(([k]) => k));
  const rows = [...p.copy.facts, ...p.attrs.filter(([k]) => !["سایز", "رنگ", "برند", "سایر توضیحات"].includes(k) && !keys.has(k))];
  return `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">پیش از خرید</span><h2>مشخصات و نگهداری</h2></div></div>
<div class="copy">${rows.length ? `<table class="spec">${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>` : ""}<p class="note-sm"><b>نکته سایز:</b> ${esc(p.copy.sizeNote)}</p><p class="note-sm"><b>نگهداری:</b> ${esc(p.copy.care)}</p><p class="note-sm"><a class="link" href="${BASE}/size-guide/">سایزیاب و جدول سایز</a>${Object.entries(gar.GARMENTS).filter(([k, G]) => G.cats.includes(p.cat) && gar.garmentKinds(ctx).includes(k)).map(([k, G]) => ` · <a class="link" href="${BASE}/size/${k}/">${G.h1}</a>`).join("")}${(() => { if (p.cat === "shoes" && sz.shoeChart(ctx)) return ` · <a class="link" href="${BASE}/size/shoes/">جدول سایز کفش به سانتی‌متر</a>`; const z = liveSizes(p).filter((x) => sz.sizePages.includes(x)).pop(); return z ? ` · <a class="link" href="${BASE}/size/${z.toLowerCase()}/">سایز ${z} چند کیلو است؟</a>` : ""; })()} · <a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a>${col.colorPages(ctx).filter((x) => x.cat === p.cat && x.list.includes(p) && p.colors.some((k, i) => p.colorInStock.includes(i) && col.colorGroup(k) === x.g)).map((x) => ` · <a class="link" href="${BASE}${col.colorPath(ctx, x.cat, x.g)}">${x.g === "" ? "" : col.colorTitle(x.cat, x.g)}</a>`).join("")}${sty.stylesOf(ctx, p).map((x) => ` · <a class="link" href="${BASE}${sty.stylePath(ctx, x)}">${x.h1}</a>`).join("")}${g ? ` · <a class="link" href="${BASE}/guide/${g.slug}/">${g.title}</a>` : ""}</p></div></div></section>`;
})()}
${real.length ? `<section class="sec-sm real"><div class="wrap"><div class="sec-head"><div><span class="kicker">بدون روتوش</span><h2>عکس‌های واقعی از غرفه</h2><p>همین کالا، عکاسی‌شده در حجره المارت در بازار تبریز؛ برای دیدن رنگ‌ها و جزئیات بزنید.</p></div></div>
<div class="real-g">${real.map((src, i) => `<button class="real-i" data-real="${i}" aria-label="عکس واقعی ${fa(i + 1)}"><img src="${src}" alt="${esc(p.title)} — عکس واقعی ${fa(i + 1)}" loading="lazy" width="${p.images.gallery[i].w}" height="${p.images.gallery[i].h}" decoding="async"></button>`).join("")}</div></div></section>` : ""}
${p.inStock ? `<div class="mbar"><b class="num" id="mobile-price">${fa(p.price)} تومان</b><a class="btn btn-ink buy-go" href="${p.buyUrl}" target="_blank" rel="noopener">خرید از باسلام</a><button class="btn btn-ghost mbar-call" type="button" data-direct-order aria-label="سفارش تلفنی یا پیامکی">${I.phone}</button></div>` : ""}
${p.reviews.length ? `<section class="sec-sm" id="reviews"><div class="wrap"><div class="sec-head"><div><span class="kicker">نظر خریداران</span><h2>${fa(p.rating.avg)} از ۵ <small class="h-sub">از ${fa(p.reviews.length)} امتیاز در باسلام</small></h2></div></div><div class="rv-grid">${p.reviews.filter((r) => r.text).map((r) => reviewCard(ctx, r, false)).join("") || `<p class="note-sm">${fa(p.reviews.length)} خریدار به این محصول امتیاز داده‌اند (بدون متن).</p>`}</div></div></section>` : storeReviewsBlock(ctx, p)}
${pair.length ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">ست کامل</span><h2>با این ست کنید</h2><p>${pair.some((x) => fit(x)) && sizes.length ? "اول مدل‌هایی که در سایزهای همین محصول موجودند." : "انتخاب‌های پرفروش برای کامل کردن استایل."}</p></div></div><div class="grid">${pair.map((x) => card(ctx, x)).join("")}</div></div></section>` : ""}
${pfaq.length ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">پرسش و پاسخ</span><h2>سوالات خریداران درباره این مدل</h2></div></div><div class="faq">${pfaq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div></section>` : ""}
<section class="sec-sm bg-cream"><div class="wrap"><div class="sec-head"><div><span class="kicker">پیشنهاد ما</span><h2>محصولات مشابه</h2></div><a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a></div><div class="grid">${[...related, ...more].map((x) => card(ctx, x)).join("")}</div>${g ? `<p class="note-sm">راهنمای خرید: <a href="${BASE}/guide/${g.slug}/">${g.title}</a></p>` : ""}</div></section>
<section class="sec-sm" id="recent" hidden><div class="wrap"><div class="sec-head"><h2>اخیراً دیده‌اید</h2></div><div class="grid"></div></div></section>
<script type="application/json" id="pdp-data">${json(data)}</script>`;
  return layout(ctx, {
    path: `/p/${p.id}/`,
    // «خرید …» matches how people search; only when it still fits the SERP width with « | المارت»
    title: p.inStock && !/^خرید/.test(p.title) && p.title.length <= 56 ? `خرید ${p.title}` : p.title,
    desc: (() => {
      const z = liveSizes(p), nc = p.colorInStock.length;
      const extra = `${z.length ? `سایز ${z[0]}${z.length > 1 ? ` تا ${z[z.length - 1]}` : ""}` : ""}${nc > 1 ? ` در ${fa(nc)} رنگ` : ""}`;
      const d = `${p.copy.lead} قیمت ${fa(p.price)} تومان، ارسال به سراسر ایران.`;
      return (d.length < 110 && extra ? `${p.copy.lead} ${extra}؛ قیمت ${fa(p.price)} تومان، ارسال به سراسر ایران از بازار تبریز.` : d).slice(0, 165);
    })(),
    ogType: "product",
    extraHead: [
      p.price > 0 ? `<meta property="product:price:amount" content="${p.price * 10}">\n<meta property="product:price:currency" content="IRR">` : "",
      `<meta property="product:availability" content="${p.inStock ? "in stock" : "out of stock"}">`,
      `<meta property="product:brand" content="${STORE.latin}">`,
    ].filter(Boolean).join("\n"),
    image: `${SITE_URL}/assets/og/${p.id}.jpg`,
    preload: hero,
    preloadSet: `${BASE}/assets/p/${mainBase(p)}-480.webp 480w, ${hero} 960w`,
    preloadSizes: "(max-width:900px) 92vw, 46vw",
    schema: [crumbSchema(ctx, items), schema, ...(pfaq.length ? [faqSchema(pfaq)] : [])],
    body,
  });
}

function bigSize(ctx) {
  const { products: P, BASE } = ctx;
  const list = P.filter((p) => p.inStock && isBig(p));
  const xl3 = P.filter((p) => p.inStock && !isBig(p) && liveSizes(p).includes("3XL"));
  const items = [["/", "خانه"], ["/big-size/", "لباس سایز بزرگ مردانه"]];
  const qa = [
    ["لباس سایز بزرگ مردانه تا چه سایزی دارید؟", "در المارت تیشرت تا {MAX:tshirt}، شلوار تا {MAX:pants}، شلوارک تا {MAX:shorts} و هودی و دورس تا {MAX:sweat} دوخته می‌شود."],
    ["سایز 4XL برای چه وزنی مناسب است؟", "به طور معمول 4XL برای وزن حدود ۱۰۵ تا ۱۱۸ کیلوگرم و 5XL برای ۱۱۸ تا ۱۳۲ کیلوگرم مناسب است؛ برای دقت بیشتر از سایزیاب استفاده کنید."],
    ["قد شلوارهای سایز بزرگ چقدر است؟", "شلوارهای اسلش سایز بزرگ را بلندتر از معمول می‌دوزیم: ۱۰۵ تا ۱۱۰ سانتی‌متر، که برای آقایان قدبلند هم کافی است."],
  ];
  return layout(ctx, {
    path: "/big-size/",
    title: "لباس سایز بزرگ مردانه تا {MAX} | تیشرت و شلوار اسلش سایز بزرگ",
    desc: "خرید لباس سایز بزرگ مردانه از 3XL تا {MAX}: تیشرت سایز بزرگ، شلوار اسلش سایز بزرگ، شلوارک و پوشاک راحتی برای آقایان درشت‌اندام؛ با قواره و قد واقعی از بازار تبریز.",
    schema: [crumbSchema(ctx, items), itemList(ctx, list), faqSchema(qa)],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="wrap bt"><span class="kicker">کالکشن ویژه · 3XL تا {MAX}</span><h1>لباس سایز بزرگ مردانه؛ واقعاً بزرگ.</h1><p>پیدا کردن لباسی که هم اندازه باشد و هم شیک، برای خیلی از آقایان سخت است. در المارت سایز بزرگ یک برچسب نیست؛ قواره سینه، قد و دمپا برای هیکل درشت دوخته شده است. همه محصولات 4XL تا {MAX} را اینجا ببینید.</p></div></header>
<section class="sec-sm" style="padding-top:20px"><div class="wrap"><div class="grid">${list.map((p, i) => card(ctx, p, i < 2)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap"><div class="fit rv"><div class="fit-copy"><h2>سایز دقیق خودت رو بدون حدس بخر.</h2><p>سایزیاب بر اساس قد و وزن، از L تا {MAX} پیشنهاد می‌دهد.</p></div>${sizer()}</div></div></section>
<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">بر اساس نوع لباس</span><h2>سایز بزرگ هر دسته</h2></div></div><p class="note-sm">${sz.bigCats(ctx).map((k) => `<a class="link" href="${BASE}/big-size/${ctx.CATEGORIES[k].slug}/">${sz.BIG_CATS[k].h1}</a>`).join(" · ")}</p><p class="note-sm">هر سایز چند کیلو است؟ ${["3XL", "4XL", "5XL", "6XL"].map((z) => `<a class="link" href="${BASE}/size/${z.toLowerCase()}/">سایز ${z}</a>`).join(" · ")} · <a class="link" href="${BASE}/size/weight/">سایز بر اساس وزن</a></p><p class="note-sm"><a class="link" href="${BASE}/big-size/tabriz/">لباس سایز بزرگ مردانه در تبریز (خرید حضوری)</a></p></div></section>
<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">تا 3XL</span><h2>مدل‌های دیگر با سایز 3XL</h2></div></div><div class="grid">${xl3.slice(0, 8).map((p) => card(ctx, p)).join("")}</div></div></section>
<section class="sec-sm bg-cream"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`,
  });
}

// size, height cm, weight kg, chest width, top length — also used by /size/<s>/ pages
const SIZE_ROWS = [["L", "۱۶۵–۱۷۵", "۶۶–۷۵", "۵۰", "۷۲"], ["XL", "۱۷۰–۱۸۰", "۷۵–۸۵", "۵۳", "۷۴"], ["2XL", "۱۷۵–۱۸۵", "۸۵–۹۵", "۵۶", "۷۶"], ["3XL", "۱۷۵–۱۸۸", "۹۵–۱۰۵", "۵۹", "۷۸"], ["4XL", "۱۷۵–۱۹۰", "۱۰۵–۱۱۸", "۶۲", "۸۰"], ["5XL", "۱۷۵–۱۹۲", "۱۱۸–۱۳۲", "۶۵", "۸۲"], ["6XL", "۱۸۰–۱۹۵", "۱۳۲+", "۶۸", "۸۴"]];

function sizeGuide(ctx) {
  const items = [["/", "خانه"], ["/size-guide/", "سایزیاب و جدول سایز"]];
  const qa = [
    ["تیشرت باکسی را چه سایزی سفارش بدهم؟", "تیشرت‌های باکسی را در سایز همیشگی خود سفارش دهید؛ قواره این مدل‌ها با تیشرت‌های جذب متفاوت است."],
    ["اگر بین دو سایز باشم، کدام را انتخاب کنم؟", "برای مدل‌های کتان کشی سایز کوچک‌تر و برای اسپان سایز بزرگ‌تر را انتخاب کنید. اندازه دقیق هر مدل را در صفحه محصول ببینید."],
    ["برای هودی و دورس چه سایزی بگیرم؟", "هودی معمولاً روی تیشرت پوشیده می‌شود و به جای بیشتری نیاز دارد، پس یک سایز بالاتر از سایز همیشگی‌تان مناسب‌تر است. دورس را که مستقیم روی تن می‌پوشید، در سایز همیشگی بگیرید. هودی و دورس در المارت تا {MAX:sweat} دوخته می‌شود."],
    ["قد شلوار در سایزهای بزرگ چقدر است؟", "در جدول شلوار همین صفحه، قد از ۱۰۰ سانتی‌متر در L و XL شروع می‌شود، در 2XL به ۱۰۵ می‌رسد و از 3XL تا 6XL روی ۱۱۰ می‌ماند. اندازه دقیق هر مدل در صفحه محصول آمده است."],
    ["اگر هنوز از انتخاب سایزم مطمئن نباشم، چطور راهنمایی بگیرم؟", "عکس و اندازه‌هایتان را در اینستاگرام المارت بفرستید تا برای انتخاب سایز کمکتان کنیم. برای دیدن مدل‌های بزرگ‌تر، صفحه لباس سایز بزرگ مردانه را ببینید."],
  ];
  const rows = SIZE_ROWS;
  const chartLine = (cats) => {
    const hit = ctx.products.filter((p) => p.inStock && cats.includes(p.cat) && measures(p)).slice(0, 2);
    if (!hit.length) return "";
    return `<p>جدول دقیق هر مدل در صفحه همان محصول، زیر انتخاب سایز آمده است: ${hit.map((p) => `<a href="${pUrl(ctx, p)}">${esc(p.title)}</a>`).join(" · ")}</p>`;
  };
  return layout(ctx, {
    path: "/size-guide/",
    title: "سایز لباس مردانه بر اساس قد و وزن | سایزیاب تا {MAX}",
    desc: "جدول سایز تیشرت، شلوار و هودی مردانه از L تا {MAX} بر اساس قد و وزن؛ با سایزیاب آنلاین المارت سایز دقیق خود را در چند ثانیه پیدا کنید.",
    schema: [crumbSchema(ctx, items), faqSchema(qa)],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="wrap bt"><span class="kicker">سایزیاب هوشمند المارت</span><h1>سایزیاب و جدول سایز مردانه</h1><p>قد و وزن خود را وارد کنید تا سایز پیشنهادی را ببینید، یا از جدول زیر استفاده کنید. اندازه دقیق هر مدل در صفحه همان محصول آمده است.</p></div></header>
<section class="sec-sm"><div class="wrap" style="max-width:640px">${sizer()}</div></section>
<section class="sec-sm"><div class="wrap prose">
<h2>جدول سایز تیشرت و بلوز مردانه</h2>
<table><thead><tr><th>سایز</th><th>قد (سانتی‌متر)</th><th>وزن (کیلوگرم)</th><th>عرض سینه</th><th>قد لباس</th></tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' style="direction:ltr;font-weight:800"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
<div class="note">عرض سینه و قد لباس تقریبی و بر حسب سانتی‌متر است و بین مدل‌های باکسی، اورسایز و جذب کمی تفاوت دارد. تیشرت‌های باکسی را در سایز همیشگی خود سفارش دهید.</div>
${chartLine(["tshirt", "polo", "shirt", "sweat"])}
<h2>جدول سایز شلوار اسلش و شلوارک</h2>
<table><thead><tr><th>سایز</th><th>وزن تقریبی</th><th>قد شلوار</th></tr></thead><tbody>
<tr><td style="direction:ltr;font-weight:800">L – XL</td><td>۶۵ تا ۸۵</td><td>۱۰۰</td></tr>
<tr><td style="direction:ltr;font-weight:800">2XL</td><td>۸۵ تا ۹۵</td><td>۱۰۵</td></tr>
<tr><td style="direction:ltr;font-weight:800">3XL</td><td>۹۰ تا ۱۰۵</td><td>۱۱۰</td></tr>
<tr><td style="direction:ltr;font-weight:800">4XL</td><td>۱۰۵ تا ۱۲۰</td><td>۱۱۰</td></tr>
<tr><td style="direction:ltr;font-weight:800">5XL – 6XL</td><td>۱۲۰ به بالا</td><td>۱۱۰</td></tr></tbody></table>
${chartLine(["pants", "shorts"])}
<h2>اندازه‌گیری درست در خانه</h2>
<ul><li><b>عرض سینه:</b> یک تیشرت که اندازه‌تان است را صاف روی زمین بگذارید و زیر بغل تا زیر بغل را اندازه بگیرید.</li><li><b>قد لباس:</b> از بالاترین نقطه شانه تا پایین لبه لباس.</li><li><b>قد شلوار:</b> از کمر تا پایین دمپا در کنار پا.</li></ul>
<p>هنوز مطمئن نیستید؟ عکس و اندازه‌هایتان را در <a href="${STORE.igDm}" target="_blank" rel="noopener">اینستاگرام المارت</a> بفرستید؛ کمکتان می‌کنیم.</p>
<h2>سوالات متداول سایز</h2>
<div class="faq">${qa.map(([q, a], i) => `<details><summary>${q}</summary><p>${i === 4 ? a.replace("اینستاگرام المارت", `<a href="${STORE.igDm}" target="_blank" rel="noopener">اینستاگرام المارت</a>`).replace("لباس سایز بزرگ مردانه", `<a href="${ctx.BASE}/big-size/">لباس سایز بزرگ مردانه</a>`) : a}</p></details>`).join("")}</div>
<h2>هر سایز چند کیلو است؟</h2>
<p>${sz.sizePages.map((z) => `<a href="${ctx.BASE}/size/${z.toLowerCase()}/">سایز ${z} چند کیلو است؟</a>`).join(" · ")}${gar.garmentKinds(ctx).map((k) => ` · <a href="${ctx.BASE}/size/${k}/">${gar.GARMENTS[k].h1}</a>`).join("")} · <a href="${ctx.BASE}/size/weight/">سایز لباس بر اساس وزن</a>${sz.shoeChart(ctx) ? ` · <a href="${ctx.BASE}/size/shoes/">جدول سایز کفش مردانه</a>` : ""}</p>
<p>ادامه مسیر: <a href="${ctx.BASE}/big-size/">لباس سایز بزرگ مردانه</a> · <a href="${ctx.BASE}/c/${ctx.CATEGORIES.pants.slug}/">شلوار مردانه</a> · <a href="${ctx.BASE}/c/${ctx.CATEGORIES.tshirt.slug}/">تیشرت مردانه</a> · <a href="${ctx.BASE}/guide/">راهنماهای خرید</a></p>
</div></section>`,
  });
}

function about(ctx) {
  const { BASE, products: P } = ctx;
  const items = [["/", "خانه"], ["/about/", "داستان ما"]];
  const heroImg = `${BASE}/assets/img/hojreh-1280.webp`;
  const heroSet = `${BASE}/assets/img/hojreh-640.webp 640w, ${BASE}/assets/img/hojreh-1280.webp 1280w`;
  const heroSizes = "(max-width:900px) 92vw, 46vw";
  const realStrip = [49701761, 50436324, 65852930, 53765502]
    .map((id) => P.find((p) => p.id === id))
    .map((p) => p && ({ p, g: realPick(p) }))
    .filter((x) => x && x.g);
  return layout(ctx, {
    path: "/about/",
    title: `داستان المارت؛ ${fa(STORE.years)} سال در بازار سرپوشیده تبریز`,
    desc: `المارت (ELLMARRT) تولیدی و پخش پوشاک مردانه در بازار بزرگ تبریز است؛ کاری خانوادگی که ${fa(STORE.years)} سال پیش آغاز شد و حالا آنلاین به سراسر ایران می‌فروشد.`,
    image: `${ctx.SITE_URL}/assets/og/hojreh.jpg`,
    preload: heroImg,
    preloadSet: heroSet,
    preloadSizes: heroSizes,
    schema: [crumbSchema(ctx, items), orgSchema(ctx)],
    body: `${crumbs(ctx, items)}
<section class="sec-sm"><div class="wrap story">
<div class="story-media"><div class="arch arch-landscape"><img src="${heroImg}" srcset="${heroSet}" sizes="${heroSizes}" alt="غرفه المارت در بازار سرپوشیده تبریز" width="1280" height="960" fetchpriority="high" decoding="async"></div><div class="badge-yr"><b class="num">${fa(STORE.years)}</b>سال سابقه</div></div>
<div class="prose" style="margin:0">
<span class="kicker">داستان ما</span>
<h1 style="font-size:clamp(28px,4vw,46px)">از یک حجره در بازار تبریز تا خانه شما</h1>
<p>من همیشه دوست داشتم کسب‌وکار خودم را داشته باشم. غرفه‌ای که امروز اداره می‌کنم ${fa(STORE.years)} سال است در بازار سرپوشیده تبریز فعالیت می‌کند؛ این کار را از پدرم به ارث بردم و راه او را ادامه می‌دهم.</p>
<p>روزهای اول سخت بود؛ مشتری کم و فروش پایین. اما هر روز یاد گرفتیم و بهتر شدیم. امروز همان حجره کوچک جایی است که مشتری‌ها با لبخند می‌آیند — و حالا با سایت المارت، همان اعتماد بازار را به سراسر ایران می‌بریم.</p>
<h2>چیزهایی که برایمان مهم است</h2>
<ul><li><b>جنس بازاری، قیمت منصفانه:</b> اجناس با تجربه ${fa(STORE.years)} سال بازار انتخاب می‌شوند.</li><li><b>عکس واقعی، سایز دقیق:</b> هر کالا قبل از ارسال بررسی می‌شود.</li><li><b>ارسال روز اول کاری:</b> بسته‌بندی ایمن به سراسر کشور.</li><li><b>سایز بزرگ واقعی:</b> برای آقایانی که همیشه دنبال لباس اندازه می‌گشتند.</li></ul>
<p><a class="btn btn-ink" href="${BASE}/shop/">دیدن کالکشن</a> <a class="btn btn-ghost" href="${STORE.instagram}" target="_blank" rel="noopener">${I.ig} <bdi dir="ltr" class="handle">@${STORE.igHandle}</bdi></a> <a class="btn btn-ghost" href="${BASE}/tabriz-bazaar/">بازار سرپوشیده تبریز</a></p>
</div></div></section>
${realStrip.length ? `<section class="sec-sm bg-cream"><div class="wrap"><div class="sec-head"><div><span class="kicker">بدون روتوش</span><h2>از میز کار و قفسه حجره</h2><p>نمونه عکس‌های واقعی پارچه، دوخت و برش از غرفه المارت در بازار تبریز.</p></div><a class="link" href="${BASE}/shop/">همه مدل‌ها</a></div><div class="grid">${realStrip.map(({ p, g }) => `<a class="about-shot" href="${pUrl(ctx, p)}"><img src="${BASE}/assets/p/${g.file}" alt="${esc(`${short(p)} — عکس واقعی`)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async"><span><b>${esc(short(p))}</b><small class="num">${fa(p.price)} تومان</small></span></a>`).join("")}</div></div></section>` : ""}`,
  });
}

function tabrizBazaar(ctx) {
  const items = [["/", "خانه"], ["/tabriz-bazaar/", "بازار سرپوشیده تبریز"]];
  const inStock = ctx.products.filter((p) => p.inStock);
  const categories = Object.entries(ctx.CATEGORIES).filter(([key]) => inStock.some((p) => p.cat === key));
  const prods = [...inStock].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 8);
  const qa = [
    ["آدرس دقیق فروشگاه المارت در بازار تبریز کجاست و خرید حضوری دارد؟", `نشانی حجره المارت: ${STORE.address}. می‌توانید حضوری تشریف بیاورید، جنس پارچه را از نزدیک ببینید و سایز را امتحان کنید.`],
    ["ارسال در شهر تبریز و بقیه شهرها چطور انجام می‌شود؟", "برای سفارش‌های داخل شهر تبریز ارسال با پیک موتوری با هماهنگی تلفنی یا پیامکی انجام می‌شود؛ سفارش‌های سایر شهرهای ایران از روز اول کاری با پست ارسال می‌شوند."],
    ["آیا در خرید حضوری و آنلاین پوشاک سایز بزرگ هم دارید؟", "بله؛ پوشاک مردانه المارت شامل تیشرت تا {MAX:tshirt}، شلوار اسلش تا {MAX:pants} و هودی و دورس تا {MAX:sweat} به‌صورت حضوری در بازار تبریز و آنلاین عرضه می‌شود."],
  ];
  return layout(ctx, {
    path: "/tabriz-bazaar/",
    title: `فروشگاه و تولیدی لباس مردانه در تبریز | بازار سرپوشیده | ${STORE.name}`,
    desc: `فروشگاه و تولیدی لباس مردانه ${STORE.name} در بازار سرپوشیده تبریز: تیشرت، شلوار اسلش، هودی و سایز بزرگ؛ نشانی و تلفن غرفه، خرید حضوری، پیک در تبریز و ارسال به سراسر ایران.`,
    schema: [crumbSchema(ctx, items), orgSchema(ctx), faqSchema(qa), ...(prods.length ? [itemList(ctx, prods)] : [])],
    body: `${crumbs(ctx, items)}
<section class="sec-sm"><div class="wrap prose">
<h1>فروشگاه لباس مردانه در تبریز؛ از دل بازار سرپوشیده</h1>
<p>المارت کاری خانوادگی است؛ غرفه‌ای که امروز اداره می‌کنیم ${fa(STORE.years)} سال است در بازار سرپوشیده تبریز فعالیت دارد. این کار را از پدرمان به ارث برده‌ایم و راه او را ادامه می‌دهیم.</p>
<h2>چرا از بازار تبریز بخریم</h2>
<ul>
<li><b>انتخاب با تجربه بازار:</b> جنس بازاری با قیمت منصفانه.</li>
<li><b>عکس واقعی و اندازه دقیق:</b> هر کالا را پیش از ارسال بررسی می‌کنیم.</li>
<li><b>ارسال از روز اول کاری:</b> سفارش‌ها با بسته‌بندی ایمن به سراسر ایران فرستاده می‌شوند.</li>
<li><b>سایز بزرگ واقعی:</b> لباس برای آقایانی که پیدا کردن سایز مناسب برایشان آسان نیست.</li>
</ul>
<h2>خرید حضوری و پیک در تبریز</h2>
<p>اگر در تبریز هستید می‌توانید به غرفه بیایید، جنس را از نزدیک ببینید و سایز را امتحان کنید. برای سفارش داخل شهر تبریز پیک موتوری هم داریم؛ مدل و سایز را تلفنی یا پیامکی بگویید تا هماهنگ شود.</p>
<h2>نشانی غرفه المارت در بازار تبریز</h2>
<p>${esc(STORE.address)}</p>
<p><a class="btn btn-ink" href="https://neshan.org/maps/search/${encodeURIComponent("بازار سرپوشیده تبریز")}" target="_blank" rel="noopener">مسیریابی</a></p>
<p>تماس با غرفه: ${STORE.phones.map((p) => `<a href="tel:${p}" class="num">${fa0(p)}</a>`).join(" · ")}</p>
<p><a href="${STORE.instagram}" target="_blank" rel="noopener">اینستاگرام المارت</a> · <a href="${STORE.basalam}" target="_blank" rel="noopener">غرفه المارت در باسلام</a></p>
<p><a class="btn btn-ink" href="${ctx.BASE}/shop/">دیدن همه محصولات</a> <a class="btn btn-ghost" href="${ctx.BASE}/about/">داستان المارت</a> <a class="btn btn-ghost" href="${ctx.BASE}/size-guide/">سایزیاب و جدول سایز</a> <a class="btn btn-ghost" href="${ctx.BASE}/big-size/tabriz/">لباس سایز بزرگ مردانه در تبریز</a></p>
</div></section>
<section class="sec-sm"><div class="wrap"><div class="sec-head"><h2>دسته‌بندی‌های موجود</h2></div><div class="grid">${categories.map(([, c]) => `<a class="btn btn-ghost" href="${ctx.BASE}/c/${c.slug}/">${esc(c.name)}</a>`).join("")}</div></div></section>
${prods.length ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><h2>چند مدل از محصولات موجود</h2></div><div class="grid">${prods.map((p) => card(ctx, p)).join("")}</div></div></section>` : ""}
<section class="sec-sm bg-cream"><div class="wrap faq"><h2>سوالات خرید حضوری و ارسال در تبریز</h2>${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`,
  });
}

const FAQ_FULL = [
  ["چطور سفارش بدهم؟", "در صفحه محصول سایز و رنگ را انتخاب کنید و روی «خرید امن از غرفه المارت در باسلام» بزنید. در باسلام دوباره سایز و رنگ را انتخاب و قیمت و موجودی نهایی را بررسی کنید. سفارش و پرداخت در باسلام انجام می‌شود."],
  ["سفارش تلفنی یا پیامکی چطور است؟", "اگر نمی‌خواهید از باسلام بخرید، در صفحه محصول سایز و رنگ را انتخاب کنید و «سفارش تلفنی / پیامکی» را بزنید. یک کد پیگیری مثل EL-4K2Q می‌گیرید و متن سفارش آماده می‌شود؛ آن را پیامک کنید، با شماره‌های المارت تماس بگیرید یا در روبیکا پیام بدهید و کد را بگویید. پرداخت و ارسال همان‌جا با شما هماهنگ می‌شود."],
  ["چرا پرداخت در باسلام انجام می‌شود؟", "باسلام بازار آنلاین معتبر ایرانی است؛ پرداخت شما تا زمان دریافت کالا نزد باسلام امن می‌ماند و از ضمانت بازگشت وجه باسلام بهره‌مند می‌شوید."],
  ["هزینه و زمان ارسال چقدر است؟", "ارسال از روز اول کاری بعد از سفارش با پست پیشتاز یا سفارشی انجام می‌شود و هزینه دقیق هنگام ثبت سفارش در باسلام محاسبه می‌شود. در تبریز پیک موتوری هم داریم."],
  ["اگر سایز اندازه نبود چه کنم؟", "قبل از خرید از سایزیاب و جدول سایز استفاده کنید. اگر مشکلی پیش آمد، از طریق پیام باسلام یا اینستاگرام با ما در تماس باشید تا مطابق قوانین باسلام راهنمایی‌تان کنیم."],
  ["آیا رنگ‌ها با عکس یکی است؟", "بعضی تصاویر اصلی بازسازی استودیویی هستند و رنگ ممکن است با توجه به نور و نمایشگر متفاوت دیده شود. عکس‌های واقعی غرفه را نیز در صفحه محصول ببینید."],
  ["خرید عمده دارید؟", "بله؛ المارت پخش پوشاک مردانه است. برای خرید عمده و همکاری در اینستاگرام پیام بدهید."],
];

function faq(ctx) {
  const items = [["/", "خانه"], ["/faq/", "ارسال و سوالات متداول"]];
  return layout(ctx, {
    path: "/faq/",
    title: "ارسال، پرداخت و سوالات متداول",
    desc: "پاسخ سوالات پرتکرار درباره خرید از المارت: نحوه سفارش، پرداخت امن با باسلام، زمان و روش ارسال، انتخاب سایز و خرید عمده پوشاک مردانه.",
    schema: [crumbSchema(ctx, items), faqSchema(FAQ_FULL)],
    body: `${crumbs(ctx, items)}<header class="wrap phead"><h1>ارسال و سوالات متداول</h1></header>
<section class="sec-sm"><div class="wrap faq">${FAQ_FULL.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`,
  });
}

const guides = [
  {
    slug: "slash-pants",
    date: "2026-10-18",
    updated: "2026-11-26",
    title: "راهنمای خرید شلوار اسلش مردانه؛ جنس، مدل و سایز",
    desc: "شلوار اسلش مردانه چه جنسی بخریم؟ تفاوت کتان کشی، اسپان و تمام‌نخ، مدل‌های بغل‌نوار، کارگو، بگ و مچی، و انتخاب سایز درست تا {MAX:pants}.",
    cats: ["pants"],
    faq: [
      ["شلوار اسلش کتان کشی برای بیرون بهتر است یا اسپان؟", "برای استفاده روزمره بیرون، محیط کار نیمه‌رسمی و سفر، کتان کشی (بنگال) خوش‌فرم‌تر روی پا می‌ایستد. اسپان نرم‌تر و سبک‌تر است و برای خانه، ورزش و رانندگی طولانی راحت‌تر است."],
      ["شلوار اسلش شسته شده چه مزیتی دارد؟", "شلوار اسلش شسته‌شده یک بار بعد از دوخت شسته شده است؛ به همین دلیل بعد از اولین شستشو در خانه آب نمی‌رود و فرمش ثابت می‌ماند."],
      ["برای شلوار اسلش سایز بزرگ بین دو سایز کدام را برداریم؟", "اگر پارچه کتان کشی است سایز کوچک‌تر فرم مرتب‌تری می‌دهد، اما در مدل‌های اسپان یا اگر راحتی ران و شکم اولویت دارد، سایز بزرگ‌تر انتخاب امن‌تری است."],
    ],
    html: (ctx) => `<p>شلوار اسلش پرکاربردترین شلوار کمد هر مرد است؛ از پیاده‌روی و سفر تا دورهمی و محیط کار نیمه‌رسمی. اما «اسلش» اسم یک مدل نیست و ده‌ها جنس و برش دارد. در این راهنما، با تجربه چند دهه فروش در بازار تبریز، می‌گوییم چه بخرید.</p>
<div class="note"><b>خلاصه سریع:</b> برای بیرون و ظاهر مرتب، اسلش <b>کتان کشی (بنگال)</b>؛ برای خانه، ورزش و رانندگی، <b>اسپان نخی</b>؛ و برای هوای گرم، <b>تمام‌نخ</b> بهترین انتخاب است.</div>
<h2>۱. جنس: کتان کشی، اسپان یا تمام‌نخ؟</h2>
<ul><li><b>کتان کشی (بنگال):</b> خوش‌فرم‌ترین انتخاب؛ چروک کمتری می‌گیرد، روی تن می‌ایستد و برای بیرون رفتن شیک‌تر است.</li><li><b>اسپان نخی:</b> نرم و گرم‌تر؛ عالی برای خانه، ورزش و رانندگی طولانی.</li><li><b>تمام‌نخ:</b> خنک و تنفس‌پذیر؛ برای پیاده‌روی و تابستان.</li></ul>
<h2>۲. مدل: بغل‌نوار، کارگو، بگ یا مچی؟</h2>
<p><b>بغل‌نوار</b> ظاهر اسپرت و قد بلندتر می‌دهد. <b>کارگو شش جیب</b> کاربردی و ترند است. <b>بگ</b> (گشاد) برای استایل خیابانی است و <b>مچی</b> (دمپا کش) با کتانی جلوه بهتری دارد.</p>
<h2>۳. سایز و قد</h2>
<p>برای سایزهای 2XL به بالا به قد شلوار هم دقت کنید؛ شلوارهای سایز بزرگ المارت ۱۰۵ تا ۱۱۰ سانتی‌متر قد دارند. اگر بین دو سایز هستید، برای مدل‌های کتان کشی سایز کوچک‌تر و برای اسپان سایز بزرگ‌تر را انتخاب کنید. <a href="${ctx.BASE}/size-guide/">سایزیاب المارت</a> را امتحان کنید.</p>
<div class="note">نکته بازاری: شلوار اسلش «شسته» (یک بار بعد از دوخت شسته‌شده) بعد از اولین شستشو در خانه آب نمی‌رود و فرمش ثابت می‌ماند.</div>`,
  },
  {
    slug: "big-size-men",
    date: "2026-11-03",
    updated: "2026-11-26",
    seoTitle: "لباس مناسب مردان چاق و شکم‌دار | سایز بزرگ تا {MAX}",
    title: "لباس مناسب مردان چاق و شکم‌دار؛ راهنمای خرید لباس سایز بزرگ مردانه",
    desc: "آقایان چاق و شکم‌دار چه لباسی بپوشند؟ قواره، رنگ، یقه و جنس مناسب، شلوار کمرکش، لباس خواستگاری و مهمانی و انتخاب سایز 3XL تا {MAX} بر اساس وزن.",
    cats: ["tshirt", "pants"],
    faq: [
      ["آیا مردان شکم‌دار باید لباس یک یا دو سایز بزرگ‌تر بپوشند؟", "خیر؛ لباس بیش از حد گشاد بدن را حجیم‌تر نشان می‌دهد. درز سرشانه باید روی استخوان شانه بنشیند و قد تیشرت یا پولوشرت به اندازه کافی بلند باشد تا هنگام نشستن بالا نرود."],
      ["برای آقایان شکم‌دار چه شلواری راحت‌تر و مرتب‌تر است؟", "شلوار کمرکش و بنددار با فاق کافی راحت‌ترین گزینه است چون روی شکم فشار نمی‌آورد. دمپای ساده یا مچی متعادل هم از دمپای خیلی تنگ تناسب بهتری می‌سازد."],
      ["برای وزن ۱۱۰ تا ۱۳۰ کیلوگرم معمولاً چه سایزی مناسب است؟", "به عنوان نقطه شروع، وزن ۱۰۵ تا ۱۱۸ کیلو حدود سایز 4XL و ۱۱۸ تا ۱۳۲ کیلو حدود سایز 5XL است؛ همیشه عرض سینه و قد لباس را با جدول اندازه هر مدل مقایسه کنید."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>بیشتر راهنماهای «لباس برای افراد چاق» برای خانم‌ها نوشته شده‌اند. این صفحه برای آقایانی است که شکم دارند یا درشت‌اندام‌اند و می‌خواهند لباس هم راحت باشد و هم مرتب نشان دهد؛ خلاصه چیزی که هر روز در حجره به مشتری‌ها می‌گوییم. برای ست کردن اسلش با تیشرت، هودی و کفش، <a href="${ctx.BASE}/guide/slash-pants-style/">این راهنما</a> را ببینید.</p>
<div class="note"><b>خلاصه سریع:</b> راز خوش‌تیپی آقایان شکم‌دار سه چیز است: لباس <b>اندازه سرشانه</b> (نه دو سایز گشادتر)، بالاتنه <b>تیره و قدبلند</b> (مثل پولوشرت یا پنبه ضخیم) و شلوار <b>کمرکش فاق‌دار</b> با دمپای متعادل.</div>
<h2>۱. لباس اندازه، نه لباس گشاد</h2>
<p>اشتباه رایج این است که برای پوشاندن شکم، دو سایز بزرگ‌تر بخرند. لباس خیلی گشاد بدن را حجیم‌تر نشان می‌دهد. سرشانه لباس باید روی سرشانه شما بنشیند؛ اگر سرشانه پایین افتاده و آستین تا آرنج آمده، لباس بزرگ است. سایزی را بگیرید که شکم را بدون کشیدگی بپوشاند و دکمه یا پارچه روی شکم کش نیاید.</p>
<h2>۲. قد بالاتنه از عرض مهم‌تر است</h2>
<p>تیشرت یا پولوشرتی که کوتاه باشد، وقتی می‌نشینید بالا می‌رود و زیر شکم پیدا می‌شود. تیشرت سایز بزرگ خوب در 4XL قدی حدود ۸۰ سانتی‌متر دارد. قد هر مدل را در جدول اندازه صفحه محصول ببینید؛ مثلاً ${a(53718702, "تیشرت سایز بزرگ ۴XL و ۵XL")} برای همین قد بلندتر دوخته شده است.</p>
<h2>۳. رنگ و طرح</h2>
<ul><li><b>رنگ‌های تیره و یکدست</b> (مشکی، سرمه‌ای، طوسی تیره، یشمی) هیکل را جمع‌وجورتر نشان می‌دهند.</li><li>اگر رنگ روشن دوست دارید، آن را برای <b>شلوار یا لایه زیرین</b> بگذارید و بالاتنه بیرونی را تیره بپوشید؛ مثلاً سویشرت زیپ‌باز تیره روی تیشرت روشن، یک خط عمودی می‌سازد که بدن را باریک‌تر نشان می‌دهد.</li><li>طرح‌های ریز و راه‌راه باریک بهتر از چاپ‌های بزرگ وسط شکم‌اند.</li></ul>
<h2>۴. یقه</h2>
<p>یقه‌دار (پولوشرت و پیراهن یقه انگلیسی) نگاه را به صورت و شانه می‌برد و ظاهر را مرتب‌تر از یقه گرد نشان می‌دهد. یقه گرد خیلی تنگ گردن را کوتاه‌تر نشان می‌دهد؛ اگر تیشرت یقه گرد می‌پوشید، یقه نباید به گردن بچسبد. <a href="${ctx.BASE}/big-size/polo/">پولوشرت سایز بزرگ</a> را ببینید.</p>
<h2>۵. جنس پارچه</h2>
<p>پنبه ضخیم (نمره ۲۸ یا نخ ۳۰) روی بدن نمی‌چسبد و برجستگی‌ها را کمتر نشان می‌دهد. پارچه‌های خیلی نازک و براق هر چین را نشان می‌دهند. برای زمستان، دورس دو نخ و توکرک فرم خود را نگه می‌دارند و مثل کش روی شکم نمی‌نشینند.</p>
<h2>۶. شلوار: کمرکش و فاق بلندتر</h2>
<p>برای آقایان شکم‌دار، شلوار کمرکش و بنددار راحت‌ترین انتخاب است؛ کمر زیر شکم فشار نمی‌آورد و هنگام نشستن جابه‌جا نمی‌شود. شلوار باید فاق کافی داشته باشد تا کمر پایین نیفتد. دمپای خیلی تنگ پا را لاغرتر و بالاتنه را بزرگ‌تر نشان می‌دهد؛ دمپای ساده یا مچی متعادل بهتر است. ${a(54125344, "شلوار اسلش کتان کشی سایز بزرگ")}، ${a(45029484, "شلوار کتان شسته کمرکش")} و ${a(50425812, "شلوار بغل‌نوار سایز بزرگ")} برای همین ساخته شده‌اند.</p>
<h2>۷. برای مهمانی و خواستگاری</h2>
<p>یک ست ساده و مطمئن: پولوشرت یا پیراهن یقه‌دار تیره + شلوار کتان یا پارچه‌ای با رنگ روشن‌تر + کفش تمیز. پیراهن را بیرون بیندازید فقط اگر قدش تا روی جیب شلوار است؛ پیراهن کوتاه را داخل شلوار کنید و کمربند هم‌رنگ کفش ببندید.</p>
<h2>۸. برای زمستان</h2>
<p>هودی یا دورس را در سایز همیشگی بگیرید، نه بزرگ‌تر؛ برای لایه‌پوشی، سویشرت زیپ‌دار را باز بپوشید تا خط عمودی بسازد. ${a(63645940, "هودی مشکی ساده")} از سایزهای بزرگ‌تر هم دارد.</p>
<h2>سایز من چیست؟</h2>
<p>سایز را با وزن پیدا کنید: <a href="${ctx.BASE}/size/weight/100/">۱۰۰ کیلو</a>، <a href="${ctx.BASE}/size/weight/110/">۱۱۰ کیلو</a>، <a href="${ctx.BASE}/size/weight/120/">۱۲۰ کیلو</a>، <a href="${ctx.BASE}/size/weight/130/">۱۳۰ کیلو</a> یا <a href="${ctx.BASE}/size/weight/">جدول کامل وزن و سایز</a>. اگر شکم دارید و روی مرز دو سایز هستید، سایز بزرگ‌تر را ببینید و عرض سینه‌اش را با لباسی که اندازه‌تان است مقایسه کنید.</p>
<p><a href="${ctx.BASE}/big-size/">کالکشن سایز بزرگ المارت</a>: تیشرت تا {MAX:tshirt}، شلوار تا {MAX:pants}. اگر در تبریز هستید، <a href="${ctx.BASE}/big-size/tabriz/">حضوری در بازار تبریز</a> امتحان کنید.</p>`;
    },
  },
  {
    slug: "hoodie-sweatshirt",
    date: "2026-10-18",
    updated: "2026-11-26",
    title: "هودی، سویشرت یا دورس؟ راهنمای انتخاب لباس گرم مردانه",
    desc: "فرق هودی، سویشرت و دورس چیست؟ جنس فوتر، توکرک و دورس دو نخ، انتخاب سایز برای لایه‌پوشی و نگهداری درست تا لباس فرمش را از دست ندهد.",
    cats: ["sweat"],
    faq: [
      ["فرق اصلی هودی، سویشرت و دورس چیست؟", "هودی کلاه‌دار است و معمولاً جیب کانگورویی دارد، سویشرت زیپ‌دار و مناسب لایه‌پوشی است و دورس بدون کلاه و زیپ با یقه گرد یا یقه‌دار است و مرتب‌تر دیده می‌شود."],
      ["برای زمستان دورس دو نخ بهتر است یا فوتر و توکرک؟", "پنبه فوتر و توکرک گرم‌ترین انتخاب برای سرمای زمستان هستند؛ دورس دو نخ ضخیم ایستایی و فرم ثابتی برای پاییز و زمستان معتدل دارد."],
      ["سایز دورس و هودی را چطور انتخاب کنیم؟", "دورس را که مستقیم روی تن می‌پوشید در سایز همیشگی بخرید، اما اگر سویشرت یا هودی را روی لباس دیگری می‌پوشید عرض سینه مدل را با آزادی لازم مقایسه کنید."],
    ],
    html: (ctx) => `<p>با سرد شدن هوا، اولین سؤال مشتری‌های حجره این است: «هودی بخرم یا دورس؟» این سه لباس شبیه هم‌اند، اما هر کدام برای کاری ساخته شده‌اند. اینجا خلاصه تجربه ما را می‌خوانید.</p>
<div class="note"><b>خلاصه سریع:</b> <b>هودی</b> کلاه‌دار و اسپرت است، <b>سویشرت</b> زیپ‌دار برای لایه‌پوشی راحت است و <b>دورس</b> بدون کلاه و زیپ است و زیر کاپشن یا به‌تنهایی مرتب‌تر می‌نشیند.</div>
<h2>۱. فرق هودی، سویشرت و دورس</h2>
<ul><li><b>هودی:</b> کلاه‌دار، معمولاً با جیب کانگورویی جلو. اسپرت‌ترین انتخاب برای دانشگاه، سفر و بیرون رفتن.</li><li><b>سویشرت:</b> زیپ‌دار (معمولاً با کلاه). چون باز و بسته می‌شود، برای لایه‌پوشی و روزهایی که هوا مدام عوض می‌شود بهترین است.</li><li><b>دورس و بلوز:</b> بدون کلاه و زیپ، با یقه گرد یا یقه‌دار. مرتب‌تر است و زیر کاپشن یا روی پیراهن هم خوب می‌نشیند.</li></ul>
<h2>۲. جنس: فوتر، توکرک یا دورس دو نخ؟</h2>
<ul><li><b>پنبه فوتر و توکرک:</b> رویه صاف و داخل کرکی؛ گرم‌ترین انتخاب برای زمستان.</li><li><b>دورس دو نخ ضخیم:</b> ایستایی بالا و فرم ثابت؛ برای پاییز و زمستان‌های معتدل.</li><li><b>پنبه لاکرا:</b> کمی کشسان و سبک‌تر؛ برای روزهای خنک و استفاده در خانه.</li></ul>
<h2>۳. سایز</h2>
<p>دورس و بلوز مستقیم روی تن پوشیده می‌شوند؛ اندازه‌ای را بخرید که تیشرت‌هایتان را در آن می‌پوشید. برای سویشرتی که زیرش لباس دیگری می‌آید، روش اندازه گرفتن را قدم‌به‌قدم در <a href="${ctx.BASE}/guide/sweatshirt-buying-guide/">راهنمای خرید سویشرت</a> نوشته‌ایم. <a href="${ctx.BASE}/size-guide/">سایزیاب المارت</a> هم با قد و وزن، سایز پیشنهادی را نشان می‌دهد.</p>
<h2>۴. نگهداری</h2>
<p>پشت‌ورو و با آب ولرم بشویید و از خشک‌کن با حرارت بالا استفاده نکنید تا کرک داخل و سرآستین‌های کشباف فرمشان را حفظ کنند.</p>
<div class="note">نکته بازاری: هودی و دورس را با <a href="${ctx.BASE}/c/pants/">شلوار اسلش</a> هم‌رنگ یا یک تُن تیره‌تر ست کنید؛ ساده‌ترین راه برای یک استایل مرتب زمستانی است.</div>`,
  },
  {
    slug: "tshirt-fit",
    date: "2026-10-18",
    updated: "2026-11-26",
    seoTitle: "تیشرت باکسی، اورسایز یا معمولی؛ راهنمای انتخاب",
    title: "تیشرت باکسی، اورسایز یا معمولی؛ کدام قواره برای شما مناسب است؟",
    desc: "راهنمای انتخاب تیشرت مردانه: فرق قواره باکسی، اورسایز و معمولی، جنس نخ پنبه و نخ ۳۰، انتخاب سایز و ست کردن تیشرت با شلوار.",
    cats: ["tshirt"],
    faq: [
      ["تفاوت تیشرت باکسی، اورسایز و معمولی چیست؟", "قواره معمولی اندازه تن است، اورسایز کمی گشادتر و بلندتر دوخته می‌شود و تیشرت باکسی عرض بیشتر، قد کوتاه‌تر و سرشانه افتاده دارد."],
      ["تیشرت باکسی را با چه شلواری ست کنیم؟", "تیشرت باکسی با شلوار بگ، کارگو یا شلوارهای آزاد بهتر دیده می‌شود و برای شلوار خیلی جذب کمتر پیشنهاد می‌شود."],
      ["تیشرت نخ پنبه چه مزیتی نسبت به پارچه‌های خیلی نازک دارد؟", "نخ پنبه (مثل نخ ۳۰) تنفس‌پذیر و خنک است، عرق را جذب می‌کند و اگر خیلی نازک نباشد بعد از شستشو یقه‌اش باز نمی‌شود."],
    ],
    html: (ctx) => `<p>تیشرت ساده‌ترین لباس کمد است، اما همین سادگی باعث می‌شود قواره و جنس، همه‌چیز را تعیین کنند. یک تیشرت خوش‌قواره با شلوار ساده، از یک تیشرت گران اما بدفرم شیک‌تر است.</p>
<div class="note"><b>خلاصه سریع:</b> قواره <b>معمولی</b> اندازه تن و همه‌کاره است، <b>اورسایز</b> گشاد و بلندتر است و <b>باکسی</b> عرض زیاد با قد کوتاه‌تر و شانه افتاده دارد که با شلوار بگ یا کارگو ست می‌شود.</div>
<h2>۱. سه قواره اصلی</h2>
<ul><li><b>معمولی (Regular):</b> اندازه تن، سرشانه سر جای خودش. برای استفاده روزمره و زیر کت یا سویشرت.</li><li><b>اورسایز:</b> کمی گشادتر و بلندتر. راحت و امروزی؛ برای اینکه اورسایز واقعی دربیاید، معمولاً یک سایز بزرگ‌تر از همیشه بردارید.</li><li><b>باکسی:</b> عرض زیاد، قد کوتاه‌تر و شانه افتاده. همان فرم ترندی که با شلوار بگ، کارگو یا جین جلوه می‌کند.</li></ul>
<h2>۲. جنس: چرا نخ پنبه؟</h2>
<p>تیشرت نخ پنبه (مثل نخ ۳۰) خنک است، عرق را جذب می‌کند و بعد از شستشو یقه‌اش باز نمی‌شود. پارچه‌های خیلی نازک بعد از چند بار شستن فرمشان را از دست می‌دهند؛ پارچه کمی ضخیم‌تر روی تن بهتر می‌ایستد.</p>
<h2>۳. سایز بزرگ</h2>
<p>برای هیکل‌های درشت، قد تیشرت به اندازه عرضش مهم است تا هنگام نشستن بالا نرود. مدل‌های 4XL و 5XL المارت را در <a href="${ctx.BASE}/big-size/">کالکشن سایز بزرگ</a> ببینید و برای اطمینان از <a href="${ctx.BASE}/size-guide/">سایزیاب</a> کمک بگیرید.</p>
<h2>۴. ست کردن</h2>
<ul><li>تیشرت روشن (سفید، کرمی) با شلوار تیره (مشکی، زغالی) همیشه جواب می‌دهد.</li><li>تیشرت باکسی را با شلوار گشاد یا کارگو بپوشید، نه شلوار تنگ.</li><li>در صفحه هر تیشرت، بخش «با این ست کنید» شلوارهایی را نشان می‌دهد که در همان سایز موجودند.</li></ul>
<div class="note">نکته نگهداری: تیشرت چاپ‌دار را پشت‌ورو و با آب سرد بشویید و روی طرح اتو نکنید.</div>`,
  },
  {
    slug: "polo-shirt",
    date: "2026-10-18",
    updated: "2026-11-26",
    seoTitle: "پولوشرت و تیشرت یقه‌دار مردانه؛ راهنمای انتخاب",
    title: "پولوشرت و تیشرت یقه‌دار مردانه؛ انتخاب برای تابستان و محیط کار",
    desc: "پولوشرت چه جنسی بخریم؟ نخ سوزنی، مراکشی بیسکویتی یا نیم‌زیپ؛ فرق پولوشرت با تیشرت یقه انگلیسی و نحوه ست کردن برای کار و مهمانی.",
    cats: ["polo", "shirt"],
    faq: [
      ["تفاوت پولوشرت دکمه‌دار، نیم‌زیپ و یقه انگلیسی چیست؟", "مدل دو یا سه دکمه کلاسیک‌ترین فرم است، نیم‌زیپ ظاهر اسپرت‌تر و امروزی‌تری دارد و تیشرت یقه انگلیسی با یقه بازتر مناسب تابستان و سفر است."],
      ["برای تابستان یا مهمانی کدام جنس پولوشرت بهتر است؟", "برای گرمای تابستان بافت نخ سوزنی خنک‌تر است و برای بیرون و مهمانی بافت مراکشی (بیسکویتی) چروک را کمتر نشان می‌دهد و شیک‌تر می‌ایستد."],
      ["چطور یقه پولوشرت بعد از شستشو خراب نشود؟", "با آب سرد و دور ملایم بشویید و روی چوب‌لباسی خشک کنید تا فرم یقه و سرشانه ثابت بماند."],
    ],
    html: (ctx) => `<p>پولوشرت بین تیشرت و پیراهن ایستاده است: راحتی تیشرت را دارد و آراستگی یقه پیراهن را. برای همین انتخاب اول خیلی‌ها برای محیط کار نیمه‌رسمی، مهمانی تابستانی و سفر است.</p>
<div class="note"><b>خلاصه سریع:</b> برای گرمای تابستان <b>نخ سوزنی</b>، برای ظاهر کم‌چروک در مهمانی <b>بافت مراکشی (بیسکویتی)</b> و برای محیط کار مرتب <b>کتان کشی یا پولو دکمه‌دار</b> را با شلوار ساده یا کتان ست کنید.</div>
<h2>۱. مدل‌های رایج</h2>
<ul><li><b>پولو دو یا سه دکمه:</b> کلاسیک‌ترین مدل؛ با شلوار کتان یا اسلش ساده.</li><li><b>نیم‌زیپ:</b> اسپرت‌تر و امروزی‌تر؛ زیپ را کمی باز بگذارید تا یقه فرم بگیرد.</li><li><b>تیشرت یقه انگلیسی:</b> یقه بازتر و پهن‌تر، حال‌وهوای تعطیلات تابستانی دارد.</li></ul>
<h2>۲. جنس</h2>
<ul><li><b>نخ سوزنی:</b> بافت ریز و خنک؛ برای گرمای تابستان.</li><li><b>مراکشی (بیسکویتی):</b> بافت برجسته و شیک که چروک را کمتر نشان می‌دهد؛ برای بیرون و مهمانی.</li><li><b>کتان کشی:</b> خوش‌فرم و ایستا؛ برای محیط کار.</li></ul>
<h2>۳. سایز و قواره</h2>
<p>پولوشرت باید سرشانه‌اش دقیق باشد و آستینش تا وسط بازو برسد. اغلب مدل‌ها فرم معمولی دارند و سایز همیشگی شما مناسب است. اگر شک دارید، از <a href="${ctx.BASE}/size-guide/">سایزیاب المارت</a> استفاده کنید.</p>
<h2>۴. ست کردن</h2>
<p>پولوشرت را با شلوار کتان یا <a href="${ctx.BASE}/c/pants/">اسلش ساده</a> و کفش اسپرت سفید بپوشید. برای ظاهر رسمی‌تر، پولو را داخل شلوار بگذارید.</p>
<div class="note">نکته نگهداری: پولوشرت را با آب سرد و دور ملایم بشویید و روی چوب‌لباسی خشک کنید تا یقه فرمش را حفظ کند.</div>`,
  },
  {
    slug: "tshirt-vs-polo",
    date: "2026-10-18",
    updated: "2026-11-26",
    title: "تفاوت تیشرت و پولوشرت؛ کدام برای شما مناسب‌تر است؟",
    desc: "تفاوت تیشرت و پولوشرت در یقه، جنس و کاربرد؛ راهنمای انتخاب برای کار و روزمره، بررسی قواره و سایز و نکته‌های شستشو و نگهداری.",
    cats: ["tshirt", "polo"],
    faq: [
      ["برای محیط کار نیمه‌رسمی تیشرت بهتر است یا پولوشرت؟", "پولوشرت به دلیل یقه برگردان و دکمه ظاهر مرتب‌تری برای محیط کار نیمه‌رسمی و دورهمی دارد، در حالی که تیشرت برای خانه، پیاده‌روی و زیر سویشرت راحت‌تر است."],
      ["آیا پولوشرت همیشه از تیشرت خنک‌تر یا ضخیم‌تر است؟", "خیر؛ خنکی و نرمی به نوع الیاف، تراکم بافت و ضخامت پارچه بستگی دارد، نه صرفاً به اسم پولو یا تیشرت."],
      ["قواره تیشرت و پولوشرت را از روی چه معیاری مقایسه کنیم؟", "عرض سینه، قد لباس و جای قرار گرفتن درز سرشانه را روی یک لباس اندازه خودتان بسنجید و مطمئن شوید یقه روی گردن فشار نمی‌آورد."],
    ],
    html: (ctx) => `<p>برای انتخاب بین تیشرت و پولوشرت، اول به موقعیت استفاده فکر کنید. یقه ظاهر لباس را عوض می‌کند، اما راحتی و خنکی بیشتر به جنس، ضخامت و قواره بستگی دارد.</p>
<div class="note"><b>خلاصه سریع:</b> برای پوشش مرتب و نیمه‌رسمی <b>پولوشرت ساده</b> و برای استفاده روزمره، پیاده‌روی و پوشیدن زیر سویشرت <b>تیشرت</b> انتخاب کاربردی‌تری است؛ خنکی هر دو به ضخامت و الیاف پارچه بستگی دارد.</div>
<h2>۱. تفاوت اصلی در یقه و ظاهر</h2>
<p>تیشرت معمولاً یقه گرد یا هفت دارد؛ پولوشرت با یقه برگردان و بخش کوتاه دکمه‌دار شناخته می‌شود. پولو اغلب ظاهر مرتب‌تری دارد و تیشرت برای پوشش راحت روزمره انتخاب ساده‌ای است.</p>
<h2>۲. جنس و بافت را جداگانه بررسی کنید</h2>
<p>هر دو می‌توانند پنبه‌ای یا ترکیبی باشند. بافت پیکه که در بعضی پولوها دیده می‌شود، سطحی ریز و برجسته دارد؛ تیشرت‌ها اغلب بافت صاف‌تری دارند. از روی اسم لباس درباره خنکی قضاوت نکنید؛ تراکم بافت و ضخامت هم مهم‌اند.</p>
<h2>۳. قواره و سایز مناسب</h2>
<p>در قواره معمولی، درز سرشانه نزدیک لبه شانه قرار می‌گیرد و پارچه روی سینه کشیده نمی‌شود. یقه پولو نباید به گردن فشار بیاورد. عرض سینه و قد یک لباس اندازه خودتان را با اندازه‌های محصول مقایسه کنید؛ <a href="${ctx.BASE}/size-guide/">راهنمای سایز</a> هم کمک می‌کند.</p>
<h2>۴. برای چه موقعیتی کدام را بپوشیم؟</h2>
<p>برای محیط کاری که پوشش نیمه‌رسمی می‌پذیرد یا دورهمی، پولوشرت ساده گزینه مناسبی است. برای خانه، پیاده‌روی و پوشیدن زیر سویشرت، تیشرت راحت‌تر انتخاب می‌شود. در هر دو حالت، آزادی حرکت را هنگام نشستن و بالا بردن دست‌ها بررسی کنید.</p>
<h2>۵. ست کردن بدون شلوغی</h2>
<p>تیشرت ساده با شلوار جین یا اسلش ترکیب راحتی می‌سازد. پولوشرت را می‌توانید با شلوار کتان بپوشید. اگر بالاتنه طرح‌دار است، شلوار ساده انتخاب کنید تا ترکیب لباس‌ها هماهنگ‌تر باشد.</p>
<h2>۶. شستشو و حفظ فرم یقه</h2>
<p>دستور برچسب لباس اولویت دارد. لباس‌های هم‌رنگ را با هم بشویید و برای مدل چاپ‌دار، لباس را پشت‌ورو کنید. حرارت زیاد ممکن است به الیاف یا چاپ آسیب بزند؛ هنگام خشک کردن هم یقه و سرشانه را نکشید و روش توصیه‌شده روی برچسب را رعایت کنید.</p>`,
  },
  {
    slug: "shirt-fabric-guide",
    date: "2026-10-18",
    updated: "2026-11-26",
    title: "راهنمای جنس پیراهن مردانه؛ از پنبه تا پارچه مراکشی",
    desc: "راهنمای جنس پیراهن مردانه؛ شناخت پنبه، الیاف ترکیبی و بافت مراکشی، انتخاب ضخامت و قواره مناسب و نکته‌های شستشو و اتوکشی.",
    cats: ["shirt"],
    faq: [
      ["تفاوت پیراهن پنبه خالص و الیاف ترکیبی چیست؟", "پنبه نرمی و جذب رطوبت بالاتری دارد اما ممکن است بیشتر چروک شود؛ ترکیب پنبه و پلی‌استر اغلب چروک کمتری می‌گیرد."],
      ["آیا نام «مراکشی» یا «آکسفورد» جنس پارچه را مشخص می‌کند؟", "این نام‌ها معمولاً به نوع بافت اشاره دارند نه درصد الیاف؛ برای دانستن درصد پنبه، ضخامت و کشسانی باید مشخصات همان پیراهن را بررسی کنید."],
      ["هنگام انتخاب سایز پیراهن به چه نکته‌ای دقت کنیم؟", "دکمه‌ها نباید روی سینه یا شکم کشیده شوند و در پارچه‌های بدون کش باید فضای کافی برای نشستن و حرکت دست وجود داشته باشد."],
    ],
    html: (ctx) => `<p>برای خرید پیراهن، اسم پارچه تنها بخشی از اطلاعات است. ترکیب الیاف، نوع بافت و ضخامت در کنار هم مشخص می‌کنند لباس چه حسی روی پوست دارد و چطور روی تن می‌ایستد.</p>
<div class="note"><b>خلاصه سریع:</b> نام‌هایی مثل «مراکشی» یا «آکسفورد» نشان‌دهنده نوع بافت‌اند؛ پیش از خرید، <b>ترکیب الیاف</b>، <b>ضخامت متناسب با فصل</b> و <b>عرض سینه و سرشانه</b> را با پیراهن اندازه خودتان مقایسه کنید.</div>
<h2>۱. جنس با بافت فرق دارد</h2>
<p>پنبه و پلی‌استر نام الیاف‌اند، اما نام‌هایی مثل آکسفورد به نوع بافت اشاره دارند. «مراکشی» هم در بازار ممکن است برای پارچه‌های متفاوت به کار برود؛ از روی این نام نمی‌توان درصد پنبه، کشسانی یا ضخامت را قطعی دانست. ترکیب الیاف را از مشخصات یا فروشنده بپرسید.</p>
<h2>۲. پنبه یا الیاف ترکیبی؟</h2>
<p>پنبه رطوبت را جذب می‌کند و معمولاً حس نرمی دارد، اما ممکن است چروک شود یا با شستشوی نامناسب آب برود. ترکیب پنبه و پلی‌استر اغلب چروک کمتری می‌گیرد؛ حس و عملکرد نهایی به درصد الیاف و بافت بستگی دارد. وجود الیاف کشسان هم باید در مشخصات ذکر شده باشد.</p>
<h2>۳. ضخامت مناسب فصل و کاربرد</h2>
<p>برای روزهای گرم، پارچه سبک‌تر با بافت بازتر و قواره آزادتر را بررسی کنید. پارچه نازک و روشن ممکن است بدن‌نما باشد. برای هوای خنک یا پوشیدن روی تیشرت، ضخامت بیشتر می‌تواند مناسب باشد؛ برجسته بودن بافت به‌تنهایی نشانه گرم بودن نیست.</p>
<h2>۴. انتخاب سایز با توجه به جنس</h2>
<p>دکمه‌های جلوی پیراهن نباید روی سینه یا شکم کشیده شوند. در پارچه بدون کش، فضای کافی برای نشستن و حرکت دست لازم است. عرض سینه، سرشانه، قد و آستین را با پیراهن اندازه خودتان مقایسه کنید و از <a href="${ctx.BASE}/size-guide/">راهنمای سایز</a> کمک بگیرید.</p>
<h2>۵. کدام جنس برای شما کاربردی‌تر است؟</h2>
<p>اگر تماس نرم پارچه با پوست برایتان مهم است، ترکیب الیاف و لطافت سطح داخلی را بررسی کنید. اگر وقت کمی برای اتو دارید، میزان چروک‌پذیری را بپرسید. برای استفاده روزانه، پارچه‌ای انتخاب کنید که روش نگهداری‌اش با عادت شما سازگار باشد.</p>
<h2>۶. شستشو و اتوکشی</h2>
<p>دمای آب و اتو را طبق برچسب تنظیم کنید؛ یک دستور برای همه پیراهن‌ها مناسب نیست. رنگ‌های روشن و تیره را جدا بشویید و لباس را پیش از خشک شدن کامل، به‌آرامی مرتب کنید. روی پارچه برجسته، اتوی داغ و فشار زیاد ممکن است ظاهر بافت را تغییر دهد.</p>`,
  },
  {
    slug: "sweatshirt-buying-guide",
    date: "2026-10-18",
    updated: "2026-11-26",
    title: "راهنمای خرید سویشرت مردانه؛ زیپ، یقه، سرآستین و سایز",
    desc: "تمام‌زیپ یا نیم‌زیپ، کلاه‌دار یا بی‌کلاه، سرآستین و لبه کشباف، و اندازه گرفتن سایز وقتی زیر سویشرت لباس دیگری می‌پوشید.",
    cats: ["sweat"],
    faq: [
      ["سویشرت تمام‌زیپ بخرم یا نیم‌زیپ؟", "تمام‌زیپ برای تغییر سریع دما در مسیر و محیط بسته راحت‌تر است و نیم‌زیپ به دلیل صاف ماندن جلو، زیر کت یا کاپشن مرتب‌تر دیده می‌شود."],
      ["اگر سویشرت را زیر کاپشن کلاه‌دار بپوشم مدل کلاه‌دار مناسب است؟", "معمولاً زیر کاپشن کلاه‌دار مدل بی‌کلاه یا نیم‌زیپ راحت‌تر است تا دو کلاه پشت گردن روی هم جمع نشوند."],
      ["وقتی زیر سویشرت بلوز یا پیراهن می‌پوشیم سایز را چطور انتخاب کنیم؟", "عرض سینه یک سویشرت اندازه خودتان را اندازه بگیرید؛ اگر فقط تیشرت می‌پوشید همان سایز و اگر پیراهن یا بلوز ضخیم‌تر زیرش می‌آید یک سایز بالاتر راحت‌تر است."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>این صفحه فقط درباره جزئیاتی است که هنگام خرید سویشرت به چشم نمی‌آیند ولی هر روز حسشان می‌کنید: زیپ، یقه، سرآستین و سایز. اگر هنوز بین هودی، سویشرت و دورس مردد هستید یا درباره جنس پارچه سؤال دارید، اول <a href="${ctx.BASE}/guide/hoodie-sweatshirt/">مقایسه هودی، سویشرت و دورس</a> را بخوانید.</p>
<div class="note"><b>خلاصه سریع:</b> برای استفاده روزمره و لایه‌پوشی آسان <b>تمام‌زیپ</b>، برای پوشیدن زیر کاپشن <b>نیم‌زیپ بی‌کلاه</b> و برای گرم نگه داشتن مچ و کمر مدل‌های دارای <b>کشباف برگشت‌پذیر</b> انتخاب‌های بهتری هستند.</div>
<h2>۱. تمام‌زیپ یا نیم‌زیپ؟</h2>
<p><b>تمام‌زیپ</b> مثل ${a(60937967, "سویشرت کلاه‌دار تمام‌زیپ المارت")} از بالا تا پایین باز می‌شود. سوار ماشین می‌شوید، به مغازه می‌رسید یا در اداره بخاری روشن است؟ زیپ را باز می‌کنید و لازم نیست لباس را درآورید.</p>
<p><b>نیم‌زیپ</b> مثل ${a(64343889, "دورس نیم‌زیپ پشت‌چاپ")} از سر پوشیده می‌شود و زیپ کوتاهش فقط یقه را باز می‌کند. جلوی لباس صاف می‌ماند، برای همین زیر کت یا کاپشن مرتب‌تر دیده می‌شود.</p>
<h2>۲. کلاه داشته باشد یا نه؟</h2>
<p>کلاه در باد و نم‌نم باران کار یک شال‌گردن را می‌کند. اما اگر سویشرت را زیر کاپشنی می‌پوشید که خودش کلاه دارد، دو کلاه پشت گردن روی هم جمع می‌شوند. در این حالت مدل بی‌کلاه یا نیم‌زیپ راحت‌تر است.</p>
<h2>۳. سرآستین و لبه پایین کشباف</h2>
<p>کشباف دور مچ جلوی ورود باد را می‌گیرد و موقع شستن دست، آستین را راحت بالا می‌زنید و همان‌جا می‌ماند. لبه پایین کشباف هم نمی‌گذارد سویشرت موقع خم شدن بالا برود. هنگام خرید، کشباف را کمی بکشید؛ باید سریع به حالت اول برگردد.</p>
<h2>۴. سایز وقتی زیرش لباس می‌پوشید</h2>
<ol><li>سویشرتی را که اندازه‌اش را دوست دارید صاف روی میز بگذارید.</li><li>عرض سینه را از زیر بغل تا زیر بغل اندازه بگیرید و عدد را دو برابر کنید.</li><li>اگر فقط تیشرت زیرش می‌پوشید، همان سایز را بگیرید. اگر پیراهن یا ${a(60211729, "بلوز آستین‌بلند")} زیرش می‌پوشید و درز شانه همین الان روی استخوان شانه‌تان است، یک سایز بالاتر بروید.</li></ol>
<p>عدد را با <a href="${ctx.BASE}/size-guide/">جدول سایز</a> مقایسه کنید یا قبل از خرید <a href="${STORE.igDm}" target="_blank" rel="noopener">در اینستاگرام برای ما بفرستید</a>.</p>
<div class="note">همه مدل‌های گرم را یک‌جا در <a href="${ctx.BASE}/c/sweatshirt/">هودی، سویشرت و دورس مردانه</a> ببینید.</div>`;
    },
  },
  {
    slug: "mens-shoe-size-guide",
    date: "2026-10-12",
    updated: "2026-11-26",
    seoTitle: "راهنمای سایز و خرید کفش اسپرت مردانه (۴۱ تا ۴۵)",
    title: "راهنمای سایز و انتخاب کفش مردانه؛ از اندازه‌گیری پا تا جنس و زیره",
    desc: "راهنمای اندازه‌گیری دقیق پا به سانتی‌متر و انتخاب سایز کفش اسپرت مردانه (۴۱ تا ۴۵)؛ بررسی زیره PU، دوردوخت صنعتی و نگهداری کفش.",
    cats: ["shoes"],
    faq: [
      ["چطور طول پا را برای خرید اینترنتی کفش اندازه بگیریم؟", "عصر و در حالت ایستاده روی یک برگ کاغذ بایستید، پاشنه را به دیوار بچسبانید و جلوی بلندترین انگشت را علامت بزنید. فاصله دو نقطه را به سانتی‌متر اندازه بگیرید و با جدول طول پای همان مدل مقایسه کنید."],
      ["کفش اسپرت دوردوخت زیره PU چه مزیتی دارد؟", "دوردوخت صنعتی اتصال رویه و زیره را محکم‌تر می‌کند و زیره PU (پلی‌یورتان) وزن سبکی دارد و ضربه قدم زدن را برای استفاده روزمره بهتر جذب می‌کند."],
      ["کفش اسپرت را در ماشین لباسشویی بشوییم؟", "خیر؛ شستشو در ماشین لباسشویی به دوخت و چسب فشار می‌آورد. برای تمیز کردن از دستمال مرطوب و شوینده ملایم استفاده کنید و در سایه خشک کنید."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>شماره کفش در کارخانه‌های مختلف یکی دو میلی‌متر تفاوت دارد؛ مطمئن‌ترین راه برای خرید اینترنتی کفش اسپرت، اندازه‌گیری طول پا به سانتی‌متر است. در <a href="${ctx.BASE}/c/${ctx.CATEGORIES.shoes.slug}/">دسته کفش اسپرت المارت</a> مدل‌های دوردوخت روزمره در سایزهای ۴۱ تا ۴۵ عرضه می‌شوند و در صفحه <a href="${ctx.BASE}/size/shoes/">جدول سایز کفش مردانه</a> می‌توانید طول پا برای هر شماره را ببینید.</p>
<h2>۱. اندازه‌گیری دقیق طول پا در خانه</h2>
<ol><li>اندازه‌گیری را عصر انجام دهید (پا در پایان روز کمی ورم طبیعی دارد) و جورابی بپوشید که معمولاً همراه کفش می‌پوشید.</li><li>کاغذ را روی زمین صاف بچسبانید، پاشنه را کامل به دیوار تکیه دهید و وزن بدن را روی پا بیندازید.</li><li>جلوی بلندترین انگشت را علامت بزنید و فاصله را تا دیوار با خط‌کش یا متر بخوانید؛ برای پای دیگر هم تکرار کنید و عدد بزرگ‌تر را مبنا بگذارید.</li></ol>
<p>اگر پای شما بین دو شماره افتاد، برای پنجه پهن یا پوشیدن جوراب ضخیم، یک شماره بزرگ‌تر راحت‌تر است.</p>
<h2>۲. رویه، زیره PU و دوردوخت یعنی چه؟</h2>
<ul><li><b>دوردوخت صنعتی:</b> علاوه بر پرس و چسب، دور تا دور رویه به زیره دوخته می‌شود؛ در مدل‌هایی مثل ${a(55720135, "کفش اسپرت مردانه سه‌خط")} و ${a(43999644, "کفش اسپرت دوردوخت زیره PU")} این دوخت عمر کفش را در استفاده روزانه بالا می‌برد.</li><li><b>زیره PU:</b> پلی‌یورتان وزن کمی دارد، انعطاف‌پذیر است و برای پیاده‌روی، دانشگاه و محیط کار خستگی کمتری ایجاد می‌کند.</li><li><b>نمای واقعی در غرفه:</b> در صفحه هر محصول، تب «عکس واقعی» ظاهر و بافت رویه را زیر نور طبیعی نشان می‌دهد.</li></ul>
<h2>۳. ست کردن و نگهداری</h2>
<p>کفش اسپرت سفید یا مشکی با <a href="${ctx.BASE}/c/pants/">شلوار اسلش کتان کشی</a>، کارگو و جین راحت ست می‌شود. برای تمیز کردن، گردوغبار را با برس نرم پاک کنید و با دستمال مرطوب بکشید؛ کفش را داخل ماشین لباسشویی نیندازید و کنار بخاری خشک نکنید.</p>`;
    },
  },
  {
    slug: "mens-shorts-buying-guide",
    date: "2026-10-12",
    updated: "2026-11-26",
    seoTitle: "راهنمای خرید شلوارک مردانه و سایز بزرگ (3XL تا {MAX:shorts})",
    title: "راهنمای خرید شلوارک مردانه؛ جنس، قد شلوارک و سایز مناسب",
    desc: "راهنمای انتخاب شلوارک مردانه و سایز بزرگ تا {MAX:shorts}: مقایسه پارچه کتان و کنفی، انتخاب قد مناسب نسبت به زانو، اندازه کمر و شستشو.",
    cats: ["shorts"],
    faq: [
      ["شلوارک مردانه سایز بزرگ بر اساس وزن چه سایزی بخریم؟", "به عنوان راهنمای اولیه، 3XL برای حدود ۹۰ تا ۱۰۵ کیلوگرم، 4XL برای ۱۰۵ تا ۱۲۰ کیلوگرم و 5XL و 6XL برای بالای ۱۲۰ کیلوگرم مناسب‌اند. همیشه دور کمر شلوارک اندازه خودتان را با جدول محصول مقایسه کنید."],
      ["قد استاندارد شلوارک مردانه چقدر باید باشد؟", "برای استفاده روزمره و بیرون، قدی که درست بالای زانو یا روی زانو بایستد خوش‌فرم‌تر و متعادل‌تر است."],
      ["شلوارک کتان را چطور بشوییم؟", "با آب سرد و پشت‌ورو بشویید و در سایه خشک کنید تا رنگ پارچه و کش کمر فرم خود را حفظ کند."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>شلوارک مردانه خوب باید در هوای گرم خنک باشد، هنگام نشستن روی ران کش نیاید و کمرش بدون فشار بایستد. در <a href="${ctx.BASE}/c/${ctx.CATEGORIES.shorts.slug}/">بخش شلوارک مردانه المارت</a> مدل‌های کتان دو جیب با قواره واقعی و سایز بزرگ تا {MAX:shorts} عرضه می‌شوند.</p>
<h2>۱. جنس پارچه: کتان یا سبک روزمره؟</h2>
<p>پارچه <b>کتان</b> روی پا ایستایی بهتری دارد، در سفر و بیرون مرتب دیده می‌شود و جیب‌هایش با گذاشتن موبایل یا کلید آویزان نمی‌شوند؛ مثل ${a(42724724, "شلوارک کتان دو جیب سایز بزرگ")}. مدل‌های سبک‌تر و نخی برای استفاده در خانه، گرمای شدید و استراحت بعد از تمرین راحت‌ترند.</p>
<h2>۲. قد شلوارک و آزادی ران</h2>
<p>قد شلوارک را روی یک شلوارک اندازه خودتان از بالای کمر تا لبه پایین متر بزنید. مدل‌هایی که تا نزدیک زانو می‌آیند برای آقایان قدبلند و سایزهای بزرگ تناسب بهتری می‌سازند و پا را کشیده‌تر نشان می‌دهند. آزادی دور ران مهم‌ترین معیار راحتی هنگام نشستن و رانندگی است.</p>
<h2>۳. کمر کش و بنددار + راهنمای وزن</h2>
<p>کمر کش و بنددار باعث می‌شود بعد از غذا یا در حرکت احساس فشار نداشته باشید. به عنوان نقطه شروع: سایز 3XL حدود ۹۰ تا ۱۰۵ کیلو، 4XL حدود ۱۰۵ تا ۱۲۰ کیلو و 5XL و 6XL بیش از ۱۲۰ کیلو را پوشش می‌دهند. برای مقایسه دقیق‌تر <a href="${ctx.BASE}/size/weight/">جدول سایز بر اساس وزن</a> و <a href="${ctx.BASE}/size-guide/">سایزیاب المارت</a> را ببینید.</p>
<h2>۴. ست کردن و شستشو</h2>
<p>شلوارک کرمی، زیتونی یا یشمی با <a href="${ctx.BASE}/c/tshirt/">تیشرت نخ پنبه</a> سفید یا مشکی ترکیبی بی‌دردسر می‌سازد. شلوارک را با آب سرد بشویید و در سایه خشک کنید.</p>`;
    },
  },
  {
    slug: "boys-pants-guide",
    date: "2026-10-18",
    updated: "2026-11-26",
    title: "راهنمای خرید شلوار پسرانه و نوجوان؛ جنس، سایز و نگهداری",
    desc: "راهنمای انتخاب شلوار پسرانه و نوجوان برای مدرسه، بیرون و خانه؛ بررسی جنس کتان و پنبه، مدل اسلش و راحتی، مقایسه سایز و شست‌وشو با آب سرد.",
    cats: ["kids"],
    faq: [
      ["برای مدرسه و بیرون چه شلوار پسرانه‌ای بهتر است؟", "اسلش بغل‌نوار کتان کشی به دلیل ایستایی مرتب و انعطاف پارچه هنگام نشستن و حرکت برای مدرسه و بیرون مناسب‌تر است."],
      ["شلوار راحتی نخی با مدل نیم‌بگ چه فرقی دارد؟", "شلوار راحتی نخی سبک و مناسب استفاده روزمره در خانه است، اما نیم‌بگ قواره آزادتر و ظاهر اسپرت‌تری برای بیرون دارد."],
      ["سایز ۷۵ تا ۹۵ شلوار پسرانه را فقط بر اساس سن بگیریم؟", "خیر؛ یک شلوار خوش‌اندازه فرزندتان را اندازه بگیرید و دور کمر و قد آن را با جدول محصول مقایسه کنید."],
    ],
    html: (ctx) => `<p>شلوار پسرانه را بر اساس جایی که بیشتر پوشیده می‌شود انتخاب کنید: مدرسه و بیرون، یا خانه. در <a href="${ctx.BASE}/c/${ctx.CATEGORIES.kids.slug}/">دسته لباس پسرانه</a> سه مدل اصلی دارد و هر کدام کاربرد خودش را دارد.</p>
<div class="note"><b>خلاصه سریع:</b> برای مدرسه و مهمانی <b>اسلش بغل‌نوار کتان کشی</b>، برای خانه <b>شلوار راحتی نخی سبک</b> و برای تن‌خور گشادتر <b>اسلش نیم‌بگ پنبه‌ای</b> انتخاب کنید و سایز عددی ۷۵ تا ۹۵ را با متر کردن شلوار فعلی مشخص کنید.</div>
<h2>۱. اسلش بغل‌نوار؛ برای مدرسه و بیرون</h2>
<p>اسلش شلواری راسته و جمع‌وجور است و بغل‌نوار یعنی نواری روی درز کنار پا دارد که ظاهرش را مرتب‌تر از یک شلوار ساده می‌کند. <a href="${ctx.BASE}/p/50020130/">شلوار اسلش بغل‌نوار کتان کشی</a> برای مدرسه، بیرون و مهمانی‌های خودمانی معرفی شده. <a href="${ctx.BASE}/p/36616537/">مدل کتان</a> هم برای همین مصارف است. کش پارچه در مدل اول هنگام نشستن و بازی راحت‌تر است.</p>
<h2>۲. راحتی؛ برای خانه و روزمره</h2>
<p><a href="${ctx.BASE}/p/58203944/">شلوار راحتی نخی سبک</a> مخصوص خانه و رفت‌وآمد روزمره است. جنس نخی دارد و سبک است. اگر شلوار را بیشتر در خانه می‌پوشد، این مدل را بردارید و شلوار کتان را برای بیرون نگه دارید.</p>
<h2>۳. نیم‌بگ؛ قواره آزادتر</h2>
<p>نیم‌بگ از اسلش گشادتر می‌نشیند و حالت اسپرت‌تری دارد. <a href="${ctx.BASE}/p/58203280/">شلوار اسلش نیم‌بگ پنبه‌ای</a> هم پسرانه است و هم دخترانه.</p>
<h2>سایز و نگهداری</h2>
<p>سایزها عددی هستند (۷۵ تا ۹۵) و فقط با سن تعیین نمی‌شوند؛ یک شلوار خوش‌اندازه‌ی فرزندتان را کنار بگذارید و کمر و قد را با اندازه‌های همان مدل مقایسه کنید. برای راهنمایی بیشتر <a href="${ctx.BASE}/size-guide/">سایزیاب</a> را ببینید یا از ما بپرسید. هر سه مدل را با آب سرد بشویید تا رنگ و فرم‌شان بماند. همه مدل‌ها را در <a href="${ctx.BASE}/c/${ctx.CATEGORIES.kids.slug}/">لباس پسرانه</a> ببینید.</p>`,
  },
  {
    slug: "winter-outfit-men",
    date: "2026-11-01",
    updated: "2026-11-26",
    seoTitle: "ست پاییزی و زمستانی مردانه؛ هودی، دورس و شلوار",
    title: "ست پاییزی و زمستانی مردانه؛ هودی، دورس و شلوار را چطور ست کنیم",
    desc: "چند ست ساده و گرم برای پاییز و زمستان: هودی با شلوار اسلش، دورس با کارگو، بلوز آستین‌بلند با شلوار بگ؛ قاعده رنگ، جنس و سایز برای لایه‌پوشی.",
    cats: ["sweat", "pants"],
    faq: [
      ["با هودی یا دورس ساده چه شلواری ست می‌شود؟", "هودی ساده با شلوار اسلش بغل‌نوار و دورس نیم‌زیپ با شلوار کارگو شش جیب خاکی، سبز یا مشکی ترکیب اسپرت و مرتبی می‌سازند."],
      ["برای رنگ‌های پاییزی مثل یشمی، زرشکی و قهوه‌ای چه رنگ شلواری بپوشیم؟", "این رنگ‌ها را کنار یک رنگ پایه مثل مشکی، طوسی، کرمی یا سرمه‌ای بپوشید و دو رنگ پررنگ را هم‌زمان کنار هم نگذارید."],
      ["هودی و دورس را چطور بشوییم تا سرشانه از فرم نیفتد؟", "پشت‌ورو و با آب سرد بشویید و به جای آویزان کردن با چوب‌لباسی در حالت خیس، روی بند پهن کنید تا کش نیاید."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>ست کردن لباس در پاییز و زمستان سخت‌تر از تابستان نیست؛ فقط یک قاعده دارد: <b>یک تکه رنگی یا طرح‌دار، بقیه ساده</b>. اگر بالاتنه رنگ پررنگ یا چاپ دارد، شلوار را ساده و تیره بگیرید و برعکس. در ادامه چند ست آماده از همین کالکشن آمده است.</p>
<div class="note"><b>خلاصه سریع:</b> برای ست بی‌دردسر پاییز و زمستان، یک تکه را ساده نگه دارید: <b>هودی ساده + اسلش بغل‌نوار</b>، <b>دورس نیم‌زیپ + کارگو</b> یا <b>بلوز آستین‌بلند + شلوار بگ</b> زیر کاپشن.</div>
<h2>۱. هودی ساده + شلوار اسلش</h2>
<p>راحت‌ترین ست روزمره است. ${a(62560754, "هودی بیسیک توکرک")} یا ${a(63645940, "هودی مشکی ساده")} را با ${a(36616362, "شلوار اسلش بغل‌نوار")} بپوشید؛ نوار کناری شلوار، ست ساده را از یکنواختی درمی‌آورد. کفش اسپرت سفید این ست را کامل می‌کند.</p>
<h2>۲. دورس نیم‌زیپ + شلوار کارگو</h2>
<p>${a(64343889, "دورس نیم‌زیپ پشت‌چاپ")} یقه مرتب‌تری از هودی دارد و با ${a(54126455, "شلوار کارگو شش جیب")} ظاهری اسپرت ولی جمع‌وجور می‌سازد. رنگ‌های خاکی و سبز شلوار کارگو با دورس مشکی، سفید یا کرمی بیشترین هماهنگی را دارند.</p>
<h2>۳. بلوز آستین‌بلند + شلوار بگ</h2>
<p>برای روزهایی که هوا هنوز خیلی سرد نیست، ${a(60212610, "بلوز آستین‌بلند پنبه")} را با ${a(53762676, "شلوار بگ کتان کشی")} بپوشید. بلوز نازک‌تر از هودی است و زیر کاپشن هم حجم اضافه نمی‌سازد.</p>
<h2>۴. ست یکدست</h2>
<p>اگر حوصله انتخاب ندارید، ${a(60209573, "ست بلوز و شلوار یقه‌دار")} بالا و پایین را از یک پارچه دارد. برای اینکه ست یکدست بی‌روح دیده نشود، کفش یا کلاه را از رنگ دیگری انتخاب کنید.</p>
<h2>قاعده رنگ در فصل سرد</h2>
<ul><li><b>مشکی، طوسی و سرمه‌ای</b> پایه‌اند؛ با هر رنگی ست می‌شوند.</li><li><b>کرمی و سفید</b> ست تیره را روشن‌تر و تمیزتر نشان می‌دهند.</li><li><b>یشمی، زرشکی و قهوه‌ای</b> رنگ‌های پاییزی‌اند؛ آن‌ها را با یک رنگ پایه بپوشید، نه با هم.</li></ul>
<p>رنگ‌های هر کالکشن را در صفحه‌های <a href="${ctx.BASE}/c/sweatshirt/">هودی و دورس</a> و <a href="${ctx.BASE}/c/pants/">شلوار مردانه</a> ببینید.</p>
<h2>سایز برای لایه‌پوشی</h2>
<p>اگر هودی یا دورس را روی تیشرت یا بلوز دیگری می‌پوشید، عرض سینه همان مدل را در جدول اندازه صفحه محصول نگاه کنید و با لباسی که الان راحت تنتان است مقایسه کنید. اگر بین دو سایز هستید، برای زمستان سایز بزرگ‌تر معمولاً راحت‌تر است. برای پیدا کردن سایز با قد و وزن، <a href="${ctx.BASE}/size-guide/">سایزیاب</a> را امتحان کنید.</p>
<h2>نگهداری لباس گرم</h2>
<p>هودی و دورس را پشت‌ورو و با آب سرد بشویید و روی بند پهن کنید تا کش نیاید؛ اگر لباس خیس را با چوب‌لباسی آویزان کنید، سرشانه‌اش از فرم می‌افتد.</p>`;
    },
  },
  {
    slug: "fabric-guide",
    date: "2026-11-03",
    updated: "2026-11-26",
    seoTitle: "دورس چیست؟ فرق دورس، اسپان، نخ پنبه و کتان کشی",
    title: "دورس چیست؟ فرق دورس، اسپان، نخ پنبه، کتان کشی و توکرک در لباس مردانه",
    desc: "دورس چیست و دورس دو نخ با سه نخ چه فرقی دارد؟ فرق اسپان با نخ پنبه، نخ پنبه ۲۸ و ۳۰، کتان کشی، توکرک، کبریتی و سنگشور به زبان ساده با مثال از لباس‌های واقعی.",
    cats: ["sweat", "tshirt", "pants"],
    faq: [
      ["دورس چیست و دورس دو نخ با سه‌نخ چه فرقی دارد؟", "دورس پارچه کشباف ضخیم با رویه صاف است که در پاییز و زمستان استفاده می‌شود. دورس دو نخ سبک‌تر و مناسب پاییز و زیر کاپشن است؛ دورس سه‌نخ ضخیم‌تر، سنگین‌تر و مناسب سرمای زمستان است."],
      ["فرق پارچه اسپان با نخ پنبه چیست؟", "نخ پنبه از الیاف طبیعی پنبه با تنفس و جذب عرق بالاست و برای تیشرت تابستانی عالی است. اسپان الیاف ترکیبی یا مصنوعی دارد، کمتر چروک می‌شود و برای شلوار راحتی و لباس ورزشی زیاد استفاده می‌شود."],
      ["تیشرت نخ پنبه ۲۸ بهتر است یا ۳۰؟", "هرچه عدد نمره نخ کوچک‌تر باشد پارچه کلفت‌تر است؛ پس پنبه ۲۸ کمی ضخیم‌تر و ایستاتر از پنبه ۳۰ است، در حالی که پنبه ۳۰ و ۳۲ سبک‌تر و خنک‌ترند."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>روی برچسب و توضیح لباس‌های بازار اسم‌هایی مثل دورس، اسپان، نخ پنبه و کتان کشی زیاد می‌بینید. اینجا هر کدام را کوتاه توضیح داده‌ایم تا بدانید چه می‌خرید.</p>
<div class="note"><b>خلاصه سریع:</b> برای تیشرت روزمره <b>نخ پنبه</b>، برای پاییز و زمستان <b>دورس دو نخ یا توکرک</b>، برای شلوار بیرون <b>کتان کشی</b> و برای لباس راحتی پرشست‌وشو <b>اسپان</b> بهترین کاربرد را دارند.</div>
<h2>دورس چیست؟</h2>
<p>دورس یک نوع پارچه کشباف (بافتنی) است که رویش صاف و پشتش حلقه‌حلقه یا کرکی است. لباسی که از این پارچه دوخته شود را هم «دورس» می‌گویند: بلوز آستین‌بلند گرم بدون کلاه و زیپ. دورس از تیشرت ضخیم‌تر و گرم‌تر است و برای پاییز و زمستان پوشیده می‌شود؛ مثل ${a(60191258, "دورس دو نخ لاکرا")}.</p>
<h2>دورس دو نخ و سه نخ چه فرقی دارند؟</h2>
<p>«نخ» تعداد رشته‌هایی است که در بافت به هم تابیده شده‌اند. <b>دو نخ</b> سبک‌تر و انعطاف‌پذیرتر است و برای پاییز و داخل خانه مناسب است. <b>سه نخ</b> ضخیم‌تر، سنگین‌تر و گرم‌تر است و برای زمستان سرد انتخاب بهتری است. اگر دورس «لاکرا» باشد یعنی کمی الیاف کشسان دارد و راحت‌تر تن می‌شود.</p>
<h2>توکرک یعنی چه؟</h2>
<p>توکرک (داخل کرکی) یعنی سطح داخلی پارچه برس خورده و نرم و پرزدار شده است. این لایه هوا را نگه می‌دارد و لباس را گرم‌تر می‌کند؛ برای همین بیشتر در هودی و سویشرت زمستانی استفاده می‌شود، مثل ${a(62560754, "هودی بیسیک توکرک")}.</p>
<h2>فرق اسپان با نخ پنبه</h2>
<ul><li><b>نخ پنبه</b> از الیاف طبیعی پنبه است؛ عرق را جذب می‌کند، خنک است و حساسیت پوستی کمتری دارد. در شست‌وشوی داغ ممکن است کمی آب برود.</li><li><b>اسپان</b> (در بازار ایران) معمولاً به پارچه‌ای گفته می‌شود که الیاف مصنوعی یا ترکیبی دارد؛ ارزان‌تر است، کمتر چروک می‌شود و رنگش بادوام است، اما به خنکی پنبه نیست.</li></ul>
<p>برای تیشرت تابستانی و لباسی که مستقیم روی پوست است، نخ پنبه بهتر است؛ برای شلوار راحتی و ورزشی که زیاد شسته می‌شود، اسپان هم انتخاب خوبی است، مثل ${a(36854712, "شلوار اسپان دمپا ساده")}.</p>
<h2>نخ پنبه ۲۸ و ۳۰ یعنی چه؟</h2>
<p>عدد، نمره نخ است: هرچه عدد <b>کوچک‌تر</b> باشد، نخ کلفت‌تر و پارچه ضخیم‌تر است. پنبه ۲۸ کمی ضخیم‌تر از ۳۰ و ۳۲ است، دیرتر فرمش را از دست می‌دهد و بدن‌نما نیست؛ مثل ${a(44440219, "تیشرت ساده پنبه ۲۸")}. نمره‌های بالاتر نازک‌تر و خنک‌ترند و برای گرمای شدید مناسب‌ترند.</p>
<h2>کتان کشی چیست؟</h2>
<p>کتان در بازار پوشاک ایران به پارچه بافته‌شده (تاری‌پودی) محکم با بافت مورب گفته می‌شود که برای شلوار استفاده می‌شود. «کشی» یعنی کمی الیاف کشسان دارد؛ پس هم فرم مرتب شلوار را دارد و هم هنگام نشستن و راه رفتن راحت است. ${a(54126455, "شلوار کارگو شش جیب کتان")} و <a href="${ctx.BASE}/c/pants/katan/">شلوارهای کتان مردانه</a> را ببینید.</p>
<h2>کبریتی و مراکشی</h2>
<p><b>کبریتی</b> بافتی با خط‌های ریز برجسته و موازی است (شبیه چوب کبریت‌های کنار هم) که به لباس جلوه می‌دهد. <b>مراکشی</b> در بازار به پارچه کشبافی با بافت ریز برجسته و خنک گفته می‌شود که بیشتر در تیشرت و پیراهن تابستانی به کار می‌رود؛ مثل ${a(45325429, "تیشرت کبریتی مراکشی")}. درباره پیراهن مراکشی بیشتر در <a href="${ctx.BASE}/guide/moroccan-fabric-men/">این راهنما</a> بخوانید.</p>
<h2>سنگشور یعنی چه؟</h2>
<p>سنگشور (استون‌واش) یعنی لباس بعد از دوخت با سنگ یا مواد مخصوص شسته شده تا رنگش کمی کهنه و نرم شود. نتیجه، لباسی با ظاهر وینتیج است که از همان روز اول جمع نمی‌شود؛ مثل ${a(46296076, "تیشرت سنگشور باکسی")}.</p>
<h2>کدام را بخرم؟</h2>
<ul><li>تابستان و تیشرت روزمره: نخ پنبه (۲۸ تا ۳۰).</li><li>پاییز: دورس دو نخ یا بلوز پنبه آستین‌بلند.</li><li>زمستان: دورس سه نخ یا هودی توکرک.</li><li>شلوار بیرون: کتان کشی؛ شلوار خانه و ورزش: نخی یا اسپان.</li></ul>
<p>برای مقایسه هودی، سویشرت و دورس از نظر کاربرد، <a href="${ctx.BASE}/guide/hoodie-sweatshirt/">این راهنما</a> را بخوانید.</p>`;
    },
  },
  {
    slug: "yalda-outfit-men",
    date: "2026-11-03",
    updated: "2026-11-26",
    seoTitle: "لباس مردانه یلدایی ۱۴۰۵ | ست شب یلدا زرشکی و یشمی",
    title: "لباس شب یلدا مردانه ۱۴۰۵؛ ست یلدایی شیک بدون طرح هندوانه (مردانه و پدر و پسر)",
    desc: "برای شب یلدا ۱۴۰۵ چه بپوشیم؟ ست یلدایی مردانه با رنگ‌های زرشکی، یشمی و مشکی، ست پدر و پسر برای عکس خانوادگی و پیشنهاد برای آقایان سایز بزرگ؛ با مدل‌های واقعی المارت.",
    cats: ["sweat", "polo", "kids"],
    faq: [
      ["برای شب یلدا آقایان چه رنگی بپوشند تا بدون طرح هندوانه هم یلدایی باشد؟", "بهترین رنگ‌های لباس مردانه یلدایی، زرشکی تیره (رنگ انار) و سبز یشمی تیره است؛ اگر یکی از این دو رنگ را با شلوار مشکی یا طوسی ست کنید، هم شیک است و هم در سایر روزهای زمستان پوشیده می‌شود."],
      ["ست یلدایی پدر و پسر را چطور هماهنگ کنیم؟", "نیازی نیست لباس‌ها کاملاً یک شکل باشند؛ کافی است پدر و پسر هر دو رنگ یشمی یا زرشکی بپوشند و شلوار مشکی یا طوسی انتخاب کنند تا در عکس خانوادگی یکدست دیده شوند."],
      ["کی برای لباس شب یلدا سفارش بدهیم؟", "سفارش‌ها از روز اول کاری از تبریز ارسال می‌شوند؛ برای اطمینان از رسیدن بسته پیش از ۳۰ آذر، حداقل یک تا دو هفته قبل سفارش خود را ثبت کنید."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>شب یلدا (۳۰ آذر ۱۴۰۵) بیشتر یک دورهمی خانوادگی است تا مهمانی رسمی؛ لباس باید گرم و راحت باشد و در عکس‌ها خوب دیده شود. بیشتر پیشنهادهای اینترنتی تیشرت با چاپ هندوانه و انار است که خیلی از آقایان دوستش ندارند. راه ساده‌تر این است که <b>رنگ یلدا</b> را بپوشید، نه طرحش.</p>
<div class="note"><b>پیشنهاد سریع یلدا:</b> یک <a href="${ctx.BASE}/c/sweatshirt/burgundy/">دورس یا هودی زرشکی</a> یا <a href="${ctx.BASE}/c/sweatshirt/jade/">دورس یشمی مردانه</a> را با شلوار اسلش مشکی ست کنید؛ هم حال‌وهوای یلدا دارد و هم بعد از ۳۰ آذر کل زمستان کاربردی است.</div>
<h2>رنگ‌های یلدایی برای آقایان</h2>
<ul><li><b>زرشکی و قرمز تیره:</b> رنگ انار است، اما در لباس مردانه وقتی تیره باشد شیک‌تر از قرمز روشن دیده می‌شود.</li><li><b>یشمی و سبز تیره:</b> رنگ پوست هندوانه؛ با مشکی و کرمی بسیار خوب ست می‌شود.</li><li><b>مشکی:</b> رنگ شب بلند؛ اگر یک تکه زرشکی یا یشمی کنارش باشد، ست کامل یلدایی می‌شود.</li></ul>
<h2>۱. ست گرم و ساده برای دورهمی</h2>
<p>${a(60094668, "دورس دو نخ لاکرا")} در رنگ زرشکی، با شلوار مشکی یا طوسی. دورس گرم است و اگر مهمانی در خانه‌ای با گرمایش زیاد است، تیشرت زیرش نپوشید تا گرمتان نشود.</p>
<h2>۲. ست مرتب‌تر با یقه</h2>
<p>${a(60467399, "پولوشرت کبریتی یقه سفید")} در رنگ یشمی یا مشکی، با ${a(53762676, "شلوار بگ کتان کشی")} یا شلوار کتان تیره. یقه، ظاهر را رسمی‌تر از دورس می‌کند و برای خانه بزرگ‌ترها انتخاب امنی است.</p>
<h2>۳. ست یکدست</h2>
<p>اگر نمی‌خواهید وقت زیادی برای ست کردن بگذارید، ${a(60209573, "ست بلوز و شلوار یقه‌دار")} بالا و پایین را از یک پارچه دارد؛ رنگ یشمی یا مشکی آن برای شب یلدا مناسب است.</p>
<h2>۴. ست پدر و پسر برای عکس خانوادگی</h2>
<p>برای عکس یلدا لازم نیست لباس‌ها عین هم باشند؛ کافی است رنگشان یکی باشد. پدر ${a(58897534, "هودی دورس دو نخ")} یا دورس یشمی بپوشد و پسر ${a(64346408, "دورس حوله‌ای پسرانه")} یشمی؛ شلوار هر دو مشکی یا طوسی. یک رنگ مشترک در عکس، هماهنگ‌تر از دو لباس کاملاً یکسان دیده می‌شود.</p>
<h2>۵. برای آقایان سایز بزرگ</h2>
<p>رنگ تیره (زرشکی تیره، یشمی، مشکی) را برای بالاتنه انتخاب کنید و لباس را اندازه بخرید، نه گشاد. برای انتخاب سایز، <a href="${ctx.BASE}/size/weight/">سایز بر اساس وزن</a> و <a href="${ctx.BASE}/guide/big-size-men/">راهنمای لباس مردان شکم‌دار</a> را ببینید.</p>
<h2>زمان سفارش</h2>
<p>سفارش‌ها از روز اول کاری از تبریز ارسال می‌شوند؛ برای اینکه لباس پیش از ۳۰ آذر برسد، یکی دو هفته زودتر سفارش دهید. اگر در تبریز هستید، می‌توانید <a href="${ctx.BASE}/tabriz-bazaar/">حضوری به غرفه</a> بیایید.</p>`;
    },
  },
  {
    slug: "moroccan-fabric-men",
    date: "2026-11-03",
    updated: "2026-11-26",
    seoTitle: "پیراهن و تیشرت مراکشی مردانه؛ ویژگی‌های پارچه مراکشی",
    title: "پیراهن و تیشرت مراکشی مردانه؛ پارچه مراکشی چیست و برای چه کسی مناسب است",
    desc: "پارچه مراکشی در لباس مردانه چیست؟ ویژگی پیراهن یقه انگلیسی و تیشرت مراکشی، فرق آن با نخ پنبه، اتو و چروک، مناسب چه فصلی است و چطور بشوییم؛ با مدل‌های واقعی.",
    cats: ["shirt", "tshirt"],
    faq: [
      ["پارچه مراکشی در لباس مردانه چیست؟", "یک پارچه کشباف با سطح برجسته (کبریتی، بیسکویتی یا لوزی) است که طرح آن داخل خود بافت شکل گرفته و به بدن نمی‌چسبد."],
      ["پیراهن مراکشی بهتر است یا تیشرت نخ پنبه؟", "برای مهمانی، سفر و محیط کار به دلیل کم‌چروک بودن پیراهن مراکشی مرتب‌تر است؛ برای ورزش، گرمای شدید و پوست حساس نخ پنبه خالص خنک‌تر است."],
      ["پیراهن و تیشرت مراکشی را چطور بشوییم و اتو کنیم؟", "پشت‌ورو با آب سرد یا ولرم و دور ملایم بشویید، روی چوب‌لباسی خشک کنید و در صورت نیاز از پشت پارچه اتوی ملایم بزنید."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>اگر «پارچه مراکشی» را جستجو کنید، بیشتر مطالب درباره لباس‌های سنتی کشور مراکش است. در بازار پوشاک ایران اما «مراکشی» اسم یک نوع پارچه است که در پیراهن آستین کوتاه، تیشرت و پولوشرت مردانه زیاد دیده می‌شود. این صفحه همان را توضیح می‌دهد.</p>
<div class="note"><b>خلاصه سریع:</b> پارچه مراکشی یک کشباف برجسته، کم‌چروک و نیمه‌کشی است که به بدن نمی‌چسبد؛ برای ظاهر مرتب در کار و مهمانی بهار و تابستان عالی است و طرح آن در بافت پارچه است نه چاپ.</div>
<h2>پارچه مراکشی در لباس مردانه یعنی چه؟</h2>
<p>پارچه‌ای حلقوی (کشباف) است که روی آن نقش‌های ریز برجسته بافته شده؛ گاهی به شکل خطوط موازی (کبریتی)، گاهی دانه‌دانه (بیسکویتی) و گاهی لوزی. طرح در خود بافت است، نه چاپ؛ پس با شست‌وشو پاک نمی‌شود. چون سطح پارچه برجسته است، کمتر به بدن می‌چسبد.</p>
<h2>ویژگی‌ها</h2>
<ul><li><b>کم‌چروک:</b> بیشتر پیراهن‌های مراکشی بدون اتو هم مرتب می‌مانند؛ برای سفر و محل کار راحت‌اند.</li><li><b>کمی کشسان:</b> مثل بقیه پارچه‌های کشباف، هنگام نشستن و حرکت جا باز می‌کنند.</li><li><b>بدن‌نما نیست:</b> بافت برجسته، چین و برجستگی‌های بدن را کمتر نشان می‌دهد.</li><li><b>مناسب فصل گرم و معتدل:</b> برای بهار و تابستان و روزهای ملایم پاییز.</li></ul>
<h2>مراکشی بهتر است یا نخ پنبه؟</h2>
<p>نخ پنبه خالص عرق را بهتر جذب می‌کند و برای گرمای شدید و پوست حساس بهتر است. مراکشی مرتب‌تر و کم‌چروک‌تر است و ظاهر رسمی‌تری دارد. اگر لباسی می‌خواهید که هم برای کار و مهمانی مناسب باشد و هم راحت، پیراهن مراکشی انتخاب خوبی است؛ برای ورزش و پیاده‌روی، تیشرت نخ پنبه.</p>
<h2>مدل‌های مراکشی المارت</h2>
<ul><li>${a(47475290, "پیراهن آستین کوتاه یقه انگلیسی مراکشی با بافت بیسکویتی")}: یقه پیراهنی و دکمه‌دار، برای ظاهر نیمه‌رسمی.</li><li>${a(45025631, "پیراهن آستین کوتاه یقه انگلیسی مشکی")}: همان فرم، در رنگ مشکی.</li><li>${a(45325429, "تیشرت کبریتی مراکشی")}: یقه گرد و راحت‌تر، برای استفاده روزمره.</li></ul>
<p>همه پیراهن‌ها را در <a href="${ctx.BASE}/c/shirt/">پیراهن مردانه</a> ببینید.</p>
<h2>با چه ست کنیم؟</h2>
<p>پیراهن مراکشی با شلوار کتان، جین و شلوار پارچه‌ای ست می‌شود. برای مهمانی، پیراهن تیره را با شلوار روشن‌تر بپوشید؛ برای روزمره، با شلوار اسلش ساده و کفش اسپرت.</p>
<h2>شست‌وشو و نگهداری</h2>
<p>پشت‌ورو و با آب سرد یا ولرم بشویید، با دور ملایم و بدون خشک‌کن داغ. پیراهن را روی چوب‌لباسی خشک کنید تا بدون اتو صاف بماند؛ اگر لازم شد، اتوی ملایم از پشت پارچه بکشید تا برجستگی بافت صاف نشود.</p>
<p>برای آشنایی با بقیه پارچه‌ها، <a href="${ctx.BASE}/guide/fabric-guide/">راهنمای دورس، اسپان، نخ پنبه و کتان کشی</a> را بخوانید.</p>`;
    },
  },
  {
    slug: "slash-pants-style",
    date: "2026-11-03",
    updated: "2026-11-26",
    seoTitle: "شلوار اسلش با چی ست میشه؟ راهنمای ست مردانه",
    title: "شلوار اسلش با چی ست میشه؟ ست کردن شلوار اسلش مردانه با تیشرت، هودی و کفش",
    desc: "شلوار اسلش چیست و با چه بپوشیم؟ ست شلوار اسلش مردانه با تیشرت، پولوشرت، هودی و پیراهن، اینکه با شلوار اسلش چه کفشی بپوشیم و قاعده رنگ برای هر مدل اسلش.",
    cats: ["pants", "tshirt"],
    faq: [
      ["با شلوار اسلش چه کفشی بپوشیم؟", "کتانی و کفش اسپرت سفید یا مشکی بهترین و همه‌کاره‌ترین انتخاب است؛ در زمستان با اسلش کارگو یا کتان کشی تیره می‌توانید نیم‌بوت هم بپوشید، اما کفش رسمی چرم مناسب اسلش نیست."],
      ["شلوار اسلش با پولوشرت یا پیراهن هم ست می‌شود؟", "بله؛ اسلش کتان کشی تیره (ساده و بدون چاپ شلوغ) با پولوشرت یا تی‌شرت یقه‌دار برای محیط کار نیمه‌رسمی و دورهمی کاملاً مرتب است."],
      ["شلوار اسلش مشکی با چه رنگ بالاتنه‌ای بهتر است؟", "مشکی با تمام رنگ‌ها ست می‌شود؛ برای استایل روزمره سفید، طوسی و کرمی و برای پاییز زرشکی، یشمی و سرمه‌ای ترکیب‌های مطمئنی هستند."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p><b>شلوار اسلش چیست؟</b> اسم بازاری شلوار اسپرت راحت با کمر کش یا بنددار است که از کتان کشی، اسپان یا نخ دوخته می‌شود؛ چیزی بین شلوار ورزشی و شلوار بیرونی. همین وسط بودن باعث می‌شود با تقریباً همه لباس‌های غیررسمی ست شود. اگر هنوز نمی‌دانید چه جنس و مدلی بخرید، اول <a href="${ctx.BASE}/guide/slash-pants/">راهنمای خرید شلوار اسلش</a> را بخوانید؛ این صفحه درباره ست کردن آن است.</p>
<div class="note"><b>خلاصه سریع:</b> یک تکه را ساده نگه دارید (شلوار کارگو یا بغل‌نوار با تیشرت ساده؛ تیشرت طرح‌دار با شلوار تیره ساده)، کفش <b>کتانی سفید یا مشکی</b> بپوشید و برای ظاهر رسمی‌تر اسلش کتان کشی را با پولوشرت ست کنید.</div>
<h2>قاعده اول: یک تکه ساده، یک تکه جذاب</h2>
<p>اگر شلوار نوار کناری، جیب کارگو یا رنگ خاص دارد، بالاتنه را ساده بپوشید. اگر تیشرت طرح‌دار یا رنگی است، شلوار ساده و تیره باشد. دو تکه شلوغ کنار هم، ست را به هم می‌ریزد.</p>
<h2>شلوار اسلش با تیشرت</h2>
<ul><li><b>اسلش بغل‌نوار + تیشرت ساده:</b> ${a(36616362, "شلوار بغل‌نوار")} با ${a(54235165, "تیشرت مشکی ساده")} یا سفید؛ رنگ تیشرت را هم‌رنگ نوار شلوار انتخاب کنید تا ست کامل شود.</li><li><b>اسلش کارگو + تیشرت باکسی:</b> ${a(54126455, "شلوار کارگو شش جیب")} با ${a(54127749, "تیشرت باکسی")}؛ استایل خیابانی امروز همین است. تیشرت را داخل شلوار نکنید.</li><li><b>اسلش ساده + تیشرت طرح‌دار:</b> شلوار مشکی یا طوسی بهترین زمینه برای <a href="${ctx.BASE}/c/tshirt/printed/">تیشرت طرح‌دار</a> است.</li></ul>
<h2>شلوار اسلش با پولوشرت و پیراهن</h2>
<p>برای جایی که کمی مرتب‌تر باید بود (محل کار نیمه‌رسمی، دیدن اقوام)، اسلش کتان کشی تیره را با <a href="${ctx.BASE}/c/polo/collar/">تیشرت یقه‌دار</a> یا پیراهن آستین کوتاه بپوشید. اسلش اسپان و نخی برای این موقعیت‌ها زیادی راحتی به نظر می‌رسد.</p>
<h2>شلوار اسلش با هودی و دورس</h2>
<p>هودی و اسلش ست همیشگی پاییز و زمستان است. اگر هودی رنگی است، شلوار مشکی یا طوسی؛ اگر هودی مشکی است، شلوار یشمی یا طوسی روشن ست جذاب‌تری می‌سازد. <a href="${ctx.BASE}/c/sweatshirt/hoodie/">هودی‌ها</a> را ببینید.</p>
<h2>با شلوار اسلش چه کفشی بپوشیم؟</h2>
<ul><li><b>کتانی و کفش اسپرت:</b> بهترین و رایج‌ترین انتخاب. با دمپای مچی یا کش‌دار، شلوار روی کفش جمع می‌شود و کفش کامل دیده می‌شود؛ ${a(55720135, "کفش اسپرت سه‌خط")} یا ${a(43999644, "کفش اسپرت دوردوخت")}.</li><li><b>نیم‌بوت:</b> با اسلش کارگو و کتان کشی تیره برای زمستان.</li><li><b>دمپایی روفرشی و صندل:</b> فقط برای خانه و سفر؛ برای بیرون، ست را خیلی خانگی نشان می‌دهد.</li><li><b>کفش رسمی چرم:</b> با اسلش ست نمی‌شود.</li></ul>
<p>کفش سفید ساده با تقریباً هر رنگ اسلش هماهنگ است؛ اگر فقط یک جفت کتانی دارید، سفید یا مشکی بخرید.</p>
<h2>رنگ شلوار اسلش با چه رنگی ست می‌شود؟</h2>
<ul><li><b>مشکی:</b> با همه رنگ‌ها؛ امن‌ترین انتخاب.</li><li><b>طوسی:</b> با سفید، مشکی، سرمه‌ای و یشمی.</li><li><b>یشمی و سبز ساقه‌ای:</b> با مشکی، سفید، کرمی و نسکافه‌ای؛ با قرمز و نارنجی نه.</li><li><b>کرمی و استخوانی:</b> با مشکی، سرمه‌ای، قهوه‌ای و یشمی.</li></ul>
<h2>اسلش برای آقایان سایز بزرگ</h2>
<p>اسلش با دمپای ساده یا مچی متعادل بهتر از دمپای خیلی تنگ است، چون تناسب بالا و پایین تنه را حفظ می‌کند. بالاتنه را تیره و اندازه بپوشید. <a href="${ctx.BASE}/big-size/pants/">شلوار اسلش سایز بزرگ</a> را ببینید.</p>`;
    },
  },
  {
    slug: "big-size-winter-men",
    date: "2026-11-26",
    seoTitle: "هودی و دورس سایز بزرگ مردانه؛ راهنمای انتخاب تا {MAX}",
    title: "راهنمای خرید هودی، دورس و سویشرت سایز بزرگ مردانه (3XL تا {MAX})",
    desc: "چطور هودی و دورس سایز بزرگ مردانه بخریم که شیک بایستد؟ مقایسه دورس دو نخ، سه‌نخ و توکرک، جدول سایز بر اساس وزن و پیشنهاد ست زمستانی.",
    cats: ["sweat", "pants"],
    faq: [
      ["برای وزن ۱۱۰ تا ۱۳۰ کیلو هودی یا دورس چه سایزی بگیریم؟", "در جدول سایز المارت وزن ۱۰۵ تا ۱۱۸ کیلوگرم معمولاً با 4XL و ۱۱۸ تا ۱۳۲ کیلوگرم با 5XL مطابقت دارد. اگر روی لباس دیگر می‌پوشید، عرض سینه مدل را با جدول صفحه محصول مقایسه کنید."],
      ["برای آقایان شکم‌دار هودی بهتر است یا سویشرت زیپ‌دار؟", "هودی تک‌لایه برای ظاهر یکدست و سویشرت تمام‌زیپ (وقتی باز پوشیده شود) برای ایجاد خط عمودی و لاغرتر نشان دادن بالاتنه انتخاب‌های بسیار خوبی هستند."],
      ["دورس دو نخ بخریم یا توکرک؟", "دورس دو نخ برای پاییز، فضاهای سرپوشیده و لایه‌پوشی سبک‌تر است؛ دورس سه‌نخ و توکرک برای سرمای زمستان و استفاده در فضای باز گرمای بیشتری می‌دهد."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>پیدا کردن لباس گرم مردانه در سایزهای بزرگ که هم سینه و شکم را راحت بپوشاند و هم روی سرشانه نیفتد سخت است. این راهنما مخصوص آقایانی است که در پاییز و زمستان دنبال هودی، دورس و سویشرت سایز بزرگ از 3XL تا {MAX} هستند و می‌خواهند بدون ظاهر حجیم، گرم و مرتب بپوشند.</p>
<h2>۱. انتخاب پارچه: دو نخ، سه‌نخ یا توکرک؟</h2>
<table><thead><tr><th>جنس</th><th>ضخامت و گرما</th><th>بهترین کاربرد</th></tr></thead><tbody>
<tr><td>دورس دو نخ لاکرا</td><td>متوسط و ایستا</td><td>پاییز، محیط کار، پوشیدن زیر کاپشن</td></tr>
<tr><td>دورس سه‌نخ</td><td>ضخیم و سنگین</td><td>هوای سرد و استفاده بیرون بدون کاپشن</td></tr>
<tr><td>توکرک (داخل کرکی)</td><td>نرم و بسیار گرم</td><td>زمستان، پیاده‌روی سرد، سفر</td></tr>
</tbody></table>
<p>پارچه‌های خیلی شل یا کشباف نازک برجستگی شکم را بیشتر نشان می‌دهند؛ دورس دو نخ و توکرک ایستایی بهتری روی تن می‌سازند. برای نمونه ${a(63645940, "هودی مردانه مشکی ساده")} از دورس توکرک لاکرادار تا 4XL تولید شده است.</p>
<h2>۲. قواره و جزئیاتی که اندام را متناسب‌تر نشان می‌دهد</h2>
<ul><li><b>رنگ‌های پایه و تیره:</b> مشکی، سرمه‌ای و طوسی تیره برای بالاتنه امن‌ترین انتخاب‌اند.</li><li><b>قد لباس:</b> در سایز 4XL قد استاندارد بالاتنه حدود ۸۰ سانتی‌متر است تا موقع نشستن بالا نرود.</li><li><b>یقه نیم‌زیپ یا کلاه متعادل:</b> نیم‌زیپ نگاه را به سمت یقه می‌برد و برای آقایانی که نمی‌خواهند لباسشان خیلی اسپرت یا بسته باشد مناسب است؛ مدل ${a(64343889, "دورس نیم‌زیپ پشت‌چاپ")} و مجموعه <a href="${ctx.BASE}/big-size/sweatshirt/">هودی و دورس سایز بزرگ</a> را ببینید.</li></ul>
<h2>۳. جدول وزن و اندازه برای سایزهای بزرگ</h2>
<table><thead><tr><th>سایز</th><th>قد پیشنهادی</th><th>وزن (کیلوگرم)</th><th>عرض سینه حدود</th></tr></thead><tbody>${SIZE_ROWS.slice(3).map((r) => `<tr><td style="direction:ltr;font-weight:800"><a href="${ctx.BASE}/size/${r[0].toLowerCase()}/">${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]} سانت</td></tr>`).join("")}</tbody></table>
<p>اگر بین دو سایز هستید، به صفحه <a href="${ctx.BASE}/size/weight/">سایز بر اساس وزن</a> بروید یا عرض سینه لباس راحت خودتان را با جدول اندازه همان محصول مقایسه کنید.</p>
<h2>۴. ست زمستانی سایز بزرگ</h2>
<p>بهترین ترکیب روزمره، هودی یا دورس تیره همراه با ${a(54125344, "شلوار اسلش کتان کشی سایز بزرگ")} یا ${a(42728145, "شلوار اسلش اسپان نخی سایز بزرگ")} است؛ کمر کشی و قد بلندتر شلوارهای سایز بزرگ المارت، راحتی کامل هنگام نشستن و رانندگی را تضمین می‌کند. همه مدل‌های پایین‌تنه را در <a href="${ctx.BASE}/big-size/pants/">شلوار اسلش سایز بزرگ</a> ببینید.</p>`;
    },
  },
  {
    slug: "gift-for-men-clothing",
    date: "2026-11-26",
    seoTitle: "راهنمای خرید لباس هدیه مردانه با قد و وزن",
    title: "راهنمای خرید لباس هدیه مردانه؛ انتخاب سایز دقیق فقط با قد و وزن",
    desc: "می‌خواهید برای همسر، پدر یا برادر لباس هدیه بخرید ولی سایزش را دقیق نمی‌دانید؟ راهنمای انتخاب مدل کم‌ریسک و پیدا کردن سایز فقط با قد و وزن.",
    cats: ["sweat", "polo", "tshirt"],
    faq: [
      ["اگر فقط قد و وزن طرف مقابل را بدانیم چطور سایز لباس هدیه را انتخاب کنیم؟", "با جدول وزن به سایز یا سایزیاب ۱۰ ثانیه‌ای المارت، وزن و قد تقریبی را وارد کنید. برای مثال وزن ۷۵ تا ۸۵ کیلو معمولاً XL و ۸۵ تا ۹۵ کیلو معمولاً 2XL است."],
      ["کم‌ریسک‌ترین لباس مردانه برای هدیه چیست؟", "پولوشرت نیم‌زیپ، دورس ساده یا هودی بیسیک در رنگ‌های مشکی، سرمه‌ای یا طوسی؛ چون قواره استاندارد دارند و با شلوارهای روزمره به‌راحتی ست می‌شوند."],
      ["اگر سایز هدیه اندازه نبود امکان تعویض وجود دارد؟", "در صورت استفاده‌نشدن و سالم بودن برچسب و بسته‌بندی، هم در خرید باسلام و هم در سفارش مستقیم امکان بررسی و هماهنگی تعویض سایز طبق صفحه ارسال و مرجوعی وجود دارد."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>بزرگ‌ترین نگرانی هنگام خرید لباس هدیه برای همسر، پدر یا برادر این است که «اگر سایزش نخورد چه کار کنم؟» خوشبختانه اگر قد و وزن تقریبی او را بدانید و مدلی با قواره مطمئن انتخاب کنید، احتمال اشتباه به حداقل می‌رسد.</p>
<h2>۱. پیدا کردن سایز فقط با وزن و قد</h2>
<table><thead><tr><th>وزن تقریبی</th><th>قد معمول</th><th>سایز پیشنهادی</th></tr></thead><tbody>${SIZE_ROWS.map((r) => `<tr><td>${r[2]} کیلو</td><td>${r[1]} سانت</td><td style="direction:ltr;font-weight:800"><a href="${ctx.BASE}/size/${r[0].toLowerCase()}/">${r[0]}</a></td></tr>`).join("")}</tbody></table>
<p>اگر فرد موردنظر شکم دارد یا لباس آزاد دوست دارد، یک سایز بالاتر بگیرید. همچنین می‌توانید دقیق‌تر در <a href="${ctx.BASE}/size-guide/">سایزیاب آنلاین المارت</a> عددها را بررسی کنید یا مدل‌های بالای 3XL را در <a href="${ctx.BASE}/big-size/">بخش سایز بزرگ</a> ببینید.</p>
<h2>۲. کم‌ریسک‌ترین مدل‌ها برای هدیه</h2>
<ul><li><b>برای محیط کار و مهمانی:</b> ${a(53765502, "پولوشرت نیم‌زیپ گلدوزی‌شده")} یا ${a(53614296, "تیشرت یقه انگلیسی خنک")} ظاهر مرتب‌تری از تیشرت ساده دارند و بین مردان مختلف بسیار محبوب‌اند.</li><li><b>برای پاییز و زمستان:</b> ${a(60191258, "دورس دو نخ لاکرا ۱۰۰٪ پنبه")} یا ${a(60937967, "سویشرت کلاه‌دار تمام‌زیپ")} انتخاب‌های گرم و کاربردی هستند؛ مدل‌های تمام‌زیپ از نظر تن‌خور انعطاف بیشتری دارند.</li><li><b>برای هدیه کامل و بی‌دردسر:</b> ${a(60209573, "ست بلوز و شلوار یقه‌دار کبریتی")} بالا و پایین هماهنگ را یک‌جا دارد.</li></ul>
<h2>۳. چه رنگ‌هایی همیشه جواب می‌دهند؟</h2>
<p>اگر سلیقه دقیق رنگی را نمی‌دانید، سراغ رنگ‌های پایه بروید: <b>مشکی، سرمه‌ای، طوسی یا کرمی</b>. این رنگ‌ها تقریباً با هر شلوار و کفشی که در کمد است ست می‌شوند. برای دیدن مدل‌های تفکیک‌شده بر اساس رنگ می‌توانید از <a href="${ctx.BASE}/c/sweatshirt/black/">دورس و هودی مشکی</a> یا <a href="${ctx.BASE}/c/polo/navy/">پولوشرت سرمه‌ای</a> شروع کنید.</p>
<p>پیش از نهایی کردن خرید، شرایط تعویض سایز را در صفحه <a href="${ctx.BASE}/shipping-returns/">ارسال و مرجوعی</a> بخوانید یا در <a href="${ctx.BASE}/contact/">تماس با المارت</a> با ما مشورت کنید.</p>`;
    },
  },
  {
    slug: "cargo-and-baggy-pants-men",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "شلوار کارگو و بگ مردانه با چی ست میشه؟ راهنمای خرید",
    title: "شلوار کارگو، بگ و راسته مردانه؛ فرق مدل‌ها و راهنمای ست کردن با تیشرت و هودی",
    desc: "تفاوت شلوار کارگو، بگ و راسته کتان کشی در چیست؟ راهنمای انتخاب قواره متناسب با قد و اندام، ست کردن با تیشرت باکسی یا هودی و نگهداری.",
    cats: ["pants", "tshirt"],
    faq: [
      ["تفاوت اصلی شلوار کارگو، بگ و راسته در چیست؟", "شلوار کارگو جیب‌های کاربردی روی پا دارد، شلوار بگ با برش گشاد از بالا تا پایین برای استایل آزاد ساخته شده و شلوار راسته فرم صاف و کلاسیک‌تری روی کفش دارد."],
      ["با شلوار کارگو یا بگ چه بالاتنه و کفشی ست می‌شود؟", "شلوار کارگو و بگ با تیشرت باکسی، هودی توکرک و کتانی اسپرت بهترین هماهنگی را دارند؛ اگر شلوار کارگو جیب‌دار است بالاتنه را ساده و تک‌رنگ نگه دارید."],
      ["برای آقایان قدبلند یا سایز بزرگ شلوار کارگو بهتر است یا راسته؟", "در سایزهای بزرگ تا {MAX:pants} شلوار کارگو یا اسلش کتان کشی راسته با قد ۱۰۵ تا ۱۱۰ سانتی‌متر و کمرکش راحت‌ترین تعادل میان آزادی ران و ظاهر مرتب را می‌سازد."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>انتخاب بین <b>شلوار کارگو</b>، <b>شلوار بگ</b> و <b>اسلش راسته</b> فقط به مد روز مربوط نیست؛ هر کدام فرم پا و کاربرد متفاوتی دارند. اگر شلواری می‌خواهید که هم جای وسیله داشته باشد، هم با تیشرت و هودی راحت ست شود، مقایسه دقیق این سه مدل کار را ساده می‌کند.</p>
<div class="note"><b>خلاصه سریع:</b> برای کاربرد روزمره و جیب‌های اضافه <a href="${ctx.BASE}/c/pants/cargo/">شلوار کارگو مردانه</a>، برای استایل آزاد خیابانی با <a href="${ctx.BASE}/c/tshirt/boxy/">تیشرت باکسی</a> شلوار بگ، و برای محیط کار نیمه‌رسمی و ظاهر کلاسیک <a href="${ctx.BASE}/c/pants/straight/">شلوار راسته و دمپا ساده</a> انتخاب هوشمندانه‌تری است.</div>
<h2>۱. مقایسه شلوار کارگو، بگ و اسلش راسته</h2>
<table><thead><tr><th>مدل شلوار</th><th>فرم پا و دمپا</th><th>بهترین کاربرد</th></tr></thead><tbody>
<tr><td>شلوار کارگو شش‌جیب</td><td>راسته یا مچ‌دار با جیب‌های کناری</td><td>سفر، دانشگاه، استفاده روزمره و پیاده‌روی</td></tr>
<tr><td>شلوار بگ کتان کشی</td><td>آزاد و پهن در کل ساق پا</td><td>استایل اسپرت و خیابانی همراه با تیشرت باکسی</td></tr>
<tr><td>شلوار راسته دمپا ساده</td><td>صاف روی کفش بدون جمع‌شدن دمپا</td><td>بیرون، محل کار نیمه‌رسمی و استایل مرتب</td></tr>
</tbody></table>
<h2>۲. جنس مناسب: چرا کتان کشی پرطرفدارتر است؟</h2>
<p>در بیشتر شلوارهای کارگو و بگ روزمره، پارچه <a href="${ctx.BASE}/c/pants/katan/">کتان کشی</a> بهترین تعادل را دارد: روی پا خط صاف می‌اندازد، در نشستن و رانندگی زانو نمی‌اندازد و از اسپان رسمی‌تر دیده می‌شود. مدل‌هایی مثل ${a(54126455, "شلوار کارگو شش جیب کتان کشی")} یا ${a(44436993, "شلوار اسلش کتان کشی چهار جیب مچ‌دار")} و ${a(53762676, "شلوار بگ کتان کشی بغل‌نوار")} برای همین استفاده ساخته شده‌اند.</p>
<h2>۳. با چه بالاتنه و کفشی ست کنیم؟</h2>
<ul><li><b>کارگو شش‌جیب + تیشرت باکسی یا هودی ساده:</b> جیب‌های روی پا نقطه کانونی استایل هستند، پس بالاتنه تک‌رنگ (مشکی، سفید یا کرمی) بهتر دیده می‌شود.</li><li><b>شلوار بگ + تیشرت باکسی یا دورس:</b> تیشرت را بیرون از شلوار بگذارید تا تناسب بالاتنه کوتاه‌تر با گشادی شلوار حفظ شود.</li><li><b>شلوار راسته + <a href="${ctx.BASE}/c/sweatshirt/hoodie/">هودی مردانه</a> یا پولوشرت:</b> با کتانی اسپرت سفید یا مشکی ترکیبی بی‌دردسر می‌سازد.</li></ul>
<p>برای بررسی دقیق دور کمر، فاق و قد شلوار قبل از خرید، جدول سایز اختصاصی هر مدل و <a href="${ctx.BASE}/size/pants/">جدول سایز شلوار اسلش مردانه</a> را بررسی کنید.</p>`;
    },
  },
  {
    slug: "tabriz-menswear-direct-buying",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "خرید مستقیم پوشاک مردانه از تولیدی و بازار تبریز",
    title: "خرید مستقیم پوشاک مردانه از بازار سرپوشیده تبریز؛ از تولید به مصرف و سایز بزرگ تا {MAX}",
    desc: "چرا خرید مستقیم از تولیدی و پخش پوشاک مردانه المارت در بازار تبریز به‌صرفه‌تر است؟ مقایسه قیمت، تنوع سایز تا {MAX}، ارسال روز اول کاری و خرید حضوری یا آنلاین.",
    cats: ["pants", "tshirt", "sweat"],
    faq: [
      ["چطور از غرفه المارت در بازار تبریز خرید مستقیم انجام دهیم؟", "هم می‌توانید از همین سایت (از طریق غرفه رسمی باسلام یا دکمه سفارش مستقیم و دریافت کد پیگیری EL-XXXX) سفارش بدهید، و هم در تبریز حضوری به حجره المارت مراجعه کنید."],
      ["سفارش‌های شهرستان و تبریز چند روزه ارسال می‌شوند؟", "سفارش‌های تأییدشده از روز اول کاری با پست پیشتاز یا سفارشی به سراسر ایران ارسال می‌شوند و در شهر تبریز ارسال با پیک موتوری هم هماهنگ می‌شود."],
      ["آیا المارت فروش عمده و تک‌فروشی سایز بزرگ هم دارد؟", "بله؛ علاوه بر تک‌فروشی در فروشگاه آنلاین با سایزبندی L تا {MAX}، پخش عمده پوشاک مردانه نیز برای همکاران فروشگاهی از طریق صفحه خرید عمده انجام می‌شود."],
    ],
    html: (ctx) => `<p>بسیاری از خریداران ترجیح می‌دهند به‌جای واسطه‌های چندمرحله‌ای، لباس مردانه را مستقیم از حجره بازار یا تولیدی تهیه کنند تا هم قیمت واقعی‌تر باشد و هم اندازه و جنس پیش از ارسال کنترل شود. المارت با {YEARS} سال سابقه خانوادگی در بازار سرپوشیده تبریز همین مسیر مستقیم را به خرید آنلاین آورده است.</p>
<div class="note"><b>خلاصه سریع:</b> در <a href="${ctx.BASE}/tabriz-bazaar/">فروشگاه بازار سرپوشیده تبریز المارت</a> همه محصولات با قیمت غرفه، عکس‌های واقعی کنار عکس استودیویی، جدول اندازه دقیق و ارسال از روز اول کاری به کل ایران عرضه می‌شوند.</div>
<h2>۱. تفاوت خرید مستقیم بازاری با فروشگاه‌های واسطه‌ای</h2>
<ul><li><b>قیمت واقعی غرفه:</b> حذف واسطه‌ها باعث می‌شود مدل‌های اقتصادی را در بخش‌هایی مثل <a href="${ctx.BASE}/price/under-1m/">پوشاک مردانه زیر ۱ میلیون تومان</a> و <a href="${ctx.BASE}/price/under-1500k/">زیر ۱٫۵ میلیون تومان</a> ببینید.</li><li><b>بررسی کیفی در حجره:</b> دوخت، رنگ و سایز هر بسته قبل از بسته‌بندی و تحویل به پست کنترل می‌شود.</li><li><b>اطلاعات اندازه شفاف:</b> به‌جای حدس زدن، عرض سینه، قد لباس و دور کمر در جدول صفحه هر محصول و <a href="${ctx.BASE}/size-guide/">سایزیاب آنلاین</a> قرار دارد.</li></ul>
<h2>۲. دو روش مطمئن برای ثبت سفارش آنلاین و حضوری</h2>
<table><thead><tr><th>روش خرید</th><th>مناسب برای</th><th>جزئیات</th></tr></thead><tbody>
<tr><td>خرید امن باسلام</td><td>سفارش آنلاین از سراسر ایران</td><td>پرداخت تحت ضمانت باسلام و انتخاب رنگ و سایز در صفحه غرفه</td></tr>
<tr><td>سفارش مستقیم تلفنی / پیامکی</td><td>هماهنگی فوری یا مشاوره قبل از ارسال</td><td>دریافت کد پیگیری <bdi dir="ltr">EL-XXXX</bdi> و هماهنگی تلفنی یا پیام در روبیکا</td></tr>
<tr><td>خرید حضوری و پیک تبریز</td><td>ساکنین تبریز</td><td>مراجعه به <a href="${ctx.BASE}/big-size/tabriz/">بخش سایز بزرگ تبریز</a> و حجره بازار یا ارسال با پیک</td></tr>
</tbody></table>
<h2>۳. همکاری عمده و دسترسی کامل به کاتالوگ</h2>
<p>فروشگاه‌داران و خریداران عمده می‌توانند از صفحه <a href="${ctx.BASE}/wholesale/">تولیدی و پخش عمده پوشاک مردانه تبریز</a> شرایط همکاری را ببینند و خریداران تک نیز می‌توانند کل کالکشن را در <a href="${ctx.BASE}/shop/">فروشگاه کامل المارت</a> بر اساس سایز تا {MAX} فیلتر کنند. پیش از ثبت سفارش هم جزئیات پست و تعویض را در صفحه <a href="${ctx.BASE}/shipping-returns/">ارسال و مرجوعی</a> بخوانید.</p>
<p>برای آشنایی بیشتر با پیشینه حجره، <a href="${ctx.BASE}/about/">داستان المارت</a> را ببینید.</p>`,
  },
  {
    slug: "gym-and-walking-outfit-men",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "لباس مردانه برای باشگاه و پیاده‌روی | شلوار، تیشرت و کفش",
    title: "راهنمای انتخاب لباس باشگاه و پیاده‌روی مردانه؛ شلوار جیب‌زیپ‌دار، تیشرت نخی و کتانی",
    desc: "برای باشگاه، دویدن و پیاده‌روی طولانی چه شلوار، تیشرت و کفشی بپوشیم؟ مقایسه شلوار اسپان و تمام‌نخ، اهمیت جیب زیپ‌دار، تیشرت نخ پنبه و کفش زیره PU.",
    cats: ["pants", "tshirt", "shoes"],
    faq: [
      ["برای باشگاه و پیاده‌روی شلوار اسپان بهتر است یا تمام‌نخ؟", "برای پیاده‌روی طولانی و هوای گرم شلوار تمام‌نخ خنک‌تر و تنفس‌پذیرتر است؛ برای تمرین باشگاه و شست‌وشوی مکرر، شلوار اسپان نخی سبک‌تر است و کمتر چروک می‌شود."],
      ["چرا در لباس ورزشی مردانه جیب زیپ‌دار مهم است؟", "هنگام دویدن، دستگاه‌های باشگاه یا رانندگی و سفر، جیب زیپ‌دار مانع افتادن گوشی و کلید از جیب شلوار می‌شود."],
      ["چه کفش و تیشرتی برای استفاده هم‌زمان در پیاده‌روی و روزمره مناسب‌تر است؟", "تیشرت نخ پنبه تنفس‌پذیر همراه با کفش اسپرت دوردوخت زیره PU (پلی‌یورتان) به دلیل وزن سبک و جذب ضربه برای راه رفتن طولانی مناسب است."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>لباس باشگاه و پیاده‌روی خوب نباید بعد از ده دقیقه تعریق به تن بچسبد یا هنگام حرکت محدودیت ایجاد کند. انتخاب درست سه بخش دارد: شلوار با آزادی ران و کمر راحت، بالاتنه تنفس‌پذیر و کفش سبک با کفی مقاوم.</p>
<div class="note"><b>خلاصه سریع:</b> برای پیاده‌روی روزانه <a href="${ctx.BASE}/c/pants/cotton/">شلوار نخی یا تمام‌نخ</a> با <a href="${ctx.BASE}/c/tshirt/cotton/">تیشرت نخ پنبه</a>، برای تمرین و تحرک بالا <a href="${ctx.BASE}/c/pants/zip-pocket/">شلوار جیب زیپ‌دار</a> یا <a href="${ctx.BASE}/c/pants/span/">اسپان</a>، و برای مسیرهای طولانی <a href="${ctx.BASE}/c/shoes/">کفش اسپرت زیره PU</a> بهترین ترکیب است.</div>
<h2>۱. انتخاب شلوار: جیب زیپ‌دار، تمام‌نخ یا اسپان؟</h2>
<ul><li><b>شلوار تمام‌نخ برای پیاده‌روی و سفر:</b> تعریق را بهتر عبور می‌دهد و پوست را خنک نگه می‌دارد؛ مثل ${a(50436324, "شلوار اسلش تمام‌نخ مخصوص پیاده‌روی و سفر")}.</li><li><b>شلوار جیب زیپ‌دار برای باشگاه و حرکت:</b> ${a(44438413, "شلوار راحتی سه جیب زیپ‌دار")} کمک می‌کند موبایل و کارت هنگام تمرین جا نماند یا نیفتد.</li><li><b>شلوارک یا ست ورزشی برای تمرین حرفه‌ای‌تر:</b> در هوای گرم <a href="${ctx.BASE}/c/shorts/">شلوارک کتان مردانه</a> و در هوای خنک <a href="${ctx.BASE}/c/sweatshirt/set/">ست ورزشی مردانه</a> (مانند ${a(65852930, "ست ورزشی غواصی نیم‌زیپ")}) آزادی حرکت بالایی می‌دهند.</li></ul>
<h2>۲. بالاتنه و کفش مناسب راه رفتن طولانی</h2>
<p>تیشرت نخ پنبه سبک، جلوی ایجاد بوی ناخوشایند و حساسیت پوستی را می‌گیرد. برای کفش، مدلی را انتخاب کنید که علاوه بر چسب، دوردوخت صنعتی و زیره پلی‌یورتان (PU) داشته باشد؛ مثل ${a(43999644, "کفش اسپرت دوردوخت زیره PU")} تا زیر پای شما سبک بماند. برای انتخاب شماره دقیق کفش هم قبل از سفارش طول پا را با <a href="${ctx.BASE}/size/shoes/">جدول سایز کفش مردانه</a> بسنجید.</p>`;
    },
  },
  {
    slug: "winter-hoodie-dorce-size-guide",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "راهنمای انتخاب سایز هودی و دورس مردانه بر اساس قد و وزن",
    title: "راهنمای انتخاب سایز هودی، دورس و سویشرت مردانه؛ جدول کامل قد، وزن و عرض سینه",
    desc: "برای هودی، دورس و سویشرت مردانه بر اساس قد و وزن چه سایزی بگیریم؟ جدول کامل سایز L تا {MAX}، تفاوت لایه‌پوشی و نکات انتخاب سایز بدون خطا.",
    cats: ["sweat"],
    faq: [
      ["آیا سایز هودی و دورس را باید یک سایز بزرگ‌تر از تیشرت انتخاب کرد؟", "اگر دورس را مستقیم روی پوست یا روی یک تیشرت نازک می‌پوشید سایز همیشگی کافی است؛ اما برای پوشیدن هودی یا سویشرت روی پیراهن و لباس ضخیم، یک سایز بزرگ‌تر یا بررسی عرض سینه جدول پیشنهاد می‌شود."],
      ["برای وزن ۹۰ تا ۱۲۰ کیلوگرم چه سایز هودی یا دورسی مناسب است؟", "در جدول سایز المارت، وزن ۸۵ تا ۹۵ کیلو با 2XL، وزن ۹۵ تا ۱۰۵ کیلو با 3XL و وزن ۱۰۵ تا ۱۱۸ کیلو با 4XL مطابقت دارد."],
      ["مهم‌ترین عدد در جدول اندازه هودی و دورس چیست؟", "عرض سینه (اندازه زیر بغل تا زیر بغل روی لباس صاف) و قد آستین؛ چون فرم سرشانه و کشباف مچ در مدل‌های توکرک و دورس دو نخ روی همین دو عدد می‌نشیند."],
    ],
    html: (ctx) => `<p>در لباس‌های زمستانی یک اشتباه رایج باعث نارضایتی می‌شود: انتخاب سایز تنگ به‌خاطر عادت تابستانی یا خرید بیش از حد گشاد بدون نگاه کردن به قد آستین. هودی، دورس و سویشرت هر کدام فضای لایه‌پوشی متفاوتی لازم دارند.</p>
<div class="note"><b>خلاصه سریع:</b> برای پوشیدن تکی <a href="${ctx.BASE}/c/sweatshirt/dorce/">دورس دو نخ</a> و <a href="${ctx.BASE}/c/sweatshirt/two-thread/">بلوز</a>، سایز همیشگی مناسب است؛ برای پوشیدن <a href="${ctx.BASE}/c/sweatshirt/hoodie/">هودی توکرک</a> یا <a href="${ctx.BASE}/c/sweatshirt/zip/">سویشرت زیپ‌دار</a> روی لباس دیگر، عرض سینه محصول را با یک لایه اضافه مقایسه کنید.</div>
<h2>۱. جدول سایز هودی، دورس و سویشرت بر اساس قد و وزن</h2>
<table><thead><tr><th>سایز</th><th>قد شما (سانت)</th><th>وزن (کیلوگرم)</th><th>عرض سینه لباس</th><th>قد لباس</th></tr></thead><tbody>${SIZE_ROWS.map((r) => `<tr><td style="direction:ltr;font-weight:800"><a href="${ctx.BASE}/size/${r[0].toLowerCase()}/">${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}</tbody></table>
<p>اگر وزنتان در بازه <a href="${ctx.BASE}/size/2xl/">سایز 2XL</a>، <a href="${ctx.BASE}/size/3xl/">سایز 3XL</a> یا <a href="${ctx.BASE}/size/4xl/">سایز 4XL</a> قرار دارد، می‌توانید مدل‌های آماده در همان بازه را در صفحه <a href="${ctx.BASE}/big-size/sweatshirt/">هودی و دورس سایز بزرگ مردانه</a> هم ببینید و برای وزن دقیق به صفحه <a href="${ctx.BASE}/size/weight/">سایز لباس بر اساس وزن</a> بروید.</p>
<h2>۲. فرق سایزگیری دورس دو نخ با هودی توکرک</h2>
<ul><li><b><a href="${ctx.BASE}/c/sweatshirt/fleece/">هودی و دورس توکرک</a>:</b> کرک داخل کمی حجم دارد و معمولاً روی تیشرت پوشیده می‌شود؛ اگر بین دو سایز هستید، سایز بزرگ‌تر در شانه و زیر بغل راحت‌تر است.</li><li><b>دورس دو نخ و بلوز پنبه:</b> بافت نازک‌تر و ایستایی صاف‌تری دارد و زیر کاپشن جمع نمی‌شود.</li><li><b>سایزیاب سریع:</b> عدد قد و وزن را در <a href="${ctx.BASE}/size-guide/">سایزیاب هوشمند المارت</a> بزنید و سپس عرض سینه همان محصول را کنترل کنید.</li></ul>`,
  },
  {
    slug: "how-to-wash-hoodie-dorce-tshirt",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "شستشوی هودی، دورس و تیشرت مردانه بدون آب‌رفت و پرز",
    title: "نحوه صحیح شستشو و نگهداری هودی، دورس، تیشرت نخ پنبه و شلوار کتان بدون آب‌رفت",
    desc: "چطور هودی توکرک، دورس دو نخ، تیشرت چاپ‌دار و شلوار اسلش کتان کشی را بشوییم تا آب نرود، پرز ندهد و رنگش کدر نشود؟ جدول دمای آب و خشک‌کردن.",
    cats: ["sweat", "tshirt", "pants"],
    faq: [
      ["هودی توکرک و دورس را با چه دمای آبی بشوییم که آب نرود و پرز ندهد؟", "بهترین دما آب سرد یا ولرم حداکثر ۳۰ درجه سانتی‌گراد با شوینده مایع ملایم و دور ملایم لباسشویی است؛ لباس را پشت‌ورو بشویید و از خشک‌کن داغ استفاده نکنید."],
      ["برای حفظ چاپ تیشرت باکسی و طرح‌دار چه نکته‌ای مهم است؟", "تیشرت چاپ‌دار را همیشه پشت‌ورو و با آب سرد بشویید، از سفیدکننده استفاده نکنید و هرگز اتوی داغ را مستقیم روی چاپ نکشید."],
      ["شلوار اسلش کتان کشی و هودی را آویزان خشک کنیم یا پهن کنیم؟", "هودی و دورس سنگین را در حالت خیس با چوب‌لباسی آویزان نکنید چون سرشانه کش می‌آید؛ روی بند یا سطح صاف در سایه پهن کنید تا فرم لباس ثابت بماند."],
    ],
    html: (ctx) => `<p>بسیاری از لباس‌های باکیفیت نه به‌خاطر ضعف دوخت، بلکه به‌دلیل شست‌وشوی با آب داغ، دور خشک‌کن بالا یا آویزان کردن اشتباه، بعد از دو ماه شکل اولشان را از دست می‌دهند. این راهنمای خلاصه دقیقاً بر اساس جنس پارچه به شما می‌گوید هر لباس را چطور بشویید.</p>
<div class="note"><b>خلاصه سریع:</b> قانون طلایی نگهداری لباس مردانه سه مرحله دارد: <b>پشت‌ورو کردن لباس</b>، شست‌وشو با <b>آب سرد یا ولرم (حداکثر ۳۰ درجه)</b> و <b>خشک‌کردن در سایه بدون خشک‌کن داغ</b>.</div>
<h2>۱. جدول شستشو بر اساس جنس پارچه</h2>
<table><thead><tr><th>نوع لباس و پارچه</th><th>دمای آب</th><th>نحوه خشک‌کردن و اتو</th></tr></thead><tbody>
<tr><td><a href="${ctx.BASE}/c/sweatshirt/fleece/">هودی توکرک</a> و <a href="${ctx.BASE}/c/sweatshirt/dorce/">دورس دو نخ</a></td><td>سرد یا ولرم، پشت‌ورو</td><td>پهن روی بند در سایه؛ بدون آویز سرشانه</td></tr>
<tr><td><a href="${ctx.BASE}/c/tshirt/cotton/">تیشرت نخ پنبه</a> و <a href="${ctx.BASE}/c/tshirt/printed/">طرح‌دار</a></td><td>حداکثر ۳۰ درجه، پشت‌ورو</td><td>بدون اتوی مستقیم روی چاپ</td></tr>
<tr><td><a href="${ctx.BASE}/c/pants/katan/">شلوار کتان کشی</a> و اسلش</td><td>سرد، دور ملایم</td><td>اتوی ملایم در صورت نیاز، دور از آفتاب تند</td></tr>
<tr><td>پولوشرت و پیراهن مراکشی</td><td>سرد با دور ملایم</td><td>خشک کردن روی چوب‌لباسی، اتو از پشت</td></tr>
<tr><td>کفش اسپرت زیره PU</td><td>دستمال مرطوب و برس نرم</td><td>شستشو در ماشین لباسشویی ممنوع؛ دور از بخاری</td></tr>
</tbody></table>
<h2>۲. نکات مهم برای جلوگیری از پرزدهی و تغییر رنگ</h2>
<ul><li>لباس‌های تیره (مشکی، سرمه‌ای، زغالی) را از لباس‌های سفید و کرمی جدا بشویید.</li><li>پیش از شستن سویشرت زیپ‌دار یا شلوار جیب‌زیپ‌دار، زیپ‌ها را ببندید تا به بافت بقیه لباس‌ها گیر نکند.</li><li>برای شناخت دقیق‌تر تفاوت دورس، اسپان، نخ پنبه و کتان کشی پیش از خرید، <a href="${ctx.BASE}/guide/fabric-guide/">راهنمای جامع جنس پارچه‌ها</a> را بخوانید.</li></ul>`,
  },
  {
    slug: "best-mens-pants-for-big-thighs-and-belly",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "بهترین شلوار مردانه برای ران درشت و شکم‌دار (تا {MAX:pants})",
    title: "بهترین شلوار مردانه برای ران درشت و شکم‌دار؛ انتخاب کمرکش، فاق بلند و قد مناسب تا {MAX:pants}",
    desc: "اگر ران درشت یا شکم دارید چه شلوار اسلش یا کتانی بخرید؟ مقایسه دمپا ساده، مچی متعادل و کمرکش فاق‌دار از 3XL تا {MAX:pants} با راهنمای وزن.",
    cats: ["pants"],
    faq: [
      ["برای آقایان شکم‌دار و ران درشت کدام مدل شلوار راحت‌تر و خوش‌فرم‌تر است؟", "شلوار اسلش کمرکش و بنددار با فاق کافی و قواره راسته یا دمپای ساده بهترین انتخاب است، چون روی شکم فشار نمی‌آورد و تعادل ران و ساق را حفظ می‌کند."],
      ["برای وزن ۱۱۰ تا ۱۳۰ کیلوگرم چه سایز شلواری مناسب است؟", "بر اساس جدول وزن المارت، وزن ۱۰۵ تا ۱۲۰ کیلوگرم با سایز 4XL و بالای ۱۲۰ کیلوگرم با سایزهای 5XL و 6XL و قد شلوار حدود ۱۱۰ سانتی‌متر هماهنگ است."],
      ["برای افراد ران درشت شلوار دمپا کش بهتر است یا دمپا ساده؟", "دمپای خیلی تنگ ران را پرحجم‌تر نشان می‌دهد؛ شلوار دمپا ساده (راسته) یا مچی متعادل با پارچه کتان کشی یا اسپان نخی تناسب بسیار بهتری می‌سازد."],
    ],
    html: (ctx) => {
      const p = (id) => ctx.products.find((x) => x.id === id && x.inStock);
      const a = (id, t) => (p(id) ? `<a href="${pUrl(ctx, p(id))}">${t}</a>` : t);
      return `<p>آقایانی که ران پر یا شکم دارند معمولاً بین دو مشکل گیر می‌کنند: یا شلوار در کمر و ران تنگ است و هنگام نشستن فشار می‌آورد، یا اگر سایز بالاتر بگیرند دمپای شلوار بیش از حد گشاد و بی‌فرم می‌شود. راه‌حل درست، انتخاب هم‌زمان فاق، کمرکش و برش دمپاست.</p>
<div class="note"><b>خلاصه سریع:</b> برای ران درشت و شکم‌دار، شلوار <b>کمرکش و بنددار با فاق استاندارد</b>، پارچه <a href="${ctx.BASE}/c/pants/katan/">کتان کشی</a> (برای بیرون) یا <a href="${ctx.BASE}/c/pants/cotton/">نخی و اسپان</a> (برای خانه و سفر) و دمپای <a href="${ctx.BASE}/c/pants/straight/">راسته یا مچی متعادل</a> در مجموعه <a href="${ctx.BASE}/big-size/pants/">شلوار سایز بزرگ مردانه</a> بهترین تن‌خور را می‌دهد.</div>
<h2>۱. سه معیار اصلی قبل از خرید شلوار سایز بزرگ</h2>
<table><thead><tr><th>معیار</th><th>انتخاب مناسب</th><th>چرا مهم است؟</th></tr></thead><tbody>
<tr><td>کمر و بند</td><td>کمرکش پهن و بنددار</td><td>زیر شکم جای می‌گیرد و هنگام نشستن یا رانندگی فشار نمی‌آورد</td></tr>
<tr><td>فاق و عرض ران</td><td>فاق بلند با کشسانی عرضی</td><td>هنگام بالا رفتن از پله یا نشستن پایین نمی‌کشد</td></tr>
<tr><td>فرم دمپا</td><td>راسته دمپا ساده یا مچی متعادل</td><td>از لاغر به نظر رسیدن ساق پا نسبت به ران جلوگیری می‌کند</td></tr>
</tbody></table>
<h2>۲. مدل‌های پیشنهادی المارت در سایز 3XL تا {MAX:pants}</h2>
<ul><li><b>برای بیرون و مهمانی:</b> ${a(54125344, "شلوار اسلش کتان کشی سایز بزرگ ۴XL تا ۶XL")}، ${a(45029484, "شلوار کتان شسته کمرکش و بنددار")} و ${a(50425812, "شلوار بغل‌نوار کنفی کتان کشی")}.</li><li><b>برای خانه، سفر و رانندگی:</b> ${a(42728145, "شلوار اسلش اسپان نخی سایز بزرگ")} با نرمی بالا و کمر راحت.</li></ul>
<p>سایز دقیق خودتان را بر اساس <a href="${ctx.BASE}/size/weight/110/">وزن ۱۱۰ کیلو</a> یا <a href="${ctx.BASE}/size/weight/120/">۱۲۰ کیلو</a> ببینید و اندازه واقعی هر مدل را با <a href="${ctx.BASE}/size/4xl/">سایز 4XL</a>، <a href="${ctx.BASE}/size/5xl/">5XL</a>، <a href="${ctx.BASE}/size/6xl/">6XL</a> و <a href="${ctx.BASE}/size/pants/">جدول کامل سایز شلوار</a> مقایسه کنید.</p>`;
    },
  },
  {
    slug: "mens-budget-outfit-guide",
    date: "2026-11-26",
    updated: "2026-11-26",
    seoTitle: "ست لباس مردانه اقتصادی زیر ۱ تا ۲ میلیون تومان",
    title: "راهنمای ست لباس مردانه اقتصادی؛ چطور زیر ۱ تا ۲ میلیون تومان از بازار تبریز شیک بپوشیم",
    desc: "بهترین انتخاب‌های اقتصادی پوشاک مردانه زیر ۱، ۱٫۵ و ۲ میلیون تومان: تیشرت نخ پنبه، شلوار اسلش و کتان، هودی و دورس و نکات مقایسه کیفیت قبل از خرید.",
    cats: ["tshirt", "pants", "sweat"],
    faq: [
      ["با بودجه زیر ۱ یا ۱٫۵ میلیون تومان چه لباس مردانه‌ای می‌توان خرید؟", "در بخش‌های بودجه‌بندی‌شده المارت می‌توانید مدل‌های متنوعی از تیشرت نخ پنبه، شلوار اسلش و کتان روزمره را در بازه‌های زیر ۱ میلیون و زیر ۱٫۵ میلیون تومان با قیمت بازار تبریز مقایسه کنید."],
      ["آیا قیمت پایین‌تر در فروشگاه المارت به معنای کاهش کیفیت است؟", "خیر؛ دلیل قیمت مناسب، عرضه مستقیم از حجره بازار سرپوشیده تبریز و حذف واسطه‌های فروشگاهی است و مشخصات پارچه و جدول سایز در صفحه هر مدل درج شده است."],
      ["چطور مدل‌های اقتصادی در سایز خودم را سریع پیدا کنم؟", "از صفحه‌های دسته‌بندی بر اساس بودجه یا فیلتر سایز و ترتیب قیمت در صفحه فروشگاه استفاده کنید تا فقط مدل‌های موجود در بازه بودجه و سایزتان نمایش داده شوند."],
    ],
    html: (ctx) => {
      const links = price.pricePages(ctx).map((x) => `<li><a href="${ctx.BASE}${price.pricePath(ctx, x)}">${price.priceTitle(x)}</a></li>`).join("");
      return `<p>خوش‌تیپ پوشیدن همیشه به معنی هزینه سنگین نیست؛ وقتی مستقیم از حجره بازار تهیه می‌کنید و سراغ مدل‌های ساده و پایه‌ای می‌روید که با همه لباس‌ها ست می‌شوند، با بودجه اقتصادی هم می‌توانید چند ست کاربردی بسازید.</p>
<div class="note"><b>خلاصه سریع:</b> برای خرید اقتصادی و بی‌ریسک، یک شلوار ساده مشکی یا سرمه‌ای را با تیشرت نخ پنبه یا دورس پایه ترکیب کنید و قیمت‌ها را مستقیم در بازه‌های بودجه زیر ببینید.</div>
<h2>۱. صفحه‌های خرید بر اساس بودجه (به‌روزرسانی خودکار با موجودی)</h2>
<ul>${links}</ul>
<h2>۲. جدول ترکیب اقتصادی برای هر موقعیت</h2>
<table><thead><tr><th>موقعیت</th><th>ترکیب پیشنهادی</th><th>نکته صرفه‌جویی</th></tr></thead><tbody>
<tr><td>استفاده روزمره و دانشگاه</td><td>تیشرت نخ پنبه ساده + شلوار اسلش کتان کشی</td><td>رنگ پایه انتخاب کنید تا با هر کفشی ست شود</td></tr>
<tr><td>محیط کار نیمه‌رسمی</td><td>پولوشرت یا تیشرت یقه‌دار + شلوار راسته کتان</td><td>نیاز به اتوی مداوم و نگهداری خاص ندارد</td></tr>
<tr><td>پاییز و زمستان</td><td>دورس یا هودی ساده زیر کاپشن + اسلش تیره</td><td>روی یک مدل خوش‌قواره تمرکز کنید</td></tr>
</tbody></table>
<p>برای دیدن همه مدل‌ها با فیلتر سایز تا {MAX} به <a href="${ctx.BASE}/shop/">فروشگاه المارت</a> بروید، درباره خرید بی‌واسطه در <a href="${ctx.BASE}/tabriz-bazaar/">صفحه بازار سرپوشیده تبریز</a> بخوانید و برای سفارش عمده هم به صفحه <a href="${ctx.BASE}/wholesale/">پخش عمده پوشاک مردانه</a> سر بزنید.</p>`;
    },
  },
];

const readMin = (ctx, g) => Math.max(2, Math.round(g.html(ctx).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));
// one distinct cover photo per guide, picked in guide order
const guideCovers = new WeakMap();
function guideCover(ctx, g) {
  if (!guideCovers.has(ctx)) {
    const used = new Set(), m = {};
    for (const x of guides) {
      const list = ctx.products.filter((p) => x.cats.includes(p.cat) && p.inStock && (x.slug !== "big-size-men" || isBig(p))).sort((a, b) => (b.featured - a.featured) || (b.sales - a.sales));
      m[x.slug] = list.find((p) => !used.has(p.id)) || list[0];
      if (m[x.slug]) used.add(m[x.slug].id);
    }
    guideCovers.set(ctx, m);
  }
  return guideCovers.get(ctx)[g.slug];
}
function gcard(ctx, g, h = "h3") {
  const p = guideCover(ctx, g);
  return `<a class="gcard" href="${ctx.BASE}/guide/${g.slug}/">${p ? `<img src="${ctx.BASE}/assets/p/${mainBase(p)}-480.webp" srcset="${ctx.BASE}/assets/p/${mainBase(p)}-480.webp 480w, ${ctx.BASE}/assets/p/${mainBase(p)}-960.webp 960w" sizes="(max-width:600px) 100vw, 33vw" alt="" width="480" height="600" loading="lazy" decoding="async">` : ""}<div><span class="kicker">${fa(readMin(ctx, g))} دقیقه مطالعه</span><${h}>${g.title}</${h}><p>${g.desc}</p></div></a>`;
}

function guide(ctx, g) {
  const items = [["/", "خانه"], ["/guide/", "راهنمای خرید"], [`/guide/${g.slug}/`, g.title]];
  // best sellers of the guide's own categories first; small categories (shirt, shoes) are topped up with
  // what pairs with them, so every guide links at least 3-4 products
  const best = (a, b) => (b.featured - a.featured) || (b.sales - a.sales);
  const own = ctx.products.filter((p) => g.cats.includes(p.cat) && p.inStock && (g.slug !== "big-size-men" || isBig(p))).sort(best);
  const pairCats = [...new Set(g.cats.flatMap((c) => PAIRS[c] || []))];
  const prods = [...own, ...ctx.products.filter((p) => p.inStock && pairCats.includes(p.cat) && !own.includes(p)).sort(best)].slice(0, 4);
  const cov = guideCover(ctx, g);
  const ogImg = cov ? `${ctx.SITE_URL}/assets/og/${cov.id}.jpg` : `${ctx.SITE_URL}/assets/og/site.jpg`;
  const htmlBody = g.html(ctx);
  const wordCount = htmlBody.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const datePub = g.date || "2026-10-12";
  const dateMod = g.updated || g.date || "2026-11-26";
  const schemaList = [
    crumbSchema(ctx, items),
    {
      "@context": "https://schema.org", "@type": "Article",
      headline: g.title, description: g.desc, inLanguage: "fa-IR",
      image: [ogImg],
      wordCount,
      author: { "@type": "Organization", name: STORE.name, url: `${ctx.SITE_URL}/` },
      publisher: { "@type": "Organization", "@id": `${ctx.SITE_URL}/#store`, name: STORE.name, logo: { "@type": "ImageObject", url: `${ctx.SITE_URL}/assets/img/icon-512.png` } },
      mainEntityOfPage: `${ctx.SITE_URL}/guide/${g.slug}/`,
      datePublished: datePub,
      dateModified: dateMod,
    },
    ...(g.faq && g.faq.length ? [faqSchema(g.faq)] : []),
  ];
  return layout(ctx, {
    path: `/guide/${g.slug}/`,
    title: g.seoTitle || g.title,
    desc: g.desc,
    ogType: "article",
    image: ogImg,
    extraHead: `<meta property="article:published_time" content="${datePub}">\n<meta property="article:modified_time" content="${dateMod}">`,
    schema: schemaList,
    body: `${crumbs(ctx, items)}<article class="sec-sm"><div class="wrap prose"><h1 style="font-size:clamp(28px,4vw,42px)">${g.title}</h1><p class="gmeta">${fa(readMin(ctx, g))} دقیقه مطالعه · ${new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateMod))}</p>${htmlBody}${(g.cats || []).includes("shoes") && sz.shoeChart(ctx) ? `<p>جدول دقیق: <a href="${ctx.BASE}/size/shoes/">سایز کفش مردانه به سانتی‌متر</a></p>` : ""}${(g.cats || []).some((k) => sz.bigCats(ctx).includes(k)) ? `<p>سایز بزرگ: ${(g.cats || []).filter((k) => sz.bigCats(ctx).includes(k)).map((k) => `<a href="${ctx.BASE}/big-size/${ctx.CATEGORIES[k].slug}/">${sz.BIG_CATS[k].h1}</a>`).join(" · ")}</p>` : ""}</div></article>
${g.faq && g.faq.length ? `<section class="sec-sm bg-cream"><div class="wrap faq"><h2>سوالات پرتکرار</h2>${g.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>` : ""}
<section class="sec-sm${g.faq && g.faq.length ? "" : " bg-cream"}"><div class="wrap"><div class="sec-head"><h2>محصولات مرتبط</h2></div><div class="grid">${prods.map((p) => card(ctx, p)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap prose"><h2>راهنماهای بیشتر</h2><ul>${guides.filter((x) => x.slug !== g.slug).map((x) => `<li><a href="${ctx.BASE}/guide/${x.slug}/">${x.title}</a></li>`).join("")}</ul></div></section>`,
  });
}

function guideIndex(ctx) {
  const items = [["/", "خانه"], ["/guide/", "راهنمای خرید"]];
  const guideListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "راهنمای خرید پوشاک مردانه المارت",
    url: `${ctx.SITE_URL}/guide/`,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: guides.length,
      itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${ctx.SITE_URL}/guide/${g.slug}/`, name: g.title })),
    },
  };
  return layout(ctx, {
    path: "/guide/",
    title: "راهنمای خرید پوشاک مردانه",
    desc: "مقاله‌های راهنمای خرید المارت: شلوار اسلش، لباس سایز بزرگ مردانه، هودی و دورس، قواره تیشرت، پولوشرت و جدول سایز.",
    schema: [crumbSchema(ctx, items), guideListSchema],
    body: `${crumbs(ctx, items)}<header class="wrap phead"><h1>راهنمای خرید</h1><p>تجربه چند دهه فروش در بازار تبریز، خلاصه در چند مقاله کوتاه.</p></header>
<section class="sec-sm"><div class="wrap"><div class="gcards">${guides.map((g) => gcard(ctx, g, "h2")).join("")}</div><p class="gmore">سایزتان را نمی‌دانید؟ <a class="link" href="${ctx.BASE}/size-guide/">سایزیاب و جدول سایز مردانه</a> را ببینید. نشانی غرفه و دسته‌بندی لباس‌ها را هم در صفحه <a class="link" href="${ctx.BASE}/tabriz-bazaar/">بازار سرپوشیده تبریز</a> پیدا می‌کنید.</p></div></section>`,
  });
}

function notFound(ctx) {
  return layout(ctx, {
    path: "/404.html", noindex: true,
    title: "صفحه پیدا نشد",
    desc: "صفحه مورد نظر پیدا نشد.",
    body: `<section class="sec"><div class="wrap" style="text-align:center"><h1 style="font-size:64px">۴۰۴</h1><p>این صفحه پیدا نشد؛ شاید این مدل دیگر موجود نیست یا جابه‌جا شده است. مدل مشابهش را از اینجا پیدا کنید:</p><form class="search" action="${ctx.BASE}/shop/" style="max-width:420px;margin:24px auto 18px" role="search">${I.search}<input name="q" type="search" placeholder="جستجو: شلوار اسلش، تیشرت 4XL، هودی…" aria-label="جستجو در محصولات"></form><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:24px">${Object.values(ctx.CATEGORIES).filter((c) => ctx.products.some((p) => ctx.CATEGORIES[p.cat] === c)).map((c) => `<a class="chip" href="${ctx.BASE}/c/${c.slug}/">${c.name}</a>`).join("")}</div><p><a class="btn btn-ink" href="${ctx.BASE}/shop/">رفتن به فروشگاه</a></p></div></section>`,
  });
}

function llms(ctx) {
  const live = ctx.products.filter((p) => p.inStock);
  const rv = ctx.storeReviews;
  const cats = Object.entries(ctx.CATEGORIES).map(([k, c]) => {
    const list = live.filter((p) => p.cat === k);
    if (!list.length) return null;
    const min = Math.min(...list.map((p) => p.price)), max = Math.max(...list.map((p) => p.price));
    return `- [${c.name}](${ctx.SITE_URL}/c/${c.slug}/): ${fa(list.length)} مدل موجود، قیمت از ${fa(min)} تا ${fa(max)} تومان`;
  }).filter(Boolean).join("\n");
  const styles = sty.stylePages(ctx).map((x) => `- [${x.h1}](${ctx.SITE_URL}${sty.stylePath(ctx, x)})`).join("\n");
  const guideLinks = guides.map((g) => `- [${g.title}](${ctx.SITE_URL}/guide/${g.slug}/): ${g.desc}`).join("\n");
  return fillSizes(ctx, `# ${STORE.name} (${STORE.latin}) — پوشاک مردانه بازار تبریز
> ${STORE.full} در ${STORE.bazaar} با {YEARS} سال سابقه خانوادگی. مستقل از فروشگاه‌های همنام در سایر شهرها (وبسایت رسمی: ${ctx.SITE_URL}). تخصصی در تیشرت نخ پنبه، شلوار اسلش و راحتی، هودی و دورس و پوشاک سایز بزرگ مردانه تا {MAX}.

## اطلاعات رسمی فروشگاه (Verified Store Facts)
- نام برند و دامنه رسمی: ${STORE.name} (${STORE.latin}) — ${ctx.SITE_URL}/
- نشانی حضوری: ${STORE.address}
- تلفن ثبت سفارش و مشاوره: ${STORE.phones.map(fa0).join(" و ")}
- غرفه خرید آنلاین امن: ${STORE.basalam}${rv && rv.count ? ` (امتیاز ${fa(rv.average)} از ۵ از ${fa(rv.count)} نظر خریداران)` : ""}
- اینستاگرام و روبیکا: ${STORE.instagram} | ${STORE.rubika}
- ارسال و پرداخت: ارسال از روز اول کاری به سراسر ایران (پست پیشتاز/سفارشی) و پیک موتوری در تبریز؛ خرید امن با ضمانت باسلام یا سفارش مستقیم با کد پیگیری EL-XXXX.
- کد تأیید دامنه اینماد: ۲۵۳۹۴۵۷۵
- نسخه کامل برای هوش مصنوعی: ${ctx.SITE_URL}/llms-full.txt | کاتالوگ JSON: ${ctx.SITE_URL}/assets/ai-catalog.json | خوراک RSS: ${ctx.SITE_URL}/feed.xml

## صفحات اصلی و ابزارها
- [فروشگاه کامل](${ctx.SITE_URL}/shop/): همه ${fa(ctx.products.length)} محصول با فیلتر سایز و قیمت
- [لباس سایز بزرگ مردانه](${ctx.SITE_URL}/big-size/): کالکشن تخصصی 3XL تا {MAX}
- [لباس سایز بزرگ مردانه در تبریز](${ctx.SITE_URL}/big-size/tabriz/): خرید حضوری در بازار تبریز و ارسال سراسری
- [فروشگاه لباس مردانه در تبریز](${ctx.SITE_URL}/tabriz-bazaar/): معرفی حجره و خرید حضوری
- [سایزیاب آنلاین و جدول سایز](${ctx.SITE_URL}/size-guide/): پیشنهاد سایز بر اساس قد و وزن (L تا {MAX})
- [سایز لباس مردانه بر اساس وزن](${ctx.SITE_URL}/size/weight/): جدول وزن ۶۵ تا ۱۵۰ کیلوگرم
- [تولیدی و پخش عمده پوشاک مردانه تبریز](${ctx.SITE_URL}/wholesale/)
- [ارسال، مرجوعی و سفارش مستقیم](${ctx.SITE_URL}/shipping-returns/)
- [سوالات متداول](${ctx.SITE_URL}/faq/)
- [تماس با المارت](${ctx.SITE_URL}/contact/)

## دسته‌بندی محصولات
${cats}

## صفحات سایز بزرگ و سایز بر اساس وزن
${sz.bigCats(ctx).map((k) => `- [${sz.BIG_CATS[k].h1}](${ctx.SITE_URL}/big-size/${ctx.CATEGORIES[k].slug}/)`).join("\n")}
${gar.garmentKinds(ctx).map((k) => `- [${gar.GARMENTS[k].h1}](${ctx.SITE_URL}/size/${k}/)`).join("\n")}
${sz.sizePages.map((z) => `- [سایز ${z} چند کیلو است؟](${ctx.SITE_URL}/size/${z.toLowerCase()}/)`).join("\n")}${sz.shoeChart(ctx) ? `\n- [جدول سایز کفش مردانه به سانتی‌متر](${ctx.SITE_URL}/size/shoes/)` : ""}

## صفحات مدل و استایل
${styles}

## راهنماهای خرید تخصصی
${guideLinks}

## فهرست محصولات (${fa(ctx.products.length)} مدل)
${ctx.products.map((p) => { const szs = liveSizes(p); return `- [${p.title}](${ctx.SITE_URL}/p/${p.id}/) — ${fa(p.price)} تومان${szs.length ? ` — سایز ${szs.join("/")}` : ""}${p.material ? ` — ${p.material}` : ""}`; }).join("\n")}
`);
}

function llmsFull(ctx) {
  const live = ctx.products.filter((p) => p.inStock);
  const rv = ctx.storeReviews;
  const sc = sz.shoeChart(ctx);
  const pantsRows = [
    ["L – XL", "۶۵ تا ۸۵", "۱۰۰"],
    ["2XL", "۸۵ تا ۹۵", "۱۰۵"],
    ["3XL", "۹۰ تا ۱۰۵", "۱۱۰"],
    ["4XL", "۱۰۵ تا ۱۲۰", "۱۱۰"],
    ["5XL – 6XL", "۱۲۰ به بالا", "۱۱۰"],
  ];
  const allFaq = [...HOME_FAQ, ...FAQ_FULL.filter(([q]) => !HOME_FAQ.some(([hq]) => hq === q))];
  const prodDetails = ctx.products.map((p) => {
    const szs = liveSizes(p);
    const cols = p.colors.filter((_, i) => p.colorInStock.includes(i));
    const m = measures(p);
    const msrTxt = m ? m.rows.map(([z, v]) => `${z}: ${m.cols.map((c) => v[c] ? `${c} ${fa0(v[c])}` : null).filter(Boolean).join("، ")}`).join(" | ") : "";
    return [
      `### ${p.title}`,
      `- شناسه: ${p.id} | دسته: ${catOf(ctx, p).name} | وضعیت: ${p.inStock ? "موجود" : "ناموجود"}`,
      `- قیمت: ${fa(p.price)} تومان (${fa(p.price * 10)} ریال)`,
      ...(p.material ? [`- جنس: ${p.material}`] : []),
      ...(szs.length ? [`- سایزهای موجود: ${szs.join("، ")}`] : []),
      ...(cols.length ? [`- رنگ‌های موجود: ${cols.join("، ")}`] : []),
      ...(msrTxt ? [`- اندازه‌های واقعی (سانتی‌متر): ${msrTxt}`] : []),
      ...(p.rating ? [`- امتیاز خریداران: ${fa(p.rating.avg)} از ۵ (${fa(p.rating.count)} نظر)`] : []),
      `- لینک صفحه: ${ctx.SITE_URL}/p/${p.id}/`,
      `- لینک خرید باسلام: ${p.buyUrl}`,
    ].join("\n");
  }).join("\n\n");

  return fillSizes(ctx, `# ${STORE.name} (${STORE.latin}) — مرجع کامل برای موتورهای جستجو و هوش مصنوعی
> ${STORE.full} در ${STORE.bazaar} ({YEARS} سال سابقه). مستقل از فروشگاه‌های همنام در شهرهای دیگر. وبسایت رسمی: ${ctx.SITE_URL}/

## ۱. معرفی و اعتبار فروشگاه
- نام: ${STORE.name} (${STORE.latin}) — ${STORE.full}
- نشانی حجره: ${STORE.address} (مختصات جغرافیایی: 38.0805, 46.2940)
- شماره‌های تماس و پیامک سفارش: ${STORE.phones.map(fa0).join(" ، ")}
- خرید آنلاین با ضمانت: ${STORE.basalam}${rv && rv.count ? ` — امتیاز کل غرفه: ${fa(rv.average)} از ۵ بر اساس ${fa(rv.count)} امتیاز خریداران واقعی در باسلام` : ""}
- شبکه‌های اجتماعی: اینستاگرام ${STORE.instagram} | کانال روبیکا ${STORE.rubika} | سفارش در روبیکا ${STORE.rubikaOrder}
- مدل موجود: ${fa(live.length)} مدل آماده ارسال از ${fa(ctx.products.length)} محصول، تا سایز {MAX}.
- ارسال: از روز اول کاری پس از ثبت سفارش با پست پیشتاز یا سفارشی به سراسر ایران و پیک موتوری در تبریز.

## ۲. جدول راهنمای سایز مردانه (تیشرت، پولوشرت، هودی و پیراهن)
| سایز | قد (سانتی‌متر) | وزن (کیلوگرم) | عرض سینه (سانت) | قد لباس (سانت) |
|---|---|---|---|---|
${SIZE_ROWS.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`).join("\n")}

## ۳. جدول راهنمای سایز شلوار اسلش و شلوارک
| سایز | وزن تقریبی (کیلوگرم) | قد شلوار (سانتی‌متر) |
|---|---|---|
${pantsRows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`).join("\n")}
${sc ? `\n## ۴. جدول سایز کفش اسپرت مردانه (مدل ${sc.p.title})\n| سایز | طول پا (سانتی‌متر) |\n|---|---|\n${sc.rows.map(([z, v]) => `| ${fa0(z)} | ${fa0(v["طول پا"])} |`).join("\n")}\n` : ""}
## ۵. پرسش و پاسخ‌های رسمی فروشگاه
${allFaq.map(([q, a]) => `**${q}**\n${a}`).join("\n\n")}

## ۶. خلاصه راهنماهای خرید المارت
${guides.map((g) => { const f0 = g.faq && g.faq[0]; return `- **${g.title}** (${ctx.SITE_URL}/guide/${g.slug}/): ${g.desc}${f0 ? ` | پرسش کلیدی: ${f0[0]} ← ${f0[1]}` : ""}`; }).join("\n")}

## ۷. صفحات مدل و استایل (${fa(sty.stylePages(ctx).length)} صفحه)
${sty.stylePages(ctx).map((x) => `- [${x.h1}](${ctx.SITE_URL}${sty.stylePath(ctx, x)})`).join("\n")}

## ۸. کاتالوگ کامل محصولات
${prodDetails}
`);
}

function aiCatalog(ctx) {
  const rv = ctx.storeReviews;
  const maxMap = sizeMax(ctx);
  return {
    generatedAt: ctx.syncedAt || new Date().toISOString(),
    store: {
      name: STORE.name,
      latin: STORE.latin,
      url: `${ctx.SITE_URL}/`,
      basalam: STORE.basalam,
      instagram: STORE.instagram,
      rubika: STORE.rubika,
      phones: STORE.phones,
      address: STORE.address,
      city: STORE.city,
      yearsActive: STORE.years,
      maxSize: maxMap[""],
      rating: rv && rv.count ? { average: rv.average, count: rv.count, bestRating: 5 } : null,
    },
    sizeChart: {
      tops: SIZE_ROWS,
      pants: [["L – XL", "۶۵ تا ۸۵", "۱۰۰"], ["2XL", "۸۵ تا ۹۵", "۱۰۵"], ["3XL", "۹۰ تا ۱۰۵", "۱۱۰"], ["4XL", "۱۰۵ تا ۱۲۰", "۱۱۰"], ["5XL – 6XL", "۱۲۰ به بالا", "۱۱۰"]],
      shoes: sz.shoeChart(ctx) ? sz.shoeChart(ctx).rows.map(([z, v]) => ({ size: z, footLengthCm: v["طول پا"] })) : null,
    },
    guides: guides.map((g) => ({ slug: g.slug, title: g.title, desc: g.desc, updated: g.updated || g.date || "2026-11-26", url: `${ctx.SITE_URL}/guide/${g.slug}/` })),
    products: ctx.products.map((p) => {
      const m = measures(p);
      return {
        id: p.id,
        title: p.title,
        category: catOf(ctx, p).name,
        categorySlug: catOf(ctx, p).slug,
        priceToman: p.price,
        priceIRR: p.price * 10,
        inStock: p.inStock,
        liveSizes: liveSizes(p),
        colorsInStock: p.colors.filter((_, i) => p.colorInStock.includes(i)),
        material: p.material || null,
        measurements: m ? Object.fromEntries(m.rows) : null,
        rating: p.rating,
        url: `${ctx.SITE_URL}/p/${p.id}/`,
        buyUrl: p.buyUrl,
      };
    }),
  };
}

const sz = require("./pages-sizes")({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, sizer, SIZE_ROWS, STORE, fa, fa0 });
const info = require("./pages-info")({ layout, crumbs, crumbSchema, orgSchema, faqSchema, STORE, I, fa0, fa });
const col = require("./pages-colors")({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, fa, STORE, SIZE_ROWS });

const price = require("./pages-price")({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, fa });
const gar = require("./pages-garments")({ layout, crumbs, crumbSchema, faqSchema, itemList, card, SIZE_ROWS, fa, fa0 });
const wt = require("./pages-weight")({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, SIZE_ROWS, STORE, fa, fa0, esc });
const sty = require("./pages-styles")({ layout, crumbs, crumbSchema, faqSchema, itemList, card, liveSizes, fa, STORE });

module.exports = { ...info, ...sz, ...col, ...price, ...sty, ...gar, ...wt, catalog: (ctx) => ctx.products.map((p) => cardData(ctx, p)), aiCatalog, fillSizes, home, shop, category, product, bigSize, sizeGuide, about, tabrizBazaar, faq, guide, guideIndex, guides, notFound, llms, llmsFull };

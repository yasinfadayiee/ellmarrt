// Page templates for the ELLMARRT static site.
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
  if (Array.isArray(C0.phones) && C0.phones.filter(Boolean).length) STORE.phones = C0.phones.filter(Boolean).map((x) => String(x).replace(/D/g, ""));
  if (C0.address) STORE.address = C0.address;
  if (C0.igHandle) { STORE.igHandle = C0.igHandle.replace(/^@/, ""); STORE.instagram = "https://instagram.com/" + STORE.igHandle; STORE.igDm = "https://ig.me/m/" + STORE.igHandle; }
  if (C0.rubika) STORE.rubika = C0.rubika;
  if (C0.rubikaOrder) STORE.rubikaOrder = C0.rubikaOrder;
  if (SITE.years) STORE.years = +SITE.years || STORE.years;
}
const hero = (k, d) => (SITE.hero && SITE.hero[k]) || d;
const promoOn = () => SITE.promo && SITE.promo.active && SITE.promo.code;

const fa0 = (s) => String(s).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
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
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
};

const THEMES = [["", "ابریشم تبریز", ["#2a1424", "#e2b45a", "#8a2433"]], ["firouzeh", "فیروزه", ["#0d3a40", "#e9c46a", "#127a83"]], ["zomorrod", "زمرد", ["#0f3a2c", "#e6be6e", "#1d6b51"]], ["lajevard", "لاجورد", ["#16224f", "#e8c062", "#2a44a8"]], ["anar", "انار", ["#4a0d1c", "#f6d2b4", "#b0203f"]], ["shab", "شب", ["#0e0d10", "#e2b45a", "#1c191f"]]];

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
  return `<!doctype html>
<html lang="fa" dir="rtl" data-base="${BASE}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${url}">
${o.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta name="theme-color" content="#141210">
<meta name="google-site-verification" content="uXxAD7CF1q8Fo0xZpy1_uE84WzXJWtndZYkGuYqUT9A">
<meta name="msvalidate.01" content="E832DBD41A08E553E3013637AB159DEE">
<meta property="og:type" content="${o.ogType || "website"}">
<meta property="og:site_name" content="${STORE.name} | ${STORE.latin}">
<meta property="og:locale" content="fa_IR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${BASE}/assets/img/mark.svg" type="image/svg+xml">
<link rel="icon" href="${BASE}/favicon.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="${BASE}/assets/img/apple-touch-icon.png">
<link rel="manifest" href="${BASE}/manifest.webmanifest">
${SITE.analytics && SITE.analytics.goatcounter ? `<script data-goatcounter="https://${esc(SITE.analytics.goatcounter)}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>` : ""}
<link rel="preload" href="${BASE}/assets/fonts/Vazirmatn-wght.woff2" as="font" type="font/woff2" crossorigin>
${o.preload ? `<link rel="preload" as="image" href="${o.preload}"${o.preloadSet?` imagesrcset="${o.preloadSet}" imagesizes="${o.preloadSizes}"`:""} fetchpriority="high">` : ""}
<script>try{var t=localStorage.getItem("elm-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
<link rel="stylesheet" href="${BASE}/assets/css/site.css?v=${VERSION}">
${(o.schema || []).map((s) => `<script type="application/ld+json">${json(s)}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">رفتن به محتوای اصلی</a>
<div class="topbar" aria-label="مزایای خرید"><div class="marquee">${Array(2).fill([...(promoOn() ? [`کد تخفیف ${SITE.promo.code}${SITE.promo.text ? " — " + SITE.promo.text : ""}`] : []), ...((SITE.announcements || []).filter(Boolean).length ? SITE.announcements.filter(Boolean) : ["ارسال به سراسر ایران از روز اول کاری", `بیش از ${fa(STORE.years)} سال در ${STORE.bazaar}`, "سایزبندی واقعی تا 6XL", "خرید امن با ضمانت باسلام", "عکس‌ها و سایز دقیق، بررسی قبل از ارسال"])].map((t) => `<span>${esc(t)}</span>`).join("")).join("")}</div></div>
<header class="hdr">
  <div class="wrap hdr-in">
    <button class="ibtn menu-btn" aria-label="منو">${I.menu}</button>
    <a class="brand" href="${BASE}/" aria-label="${STORE.name} — صفحه اصلی"><img src="${BASE}/assets/img/mark.svg" alt="" width="32" height="42"><span><b>${STORE.name}</b><small>ELLMARRT</small></span></a>
    <nav class="nav" aria-label="منوی اصلی"><div class="nav-h"><img src="${BASE}/assets/img/logo.svg" alt="" width="90" height="76"><button class="ibtn nav-x" aria-label="بستن منو">✕</button></div>${navLinks.map(([h, t]) => `<a href="${BASE}${h}"${o.path === h ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
    <div class="hdr-act">
      <div class="theme-btn"><button class="ibtn" id="theme-open" aria-label="تغییر رنگ‌بندی سایت" aria-expanded="false"><span class="sw3"><i style="background:var(--dk2)"></i><i style="background:var(--gold-2)"></i><i style="background:var(--brick)"></i></span></button>
      <div class="theme-pop" id="theme-pop" role="dialog" aria-label="رنگ‌بندی سایت"><b>رنگ‌بندی سایت را انتخاب کنید</b><div class="theme-list">${THEMES.map(([k, n, c]) => `<button data-theme-set="${k}" aria-pressed="false"><span class="sw3">${c.map((x) => `<i style="background:${x}"></i>`).join("")}</span>${n}</button>`).join("")}</div></div></div>
      <a class="ibtn" href="${BASE}/shop/#q" aria-label="جستجو">${I.search}</a>
      <button class="ibtn open-favs" aria-label="علاقه‌مندی‌ها">${I.heart}<span class="badge fav-count"></span></button>
      <a class="ibtn" href="${STORE.basalam}" rel="noopener" target="_blank" aria-label="غرفه المارت در باسلام">${I.bag}</a>
    </div>
  </div>
</header>
<div class="scrim"></div>
<main id="main">
${o.body}
</main>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-g">
      <div>
        <img src="${BASE}/assets/img/logo-light.svg" alt="${STORE.latin} — ${STORE.name}" width="170" height="143" loading="lazy" style="width:150px;height:auto;margin-bottom:16px">
        <p>${SITE.footer && SITE.footer.blurb ? esc(SITE.footer.blurb) : `${STORE.full}؛ بیش از ${fa(STORE.years)} سال فعالیت در ${STORE.bazaar}.`} پوشاک روزمره مردانه با کیفیت بازار، قیمت منصفانه و سایزبندی واقعی تا 6XL.</p>
        <div class="social"><a href="${STORE.instagram}" target="_blank" rel="noopener" aria-label="اینستاگرام المارت">${I.ig}</a><a href="${STORE.basalam}" target="_blank" rel="noopener" aria-label="غرفه باسلام">${I.store}</a></div>
      </div>
      <div><h2>فروشگاه</h2><ul>${Object.values(ctx.CATEGORIES).map((c) => `<li><a href="${BASE}/c/${c.slug}/">${c.name}</a></li>`).join("")}</ul></div>
      <div><h2>راهنما</h2><ul><li><a href="${BASE}/size-guide/">سایزیاب و جدول سایز</a></li><li><a href="${BASE}/big-size/">لباس سایز بزرگ مردانه</a></li><li><a href="${BASE}/guide/">راهنمای خرید</a></li><li><a href="${BASE}/faq/">سوالات متداول</a></li><li><a href="${BASE}/shipping-returns/">ارسال و مرجوعی</a></li><li><a href="${BASE}/terms/">قوانین و مقررات</a></li><li><a href="${BASE}/privacy/">حریم خصوصی</a></li><li><a href="${BASE}/contact/">تماس با ما</a></li></ul></div>
      <div><h2>المارت</h2><ul><li><a href="${BASE}/about/">داستان ما</a></li><li><a href="${STORE.instagram}" target="_blank" rel="noopener">اینستاگرام @${STORE.igHandle}</a></li><li><a href="${STORE.basalam}" target="_blank" rel="noopener">غرفه در باسلام</a></li><li><a href="${STORE.rubika}" target="_blank" rel="noopener">کانال روبیکا</a></li>${STORE.phones.map((p)=>`<li><a href="tel:${p}" class="num">${fa0(p)}</a></li>`).join("")}<li>${STORE.address}</li></ul></div>
    </div>
    <div class="ftr-b"><span>© ${new Date().getFullYear()} ${STORE.latin} — ${STORE.name}. همه حقوق محفوظ است.</span><span>ساخته‌شده با عشق در تبریز</span></div>
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
<div class="lb" role="dialog" aria-label="نمایش بزرگ تصویر"><button class="lb-x" aria-label="بستن">✕</button><button class="lb-n lb-prev" aria-label="قبلی">›</button><img alt=""><button class="lb-n lb-next" aria-label="بعدی">‹</button></div>
<div class="modal" id="order-modal" role="dialog" aria-modal="true" aria-labelledby="om-t"><div class="modal-c"><button class="ibtn modal-x" aria-label="بستن">✕</button>
<h2 id="om-t">سفارش مستقیم از المارت</h2><p class="om-p"></p>
<div class="om-code"><span>کد پیگیری سفارش شما</span><b class="num" id="om-code"></b><small>این کد را هنگام تماس یا در پیام بگویید.</small></div>
<div class="om-act"><a class="btn btn-ink btn-block" id="om-sms" href="#">ارسال پیامک سفارش</a>${STORE.phones.map((p,i)=>`<a class="btn btn-ghost btn-block om-call" href="tel:${p}">${I.phone} تماس: <span class="num">${fa0(p)}</span></a>`).join("")}<a class="btn btn-ghost btn-block" href="${STORE.rubikaOrder}" target="_blank" rel="noopener">پیام در روبیکا (@aliegbal)</a></div></div></div>
<script>window.__STORE__=${json({phones:STORE.phones})}</script>
<script src="${BASE}/assets/js/site.js?v=${VERSION}" defer></script>
</body>
</html>`;
}

/* ---------------- shared pieces ---------------- */
const HEX = { "مشکی": "#151515", "سفید": "#f7f7f5", "کرمی": "#eadfc8", "کله‌غازی": "#21566a", "استخوانی": "#ece6d8", "نسکافه‌ای": "#7a5a43", "هوایی": "#a9cbe6", "یشمی": "#8fa697", "شکلاتی": "#4a2f22", "طوسی": "#9a9a9a", "طوسی تیره": "#4b4b4f", "طوسی روشن": "#c9c9c9", "پرتقالی": "#f07a1f", "زرد": "#e1b43a", "قرمز": "#c23a35", "مشکی ساده": "#151515", "مشکی طرح لوزی": "#2a2a2a", "سبز": "#2f6b45", "سرمه‌ای": "#1f2a4d", "نارنجی": "#c8642d", "آبی": "#1f5fc4", "پسته‌ای": "#bcd49a", "قهوه‌ای": "#6b4a33", "زرشکی": "#6e1f2c", "مشکی سفید": "linear-gradient(90deg,#151515 50%,#f7f7f5 50%)", "سبز ساقه‌ای": "#6f7d3c", "سفید مشکی": "linear-gradient(90deg,#f7f7f5 50%,#151515 50%)", "زیتونی": "#6b6b3a", "زغالی": "#3a3a3c", "سبز ساقه ای": "#6f7d3c", "آبی تیره": "#1b3a73", "آبی روشن": "#7fb0e0" };
const dotsHtml = (cols) => cols.length > 1 ? `<div class="dots" aria-label="رنگ‌های موجود">${cols.slice(0, 5).map((c) => `<i title="${c}" style="background:${HEX[c] || "#bbb"}"></i>`).join("")}${cols.length > 5 ? `<small>+${cols.length - 5}</small>` : ""}</div>` : "";
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
  return `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">نظر خریداران غرفه</span><h2>${fa(RV.average)} از ۵ <small class="h-sub">از ${fa(RV.count)} امتیاز خریداران المارت در باسلام</small></h2></div><a class="link" href="${STORE.basalam}" target="_blank" rel="noopener">همه نظرها در باسلام</a></div><div class="rv-grid">${picks.map((r) => reviewCard(ctx, r, true)).join("")}</div></div></section>`;
};
const catOf = (ctx, p) => ctx.CATEGORIES[p.cat];
const short = (p) => p.title.split(" | ")[0];
const mainBase = (p) => (p.mainColor != null ? `${p.id}-k${p.mainColor}` : `${p.id}`);
const pUrl = (ctx, p) => `${ctx.BASE}/p/${p.id}/`;
const isBig = (p) => p.sizes.some((s) => ["4XL", "5XL", "6XL"].includes(s));
const tagFor = (p) => {
  if (!p.inStock) return ["ناموجود", "tag-ink"];
  if (p.sales >= 10) return ["پرفروش", "tag-gold"];
  if (isBig(p)) return ["سایز بزرگ", "tag-brick"];
  if (Date.now() - new Date(p.created).getTime() < 1000 * 60 * 60 * 24 * 60) return ["جدید", ""];
  return null;
};
function cardData(ctx, p) {
  const t = tagFor(p);
  return {
    id: p.id, t: short(p), c: p.cat, cn: catOf(ctx, p).name, p: p.price, s: p.sizes, st: p.inStock, sales: p.sales, d: p.created, k: p.keyword,
    url: pUrl(ctx, p), img: `${ctx.BASE}/assets/p/${mainBase(p)}-480.webp`, alt: (() => { const o = p.colorImages.find((i) => i !== p.mainColor && p.colorInStock.includes(i)); return o != null ? `${ctx.BASE}/assets/p/${p.id}-k${o}-480.webp` : null; })(),
    tag: t && t[0], tagc: t && t[1], dots: dotsHtml(p.colors.filter((c, i) => p.colorInStock.includes(i))),
  };
}
function card(ctx, p, eager = false) {
  const d = cardData(ctx, p);
  return `<article class="card rv${d.st ? "" : " out"}">
<div class="card-media"><img src="${d.img}" alt="${esc(p.title)}" width="480" height="600" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${d.alt ? `<img class="alt" src="${d.alt}" alt="" loading="lazy" decoding="async">` : ""}
<div class="card-tags">${d.tag ? `<span class="tag ${d.tagc}">${d.tag}</span>` : ""}</div>
<button class="fav" data-id="${p.id}" aria-label="افزودن ${esc(p.title)} به علاقه‌مندی‌ها">${I.heart}</button></div>
<div class="card-body"><div class="card-cat">${d.cn}</div><h3 class="card-title"><a href="${d.url}">${esc(short(p))}</a></h3>
<div class="price"><b class="num">${fa(p.price)}</b><small>تومان</small></div>${dotsHtml(p.colors.filter((c, i) => p.colorInStock.includes(i)))}<div class="card-sizes">${p.sizes.slice(0, 5).map((s) => `<span>${s}</span>`).join("")}</div></div></article>`;
}
const crumbs = (ctx, items) => `<nav class="crumbs wrap" aria-label="مسیر"><ol>${items.map(([h, t], i) => `<li>${i < items.length - 1 ? `<a href="${ctx.BASE}${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join("")}</ol></nav>`;
const crumbSchema = (ctx, items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([h, t], i) => ({ "@type": "ListItem", position: i + 1, name: t, item: ctx.SITE_URL + h })),
});
const orgSchema = (ctx) => ({
  "@context": "https://schema.org", "@type": "ClothingStore", "@id": `${ctx.SITE_URL}/#store`,
  name: `${STORE.name} (${STORE.latin})`, alternateName: [STORE.latin, STORE.full, "پیرایش"],
  url: `${ctx.SITE_URL}/`, logo: `${ctx.SITE_URL}/assets/img/icon-512.png`, image: `${ctx.SITE_URL}/assets/og/site.jpg`,
  description: `فروشگاه پوشاک مردانه ${STORE.name} از ${STORE.bazaar}؛ تیشرت، شلوار اسلش، هودی و لباس سایز بزرگ مردانه تا 6XL.`,
  address: { "@type": "PostalAddress", streetAddress: STORE.address, addressLocality: STORE.city, addressRegion: STORE.region, addressCountry: "IR" },
  areaServed: { "@type": "Country", name: "Iran" }, currenciesAccepted: "IRR", priceRange: "$$",
  foundingDate: String(new Date().getFullYear() - STORE.years),
  sameAs: [STORE.instagram, STORE.basalam, STORE.rubika],
  telephone: "+98" + STORE.phones[0].slice(1),
});
const faqSchema = (qa) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });

const sizer = (title = "سایزیاب هوشمند المارت") => `<div class="sizer" aria-label="${title}">
<div class="sizer-row"><div><label for="sz-h">قد</label><div class="field"><input id="sz-h" name="h" type="number" inputmode="numeric" min="140" max="215" placeholder="مثلاً ۱۷۸"><span>سانتی‌متر</span></div></div>
<div><label for="sz-w">وزن</label><div class="field"><input id="sz-w" name="w" type="number" inputmode="numeric" min="40" max="190" placeholder="مثلاً ۹۵"><span>کیلوگرم</span></div></div></div>
<label>چه مدل تن‌خوری دوست دارید؟</label>
<div class="seg" role="group"><button type="button" data-fit="slim" aria-pressed="false">جذب</button><button type="button" data-fit="regular" aria-pressed="true">معمولی</button><button type="button" data-fit="loose" aria-pressed="false">گشاد / اورسایز</button></div>
<div class="sizer-out" aria-live="polite"></div></div>`;

const HOME_FAQ_DEFAULT = [
  ["خرید از المارت چطور انجام می‌شود؟", "هر محصول در غرفه رسمی المارت در باسلام ثبت شده است. سایز و رنگ را در سایت انتخاب کنید و با دکمه «خرید امن از باسلام» سفارش را با درگاه و ضمانت باسلام تکمیل کنید."],
  ["ارسال چقدر طول می‌کشد؟", "سفارش‌ها از روز اول کاری بعد از ثبت، با پست پیشتاز یا سفارشی به سراسر ایران ارسال می‌شوند. برای تبریز ارسال با پیک موتوری هم امکان‌پذیر است."],
  ["سایز مناسب خودم را چطور پیدا کنم؟", "از سایزیاب المارت استفاده کنید: قد و وزن خود را وارد کنید تا سایز پیشنهادی را ببینید. همچنین در صفحه هر محصول اندازه‌های واقعی آن آمده است و می‌توانید قبل از خرید در اینستاگرام از ما بپرسید."],
  ["آیا لباس سایز بزرگ دارید؟", "بله. بخش بزرگی از محصولات المارت از XL تا 6XL تولید می‌شوند؛ از تیشرت 5XL تا شلوار اسلش 6XL. صفحه «سایز بزرگ» همه این محصولات را یک‌جا نشان می‌دهد."],
  ["عکس محصولات واقعی است؟", "عکس‌های اصلی با نورپردازی استودیویی بازسازی شده‌اند و جنس، رنگ و دوخت هر لباس دقیقاً همان کالای ارسالی است. عکس‌های واقعی گرفته‌شده در غرفه هم در گالری هر محصول قرار دارند."],
];

const HOME_FAQ = (SITE.faq || []).filter((x) => x && x[0] && x[1]).length ? SITE.faq.filter((x) => x && x[0] && x[1]) : HOME_FAQ_DEFAULT;

/* ---------------- pages ---------------- */
function home(ctx) {
  const { products: P, CATEGORIES: C, BASE } = ctx;
  const byId = (id) => P.find((p) => p.id === id);
  const heroIds = [60937967, 47475290, 53762676];
  const best = [...P].filter((p) => p.inStock).sort((a, b) => (b.featured - a.featured) || (b.sales - a.sales)).slice(0, 8);
  const fresh = [...P].filter((p) => p.inStock && !best.includes(p)).sort((a, b) => b.created.localeCompare(a.created)).slice(0, 8);
  const big = P.filter((p) => isBig(p) && p.inStock).slice(0, 4);
  const catImg = { tshirt: 49701761, polo: 53765502, shirt: 45025631, sweat: 58897534, pants: 54126455, shorts: 42724724, shoes: 43999644, kids: 36616537 };
  const cats = Object.entries(C).map(([k, c]) => ({ k, c, n: P.filter((p) => p.cat === k).length })).filter((x) => x.n);
  const body = `
<section class="hero">
  <svg class="hero-vault" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="#e2b45a" stop-opacity=".1"/><stop offset=".5" stop-color="#e2b45a" stop-opacity=".9"/><stop offset="1" stop-color="#e2b45a" stop-opacity=".1"/></linearGradient></defs><path d="M120 800V420C120 230 400 120 720 40c320 80 600 190 600 380v380"/><path d="M240 800V460C240 310 460 220 720 150c260 70 480 160 480 310v340"/><path d="M360 800V500C360 390 520 320 720 260c200 60 360 130 360 240v300"/><path d="M480 800V540c0-80 110-130 240-170 130 40 240 90 240 170v260"/></svg>
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="eyebrow">${esc(hero("eyebrow", `از دل ${STORE.bazaar} — شش دهه تجربه`))}</span>
      <h1>${esc(hero("line1", "شیک بپوش،"))}<br>${esc(hero("pre", "مثل"))} <em>${esc(hero("em", "بازاری‌ها"))}<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 12 Q150 2 298 12"/></svg></em> ${esc(hero("post", "بخر."))}</h1>
      <p class="hero-lead">${hero("lead", "") ? esc(hero("lead", "")) : `${fa(STORE.years)} سال تجربه در انتخاب پارچه و دوخت؛ حالا مستقیم برای شما. تیشرت، شلوار اسلش، هودی و لباس سایز بزرگ مردانه تا <b class="num">6XL</b> با قیمت منصفانه و ارسال به سراسر ایران.`}</p>
      <div class="hero-cta"><a class="btn btn-gold" href="${BASE}/shop/">${esc(hero("cta1", "دیدن کالکشن"))} ${I.arrow}</a><a class="btn btn-ghost" href="${BASE}/size-guide/">${esc(hero("cta2", "سایزم چیه؟"))}</a></div>
      <div class="hero-stats"><div><b class="num" data-count="${STORE.years}" data-suffix="+">${fa(STORE.years)}+</b><span>سال در بازار تبریز</span></div><div><b class="num" data-count="${P.length}">${fa(P.length)}</b><span>مدل در کالکشن</span></div><div><b class="num">6XL</b><span>بزرگ‌ترین سایز</span></div></div>
    </div>
    <div class="arches" aria-hidden="true">
      ${heroIds.map((id, i) => `<div class="arch"><img src="${BASE}/assets/p/${id}-480.webp"${i === 1 ? ` srcset="${BASE}/assets/p/${id}-480.webp 480w, ${BASE}/assets/p/${id}-960.webp 960w" sizes="(max-width:900px) 33vw, 16vw"` : ""} alt="" width="480" height="600" ${i === 1 ? 'fetchpriority="high"' : 'loading="eager"'}></div>`).join("")}
      <div class="seal"><div class="seal-in"><span class="num">${fa(STORE.years)}</span>سال<br>بازار تبریز</div></div>
    </div>
  </div>
</section>

<div class="arch-band" aria-hidden="true"></div>
<section class="sec-sm"><div class="wrap"><div class="trust rv">
  <div>${I.truck}<p style="margin:0"><b>ارسال از روز اول کاری</b><span>پست پیشتاز و سفارشی به کل ایران</span></p></div>
  <div>${I.shield}<p style="margin:0"><b>خرید امن با باسلام</b><span>پرداخت و ضمانت بازگشت وجه</span></p></div>
  <div>${I.ruler}<p style="margin:0"><b>سایزبندی واقعی</b><span>از L تا 6XL، اندازه دقیق هر مدل</span></p></div>
  <div>${I.camera}<p style="margin:0"><b>عکس واقعی کالا</b><span>بررسی قبل از ارسال</span></p></div>
</div></div></section>

<section class="sec" style="padding-top:20px"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">دسته‌بندی‌ها</span><h2>دنبال چی می‌گردی؟</h2></div><a class="link" href="${BASE}/shop/">همه محصولات</a></div>
  <div class="cats">${cats.map(({ k, c, n }) => `<a class="cat rv" href="${BASE}/c/${c.slug}/"><img src="${BASE}/assets/p/${catImg[k]}-480.webp" alt="${c.name}" width="480" height="600" loading="lazy"><span class="cat-go">${I.arrow}</span><span class="cat-t"><b>${c.name}</b><span>${fa(n)} مدل</span></span></a>`).join("")}</div>
</div></section>

<section class="sec bg-cream"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">پرفروش‌های غرفه</span><h2>انتخاب مشتری‌های همیشگی</h2><p>مدل‌هایی که بیشترین سفارش را در باسلام داشته‌اند.</p></div><a class="link" href="${BASE}/shop/?sort=best">همه پرفروش‌ها</a></div>
  <div class="grid">${best.map((p) => card(ctx, p)).join("")}</div>
</div></section>

<section class="sec"><div class="wrap story">
  <div class="story-media rv"><div class="arch"><img src="${BASE}/assets/p/45326170-960.webp" alt="مدل المارت با بلوز نخی نارنجی" width="960" height="1200" loading="lazy"></div><div class="badge-yr"><b class="num">۶۰ سال</b>از پدر به پسر</div></div>
  <div class="rv">
    <span class="kicker">داستان المارت</span>
    <h2>${SITE.story && SITE.story.title ? esc(SITE.story.title) : "یک حجره در بازار سرپوشیده،<br>شصت سال اعتماد."}</h2>
    <p>${SITE.story && SITE.story.text ? esc(SITE.story.text) : `غرفه‌ای که امروز اداره می‌کنیم ${fa(STORE.years)} سال است در بازار سرپوشیده تبریز فعال است؛ کاری که از پدرمان به ارث رسید. ما هر پارچه را با دست لمس می‌کنیم، هر دوخت را قبل از ارسال بررسی می‌کنیم و همان قیمت منصفانه بازار را به خانه شما می‌آوریم.`}</p>
    <div class="feat">
      <div><i>${I.thread}</i><p style="margin:0"><b>پارچه انتخابی</b><span>نخ پنبه، کتان کشی، اسپان و دورس اعلا</span></p></div>
      <div><i>${I.arch}</i><p style="margin:0"><b>اصالت بازار تبریز</b><span>بیش از نیم قرن سابقه در پخش پوشاک</span></p></div>
      <div><i>${I.ruler}</i><p style="margin:0"><b>تخصص سایز بزرگ</b><span>تن‌خور خوب برای هیکل‌های درشت</span></p></div>
      <div><i>${I.box}</i><p style="margin:0"><b>بسته‌بندی ایمن</b><span>ارسال سریع از روز اول کاری</span></p></div>
    </div>
    <p style="margin-top:28px"><a class="btn btn-ink" href="${BASE}/about/">داستان کامل المارت ${I.arrow}</a></p>
  </div>
</div></section>

<section class="look" aria-label="لوک‌بوک المارت"><div class="wrap"><div class="sec-head rv"><div><span class="kicker" style="color:var(--gold-2)">لوک‌بوک فصل</span><h2>استایل‌های آماده؛ فقط انتخاب کن.</h2><p>ترکیب‌هایی که در حجره بیشترین سوال را داشته‌اند. برای دیدن هر قطعه بزنید.</p></div><div class="look-nav"><button class="ibtn look-prev" aria-label="قبلی">›</button><button class="ibtn look-next" aria-label="بعدی">‹</button></div></div></div>
<div class="look-track">${[60209573,53765502,60467399,54126455,46296076,58897534,47475290,60192679].map((id,i)=>{const p=byId(id);return p?`<a class="look-card" href="${pUrl(ctx,p)}"><img src="${BASE}/assets/p/${id}-960.webp" alt="${esc(p.title)}" loading="lazy" width="960" height="1200"><span class="look-no num">${String(i+1).padStart(2,"0")}</span><span class="look-cap"><b>${esc(p.title)}</b><span class="num">${fa(p.price)} تومان</span></span></a>`:""}).join("")}</div></section>
<div class="stitch-div" aria-hidden="true"></div>
<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">تازه‌های کالکشن</span><h2>تازه رسیده‌ها</h2></div><a class="link" href="${BASE}/shop/?sort=new">همه جدیدها</a></div>
  <div class="grid">${fresh.map((p) => card(ctx, p)).join("")}</div>
</div></section>

<section class="sec-sm"><div class="wrap"><div class="fit rv">
  <div><span class="kicker" style="color:var(--gold-2)">سایزیاب المارت</span><h2>سایزت رو در ۱۰ ثانیه پیدا کن.</h2><p>قد و وزنت را بزن؛ سایز پیشنهادی و محصولات موجود در همان سایز را نشانت می‌دهیم. از S تا 6XL.</p><a class="link" style="color:var(--cream)" href="${BASE}/size-guide/">جدول کامل سایزها</a></div>
  ${sizer()}
</div></div></section>

<section class="sec"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">مخصوص هیکل‌های درشت</span><h2>لباس سایز بزرگ مردانه</h2><p>سایز بزرگ واقعی، نه فقط یک برچسب؛ تا 6XL با قواره و قد درست.</p></div><a class="link" href="${BASE}/big-size/">کالکشن سایز بزرگ</a></div>
  <div class="grid">${big.map((p) => card(ctx, p)).join("")}</div>
</div></section>

${(() => { const RV = ctx.storeReviews; if (!RV || !RV.count) return ""; const good = RV.reviews.filter((r) => r.text && r.star >= 4).slice(0, 9); const total = Object.values(RV.groups).reduce((a, b) => a + b, 0) || 1;
return `<section class="sec reviews"><div class="wrap">
  <div class="sec-head rv"><div><span class="kicker">از زبان خریداران</span><h2>اعتماد واقعی، نه تبلیغ</h2><p>نظرهای ثبت‌شده خریداران در غرفه رسمی المارت در باسلام؛ بدون ویرایش.</p></div><a class="link" href="${STORE.basalam}" target="_blank" rel="noopener">همه نظرها در باسلام</a></div>
  <div class="rv-wrap">
    <div class="rv-score rv"><b class="num">${fa(RV.average)}</b>${stars(RV.average)}<span>از ${fa(RV.count)} امتیاز خریداران</span>
      <ul>${[5, 4, 3, 2, 1].map((n) => `<li><span>${fa(n)} ★</span><i><em style="width:${Math.round(((RV.groups[n] || 0) / total) * 100)}%"></em></i><small class="num">${fa(RV.groups[n] || 0)}</small></li>`).join("")}</ul></div>
    <div class="rv-grid">${good.map((r) => reviewCard(ctx, r, true)).join("")}</div>
  </div></div></section>`; })()}
<section class="sec bg-cream"><div class="wrap">
  <div class="sec-head rv" style="justify-content:center;text-align:center"><div><span class="kicker">سوالات پرتکرار</span><h2>قبل از خرید بدانید</h2></div></div>
  <div class="faq rv">${HOME_FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
  <p style="text-align:center;margin-top:28px"><a class="btn btn-ghost" href="${STORE.igDm}" target="_blank" rel="noopener">${I.ig} سوال دیگری دارید؟ در اینستاگرام بپرسید</a></p>
</div></section>`;
  return layout(ctx, {
    path: "/",
    title: `${STORE.name} | پوشاک مردانه بازار تبریز؛ تیشرت، شلوار اسلش و سایز بزرگ تا 6XL`,
    desc: `خرید آنلاین پوشاک مردانه از ${STORE.name}، ${fa(STORE.years)} سال در بازار بزرگ تبریز: تیشرت نخ پنبه، شلوار اسلش، هودی، پیراهن و لباس سایز بزرگ مردانه تا 6XL با قیمت منصفانه و ارسال به سراسر ایران.`,
    preload: `${BASE}/assets/p/${heroIds[1]}-480.webp`,
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
<select id="sort" class="sel" aria-label="مرتب‌سازی"><option value="featured">پیشنهاد المارت</option><option value="best">پرفروش‌ترین</option><option value="new">جدیدترین</option><option value="low">ارزان‌ترین</option><option value="high">گران‌ترین</option></select>
<div class="sizes-f" role="group" aria-label="سایز">${sizes.map((s) => `<button data-size-f="${s}" aria-pressed="false">${s}</button>`).join("")}</div>
<button class="chip" id="stock-f" aria-pressed="false">فقط موجودها</button>
<span class="count" id="shop-count">${fa(activeCat ? P.filter((p) => p.cat === activeCat).length : P.length)} محصول</span>
</div></div></div>`;
}

function shop(ctx) {
  const { products: P } = ctx;
  const sorted = [...P].sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock) || (b.sales - a.sales));
  const items = [["/", "خانه"], ["/shop/", "فروشگاه"]];
  return layout(ctx, {
    path: "/shop/",
    title: "فروشگاه پوشاک مردانه؛ همه محصولات",
    desc: `همه ${fa(P.length)} مدل پوشاک مردانه المارت: تیشرت، پولوشرت، پیراهن، هودی، دورس، شلوار اسلش، شلوارک، کفش و لباس پسرانه؛ فیلتر بر اساس سایز تا 6XL.`,
    schema: [crumbSchema(ctx, items), itemList(ctx, sorted)],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="bt"><span class="kicker" style="color:var(--gold-2)">کالکشن کامل</span><h1>فروشگاه المارت</h1><p>کل کالکشن پوشاک مردانه بازار تبریز در یک صفحه. با فیلتر سایز، مدل‌هایی که در سایز شما موجودند را ببینید.</p></div><img class="banner-img" src="${ctx.BASE}/assets/p/${mainBase(sorted[0])}-480.webp" alt="" width="480" height="600"></header>
<section id="shop">${filters(ctx, null)}<div class="wrap"><h2 class="sr">محصولات</h2><div class="grid" id="shop-grid">${sorted.map((p, i) => card(ctx, p, i < 2)).join("")}</div></div></section>`,
  });
}

function itemList(ctx, list) {
  return { "@context": "https://schema.org", "@type": "ItemList", itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${ctx.SITE_URL}/p/${p.id}/`, name: p.title })) };
}

const CAT_FAQ = {
  pants: [["شلوار اسلش مردانه چه جنسی بهتر است؟", "برای استفاده روزمره کتان کشی خوش‌فرم‌تر است و چروک کمتری می‌گیرد؛ برای راحتی و پیاده‌روی اسپان نخی و تمام‌نخ خنک‌تر و نرم‌تر است."], ["شلوار اسلش سایز بزرگ تا چه سایزی دارید؟", "مدل‌های اسلش المارت تا 6XL موجودند؛ قد شلوار در سایزهای بزرگ ۱۰۵ تا ۱۱۰ سانتی‌متر است."]],
  tshirt: [["تیشرت نخ پنبه بهتر است یا پنبه 28؟", "پنبه نمره ۲۸ و نخ ۳۰ گرم ضخامت و ایستایی بیشتری دارند و بعد از شستشو فرمشان را حفظ می‌کنند؛ نخ پنبه نازک‌تر برای تابستان خنک‌تر است."], ["تیشرت باکسی را یک سایز بزرگ‌تر بخرم؟", "خیر؛ تیشرت‌های باکسی خودشان گشاد دوخته شده‌اند. سایز همیشگی خود را انتخاب کنید."]],
};

function category(ctx, c) {
  const { products: P } = ctx;
  const key = Object.keys(ctx.CATEGORIES).find((k) => ctx.CATEGORIES[k] === c);
  const list = P.filter((p) => p.cat === key).sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock) || (b.sales - a.sales));
  const items = [["/", "خانه"], ["/shop/", "فروشگاه"], [`/c/${c.slug}/`, c.name]];
  const min = Math.min(...list.map((p) => p.price)), max = Math.max(...list.map((p) => p.price));
  const qa = CAT_FAQ[key] || [];
  return layout(ctx, {
    path: `/c/${c.slug}/`,
    title: `خرید ${c.h1} | قیمت از ${fa(min)} تومان`,
    desc: c.desc,
    image: `${ctx.SITE_URL}/assets/og/${list[0].id}.jpg`,
    schema: [crumbSchema(ctx, items), itemList(ctx, list), ...(qa.length ? [faqSchema(qa)] : [])],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="bt"><span class="kicker" style="color:var(--gold-2)">کالکشن ${c.name}</span><h1>${c.h1}</h1><p>${c.desc} قیمت‌ها از <b class="num">${fa(min)}</b> تا <b class="num">${fa(max)}</b> تومان.</p></div><img class="banner-img" src="${ctx.BASE}/assets/p/${mainBase(list[0])}-480.webp" alt="" width="480" height="600"></header>
<section id="shop" data-cat="${key}">${filters(ctx, key)}<div class="wrap"><h2 class="sr">محصولات</h2><div class="grid" id="shop-grid">${list.map((p, i) => card(ctx, p, i < 2)).join("")}</div></div></section>
${qa.length ? `<section class="sec-sm"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>` : ""}`,
  });
}

function product(ctx, p) {
  const { BASE, SITE_URL, products: P } = ctx;
  const c = catOf(ctx, p);
  const items = [["/", "خانه"], [`/c/${c.slug}/`, c.name], [`/p/${p.id}/`, short(p)]];
  const hero = `${BASE}/assets/p/${mainBase(p)}-960.webp`;
  // gallery = main studio shot + one studio shot per colour (no duplicate crops)
  const colorImg = (i) => p.colorImages.includes(i) ? `${BASE}/assets/p/${p.id}-k${i}-960.webp` : null;
  const colorShots = p.colors.map((c, i) => colorImg(i) && { i, full: colorImg(i), thumb: `${BASE}/assets/p/${p.id}-k${i}-480.webp`, label: c, color: c }).filter(Boolean)
    .sort((a, b) => p.colorInStock.includes(b.i) - p.colorInStock.includes(a.i));
  const gal = colorShots.length ? colorShots : [{ full: hero, thumb: `${BASE}/assets/p/${p.id}-480.webp`, label: "نمای اصلی", color: "" }];
  const real = p.images.gallery.map((g) => `${BASE}/assets/p/${g.file}`);
  const colors = p.colors;
  const sizes = p.sizes;
  const low = p.inStock && p.stock <= 3;
  const related = P.filter((x) => x.id !== p.id && x.cat === p.cat && x.inStock).slice(0, 4);
  const more = related.length < 4 ? P.filter((x) => x.id !== p.id && x.cat !== p.cat && x.inStock && !related.includes(x)).slice(0, 4 - related.length) : [];
  const facts = [["دسته‌بندی", c.name], ...(sizes.length ? [["سایزها", sizes.join(" ، ")]] : []), ...(colors.length ? [["رنگ‌ها", colors.join("، ")]] : []), ...p.attrs.filter(([k]) => !["سایز", "رنگ", "برند"].includes(k))];
  const desc = `${p.title} از ${STORE.name}، بازار تبریز${p.material ? `؛ جنس ${p.material}` : ""}${sizes.length ? `، سایز ${sizes[0]} تا ${sizes[sizes.length - 1]}` : ""}. قیمت ${fa(p.price)} تومان، خرید امن و ارسال به سراسر ایران.`;
  const offerAvail = p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const schema = {
    "@context": "https://schema.org", "@type": "Product", "@id": `${SITE_URL}/p/${p.id}/#product`,
    name: p.title, sku: String(p.id), mpn: String(p.id), category: c.name,
    image: [`${SITE_URL}/assets/p/${mainBase(p)}-960.webp`, ...p.images.gallery.slice(0, 4).map((g) => `${SITE_URL}/assets/p/${g.file}`)],
    description: p.copy.plain.slice(0, 4900),
    ...(p.material ? { material: p.material } : {}),
    ...(colors.length ? { color: colors.join("، ") } : {}),
    ...(sizes.length ? { size: sizes.join(", ") } : {}),
    audience: { "@type": "PeopleAudience", suggestedGender: p.cat === "kids" ? "unisex" : "male" },
    offers: { "@type": "Offer", url: `${SITE_URL}/p/${p.id}/`, priceCurrency: "IRR", price: p.price * 10, availability: offerAvail, itemCondition: "https://schema.org/NewCondition", seller: { "@id": `${SITE_URL}/#store` } },
    ...(p.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.avg, reviewCount: p.rating.count, bestRating: 5 } } : {}),
  };
  const data = { id: p.id, hero: true, variants: p.variants.map(({ color, size, stock }) => ({ color, size, stock })) };
  const priceBlock = `<div class="pprice"><b class="num">${fa(p.price)}</b><small>تومان</small><span id="stock" class="stock${p.inStock ? (low ? " low" : "") : " no"}">${p.inStock ? (low ? `فقط ${fa(p.stock)} عدد باقی‌مانده` : "موجود در انبار") : "ناموجود"}</span></div>`;
  const body = `${crumbs(ctx, items)}
<div class="wrap pdp" id="pdp">
  <div class="gal">
    <div class="gal-main"><img class="cover" src="${hero}" srcset="${BASE}/assets/p/${mainBase(p)}-480.webp 480w, ${hero} 960w" sizes="(max-width:900px) 92vw, 46vw" alt="${esc(p.title)}" width="960" height="1200" fetchpriority="high"><span class="gal-hint">برای بزرگ‌نمایی بزنید</span></div>
    <div class="thumbs">${gal.map((g, i) => `<button data-full="${g.full}" data-tc="${esc(g.color)}" aria-label="${esc(g.label)}" aria-current="${i === 0}"><img src="${g.thumb}" alt="" loading="lazy" width="76" height="95"></button>`).join("")}</div>
  </div>
  <div class="pinfo">
    <a class="kicker" href="${BASE}/c/${c.slug}/">${c.name}</a>
    <h1>${esc(p.title)}</h1>
    <div class="pmeta">${p.rating ? `<span class="stars">${I.star}<span class="num">${fa(p.rating.avg)}</span></span><span>${fa(p.rating.count)} نظر در باسلام</span>` : ""}${p.sales ? `<span>${fa(p.sales)} فروش موفق</span>` : ""}<span>کد کالا: <span class="num">${p.id}</span></span></div>
    ${priceBlock}
    ${promoOn() ? `<div class="promo"><b>کد تخفیف ${esc(SITE.promo.code)}</b><span>${esc(SITE.promo.text || "هنگام پرداخت در باسلام وارد کنید")}</span><button type="button" data-copy="${esc(SITE.promo.code)}">کپی کد</button></div>` : ""}
    ${colors.length > 1 ? `<div class="opt"><div class="opt-h">رنگ: <span id="sel-color">انتخاب کنید</span></div><div class="opts">${colors.map((x, i) => `<button data-color="${esc(x)}"${colorImg(i) ? ` data-img="${colorImg(i)}" class="sw"` : ""}>${colorImg(i) ? `<img src="${BASE}/assets/p/${p.id}-k${i}-480.webp" alt="" width="28" height="35" loading="lazy">` : ""}${esc(x)}</button>`).join("")}</div></div>` : colors.length === 1 ? `<p><b>رنگ:</b> ${esc(colors[0])}</p>` : ""}
    ${sizes.length ? `<div class="opt"><div class="opt-h">سایز: <span id="sel-size">انتخاب کنید</span> <a class="link" href="${BASE}/size-guide/" style="font-size:13px">راهنمای سایز</a></div><div class="opts">${sizes.map((s) => `<button class="sz" data-size="${s}">${s}</button>`).join("")}</div></div>` : ""}
    <div class="buy">
      ${p.inStock ? `<a class="btn btn-ink btn-block buy-go" href="${p.buyUrl}" target="_blank" rel="noopener">${I.bag} خرید امن از غرفه المارت در باسلام</a>` : `<div class="oos"><b>این مدل فعلاً ناموجود است</b><span>موجودی هر ۶ ساعت از باسلام به‌روز می‌شود. برای خبر شدن از شارژ مجدد پیام بدهید.</span></div><a class="btn btn-ink btn-block" href="${STORE.rubikaOrder}" target="_blank" rel="noopener">خبرم کن وقتی موجود شد</a>`}
      <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px">
        <a class="btn btn-ghost" href="${STORE.igDm}" target="_blank" rel="noopener">${I.ig} سوال قبل از خرید</a>
        <button class="btn btn-ghost fav" data-id="${p.id}" style="position:static;width:54px;padding:0" aria-label="افزودن به علاقه‌مندی‌ها">${I.heart}</button>
        <button class="btn btn-ghost" id="share" style="width:54px;padding:0" aria-label="اشتراک‌گذاری">${I.share}</button>
      </div>
      ${p.inStock ? "" : "<!--"}<button class="btn btn-gold btn-block" id="direct-order">${I.phone} سفارش مستقیم (تلفنی / پیامکی)</button>${p.inStock ? "" : "-->"}
      <p class="buy-note">پرداخت از درگاه امن باسلام با ضمانت بازگشت وجه؛ ارسال از روز اول کاری.</p>
    </div>
    <div class="perks"><div>${I.truck}ارسال سراسری</div><div>${I.shield}ضمانت باسلام</div><div>${I.camera}بررسی قبل از ارسال</div></div>
    <div class="pbox">
      <details open><summary>توضیحات محصول</summary><div class="copy"><p class="lead">${esc(p.copy.lead)}</p><ul class="ticks">${p.copy.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul><p class="note-sm"><b>نکته سایز:</b> ${esc(p.copy.sizeNote)}</p><p class="note-sm"><b>نگهداری:</b> ${esc(p.copy.care)}</p></div></details>
      <details><summary>مشخصات</summary><table class="spec">${facts.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table></details>
      <details><summary>ارسال و خرید</summary><div class="desc">سفارش از طریق غرفه رسمی المارت در باسلام ثبت و پرداخت می‌شود. ارسال با پست پیشتاز یا سفارشی به سراسر کشور و برای تبریز با پیک انجام می‌شود. هر سفارش قبل از ارسال بررسی و ایمن بسته‌بندی می‌شود.</div></details>
    </div>
  </div>
</div>
${real.length ? `<section class="sec-sm real"><div class="wrap"><div class="sec-head"><div><span class="kicker">بدون روتوش</span><h2>عکس‌های واقعی از غرفه</h2><p>همین کالا، عکاسی‌شده در حجره المارت در بازار تبریز؛ برای دیدن رنگ‌ها و جزئیات بزنید.</p></div></div>
<div class="real-g">${real.map((src, i) => `<button class="real-i" data-real="${i}" aria-label="عکس واقعی ${fa(i + 1)}"><img src="${src}" alt="${esc(p.title)} — عکس واقعی ${fa(i + 1)}" loading="lazy" width="300" height="300"></button>`).join("")}</div></div></section>` : ""}
${p.inStock ? `<div class="mbar"><b class="num">${fa(p.price)} تومان</b><a class="btn btn-ink buy-go" href="${p.buyUrl}" target="_blank" rel="noopener">خرید از باسلام</a></div>` : ""}
${p.reviews.length ? `<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">نظر خریداران</span><h2>${fa(p.rating.avg)} از ۵ <small class="h-sub">از ${fa(p.reviews.length)} امتیاز در باسلام</small></h2></div></div><div class="rv-grid">${p.reviews.filter((r) => r.text).map((r) => reviewCard(ctx, r, false)).join("") || `<p class="note-sm">${fa(p.reviews.length)} خریدار به این محصول امتیاز داده‌اند (بدون متن).</p>`}</div></div></section>` : storeReviewsBlock(ctx, p)}
<section class="sec-sm bg-cream"><div class="wrap"><div class="sec-head"><div><span class="kicker">پیشنهاد ما</span><h2>ست کنید یا مشابه ببینید</h2></div><a class="link" href="${BASE}/c/${c.slug}/">همه ${c.plural}</a></div><div class="grid">${[...related, ...more].map((x) => card(ctx, x)).join("")}</div></div></section>
<section class="sec-sm" id="recent" hidden><div class="wrap"><div class="sec-head"><h2>اخیراً دیده‌اید</h2></div><div class="grid"></div></div></section>
<script type="application/json" id="pdp-data">${json(data)}</script>`;
  return layout(ctx, {
    path: `/p/${p.id}/`,
    title: p.title,
    desc: (`${p.copy.lead} قیمت ${fa(p.price)} تومان، ارسال به سراسر ایران.`).slice(0, 165),
    ogType: "product",
    image: `${SITE_URL}/assets/og/${p.id}.jpg`,
    preload: hero,
    preloadSet: `${BASE}/assets/p/${mainBase(p)}-480.webp 480w, ${hero} 960w`,
    preloadSizes: "(max-width:900px) 92vw, 46vw",
    schema: [crumbSchema(ctx, items), schema],
    body,
  });
}

function bigSize(ctx) {
  const { products: P, BASE } = ctx;
  const list = P.filter(isBig).sort((a, b) => b.inStock - a.inStock);
  const xl3 = P.filter((p) => !isBig(p) && p.sizes.includes("3XL")).sort((a, b) => b.inStock - a.inStock);
  const items = [["/", "خانه"], ["/big-size/", "لباس سایز بزرگ مردانه"]];
  const qa = [
    ["لباس سایز بزرگ مردانه تا چه سایزی دارید؟", "در المارت تیشرت تا 5XL، شلوار اسلش و شلوارک تا 6XL و هودی و دورس تا 3XL موجود است."],
    ["سایز 4XL برای چه وزنی مناسب است؟", "به طور معمول 4XL برای وزن حدود ۱۰۵ تا ۱۱۸ کیلوگرم و 5XL برای ۱۱۸ تا ۱۳۲ کیلوگرم مناسب است؛ برای دقت بیشتر از سایزیاب استفاده کنید."],
    ["قد شلوارهای سایز بزرگ چقدر است؟", "قد شلوارهای اسلش سایز بزرگ المارت بین ۱۰۵ تا ۱۱۰ سانتی‌متر است تا برای افراد قدبلند هم مناسب باشد."],
  ];
  return layout(ctx, {
    path: "/big-size/",
    title: "لباس سایز بزرگ مردانه تا 6XL | تیشرت و شلوار اسلش سایز بزرگ",
    desc: "خرید لباس سایز بزرگ مردانه از 3XL تا 6XL: تیشرت سایز بزرگ، شلوار اسلش سایز بزرگ، شلوارک و پوشاک راحتی برای آقایان درشت‌اندام؛ با قواره و قد واقعی از بازار تبریز.",
    schema: [crumbSchema(ctx, items), itemList(ctx, list), faqSchema(qa)],
    body: `${crumbs(ctx, items)}
<header class="phead banner"><div class="bt"><span class="kicker" style="color:var(--gold-2)">کالکشن ویژه</span><h1>لباس سایز بزرگ مردانه؛ واقعاً بزرگ.</h1><p>پیدا کردن لباسی که هم اندازه باشد و هم شیک، برای خیلی از آقایان سخت است. در المارت سایز بزرگ یک برچسب نیست؛ قواره سینه، قد و دمپا برای هیکل درشت دوخته شده است. همه محصولات 4XL تا 6XL را اینجا ببینید.</p></div><img class="banner-img" src="${BASE}/assets/p/${mainBase(list[0])}-480.webp" alt="" width="480" height="600"></header>
<section class="sec-sm" style="padding-top:12px"><div class="wrap"><div class="grid">${list.map((p, i) => card(ctx, p, i < 2)).join("")}</div></div></section>
<section class="sec-sm"><div class="wrap"><div class="fit rv"><div><h2>سایز دقیق خودت رو بدون حدس بخر.</h2><p>سایزیاب بر اساس قد و وزن، از L تا 6XL پیشنهاد می‌دهد.</p></div>${sizer()}</div></div></section>
<section class="sec-sm"><div class="wrap"><div class="sec-head"><div><span class="kicker">تا 3XL</span><h2>مدل‌های دیگر با سایز 3XL</h2></div></div><div class="grid">${xl3.slice(0, 8).map((p) => card(ctx, p)).join("")}</div></div></section>
<section class="sec-sm bg-cream"><div class="wrap faq">${qa.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`,
  });
}

function sizeGuide(ctx) {
  const items = [["/", "خانه"], ["/size-guide/", "سایزیاب و جدول سایز"]];
  const rows = [["L", "۱۶۵–۱۷۵", "۶۶–۷۵", "۵۰", "۷۲"], ["XL", "۱۷۰–۱۸۰", "۷۵–۸۵", "۵۳", "۷۴"], ["2XL", "۱۷۵–۱۸۵", "۸۵–۹۵", "۵۶", "۷۶"], ["3XL", "۱۷۵–۱۸۸", "۹۵–۱۰۵", "۵۹", "۷۸"], ["4XL", "۱۷۵–۱۹۰", "۱۰۵–۱۱۸", "۶۲", "۸۰"], ["5XL", "۱۷۵–۱۹۲", "۱۱۸–۱۳۲", "۶۵", "۸۲"], ["6XL", "۱۸۰–۱۹۵", "۱۳۲+", "۶۸", "۸۴"]];
  return layout(ctx, {
    path: "/size-guide/",
    title: "سایزیاب و جدول سایز لباس مردانه (L تا 6XL)",
    desc: "جدول سایز تیشرت، شلوار و هودی مردانه از L تا 6XL بر اساس قد و وزن؛ با سایزیاب آنلاین المارت سایز دقیق خود را در چند ثانیه پیدا کنید.",
    schema: [crumbSchema(ctx, items)],
    body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>سایزیاب و جدول سایز مردانه</h1><p>قد و وزن خود را وارد کنید تا سایز پیشنهادی را ببینید، یا از جدول زیر استفاده کنید. اندازه دقیق هر مدل در صفحه همان محصول آمده است.</p></header>
<section class="sec-sm"><div class="wrap" style="max-width:640px">${sizer()}</div></section>
<section class="sec-sm"><div class="wrap prose">
<h2>جدول سایز تیشرت و بلوز مردانه</h2>
<table><thead><tr><th>سایز</th><th>قد (سانتی‌متر)</th><th>وزن (کیلوگرم)</th><th>عرض سینه</th><th>قد لباس</th></tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' style="direction:ltr;font-weight:800"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
<div class="note">عرض سینه و قد لباس تقریبی و بر حسب سانتی‌متر است و بین مدل‌های باکسی، اورسایز و جذب کمی تفاوت دارد. تیشرت‌های باکسی را در سایز همیشگی خود سفارش دهید.</div>
<h2>جدول سایز شلوار اسلش و شلوارک</h2>
<table><thead><tr><th>سایز</th><th>وزن تقریبی</th><th>قد شلوار</th></tr></thead><tbody>
<tr><td style="direction:ltr;font-weight:800">L – XL</td><td>۶۵ تا ۸۵</td><td>۱۰۰</td></tr>
<tr><td style="direction:ltr;font-weight:800">2XL</td><td>۸۵ تا ۹۵</td><td>۱۰۵</td></tr>
<tr><td style="direction:ltr;font-weight:800">3XL</td><td>۹۰ تا ۱۰۵</td><td>۱۱۰</td></tr>
<tr><td style="direction:ltr;font-weight:800">4XL</td><td>۱۰۵ تا ۱۲۰</td><td>۱۱۰</td></tr>
<tr><td style="direction:ltr;font-weight:800">5XL – 6XL</td><td>۱۲۰ به بالا</td><td>۱۱۰</td></tr></tbody></table>
<h2>اندازه‌گیری درست در خانه</h2>
<ul><li><b>عرض سینه:</b> یک تیشرت که اندازه‌تان است را صاف روی زمین بگذارید و زیر بغل تا زیر بغل را اندازه بگیرید.</li><li><b>قد لباس:</b> از بالاترین نقطه شانه تا پایین لبه لباس.</li><li><b>قد شلوار:</b> از کمر تا پایین دمپا در کنار پا.</li></ul>
<p>هنوز مطمئن نیستید؟ عکس و اندازه‌هایتان را در <a href="${STORE.igDm}" target="_blank" rel="noopener">اینستاگرام المارت</a> بفرستید؛ کمکتان می‌کنیم.</p>
</div></section>`,
  });
}

function about(ctx) {
  const items = [["/", "خانه"], ["/about/", "داستان ما"]];
  return layout(ctx, {
    path: "/about/",
    title: "داستان المارت؛ ۶۰ سال در بازار سرپوشیده تبریز",
    desc: `المارت (ELLMARRT) تولیدی و پخش پوشاک مردانه در بازار بزرگ تبریز است؛ کاری خانوادگی که ${fa(STORE.years)} سال پیش آغاز شد و حالا آنلاین به سراسر ایران می‌فروشد.`,
    schema: [crumbSchema(ctx, items), orgSchema(ctx)],
    body: `${crumbs(ctx, items)}
<section class="sec-sm"><div class="wrap story">
<div class="story-media"><div class="arch"><img src="${ctx.BASE}/assets/p/60209573-960.webp" alt="ست مردانه المارت" width="960" height="1200" fetchpriority="high"></div><div class="badge-yr"><b class="num">${fa(STORE.years)}</b>سال سابقه</div></div>
<div class="prose" style="margin:0">
<span class="kicker">داستان ما</span>
<h1 style="font-size:clamp(28px,4vw,46px)">از یک حجره در بازار تبریز تا خانه شما</h1>
<p>من همیشه دوست داشتم کسب‌وکار خودم را داشته باشم. غرفه‌ای که امروز اداره می‌کنم ${fa(STORE.years)} سال است در بازار سرپوشیده تبریز فعالیت می‌کند؛ این کار را از پدرم به ارث بردم و راه او را ادامه می‌دهم.</p>
<p>روزهای اول سخت بود؛ مشتری کم و فروش پایین. اما هر روز یاد گرفتیم و بهتر شدیم. امروز همان حجره کوچک جایی است که مشتری‌ها با لبخند می‌آیند — و حالا با سایت المارت، همان اعتماد بازار را به سراسر ایران می‌بریم.</p>
<h2>چیزهایی که برایمان مهم است</h2>
<ul><li><b>جنس بازاری، قیمت منصفانه:</b> اجناس با تجربه چند نسل انتخاب می‌شوند.</li><li><b>عکس واقعی، سایز دقیق:</b> هر کالا قبل از ارسال بررسی می‌شود.</li><li><b>ارسال روز اول کاری:</b> بسته‌بندی ایمن به سراسر کشور.</li><li><b>سایز بزرگ واقعی:</b> برای آقایانی که همیشه دنبال لباس اندازه می‌گشتند.</li></ul>
<p><a class="btn btn-ink" href="${ctx.BASE}/shop/">دیدن کالکشن</a> <a class="btn btn-ghost" href="${STORE.instagram}" target="_blank" rel="noopener">${I.ig} @${STORE.igHandle}</a></p>
</div></div></section>`,
  });
}

const FAQ_FULL = [
  ["چطور سفارش بدهم؟", "در صفحه هر محصول سایز و رنگ را انتخاب کنید و روی «خرید امن از غرفه المارت در باسلام» بزنید. سفارش و پرداخت در باسلام انجام می‌شود."],
  ["چرا پرداخت در باسلام انجام می‌شود؟", "باسلام بازار آنلاین معتبر ایرانی است؛ پرداخت شما تا زمان دریافت کالا نزد باسلام امن می‌ماند و از ضمانت بازگشت وجه باسلام بهره‌مند می‌شوید."],
  ["هزینه و زمان ارسال چقدر است؟", "ارسال از روز اول کاری بعد از سفارش با پست پیشتاز یا سفارشی انجام می‌شود و هزینه دقیق هنگام ثبت سفارش در باسلام محاسبه می‌شود. در تبریز پیک موتوری هم داریم."],
  ["اگر سایز اندازه نبود چه کنم؟", "قبل از خرید از سایزیاب و جدول سایز استفاده کنید. اگر مشکلی پیش آمد، از طریق پیام باسلام یا اینستاگرام با ما در تماس باشید تا مطابق قوانین باسلام راهنمایی‌تان کنیم."],
  ["آیا رنگ‌ها با عکس یکی است؟", "عکس‌های اصلی با نور استودیو گرفته شده‌اند و رنگ و جنس کالا دقیقاً همان است. ممکن است بسته به نمایشگر، تفاوت جزئی در رنگ دیده شود. عکس‌های غرفه هم در گالری محصول هست."],
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
    title: "راهنمای خرید شلوار اسلش مردانه؛ جنس، مدل و سایز",
    desc: "شلوار اسلش مردانه چه جنسی بخریم؟ تفاوت کتان کشی، اسپان و تمام‌نخ، مدل‌های بغل‌نوار، کارگو، بگ و مچی، و انتخاب سایز درست تا 6XL.",
    cats: ["pants"],
    html: (ctx) => `<p>شلوار اسلش پرکاربردترین شلوار کمد هر مرد است؛ از پیاده‌روی و سفر تا دورهمی و محیط کار نیمه‌رسمی. اما «اسلش» اسم یک مدل نیست و ده‌ها جنس و برش دارد. در این راهنما، با تجربه چند دهه فروش در بازار تبریز، می‌گوییم چه بخرید.</p>
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
    title: "لباس سایز بزرگ مردانه؛ چطور شیک و اندازه بپوشیم",
    desc: "راهنمای خرید لباس سایز بزرگ مردانه: انتخاب تیشرت و شلوار 4XL تا 6XL، قواره درست، رنگ‌ها و مدل‌هایی که آقایان درشت‌اندام را خوش‌استایل‌تر نشان می‌دهند.",
    cats: ["tshirt", "pants"],
    html: (ctx) => `<p>خیلی از برندها «سایز بزرگ» را فقط روی برچسب می‌نویسند؛ لباس عرض دارد اما قد و سرشانه‌اش اندازه نیست. اینجا یاد می‌گیرید لباس سایز بزرگ واقعی را چطور تشخیص دهید.</p>
<h2>۱. سرشانه و قد لباس مهم‌تر از عرض است</h2>
<p>تیشرت سایز بزرگ خوب باید هم عرض سینه کافی داشته باشد و هم قد بلندتری (۸۰ سانتی‌متر یا بیشتر در 4XL) تا هنگام نشستن بالا نرود.</p>
<h2>۲. جنس ضخیم‌تر، فرم بهتر</h2>
<p>پنبه نمره ۲۸ یا نخ ۳۰ گرم روی بدن نمی‌چسبد و برجستگی‌ها را کمتر نشان می‌دهد. پارچه‌های خیلی نازک و کش‌دار را برای سایزهای بزرگ توصیه نمی‌کنیم.</p>
<h2>۳. رنگ و مدل</h2>
<ul><li>رنگ‌های تیره و یکدست (مشکی، سرمه‌ای، زغالی، یشمی) هیکل را متناسب‌تر نشان می‌دهند.</li><li>تیشرت یقه‌دار و پولوشرت ظاهر مرتب‌تری از یقه گرد می‌دهند.</li><li>شلوار اسلش با دمپای ساده (نه خیلی تنگ) تناسب بالا و پایین تنه را حفظ می‌کند.</li></ul>
<p><a href="${ctx.BASE}/big-size/">کالکشن سایز بزرگ المارت</a> را ببینید؛ تیشرت تا 5XL و شلوار تا 6XL.</p>`,
  },
];

function guide(ctx, g) {
  const items = [["/", "خانه"], ["/guide/", "راهنمای خرید"], [`/guide/${g.slug}/`, g.title]];
  const prods = ctx.products.filter((p) => g.cats.includes(p.cat) && p.inStock && (g.slug !== "big-size-men" || isBig(p))).slice(0, 4);
  return layout(ctx, {
    path: `/guide/${g.slug}/`,
    title: g.title,
    desc: g.desc,
    ogType: "article",
    schema: [crumbSchema(ctx, items), { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.desc, inLanguage: "fa-IR", author: { "@type": "Organization", name: STORE.name }, publisher: { "@id": `${ctx.SITE_URL}/#store` }, mainEntityOfPage: `${ctx.SITE_URL}/guide/${g.slug}/`, datePublished: "2026-10-12" }],
    body: `${crumbs(ctx, items)}<article class="sec-sm"><div class="wrap prose"><h1 style="font-size:clamp(28px,4vw,42px)">${g.title}</h1>${g.html(ctx)}</div></article>
<section class="sec-sm bg-cream"><div class="wrap"><div class="sec-head"><h2>محصولات مرتبط</h2></div><div class="grid">${prods.map((p) => card(ctx, p)).join("")}</div></div></section>`,
  });
}

function guideIndex(ctx) {
  const items = [["/", "خانه"], ["/guide/", "راهنمای خرید"]];
  return layout(ctx, {
    path: "/guide/",
    title: "راهنمای خرید پوشاک مردانه",
    desc: "مقاله‌های راهنمای خرید المارت: انتخاب شلوار اسلش، لباس سایز بزرگ مردانه و جدول سایز.",
    schema: [crumbSchema(ctx, items)],
    body: `${crumbs(ctx, items)}<header class="wrap phead"><h1>راهنمای خرید</h1><p>تجربه چند دهه فروش در بازار تبریز، خلاصه در چند مقاله کوتاه.</p></header>
<section class="sec-sm"><div class="wrap faq">${guides.map((g) => `<p><a class="link" style="font-size:19px" href="${ctx.BASE}/guide/${g.slug}/">${g.title}</a><br><span style="color:var(--muted)">${g.desc}</span></p>`).join("")}<p><a class="link" style="font-size:19px" href="${ctx.BASE}/size-guide/">سایزیاب و جدول سایز مردانه</a></p></div></section>`,
  });
}

function notFound(ctx) {
  return layout(ctx, {
    path: "/404.html", noindex: true,
    title: "صفحه پیدا نشد",
    desc: "صفحه مورد نظر پیدا نشد.",
    body: `<section class="sec"><div class="wrap" style="text-align:center"><h1 style="font-size:64px">۴۰۴</h1><p>این صفحه پیدا نشد؛ شاید محصول جابه‌جا شده باشد.</p><p><a class="btn btn-ink" href="${ctx.BASE}/shop/">رفتن به فروشگاه</a></p></div></section>`,
  });
}

function llms(ctx) {
  return `# ${STORE.name} (${STORE.latin})
> ${STORE.full} — ${STORE.bazaar}، ${fa(STORE.years)} سال سابقه. پوشاک مردانه روزمره و سایز بزرگ تا 6XL. خرید از طریق غرفه باسلام: ${STORE.basalam}

## صفحات
- ${ctx.SITE_URL}/shop/ : همه محصولات
- ${ctx.SITE_URL}/big-size/ : لباس سایز بزرگ مردانه
- ${ctx.SITE_URL}/size-guide/ : جدول سایز و سایزیاب
- ${ctx.SITE_URL}/faq/ : ارسال و پرداخت

## محصولات
${ctx.products.map((p) => `- ${p.title} — ${fa(p.price)} تومان${p.sizes.length ? ` — سایز ${p.sizes.join("/")}` : ""}: ${ctx.SITE_URL}/p/${p.id}/`).join("\n")}
`;
}

const info = require("./pages-info")({ layout, crumbs, crumbSchema, orgSchema, STORE, I, fa0 });
module.exports = { ...info, catalog: (ctx) => ctx.products.map((p) => cardData(ctx, p)), home, shop, category, product, bigSize, sizeGuide, about, faq, guide, guideIndex, guides, notFound, llms };

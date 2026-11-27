// Static site generator for ELLMARRT (المارت). Output: docs/ (served by GitHub Pages).
// SITE_URL env overrides the canonical origin (e.g. a custom domain later).
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { load } = require("./catalog");
const CURATED = require("../data/curated");
const pages = require("./pages");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs");
const SITE_URL = (process.env.SITE_URL || "https://ellmarrt.ir").replace(/\/$/, "");
const BASE = new URL(SITE_URL).pathname.replace(/\/$/, "");
// cache-busting version = hash of css+js, so identical builds produce identical HTML
const VERSION = require("crypto").createHash("md5").update((fs.readFileSync(path.join(ROOT, "assets/css/site.css"), "utf8") + fs.readFileSync(path.join(ROOT, "assets/js/site.js"), "utf8")).replace(/\r\n/g, "\n")).digest("hex").slice(0, 8);

const { products, all, allReviews, CATEGORIES, SIZE_ORDER, storeReviews } = load();
const meta = fs.existsSync(path.join(ROOT, "data-raw/_meta.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, "data-raw/_meta.json"), "utf8")) : {};
const ctx = { products, CATEGORIES, SITE_URL, BASE, VERSION, storeReviews, syncedAt: meta.syncedAt };

// paths published by the previous build: stock-driven pages (colour, style, shoe size…) that Google already knows stay
// alive when stock drops, and anything that still disappears gets a redirect stub instead of a 404
// Search Console reported this historical colour URL as 404; retain it even if it predates the sitemap archive.
ctx.prev = new Set(["/c/sweatshirt/burgundy/"]);
try {
  const old = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
  for (const m of old.matchAll(/<loc>([^<]+)<\/loc>/g)) ctx.prev.add(m[1].replace(SITE_URL, "") || "/");
} catch {}
try { for (const l of fs.readFileSync(path.join(OUT, "retired.txt"), "utf8").split("\n")) if (l.startsWith("/")) ctx.prev.add(l.trim()); } catch {}

// clean output (keep CNAME if any)
const cname = fs.existsSync(path.join(OUT, "CNAME")) ? fs.readFileSync(path.join(OUT, "CNAME")) : null;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
if (cname) fs.writeFileSync(path.join(OUT, "CNAME"), cname);

const write = (rel, html) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};
const copyDir = (src, dst) => {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, f.name), d = path.join(dst, f.name);
    f.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
};

// Enamad domain ownership verification; preserve on every rebuild.
write("25394575.txt", "");
// IndexNow key file (Bing/Yandex); preserve on every rebuild.
write("5553601b0a9b596a60aaaad7a46fb679.txt", "5553601b0a9b596a60aaaad7a46fb679");

// assets
copyDir(path.join(ROOT, "assets"), path.join(OUT, "assets"));
fs.mkdirSync(path.join(OUT, "assets/fonts"), { recursive: true });
// font: subset copy lives in assets/fonts (python -m fontTools.subset, see README)
fs.copyFileSync(path.join(ROOT, "assets/img/favicon-48.png"), path.join(OUT, "favicon.png"));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const defaultLastmod = (ctx.syncedAt ? new Date(ctx.syncedAt) : new Date()).toISOString().slice(0, 10);
const toDate = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString().slice(0, 10) : null;
};
const maxDate = (...dates) => {
  const valid = dates.flat().map(toDate).filter(Boolean).sort();
  return valid.length ? valid[valid.length - 1] : null;
};
const gitDates = new Map();
const gitDate = (relPath) => {
  if (gitDates.has(relPath)) return gitDates.get(relPath);
  let d = null;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", relPath], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    d = toDate(out);
  } catch {}
  if (!d) {
    try { d = fs.statSync(path.join(ROOT, relPath)).mtime.toISOString().slice(0, 10); } catch {}
  }
  const res = d || defaultLastmod;
  gitDates.set(relPath, res);
  return res;
};
const prodLastmod = (p) => maxDate(p.updated, p.created, ...(p.reviews || []).map((r) => r.date)) || defaultLastmod;
const listLastmod = (list, fallbackFile) => maxDate(...(list || []).map(prodLastmod)) || gitDate(fallbackFile);
const allProdLastmod = maxDate(...products.map(prodLastmod));
const guidesLastmod = maxDate(...pages.guides.map((g) => g.updated || g.date)) || gitDate("scripts/pages.js");

const assetPExists = (file) => fs.existsSync(path.join(ROOT, "assets/p", file));
const assetExists = (loc) => !loc || !loc.startsWith(`${SITE_URL}/assets/`) ? true : fs.existsSync(path.join(ROOT, loc.slice(SITE_URL.length + 1)));
const dedupImages = (arr) => {
  const out = [], seen = new Set();
  for (const img of arr || []) {
    const loc = typeof img === "string" ? img : img && img.loc;
    if (!loc || seen.has(loc) || !assetExists(loc)) continue;
    seen.add(loc);
    out.push(typeof img === "string" ? { loc, title: "" } : img);
  }
  return out;
};
const listImages = (ctx, list, limit = 6) => {
  const out = [], seen = new Set();
  for (const p of list || []) {
    const file = `${pages.mainBase(p)}-960.webp`;
    if (!assetPExists(file)) continue;
    const loc = `${SITE_URL}/assets/p/${file}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    out.push({ loc, title: pages.imgAlt(ctx, p) });
    if (out.length >= limit) break;
  }
  return out;
};

const urls = [];
const emit = (route, html, meta = {}) => {
  write(route === "/" ? "index.html" : route.replace(/^\//, "") + (route.endsWith(".html") ? "" : "index.html"), html);
  if (!meta.noindex) urls.push({ loc: SITE_URL + route, images: dedupImages(meta.images), priority: meta.priority || 0.6, lastmod: toDate(meta.lastmod) || defaultLastmod });
};

const rankSales = (a, b) => (b.sales || 0) - (a.sales || 0) || a.price - b.price;
const BIG = ["3XL", "4XL", "5XL", "6XL"];
const shopSorted = [...products].sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock) || (b.sales - a.sales));
const homeLastmod = maxDate(allProdLastmod, guidesLastmod, gitDate("scripts/pages.js"));

emit("/", pages.home(ctx), { priority: 1, lastmod: homeLastmod, images: [{ loc: `${SITE_URL}/assets/img/hero-campaign-1600.webp`, title: "کالکشن پوشاک مردانه المارت — بازار سرپوشیده تبریز" }] });
emit("/shop/", pages.shop(ctx), { priority: 0.9, lastmod: homeLastmod, images: listImages(ctx, shopSorted) });
for (const c of Object.values(CATEGORIES)) {
  const key = Object.keys(CATEGORIES).find((k) => CATEGORIES[k] === c);
  const catList = products.filter((p) => p.cat === key).sort((a, b) => (b.featured - a.featured) || (b.inStock - a.inStock) || (b.sales - a.sales));
  if (!catList.length) continue;
  emit(`/c/${c.slug}/`, pages.category(ctx, c), { priority: 0.85, lastmod: listLastmod(catList, "scripts/pages.js"), images: listImages(ctx, catList) });
}
for (const p of products) {
  const imgs = [
    { file: `${pages.mainBase(p)}-960.webp`, title: pages.imgAlt(ctx, p) },
    ...(p.colorImages || []).map((i) => ({ file: `${p.id}-k${i}-960.webp`, title: pages.imgAlt(ctx, p, { color: p.colors[i] }) })),
    ...(p.images.gallery || []).map((g, i) => ({ file: g.file, title: pages.imgAlt(ctx, p, { suffix: `عکس واقعی ${pages.fa(i + 1)}` }) })),
  ].filter((x) => assetPExists(x.file)).map((x) => ({ loc: `${SITE_URL}/assets/p/${x.file}`, title: x.title }));
  emit(`/p/${p.id}/`, pages.product(ctx, p), { priority: 0.8, lastmod: prodLastmod(p), images: imgs });
}
for (const pg of pages.colorPages(ctx)) emit(pages.colorPath(ctx, pg.cat, pg.g), pages.colorPage(ctx, pg), { priority: 0.75, lastmod: listLastmod(pg.list, "scripts/pages-colors.js"), images: pages.colorImages(ctx, pg) });
for (const pg of pages.stylePages(ctx)) emit(pages.stylePath(ctx, pg), pages.stylePage(ctx, pg), { priority: 0.75, lastmod: listLastmod(pg.list, "scripts/pages-styles.js"), images: pages.styleImages(ctx, pg) });
for (const pg of pages.pricePages(ctx)) emit(pages.pricePath(ctx, pg), pages.pricePage(ctx, pg), { priority: 0.7, lastmod: listLastmod(pg.list, "scripts/pages-price.js"), images: pages.priceImages(ctx, pg) });
const bigAll = [...products.filter((p) => p.inStock && pages.isBig(p)), ...products.filter((p) => p.inStock && !pages.isBig(p) && pages.liveSizes(p).includes("3XL"))];
emit("/big-size/", pages.bigSize(ctx), { priority: 0.85, lastmod: listLastmod(bigAll, "scripts/pages.js"), images: listImages(ctx, bigAll) });
emit("/size-guide/", pages.sizeGuide(ctx), { priority: 0.7, lastmod: gitDate("scripts/pages.js") });
for (const s of pages.sizePages) {
  const sList = products.filter((p) => p.inStock && pages.liveSizes(p).includes(s)).sort(rankSales);
  emit(`/size/${s.toLowerCase()}/`, pages.sizePage(ctx, s), { priority: 0.75, lastmod: listLastmod(sList, "scripts/pages-sizes.js"), images: listImages(ctx, sList) });
}
for (const k of pages.garmentKinds(ctx)) {
  const gList = products.filter((p) => p.inStock && pages.GARMENTS[k].cats.includes(p.cat)).sort(rankSales);
  emit(`/size/${k}/`, pages.garmentPage(ctx, k), { priority: 0.75, lastmod: listLastmod(gList, "scripts/pages-garments.js"), images: listImages(ctx, gList) });
}
const wBig = products.filter((p) => p.inStock && pages.liveSizes(p).some((z) => BIG.includes(z))).sort(rankSales).slice(0, 4);
const wSeen = new Set(wBig.map((p) => p.id));
const wHub = [...wBig, ...products.filter((p) => p.inStock && !wSeen.has(p.id)).sort(rankSales).slice(0, 4)];
emit("/size/weight/", pages.weightHub(ctx), { priority: 0.75, lastmod: listLastmod(wHub, "scripts/pages-weight.js"), images: listImages(ctx, wHub) });
const faNum = (s) => Number(String(s).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const TOPS_W = pages.SIZE_ROWS.map((r) => { const [a, b] = r[2].split(/[–+]/); return [r[0], faNum(a), b ? faNum(b) : 999]; });
const PANTS_W = [["XL", 65, 85], ["2XL", 85, 95], ["3XL", 90, 105], ["4XL", 105, 120], ["5XL", 120, 999], ["6XL", 120, 999]];
const TOP_CATS = ["tshirt", "polo", "shirt", "sweat"], LOW_CATS = ["pants", "shorts"];
for (const w of pages.weightPages) {
  const topsW = TOPS_W.filter(([, a, b]) => w >= a && w <= b).map((x) => x[0]);
  const pantsW = PANTS_W.filter(([, a, b]) => w >= a && w <= b).map((x) => x[0]);
  const mainSz = topsW[topsW.length - 1];
  const topList = products.filter((p) => p.inStock && TOP_CATS.includes(p.cat) && pages.liveSizes(p).includes(mainSz)).sort(rankSales);
  const lowList = pantsW.length ? products.filter((p) => p.inStock && LOW_CATS.includes(p.cat) && pages.liveSizes(p).includes(pantsW[pantsW.length - 1])).sort(rankSales) : [];
  const wl = [...topList.slice(0, 8), ...lowList.slice(0, 4)];
  emit(`/size/weight/${w}/`, pages.weightPage(ctx, w), { priority: 0.65, lastmod: listLastmod(wl, "scripts/pages-weight.js"), images: listImages(ctx, wl) });
}
const btList = products.filter((p) => p.inStock && pages.liveSizes(p).some((z) => BIG.includes(z))).sort(rankSales);
emit("/big-size/tabriz/", pages.bigTabriz(ctx), { priority: 0.8, lastmod: listLastmod(btList, "scripts/pages-weight.js"), images: listImages(ctx, btList) });
const shoesList = products.filter((p) => p.inStock && p.cat === "shoes").sort(rankSales);
if (pages.shoeChart(ctx)) emit("/size/shoes/", pages.shoePage(ctx), { priority: 0.7, lastmod: listLastmod(shoesList, "scripts/pages-sizes.js"), images: listImages(ctx, shoesList) });
for (const z of pages.shoeSizes(ctx)) {
  const hasZ = shoesList.filter((p) => pages.liveSizes(p).includes(z));
  const szList = hasZ.length ? hasZ : shoesList;
  emit(`/size/shoes/${z}/`, pages.shoeSizePage(ctx, z), { priority: 0.65, lastmod: listLastmod(szList, "scripts/pages-sizes.js"), images: listImages(ctx, szList) });
}
emit("/wholesale/", pages.wholesale(ctx), { priority: 0.7, lastmod: gitDate("scripts/pages-sizes.js") });
for (const k of pages.bigCats(ctx)) {
  const bcList = products.filter((p) => p.inStock && p.cat === k && pages.liveSizes(p).some((z) => BIG.includes(z)))
    .sort((a, b) => SIZE_ORDER.indexOf(pages.liveSizes(b).slice(-1)[0]) - SIZE_ORDER.indexOf(pages.liveSizes(a).slice(-1)[0]) || rankSales(a, b));
  emit(`/big-size/${CATEGORIES[k].slug}/`, pages.bigCat(ctx, k), { priority: 0.8, lastmod: listLastmod(bcList, "scripts/pages-sizes.js"), images: listImages(ctx, bcList) });
}
const aboutImgs = [
  { loc: `${SITE_URL}/assets/img/hojreh-1280.webp`, title: "غرفه المارت در بازار سرپوشیده تبریز" },
  ...[49701761, 50436324, 65852930, 53765502]
    .map((id) => products.find((p) => p.id === id))
    .map((p) => p && ({ p, g: pages.realPick(p) }))
    .filter((x) => x && x.g && assetPExists(x.g.file))
    .map(({ p, g }) => ({ loc: `${SITE_URL}/assets/p/${g.file}`, title: pages.imgAlt(ctx, p, { suffix: "عکس واقعی" }) })),
];
emit("/about/", pages.about(ctx), { priority: 0.6, lastmod: gitDate("scripts/pages.js"), images: aboutImgs });
const tbList = products.filter((p) => p.inStock).sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 8);
emit("/tabriz-bazaar/", pages.tabrizBazaar(ctx), { priority: 0.7, lastmod: gitDate("scripts/pages.js"), images: listImages(ctx, tbList) });
emit("/faq/", pages.faq(ctx), { priority: 0.6, lastmod: gitDate("scripts/pages.js") });
emit("/contact/", pages.contact(ctx), { priority: 0.7, lastmod: gitDate("scripts/pages-info.js"), images: [{ loc: `${SITE_URL}/assets/img/hojreh-640.webp`, title: "حجره المارت در بازار سرپوشیده تبریز" }] });
emit("/terms/", pages.terms(ctx), { priority: 0.3, lastmod: gitDate("scripts/pages-info.js") });
emit("/privacy/", pages.privacy(ctx), { priority: 0.3, lastmod: gitDate("scripts/pages-info.js") });
emit("/shipping-returns/", pages.shipping(ctx), { priority: 0.5, lastmod: gitDate("scripts/pages-info.js") });
for (const g of pages.guides) {
  const cov = pages.guideCover(ctx, g);
  const gImg = cov && assetPExists(`${pages.mainBase(cov)}-960.webp`) ? [{ loc: `${SITE_URL}/assets/p/${pages.mainBase(cov)}-960.webp`, title: g.title }] : [];
  emit(`/guide/${g.slug}/`, pages.guide(ctx, g), { priority: 0.7, lastmod: toDate(g.updated || g.date) || gitDate("scripts/pages.js"), images: gImg });
}
const guideIndexImgs = [];
for (const g of pages.guides) {
  const cov = pages.guideCover(ctx, g);
  if (!cov || !assetPExists(`${pages.mainBase(cov)}-960.webp`)) continue;
  guideIndexImgs.push({ loc: `${SITE_URL}/assets/p/${pages.mainBase(cov)}-960.webp`, title: g.title });
  if (guideIndexImgs.length >= 6) break;
}
emit("/guide/", pages.guideIndex(ctx), { priority: 0.6, lastmod: guidesLastmod, images: guideIndexImgs });
write("404.html", pages.notFound(ctx));

// pages that were in the last sitemap but are gone now (stock ran out, product removed): redirect to the closest
// parent page that exists, so links and rankings are not thrown away. Not listed in the new sitemap.
const KNOWN_RETIRED = ["/p/46296076/", "/p/44437851/"];
const SPECIFIC_REDIRECTS = {
  "/p/46296076/": "/c/tshirt/boxy/",
  "/p/44437851/": "/c/pants/cargo/",
};
const live = new Set(urls.map((u) => u.loc.replace(SITE_URL, "") || "/"));
const retired = [];
for (const p of new Set([...ctx.prev, ...KNOWN_RETIRED])) {
  if (live.has(p) || !p.startsWith("/") || p.includes("?")) continue;
  let to = p.replace(/[^/]+\/$/, "");
  while (to.length > 1 && !live.has(to)) to = to.replace(/[^/]+\/$/, "");
  if (p.startsWith("/p/")) {
    const id = (p.match(/^\/p\/(\d+)\/$/) || [])[1];
    const curCat = id && CURATED[id] && CATEGORIES[CURATED[id][1]] && `/c/${CATEGORIES[CURATED[id][1]].slug}/`;
    if (SPECIFIC_REDIRECTS[p] && live.has(SPECIFIC_REDIRECTS[p])) to = SPECIFIC_REDIRECTS[p];
    else if (curCat && live.has(curCat)) to = curCat;
    else to = "/shop/";
  }
  const url = SITE_URL + to;
  write(p.replace(/^\//, "") + "index.html", `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>المارت</title><link rel="canonical" href="${url}"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0; url=${url}"></head><body><a href="${url}">ادامه</a></body></html>`);
  retired.push(p);
}
write("retired.txt", retired.sort().join("\n") + "\n");
if (retired.length) console.log(`redirect stubs for ${retired.length} retired pages`);

// sitemap with image extension + lastmod
const xmlEsc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const imgXml = (img) => {
  const loc = typeof img === "string" ? img : img.loc;
  const title = typeof img === "string" ? "" : img.title;
  return `<image:image><image:loc>${xmlEsc(loc)}</image:loc>${title ? `<image:title>${xmlEsc(title)}</image:title>` : ""}</image:image>`;
};
write("sitemap.xml", pages.fillSizes(ctx, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `<url><loc>${xmlEsc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority>${u.images.map(imgXml).join("")}</url>`).join("\n")}
</urlset>
`));
const feedProducts = [...products].filter((p) => p.inStock).sort((a, b) => b.created.localeCompare(a.created) || (b.featured - a.featured) || ((b.sales || 0) - (a.sales || 0))).slice(0, 15);
const feedItems = [
  ...pages.guides.map((g) => `<item><title>${xmlEsc(g.title)}</title><link>${SITE_URL}/guide/${g.slug}/</link><guid isPermaLink="true">${SITE_URL}/guide/${g.slug}/</guid><pubDate>${new Date(g.updated || g.date || "2026-11-26").toUTCString()}</pubDate><description>${xmlEsc(g.desc)}</description></item>`),
  ...feedProducts.map((p) => `<item><title>${xmlEsc(p.title)}</title><link>${SITE_URL}/p/${p.id}/</link><guid isPermaLink="true">${SITE_URL}/p/${p.id}/</guid><pubDate>${new Date(p.created || ctx.syncedAt || Date.now()).toUTCString()}</pubDate><description>${xmlEsc(`${p.copy.lead} قیمت ${Number(p.price).toLocaleString("fa-IR")} تومان؛ خرید از المارت بازار تبریز.`)}</description></item>`),
];
write("feed.xml", pages.fillSizes(ctx, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>المارت (ELLMARRT) — پوشاک مردانه بازار تبریز</title>
<link>${SITE_URL}/</link>
<description>تازه‌ترین محصولات و راهنماهای خرید پوشاک مردانه و سایز بزرگ المارت از بازار سرپوشیده تبریز.</description>
<language>fa-IR</language>
<lastBuildDate>${new Date(ctx.syncedAt || Date.now()).toUTCString()}</lastBuildDate>
<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${feedItems.join("\n")}
</channel>
</rss>
`));
const aiBots = ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "Bingbot", "Googlebot"];
write("robots.txt", [
  ...aiBots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /admin/\n`),
  `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
].join("\n"));
write("manifest.webmanifest", JSON.stringify({
  name: "المارت | ELLMARRT", short_name: "المارت", lang: "fa", dir: "rtl", start_url: `${BASE}/`, display: "standalone",
  background_color: "#F7F9FC", theme_color: "#1D4ED8",
  icons: [{ src: `${BASE}/assets/img/icon-192.png`, sizes: "192x192", type: "image/png" }, { src: `${BASE}/assets/img/icon-512.png`, sizes: "512x512", type: "image/png" }],
}));
write("llms.txt", pages.llms(ctx));
write("llms-full.txt", pages.llmsFull(ctx));
write("assets/catalog.json", JSON.stringify(pages.catalog(ctx)));
write("assets/ai-catalog.json", JSON.stringify(pages.aiCatalog(ctx)));
// admin panel (static app + data snapshot); never indexed
copyDir(path.join(ROOT, "admin"), path.join(OUT, "admin"));
const adminIndex = path.join(OUT, "admin/index.html");
let adminHtml = fs.readFileSync(adminIndex, "utf8").split("__V__").join(VERSION);
const adminNl = adminHtml.includes("\r\n") ? "\r\n" : "\n";
const adminHeadExtra = [
  !/name="description"/i.test(adminHtml) && '<meta name="description" content="پنل مدیریت فروشگاه پوشاک مردانه المارت برای مدیریت محصولات، سفارش‌ها، نظرات و تنظیمات سایت.">',
  !/rel="canonical"/i.test(adminHtml) && `<link rel="canonical" href="${SITE_URL}/admin/">`,
].filter(Boolean);
if (adminHeadExtra.length) {
  adminHtml = adminHtml.replace("</title>", () => `</title>${adminNl}${adminHeadExtra.join(adminNl)}`);
}
if (!/<h1\b/i.test(adminHtml)) {
  adminHtml = adminHtml.replace('<div id="app" aria-live="polite"></div>', () => '<div id="app" aria-live="polite"><div class="sr"><h1>پنل مدیریت المارت</h1></div></div>');
}
fs.writeFileSync(adminIndex, adminHtml);
write("admin/data.json", JSON.stringify(require("./admin-data")({ all, allReviews, storeReviews, CATEGORIES, SITE_URL, meta })));
console.log(`built ${urls.length} pages -> docs/ (${SITE_URL})`);

// Static site generator for ELLMARRT (المارت). Output: docs/ (served by GitHub Pages).
// SITE_URL env overrides the canonical origin (e.g. a custom domain later).
const fs = require("fs");
const path = require("path");
const { load } = require("./catalog");
const pages = require("./pages");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs");
const SITE_URL = (process.env.SITE_URL || "https://yasinfadayiee.github.io/ellmarrt").replace(/\/$/, "");
const BASE = new URL(SITE_URL).pathname.replace(/\/$/, "");
const VERSION = Date.now().toString(36);

const { products, CATEGORIES } = load();
const ctx = { products, CATEGORIES, SITE_URL, BASE, VERSION };

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

// assets
copyDir(path.join(ROOT, "assets"), path.join(OUT, "assets"));
fs.mkdirSync(path.join(OUT, "assets/fonts"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "node_modules/vazirmatn/fonts/webfonts/Vazirmatn[wght].woff2"), path.join(OUT, "assets/fonts/Vazirmatn-wght.woff2"));
fs.copyFileSync(path.join(ROOT, "assets/img/favicon-48.png"), path.join(OUT, "favicon.png"));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const urls = [];
const emit = (route, html, meta = {}) => {
  write(route === "/" ? "index.html" : route.replace(/^\//, "") + (route.endsWith(".html") ? "" : "index.html"), html);
  if (!meta.noindex) urls.push({ loc: SITE_URL + route, images: meta.images || [], priority: meta.priority || 0.6 });
};

emit("/", pages.home(ctx), { priority: 1, images: [] });
emit("/shop/", pages.shop(ctx), { priority: 0.9 });
for (const c of Object.values(CATEGORIES)) {
  if (!products.some((p) => CATEGORIES[p.cat] === c)) continue;
  emit(`/c/${c.slug}/`, pages.category(ctx, c), { priority: 0.85 });
}
for (const p of products) {
  emit(`/p/${p.id}/`, pages.product(ctx, p), {
    priority: 0.8,
    images: [`${SITE_URL}/assets/p/${p.id}-960.webp`, ...(p.images.gallery || []).slice(0, 3).map((g) => `${SITE_URL}/assets/p/${g.file}`)],
  });
}
emit("/big-size/", pages.bigSize(ctx), { priority: 0.85 });
emit("/size-guide/", pages.sizeGuide(ctx), { priority: 0.7 });
emit("/about/", pages.about(ctx), { priority: 0.6 });
emit("/faq/", pages.faq(ctx), { priority: 0.6 });
for (const g of pages.guides) emit(`/guide/${g.slug}/`, pages.guide(ctx, g), { priority: 0.7 });
emit("/guide/", pages.guideIndex(ctx), { priority: 0.6 });
write("404.html", pages.notFound(ctx));

// sitemap with image extension
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `<url><loc>${xmlEsc(u.loc)}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority>${u.images.map((i) => `<image:image><image:loc>${xmlEsc(i)}</image:loc></image:image>`).join("")}</url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
write("manifest.webmanifest", JSON.stringify({
  name: "المارت | ELLMARRT", short_name: "المارت", lang: "fa", dir: "rtl", start_url: `${BASE}/`, display: "standalone",
  background_color: "#fbf8f2", theme_color: "#141210",
  icons: [{ src: `${BASE}/assets/img/icon-192.png`, sizes: "192x192", type: "image/png" }, { src: `${BASE}/assets/img/icon-512.png`, sizes: "512x512", type: "image/png" }],
}));
write("llms.txt", pages.llms(ctx));
console.log(`built ${urls.length} pages -> docs/ (${SITE_URL})`);

// Post-build Technical SEO, On-Page SEO, and GEO validation suite.
// Run after `node scripts/build.js`.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");

const requiredFiles = [
  "index.html",
  "sitemap.xml",
  "feed.xml",
  "robots.txt",
  "llms.txt",
  "llms-full.txt",
  "size/hoodie/index.html",
  "assets/catalog.json",
  "assets/ai-catalog.json",
  "CNAME",
  "25394575.txt",
  "5553601b0a9b596a60aaaad7a46fb679.txt",
  "c/sweatshirt/burgundy/index.html",
];
for (const rel of requiredFiles) {
  const full = path.join(DOCS, rel);
  assert(fs.existsSync(full), `Missing required file: docs/${rel}`);
  if (rel !== "25394575.txt") assert(fs.statSync(full).size > 0, `Empty required file: docs/${rel}`);
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "admin" && entry.name !== "assets") walk(full);
    } else if (entry.name.endsWith(".html")) {
      htmlFiles.push(full);
    }
  }
}
walk(DOCS);

const titles = new Map();
const descs = new Map();
const brokenLinks = [];
const unreplacedTokens = [];
const titleViolations = [];
const descViolations = [];
const h1Violations = [];
const thinPages = [];
let checkedPages = 0;

for (const file of htmlFiles) {
  const rel = "/" + path.relative(DOCS, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  const html = fs.readFileSync(file, "utf8");

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (href.startsWith("/assets/") || href === "/favicon.png" || href === "/manifest.webmanifest") continue;
    const target = href.endsWith(".html") ? path.join(DOCS, href) : path.join(DOCS, href, "index.html");
    if (!fs.existsSync(target)) brokenLinks.push([rel, href]);
  }

  if (html.includes('http-equiv="refresh"') || rel === "/404.html") continue;
  checkedPages++;

  if (/\{MAX(?::\w+)?\}|\{YEARS\}/.test(html)) unreplacedTokens.push(rel);

  const tm = html.match(/<title>([^<]+)<\/title>/);
  const dm = html.match(/<meta name="description" content="([^"]+)"/);
  const cm = html.match(/<link rel="canonical" href="([^"]+)">/);
  assert(tm, `Missing <title> on ${rel}`);
  assert(dm, `Missing meta description on ${rel}`);
  assert(cm, `Missing canonical on ${rel}`);
  assert(html.includes('hreflang="fa-IR"'), `Missing hreflang="fa-IR" on ${rel}`);
  assert(html.includes('property="og:title"'), `Missing og:title on ${rel}`);
  assert(html.includes('name="twitter:title"'), `Missing twitter:title on ${rel}`);
  assert(html.includes("llms.txt"), `Missing llms.txt discovery link on ${rel}`);
  assert(html.includes('type="application/rss+xml"'), `Missing RSS discovery link on ${rel}`);

  const title = tm[1];
  const desc = dm[1];
  if (title.length < 25 || title.length > 70) titleViolations.push([rel, title.length, title]);
  if (desc.length < 70 || desc.length > 165) descViolations.push([rel, desc.length, desc]);
  titles.set(title, (titles.get(title) || []).concat(rel));
  descs.set(desc, (descs.get(desc) || []).concat(rel));

  const h1Count = [...html.matchAll(/<h1[^>]*>/g)].length;
  if (h1Count !== 1) h1Violations.push([rel, h1Count]);

  const mainM = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const words = (mainM ? mainM[1] : html).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
  if (words < 180) thinPages.push([rel, words]);

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let hasFaqSchema = false;
  for (const sm of schemas) {
    const obj = JSON.parse(sm[1]);
    if (obj["@type"] === "FAQPage") hasFaqSchema = true;
    if (obj["@type"] === "Product" && obj.offers) {
      assert(obj.offers.priceValidUntil, `Missing priceValidUntil on ${rel}`);
      assert(obj.offers.shippingDetails && obj.offers.shippingDetails.deliveryTime && obj.offers.shippingDetails.deliveryTime.transitTime, `Missing shippingDetails/transitTime on ${rel}`);
      assert(obj.offers.hasMerchantReturnPolicy && obj.offers.hasMerchantReturnPolicy.merchantReturnDays === 7, `Missing merchantReturnDays on ${rel}`);
      assert(obj.offers.hasMerchantReturnPolicy.returnMethod && obj.offers.hasMerchantReturnPolicy.returnFees, `Missing returnMethod/returnFees on ${rel}`);
    }
    if (obj["@type"] === "Article") {
      assert(obj.image && obj.image.length, `Missing Article image on ${rel}`);
      assert(obj.dateModified, `Missing Article dateModified on ${rel}`);
    }
    if (obj["@type"] === "ClothingStore" || (Array.isArray(obj["@type"]) && obj["@type"].includes("ClothingStore"))) {
      assert(obj.geo && obj.disambiguatingDescription, `Missing store geo/disambiguatingDescription on ${rel}`);
    }
  }
  if (/^\/guide\/[^/]+\/$/.test(rel)) assert(hasFaqSchema, `Missing FAQPage on guide ${rel}`);
}

for (const [stub, dest] of [["p/46296076/index.html", "/c/tshirt/boxy/"], ["p/44437851/index.html", "/c/pants/cargo/"]]) {
  const full = path.join(DOCS, stub);
  assert(fs.existsSync(full), `Missing retired redirect stub: docs/${stub}`);
  const stubHtml = fs.readFileSync(full, "utf8");
  assert(stubHtml.includes("noindex,follow") && stubHtml.includes(dest), `Invalid redirect stub docs/${stub} (expected ${dest})`);
}

assert.deepEqual(brokenLinks, [], `Broken internal links: ${JSON.stringify(brokenLinks)}`);
assert.deepEqual(unreplacedTokens, [], `Unreplaced tokens: ${JSON.stringify(unreplacedTokens)}`);
assert.deepEqual(h1Violations, [], `H1 count != 1: ${JSON.stringify(h1Violations)}`);
assert.deepEqual(titleViolations, [], `Title length violations: ${JSON.stringify(titleViolations)}`);
assert.deepEqual(descViolations, [], `Meta desc length violations: ${JSON.stringify(descViolations)}`);
assert.deepEqual([...titles.entries()].filter(([, v]) => v.length > 1), [], "Duplicate titles found");
assert.deepEqual([...descs.entries()].filter(([, v]) => v.length > 1), [], "Duplicate meta descriptions found");
assert.deepEqual(thinPages, [], `Thin pages (<180 words): ${JSON.stringify(thinPages)}`);

const robots = fs.readFileSync(path.join(DOCS, "robots.txt"), "utf8");
for (const token of ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Disallow: /admin/", "Sitemap: https://ellmarrt.ir/sitemap.xml"]) {
  assert(robots.includes(token), `robots.txt missing: ${token}`);
}

const sitemap = fs.readFileSync(path.join(DOCS, "sitemap.xml"), "utf8");
assert(sitemap.includes("<lastmod>"), "sitemap.xml missing <lastmod>");
assert(sitemap.includes("<image:title>"), "sitemap.xml missing <image:title>");

const feed = fs.readFileSync(path.join(DOCS, "feed.xml"), "utf8");
assert(feed.includes('<rss version="2.0"') && feed.includes("<item>"), "Invalid docs/feed.xml RSS feed");
assert(!/\{MAX(?::\w+)?\}|\{YEARS\}/.test(feed), "Unreplaced token in feed.xml");

const llms = fs.readFileSync(path.join(DOCS, "llms.txt"), "utf8");
const llmsFull = fs.readFileSync(path.join(DOCS, "llms-full.txt"), "utf8");
assert(!/\{MAX(?::\w+)?\}|\{YEARS\}/.test(llms + llmsFull), "Unreplaced token in llms.txt or llms-full.txt");

const aiCat = JSON.parse(fs.readFileSync(path.join(DOCS, "assets/ai-catalog.json"), "utf8"));
assert(aiCat.store && Array.isArray(aiCat.products) && aiCat.products.length > 0, "Invalid assets/ai-catalog.json");
assert(Array.isArray(aiCat.guides) && aiCat.guides.length > 0 && aiCat.sizeChart && Array.isArray(aiCat.sizeChart.tops), "Missing guides or sizeChart in assets/ai-catalog.json");

console.log(`PASS: ${checkedPages} indexable pages, ${aiCat.products.length} AI-catalog products, 0 broken links, 0 duplicate titles/descs, 0 thin pages, full schema & GEO verified.`);

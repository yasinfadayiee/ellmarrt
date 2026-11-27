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
const altViolations = [];
let checkedPages = 0;
let canonicalStore = null;

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

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const attrs = Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map((x) => [x[1].toLowerCase(), x[3]]));
    const src = attrs.src || "", alt = attrs.alt ?? "";
    if (!src || src.endsWith("/assets/img/mark.svg") || attrs.width === "28") continue;
    if (!alt.trim() || !/[\u0600-\u06FF]/.test(alt) || alt.includes("|") || (src.includes("/assets/p/") && alt.length > 125)) {
      altViolations.push([rel, src, alt]);
    }
  }

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const parsedSchemas = schemas.map((sm) => JSON.parse(sm[1]));
  const typesOf = (obj) => Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]];
  const storeSchemas = parsedSchemas.filter((obj) => {
    const t = typesOf(obj);
    return t.includes("ClothingStore") || t.includes("Organization");
  });
  assert.equal(storeSchemas.length, 1, `Expected exactly 1 ClothingStore/Organization JSON-LD on ${rel}, found ${storeSchemas.length}`);
  const storeObj = storeSchemas[0];
  const storeTypes = typesOf(storeObj);
  assert(storeTypes.includes("ClothingStore") && storeTypes.includes("Organization"), `Store JSON-LD on ${rel} must include both ClothingStore and Organization`);
  assert(storeObj["@id"] && storeObj.name && storeObj.url, `Missing @id/name/url on store JSON-LD on ${rel}`);
  assert(storeObj.logo && storeObj.logo["@type"] === "ImageObject" && storeObj.logo.url, `Store logo must be ImageObject with url on ${rel}`);
  assert(Array.isArray(storeObj.sameAs) && storeObj.sameAs.length >= 3, `Missing store sameAs on ${rel}`);
  assert(storeObj.geo && storeObj.disambiguatingDescription, `Missing store geo/disambiguatingDescription on ${rel}`);
  const storeSig = { "@id": storeObj["@id"], name: storeObj.name, url: storeObj.url, logoUrl: storeObj.logo.url, sameAs: storeObj.sameAs };
  if (!canonicalStore) canonicalStore = storeSig;
  else assert.deepEqual(storeSig, canonicalStore, `Inconsistent store JSON-LD on ${rel}`);

  const assertOrgRef = (ref, label) => {
    assert(ref && typeof ref === "object", `Missing ${label} on ${rel}`);
    assert.equal(ref["@id"], canonicalStore["@id"], `${label}.@id mismatch on ${rel}`);
    assert.equal(ref.name, canonicalStore.name, `${label}.name mismatch on ${rel}`);
    assert.equal(ref.url, canonicalStore.url, `${label}.url mismatch on ${rel}`);
    assert(ref.logo && ref.logo["@type"] === "ImageObject" && ref.logo.url === canonicalStore.logoUrl, `${label}.logo mismatch on ${rel}`);
    assert.deepEqual(ref.sameAs, canonicalStore.sameAs, `${label}.sameAs mismatch on ${rel}`);
  };

  let hasFaqSchema = false;
  for (const obj of parsedSchemas) {
    if (obj["@type"] === "FAQPage") hasFaqSchema = true;
    if (obj["@type"] === "Product" && obj.offers) {
      assert(obj.offers.priceValidUntil, `Missing priceValidUntil on ${rel}`);
      assert(obj.offers.shippingDetails && obj.offers.shippingDetails.deliveryTime && obj.offers.shippingDetails.deliveryTime.transitTime, `Missing shippingDetails/transitTime on ${rel}`);
      assert(obj.offers.hasMerchantReturnPolicy && obj.offers.hasMerchantReturnPolicy.merchantReturnDays === 7, `Missing merchantReturnDays on ${rel}`);
      assert(obj.offers.hasMerchantReturnPolicy.returnMethod && obj.offers.hasMerchantReturnPolicy.returnFees, `Missing returnMethod/returnFees on ${rel}`);
      assertOrgRef(obj.offers.seller, "Product.offers.seller");
    }
    if (obj["@type"] === "Article") {
      assert(obj.image && obj.image.length, `Missing Article image on ${rel}`);
      assert(obj.dateModified, `Missing Article dateModified on ${rel}`);
      assertOrgRef(obj.author, "Article.author");
      assertOrgRef(obj.publisher, "Article.publisher");
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
assert.deepEqual(altViolations, [], `Invalid/missing image alt text: ${JSON.stringify(altViolations.slice(0, 10))}`);

const robots = fs.readFileSync(path.join(DOCS, "robots.txt"), "utf8");
for (const token of ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Disallow: /admin/", "Sitemap: https://ellmarrt.ir/sitemap.xml"]) {
  assert(robots.includes(token), `robots.txt missing: ${token}`);
}

const sitemap = fs.readFileSync(path.join(DOCS, "sitemap.xml"), "utf8");
assert(sitemap.includes("<lastmod>"), "sitemap.xml missing <lastmod>");
assert(sitemap.includes("<image:title>"), "sitemap.xml missing <image:title>");
assert(!/\{MAX(?::\w+)?\}|\{YEARS\}/.test(sitemap), "Unreplaced token in sitemap.xml");
const sitemapUrls = [...sitemap.matchAll(/<url>/g)].length;
const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
assert.equal(lastmods.length, sitemapUrls, "Every sitemap <url> must have a <lastmod>");
for (const lm of lastmods) assert(/^\d{4}-\d{2}-\d{2}$/.test(lm), `Invalid <lastmod> format: ${lm}`);
const distinctLastmods = new Set(lastmods);
assert(distinctLastmods.size > 5, `Expected >5 distinct <lastmod> dates in sitemap.xml, found ${distinctLastmods.size}`);
const imageLocs = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
assert(imageLocs.length > 0, "sitemap.xml missing <image:loc> entries");
for (const loc of imageLocs) {
  const pathname = new URL(loc).pathname.replace(/^\//, "");
  assert(fs.existsSync(path.join(DOCS, pathname)), `Missing sitemap image on disk: docs/${pathname}`);
}
for (const tm of sitemap.matchAll(/<image:title>([^<]*)<\/image:title>/g)) {
  assert(!tm[1].includes("|"), `Raw '|' pipe in sitemap image title: ${tm[1]}`);
}
const catalogJson = JSON.parse(fs.readFileSync(path.join(DOCS, "assets/catalog.json"), "utf8"));
for (const item of catalogJson) {
  assert(item.imgAlt && /[\u0600-\u06FF]/.test(item.imgAlt) && !item.imgAlt.includes("|") && item.imgAlt.length <= 125, `Invalid catalog.json imgAlt for ${item.id}: ${item.imgAlt}`);
}

const feed = fs.readFileSync(path.join(DOCS, "feed.xml"), "utf8");
assert(feed.includes('<rss version="2.0"') && feed.includes("<item>"), "Invalid docs/feed.xml RSS feed");
assert(!/\{MAX(?::\w+)?\}|\{YEARS\}/.test(feed), "Unreplaced token in feed.xml");

const llms = fs.readFileSync(path.join(DOCS, "llms.txt"), "utf8");
const llmsFull = fs.readFileSync(path.join(DOCS, "llms-full.txt"), "utf8");
assert(!/\{MAX(?::\w+)?\}|\{YEARS\}/.test(llms + llmsFull), "Unreplaced token in llms.txt or llms-full.txt");
const requiredLlmsRoutes = [
  "/shop/", "/size-guide/", "/big-size/", "/faq/", "/about/",
  "/guide/", "/shipping-returns/", "/contact/", "/wholesale/",
];
for (const route of requiredLlmsRoutes) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^- \\[[^\\]]+\\]\\(https://ellmarrt\\.ir${escaped}\\):\\s+\\S[^\\r\\n]{8,}$`, "m");
  assert(re.test(llms), `docs/llms.txt missing key route with description: ${route}`);
  assert(re.test(llmsFull), `docs/llms-full.txt missing key route with description: ${route}`);
}

const aiCat = JSON.parse(fs.readFileSync(path.join(DOCS, "assets/ai-catalog.json"), "utf8"));
assert(aiCat.store && Array.isArray(aiCat.products) && aiCat.products.length > 0, "Invalid assets/ai-catalog.json");
assert(Array.isArray(aiCat.guides) && aiCat.guides.length > 0 && aiCat.sizeChart && Array.isArray(aiCat.sizeChart.tops), "Missing guides or sizeChart in assets/ai-catalog.json");

console.log(`PASS: ${checkedPages} indexable pages, ${aiCat.products.length} AI-catalog products, ${imageLocs.length} sitemap images, ${distinctLastmods.size} distinct lastmod dates, 0 broken links, 0 duplicate titles/descs, 0 thin pages, 0 alt issues, full schema & GEO verified.`);

// Run after build.js. Compare product descriptions, excluding shared navigation,
// recommendations and reviews. Word-bigram Jaccard = intersection / union.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { load } = require("./catalog");
const { build } = require("./copy");
const { products } = load();
const root = path.join(__dirname, "..");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const paragraphs = new Set();

for (const p of products) {
  assert(p.copy.paragraph, `Missing paragraph: ${p.id}`);
  assert(!paragraphs.has(p.copy.paragraph), `Duplicate paragraph: ${p.id}`);
  paragraphs.add(p.copy.paragraph);
  const html = fs.readFileSync(path.join(root, "docs/p", String(p.id), "index.html"), "utf8");
  assert(html.includes(`<p>${esc(p.copy.paragraph)}</p>`), `Paragraph not rendered: ${p.id}`);
  const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1]));
  assert(schema.some((s) => s["@type"] === "Product" && s.description === p.copy.plain.slice(0, 4900)), `Schema copy mismatch: ${p.id}`);
}

function bigrams(text) {
  const words = text.normalize("NFKC").replace(/\u200c/g, " ").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  return new Set(words.slice(1).map((word, i) => `${words[i]} ${word}`));
}

// Same-category samples: very large cotton, black boxy cotton, stonewashed boxy.
const samples = [53718702, 54127749, 46296076].map((id) => {
  const p = products.find((p) => p.id === id);
  assert(p, `Missing sample: ${id}`);
  return p;
});
for (let i = 0; i < samples.length; i++) {
  for (let j = i + 1; j < samples.length; j++) {
    const a = bigrams(samples[i].copy.plain), b = bigrams(samples[j].copy.plain);
    const common = [...a].filter((word) => b.has(word)).length;
    const similarity = 100 * common / (a.size + b.size - common);
    console.log(`${samples[i].id} / ${samples[j].id}: ${similarity.toFixed(2)}%`);
    assert(similarity < 45, "Product description similarity must be below 45%");
  }
}

// Missing attributes must not acquire category-level fabric/fit/stock claims.
const empty = { basalamTitle: "Sample", title: "Sample", cat: "pants", attrs: [], sizes: [], colors: [], variants: [] };
assert.equal(build(empty).paragraph, "Sample.");
assert.deepEqual(build(empty).bullets, []);
const unavailable = build({ ...empty, sizes: ["XL"], colors: ["Black"], variants: [{ size: "XL", color: "Black", stock: 0 }] });
assert.deepEqual(unavailable.bullets, []);
assert(unavailable.paragraph.includes("XL") && unavailable.paragraph.includes("Black"));
assert(fs.existsSync(path.join(root, "docs/index.html")));
assert(fs.existsSync(path.join(root, "docs/sitemap.xml")));
console.log(`PASS: ${products.length} unique, rendered paragraphs; schema and stock fallbacks checked.`);

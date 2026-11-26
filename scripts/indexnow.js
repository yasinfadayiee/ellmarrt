// Submit all sitemap URLs to IndexNow (Bing / ChatGPT Search / Yandex).
// Usage:
//   node scripts/indexnow.js --dry-run   (validate key file & payload without sending)
//   node scripts/indexnow.js             (POST to https://api.indexnow.org/indexnow)
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const KEY = "5553601b0a9b596a60aaaad7a46fb679";
const HOST = "ellmarrt.ir";
const KEY_LOC = `https://${HOST}/${KEY}.txt`;

const keyPath = path.join(DOCS, `${KEY}.txt`);
assert(fs.existsSync(keyPath), `Missing IndexNow key file: ${keyPath}`);
assert.equal(fs.readFileSync(keyPath, "utf8").trim(), KEY, "IndexNow key file content mismatch");

const sm = fs.readFileSync(path.join(DOCS, "sitemap.xml"), "utf8");
const urlList = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert(urlList.length > 0, "No URLs found in docs/sitemap.xml");

const payload = { host: HOST, key: KEY, keyLocation: KEY_LOC, urlList };
const dryRun = process.argv.includes("--dry-run");

async function main() {
  if (dryRun) {
    console.log(`DRY RUN: IndexNow payload ready (${urlList.length} URLs, keyLocation=${KEY_LOC})`);
    return;
  }
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  console.log(`IndexNow response: HTTP ${res.status} (${urlList.length} URLs)${body ? ` — ${body}` : ""}`);
  if (!res.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

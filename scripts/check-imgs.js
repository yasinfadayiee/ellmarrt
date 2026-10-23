// Read-only checks for image markup on the four mobile-speed sample pages.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const docs = path.join(__dirname, "..", "docs");
const firstPage = (dir) => fs.readdirSync(path.join(docs, dir), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(docs, dir, entry.name, "index.html")))
  .map((entry) => `${dir}/${entry.name}/index.html`).sort()[0];
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map((m) => [m[1].toLowerCase(), m[3]]));
const localFile = (url) => {
  const pathname = new URL(url, "https://ellmarrt.ir").pathname;
  const assets = pathname.indexOf("/assets/");
  return path.join(docs, assets >= 0 ? pathname.slice(assets + 1) : pathname.replace(/^\//, ""));
};

(async () => {
  const samples = ["index.html", firstPage("p"), firstPage("c"), "about/index.html"];
  let failures = 0;
  for (const sample of samples) {
    if (!sample) throw new Error("Missing product or category sample page");
    const html = fs.readFileSync(path.join(docs, sample), "utf8");
    const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]));
    const counts = { dimensions: 0, lazy: 0, decoding: 0, sizes: 0, files: 0, ratio: 0, preload: 0 };
    const fail = (kind, detail) => {
      counts[kind]++;
      console.error(`FAIL ${sample}: ${kind}: ${detail}`);
    };
    for (const img of images) {
      const label = img.src || "lightbox placeholder";
      if (!(Number(img.width) > 0 && Number(img.height) > 0)) fail("dimensions", label);
      // The header mark and the single high-priority image are the eager exceptions.
      const eager = img.src?.endsWith("/assets/img/mark.svg") || img.fetchpriority === "high";
      if (!eager && img.loading !== "lazy") fail("lazy", label);
      if (img.decoding !== "async") fail("decoding", label);
      if (img.srcset && !img.sizes) fail("sizes", label);
      const sources = [img.src, ...(img.srcset || "").split(",").map((s) => s.trim().split(/\s+/)[0])].filter(Boolean);
      for (const url of sources) if (!fs.existsSync(localFile(url))) fail("files", url);
      if (img.src && /\.webp$/.test(img.src) && fs.existsSync(localFile(img.src))) {
        const meta = await sharp(localFile(img.src)).metadata();
        if (Math.abs(Number(img.width) / Number(img.height) - meta.width / meta.height) > 0.01) fail("ratio", label);
      }
    }
    const preloads = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0])).filter((a) => a.rel === "preload" && a.as === "image");
    const priority = images.filter((img) => img.fetchpriority === "high");
    if (preloads.length !== 1 || priority.length !== 1) {
      fail("preload", `expected one image preload and one high-priority image; found ${preloads.length}/${priority.length}`);
    } else {
      const preload = preloads[0], img = priority[0];
      if (preload.href !== img.src || preload.imagesrcset !== img.srcset || preload.imagesizes !== img.sizes || img.loading === "lazy") fail("preload", "preload and eager image do not match");
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    failures += total;
    console.log(`${sample}: ${images.length} images; ${JSON.stringify(counts)}`);
  }
  console.log(`Image audit: ${failures} failures across ${samples.length} pages.`);
  process.exitCode = failures ? 1 : 0;
})().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});

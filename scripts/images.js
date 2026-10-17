// Builds optimized web images from src-images/ + uploads/ into assets/p/ (product photos) and assets/og/ (social cards).
//   studio shot  -> <id>-480.webp / <id>-960.webp (4:5)      (src-images/gemini/<id>.webp, or an admin upload)
//   colour shot  -> <id>-k<i>-480/960.webp                    (src-images/gemini/colors/<id>-k<i>.webp, or an admin upload)
//   Basalam originals -> <id>-g<n>.webp (real-photo gallery)
// "Fresh" is decided by the content hash of the source (assets/p/.srcmap.json), so replacing a photo from the
// admin panel always regenerates it, locally and in CI.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { overrides } = require("./overrides");
const { colorsOf } = require("./catalog");

const ROOT = path.join(__dirname, "..");
const GEM = path.join(ROOT, "src-images/gemini");
const ORIG = path.join(ROOT, "src-images/orig");
const OUT = path.join(ROOT, "assets/p");
const OG = path.join(ROOT, "assets/og");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });

const ids = JSON.parse(fs.readFileSync(path.join(ROOT, "data-raw/_search.json"))).map((p) => p.id);
const prevMeta = fs.existsSync(path.join(ROOT, "data/images.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, "data/images.json"))) : {};
const logo = fs.readFileSync(path.join(ROOT, "assets/img/logo.svg"));

const SRCMAP_FILE = path.join(OUT, ".srcmap.json");
const srcmap = fs.existsSync(SRCMAP_FILE) ? JSON.parse(fs.readFileSync(SRCMAP_FILE, "utf8")) : {};
const hashCache = new Map();
const hashOf = (file) => {
  if (!hashCache.has(file)) hashCache.set(file, crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex"));
  return hashCache.get(file);
};
// true when dst exists and was built from exactly this source (+ recipe version)
const RECIPE = "r3";
const fresh = (src, dst) => fs.existsSync(dst) && srcmap[path.relative(ROOT, dst)] === `${RECIPE}:${hashOf(src)}`;
const mark = (src, dst) => { srcmap[path.relative(ROOT, dst)] = `${RECIPE}:${hashOf(src)}`; };
async function build(src, dst, fn) {
  if (fresh(src, dst)) return false;
  await fn();
  mark(src, dst);
  return true;
}
const upload = (rel) => { const f = rel && path.join(ROOT, rel); return f && fs.existsSync(f) ? f : null; };

(async () => {
  const meta = {};
  const logoPng = await sharp(logo, { density: 300 }).resize({ height: 220 }).png().toBuffer();
  const stats = { built: 0, skipped: 0 };
  const count = (b) => (b ? stats.built++ : stats.skipped++);

  for (const id of ids) {
    const O = overrides.products[id] || {};
    const OI = O.images || {};
    let src = upload(OI.main) || path.join(GEM, `${id}.webp`);
    // new product without a studio shot yet: build the hero from its first Basalam photo
    const firstOrig = path.join(ORIG, `${id}-0.jpg`);
    if (!fs.existsSync(src) && fs.existsSync(firstOrig)) {
      src = path.join(ROOT, ".cache", `${id}.webp`);
      fs.mkdirSync(path.dirname(src), { recursive: true });
      await sharp(firstOrig).resize(1280, 1600, { fit: "contain", background: "#efe9df" }).webp({ quality: 88 }).toFile(src);
    }
    const m = { hero: null, gallery: [] };
    if (fs.existsSync(src)) {
      for (const w of [480, 960]) {
        const dst = path.join(OUT, `${id}-${w}.webp`);
        count(await build(src, dst, () => sharp(src).resize(w, Math.round(w * 1.25), { fit: "cover", position: "attention" }).webp({ quality: 78, effort: 5 }).toFile(dst)));
      }
      const { dominant } = await sharp(src).stats();
      m.hero = { w: 960, h: 1200, bg: `rgb(${dominant.r},${dominant.g},${dominant.b})` };
      const og = path.join(OG, `${id}.jpg`);
      count(await build(src, og, async () => {
        const photo = await sharp(src).resize(504, 630, { fit: "cover" }).toBuffer();
        await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F4F0E8" } })
          .composite([{ input: photo, left: 696, top: 0 }, { input: logoPng, left: 150, top: 205 }])
          .jpeg({ quality: 82, mozjpeg: true }).toFile(og);
      }));
    }

    // per-colour shots: admin upload (by colour name) wins over the Gemini recolour (by colour index)
    let cols = [];
    try { cols = colorsOf(JSON.parse(fs.readFileSync(path.join(ROOT, "data-raw", `${id}.json`), "utf8"))); } catch {}
    cols.forEach((name, i) => {
      const up = upload((OI.colors || {})[name]);
      const gem = path.join(GEM, "colors", `${id}-k${i}.webp`);
      const csrc = up || (fs.existsSync(gem) ? gem : null);
      m[`k${i}`] = !!csrc;
      if (!csrc) {
        // override removed and no Gemini shot: drop the stale output so the site falls back cleanly
        for (const w of [480, 960]) { const d = path.join(OUT, `${id}-k${i}-${w}.webp`); if (fs.existsSync(d)) { fs.unlinkSync(d); delete srcmap[path.relative(ROOT, d)]; } }
        return;
      }
      m._c = m._c || [];
      m._c.push({ src: csrc, i });
    });
    for (const { src: csrc, i } of m._c || []) {
      for (const w of [480, 960]) {
        const dst = path.join(OUT, `${id}-k${i}-${w}.webp`);
        count(await build(csrc, dst, () => sharp(csrc).resize(w, Math.round(w * 1.25), { fit: "cover", position: "attention" }).webp({ quality: 78, effort: 5 }).toFile(dst)));
      }
    }
    for (const k of Object.keys(m)) if (/^k\d+$/.test(k) || k === "_c") delete m[k];

    const origs = !fs.existsSync(ORIG) ? [] : fs.readdirSync(ORIG).filter((f) => f.startsWith(`${id}-`)).sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
    for (const [n, f] of origs.slice(0, 6).entries()) {
      const osrc = path.join(ORIG, f), dst = path.join(OUT, `${id}-g${n}.webp`);
      count(await build(osrc, dst, () => sharp(osrc).resize(900, 900, { fit: "inside", withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(dst)));
      const md = await sharp(dst).metadata();
      m.gallery.push({ file: `${id}-g${n}.webp`, w: md.width, h: md.height });
    }
    // originals are not in git: keep the gallery we built before when they are absent
    if (!origs.length && prevMeta[id]) m.gallery = prevMeta[id].gallery;
    if (!m.hero && prevMeta[id]) m.hero = prevMeta[id].hero;
    meta[id] = m;
  }

  // site-wide OG card
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F4F0E8" } })
    .composite([{ input: await sharp(logo, { density: 300 }).resize({ height: 380 }).png().toBuffer(), gravity: "center" }])
    .jpeg({ quality: 85 }).toFile(path.join(OG, "site.jpg"));

  // drop map entries whose output no longer exists, keep the file stable (sorted)
  for (const k of Object.keys(srcmap)) if (!fs.existsSync(path.join(ROOT, k))) delete srcmap[k];
  const sorted = Object.fromEntries(Object.entries(srcmap).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(SRCMAP_FILE, JSON.stringify(sorted, null, 1));
  fs.writeFileSync(path.join(ROOT, "data/images.json"), JSON.stringify(meta, null, 1));
  console.log(`images ok: ${Object.keys(meta).length} products, ${stats.built} built, ${stats.skipped} up to date`);
})();

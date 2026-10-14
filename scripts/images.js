// Builds optimized web images from src-images/ into assets/p/ (product photos) and assets/og/ (social cards).
// Gemini studio shot -> <id>-480.webp / <id>-960.webp (4:5); Basalam originals -> <id>-g<n>.webp (gallery).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const GEM = path.join(ROOT, "src-images/gemini");
const ORIG = path.join(ROOT, "src-images/orig");
const OUT = path.join(ROOT, "assets/p");
const OG = path.join(ROOT, "assets/og");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });

const ids = JSON.parse(fs.readFileSync(path.join(ROOT, "data-raw/_search.json"))).map((p) => p.id);
// in CI (fresh git checkout) mtimes are meaningless: only build what is missing
const fresh = (src, dst) => fs.existsSync(dst) && (process.env.CI || fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs);
const prevMeta = fs.existsSync(path.join(ROOT, "data/images.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, "data/images.json"))) : {};
const logo = fs.readFileSync(path.join(ROOT, "assets/img/logo.svg"));

(async () => {
  const meta = {};
  const logoPng = await sharp(logo, { density: 300 }).resize({ height: 220 }).png().toBuffer();
  for (const id of ids) {
    let src = path.join(GEM, `${id}.webp`);
    // new product without a studio shot yet: build the hero from its first Basalam photo
    const firstOrig = path.join(ORIG, `${id}-0.jpg`);
    if (!fs.existsSync(src) && fs.existsSync(firstOrig)) {
      src = path.join(ROOT, ".cache", `${id}.webp`);
      fs.mkdirSync(path.dirname(src), { recursive: true });
      if (!fs.existsSync(src)) await sharp(firstOrig).resize(1280, 1600, { fit: "contain", background: "#efe9df" }).webp({ quality: 88 }).toFile(src);
    }
    const m = { hero: null, gallery: [] };
    if (fs.existsSync(src)) {
      for (const w of [480, 960]) {
        const dst = path.join(OUT, `${id}-${w}.webp`);
        if (!fresh(src, dst)) await sharp(src).resize(w, Math.round(w * 1.25), { fit: "cover", position: "attention" }).webp({ quality: 78, effort: 5 }).toFile(dst);
      }
      // close-up crops from the same studio shot -> a visually consistent gallery
      const sm = await sharp(src).metadata();
      const cw = Math.round(sm.width * 0.62), ch = Math.round(cw * 1.25), left = Math.round(sm.width * 0.19);
      for (const [n, topF] of []) { // close-up crops retired (looked like duplicates)
        const dst = path.join(OUT, `${id}-${n}.webp`);
        const top = Math.min(Math.round(sm.height * topF), sm.height - ch);
        if (!fresh(src, dst)) await sharp(src).extract({ left, top, width: cw, height: ch }).resize(960, 1200).webp({ quality: 80, effort: 5 }).toFile(dst);
      }
      // blurred 16px placeholder colour for instant paint
      const { dominant } = await sharp(src).stats();
      m.hero = { w: 960, h: 1200, bg: `rgb(${dominant.r},${dominant.g},${dominant.b})` };
      const og = path.join(OG, `${id}.jpg`);
      if (!fresh(src, og)) {
        const photo = await sharp(src).resize(504, 630, { fit: "cover" }).toBuffer();
        await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F4F0E8" } })
          .composite([{ input: photo, left: 696, top: 0 }, { input: logoPng, left: 150, top: 205 }])
          .jpeg({ quality: 82, mozjpeg: true }).toFile(og);
      }
    }
    const origs = !fs.existsSync(ORIG) ? [] : fs.readdirSync(ORIG).filter((f) => f.startsWith(`${id}-`)).sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
    for (const [n, f] of origs.slice(0, 6).entries()) {
      const dst = path.join(OUT, `${id}-g${n}.webp`);
      if (!fresh(path.join(ORIG, f), dst)) await sharp(path.join(ORIG, f)).resize(900, 900, { fit: "inside", withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(dst);
      const md = await sharp(dst).metadata();
      m.gallery.push({ file: `${id}-g${n}.webp`, w: md.width, h: md.height });
    }
    // originals are not in git: keep the gallery we built before when they are absent
    if (!origs.length && prevMeta[id]) m.gallery = prevMeta[id].gallery;
    if (!m.hero && prevMeta[id]) m.hero = prevMeta[id].hero;
    meta[id] = m;
  }
  // per-colour studio shots: src-images/gemini/colors/<id>-k<i>.webp -> assets/p/<id>-k<i>-{480,960}.webp
  const CDIR = path.join(GEM, "colors");
  if (fs.existsSync(CDIR)) for (const f of fs.readdirSync(CDIR).filter((f) => /^\d+-k\d+\.webp$/.test(f))) {
    const src = path.join(CDIR, f), base = f.replace(".webp", "");
    for (const w of [480, 960]) {
      const dst = path.join(OUT, `${base}-${w}.webp`);
      if (!fresh(src, dst)) await sharp(src).resize(w, Math.round(w * 1.25), { fit: "cover", position: "attention" }).webp({ quality: 78, effort: 5 }).toFile(dst);
    }
  }
  // site-wide OG card
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F4F0E8" } })
    .composite([{ input: await sharp(logo, { density: 300 }).resize({ height: 380 }).png().toBuffer(), gravity: "center" }])
    .jpeg({ quality: 85 }).toFile(path.join(OG, "site.jpg"));
  fs.writeFileSync(path.join(ROOT, "data/images.json"), JSON.stringify(meta, null, 1));
  console.log("images ok", Object.keys(meta).length);
})();

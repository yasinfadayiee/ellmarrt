// Traces the Gemini logo (src-images/gemini/logo-full.webp) into clean two-colour SVGs.
const sharp = require("sharp");
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "../src-images/gemini/logo-full.webp");
const OUT = path.join(__dirname, "../assets/img");
fs.mkdirSync(OUT, { recursive: true });

const trace = (buf, opts) =>
  new Promise((res, rej) => potrace.trace(buf, { turdSize: 20, optTolerance: 0.3, ...opts }, (e, svg) => (e ? rej(e) : res(svg))));

async function mask(test) {
  const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height);
  for (let i = 0, p = 0; i < data.length; i += 3, p++) out[p] = test(data[i], data[i + 1], data[i + 2]) ? 0 : 255;
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
}

const pathsOf = (svg) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(" ");

(async () => {
  const black = await mask((r, g, b) => r + g + b < 260);
  const gold = await mask((r, g, b) => r - b > 45 && r > 120 && r + g + b < 640);
  const bPath = pathsOf(await trace(black, { threshold: 128 }));
  const gPath = pathsOf(await trace(gold, { threshold: 128 }));

  // bounding boxes measured from the masks
  const bbox = async (png, y0 = 0, y1 = 2048) => {
    const { data, info } = await sharp(png).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
    let x1 = 1e9, x2 = -1, ya = 1e9, yb = -1;
    for (let y = y0; y < y1; y++) for (let x = 0; x < info.width; x++) if (data[y * info.width + x] === 0) {
      if (x < x1) x1 = x; if (x > x2) x2 = x; if (y < ya) ya = y; if (y > yb) yb = y;
    }
    return { x1, x2, ya, yb };
  };
  const all = await bbox(black);
  const goldBox = await bbox(gold);
  const full = { x1: Math.min(all.x1, goldBox.x1), x2: Math.max(all.x2, goldBox.x2), ya: Math.min(all.ya, goldBox.ya), yb: Math.max(all.yb, goldBox.yb) };

  // The mark (letter E) is the first tall black block; find the gap between mark and wordmark.
  const { data, info } = await sharp(black).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  const rowHas = (y) => { for (let x = 0; x < info.width; x++) if (data[y * info.width + x] === 0) return true; return false; };
  let y = all.ya; while (y < info.height && rowHas(y)) y++;
  const markBottom = y;

  const pad = 24;
  const svg = (box, colorB, colorG, id) => {
    const vb = `${box.x1 - pad} ${box.ya - pad} ${box.x2 - box.x1 + pad * 2} ${box.yb - box.ya + pad * 2}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="ELLMARRT"><title>ELLMARRT المارت</title><path fill="${colorB}" fill-rule="evenodd" d="${bPath}"/><path fill="${colorG}" fill-rule="evenodd" d="${gPath}"/></svg>`;
  };
  const markBox = { x1: all.x1, x2: all.x2, ya: all.ya, yb: markBottom };
  // limit mark box horizontally to the E itself
  let mx1 = 1e9, mx2 = -1;
  for (let yy = all.ya; yy < markBottom; yy++) for (let x = 0; x < info.width; x++) if (data[yy * info.width + x] === 0) { if (x < mx1) mx1 = x; if (x > mx2) mx2 = x; }
  markBox.x1 = mx1; markBox.x2 = mx2;

  fs.writeFileSync(path.join(OUT, "logo.svg"), svg(full, "#141210", "#B08D57"));
  fs.writeFileSync(path.join(OUT, "logo-light.svg"), svg(full, "#F4F0E8", "#C9A46A"));
  fs.writeFileSync(path.join(OUT, "mark.svg"), svg(markBox, "#141210", "#B08D57"));
  fs.writeFileSync(path.join(OUT, "mark-light.svg"), svg(markBox, "#F4F0E8", "#C9A46A"));

  // raster icons from the mark
  const markSvg = fs.readFileSync(path.join(OUT, "mark.svg"));
  const icon = async (size, file, bg) => {
    const inner = Math.round(size * 0.72);
    const m = await sharp(markSvg, { density: 600 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: m, gravity: "center" }]).png().toFile(path.join(OUT, file));
  };
  await icon(512, "icon-512.png", "#F4F0E8");
  await icon(192, "icon-192.png", "#F4F0E8");
  await icon(180, "apple-touch-icon.png", "#F4F0E8");
  await icon(48, "favicon-48.png", "#F4F0E8");
  console.log("logo done", full, markBox);
})();

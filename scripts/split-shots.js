// Splits tall screenshots into viewable JPEG chunks: node scripts/split-shots.js <dir> <file.png> [chunks] [width]
const sharp = require("sharp");
const [dir, file, n = 3, w = 900] = process.argv.slice(2);
(async () => {
  const src = `${dir}/${file}`;
  const m = await sharp(src).metadata();
  const h = Math.ceil(m.height / n);
  for (let i = 0; i < n; i++) {
    const out = `${dir}/${file.replace(".png", "")}-${i}.jpg`;
    await sharp(src).extract({ left: 0, top: i * h, width: m.width, height: Math.min(h, m.height - i * h) }).resize({ width: Math.min(+w, m.width) }).jpeg({ quality: 70 }).toFile(out);
    console.log(out);
  }
})();

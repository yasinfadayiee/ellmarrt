// Content overrides edited from the admin panel (/admin/) and committed as data/overrides.json.
// Shape:
// {
//   "site": { announcements:[], hero:{eyebrow,line1,pre,em,post,lead,cta1,cta2}, story:{title,text}, faq:[[q,a]],
//             contact:{phones:[],address,instagram,igHandle,rubika,rubikaOrder}, promo:{active,code,text},
//             footer:{blurb}, analytics:{goatcounter}, years },
//   "products": { "<id>": { title, hook, cat, hidden, featured, extra, images:{ main:"uploads/x.jpg", colors:{ "0":"uploads/y.jpg" } } } },
//   "reviewsHidden": [reviewId]
// }
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const read = (file, fallback) => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8")); } catch { return fallback; }
};

const data = read("data/overrides.json", {});
const overrides = {
  site: data.site || {},
  products: data.products || {},
  reviewsHidden: data.reviewsHidden || [],
};
const orders = read("data/orders.json", []);

module.exports = { overrides, orders, ROOT };

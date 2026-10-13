// Normalizes Basalam product JSON (data-raw/) + curated titles into the site catalog.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "data-raw");
const curated = require("../data/curated");
const images = JSON.parse(fs.readFileSync(path.join(ROOT, "data/images.json"), "utf8"));

const CATEGORIES = {
  tshirt: { slug: "tshirt", name: "تیشرت مردانه", plural: "تیشرت‌ها", h1: "تیشرت مردانه نخ پنبه", desc: "تیشرت مردانه نخ پنبه، باکسی و اورسایز تا سایز 5XL؛ مستقیم از بازار بزرگ تبریز با قیمت منصفانه و ارسال به سراسر ایران." },
  polo: { slug: "polo", name: "پولوشرت و یقه‌دار", plural: "پولوشرت‌ها", h1: "پولوشرت و تیشرت یقه‌دار مردانه", desc: "پولوشرت، نیم‌زیپ و تیشرت یقه انگلیسی مردانه با پارچه خنک و کشسان؛ انتخابی شیک برای استایل نیمه‌رسمی و روزمره." },
  shirt: { slug: "shirt", name: "پیراهن مردانه", plural: "پیراهن‌ها", h1: "پیراهن آستین کوتاه مردانه", desc: "پیراهن آستین کوتاه یقه انگلیسی با پارچه مراکشی بیسکویتی؛ خنک، خوش‌دوخت و در رنگ‌بندی متنوع از M تا 3XL." },
  sweat: { slug: "sweatshirt", name: "هودی، دورس و بلوز", plural: "هودی و دورس‌ها", h1: "هودی، سویشرت، دورس و بلوز مردانه", desc: "هودی، سویشرت تمام‌زیپ، دورس دو نخ و بلوز آستین‌بلند پنبه برای پاییز و زمستان؛ گرم، نرم و خوش‌فرم." },
  pants: { slug: "pants", name: "شلوار مردانه", plural: "شلوارها", h1: "شلوار اسلش و راحتی مردانه", desc: "شلوار اسلش، بغل‌نوار، کارگو شش جیب، بگ و راحتی مردانه از L تا 6XL؛ پرفروش‌ترین بخش المارت با سایزبندی واقعی." },
  shorts: { slug: "shorts", name: "شلوارک مردانه", plural: "شلوارک‌ها", h1: "شلوارک مردانه", desc: "شلوارک اسپرت و کتان مردانه تا سایز 6XL؛ راحت برای تابستان، باشگاه و استفاده روزمره." },
  shoes: { slug: "shoes", name: "کفش اسپرت", plural: "کفش‌ها", h1: "کفش اسپرت مردانه", desc: "کفش اسپرت مردانه دوردوخت با زیره PU، سایز 41 تا 45؛ سبک، راحت و مناسب استفاده هر روز." },
  kids: { slug: "kids", name: "پسرانه", plural: "پسرانه", h1: "شلوار و لباس پسرانه", desc: "شلوار اسلش و راحتی پسرانه و نوجوان با جنس کتان و پنبه؛ مناسب مدرسه، بیرون و خانه." },
};

const SIZE_ORDER = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

const SIZE_RULES = [
  [/([2-6])\s*x\s*l/, (m) => `${m[1]}XL`],
  [/xxxxl/, () => "4XL"],
  [/xxxl/, () => "3XL"],
  [/xxl/, () => "2XL"],
  [/xl/, () => "XL"],
  [/(?<![a-z])([lms])(?![a-z])/, (m) => m[1].toUpperCase()],
  [/(?<!\d)(4[0-6]|7[05]|8[05]|9[05])(?!\d)/, (m) => m[1]],
];

const COLOR_FIX = [
  [/^ط\.?\s*روشن$/, "طوسی روشن"], [/^ط\.?\s*تیره$/, "طوسی تیره"], [/^روشن$/, "طوسی روشن"], [/^تیره$/, "طوسی تیره"],
  [/^غازی$/, "کله‌غازی"], [/^کله غازی$/, "کله‌غازی"], [/^ساده$/, "مشکی ساده"], [/^لوزی$/, "مشکی طرح لوزی"],
  [/^سرمه( ای| ‌ای|‌ای)?$/, "سرمه‌ای"], [/^قهو?اه? ?ای$|^قهوه ای$/, "قهوه‌ای"], [/^نسکافه ?ای$/, "نسکافه‌ای"],
  [/^پسته ?ای$/, "پسته‌ای"], [/^سبز ساقه ?ای$/, "سبز ساقه‌ای"], [/^پایین /, ""],
];

// "مشکی 4xl" | "رنگ و سایز:طوسی تیره xl" | "2xl 105" | "41 سفید" -> {color,size}
function parseVariant(v) {
  let raw = v.properties.map((p) => p.value.title).join(" ").replace(/‌/g, " ").replace(/رنگ و سایز\s*:/, " ").toLowerCase();
  let size = null;
  for (const [re, fn] of SIZE_RULES) {
    const m = raw.match(re);
    if (m) { size = fn(m); raw = raw.replace(m[0], " "); break; }
  }
  let color = raw.replace(/[0-9a-z.*:]+/gi, " ").replace(/\s+/g, " ").trim();
  for (const [re, to] of COLOR_FIX) color = color.replace(re, to);
  color = color.replace(/^پایین /, "").trim();
  return { color: color || null, size, stock: v.stock, price: Math.round(v.price / 10) };
}

const clean = (s) => String(s || "").replace(/^#+\s*/gm, "").replace(/\*\*/g, "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").trim();

function load() {
  const search = JSON.parse(fs.readFileSync(path.join(RAW, "_search.json"), "utf8"));
  const products = [];
  for (const s of search) {
    const d = JSON.parse(fs.readFileSync(path.join(RAW, `${s.id}.json`), "utf8"));
    const [title, cat, keyword] = curated[s.id];
    const variants = (d.variants || []).map(parseVariant);
    const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))].sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a), ib = SIZE_ORDER.indexOf(b);
      return ia >= 0 && ib >= 0 ? ia - ib : String(a).localeCompare(String(b), "en", { numeric: true });
    });
    const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
    const attrs = [];
    for (const g of d.attributes || []) for (const a of g.attributes || [g]) {
      const k = (a.title || a.key || "").trim(), val = clean(a.value);
      if (k && val && k !== "سایر توضیحات" && val.length < 140) attrs.push([k, val]);
    }
    const material = (attrs.find(([k]) => k === "جنس") || [])[1] || null;
    const stockTotal = variants.length ? variants.reduce((a, v) => a + (v.stock || 0), 0) : d.inventory || s.stock || 0;
    const price = Math.round(d.price / 10);
    const primary = Math.round((d.primary_price || d.price) / 10);
    const rating = s.rating && s.rating.count > 0 && s.rating.average ? { avg: s.rating.average, count: s.rating.count } : null;
    products.push({
      id: s.id,
      title,
      keyword,
      basalamTitle: clean(d.title),
      cat,
      price,
      oldPrice: primary > price ? primary : null,
      sizes,
      colors,
      variants,
      stock: stockTotal,
      inStock: stockTotal > 0,
      material,
      attrs,
      description: clean(d.description),
      rating,
      sales: s.sales_count || 0,
      hasVideo: !!(s.video && s.video.PRIMARY),
      created: d.created_at,
      images: images[s.id],
      colorImages: colors.map((_, i) => i).filter((i) => fs.existsSync(path.join(ROOT, "assets/p", `${s.id}-k${i}-960.webp`))),
      buyUrl: `https://basalam.com/piraysh/product/${s.id}`,
    });
  }
  return { products, CATEGORIES, SIZE_ORDER };
}

module.exports = { load, parseVariant };

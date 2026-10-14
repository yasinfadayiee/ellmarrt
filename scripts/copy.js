// Professional product copy: hand-written hook (data/curated.js) + structured facts from Basalam data.
const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const CAT = {
  tshirt: { intro: "دوخت تمیز صنعتی، یقه کشباف مقاوم که بعد از شستشو باز نمی‌شود و پارچه‌ای که روی تن خوش می‌نشیند.", use: "استفاده روزمره، دانشگاه، سفر و دورهمی", care: "در آب سرد یا ولرم (حداکثر ۳۰ درجه) و پشت‌ورو بشویید؛ برای حفظ چاپ، روی طرح اتو نکنید.", size: "اگر بین دو سایز هستید، برای فرم اورسایز سایز بزرگ‌تر و برای فرم معمولی سایز همیشگی خود را بردارید." },
  polo: { intro: "یقه‌ای که آراستگی پیراهن را دارد و راحتی تیشرت را؛ پارچه خنک و کشسان برای روزهای گرم.", use: "محیط کار نیمه‌رسمی، مهمانی، دانشگاه و استفاده روزمره", care: "با آب سرد و دور ملایم بشویید و روی چوب‌لباسی خشک کنید تا یقه فرمش را حفظ کند.", size: "این مدل فرم معمولی دارد؛ سایز همیشگی خود را انتخاب کنید." },
  shirt: { intro: "پارچه مراکشی با بافت ظریف بیسکویتی، دوخت دقیق و یقه انگلیسی که همیشه مرتب می‌ماند.", use: "محیط کار نیمه‌رسمی، مهمانی‌های تابستانی و سفر", care: "با آب سرد بشویید؛ اتوی ملایم از پشت پارچه.", size: "فرم پیراهن آزاد است؛ سایز همیشگی را بردارید." },
  sweat: { intro: "پارچه نرم و ضخیم با ایستایی بالا، سرآستین و کمر کشباف؛ گرم و خوش‌فرم برای فصل‌های خنک.", use: "پاییز و زمستان، لایه‌پوشی، دانشگاه و استفاده روزمره", care: "پشت‌ورو و با آب ولرم بشویید؛ از خشک‌کن با حرارت بالا استفاده نکنید.", size: "برای پوشیدن روی لباس دیگر، یک سایز بزرگ‌تر را در نظر بگیرید." },
  pants: { intro: "کمر کش و بنددار، دوخت محکم و قواره‌ای که در ایستادن و نشستن راحت است.", use: "پیاده‌روی، سفر، رانندگی، باشگاه و استفاده روزمره", care: "پشت‌ورو و با آب سرد بشویید تا رنگ و نوارها ماندگار بمانند.", size: "سایز را بر اساس دور کمر و قد انتخاب کنید؛ قد شلوارهای سایز بزرگ ۱۰۵ تا ۱۱۰ سانتی‌متر است." },
  shorts: { intro: "قواره راحت و پارچه سبک برای گرمای تابستان؛ کمر کش و جیب‌های کاربردی.", use: "تابستان، باشگاه، سفر و استفاده در خانه", care: "با آب سرد بشویید و در سایه خشک کنید.", size: "راهنمای وزن: 3XL حدود ۹۰ تا ۱۰۵ کیلو، 4XL حدود ۱۰۵ تا ۱۲۰ کیلو، 5XL و 6XL بیش از ۱۲۰ کیلو." },
  shoes: { intro: "رویه بادوام با دوردوخت صنعتی و زیره سبک؛ کفش اسپرتی برای استفاده هر روز.", use: "خرید، دانشگاه، محل کار، سفر و پیاده‌روی", care: "با دستمال مرطوب تمیز کنید؛ در ماشین لباسشویی نشویید.", size: "قالب استاندارد است؛ سایز همیشگی کفش خود را انتخاب کنید." },
  kids: { intro: "پارچه بادوام و نرم برای نوجوانان پرتحرک؛ کمر کش برای راحتی کامل.", use: "مدرسه، بیرون، بازی و خانه", care: "با آب سرد بشویید؛ رنگ ثابت و ماندگار.", size: "سایزها بر اساس قد کودک است (۷۵ تا ۹۵)؛ در صورت تردید با ما مشورت کنید." },
};

const pick = (attrs, key) => (attrs.find(([k]) => k === key) || [])[1];
const tidy = (s) => String(s || "").replace(/\s+/g, " ").replace(/^[\s.،:;-]+|[\s.،:;-]+$/g, "").trim();

function build(p) {
  const c = CAT[p.cat] || CAT.tshirt;
  const inStockColors = p.colors.filter((col) => p.variants.some((v) => v.color === col && v.stock > 0));
  const sizesOk = p.sizes.filter((s) => p.variants.some((v) => v.size === s && v.stock > 0));
  const material = tidy(p.material);
  const facts = [];
  if (material) facts.push(["جنس", material]);
  if (p.sizes.length) facts.push(["سایزبندی", p.sizes.join(" / ") + (sizesOk.length && sizesOk.length < p.sizes.length ? ` (موجود: ${sizesOk.join("، ")})` : "")]);
  if (inStockColors.length) facts.push(["رنگ‌های موجود", inStockColors.join("، ")]);
  const extra = tidy(pick(p.attrs, "سایر توضیحات"));
  const bullets = [
    c.intro,
    material && `جنس ${material}؛ انتخاب‌شده با تجربه چند دهه فروش پوشاک در بازار تبریز.`,
    p.sizes.length && `سایزبندی ${p.sizes[0]} تا ${p.sizes[p.sizes.length - 1]}${p.sizes.some((s) => /^[4-6]XL$/.test(s)) ? "، با قواره واقعی برای سایزهای بزرگ" : ""}.`,
    inStockColors.length > 1 && `${fa(inStockColors.length)} رنگ موجود: ${inStockColors.join("، ")}.`,
    extra && extra.length < 120 && !/http|@|09\d{9}/.test(extra) && extra + (/[.!؟]$/.test(extra) ? "" : "."),
    `مناسب برای ${c.use}.`,
  ].filter(Boolean);
  const lead = p.hook || `${p.title}؛ انتخابی خوش‌دوخت و بادوام از کالکشن المارت.`;
  const plain = [lead, ...bullets, `نکته سایز: ${c.size}`, `نگهداری: ${c.care}`].join(" ");
  return { lead, bullets, sizeNote: c.size, care: c.care, facts, plain };
}

module.exports = { build };

# المارت | ELLMARRT

وبسایت فروشگاه پوشاک مردانه المارت (بازار بزرگ تبریز) — غرفه باسلام: https://basalam.com/piraysh

سایت ایستا (Static)، فارسی و راست‌به‌چپ، سبک و سریع، با ساختار کامل سئو:
صفحه جدا برای هر محصول و دسته، داده ساختاریافته Product / Breadcrumb / FAQ / ClothingStore، نقشه سایت با تصاویر، robots.txt و llms.txt.

## ساختار

| مسیر | کاربرد |
|---|---|
| `data-raw/` | داده خام محصولات از API باسلام |
| `data/curated.js` | عنوان سئو و دسته هر محصول |
| `src-images/` | عکس‌های اصلی باسلام و عکس‌های استودیویی ساخته‌شده با Gemini + لوگو |
| `assets/` | CSS، JS، لوگوی SVG و تصاویر بهینه‌شده (WebP) |
| `scripts/` | اسکریپت‌های ساخت |
| `docs/` | خروجی نهایی سایت (GitHub Pages) |

## ساخت

```bash
npm install
node scripts/logo.js      # لوگوی SVG و آیکون‌ها از لوگوی Gemini
node scripts/images.js    # تصاویر WebP و کارت‌های OG
node scripts/build.js     # تولید سایت در docs/
node scripts/serve.js     # پیش‌نمایش: http://localhost:4173/ellmarrt/
```

برای دامنه اختصاصی: `SITE_URL=https://example.ir node scripts/build.js` و فایل `docs/CNAME`.

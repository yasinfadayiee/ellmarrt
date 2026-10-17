// Data snapshot for the admin panel (docs/admin/data.json). Public, non-personal data only.
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

module.exports = function adminData({ all, allReviews, storeReviews, CATEGORIES, SITE_URL, meta }) {
  const p480 = (name) => `/assets/p/${name}-480.webp`;
  const exists = (name) => fs.existsSync(path.join(ROOT, "assets/p", `${name}-480.webp`));
  return {
    builtAt: meta.syncedAt || null,
    siteUrl: SITE_URL,
    categories: Object.entries(CATEGORIES).map(([key, c]) => ({ key, name: c.name })),
    store: { average: storeReviews.average, count: storeReviews.count, groups: storeReviews.groups },
    products: all.map((p) => {
      const base = p.mainColor != null ? `${p.id}-k${p.mainColor}` : `${p.id}`;
      return {
        id: p.id,
        title: p.title,
        autoTitle: p.autoTitle,
        basalamTitle: p.basalamTitle,
        cat: p.cat,
        price: p.price,
        oldPrice: p.oldPrice,
        stock: p.stock,
        inStock: p.inStock,
        sales: p.sales,
        salesWeek: p.salesWeek,
        rating: p.rating,
        sizes: p.sizes,
        colors: p.colors.map((name, i) => ({
          name,
          stock: p.variants.filter((v) => v.color === name).reduce((a, v) => a + (v.stock || 0), 0),
          img: exists(`${p.id}-k${i}`) ? p480(`${p.id}-k${i}`) : null,
          custom: !!(p.ov.images && p.ov.images.colors && p.ov.images.colors[name]),
        })),
        hidden: p.hidden,
        featured: p.featured,
        hook: p.hook,
        extra: p.extra,
        img: exists(base) ? p480(base) : p480(String(p.id)),
        customMain: !!(p.ov.images && p.ov.images.main),
        url: `/p/${p.id}/`,
        buyUrl: p.buyUrl,
        created: p.created,
      };
    }),
    reviews: allReviews.map((r) => ({ id: r.id, star: r.star, text: r.text, name: r.name, date: r.date, productId: r.productId, hidden: !!r.hidden })),
  };
};

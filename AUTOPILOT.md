# AUTOPILOT — daily improvement roadmap (ellmarrt.ir)

Read by `.github/workflows/improve.yml` (once a day at night in Iran, Claude Sonnet, owner's second Claude
account). Each run does the **first unchecked item only**, ticks it (`- [x] (YYYY-MM-DD) ...`) and stops.
The owner and the partner do not review changes, so every change must be correct and safe on its own.

Goal: the first rial orders from the site — visitors who open a product on Basalam or send a «سفارش مستقیم»
(EL-XXXX code). Site is Persian (RTL) for Iranian shoppers; Tabriz covered-bazaar heritage is the brand story.
Portfolio rule (2026-10-26): if the site brings no orders by 2026-12-15 it goes to maintenance only
(Basalam stock sync keeps running, this workflow is switched off). It is never deleted.

## Rules for every run
- One small, complete item per run. Never half-finish.
- Pipeline: `data/curated.js` (titles, categories, copy) + `scripts/copy.js` + `scripts/pages.js` →
  `node scripts/build.js` → `docs/`. Never hand-edit `docs/`; run the build once at the end and keep its output.
- Never touch: `.github/`, `admin/`, `data/overrides.json`, `data/orders.json`, `uploads/`, `data-raw/`,
  `scripts/sync-basalam.js`, `package.json`, `package-lock.json`. The workflow rejects such changes.
- Public repo: never write customer names, phones or order data anywhere.
- Never invent products, designs, colours, prices, stock, fabric facts or reviews. Product facts come only
  from the product's own data in `data/` and `data-raw/` (read only).
- Checkout stays on Basalam; keep the «سفارش مستقیم» flow (EL-XXXX codes) and its buttons working.
- Keep verification tags/files (Google, Bing, Enamad, IndexNow key) — the build preserves them.
- Calm, premium design; no redesign, no colour/theme changes. Mobile header: no backdrop-filter under 980px.
- Persian copy must read naturally («پوشاک مردانه»، «بازار سرپوشیده تبریز»); no English filler.
- Never use String.replace with replacement strings containing `$$` (use split/join or a function).
- Save turns: open only the files the item names; run `node scripts/build.js` once at the end.
- Pictures need Gemini in the owner's browser — skip any picture item (leave it unchecked, do the next one).
- When fewer than 3 items are unchecked, add 3 new specific items at the end of the Backlog that bring an
  order closer (product page clarity, trust, size help, category pages people search), then do the first one.
- Finally write a one-line summary in simple Persian for the owner to the summary file the prompt names.

## Backlog
- [x] (2026-10-26) Product page depth: a per-product «مشخصات و نگهداری» block (fabric, fit, available sizes, care, who it
  suits) generated in `scripts/pages.js` ONLY from each product's existing data (title, attributes,
  description, sizes, colours in `data/`). If a fact is not in the data, leave that line out. Add a link to
  `/size-guide/` and to the product's category guide when one exists. Prices, Basalam button and direct-order
  flow untouched. Done = every product page shows the block, build passes. (Why: product pages carry ~110
  words and Google says "crawled – not indexed".)
- [x] (2026-10-27) Fix (review): product pages now show the same facts twice. The new «مشخصات و نگهداری» section
  (`scripts/pages.js`, `product()`, right after the buy box) repeats «نکته سایز», «نگهداری» and the spec rows
  that are already in the `.pbox` details («توضیحات محصول» / «مشخصات»). Keep the new visible section as the
  single place for spec table + size note + care + links; remove sizeNote/care from «توضیحات محصول» and remove
  the «مشخصات» `<details>` (or show there only rows not in the section). Done = each fact appears once per
  product page (check 2 pages in `docs/p/`), build passes.
- [ ] Fix (review): `/guide/boys-pants-guide/` (last entry of `guides` in `scripts/pages.js`) is padded and
  robotic: almost every paragraph says "don't assume / ask the seller / read the product page"
  («نتیجه نگیرید»، «حدس نزنید»، «نسبت ندهید»). Rewrite to ~350 natural, useful words: real kids models and
  sizes from `data/` (in stock), what اسلش بغل‌نوار / راحتی / نیم‌بگ look like, school vs home, cold-water
  care, one sentence on asking for size help. Link 3 in-stock kids products and `/c/kids/`. Keep slug/title.
- [ ] Fix (review): `/size-guide/` FAQ copies the «اندازه‌گیری درست در خانه» list word for word (Q3) and the
  pants-length Q also exists on `/big-size/`. Replace Q3 with a new, real question (e.g. which size for
  شلوار کمرکش vs a snug fit, using facts already on the site) and reword the pants-length answer so the two
  pages do not share sentences. Keep FAQPage schema matching the visible text.
- [ ] Winter first (season = Aban/Azar, buyers want warm clothes now): on the home page (`home()` in
  `scripts/pages.js`) add or move up a section «برای پاییز و زمستان» showing up to 8 IN-STOCK products from
  category `sweat` (هودی، دورس، بلوز), plus winter pants if their title says so, with a link to
  `/c/sweatshirt/`. Sort by featured/sales like `category()`. Done = section near the top of the home page,
  only in-stock items, build passes.
- [ ] Direct-order clarity on mobile: read the «سفارش مستقیم» modal/JS (`assets/js/`) and the product
  template. If the buyer can open the order form without the size/colour being asked or shown, make the
  form show the product's real available sizes (from data) as required choices, and show the EL-XXXX code
  plus "what happens next" (who calls/sends SMS, how payment works — only what the code/site already says).
  One fix only; do not break the existing flow or code format.
- [ ] Big sizes are our rare advantage (Iranian sellers rarely list 5XL/6XL): on `/big-size/` (`bigSize()`)
  make sure the product list contains only in-stock products that really have 3XL+ in their size data,
  and each card/line shows which big sizes are available (e.g. «موجود در 4XL، 5XL»). Title/H1 should target
  «لباس سایز بزرگ مردانه تا 6XL» only if a 6XL item is really in stock; otherwise use the real max.
- [ ] Fact check category intros: `CATEGORIES[*].desc` in `scripts/catalog.js` claim size ranges
  («تا 5XL»، «M تا 3XL»، «L تا 6XL»، «تا 6XL»، «41 تا 45»). Compare each with the real sizes of in-stock
  products in that category (`data/`, `data-raw/` read-only) and correct any claim that is false. If
  `catalog.js` is the wrong place, fix the text where it is defined. List what changed in the summary.
- [ ] Internal links to products (Google: "crawled – not indexed"): each guide page (`guide()`) gets a
  «محصولات مرتبط» row with up to 4 in-stock product cards from the guide's `cats`, using the existing
  `card()` helper. Skip if the guide template already shows products. Done = every guide links ≥3 products.
- [ ] Trust from real data only: check `data-raw/_meta.json` and one product file for the Basalam booth's
  real rating, review count or sales count. If present, show one short line near the Basalam button on the
  product page («امتیاز غرفه در باسلام: …»). If no such data exists, tick the item with "no data" and change
  nothing. Never write a number that is not in the data; no fake review schema.
- [ ] Product schema check: in the product page JSON-LD make sure `offers` has price, priceCurrency (IRR
  with the rial value, or the existing convention), availability from `inStock`, url and seller/brand, and
  `image`. Fix only missing/wrong fields; never add aggregateRating/review without real data.
- [ ] `/shipping-returns/` and `/faq/`: add a short «سفارش مستقیم چطور است؟» answer (EL-XXXX code, phone/SMS,
  how payment and sending work) using only what the site's direct-order code and pages already say, and
  link it from the product page buy-note. Skip if both pages already explain it.
- [ ] Broken links / out-of-stock: after a build, check that every internal link in `docs/` points to an
  existing page and that guides do not link out-of-stock products. Fix what is broken.
- [ ] Persian copy quality: the 3 longest guides — fix unnatural wording, typos and repeated hedging only.

## Rules learned
- Before adding a block, check what the page already shows: do not repeat the same facts, notes or FAQ
  answers on one page or copy sentences between pages (happened 3 times in Oct 2026: product spec block,
  size-guide FAQ, big-size FAQ).
- Being honest does not mean hedging: state the facts from the data once, plainly. One "ask us" line per page
  is enough. Never fill a guide with "don't assume / ask the seller" sentences.
- Every new guide or section links to real in-stock products; a page with no product links does not sell.

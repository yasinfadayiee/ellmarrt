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
- [x] (2026-10-28) Fix (review): `/guide/boys-pants-guide/` (last entry of `guides` in `scripts/pages.js`) is padded and
  robotic: almost every paragraph says "don't assume / ask the seller / read the product page"
  («نتیجه نگیرید»، «حدس نزنید»، «نسبت ندهید»). Rewrite to ~350 natural, useful words: real kids models and
  sizes from `data/` (in stock), what اسلش بغل‌نوار / راحتی / نیم‌بگ look like, school vs home, cold-water
  care, one sentence on asking for size help. Link 3 in-stock kids products and `/c/kids/`. Keep slug/title.
- [x] (2026-10-28) Fix (review): `/size-guide/` FAQ copies the «اندازه‌گیری درست در خانه» list word for word (Q3) and the
  pants-length Q also exists on `/big-size/`. Replace Q3 with a new, real question (e.g. which size for
  شلوار کمرکش vs a snug fit, using facts already on the site) and reword the pants-length answer so the two
  pages do not share sentences. Keep FAQPage schema matching the visible text.
- [x] (2026-10-29) Fix (review): `/guide/boys-pants-guide/` (last entry of `guides` in `scripts/pages.js`) hard-codes stock in
  prose: «در سایزهای ۸۰، ۸۵، ۹۰ و ۹۵ موجود است»، «در سایز ۸۰ و ۹۰ داریم»، «فعلاً سایز ۷۵ و ۹۵ آن موجود است»،
  «رنگ موجودش طوسی است». The Basalam sync changes stock several times a day, so these go false. Remove the
  per-size/colour stock words (keep the model descriptions and links); if the guide template does not already
  show product cards, add the 3 linked products with the existing `card()` helper so sizes stay live.
  Done = no size/colour availability claims in the guide text, build passes.
- [x] (2026-10-29, owner session) Size claims now come from `{MAX}` / `{MAX:cat}` tokens filled at build time from in-stock sizes (`sizeMax()` in pages.js). Original: Fix (review): size claims in FAQ answers in `scripts/pages.js` — `HOME_FAQ_DEFAULT` («از XL تا 6XL… تیشرت 5XL
  تا شلوار اسلش 6XL»), `bigSize()` Q1 («تیشرت تا 5XL، شلوار… تا 6XL، هودی و دورس تا 3XL») and `sizeGuide()`
  hoodie Q («هودی و دورس… تا 3XL موجود است»). Check each against the sizes of IN-STOCK products in `data-raw/`
  (read-only). Reword to what we make/offer by product type without the word «موجود», and correct any max
  size that is wrong. Keep FAQPage schema equal to the visible text. List changes in the summary.
- [x] (2026-10-29, owner session) Direct-order clarity on mobile — already true: the form needs size/colour and shows the EL code. Original item: read the «سفارش مستقیم» modal/JS (`assets/js/`) and the product
  template. If the buyer can open the order form without the size/colour being asked or shown, make the
  form show the product's real available sizes (from data) as required choices, and show the EL-XXXX code
  plus "what happens next" (who calls/sends SMS, how payment works — only what the code/site already says).
  One fix only; do not break the existing flow or code format.
- [x] (2026-10-29, owner session) Winter first — `winter` row in `home()` after the trust strip, shown Sep–Feb only, swipe rail on phones (season = Aban/Azar, buyers search «دورس مردانه»، «هودی مردانه» now): on the home page (`home()`
  in `scripts/pages.js`) add or move up a section «برای پاییز و زمستان» showing up to 8 IN-STOCK products from
  category `sweat` (هودی، دورس، بلوز), plus winter pants if their title says so, with a link to the sweat
  category page. Sort like `category()`. Done = section in the first half of the home page, only in-stock
  items, build passes. If the home page already has such a section, only move it up.
- [x] (2026-10-29, owner session) Per-size measurements (`scripts/measures.js`, from description + attribute text) shown once under the size chips as «اندازه‌های هر سایز», selected size highlighted; 14 products have a chart. Original: Size help at the moment of choice: the «سایزم را نمی‌دانم» link next to the size chips is done (2026-10-29). If the
  product's own description in `data-raw/` has measurements («دور کمر»، «قد»), make sure they are visible near
  the size chips once (move, do not copy — the page must not show them twice). Done = 2 product pages in
  `docs/p/` checked, build passes. (Competing Basalam listings show waist range per size.)
- [x] (2026-10-29, owner session) /big-size/ lists only in-stock items with 4XL+ live; cards show live sizes (`liveSizes()`), long runs keep the largest sizes; title uses {MAX}. Original: Big sizes are our rare advantage (Basalam sellers mostly stop at 3XL–4XL): on `/big-size/` (`bigSize()`)
  make sure the product list contains only in-stock products that really have 3XL+ in their size data,
  and each card/line shows which big sizes are available, computed at build time (e.g. «4XL، 5XL»).
  Title/H1 «لباس سایز بزرگ مردانه تا 6XL» only if a 6XL item is really in stock; otherwise use the real max.
- [x] (2026-10-29, owner session) Category intros use {MAX:cat} tokens (polo corrected to L). Original: Fact check category intros: `CATEGORIES[*].desc` in `scripts/catalog.js` claim size ranges
  («تا 5XL»، «M تا 3XL»، «L تا 6XL»، «تا 6XL»، «41 تا 45»). Compare each with the real sizes of in-stock
  products in that category (`data/`, `data-raw/` read-only) and correct any claim that is false. If
  `catalog.js` is the wrong place, fix the text where it is defined. List what changed in the summary.
- [x] (2026-10-29, owner session) FAQ «سفارش تلفنی یا پیامکی چطور است؟» added (FAQPage schema). Original: `/shipping-returns/` and `/faq/`: add a short «سفارش مستقیم چطور است؟» answer (EL-XXXX code, phone/SMS,
  how payment and sending work) using only what the site's direct-order code and pages already say, and
  link it from the product page buy-note. Skip if both pages already explain it.
- [x] (2026-10-29, owner session) Booth rating line (`storeRating()`, from storeReviews) under the hero CTA and next to the Basalam button. Original: Trust from real data only: check `data-raw/_meta.json` and one product file for the Basalam booth's
  real rating, review count or sales count. If present, show one short line near the Basalam button on the
  product page («امتیاز غرفه در باسلام: …», read from data at build time). If no such data exists, tick the
  item with "no data" and change nothing. Never write a number that is not in the data; no fake review schema.
- [x] (2026-10-29, owner session) sweatshirt-buying-guide rewritten as a practical page (zip, hood, cuffs, layering size; real products linked); hoodie-sweatshirt keeps fabric + care; no shared clauses, one link each way. Original: Duplicate guides: `hoodie-sweatshirt` and `sweatshirt-buying-guide` (`guides` in `scripts/pages.js`) both
  cover fabric, layering size and care for the same `sweat` products. Keep `hoodie-sweatshirt` as the
  comparison («هودی، سویشرت یا دورس؟») and make `sweatshirt-buying-guide` a short practical page (zip, cuff,
  neck, choosing size for layering) with no shared sentences; each links to the other once. Keep both slugs.
  Done = no paragraph says the same thing on both pages, build passes.
- [x] (2026-10-29, owner session) guide() related row sorted by best seller and topped up from PAIRS, every guide shows 4 in-stock products. Original: Internal links to products (Google: "crawled – not indexed"): each guide page (`guide()`) gets a
  «محصولات مرتبط» row with up to 4 in-stock product cards from the guide's `cats`, using the existing
  `card()` helper. Skip if the guide template already shows products. Done = every guide links ≥3 products.
- [x] (2026-10-29, owner session) offers already complete; seller now a named Organization instead of a bare @id. Original: Product schema check: in the product page JSON-LD make sure `offers` has price, priceCurrency (IRR
  with the rial value, or the existing convention), availability from `inStock`, url and seller/brand, and
  `image`. Fix only missing/wrong fields; never add aggregateRating/review without real data.
- [x] (2026-10-29, owner session) 0 broken internal links, 0 guide links to out-of-stock products. Original: Broken links / out-of-stock: after a build, check that every internal link in `docs/` points to an
  existing page and that guides do not link out-of-stock products. Fix what is broken.
- [x] (2026-10-29, owner session) measures() reads «… به ترتیب: a، b، c» when the count matches the sizes. Original: Size chart for kids pants: `50020130` (and other `kids` items) write «سایزبندی: 80، 85، 90، 95 عرض ران به ترتیب: 50، 52، 54، 56» — a list «به ترتیب» that `scripts/measures.js` does not read. Teach `measures()` the «X به ترتیب: a، b، c» form only when the count equals the size list, so the kids pages get the same table. Done = kids product page in `docs/p/` shows the table with the right numbers, other 14 tables unchanged, build passes.
- [x] (2026-10-29) Size finder uses the real chart: on `/size-guide/` (`sizeGuide()`), add one line under each category table: «جدول دقیق هر مدل در صفحه همان محصول، زیر انتخاب سایز آمده است» with links to 2 in-stock products that have a chart (`measures(p)` not null). No new numbers in the text. Done = links point to products with a chart, build passes.
- [ ] Category pages: on `category()` cards, products that have a size chart (`measures(p)`) get a small «جدول سایز دارد» tag in the card meta line (existing card markup, no new colours). Done = tag shows only where the product page has the table, build passes.
- [x] (2026-10-29, owner session) SEO landing pages for low-competition searches (`scripts/pages-sizes.js`): `/size/l/`…`/size/6xl/` («سایز 4XL چند کیلو است؟» — weights/heights from the /size-guide/ table `SIZE_ROWS`, real per-model measurements, in-stock products) and `/big-size/<cat>/` for categories with ≥4 in-stock 3XL+ items. Linked from /size-guide/, /big-size/, category pages and product spec links. Do not create other pages for the same queries; improve these instead. Store age claims now use `{YEARS}` (owner setting, 23), never a hard-coded number.
- [x] (2026-10-29, owner session) More SEO pages: `/size/shoes/` (foot length per shoe size from the seller chart) and `/wholesale/` («خرید عمده پوشاک مردانه از بازار تبریز»; no wholesale prices or minimums are published — never invent them). Product <title> gets «خرید » prefix when it fits. Home, guides, size guide and footer link to the new pages.

## Rules learned
- Size claims: never hard-code «تا 6XL» / «تا 3XL». Write `{MAX}` or `{MAX:pants}`; `layout()` and `llms()` fill them
  from in-stock sizes at build time. Card and filter sizes use `liveSizes(p)` (sold-out sizes are hidden).
- Night mode: `--ink`/`--cream` swap at night. For text on always-dark boxes use `--on-dk`, for dark fills use
  `--dk1`. Check new UI with `[data-theme=shab]` before shipping.
- Mobile layout (2026-10-29, owner request "too busy on phones"): under 900px the header shows only menu, logo and
  search; no topbar; home = short hero → swipeable category row → trust strip → best sellers; product page =
  numbered steps (colour, size) → ONE dark Basalam button → ghost «سفارش تلفنی / پیامکی» → small icon row.
  Do not add new buttons, banners or fixed bars on phones; keep the home section order.
- Before adding a block, check what the page already shows: do not repeat the same facts, notes or FAQ
  answers on one page or copy sentences between pages (happened 3 times in Oct 2026: product spec block,
  size-guide FAQ, big-size FAQ).
- Being honest does not mean hedging: state the facts from the data once, plainly. One "ask us" line per page
  is enough. Never fill a guide with "don't assume / ask the seller" sentences.
- Every new guide or section links to real in-stock products; a page with no product links does not sell.
- Never write stock in prose («موجود است»، «فعلاً سایز … داریم»): the Basalam sync changes stock every day.
  Show live sizes with `card()` or build-time data; text may say what we make, not what is in stock
  (Oct 2026: kids guide, big-size FAQ, size-guide FAQ).
- Check every size range / "up to 6XL" claim against in-stock data in the same run that writes it.

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
- [ ] Mobile UX check: read `scripts/pages.js` product template and fix one concrete thing that makes ordering
  harder on a phone (e.g. size choice unclear before «سفارش مستقیم», Basalam button text vague). One fix only.
- [ ] Category pages: make sure each category page has a short unique Persian intro (2–3 sentences, from the
  real products in it) and links to its 3 best products. Skip categories that already have one.
- [ ] Broken links / out-of-stock: check that every internal link in generated pages points to an existing
  page in `docs/` and that products no longer in stock are not linked from guides. Fix what is broken.
- [ ] Persian copy quality: pick the 3 guides with the most text and fix unnatural wording or typos only.
- [ ] (skip — needs Gemini) Calm hero image of the Tabriz covered bazaar for /tabriz-bazaar/.

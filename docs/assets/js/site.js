/* ELLMARRT site interactions — no dependencies */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fa = (n) => Number(n).toLocaleString("fa-IR");
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const BASE = document.documentElement.dataset.base || "";
  let CAT = [];
  const VER = (document.querySelector("script[src*=\"site.js\"]")?.src.split("v=")[1]) || "";
  let catP = null;
  const catReady = () => (catP ??= fetch(`${BASE}/assets/catalog.json?v=${VER}`).then((r) => r.json()).then((d) => (CAT = d)).catch(() => CAT));

  /* header */
  const hdr = $(".hdr");
  const onScroll = () => hdr && hdr.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const nav = $(".nav"), scrim = $(".scrim");
  const closeAll = () => { nav && nav.classList.remove("open"); $(".drawer")?.classList.remove("open"); scrim?.classList.remove("on"); document.body.style.overflow = ""; };
  $(".menu-btn")?.addEventListener("click", () => { nav.classList.add("open"); scrim.classList.add("on"); document.body.style.overflow = "hidden"; });
  scrim?.addEventListener("click", closeAll);
  $(".nav-x")?.addEventListener("click", closeAll);
  $$(".nav a").forEach((a) => a.addEventListener("click", closeAll));
  addEventListener("keydown", (e) => e.key === "Escape" && (closeAll(), closeLb()));

  /* reveal */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" }) : null;
  const reveal = (root = document) => $$(".rv:not(.in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  reveal();

  /* toast */
  let tt;
  const toast = (msg) => { let t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); } t.textContent = msg; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); };

  /* favorites */
  let favs = store.get("elm-favs", []);
  const favBadge = () => $$(".fav-count").forEach((b) => (b.textContent = favs.length ? fa(favs.length) : ""));
  const paintFavs = () => $$(".fav[data-id]").forEach((b) => { const on = favs.includes(+b.dataset.id); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".fav[data-id]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const id = +b.dataset.id;
    favs = favs.includes(id) ? favs.filter((x) => x !== id) : [id, ...favs];
    store.set("elm-favs", favs); paintFavs(); favBadge(); renderDrawer();
    toast(favs.includes(id) ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
  });
  const drawer = $(".drawer");
  function renderDrawer() {
    if (!drawer) return;
    const body = $(".drawer-b", drawer);
    const items = favs.map((id) => CAT.find((p) => p.id === id)).filter(Boolean);
    body.innerHTML = items.length ? items.map((p) => `<a class="mini" href="${p.url}"><img src="${p.img}" alt="" width="72" height="90" loading="lazy"><div><b>${p.t}</b><span>${fa(p.p)} تومان</span></div><span aria-hidden="true">‹</span></a>`).join("")
      : `<div class="empty"><p>هنوز چیزی را نشان نکرده‌اید.</p><a class="btn btn-ink" href="${BASE}/shop/">دیدن محصولات</a></div>`;
  }
  $$(".open-favs").forEach((b) => b.addEventListener("click", async () => { await catReady(); renderDrawer(); drawer.classList.add("open"); scrim.classList.add("on"); }));
  $(".drawer-x")?.addEventListener("click", closeAll);
  paintFavs(); favBadge();

  /* product card template (for shop filtering) */
  const sizeTags = (p) => (p.s || []).slice(0, 5).map((s) => `<span>${s}</span>`).join("");
  const card = (p) => `<article class="card rv${p.st ? "" : " out"}">
    <div class="card-media"><img src="${p.img}" alt="${p.t}" width="480" height="600" loading="lazy" decoding="async">${p.alt ? `<img class="alt" src="${p.alt}" alt="" loading="lazy" decoding="async">` : ""}
    <div class="card-tags">${p.tag ? `<span class="tag ${p.tagc}">${p.tag}</span>` : ""}</div>
    <button class="fav" data-id="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.6 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg></button></div>
    <div class="card-body"><div class="card-cat">${p.cn}</div><h3 class="card-title"><a href="${p.url}">${p.t}</a></h3>
    <div class="price"><b class="num">${fa(p.p)}</b><small>تومان</small></div>${p.dots || ""}<div class="card-sizes">${sizeTags(p)}</div></div></article>`;

  /* shop filters */
  const shop = $("#shop");
  if (shop) {
    const grid = $("#shop-grid"), cnt = $("#shop-count"), q = $("#q"), sort = $("#sort");
    const params = new URLSearchParams(location.search);
    const state = { cat: params.get("cat") || shop.dataset.cat || "all", sizes: new Set((params.get("size") || "").split(",").filter(Boolean)), q: params.get("q") || "", sort: params.get("sort") || "featured", stock: params.get("stock") === "1" };
    q.value = state.q; sort.value = state.sort;
    const sync = () => {
      $$("[data-cat-f]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.catF === state.cat));
      $$("[data-size-f]").forEach((b) => b.setAttribute("aria-pressed", state.sizes.has(b.dataset.sizeF)));
      $("#stock-f")?.setAttribute("aria-pressed", state.stock);
    };
    // Arabic ye/kaf, Persian/Arabic digits and ZWNJ are normalised; every word of the query must match (so «تی شرت» finds «تیشرت» and «۴XL» finds 4XL sizes)
    const norm = (s) => s.replace(/[‌\s]+/g, " ").replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).toLowerCase();
    const matches = (p, q) => { const hay = norm(p.t + " " + p.cn + " " + (p.k || "") + " " + (p.s || []).join(" ")); return norm(q).split(" ").filter(Boolean).every((w) => hay.includes(w)); };
    const run = async (push = true) => {
      await catReady();
      let list = CAT.filter((p) => (state.cat === "all" || p.c === state.cat) && (!state.stock || p.st) && (!state.sizes.size || (p.s || []).some((s) => state.sizes.has(s))) && (!state.q || matches(p, state.q)));
      if (state.sort === "low") list.sort((a, b) => a.p - b.p);
      else if (state.sort === "high") list.sort((a, b) => b.p - a.p);
      else if (state.sort === "new") list.sort((a, b) => (b.d || "").localeCompare(a.d || ""));
      else if (state.sort === "best") list.sort((a, b) => b.sales - a.sales);
      grid.innerHTML = list.length ? list.map(card).join("") : `<div class="empty" style="grid-column:1/-1"><p>محصولی با این فیلترها پیدا نشد.</p><button class="btn btn-ghost" id="reset">پاک کردن فیلترها</button></div>`;
      cnt.textContent = `${fa(list.length)} محصول`;
      reveal(grid); paintFavs(); sync();
      $("#reset")?.addEventListener("click", () => { state.cat = "all"; state.sizes.clear(); state.q = ""; q.value = ""; state.stock = false; run(); });
      if (push && !shop.dataset.cat) {
        const u = new URLSearchParams();
        if (state.cat !== "all") u.set("cat", state.cat);
        if (state.sizes.size) u.set("size", [...state.sizes].join(","));
        if (state.q) u.set("q", state.q);
        if (state.sort !== "featured") u.set("sort", state.sort);
        if (state.stock) u.set("stock", "1");
        history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u : ""));
      }
    };
    $$("[data-cat-f]").forEach((b) => b.addEventListener("click", () => { if (shop.dataset.cat) return (location.href = b.dataset.href); state.cat = b.dataset.catF; run(); }));
    $$("[data-size-f]").forEach((b) => b.addEventListener("click", () => { const s = b.dataset.sizeF; state.sizes.has(s) ? state.sizes.delete(s) : state.sizes.add(s); run(); }));
    $("#stock-f")?.addEventListener("click", () => { state.stock = !state.stock; run(); });
    let qt; q.addEventListener("input", () => { clearTimeout(qt); qt = setTimeout(() => { state.q = q.value.trim(); run(); }, 160); });
    sort.addEventListener("change", () => { state.sort = sort.value; run(); });
    if (params.toString()) run(false); else sync();
  }

  /* product page */
  const pdp = $("#pdp");
  let lbImgs = [], lbI = 0;
  const lb = $(".lb");
  function openLb(i) { if (!lb) return; lbI = i; $("img", lb).src = lbImgs[i]; lb.classList.add("on"); document.body.style.overflow = "hidden"; }
  function closeLb() { if (lb?.classList.contains("on")) { lb.classList.remove("on"); document.body.style.overflow = ""; } }
  if (lb) {
    $(".lb-x", lb).addEventListener("click", closeLb);
    $(".lb-prev", lb).addEventListener("click", () => openLb((lbI - 1 + lbImgs.length) % lbImgs.length));
    $(".lb-next", lb).addEventListener("click", () => openLb((lbI + 1) % lbImgs.length));
    lb.addEventListener("click", (e) => e.target === lb && closeLb());
  }
  if (pdp) {
    const P = JSON.parse($("#pdp-data").textContent);
    const main = $(".gal-main img");
    const thumbs = $$(".thumbs button");
    lbImgs = thumbs.map((t) => t.dataset.full);
    let cur = 0;
    const show = (i) => { cur = i; thumbs.forEach((t, k) => t.setAttribute("aria-current", k === i)); main.style.opacity = 0; setTimeout(() => { main.removeAttribute("srcset"); main.removeAttribute("sizes"); main.onload = () => (main.style.opacity = 1); main.src = thumbs[i].dataset.full; if (main.complete) main.style.opacity = 1; }, 120); };
    thumbs.forEach((t, i) => t.addEventListener("click", () => show(i)));
    $(".gal-main").addEventListener("click", () => openLb(cur));
    // swipe
    let sx = null;
    $(".gal-main").addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    $(".gal-main").addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show((cur + (dx > 0 ? 1 : -1) + thumbs.length) % thumbs.length); sx = null; }, { passive: true });

    // variants
    const sel = { color: null, size: null };
    const V = P.variants;
    const avail = (c, s) => V.some((v) => (!c || v.color === c) && (!s || v.size === s) && v.stock > 0);
    const paint = () => {
      $$("[data-color]").forEach((b) => { b.setAttribute("aria-pressed", b.dataset.color === sel.color); b.disabled = !avail(b.dataset.color, null); });
      $$("[data-size]").forEach((b) => { b.setAttribute("aria-pressed", b.dataset.size === sel.size); b.disabled = !avail(sel.color, b.dataset.size); });
      $("#sel-color") && ($("#sel-color").textContent = sel.color || "انتخاب کنید");
      $("#sel-size") && ($("#sel-size").textContent = sel.size || "انتخاب کنید");
      $("#sel-color")?.closest(".opt").classList.toggle("ok", !!sel.color);
      $("#sel-size")?.closest(".opt").classList.toggle("ok", !!sel.size);
      const st = $("#stock");
      const match = V.filter((v) => (!sel.color || v.color === sel.color) && (!sel.size || v.size === sel.size));
      const n = match.reduce((a, v) => a + (v.stock || 0), 0);
      if (st && (sel.color || sel.size)) { st.className = "stock" + (n === 0 ? " no" : n <= 2 ? " low" : ""); st.textContent = n === 0 ? "ناموجود" : n <= 2 ? `فقط ${fa(n)} عدد باقی‌مانده` : "موجود در انبار"; }
    };
    const showColor = (c) => { const i = thumbs.findIndex((t) => t.dataset.tc === (c || "")); if (i >= 0 && i !== cur) show(i); };
    $$("[data-color]").forEach((b) => b.addEventListener("click", () => { sel.color = sel.color === b.dataset.color ? null : b.dataset.color; if (sel.size && !avail(sel.color, sel.size)) sel.size = null; paint(); showColor(sel.color); }));
    thumbs.forEach((t) => t.addEventListener("click", () => { const c = t.dataset.tc; if (c && c !== sel.color) { const btn = $$("[data-color]").find((b) => b.dataset.color === c); if (btn && !btn.disabled) { sel.color = c; if (sel.size && !avail(sel.color, sel.size)) sel.size = null; paint(); } } }));
    $$("[data-size]").forEach((b) => b.addEventListener("click", () => { sel.size = sel.size === b.dataset.size ? null : b.dataset.size; paint(); }));
    const tc0 = thumbs[0]?.dataset.tc;
    if (tc0 && $$("[data-color]").some((b) => b.dataset.color === tc0) && avail(tc0, null)) sel.color = tc0;
    // one size left for the chosen colour: pick it, so the buyer has one step less
    const only = $$("[data-size]").filter((b) => avail(sel.color, b.dataset.size));
    if (only.length === 1) sel.size = only[0].dataset.size;
    paint();
    // phones: the long description starts folded so the buy box and reviews come sooner
    if (matchMedia("(max-width:900px)").matches) $(".pbox details[open]")?.removeAttribute("open");
    const buy = (e) => {
      const needSize = $$("[data-size]").length > 0, needColor = $$("[data-color]").length > 1;
      if ((needSize && !sel.size) || (needColor && !sel.color)) {
        e.preventDefault();
        const miss = needColor && !sel.color ? "#sel-color" : "#sel-size";
        toast(miss === "#sel-size" ? "اول سایز را انتخاب کنید" : "اول رنگ را انتخاب کنید");
        const box = $(miss)?.closest(".opt");
        box?.scrollIntoView({ behavior: "smooth", block: "center" });
        box?.classList.remove("need"); void box?.offsetWidth; box?.classList.add("need");
        return;
      }
      store.set("elm-last-choice", { id: P.id, ...sel });
    };
    $$(".buy-go").forEach((a) => a.addEventListener("click", buy));
    $("#share")?.addEventListener("click", async () => {
      const data = { title: document.title, url: location.href };
      if (navigator.share) { try { await navigator.share(data); } catch {} }
      else { try { await navigator.clipboard.writeText(location.href); toast("لینک کپی شد"); } catch {} }
    });
    // sticky mobile bar
    const mbar = $(".mbar"), buyBox = $(".buy");
    if (mbar && buyBox && io) new IntersectionObserver(([e]) => mbar.classList.toggle("on", !e.isIntersecting && e.boundingClientRect.top < 0)).observe(buyBox);
    // recently viewed
    const rv = store.get("elm-recent", []).filter((x) => x !== P.id);
    store.set("elm-recent", [P.id, ...rv].slice(0, 12));
    const box = $("#recent");
    if (box && rv.length) catReady().then(() => { const items = rv.map((id) => CAT.find((p) => p.id === id)).filter(Boolean).slice(0, 4); if (items.length) { box.hidden = false; $(".grid", box).innerHTML = items.map(card).join(""); reveal(box); paintFavs(); } });
  }

  /* size finder */
  $$(".sizer").forEach((root) => {
    const h = $("[name=h]", root), w = $("[name=w]", root), out = $(".sizer-out", root);
    let fit = "regular";
    $$(".seg button", root).forEach((b) => b.addEventListener("click", () => { fit = b.dataset.fit; $$(".seg button", root).forEach((x) => x.setAttribute("aria-pressed", x === b)); calc(); }));
    const SZ = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
    function calc() {
      const H = +String(h.value).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)), W = +String(w.value).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
      if (!H || !W || H < 140 || W < 40) { out.innerHTML = `<b>—</b><span>قد و وزن را وارد کنید تا سایز مناسب شما را پیشنهاد بدهیم.</span>`; return; }
      // weight drives width; tall people get bumped for length
      let i = W < 58 ? 0 : W < 66 ? 1 : W < 75 ? 2 : W < 85 ? 3 : W < 95 ? 4 : W < 105 ? 5 : W < 118 ? 6 : W < 132 ? 7 : 8;
      if (H >= 188 && i < 8) i++;
      if (H < 165 && W < 95 && i > 0) i--;
      if (fit === "loose" && i < 8) i++;
      if (fit === "slim" && i > 0) i--;
      const s = SZ[i];
      out.innerHTML = `<b>${s}</b><span>سایز پیشنهادی برای قد ${fa(H)} و وزن ${fa(W)} کیلو. ${i >= 5 ? "برای سایزهای بزرگ، " : ""}<a class="link" href="${BASE}/shop/?size=${encodeURIComponent(s)}">محصولات موجود در سایز ${s}</a></span>`;
      store.set("elm-size", { H, W, fit, s });
    }
    [h, w].forEach((el) => el.addEventListener("input", calc));
    const prev = store.get("elm-size", null);
    if (prev) { h.value = prev.H; w.value = prev.W; }
    calc();
  });
  /* v2: counters, hero glow, lookbook, real photos */
  const cio = io && new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || ""; let t0; const step = (t) => { t0 ??= t; const k = Math.min(1, (t - t0) / 1400); el.textContent = fa(Math.round(end * (1 - Math.pow(1 - k, 3)))) + suf; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); cio.unobserve(el); }), { threshold: .6 });
  $$("[data-count]").forEach((el) => cio && cio.observe(el));
  const hero = $(".hero"), glow = $(".hero-glow");
  if (hero && glow && matchMedia("(pointer:fine)").matches) hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); glow.style.setProperty("--mx", (e.clientX - r.left) + "px"); glow.style.setProperty("--my", (e.clientY - r.top) + "px"); });
  const track = $(".look-track");
  if (track) { const go = (d) => track.scrollBy({ left: d * Math.min(360, track.clientWidth * .8), behavior: "smooth" }); $(".look-prev")?.addEventListener("click", () => go(1)); $(".look-next")?.addEventListener("click", () => go(-1)); }
  const reals = $$(".real-i img").map((i) => i.src);
  const thumbsAll = $$(".thumbs button").map((t) => t.dataset.full);
  $$(".real-i").forEach((b) => b.addEventListener("click", () => { lbImgs = reals; openLb(+b.dataset.real); }));
  $(".gal-main")?.addEventListener("click", () => { lbImgs = thumbsAll; }, true);
  /* direct order with site tracking code (EL-XXXX) — lets the partners attribute website orders */
  const modal = $("#order-modal");
  const dob = $("#direct-order");
  if (modal && dob && pdp) {
    const P = JSON.parse($("#pdp-data").textContent);
    const title = $(".pinfo h1").textContent.trim();
    const close = () => { modal.classList.remove("on"); document.body.style.overflow = ""; };
    $(".modal-x", modal).addEventListener("click", close);
    modal.addEventListener("click", (e) => e.target === modal && close());
    const openDirectOrder = () => {
      const color = $("[data-color][aria-pressed=true]")?.dataset.color || ($$("[data-color]").length ? null : "");
      const size = $("[data-size][aria-pressed=true]")?.dataset.size || ($$("[data-size]").length ? null : "");
      if (size === null) { toast("اول سایز را انتخاب کنید"); $(".opt")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      if (color === null) { toast("اول رنگ را انتخاب کنید"); return; }
      const code = "EL-" + (Date.now() % 1679616).toString(36).toUpperCase().padStart(4, "0");
      const log = store.get("elm-orders", []); log.unshift({ code, id: P.id, size, color, t: Date.now() }); store.set("elm-orders", log.slice(0, 20));
      $("#om-code").textContent = code;
      $(".om-p", modal).textContent = `${title}${size ? " — سایز " + size : ""}${color ? " — " + color : ""}`;
      const body = `سلام، سفارش از سایت المارت\nکد پیگیری: ${code}\nمحصول: ${title} (کد ${P.id})${size ? "\nسایز: " + size : ""}${color ? "\nرنگ: " + color : ""}\nلینک: ${location.href.split("?")[0]}`;
      $("#om-sms").href = `sms:${(window.__STORE__ || {}).phones?.[0] || ""}?&body=${encodeURIComponent(body)}`;
      modal.classList.add("on"); document.body.style.overflow = "hidden";
      navigator.clipboard?.writeText(body).catch(() => {});
    };
    $$("[data-direct-order]").forEach((b) => b.addEventListener("click", openDirectOrder));
  }
  /* night mode toggle — choice is remembered on this device */
  // header button on desktop, a row in the menu on phones
  const tBtns = $$("[data-theme-toggle]");
  if (tBtns.length) {
    const isNight = () => document.documentElement.getAttribute("data-theme") === "shab";
    const mark = () => tBtns.forEach((b) => { b.setAttribute("aria-pressed", isNight()); b.setAttribute("aria-label", isNight() ? "حالت روز" : "حالت شب"); const s = $("span", b); if (s) s.textContent = isNight() ? "حالت روز" : "حالت شب"; });
    mark();
    tBtns.forEach((b) => b.addEventListener("click", () => {
      const night = !isNight();
      night ? document.documentElement.setAttribute("data-theme", "shab") : document.documentElement.removeAttribute("data-theme");
      try { night ? localStorage.setItem("elm-theme", "shab") : localStorage.removeItem("elm-theme"); } catch {}
      mark(); toast(night ? "حالت شب فعال شد" : "حالت روز فعال شد");
    }));
  }
  /* copy promo code */
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-copy]"); if (!b) return; navigator.clipboard?.writeText(b.dataset.copy).then(() => toast("کد تخفیف کپی شد")).catch(() => toast(b.dataset.copy)); });
})();

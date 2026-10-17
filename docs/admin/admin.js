/* ELLMARRT admin panel — static app, edits are committed to the GitHub repo through the GitHub API.
   A commit to data/overrides.json | data/orders.json | uploads/ triggers .github/workflows/build-site.yml,
   which rebuilds and publishes the site (usually within 2–3 minutes). */
(() => {
  "use strict";
  const OWNER = "yasinfadayiee", REPO = "ellmarrt", BRANCH = "main";
  const qs = new URLSearchParams(location.search);
  if (qs.get("api")) sessionStorage.setItem("elm-admin-api", qs.get("api"));
  const API = sessionStorage.getItem("elm-admin-api") || "https://api.github.com";
  const TKEY = "elm-admin-token";
  let TOKEN = localStorage.getItem(TKEY) || "";
  const repo = `/repos/${OWNER}/${REPO}`;

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fa = (n) => Number(n).toLocaleString("fa-IR");
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const money = (n) => (n >= 1e9 ? fa(+(n / 1e9).toFixed(2)) + " میلیارد" : n >= 1e6 ? fa(+(n / 1e6).toFixed(1)) + " میلیون" : fa(Math.round(n)));
  const DIG = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9", "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "٬": "", ",": "", "،": "" };
  const num = (v) => { let s = ""; for (const ch of String(v ?? "")) s += DIG[ch] ?? ch; const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };
  const dateFa = (d) => { try { return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(d)); } catch { return d || ""; } };
  const monthFa = (ym) => { try { return new Intl.DateTimeFormat("fa-IR", { month: "short" }).format(new Date(ym + "-15")); } catch { return ym; } };
  const enc = (s) => { const b = new TextEncoder().encode(s); let bin = ""; b.forEach((x) => (bin += String.fromCharCode(x))); return btoa(bin); };
  const dec = (b) => new TextDecoder().decode(Uint8Array.from(atob(String(b).replace(/\s/g, "")), (c) => c.charCodeAt(0)));
  let toastT;
  const toast = (m, bad) => { const t = $("#toast"); t.textContent = m; t.classList.toggle("bad", !!bad); t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), bad ? 6000 : 3500); };
  const busy = (on, msg = "در حال ذخیره…") => { $(".busy")?.remove(); if (on) { const d = document.createElement("div"); d.className = "busy"; d.innerHTML = `<span>${esc(msg)}</span>`; document.body.append(d); } };
  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/></svg>',
  };

  /* ---------- GitHub API ---------- */
  async function gh(path, { method = "GET", body } = {}) {
    const r = await fetch(API + path, { method, headers: { Authorization: "Bearer " + TOKEN, Accept: "application/vnd.github+json", "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 204) return { ok: true };
    let j = null; try { j = await r.json(); } catch {}
    if (!r.ok) { const e = new Error((j && j.message) || "HTTP " + r.status); e.status = r.status; throw e; }
    return j;
  }
  const getFile = async (p) => { try { const j = await gh(`${repo}/contents/${p}?ref=${BRANCH}&t=${Date.now()}`); return { text: dec(j.content), sha: j.sha }; } catch (e) { if (e.status === 404) return null; throw e; } };
  const putFile = (p, b64, msg, sha) => gh(`${repo}/contents/${p}`, { method: "PUT", body: { message: msg, content: b64, branch: BRANCH, ...(sha ? { sha } : {}) } });
  async function updateJson(p, def, mutate, msg) {
    for (let i = 0; i < 3; i++) {
      const cur = await getFile(p);
      const obj = cur ? JSON.parse(cur.text) : def();
      mutate(obj);
      try { const res = await putFile(p, enc(JSON.stringify(obj, null, 2) + "\n"), msg, cur && cur.sha); return { obj, sha: res.content.sha }; }
      catch (e) { if (i < 2 && (e.status === 409 || e.status === 422)) continue; throw e; }
    }
  }
  const errMsg = (e) => e.status === 401 ? "توکن نامعتبر یا منقضی شده است؛ دوباره وارد شوید." : e.status === 403 ? "دسترسی توکن کافی نیست (Contents: Read and write لازم است)." : e.status === 404 ? "مخزن یا فایل پیدا نشد." : "خطا: " + e.message;

  /* ---------- state ---------- */
  const S = { data: null, ov: { site: {}, products: {}, reviewsHidden: [] }, orders: [], view: "dashboard", runs: [], pendingSince: 0, pf: { q: "", cat: "", st: "" }, rvStage: null, rvFilter: "all" };
  const OV_DEF = () => ({ site: {}, products: {}, reviewsHidden: [] });
  async function saveOv(mutate, msg) {
    busy(true);
    try {
      const r = await updateJson("data/overrides.json", OV_DEF, (o) => { o.site = o.site || {}; o.products = o.products || {}; o.reviewsHidden = o.reviewsHidden || []; mutate(o); }, msg);
      S.ov = r.obj; S.pendingSince = Date.now(); toast("ذخیره شد ✓ — تا ۳ دقیقه دیگر روی سایت منتشر می‌شود"); pollRuns();
    } catch (e) { toast(errMsg(e), true); throw e; } finally { busy(false); }
  }
  async function saveOrders(mutate, msg) {
    busy(true);
    try { const r = await updateJson("data/orders.json", () => [], mutate, msg); S.orders = r.obj; toast("سفارش ذخیره شد ✓"); }
    catch (e) { toast(errMsg(e), true); throw e; } finally { busy(false); }
  }
  const prod = (id) => S.data.products.find((p) => p.id === +id);
  const catName = (k) => (S.data.categories.find((c) => c.key === k) || {}).name || k;
  const short = (t) => String(t || "").split(" | ")[0];

  /* ---------- publish status ---------- */
  async function loadRuns() { try { const j = await gh(`${repo}/actions/runs?per_page=6&t=${Date.now()}`); S.runs = j.workflow_runs || []; } catch {} renderChip(); }
  let pollT, pollN = 0;
  function pollRuns() { clearTimeout(pollT); pollN = 0; const tick = async () => { await loadRuns(); const l = S.runs[0]; const waiting = !l || l.status !== "completed" || new Date(l.created_at).getTime() < S.pendingSince - 30000; if (waiting && ++pollN < 60) pollT = setTimeout(tick, 8000); }; pollT = setTimeout(tick, 4000); }
  function chipState() {
    const l = S.runs[0];
    if (!l) return ["", "وضعیت انتشار نامشخص"];
    if (l.status !== "completed") return ["run", "در حال ساخت و انتشار سایت…"];
    if (l.conclusion === "success") return ["ok", "سایت به‌روز است · " + new Date(l.updated_at || l.created_at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })];
    return ["bad", "خطا در آخرین ساخت سایت"];
  }
  function renderChip() { const c = $("#chip"); if (!c) return; const [k, t] = chipState(); c.className = "chip " + k; c.innerHTML = `<i></i>${esc(t)}`; }

  /* ---------- login ---------- */
  function renderLogin(err) {
    $("#app").innerHTML = `<div class="login"><form class="login-c" id="lf" autocomplete="off">
      <img src="../assets/img/logo.svg" alt="ELLMARRT" width="80" height="64">
      <h1>پنل مدیریت المارت</h1>
      <p>برای ورود یک بار «توکن دسترسی گیت‌هاب» را وارد کنید. توکن فقط در همین مرورگر ذخیره می‌شود.</p>
      <ol class="steps">
        <li>در گیت‌هاب وارد حساب خود شوید و به <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Settings ← Developer settings ← Fine-grained tokens ← Generate new token</a> بروید.</li>
        <li>در «Repository access» فقط مخزن <b dir="ltr">${OWNER}/${REPO}</b> را انتخاب کنید.</li>
        <li>در «Permissions ← Repository» این دو مورد را روی <b dir="ltr">Read and write</b> بگذارید: <b dir="ltr">Contents</b> و <b dir="ltr">Actions</b>.</li>
        <li>توکن ساخته‌شده را اینجا بچسبانید.</li>
      </ol>
      <label class="field"><span>توکن گیت‌هاب</span><input type="password" id="tk" dir="ltr" placeholder="github_pat_…" required></label>
      <button class="btn btn-ink" style="width:100%" type="submit">ورود به پنل</button>
      <p class="err" id="le">${esc(err || "")}</p>
    </form></div>`;
    $("#lf").addEventListener("submit", async (e) => {
      e.preventDefault(); TOKEN = $("#tk").value.trim(); if (!TOKEN) return;
      $("#le").textContent = "در حال بررسی…";
      try { const r = await gh(repo); if (r.permissions && r.permissions.push === false) throw Object.assign(new Error("no push"), { status: 403 }); localStorage.setItem(TKEY, TOKEN); start(); }
      catch (er) { TOKEN = ""; $("#le").textContent = errMsg(er); }
    });
  }

  /* ---------- views ---------- */
  const NAV = [["dashboard", "داشبورد", ICON.home], ["products", "محصولات", ICON.box], ["orders", "سفارش‌های سایت", ICON.cart], ["reviews", "نظرات", ICON.star], ["settings", "تنظیمات سایت", ICON.cog], ["help", "راهنما", ICON.help]];
  function shell(inner, title) {
    return `<div class="shell"><aside class="side"><div class="brand"><img src="../assets/img/mark.svg" alt="" width="30" height="40"><span><b>المارت</b><small>پنل مدیریت</small></span></div>
      <nav class="nav" aria-label="منو">${NAV.map(([k, t, i]) => `<a href="#/${k}"${S.view === k ? ' aria-current="page"' : ""}>${i}<span>${t}</span></a>`).join("")}</nav>
      <div class="foot"><a href="../" target="_blank" rel="noopener" class="btn" style="text-decoration:none">مشاهده سایت ↗</a><button class="btn" data-act="logout">خروج</button></div></aside>
      <main class="main"><div class="top"><h1>${title}</h1><span class="chip" id="chip"></span><button class="btn btn-ghost btn-sm" data-act="sync" title="موجودی، قیمت و نظرها را همین الان از باسلام بگیر">↻ همگام‌سازی با باسلام</button></div>${inner}</main></div>`;
  }

  /* dashboard */
  function viewDashboard() {
    const D = S.data, P = D.products, vis = P.filter((p) => !p.hidden);
    const sum = (a, f) => a.reduce((x, p) => x + f(p), 0);
    const sales = sum(P, (p) => p.sales), rev = sum(P, (p) => p.sales * p.price);
    const wk = sum(P, (p) => p.salesWeek), wkRev = sum(P, (p) => p.salesWeek * p.price);
    const inStock = vis.filter((p) => p.inStock), out = vis.filter((p) => !p.inStock), low = vis.filter((p) => p.inStock && p.stock <= 3);
    const deadColors = vis.filter((p) => p.colors.length > 1).flatMap((p) => p.colors.filter((c) => c.stock === 0).map((c) => ({ p, c })));
    const top = [...P].sort((a, b) => b.sales - a.sales).slice(0, 8), topMax = top[0] ? top[0].sales || 1 : 1;
    const byCat = D.categories.map((c) => ({ c, n: P.filter((p) => p.cat === c.key).length, s: sum(P.filter((p) => p.cat === c.key), (p) => p.sales) })).filter((x) => x.n).sort((a, b) => b.s - a.s);
    const catMax = Math.max(1, ...byCat.map((x) => x.s));
    const wkTop = [...P].filter((p) => p.salesWeek).sort((a, b) => b.salesWeek - a.salesWeek).slice(0, 5);
    const g = D.store.groups || {}, gTot = Object.values(g).reduce((a, b) => a + b, 0) || 1;
    const O = S.orders, done = O.filter((o) => o.status === "paid" || o.status === "delivered");
    const oRev = sum(done, (o) => o.amount || 0), oProfit = sum(done, (o) => o.profit || 0);
    const months = {}; done.forEach((o) => { const k = (o.date || "").slice(0, 7); if (k) months[k] = (months[k] || 0) + (o.amount || 0); });
    const mk = Object.keys(months).sort().slice(-6), mMax = Math.max(1, ...mk.map((k) => months[k]));
    return `
    <div class="grid kpis">
      <div class="card kpi gold"><span>فروش کل غرفه در باسلام</span><b class="num">${fa(sales)}</b><small>سفارش · درآمد تخمینی ${money(rev)} تومان</small></div>
      <div class="card kpi"><span>فروش این هفته</span><b class="num">${fa(wk)}</b><small>درآمد تخمینی ${money(wkRev)} تومان</small></div>
      <div class="card kpi"><span>امتیاز خریداران</span><b class="num">${fa(D.store.average || 0)} ★</b><small>از ${fa(D.store.count || 0)} امتیاز</small></div>
      <div class="card kpi"><span>محصولات فعال در سایت</span><b class="num">${fa(vis.length)}</b><small>${fa(P.length - vis.length)} مخفی · ${fa(inStock.length)} موجود · ${fa(out.length)} ناموجود</small></div>
    </div>
    <div class="grid two" style="margin-bottom:14px">
      <div class="card"><h2>پرفروش‌ترین محصولات <small>تعداد فروش در باسلام</small></h2><div class="bars">${top.map((p) => `<div class="bar"><span title="${esc(p.title)}">${esc(short(p.title))}</span><i><em style="width:${Math.round((p.sales / topMax) * 100)}%"></em></i><b class="num">${fa(p.sales)}</b></div>`).join("") || '<p class="empty">هنوز فروشی ثبت نشده.</p>'}</div></div>
      <div class="card"><h2>فروش به تفکیک دسته <small>تعداد فروش</small></h2><div class="bars">${byCat.map((x) => `<div class="bar teal"><span>${esc(x.c.name)}</span><i><em style="width:${Math.round((x.s / catMax) * 100)}%"></em></i><b class="num">${fa(x.s)}</b></div>`).join("")}</div></div>
    </div>
    <div class="grid two" style="margin-bottom:14px">
      <div class="card"><h2>هشدار موجودی</h2>
        ${out.length || low.length || deadColors.length ? `<div class="tbl"><table><tbody>
          ${out.map((p) => `<tr><td>${esc(short(p.title))}</td><td><span class="tag bad">ناموجود</span></td><td><button class="btn btn-ghost btn-sm" data-edit="${p.id}">ویرایش</button></td></tr>`).join("")}
          ${low.map((p) => `<tr><td>${esc(short(p.title))}</td><td><span class="tag warn">فقط ${fa(p.stock)} عدد</span></td><td><button class="btn btn-ghost btn-sm" data-edit="${p.id}">ویرایش</button></td></tr>`).join("")}
          ${deadColors.slice(0, 12).map(({ p, c }) => `<tr><td>${esc(short(p.title))}</td><td><span class="tag">رنگ ${esc(c.name)} تمام شده</span></td><td><button class="btn btn-ghost btn-sm" data-edit="${p.id}">ویرایش</button></td></tr>`).join("")}
        </tbody></table></div>${deadColors.length > 12 ? `<p class="empty" style="padding:8px">و ${fa(deadColors.length - 12)} رنگ تمام‌شده دیگر…</p>` : ""}` : '<p class="empty">همه محصولات موجودند ✓</p>'}</div>
      <div class="card"><h2>توزیع امتیاز خریداران</h2><div class="bars">${[5, 4, 3, 2, 1].map((n) => `<div class="bar brick"><span>${fa(n)} ستاره</span><i><em style="width:${Math.round(((g[n] || 0) / gTot) * 100)}%"></em></i><b class="num">${fa(g[n] || 0)}</b></div>`).join("")}</div>
        ${wkTop.length ? `<h2 style="margin-top:18px">داغ این هفته</h2><div class="bars">${wkTop.map((p) => `<div class="bar"><span>${esc(short(p.title))}</span><i><em style="width:${Math.round((p.salesWeek / wkTop[0].salesWeek) * 100)}%"></em></i><b class="num">${fa(p.salesWeek)}</b></div>`).join("")}</div>` : ""}</div>
    </div>
    <div class="card"><h2>فروش از طریق سایت <small>بر اساس سفارش‌هایی که در بخش «سفارش‌های سایت» ثبت می‌کنید</small></h2>
      <div class="grid kpis" style="margin-bottom:10px"><div class="kpi"><b class="num">${fa(done.length)}</b><span>سفارش موفق</span></div><div class="kpi"><b class="num">${money(oRev)}</b><span>درآمد (تومان)</span></div><div class="kpi"><b class="num">${money(oProfit)}</b><span>سود خالص (تومان)</span></div><div class="kpi"><b class="num">${money(oProfit / 2)}</b><span>سهم هر شریک (۵۰٪)</span></div></div>
      ${mk.length ? `<div class="cols">${mk.map((k) => `<div class="col"><b class="num">${money(months[k])}</b><i style="height:${Math.max(3, Math.round((months[k] / mMax) * 100))}%"></i><span>${monthFa(k)}</span></div>`).join("")}</div>` : '<p class="empty">هنوز سفارشی از سایت ثبت نشده. از بخش «سفارش‌های سایت» اضافه کنید.</p>'}</div>
    <p class="note" style="margin-top:14px">درآمد تخمینی = تعداد فروش × قیمت فعلی محصول و ممکن است با درآمد واقعی (تخفیف‌ها و تغییر قیمت‌ها) کمی فرق داشته باشد. آخرین همگام‌سازی با باسلام: <b>${D.builtAt ? dateFa(D.builtAt) : "—"}</b>. آمار بازدید سایت را می‌توانید با ثبت‌نام رایگان در GoatCounter و وارد کردن کد آن در «تنظیمات سایت ← آمار» فعال کنید.</p>`;
  }

  /* products */
  function filteredProducts() {
    const { q, cat, st } = S.pf; const qq = q.trim().toLowerCase();
    return S.data.products.filter((p) => (!qq || (p.title + " " + p.id + " " + p.basalamTitle).toLowerCase().includes(qq)) && (!cat || p.cat === cat) && (!st || (st === "hidden" ? p.hidden : st === "featured" ? p.featured : st === "out" ? !p.inStock : st === "custom" ? p.customMain || p.colors.some((c) => c.custom) : true)));
  }
  const prow = (p) => `<div class="prow${p.hidden ? " is-hidden" : ""}"><img class="thumb" src="${p.img}" alt="" loading="lazy"><div><h3>${esc(p.title)}</h3><div class="meta"><span>${esc(catName(p.cat))}</span><span class="num">${fa(p.price)} تومان</span><span class="num">موجودی ${fa(p.stock)}</span><span class="num">فروش ${fa(p.sales)}</span>${p.rating ? `<span class="num">${fa(p.rating.avg)} ★ (${fa(p.rating.count)})</span>` : ""}</div>
    <div class="meta">${p.hidden ? '<span class="tag bad">مخفی</span>' : ""}${p.featured ? '<span class="tag gold">ویژه</span>' : ""}${!p.inStock ? '<span class="tag bad">ناموجود</span>' : ""}${p.customMain ? '<span class="tag ok">عکس اختصاصی</span>' : ""}</div></div>
    <div class="acts"><button class="btn btn-ink btn-sm" data-edit="${p.id}">ویرایش</button><a class="btn btn-ghost btn-sm" href="..${p.url}" target="_blank" rel="noopener" style="text-decoration:none">مشاهده ↗</a></div></div>`;
  function viewProducts() {
    const list = filteredProducts();
    return `<div class="filters"><input type="text" id="pq" placeholder="جستجو در عنوان یا کد کالا…" value="${esc(S.pf.q)}"><select id="pc"><option value="">همه دسته‌ها</option>${S.data.categories.map((c) => `<option value="${c.key}"${S.pf.cat === c.key ? " selected" : ""}>${esc(c.name)}</option>`).join("")}</select>
      <select id="ps">${[["", "همه وضعیت‌ها"], ["featured", "ویژه"], ["hidden", "مخفی"], ["out", "ناموجود"], ["custom", "دارای عکس اختصاصی"]].map(([k, t]) => `<option value="${k}"${S.pf.st === k ? " selected" : ""}>${t}</option>`).join("")}</select></div>
      <p class="note">قیمت، موجودی، رنگ و سایز مستقیم از باسلام می‌آید (هر ۶ ساعت)؛ اینجا عنوان، معرفی، دسته، نمایش/مخفی بودن و عکس‌ها را کنترل می‌کنید. ${fa(list.length)} محصول</p>
      <div class="plist" id="plist">${list.map(prow).join("") || '<p class="empty">محصولی پیدا نشد.</p>'}</div>`;
  }

  function openProduct(id) {
    const p = prod(id); if (!p) return;
    const ov = (S.ov.products || {})[p.id] || {};
    const init = { title: p.title, hook: p.hook || "", extra: p.extra || "", cat: p.cat, featured: !!p.featured, hidden: !!p.hidden };
    const m = document.createElement("div"); m.className = "modal"; m.id = "pm";
    const imgBlock = (kind, label, src, custom, name) => `<div class="img"><img src="${src || p.img}" alt="">${custom ? '<span class="tag ok">اختصاصی</span>' : ""}<b>${esc(label)}</b><div class="row"><button class="btn btn-ghost btn-sm" data-up="${kind}" data-name="${esc(name || "")}">آپلود عکس</button>${custom ? `<button class="btn btn-danger btn-sm" data-reset="${kind}" data-name="${esc(name || "")}">حذف</button>` : ""}</div></div>`;
    m.innerHTML = `<div class="modal-c" role="dialog" aria-modal="true" aria-label="ویرایش محصول"><div class="modal-h"><h2>ویرایش: ${esc(short(p.title))}</h2><button class="x" data-close aria-label="بستن">✕</button></div>
      <div class="modal-b">
        <label class="field"><span>عنوان محصول در سایت</span><input type="text" id="f-title" value="${esc(p.title)}"><small>اگر بخواهید «عنوان | زیرعنوان» باشد، با علامت | جدا کنید؛ در کارت‌ها فقط بخش اول نشان داده می‌شود. عنوان اصلی باسلام: ${esc(p.basalamTitle)}</small></label>
        <label class="field"><span>جمله معرفی محصول</span><textarea id="f-hook" maxlength="220">${esc(p.hook || "")}</textarea><small>یک یا دو جمله جذاب که بالای توضیحات و در نتایج گوگل دیده می‌شود.</small></label>
        <label class="field"><span>ویژگی اضافه (اختیاری)</span><input type="text" id="f-extra" value="${esc(p.extra || "")}" maxlength="160"><small>مثلاً «جنس وارداتی» یا «مناسب فصل بهار»؛ به فهرست ویژگی‌ها اضافه می‌شود.</small></label>
        <div class="two-f"><label class="field"><span>دسته‌بندی</span><select id="f-cat">${S.data.categories.map((c) => `<option value="${c.key}"${p.cat === c.key ? " selected" : ""}>${esc(c.name)}</option>`).join("")}</select></label></div>
        <label class="sw"><input type="checkbox" id="f-feat"${p.featured ? " checked" : ""}><span>محصول ویژه<small>در بالای لیست‌ها و پرفروش‌های صفحه اصلی نشان داده می‌شود.</small></span></label>
        <label class="sw"><input type="checkbox" id="f-hide"${p.hidden ? " checked" : ""}><span>مخفی کردن از سایت<small>صفحه محصول و همه لینک‌هایش برداشته می‌شود (در باسلام تغییری نمی‌کند).</small></span></label>
        <h3 style="margin:14px 0 8px">عکس‌ها</h3>
        <label class="field" style="max-width:340px"><span>حالت قرارگیری عکس آپلودی</span><select id="f-fit"><option value="cover">پر کردن قاب (برش از اطراف)</option><option value="contain">کامل داخل قاب (بدون برش)</option></select></label>
        <div class="imgs">${imgBlock("main", "عکس اصلی", p.customMain ? p.img : p.img, p.customMain)}${p.colors.map((c) => imgBlock("color", "رنگ " + c.name, c.img, c.custom, c.name)).join("")}</div>
        <small style="color:var(--muted)">عکس‌ها فوراً آپلود و ذخیره می‌شوند و نسخه اصلی با «حذف» برمی‌گردد. بهترین نسبت ۴:۵ (عمودی) است.</small>
      </div>
      <div class="modal-f"><a class="btn btn-ghost" href="${esc(p.buyUrl)}" target="_blank" rel="noopener" style="text-decoration:none">باسلام ↗</a><button class="btn btn-ghost" data-close>انصراف</button><button class="btn btn-gold" id="f-save">ذخیره تغییرات</button></div></div>`;
    document.body.append(m); document.body.style.overflow = "hidden";
    const close = () => { m.remove(); document.body.style.overflow = ""; };
    m.addEventListener("click", async (e) => {
      if (e.target === m || e.target.closest("[data-close]")) return close();
      const up = e.target.closest("[data-up]"), rs = e.target.closest("[data-reset]");
      if (up) {
        const file = await pickFile(); if (!file) return;
        try {
          busy(true, "در حال آپلود عکس…");
          const blob = await prepImage(file, $("#f-fit", m).value);
          const slug = up.dataset.up === "main" ? "main" : "c" + p.colors.findIndex((c) => c.name === up.dataset.name);
          const path = `uploads/${p.id}-${slug}-${Date.now().toString(36)}.jpg`;
          await putFile(path, await toB64(blob), `Admin: photo for product ${p.id}`);
          busy(false);
          await saveOv((o) => { const pp = (o.products[p.id] = o.products[p.id] || {}); pp.images = pp.images || {}; if (up.dataset.up === "main") pp.images.main = path; else (pp.images.colors = pp.images.colors || {})[up.dataset.name] = path; }, `Admin: photo ${p.id}`);
          localImg(p, up.dataset.up, up.dataset.name, URL.createObjectURL(blob)); close(); renderView(); openProduct(p.id);
        } catch (er) { busy(false); toast(errMsg(er), true); }
      } else if (rs) {
        try { await saveOv((o) => { const pp = o.products[p.id]; if (!pp || !pp.images) return; if (rs.dataset.reset === "main") delete pp.images.main; else if (pp.images.colors) delete pp.images.colors[rs.dataset.name]; if (pp.images.colors && !Object.keys(pp.images.colors).length) delete pp.images.colors; if (!Object.keys(pp.images).length) delete pp.images; cleanProduct(o, p.id); }, `Admin: reset photo ${p.id}`);
          if (rs.dataset.reset === "main") p.customMain = false; else { const c = p.colors.find((x) => x.name === rs.dataset.name); if (c) c.custom = false; } close(); renderView(); openProduct(p.id); } catch {}
      }
    });
    $("#f-save", m).addEventListener("click", async () => {
      const v = (s) => $(s, m).value.trim();
      const patch = { title: v("#f-title"), hook: v("#f-hook"), extra: v("#f-extra"), cat: v("#f-cat"), featured: $("#f-feat", m).checked, hidden: $("#f-hide", m).checked };
      try {
        await saveOv((o) => {
          const pp = (o.products[p.id] = o.products[p.id] || {});
          // only touch fields the owner actually changed, so untouched ones keep following the automatic defaults
          if (patch.title !== init.title) setOrDel(pp, "title", patch.title && patch.title !== p.autoTitle ? patch.title : "");
          if (patch.hook !== init.hook) setOrDel(pp, "hook", patch.hook);
          if (patch.extra !== init.extra) setOrDel(pp, "extra", patch.extra);
          if (patch.cat !== init.cat) setOrDel(pp, "cat", patch.cat);
          if (patch.featured !== init.featured) setOrDel(pp, "featured", patch.featured);
          if (patch.hidden !== init.hidden) setOrDel(pp, "hidden", patch.hidden);
          cleanProduct(o, p.id);
        }, `Admin: edit product ${p.id}`);
        Object.assign(p, { title: patch.title || p.title, hook: patch.hook || null, extra: patch.extra || null, cat: patch.cat, featured: patch.featured, hidden: patch.hidden });
        close(); renderView();
      } catch {}
    });
  }
  const setOrDel = (o, k, v) => { if (v === "" || v === null || v === false || v === undefined) delete o[k]; else o[k] = v; };
  const cleanProduct = (o, id) => { const pp = o.products[id]; if (pp && !Object.keys(pp).length) delete o.products[id]; };
  function localImg(p, kind, name, url) { if (kind === "main") { p.img = url; p.customMain = true; } else { const c = p.colors.find((x) => x.name === name); if (c) { c.img = url; c.custom = true; } } }
  function pickFile() { return new Promise((res) => { const i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = () => res(i.files[0] || null); i.click(); }); }
  const toB64 = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(blob); });
  async function prepImage(file, fit) {
    const bm = await createImageBitmap(file); const W = 1200, H = 1500;
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    x.fillStyle = "#efe9df"; x.fillRect(0, 0, W, H);
    const s = fit === "contain" ? Math.min(W / bm.width, H / bm.height) : Math.max(W / bm.width, H / bm.height);
    const w = bm.width * s, h = bm.height * s; x.imageSmoothingQuality = "high"; x.drawImage(bm, (W - w) / 2, (H - h) / 2, w, h);
    return new Promise((r) => c.toBlob(r, "image/jpeg", 0.9));
  }

  /* orders */
  const CH = { direct: "سفارش مستقیم سایت", coupon: "کد تخفیف باسلام", other: "سایر" };
  const ST = { pending: ["در انتظار", ""], paid: ["پرداخت‌شده", "gold"], delivered: ["تحویل‌شده", "ok"], canceled: ["لغو شده", "bad"] };
  function viewOrders() {
    const O = [...S.orders].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const done = O.filter((o) => o.status === "paid" || o.status === "delivered");
    const rev = done.reduce((a, o) => a + (o.amount || 0), 0), pr = done.reduce((a, o) => a + (o.profit || 0), 0);
    return `<div class="note bad"><b>حریم خصوصی:</b> مخزن گیت‌هاب عمومی است؛ <b>نام، تلفن و آدرس مشتری را اینجا ننویسید.</b> فقط کد پیگیری، محصول و مبلغ ثبت می‌شود.</div>
      <div class="grid kpis"><div class="card kpi"><b class="num">${fa(O.length)}</b><span>کل سفارش‌های ثبت‌شده</span></div><div class="card kpi"><b class="num">${money(rev)}</b><span>درآمد سفارش‌های موفق (تومان)</span></div><div class="card kpi"><b class="num">${money(pr)}</b><span>سود خالص (تومان)</span></div><div class="card kpi gold"><b class="num">${money(pr / 2)}</b><span>سهم هر شریک (۵۰٪ سود)</span></div></div>
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap"><button class="btn btn-ink" data-act="order-new">+ ثبت سفارش جدید</button><button class="btn btn-ghost" data-act="orders-csv">دانلود فایل اکسل (CSV)</button></div>
      <div class="card"><div class="tbl"><table><thead><tr><th>تاریخ</th><th>کد پیگیری</th><th>محصول</th><th>منبع</th><th>مبلغ</th><th>سود</th><th>وضعیت</th><th></th></tr></thead><tbody>
      ${O.map((o) => `<tr><td>${dateFa(o.date)}</td><td dir="ltr" style="text-align:right"><b>${esc(o.code)}</b></td><td>${esc(short(o.title || ""))}</td><td>${esc(CH[o.channel] || "")}</td><td class="num">${fa(o.amount || 0)}</td><td class="num">${fa(o.profit || 0)}</td><td><span class="tag ${ST[o.status]?.[1] || ""}">${ST[o.status]?.[0] || ""}</span></td><td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" data-order="${esc(o.id)}">ویرایش</button></td></tr>`).join("") || '<tr><td colspan="8" class="empty">هنوز سفارشی ثبت نشده.</td></tr>'}</tbody></table></div></div>`;
  }
  function openOrder(id) {
    const o = id ? S.orders.find((x) => x.id === id) : null;
    const today = new Date().toISOString().slice(0, 10);
    const m = document.createElement("div"); m.className = "modal";
    m.innerHTML = `<div class="modal-c"><div class="modal-h"><h2>${o ? "ویرایش سفارش" : "ثبت سفارش جدید"}</h2><button class="x" data-close aria-label="بستن">✕</button></div><div class="modal-b">
      <div class="two-f"><label class="field"><span>تاریخ</span><input type="date" id="o-date" value="${esc(o ? o.date : today)}"></label><label class="field"><span>کد پیگیری (مثل EL-1A2B)</span><input type="text" id="o-code" dir="ltr" value="${esc(o ? o.code : "")}" placeholder="EL-XXXX"></label></div>
      <label class="field"><span>محصول</span><select id="o-prod"><option value="">— انتخاب محصول —</option>${S.data.products.map((p) => `<option value="${p.id}"${o && o.productId === p.id ? " selected" : ""}>${esc(short(p.title))}</option>`).join("")}</select></label>
      <div class="two-f"><label class="field"><span>مبلغ سفارش (تومان)</span><input type="text" id="o-amt" inputmode="numeric" value="${o ? esc(o.amount) : ""}"></label><label class="field"><span>سود خالص این سفارش (تومان)</span><input type="text" id="o-profit" inputmode="numeric" value="${o ? esc(o.profit || "") : ""}"><small>برای محاسبه سهم ۵۰/۵۰ شرکا</small></label></div>
      <div class="two-f"><label class="field"><span>منبع سفارش</span><select id="o-ch">${Object.entries(CH).map(([k, t]) => `<option value="${k}"${o && o.channel === k ? " selected" : ""}>${t}</option>`).join("")}</select></label><label class="field"><span>وضعیت</span><select id="o-st">${Object.entries(ST).map(([k, t]) => `<option value="${k}"${(o ? o.status : "pending") === k ? " selected" : ""}>${t[0]}</option>`).join("")}</select></label></div>
      <label class="field"><span>یادداشت (بدون اطلاعات شخصی)</span><input type="text" id="o-note" value="${esc(o ? o.note || "" : "")}"></label></div>
      <div class="modal-f">${o ? '<button class="btn btn-danger" id="o-del" style="margin-inline-end:auto">حذف سفارش</button>' : ""}<button class="btn btn-ghost" data-close>انصراف</button><button class="btn btn-gold" id="o-save">ذخیره</button></div></div>`;
    document.body.append(m); document.body.style.overflow = "hidden";
    const close = () => { m.remove(); document.body.style.overflow = ""; };
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) close(); });
    $("#o-save", m).addEventListener("click", async () => {
      const code = $("#o-code", m).value.trim().toUpperCase(); const pid = +$("#o-prod", m).value;
      if (!code) return toast("کد پیگیری را وارد کنید", true);
      const rec = { id: o ? o.id : Date.now().toString(36), code, date: $("#o-date", m).value, productId: pid || null, title: pid ? prod(pid).title : "", amount: num($("#o-amt", m).value), profit: num($("#o-profit", m).value), channel: $("#o-ch", m).value, status: $("#o-st", m).value, note: $("#o-note", m).value.trim() };
      try { await saveOrders((arr) => { const i = arr.findIndex((x) => x.id === rec.id); if (i >= 0) arr[i] = rec; else arr.push(rec); }, `Admin: order ${code}`); close(); renderView(); } catch {}
    });
    $("#o-del", m)?.addEventListener("click", async () => { if (!confirm("این سفارش حذف شود؟")) return; try { await saveOrders((arr) => { const i = arr.findIndex((x) => x.id === o.id); if (i >= 0) arr.splice(i, 1); }, `Admin: delete order ${o.code}`); close(); renderView(); } catch {} });
  }
  function ordersCsv() {
    const rows = [["تاریخ", "کد پیگیری", "محصول", "منبع", "مبلغ", "سود", "وضعیت", "یادداشت"], ...S.orders.map((o) => [o.date, o.code, o.title, CH[o.channel] || "", o.amount, o.profit || 0, ST[o.status]?.[0] || "", o.note || ""])];
    const csv = "﻿" + rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = "ellmarrt-orders.csv"; a.click();
  }

  /* reviews */
  function viewReviews() {
    const hidden = new Set(S.rvStage || S.ov.reviewsHidden || []);
    const R = S.data.reviews.filter((r) => S.rvFilter === "all" || (S.rvFilter === "text" ? r.text : S.rvFilter === "low" ? r.star <= 3 : hidden.has(r.id)));
    const changed = S.rvStage && JSON.stringify([...S.rvStage].sort()) !== JSON.stringify([...(S.ov.reviewsHidden || [])].sort());
    return `<div class="filters"><select id="rf">${[["all", "همه نظرها"], ["text", "فقط دارای متن"], ["low", "امتیاز ۳ و کمتر"], ["hidden", "مخفی‌شده‌ها"]].map(([k, t]) => `<option value="${k}"${S.rvFilter === k ? " selected" : ""}>${t}</option>`).join("")}</select>${changed ? `<button class="btn btn-gold" data-act="rv-save">ذخیره تغییرات</button>` : ""}</div>
      <p class="note">نظرها مستقیم از باسلام می‌آیند. نظرهای مخفی‌شده فقط از سایت برداشته می‌شوند (در باسلام می‌مانند). ${fa(R.length)} نظر</p>
      <div class="card">${R.map((r) => { const p = prod(r.productId); return `<div class="rv${hidden.has(r.id) ? " is-hidden" : ""}"><span class="stars">${"★".repeat(r.star)}${"☆".repeat(5 - r.star)}</span><div><b>${esc(r.name || "خریدار")}</b> <span class="tag">${dateFa(r.date)}</span>${p ? ` <span class="tag">${esc(short(p.title))}</span>` : ""}<div>${r.text ? esc(r.text) : '<em style="color:var(--muted)">بدون متن</em>'}</div></div><button class="btn btn-ghost btn-sm" data-rv="${r.id}">${hidden.has(r.id) ? "نمایش" : "مخفی"}</button></div>`; }).join("") || '<p class="empty">نظری پیدا نشد.</p>'}</div>`;
  }

  /* settings */
  const DEF = { hero: { eyebrow: "از دل بازار بزرگ (سرپوشیده) تبریز — شش دهه تجربه", line1: "شیک بپوش،", pre: "مثل", em: "بازاری‌ها", post: "بخر.", lead: "۶۰ سال تجربه در انتخاب پارچه و دوخت؛ حالا مستقیم برای شما…", cta1: "دیدن کالکشن", cta2: "سایزم چیه؟" } };
  function viewSettings() {
    const s = S.ov.site || {}; const h = s.hero || {}, c = s.contact || {}, pr = s.promo || {}, st = s.story || {};
    const faq = s.faq || [];
    const I = (id, label, val, ph, area, hint) => `<label class="field"><span>${label}</span>${area ? `<textarea id="${id}" placeholder="${esc(ph || "")}">${esc(val || "")}</textarea>` : `<input type="text" id="${id}" value="${esc(val || "")}" placeholder="${esc(ph || "")}">`}${hint ? `<small>${hint}</small>` : ""}</label>`;
    const sec = (key, title, body, open) => `<details class="card acc"${open ? " open" : ""}><summary>${title}</summary><div class="in" data-sec="${key}">${body}<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px"><button class="btn btn-gold" data-save-sec="${key}">ذخیره این بخش</button><button class="btn btn-ghost" data-reset-sec="${key}">بازگشت به متن پیش‌فرض</button></div></div></details>`;
    return `<p class="note">هر بخش را جدا ذخیره می‌کنید. فیلد خالی یعنی «همان متن پیش‌فرض سایت». تغییرها تا ۳ دقیقه بعد روی سایت دیده می‌شود.</p>
    ${sec("announcements", "نوار اعلان بالای سایت", I("a-list", "پیام‌ها (هر خط یک پیام)", (s.announcements || []).join("\n"), "ارسال به سراسر ایران از روز اول کاری\nسایزبندی واقعی تا 6XL", true, "این پیام‌ها بالای همه صفحه‌ها به‌صورت متحرک نشان داده می‌شوند."), true)}
    ${sec("hero", "بخش اول صفحه اصلی", `<div class="two-f">${I("h-eyebrow", "جمله کوچک بالای تیتر", h.eyebrow, DEF.hero.eyebrow)}${I("h-line1", "تیتر – خط اول", h.line1, DEF.hero.line1)}${I("h-pre", "تیتر – خط دوم، قبل از کلمه طلایی", h.pre, DEF.hero.pre)}${I("h-em", "کلمه طلایی تیتر", h.em, DEF.hero.em)}${I("h-post", "تیتر – بعد از کلمه طلایی", h.post, DEF.hero.post)}${I("h-cta1", "دکمه اول", h.cta1, DEF.hero.cta1)}${I("h-cta2", "دکمه دوم", h.cta2, DEF.hero.cta2)}</div>${I("h-lead", "متن توضیح زیر تیتر", h.lead, "اگر خالی باشد همان متن پیش‌فرض نمایش داده می‌شود.", true)}`)}
    ${sec("story", "داستان المارت (صفحه اصلی)", `${I("s-title", "عنوان", st.title, "یک حجره در بازار سرپوشیده، شصت سال اعتماد.")}${I("s-text", "متن", st.text, "", true)}`)}
    ${sec("faq", "سوالات متداول صفحه اصلی", `<div id="faq-list">${faq.map((q, i) => faqRow(q, i)).join("")}</div><button class="btn btn-ghost btn-sm" data-act="faq-add" style="margin-bottom:10px">+ افزودن سوال</button><small style="display:block;color:var(--muted)">اگر هیچ سوالی نگذارید، ۵ سوال پیش‌فرض نمایش داده می‌شود.</small>`)}
    ${sec("contact", "تماس و شبکه‌های اجتماعی", `${I("c-phones", "شماره‌های سفارش (هر خط یک شماره)", (c.phones || []).join("\n"), "09228167268\n09935291942", true)}${I("c-address", "آدرس حجره", c.address, "تبریز، بازار سرپوشیده، راسته بازار، روبروی بانک سپه")}<div class="two-f">${I("c-ig", "آیدی اینستاگرام (بدون @)", c.igHandle, "ellmarrt")}${I("c-rub", "لینک کانال روبیکا", c.rubika, "https://rubika.ir/ellmarrt")}${I("c-rubo", "لینک ثبت سفارش در روبیکا", c.rubikaOrder, "https://rubika.ir/aliegbal")}</div>`)}
    ${sec("promo", "کد تخفیف اختصاصی سایت", `<label class="sw"><input type="checkbox" id="p-on"${pr.active ? " checked" : ""}><span>نمایش کد تخفیف روی سایت<small>روی صفحه محصولات و نوار بالای سایت نشان داده می‌شود. ابتدا کوپن را در پنل فروشندگی باسلام بسازید.</small></span></label><div class="two-f">${I("p-code", "کد تخفیف", pr.code, "ELLWEB")}${I("p-text", "توضیح کوتاه", pr.text, "۵٪ تخفیف برای خرید از سایت")}</div>`)}
    ${sec("footer", "متن معرفی در پایین سایت", I("f-blurb", "متن", (s.footer || {}).blurb, "تولیدی و پخش پوشاک مردانه المارت؛ بیش از ۶۰ سال…", true))}
    ${sec("misc", "سابقه و آمار بازدید", `<div class="two-f">${I("m-years", "سال‌های سابقه (عدد)", s.years || "", "60")}${I("m-gc", "کد GoatCounter (اختیاری)", (s.analytics || {}).goatcounter, "ellmarrt", false, "با ثبت‌نام رایگان در goatcounter.com یک کد می‌گیرید؛ آمار بازدید سایت آنجا دیده می‌شود.")}</div>`)}`;
  }
  const faqRow = (q, i) => `<div class="faqrow" data-faq="${i}"><label class="field"><span>سوال</span><input type="text" class="fq" value="${esc(q[0])}"></label><label class="field"><span>پاسخ</span><textarea class="fa">${esc(q[1])}</textarea></label><div class="btn-row"><button class="btn btn-ghost btn-sm" data-faq-up>↑</button><button class="btn btn-ghost btn-sm" data-faq-down>↓</button><button class="btn btn-danger btn-sm" data-faq-del>حذف</button></div></div>`;
  function readSection(key) {
    const v = (id) => ($("#" + id)?.value || "").trim();
    const lines = (id) => v(id).split("\n").map((x) => x.trim()).filter(Boolean);
    const clean = (o) => { for (const k of Object.keys(o)) if (o[k] === "" || (Array.isArray(o[k]) && !o[k].length)) delete o[k]; return Object.keys(o).length ? o : null; };
    switch (key) {
      case "announcements": return lines("a-list").length ? lines("a-list") : null;
      case "hero": return clean({ eyebrow: v("h-eyebrow"), line1: v("h-line1"), pre: v("h-pre"), em: v("h-em"), post: v("h-post"), cta1: v("h-cta1"), cta2: v("h-cta2"), lead: v("h-lead") });
      case "story": return clean({ title: v("s-title"), text: v("s-text") });
      case "faq": { const rows = $$(".faqrow").map((r) => [$(".fq", r).value.trim(), $(".fa", r).value.trim()]).filter((x) => x[0] && x[1]); return rows.length ? rows : null; }
      case "contact": return clean({ phones: lines("c-phones").map((x) => x.replace(/[^0-9۰-۹]/g, "")), address: v("c-address"), igHandle: v("c-ig").replace(/^@/, ""), rubika: v("c-rub"), rubikaOrder: v("c-rubo") });
      case "promo": return $("#p-on").checked || v("p-code") ? clean({ active: $("#p-on").checked, code: v("p-code"), text: v("p-text") }) : null;
      case "footer": return clean({ blurb: v("f-blurb") });
      case "misc": return { years: num(v("m-years")) || null, analytics: v("m-gc") ? { goatcounter: v("m-gc").toLowerCase().replace(/[^a-z0-9-]/g, "") } : null };
    }
  }
  async function saveSection(key) {
    const val = readSection(key);
    try {
      await saveOv((o) => {
        if (key === "misc") { setOrDel(o.site, "years", val.years); setOrDel(o.site, "analytics", val.analytics); }
        else if (val === null) delete o.site[key]; else o.site[key] = val;
      }, `Admin: settings ${key}`);
    } catch {}
  }

  /* help */
  const viewHelp = () => `<div class="card" style="line-height:2"><h2>راهنمای سریع</h2><ul style="padding-inline-start:20px;margin:0">
    <li><b>قیمت، موجودی، رنگ و سایز</b> هر ۶ ساعت خودکار از باسلام به‌روز می‌شود. برای به‌روزرسانی فوری دکمه «همگام‌سازی با باسلام» بالای هر صفحه را بزنید.</li>
    <li><b>محصول جدید</b> که در باسلام بگذارید خودکار به سایت اضافه می‌شود (عکس اول باسلام). از بخش «محصولات» می‌توانید عنوان، معرفی و عکس استودیویی آن را تنظیم کنید.</li>
    <li><b>هر تغییر</b> (متن، عکس، مخفی کردن) در گیت‌هاب ذخیره و خودکار منتشر می‌شود؛ نشان بالای صفحه وضعیت انتشار را نشان می‌دهد و معمولاً ۲ تا ۳ دقیقه طول می‌کشد.</li>
    <li><b>سفارش‌های سایت</b> را با کد پیگیری (EL-…) ثبت کنید تا سود و سهم شرکا خودکار محاسبه شود.</li>
    <li><b>امنیت:</b> توکن فقط در همین مرورگر است. اگر گوشی/کامپیوتر را گم کردید، توکن را از گیت‌هاب (Settings ← Developer settings) حذف کنید.</li></ul>
    <p style="margin-top:14px"><button class="btn btn-ghost" data-act="logout">خروج و پاک کردن توکن از این مرورگر</button></p></div>`;

  /* ---------- render + events ---------- */
  const TITLES = { dashboard: "داشبورد", products: "محصولات", orders: "سفارش‌های سایت", reviews: "نظر خریداران", settings: "تنظیمات سایت", help: "راهنما" };
  function renderView() {
    const v = S.view in TITLES ? S.view : "dashboard"; S.view = v;
    const inner = { dashboard: viewDashboard, products: viewProducts, orders: viewOrders, reviews: viewReviews, settings: viewSettings, help: viewHelp }[v]();
    $("#app").innerHTML = shell(inner, TITLES[v]); renderChip();
  }
  const route = () => { $$(".modal").forEach((m) => m.remove()); document.body.style.overflow = ""; S.view = (location.hash.replace("#/", "") || "dashboard"); if (S.data) { renderView(); window.scrollTo(0, 0); } };
  addEventListener("hashchange", route);

  document.addEventListener("input", (e) => {
    if (e.target.id === "pq") { S.pf.q = e.target.value; const pos = e.target.selectionStart; $("#plist").innerHTML = filteredProducts().map(prow).join("") || '<p class="empty">محصولی پیدا نشد.</p>'; }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "pc") { S.pf.cat = e.target.value; renderView(); } else if (e.target.id === "ps") { S.pf.st = e.target.value; renderView(); } else if (e.target.id === "rf") { S.rvFilter = e.target.value; renderView(); }
  });
  document.addEventListener("click", async (e) => {
    const t = e.target;
    const ed = t.closest("[data-edit]"); if (ed) return openProduct(ed.dataset.edit);
    const od = t.closest("[data-order]"); if (od) return openOrder(od.dataset.order);
    const rv = t.closest("[data-rv]");
    if (rv) { const id = +rv.dataset.rv; S.rvStage = new Set(S.rvStage || S.ov.reviewsHidden || []); S.rvStage.has(id) ? S.rvStage.delete(id) : S.rvStage.add(id); return renderView(); }
    const ss = t.closest("[data-save-sec]"); if (ss) return saveSection(ss.dataset.saveSec);
    const rs = t.closest("[data-reset-sec]");
    if (rs) { if (!confirm("این بخش به متن پیش‌فرض برگردد؟")) return; const k = rs.dataset.resetSec; try { await saveOv((o) => { if (k === "misc") { delete o.site.years; delete o.site.analytics; } else delete o.site[k]; }, `Admin: reset ${k}`); renderView(); } catch {} return; }
    const fr = t.closest(".faqrow");
    if (fr && t.closest("[data-faq-del]")) return fr.remove();
    if (fr && t.closest("[data-faq-up]")) return fr.previousElementSibling && fr.parentNode.insertBefore(fr, fr.previousElementSibling);
    if (fr && t.closest("[data-faq-down]")) return fr.nextElementSibling && fr.parentNode.insertBefore(fr.nextElementSibling, fr);
    const act = t.closest("[data-act]")?.dataset.act;
    if (act === "faq-add") { $("#faq-list").insertAdjacentHTML("beforeend", faqRow(["", ""], 0)); $$(".faqrow").at(-1).querySelector("input").focus(); }
    else if (act === "order-new") openOrder(null);
    else if (act === "orders-csv") ordersCsv();
    else if (act === "rv-save") { try { await saveOv((o) => { o.reviewsHidden = [...S.rvStage]; }, "Admin: reviews visibility"); S.rvStage = null; renderView(); } catch {} }
    else if (act === "logout") { if (confirm("از پنل خارج می‌شوید و توکن از این مرورگر پاک می‌شود. ادامه می‌دهید؟")) { localStorage.removeItem(TKEY); TOKEN = ""; renderLogin(); } }
    else if (act === "sync") {
      try { busy(true, "در حال درخواست همگام‌سازی…"); await gh(`${repo}/actions/workflows/sync-basalam.yml/dispatches`, { method: "POST", body: { ref: BRANCH } }); S.pendingSince = Date.now(); toast("همگام‌سازی شروع شد؛ حدود ۳ دقیقه صبر کنید."); pollRuns(); }
      catch (er) { toast(er.status === 403 || er.status === 404 ? "برای این دکمه، دسترسی «Actions: Read and write» به توکن اضافه کنید." : errMsg(er), true); } finally { busy(false); }
    }
  });

  /* ---------- boot ---------- */
  async function start() {
    $("#app").innerHTML = '<div class="login"><div class="login-c"><p>در حال بارگذاری…</p></div></div>';
    try {
      const [d, ov, ord] = await Promise.all([fetch("data.json?t=" + Date.now()).then((r) => r.json()), getFile("data/overrides.json"), getFile("data/orders.json")]);
      S.data = d; S.ov = ov ? JSON.parse(ov.text) : OV_DEF(); S.ov.site = S.ov.site || {}; S.ov.products = S.ov.products || {}; S.ov.reviewsHidden = S.ov.reviewsHidden || [];
      S.orders = ord ? JSON.parse(ord.text) : [];
      S.rvStage = null; route(); loadRuns();
    } catch (e) { if (e.status === 401) { localStorage.removeItem(TKEY); TOKEN = ""; renderLogin(errMsg(e)); } else { renderLogin(errMsg(e)); } }
  }
  if (TOKEN || qs.get("api")) { if (!TOKEN) TOKEN = "test-token"; start(); } else renderLogin();
})();

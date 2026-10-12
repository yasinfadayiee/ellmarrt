// Trust pages: contact, terms, privacy, shipping & returns (also needed later for eNamad).
module.exports = ({ layout, crumbs, crumbSchema, orgSchema, STORE, I, fa0 }) => {
  const prosePage = (ctx, route, crumb, title, desc, html, extraSchema = []) => {
    const items = [["/", "خانه"], [route, crumb]];
    return layout(ctx, {
      path: route, title, desc,
      schema: [crumbSchema(ctx, items), ...extraSchema],
      body: `${crumbs(ctx, items)}<article class="sec-sm"><div class="wrap prose"><h1 style="font-size:clamp(28px,4vw,42px)">${crumb}</h1>${html}<p style="color:var(--muted);font-size:14px;margin-top:2em">آخرین به‌روزرسانی: مهر ۱۴۰۵</p></div></article>`,
    });
  };

  function contact(ctx) {
    const items = [["/", "خانه"], ["/contact/", "تماس با ما"]];
    const ll = "38.0805,46.2940";
    return layout(ctx, {
      path: "/contact/",
      title: "تماس با المارت؛ تلفن، روبیکا و آدرس بازار تبریز",
      desc: `راه‌های تماس با ${STORE.name}: ثبت سفارش تلفنی ${STORE.phones.map(fa0).join(" و ")}، روبیکا @aliegbal، اینستاگرام و آدرس حجره در ${STORE.address}.`,
      schema: [crumbSchema(ctx, items), { ...orgSchema(ctx), "@type": ["ClothingStore", "LocalBusiness"], contactPoint: STORE.phones.map((p) => ({ "@type": "ContactPoint", telephone: "+98" + p.slice(1), contactType: "sales", areaServed: "IR", availableLanguage: ["fa", "az"] })) }],
      body: `${crumbs(ctx, items)}
<header class="wrap phead"><h1>تماس با المارت</h1><p>برای سفارش، مشاوره سایز یا خرید عمده با ما در تماس باشید. پاسخ‌گویی در ساعات کاری بازار تبریز.</p></header>
<section class="sec-sm"><div class="wrap contact-g">
  <div class="contact-cards">
    ${STORE.phones.map((p, i) => `<a class="ccard" href="tel:${p}">${I.phone}<span><b class="num">${fa0(p)}</b><small>${i === 0 ? "ثبت سفارش و مشاوره" : "ثبت سفارش و خرید عمده"}</small></span></a>`).join("")}
    <a class="ccard" href="${STORE.rubikaOrder}" target="_blank" rel="noopener">${I.store}<span><b>روبیکا @aliegbal</b><small>ثبت سفارش در پیام‌رسان</small></span></a>
    <a class="ccard" href="${STORE.rubika}" target="_blank" rel="noopener">${I.share}<span><b>کانال روبیکا @ellmarrt</b><small>جدیدترین مدل‌ها و موجودی</small></span></a>
    <a class="ccard" href="${STORE.instagram}" target="_blank" rel="noopener">${I.ig}<span><b>اینستاگرام @${STORE.igHandle}</b><small>عکس‌ها و استوری محصولات</small></span></a>
    <a class="ccard" href="${STORE.basalam}" target="_blank" rel="noopener">${I.bag}<span><b>غرفه باسلام</b><small>خرید امن آنلاین</small></span></a>
  </div>
  <div class="contact-map">
    <div class="map-art" aria-hidden="true"><svg viewBox="0 0 400 220"><defs><pattern id="br" width="22" height="11" patternUnits="userSpaceOnUse"><path d="M0 0h22M0 5.5h22M11 0v5.5M0 5.5v5.5" stroke="#b08d57" stroke-opacity=".25" fill="none"/></pattern></defs><rect width="400" height="220" fill="url(#br)"/><path d="M40 220V120c0-40 70-70 160-90 90 20 160 50 160 90v100" fill="none" stroke="#b08d57" stroke-width="2"/><path d="M110 220v-70c0-25 40-45 90-55 50 10 90 30 90 55v70" fill="none" stroke="#9a4f2e" stroke-width="2" stroke-dasharray="6 6"/><circle cx="200" cy="150" r="12" fill="#9a4f2e"/><circle cx="200" cy="150" r="24" fill="none" stroke="#9a4f2e" stroke-opacity=".35"/></svg><b>بازار سرپوشیده تبریز</b></div>
    <div class="addr">${I.arch}<span><b>آدرس حجره</b>${STORE.address}<small>فروش حضوری و عمده</small></span></div>
    <div class="routes"><a class="btn btn-ink" href="https://neshan.org/maps/@${ll},17z" target="_blank" rel="noopener">مسیریابی با نشان</a><a class="btn btn-ghost" href="https://balad.ir/location?latitude=38.0805&longitude=46.2940&zoom=17" target="_blank" rel="noopener">بلد</a><a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=${ll}" target="_blank" rel="noopener">گوگل مپ</a></div>
  </div>
</div></section>`,
    });
  }

  const terms = (ctx) => prosePage(ctx, "/terms/", "قوانین و مقررات", "قوانین و مقررات خرید از المارت",
    "قوانین خرید از فروشگاه پوشاک مردانه المارت: نحوه ثبت سفارش، قیمت‌ها، ارسال، مرجوعی و مسئولیت‌ها.",
    `<p>استفاده از وبسایت ${STORE.name} و ثبت سفارش به معنی پذیرش قوانین زیر است. هدف این قوانین، خریدی شفاف و مطمئن برای هر دو طرف است.</p>
<h2>۱. ثبت سفارش</h2><ul><li>سفارش از دو راه ثبت می‌شود: خرید آنلاین از غرفه رسمی المارت در باسلام، یا «سفارش مستقیم» با تماس، پیامک یا روبیکا.</li><li>هر سفارش مستقیم یک <b>کد پیگیری</b> (مانند EL-1A2B) دارد که هنگام پیگیری لازم است.</li><li>سفارش پس از تأیید موجودی و هماهنگی پرداخت قطعی می‌شود.</li></ul>
<h2>۲. قیمت و موجودی</h2><ul><li>قیمت‌ها به تومان و شامل هزینه ارسال نیستند؛ هزینه ارسال هنگام ثبت سفارش اعلام می‌شود.</li><li>موجودی سایت از غرفه باسلام به‌روزرسانی می‌شود؛ در صورت اتمام موجودی پیش از تأیید، سفارش لغو و هزینه کامل بازگردانده می‌شود.</li></ul>
<h2>۳. ارسال</h2><p>سفارش‌ها از روز اول کاری پس از تأیید، با پست پیشتاز یا سفارشی به سراسر ایران و در تبریز با پیک ارسال می‌شوند. جزئیات در صفحه <a href="${ctx.BASE}/shipping-returns/">ارسال و مرجوعی</a>.</p>
<h2>۴. تصاویر و اندازه‌ها</h2><p>تصاویر اصلی با نور استودیو تهیه شده‌اند و جنس، رنگ و دوخت کالا را نشان می‌دهند؛ تفاوت جزئی رنگ به‌دلیل نمایشگرها طبیعی است. اندازه‌ها تقریبی و بر اساس سانتی‌متر هستند.</p>
<h2>۵. مرجوعی</h2><p>سفارش‌های باسلام مطابق قوانین و ضمانت باسلام و سفارش‌های مستقیم مطابق صفحه ارسال و مرجوعی بررسی می‌شوند.</p>
<h2>۶. حریم خصوصی</h2><p>اطلاعات شما فقط برای ارسال سفارش استفاده می‌شود. <a href="${ctx.BASE}/privacy/">سیاست حریم خصوصی</a> را بخوانید.</p>
<h2>۷. ارتباط</h2><p>هرگونه سوال یا شکایت را از طریق <a href="${ctx.BASE}/contact/">صفحه تماس</a> با ما در میان بگذارید.</p>`);

  const privacy = (ctx) => prosePage(ctx, "/privacy/", "حریم خصوصی", "سیاست حریم خصوصی المارت",
    "المارت چه اطلاعاتی از شما نگه می‌دارد و چطور از آن محافظت می‌کند؛ سیاست حریم خصوصی وبسایت المارت.",
    `<p>${STORE.name} به حریم خصوصی شما احترام می‌گذارد.</p>
<h2>چه اطلاعاتی جمع می‌شود؟</h2><ul><li><b>در سفارش مستقیم:</b> نام، شماره تماس و آدرس که خودتان برای ارسال اعلام می‌کنید.</li><li><b>در مرورگر شما:</b> علاقه‌مندی‌ها، سایز انتخابی در سایزیاب و محصولات اخیراً دیده‌شده، فقط روی دستگاه خودتان (localStorage) ذخیره می‌شوند و برای ما ارسال نمی‌شوند.</li><li>این سایت حساب کاربری و رمز عبور ندارد و اطلاعات کارت بانکی دریافت نمی‌کند؛ پرداخت آنلاین در درگاه امن باسلام انجام می‌شود.</li></ul>
<h2>استفاده از اطلاعات</h2><p>اطلاعات تماس و آدرس فقط برای هماهنگی، ارسال سفارش و پشتیبانی استفاده می‌شود و در اختیار هیچ شخص ثالثی (جز شرکت پست یا پیک برای تحویل) قرار نمی‌گیرد.</p>
<h2>حذف اطلاعات</h2><p>برای حذف اطلاعات سفارش‌های قبلی خود از طریق <a href="${ctx.BASE}/contact/">صفحه تماس</a> درخواست دهید.</p>`);

  const shipping = (ctx) => prosePage(ctx, "/shipping-returns/", "ارسال و مرجوعی", "ارسال و مرجوعی سفارش‌ها",
    "روش‌ها و زمان ارسال سفارش‌های المارت به سراسر ایران، بسته‌بندی، و شرایط بررسی مرجوعی و تعویض سایز.",
    `<h2>روش‌های ارسال</h2><table><thead><tr><th>روش</th><th>محدوده</th><th>زمان شروع ارسال</th></tr></thead><tbody><tr><td>پست پیشتاز</td><td>سراسر ایران</td><td>روز اول کاری پس از تأیید</td></tr><tr><td>پست سفارشی</td><td>سراسر ایران</td><td>روز اول کاری پس از تأیید</td></tr><tr><td>پیک موتوری</td><td>شهر تبریز</td><td>هماهنگی تلفنی</td></tr></tbody></table>
<p>هزینه ارسال بر اساس وزن و مقصد هنگام ثبت سفارش اعلام می‌شود. هر سفارش پیش از ارسال بررسی و ایمن بسته‌بندی می‌شود.</p>
<h2>تعویض سایز و مرجوعی</h2><ul><li><b>سفارش‌های باسلام:</b> مطابق قوانین و ضمانت بازگشت وجه باسلام؛ درخواست را از بخش سفارش‌های باسلام ثبت کنید.</li><li><b>سفارش‌های مستقیم:</b> پس از دریافت کالا، اگر سایز اندازه نبود یا ایرادی داشت، با ذکر کد پیگیری سفارش با ما تماس بگیرید تا برای تعویض یا بازگشت راهنمایی‌تان کنیم. کالا باید استفاده‌نشده و با برچسب و بسته‌بندی سالم باشد.</li></ul>
<div class="note">برای کم کردن احتمال تعویض، قبل از خرید از <a href="${ctx.BASE}/size-guide/">سایزیاب المارت</a> استفاده کنید یا با ما مشورت کنید.</div>`);

  return { contact, terms, privacy, shipping };
};

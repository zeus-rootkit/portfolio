const menuButton = document.querySelector('.menu-button'); // نبحث عن زر قائمة الهاتف في الصفحة ونخزّن مرجعه في متغير ثابت.
const nav = document.querySelector('#primary-nav'); // نبحث عن عنصر قائمة الروابط بواسطة المعرّف primary-nav.
const header = document.querySelector('.site-header'); // نبحث عن شريط التنقل العلوي.
let lastScrollY = window.scrollY; // نحفظ آخر موضع تمرير لمعرفة اتجاه الحركة.
const HIDE_OFFSET = 18; // حدّ الإخفاء عند النزول.
const SHOW_OFFSET = 1; // حدّ الإظهار عند الرفع للأعلى.

const updateHeaderState = () => { // دالة تتحكم بإخفاء/إظهار الشريط العلوي عند التمرير.
  const currentScrollY = window.scrollY; // الموضع الحالي للتمرير.

  if (currentScrollY <= 24) { // إذا كان المستخدم في أعلى الصفحة نعرض الشريط فوراً.
    header?.classList.remove('is-hidden'); // نزيل حالة الإخفاء.
    lastScrollY = currentScrollY; // نحدّث آخر موضع.
    return; // نخرج من الدالة.
  }

  if (currentScrollY > lastScrollY + HIDE_OFFSET) { // إذا كان المستخدم ينزل أكثر من 18px.
    header?.classList.add('is-hidden'); // نخفي الشريط.
  } else if (currentScrollY < lastScrollY - SHOW_OFFSET) { // إذا كان المستخدم يرفع لأعلى أكثر من 10px.
    header?.classList.remove('is-hidden'); // نعيد إظهار الشريط.
  }

  lastScrollY = currentScrollY; // نحدّث آخر موضع تم تمريره.
};

window.addEventListener('scroll', updateHeaderState, { passive: true }); // نراقب تمرير الصفحة لتحديث شريط التنقل.

menuButton?.addEventListener('click', () => { // نضيف مستمع حدث للنقر على الزر؛ ?. يمنع الخطأ إذا لم يوجد الزر.
  const open = nav.classList.toggle('open'); // toggle يضيف class open أو يزيله، ويعيد true إذا أصبح موجوداً.
  menuButton.setAttribute('aria-expanded', String(open)); // نحدّث aria-expanded ليعرف مستخدم قارئ الشاشة إن كانت القائمة مفتوحة.
}); // نهاية الدالة ومستمع النقر.
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { // نبحث عن جميع روابط القائمة ونمرّ عليها ونضيف لكل رابط حدث نقر.
  nav.classList.remove('open'); // عند اختيار رابط نزيل open فتُغلق قائمة الهاتف.
  menuButton?.setAttribute('aria-expanded', 'false'); // نخبر تقنيات المساعدة أن القائمة أصبحت مغلقة.
})); // نهاية معالجة النقر على روابط القائمة.

const reveals = document.querySelectorAll('.reveal'); // نجمع العناصر التي تحمل class reveal لإظهارها عند التمرير.
const revealObserver = new IntersectionObserver(entries => { // ننشىء مراقباً يعرف متى تدخل العناصر إلى مساحة العرض.
  entries.forEach(entry => { // نعالج كل عنصر يرسله المراقب.
    if (entry.isIntersecting) { // نفحص هل العنصر ظاهر داخل منطقة المراقبة.
      entry.target.classList.add('visible'); // نضيف visible لتفعيل حركة الظهور المحددة في CSS.
      revealObserver.unobserve(entry.target); // نتوقف عن مراقبة العنصر بعد ظهوره مرة واحدة.
    } // نهاية الشرط.
  }); // نهاية المرور على العناصر.
}, { threshold: .12 }); // threshold يحدد نسبة الظهور اللازمة: 0.12 تعني 12%.
reveals.forEach(el => revealObserver.observe(el)); // نبدأ مراقبة كل عنصر reveal.

const sections = [...document.querySelectorAll('main section[id]')]; // نجمع أقسام main التي لها id؛ ... يحول القائمة إلى مصفوفة.
const navLinks = [...document.querySelectorAll('#primary-nav a')]; // نجمع روابط التنقل في مصفوفة.
const sectionObserver = new IntersectionObserver(entries => { // ننشىء مراقباً ثانياً لمعرفة القسم الحالي أثناء التمرير.
  entries.forEach(entry => { // نمرّ على نتائج المراقبة.
    if (!entry.isIntersecting) return; // إذا لم يكن القسم ظاهراً نتجاوز هذه النتيجة.
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); // نفعّل class active فقط للرابط الذي يطابق href فيه مع id القسم.
  }); // نهاية المرور على النتائج.
}, { rootMargin: '-35% 0px -55%', threshold: 0 }); // rootMargin يحدد منطقة اعتبار القسم نشطاً، وthreshold هنا صفر.
sections.forEach(section => sectionObserver.observe(section)); // نراقب جميع الأقسام ذات المعرّفات.

const glow = document.querySelector('.cursor-glow'); // نجد العنصر المسؤول عن تأثير الإضاءة حول المؤشر.
const heroVisual = document.querySelector('.hero-visual'); // نجد الحاوية الرئيسية للمشهد الإفتراضي.
window.addEventListener('pointermove', event => { // نستمع لحركة المؤشر فوق النافذة.
  if (glow) { // إذا كان هناك عنصر الإضاءة.
    glow.style.left = `${event.clientX}px`; // نضع موضع الإضاءة الأفقي عند إحداثي المؤشر بالبكسل.
    glow.style.top = `${event.clientY}px`; // نضع موضع الإضاءة العمودي عند إحداثي المؤشر بالبكسل.
  }

  if (!heroVisual) return; // إذا لم يوجد مشهد الواجهة نخرج من الدالة.
  const rect = heroVisual.getBoundingClientRect(); // نحصل على موضع المشهد داخل الصفحة.
  const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18; // نحسب الإزاحة الأفقية بناءً على موضع المؤشر.
  const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 18; // نحسب الإزاحة العمودية بناءً على موضع المؤشر.
  heroVisual.style.setProperty('--move-x', `${offsetX}px`); // نرسل الإزاحة إلى CSS لتتحرك الحاوية.
  heroVisual.style.setProperty('--move-y', `${offsetY}px`); // نرسل الإزاحة العمودية إلى CSS.
}, { passive: true }); // passive يوضح أننا لن نمنع السلوك الافتراضي للحدث.

window.addEventListener('pointerleave', () => { // عند مغادرة المؤشر للنافذة، نعيد المشهد إلى وضعه الطبيعي.
  if (!heroVisual) return; // إذا لم يوجد مشهد الواجهة نخرج.
  heroVisual.style.setProperty('--move-x', '0px'); // نعيد الإزاحة الأفقية إلى الصفر.
  heroVisual.style.setProperty('--move-y', '0px'); // نعيد الإزاحة العمودية إلى الصفر.
}); // نهاية حدث الخروج من النافذة.

document.querySelector('#year').textContent = new Date().getFullYear(); // نضع السنة الحالية تلقائياً في العنصر صاحب id year داخل التذييل.

/* ============================================================
   LeafLens AI — landing page interactions
   - Mobile navigation
   - Header scroll state
   - Scroll-reveal animations
   - Animated statistics counters
   - English / Arabic language toggle (full RTL support)
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------- Footer year ---------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Mobile navigation ---------------- */
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close after choosing a destination
    $$("a", mainNav).forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------------- Header scroll state ---------------- */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = $$(".reveal");
  const stagger = () => {
    // Stagger siblings that become visible in the same batch
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, 0);
      el.style.setProperty("--d", `${groups.get(parent) * 0.08}s`);
      groups.set(parent, groups.get(parent) + 1);
    });
  };
  stagger();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------------- Animated counters ---------------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  const counters = $$(".counter");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = parseFloat(el.dataset.target || "0").toFixed(parseInt(el.dataset.decimals || "0", 10))));
  }

  /* ---------------- Bilingual content (EN / AR) ---------------- */
  const translations = {
    ar: {
      "a11y.skip": "تجاوز إلى المحتوى",
      "nav.how": "كيف يعمل",
      "nav.features": "المميزات",
      "nav.showcase": "حالات التحليل",
      "nav.benefits": "الفوائد",
      "nav.cta": "حلّل نبتة الآن",
      "hero.badge": "تشخيص أمراض النبات بالذكاء الاصطناعي",
      "hero.title1": "اكتشف أمراض النبات",
      "hero.title2": "خلال ثوانٍ، بالذكاء الاصطناعي",
      "hero.sub": "ارفع صورة لأي نبتة، وسيحدّد نظامنا المرض، ويشرح الأعراض، ويقدّم لك خطة علاج ووقاية واضحة — حتى لا تصل المشكلة إلى محصولك أبدًا.",
      "hero.cta1": "ابدأ التحليل المجاني",
      "hero.cta2": "كيف يعمل النظام؟",
      "hero.stat1": "دقة الكشف",
      "hero.stat2": "محصول مدعوم",
      "hero.stat3": "لكل تحليل",
      "hero.card.title": "تشخيص الذكاء الاصطناعي",
      "hero.card.conf": "درجة الثقة",
      "hero.card.note": "تم إنشاء خطة العلاج",
      "how.eyebrow": "كيف يعمل النظام",
      "how.title": "من الورقة إلى التشخيص في ثلاث خطوات",
      "how.sub": "بدون مختبر وبدون تخمين. صورة واضحة واحدة تكفي الذكاء الاصطناعي.",
      "how.s1.title": "صوّر الورقة",
      "how.s1.text": "التقط أو ارفع صورة واضحة للورقة أو الساق أو الثمرة المصابة.",
      "how.s2.title": "الذكاء الاصطناعي يحلّلها",
      "how.s2.text": "نموذج رؤية مدرَّب على ملايين الصور يفحص البقع والآفات والأنماط خلال ثوانٍ.",
      "how.s3.title": "استلم خطة العلاج",
      "how.s3.text": "احصل على اسم المرض وأعراضه وخطوات العلاج والوقاية خطوة بخطوة.",
      "features.eyebrow": "المميزات الرئيسية",
      "features.title": "كل ما يحتاجه المزارع، دون أي تعقيد",
      "features.f1.title": "كشف فائق الدقة",
      "features.f1.text": "دقة 98.7% في أكثر من 400 مرض معروف، تم التحقق منها على صور ميدانية حقيقية.",
      "features.f2.title": "خطط علاج فورية",
      "features.f2.text": "كل نتيجة تتضمن الأعراض والمستحضرات الموصى بها وخطوات الوقاية — وليس مجرد اسم للمرض.",
      "features.f3.title": "42 محصولًا مدعومًا",
      "features.f3.text": "خضروات وأشجار مثمرة وحبوب ونباتات زينة — نموذج واحد للمزرعة بأكملها.",
      "features.f4.title": "كشف مبكر للمرض",
      "features.f4.text": "يكتشف الإصابة قبل انتشارها بشكل ظاهر، حين يكون العلاج أرخص وأكثر فعالية.",
      "features.f5.title": "سجل وتقارير",
      "features.f5.text": "تابع صحة نباتاتك عبر الزمن وصدّر تقارير PDF للمشاركة مع المهندسين الزراعيين.",
      "features.f6.title": "العربية والإنجليزية",
      "features.f6.text": "واجهة كاملة ونتائج باللغتين، مع دعم كامل للكتابة من اليمين إلى اليسار.",
      "showcase.eyebrow": "نماذج التحليل",
      "showcase.title": "كيف يبدو التشخيص الحقيقي",
      "showcase.sub": "نتائج نموذجية أنتجها النظام، تمامًا كما يستلمها المزارع.",
      "severity.moderate": "متوسط",
      "severity.high": "مرتفع",
      "show.symptoms": "الأعراض",
      "show.treatment": "العلاج الموصى به",
      "show.c1.disease": "اللفحة المبكرة",
      "show.c1.crop": "الطماطم",
      "show.c1.s1": "بقع داكنة على شكل حلقات متحدة المركز محاطة بهالات صفراء، تبدأ في الأوراق السفلية",
      "show.c1.s2": "تتسع الحلقات مع نمو الآفات واندماجها",
      "show.c1.s3": "تنتشر للأعلى بسرعة في الجو الدافئ الرطب",
      "show.c1.t1": "أزل الأوراق المصابة وتخلص منها، ثم استخدم مبيدًا يحتوي كلوروثالونيل أو نحاسًا كل 7–10 أيام. اسقِ عند القاعدة، ووفر تغطية للتربة، ونوّب المحاصيل سنويًا.",
      "show.c2.disease": "صدأ الورقة",
      "show.c2.crop": "القمح",
      "show.c2.s1": "بثرات برتقالية بنية مسحوقة متناثرة على سطح الورقة",
      "show.c2.s2": "الأبواغ تنسلخ بسهولة وتنتشر بالرياح",
      "show.c2.s3": "تقلل عملية التمثيل الضوئي وتجفف الحبوب وتخفض الإنتاج",
      "show.c2.t1": "استخدم مبيدًا من مجموعة التريازول عند أول ظهور للبثرات، ازرع أصنافًا مقاومة في الموسم التالي، وراقب الحقل جيدًا في فترات الدفء والرطوبة.",
      "show.c3.disease": "الجرب التفاحي",
      "show.c3.crop": "التفاح",
      "show.c3.s1": "آفات مخملية زيتونية اللون على السطح العلوي للورقة",
      "show.c3.s2": "بقع داكنة فلينية تظهر لاحقًا على قشرة الثمرة",
      "show.c3.s3": "التساقط المبكر للأوراق يُضعف الشجرة على مدى المواسم",
      "show.c3.t1": "قم بالتقليم لتحسين التهوية، واستخدم مبيدًا عند بداية نمو البراعم وبعد سقوط التويجات، واجمع أوراق الشجر المتساقطة وتخلص منها، وفضّل الأصناف المقاومة.",
      "benefits.eyebrow": "الفوائد",
      "benefits.title": "مبني على نتائج ميدانية حقيقية",
      "benefits.sub": "موثوق من المزارعين والمهندسين الزراعيين وباحثي صحة النبات.",
      "benefits.s1": "دقة الكشف",
      "benefits.s2": "صورة تم تحليلها",
      "benefits.s3": "محصول مدعوم",
      "benefits.s4": "متوسط زمن التحليل",
      "benefits.p1": "قلّل خسائر المحاصيل باكتشاف المرض قبل أيام",
      "benefits.p2": "أنفق أقل على الرش واسع الطيف وعالج ما يحتاج فقط",
      "benefits.p3": "امنح كل فرد في فريقك تشخيصًا بخبرة المحترفين في الحقل",
      "cta.title": "احمِ محصولك قبل أن ينتشر المرض",
      "cta.sub": "ابدأ بتحليل صورة واحدة مجانًا — بدون إنشاء حساب. أول تشخيص يستغرق أقل من خمس ثوانٍ.",
      "cta.button": "حلّل أول نبتة الآن",
      "cta.note": "خطة مجانية · 3 عمليات تحليل يوميًا · يعمل على أي متصفح هاتف",
      "footer.about": "تحليل أمراض النبات بالذكاء الاصطناعي للمزارعين والمهندسين الزراعيين والباحثين — تشخيص دقيق، علاج واضح، محصول أصح.",
      "footer.product": "المنتج",
      "footer.resources": "مصادر",
      "footer.r1": "مكتبة الأمراض",
      "footer.r2": "أدلة المحاصيل",
      "footer.r3": "تقرير الدقة",
      "footer.r4": "اطلب عرضًا توضيحيًا",
      "footer.contact": "تواصل",
      "footer.rights": "جميع الحقوق محفوظة.",
      "footer.note": "صفحة تجريبية — النتائج المعروضة أمثلة توضيحية.",
    },
  };

  const langToggle = $("#langToggle");
  const langLabel = $("#langLabel");
  let currentLang = "en";

  function setLanguage(lang) {
    currentLang = lang;
    const dir = lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    const nodes = $$("[data-i18n]");

    // Cache the original English string on first swap, before replacing text
    if (lang === "ar") {
      nodes.forEach((el) => {
        if (el.dataset.en == null) el.dataset.en = el.textContent;
      });
    }

    // Swap text content for every translatable node
    nodes.forEach((el) => {
      const value = lang === "en" ? el.dataset.en : translations.ar[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });

    langLabel.textContent = lang === "ar" ? "EN" : "عربي";
    langToggle.setAttribute(
      "aria-label",
      lang === "ar" ? "Switch language to English" : "Switch language to Arabic"
    );

    try {
      localStorage.setItem("leaflens-lang", lang);
    } catch (_) {
      /* storage unavailable — ignore */
    }
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLanguage(currentLang === "en" ? "ar" : "en");
    });

    // Restore saved preference (guarded so SSR/prerender never touches storage)
    let saved = null;
    try {
      saved = localStorage.getItem("leaflens-lang");
    } catch (_) {
      /* ignore */
    }
    if (saved === "ar") setLanguage("ar");
  }
})();

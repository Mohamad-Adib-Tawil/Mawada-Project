/* ============================================================
   swans — قالب «بحيرة البجع» (معرض عام، عربي بالكامل)
   ظرف زيتوني منقوش بختم شمعي → بطاقة عاجية بلوحة بجعتَي البحيرة
   وزنابق الكالا. مشتق من محرّك قالب zanbaq الـVIP المجرّب.
   المحتوى الحي (الأسماء، التاريخ، القاعة، البرنامج، التنويهات)
   من إعدادات الدعوة حين تصل، والافتراضي = محتوى استعراضي للمعاينة.
   ============================================================ */
(function () {
  var CFG = (window.__INVITE__ && window.__INVITE__.config) || {};
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }

  var TEXTS = (window.INVITATION && window.INVITATION.texts) || {};

  /* قيم الدعوة مع تجاهل قيم الـplaceholder */
  function val(v, ph) {
    v = (v == null ? "" : String(v)).trim();
    if (!v) return "";
    if (ph && v === ph) return "";
    return v;
  }
  /* البرنامج والتنويهات تصل مهرّبة من الخادم — نفكّ الترميز قبل textContent */
  function unesc(s) {
    var t = document.createElement("textarea");
    t.innerHTML = String(s == null ? "" : s);
    return t.value;
  }
  function setTxt(id, v) { var el = $(id); if (el && v != null && v !== "") el.textContent = v; }
  /* أرقام هندية للعدّاد وتاريخ الختام */
  var AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function toAr(s) { return String(s).replace(/[0-9]/g, function (d) { return AR_DIGITS[+d]; }); }

  /* ------- الأسماء -------
     اسم واحد لكل طرف (عربي عادةً، وأي حروف وصلت تُعرض كما هي). */
  (function fillNames() {
    var g = val(CFG.groom, "اسم العريس"), b = val(CFG.bride, "اسم العروس");
    if (g) setTxt("groomName", g);
    if (b) setTxt("brideName", b);
    /* أسماء الختام: الاسم الأول من كل طرف («&» بينهما كالواجهة) */
    function first(s) { return s.split(/\s+/)[0] || s; }
    var gN = $("groomName").textContent, bN = $("brideName").textContent;
    setTxt("closingNames", first(gN) + " & " + first(bN));
    /* عنوان التبويب وفق الأسماء الفعلية (المعاينة تُبقي عنوان القالب).
       لاحقة العنوان من TEXTS كي تصل مترجمة بالدعوات الكردية والإنكليزية */
    if (g || b) document.title = first(gN) + " & " + first(bN) + " — " + (TEXTS.titleSuffix || "دعوة زفاف");
  })();

  /* هل هذه دعوة حقيقية (بإعدادات محقونة) أم الاستعراض الثابت؟ */
  var IS_LIVE = !!(window.__INVITE__ && window.__INVITE__.config);

  /* ------- أهل العروسين -------
     الأسماء من المحرر. بالدعوة الحقيقية لا تبقى أسماء الاستعراض أبداً:
     الفارغ يمحو صفّه، والاثنان فارغان يخفيان الفقرة كلها (وحارس المنصّة
     يتكفّل بعدها بالتسميات المخصّصة ومفتاح إخفاء الأهل). */
  (function fillFamilies() {
    var box = $("familiesBox");
    if (!box) return;
    /* بالخطوبة تصير التسمية «والدا الخطيب/الخطيبة» — وتسمية الزبون المخصّصة
       من المحرر تعلو عليها لاحقاً (حارس المنصّة يعمل بعد هذا السكربت) */
    if (CFG.occasion === "engagement") {
      var labs = box.querySelectorAll(".family__label");
      if (labs[0]) labs[0].textContent = "والدا الخطيب";
      if (labs[1]) labs[1].textContent = "والدا الخطيبة";
    }
    if (!IS_LIVE) return;
    var g = val(CFG.groomParents), b = val(CFG.brideParents);
    var gRow = $("groomParents"), bRow = $("brideParents");
    if (gRow) gRow.textContent = g;
    if (bRow) bRow.textContent = b;
    if (!g && !b) { box.style.display = "none"; return; }
    if (!g && gRow) gRow.parentNode.style.display = "none";
    if (!b && bRow) bRow.parentNode.style.display = "none";
    if (!g || !b) {
      var orn = box.querySelector(".families__heart");
      if (orn) orn.style.display = "none";
    }
  })();

  /* ------- رقم التواصل (واتساب) — يظهر فقط حين يضبط الزبون رقماً ------- */
  (function buildContact() {
    var box = $("contactBox"), link = $("contactLink");
    if (!box || !link) return;
    var digits = val(CFG.contactPhone).replace(/[^0-9]/g, "");
    if (!digits) return;
    var lab = box.querySelector(".contact__label");
    if (lab && val(CFG.contactLabel)) lab.textContent = val(CFG.contactLabel);
    link.href = "https://wa.me/" + digits;
    link.textContent = "";
    var ic = document.createElement("span");
    ic.setAttribute("aria-hidden", "true");
    ic.textContent = "☎";
    link.appendChild(ic);
    link.appendChild(document.createTextNode(" " + (val(CFG.contactName) || val(CFG.contactPhone))));
    box.hidden = false;
  })();

  /* ------- النصوص الحرة من المحرر ------- */
  if (val(CFG.invitationText)) setTxt("requestAr", val(CFG.invitationText));
  if (val(CFG.verse)) setTxt("duaEl", val(CFG.verse));
  setTxt("venueEl", val(CFG.venueName));
  setTxt("addrEl", val(CFG.venueAddr));
  if (val(CFG.closingNote)) setTxt("blessEl", val(CFG.closingNote));
  /* سطر الترحيب أعلى الدعوة: heroSub من المحرر، أو صياغة نوع الحفل */
  (function heroWelcome() {
    var w = $("welcomeAr"), v = val(CFG.heroSub);
    if (!v && CFG.eventKind === "henna") v = TEXTS.welcomeHenna || "نتشرّف بحضوركم لحفل الحنّة";
    if (!v && CFG.eventKind === "nikah") v = TEXTS.welcomeNikah || "نتشرّف بحضوركم لعقد القِران";
    if (!w || !v) return;
    for (var i = 0; i < w.childNodes.length; i++) {
      var n = w.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.replace(/\s/g, "")) { n.nodeValue = " " + v + " "; break; }
    }
  })();

  /* ------- التاريخ والعدّ التنازلي -------
     السطر العربي من dateText (+ timeText)، وإلا يُبنى من الموعد نفسه
     بتقويم عربي — فلا يبقى تاريخ استعراضي فوق تاريخ الزبون أبداً. */
  var target = null;
  (function fillDate() {
    var dt = null, d = val(CFG.date);
    if (d) { var t = new Date(d); if (!isNaN(t.getTime())) { dt = t; target = t; } }
    if (!target) target = new Date(2027, 4, 7, 18, 0, 0); /* موعد استعراضي للمعاينة */
    var arLine = val(CFG.dateText) ? val(CFG.dateText) + (val(CFG.timeText) ? " — " + val(CFG.timeText) : "") : "";
    if (!arLine && dt) {
      try {
        arLine = new Intl.DateTimeFormat("ar-IQ", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(dt)
          + " — " + new Intl.DateTimeFormat("ar-IQ", { hour: "numeric", minute: "2-digit" }).format(dt);
      } catch (e) { /* يبقى سطر المعاينة */ }
    }
    if (arLine) { setTxt("dateAr", arLine); setTxt("dateBody", arLine); }
    if (dt) {
      /* تاريخ الختام ٠٧ · ٠٥ · ٢٠٢٧ بأرقام هندية */
      var day = dt.getDate(), mo = dt.getMonth() + 1;
      setTxt("closingDate", toAr((day < 10 ? "0" : "") + day) + " · " + toAr((mo < 10 ? "0" : "") + mo) + " · " + toAr(dt.getFullYear()));
    }
  })();
  /* ------- عنوان بطاقة الموعد («موعد الفرحة») -------
     نصّ حرّ من المحرر: dateKicker يبدّله، وإطفاء showDateKicker يحذفه
     كلياً فيبقى التاريخ وحده تحت الكسوة. الفارغ = نصّ القالب. */
  (function dateKicker() {
    var el = document.querySelector(".scratch__kicker");
    if (!el) return;
    if (CFG.showDateKicker === false) { el.style.display = "none"; return; }
    var t = val(CFG.dateKicker);
    if (t) el.textContent = t;
  })();

  /* ------- بطاقة مسح الموعد -------
     كسوة زيتونية على كانفاس تُمحى تحت الإصبع (destination-out)؛ حين
     ينكشف أكثر من نصفها تذوب كلها ويبقى التاريخ. بلا حركة/بلا كانفاس
     تُعرض مكشوفة من البداية — الموعد لا يُحجب عن أحد. */
  (function scratchDate() {
    var box = $("scratchBox"), cv = $("scratchCv");
    if (!box || !cv) return;
    if (REDUCED || !cv.getContext) { box.classList.add("is-started"); box.classList.add("is-revealed"); return; }
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var revealed = false, down = false, strokes = 0;
    function paintCoat() {
      var r = box.getBoundingClientRect();
      var W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#79765a"); g.addColorStop(.5, "#67654a"); g.addColorStop(1, "#565338");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      /* لمسة نقش أغصان خفيفة كورق الظرف */
      ctx.strokeStyle = "rgba(244,240,224,.14)"; ctx.lineWidth = 1;
      for (var i = 0; i < 14; i++) {
        var x = Math.random() * W, y = Math.random() * H;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 30 - Math.random() * 60, y + 18 - Math.random() * 36, x + 60 - Math.random() * 120, y + 30 - Math.random() * 60);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "destination-out";
    }
    paintCoat();
    addEventListener("resize", function () {
      if (revealed) return;
      ctx.globalCompositeOperation = "source-over";
      paintCoat();
    });
    function check() {
      try {
        var img = ctx.getImageData(0, 0, cv.width, cv.height).data;
        var clear = 0, total = 0;
        for (var i = 3; i < img.length; i += 96) { total++; if (img[i] < 40) clear++; }
        if (total && clear / total > .5) { revealed = true; box.classList.add("is-revealed"); }
      } catch (e) { revealed = true; box.classList.add("is-revealed"); }
    }
    function scratch(e) {
      var r = cv.getBoundingClientRect();
      ctx.beginPath();
      ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, Math.PI * 2);
      ctx.fill();
      box.classList.add("is-started");
      if (++strokes % 8 === 0) check();
    }
    cv.addEventListener("pointerdown", function (e) {
      down = true;
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      scratch(e);
    });
    cv.addEventListener("pointermove", function (e) { if (down) scratch(e); });
    addEventListener("pointerup", function () { down = false; if (!revealed) check(); });
  })();

  function two(n) { return (n < 10 ? "0" : "") + n; }
  (function countdown() {
    var row = document.querySelector(".count__row");
    function tick() {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        if (row) row.style.display = "none";
        var done = $("countDone"); if (done) done.hidden = false;
        return;
      }
      var s = Math.floor(diff / 1000);
      setTxt("cD", toAr(two(Math.floor(s / 86400))));
      setTxt("cH", toAr(two(Math.floor(s % 86400 / 3600))));
      setTxt("cM", toAr(two(Math.floor(s % 3600 / 60))));
      setTxt("cS", toAr(two(s % 60)));
      setTimeout(tick, 1000);
    }
    tick();
  })();

  /* ------- برنامج الحفل -------
     الافتراضي عربي (وقت + فقرة)، وإن عدّله الزبون من المحرر نعرض ما كتب. */
  (function buildProgram() {
    var list = $("schedList");
    if (!list) return;
    var rows = [];
    if (Array.isArray(CFG.program) && CFG.program.length) {
      for (var i = 0; i < CFG.program.length && i < 10; i++) {
        var p = CFG.program[i] || {};
        var tm = unesc(p.time), tt = unesc(p.title);
        if (tm || tt) rows.push([tm, tt]);
      }
    }
    if (!rows.length) rows = TEXTS.program || [];
    for (var j = 0; j < rows.length; j++) {
      var row = document.createElement("div"); row.className = "srow";
      var timeEl = document.createElement("time"); timeEl.textContent = rows[j][0] || "";
      row.appendChild(timeEl);
      var tEl = document.createElement("span"); tEl.className = "sched__t"; tEl.textContent = rows[j][1] || "";
      row.appendChild(tEl);
      list.appendChild(row);
    }
  })();

  /* ------- الخريطة المدمجة + زر الخرائط — فقط حين يضبط الزبون رابطاً ------- */
  function mapEmbedSrc(url, fallbackQuery) {
    var q = "";
    if (url) {
      try {
        var u = new URL(url, location.href);
        if (/(^|\.)google\.[a-z.]+$|(^|\.)maps\.app\.goo\.gl$/i.test(u.hostname)) {
          q = u.searchParams.get("query") || u.searchParams.get("q") || "";
          if (!q) { var m = (u.pathname + u.search).match(/@(-?\d+\.\d+),(-?\d+\.\d+)/); if (m) q = m[1] + "," + m[2]; }
          if (!q) { var pm = u.pathname.match(/\/place\/([^/]+)/); if (pm) q = decodeURIComponent(pm[1].replace(/\+/g, " ")); }
        }
      } catch (e) { /* رابط غير صالح */ }
    }
    if (!q) q = fallbackQuery || "";
    if (!q) return "";
    return "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&z=15&output=embed";
  }
  (function buildMap() {
    var wrap = $("mapWrap");
    if (!wrap) return;
    var userUrl = val(CFG.mapUrl);
    var mb = $("mapBtn");
    if (mb && userUrl) { mb.href = userUrl; mb.hidden = false; }
    var src = mapEmbedSrc(userUrl, TEXTS.mapQuery || "");
    if (!src) return;
    var f = document.createElement("iframe");
    f.src = src;
    f.loading = "lazy";
    f.title = TEXTS.mapTitle || "خريطة";
    f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    f.setAttribute("allowfullscreen", "");
    wrap.appendChild(f);
    wrap.classList.add("on");
  })();

  /* ------- التنويهات (من المحرر) ------- */
  (function buildNotes() {
    var sec = $("notesSec"), list = $("notesList");
    if (!sec || !list) return;
    var notes = Array.isArray(CFG.notes) ? CFG.notes : [];
    for (var i = 0; i < notes.length && i < 8; i++) {
      var s = unesc(notes[i]); if (!s) continue;
      var li = document.createElement("li"); li.textContent = s;
      list.appendChild(li);
    }
    if (list.children.length || sec.querySelector(".da3wa-note, [id^='da3wa']")) sec.hidden = false;
  })();

  /* ------- بوابة الظرف (فيديو الدخولية) -------
     الظرف ينفتح بالفيديو وتصعد اللوحة المنقوشة؛ عند نهايته تذوب البوابة
     عن الواجهة التي تحمل اللوحة نفسها — تصل عاجيةً ثم تدبّ فيها الحياة
     ملوّنةً (بنزع hero-pre)، فيبدو الانتقال امتداداً للفيديو لا قطعاً عنه. */
  (function setupGate() {
    var gate = $("gate");
    if (!gate) return;
    var vid = $("gateVid");
    var opened = false, revealed = false;

    /* ------- تحميل قبل الفتح (نمط كلاسيك) -------
       لا يُفتح الظرف قبل جاهزية الفيديو: نسبة من buffered/‏readyState،
       ومهلة أمان تفتح مهما كان — شبكة متعثرة لا تحبس دعوة. */
    var vidReady = REDUCED || !vid;
    (function loaderGate() {
      var txt = $("gateLoadTxt"), bar = $("gateLoadBar"), load = $("gateLoad");
      function hideLoader() { if (load) load.classList.add("is-gone"); }
      if (vidReady) { hideLoader(); gate.classList.add("is-ready"); return; }
      /* القياس شيء والعرض شيء آخر. vid.buffered دالّة درجية لا خطّ متدرّج:
         تبقى صفراً حتى يقرأ المتصفح رأس الملف، ثم تقفز إلى ١٠٠ لحظة
         readyState=4 — وdone() كانت تُخفي المستطيل في اللحظة نفسها، فيرى
         الضيف «٠٪» ثابتة ثم يختفي المستطيل بلا أن يمتلئ ولو مرّة. الآن
         measured() يقيس وshown يصعد نحوه بنعومة ولا ينزل، ولا يُخفى المستطيل
         إلا بعد أن يُرى ممتلئاً. والجهوزية لا تنتظره: الباب يُفتح فور وصولها. */
      var shown = 0, settled = false, startedAt = Date.now(), watch = null;
      function measured() {
        if (settled) return 100;
        try {
          if (vid.readyState >= 4) return 100;
          var d = vid.duration, m = 0;
          if (isFinite(d) && d > 0 && vid.buffered && vid.buffered.length) {
            for (var i = 0; i < vid.buffered.length; i++) m = Math.max(m, vid.buffered.end(i));
            return Math.min(99, m / d * 100);
          }
        } catch (e) { /* يسقط على الزحف الزمني */ }
        /* لا قياس بعد — تقدّم زمني حتى ٩٠٪ كي لا يتجمّد المستطيل على صفر */
        return Math.min(90, (Date.now() - startedAt) / 9000 * 90);
      }
      function paint() {
        var p = Math.round(shown);
        /* بعد ضغطة محفوظة (انظر open) يقول النصّ إن الفتح جارٍ لا التجهيز */
        if (txt) txt.textContent = (wanted ? (TEXTS.opening || "جارٍ الفتح…") : (TEXTS.loading || "جارٍ تجهيز الدعوة…")) + " " + toAr(p) + "٪";
        if (bar) bar.style.width = shown.toFixed(1) + "%";
      }
      /* صعود مُخفَّف بوحدة زمنية لا بوحدة إطار: يبلغ ١٠٠٪ في ٨٠٠ms تقريباً مهما
         كان معدّل الإطارات، فحتى القفزة المفاجئة تُرى امتلاءً لا وميضاً */
      var lastStep = 0;
      function step() {
        if (opened) return;
        var t = measured(), now = Date.now();
        var frames = lastStep ? Math.min(6, (now - lastStep) / 16.7) : 1;   /* لا قفزة بعد تجمّد التبويب */
        lastStep = now;
        if (t > shown) shown = Math.min(t, shown + Math.max(0.38, (t - shown) * 0.10) * frames);
        paint();
        if (shown >= 100) { hideLoader(); return; }
        requestAnimationFrame(step);
      }
      function done() {
        settled = true;
        if (watch) { clearInterval(watch); watch = null; }
        if (vidReady) return;
        vidReady = true;
        gate.classList.add("is-ready");
        if (wanted) open();   /* ضغطة محفوظة تنتظر الجهوزية — تُنفَّذ الآن */
      }
      /* مراقبة الجهوزية بمؤقّت لا بـrAF: rAF يتجمّد في التبويب المخفيّ،
         والباب يجب أن يصير جاهزاً حتى لو غاب الضيف عن الصفحة لحظة. */
      watch = setInterval(function () { if (vid.readyState >= 3) done(); }, 100);
      vid.addEventListener("canplaythrough", done, { once: true });
      vid.addEventListener("error", done, { once: true }); /* فشل التحميل → نفتح ويتكفّل fallback الفتح */
      setTimeout(done, 12000); /* مهلة أمان */
      /* لا نُعيد تحميلاً جارياً: load() تُلقي ما نزل وتبدأ من الصفر */
      try { if (vid.readyState === 0 && vid.networkState !== 2) vid.load(); } catch (e) {}
      step();
    })();
    /* اللوحة تنتظر خلف البوابة بحالة النقش العاجي (الدعوة مخفية فلا يُرى ذلك).
       الاستعراض الثابت بلا بوابة يبقى ملوّناً — الصنف يُضاف هنا فقط. */
    var siteEl = $("site");
    if (siteEl && !REDUCED) siteEl.classList.add("hero-pre");

    function reveal() {
      if (revealed) return; revealed = true;
      document.body.classList.remove("locked");
      var site = $("site");
      if (site) {
        site.setAttribute("aria-hidden", "false");
        site.classList.add("opened");
        /* نزع حالة النقش العاجي = اللوحة تتلوّن وتتمدّد (والوضع الافتراضي
           ملوّن أصلاً، فلو جمّد المتصفح الانتقال ظهرت صحيحة فوراً).
           مؤقّت لا rAF فقط: rAF يتجمّد في التبويبات المخفية فتبقى باهتة. */
        var unpre = function () { site.classList.remove("hero-pre"); };
        requestAnimationFrame(unpre);
        setTimeout(unpre, 80);
      }
      gate.classList.add("is-done");
      gate.style.transition = "opacity 1.1s ease";
      gate.style.opacity = "0";
      setTimeout(function () { gate.style.display = "none"; }, 1200);
      /* شبكة أمان: لو جمّد المتصفح أنيميشن الظهور المتدرّج نفرضه كاملاً */
      setTimeout(function () { if (site) site.classList.add("rv-done"); }, 4200);
    }

    /* ⚠️ الضغطة قبل جهوزية الفيديو لا تُبتلع. كانت تُتجاهَل بصمت حتى يجهز الفيديو
       (وآيفون لا يحمّله قبل اللمسة، فلا يجهز إلا بمهلة الأمان ١٢ث) — بينما تصل
       اللمسة مستمعَ الموسيقى فتنطلق الأغنية والباب ساكن، فيضغط الضيف ثانيةً بعد
       حين (شكوى ٢٠٢٦-٠٩-٢٢). الآن تُحفَظ الضغطة: تسليم الأغنية (يلزمه لمسة حيّة)
       يقع فوراً، والتحميل يُطلق داخل اللمسة، ويُفتح الباب لحظة الجهوزية (done) —
       أو بعد ثانيتين ونصف مهما كان، فلا ينتظر الضيف ما لن يأتي. */
    var wanted = false, gestureDone = false;
    function open() {
      if (opened) return;
      if (!gestureDone) {
        gestureDone = true;
        if (window.__da3waMusicGo) { try { window.__da3waMusicGo(); } catch (e) {} }
      }
      if (!vidReady) {
        if (wanted) return;
        wanted = true;
        gate.classList.add("is-waiting");
        try { if (vid && vid.readyState === 0 && vid.networkState !== 2) vid.load(); } catch (e) {}
        setTimeout(function () { if (!opened) { vidReady = true; open(); } }, 2500);
        return;
      }
      opened = true;
      gate.classList.add("is-playing"); /* النصوص تذوب ويظهر الفيديو */
      if (vid && !REDUCED) {
        vid.addEventListener("ended", reveal, { once: true });
        vid.addEventListener("error", reveal, { once: true });
        var p = vid.play();
        if (p && p.catch) p.catch(reveal); /* تعذّر التشغيل → دخول مباشر */
        /* الفيديو يبقى شفّافاً حتى يُعرض أول إطار منه فعلاً (is-live): بين play() وأول إطار
           يرسم آيفون طبقة الفيديو سوداء لجزء من الثانية فوق الملصق — وخلفيةٌ خلفه لا تنفع. */
        (function revealOnFirstFrame(v) {
          var live = false;
          function go() { if (live) return; live = true; v.classList.add("is-live"); }
          if (typeof v.requestVideoFrameCallback === "function") v.requestVideoFrameCallback(go);
          else v.addEventListener("timeupdate", function onTime() { if (v.currentTime > 0.03) { v.removeEventListener("timeupdate", onTime); go(); } });
          v.addEventListener("playing", function () { setTimeout(go, 700); }, { once: true });   /* احتياط إن لم يُبلَّغ عن الإطار */
        })(vid);
        /* الفيديو ٦٫٣ث — نكشف قبيل نهايته بقليل فيتداخل الذوبان مع استقرار اللوحة */
        setTimeout(reveal, 5800);
      } else {
        setTimeout(reveal, REDUCED ? 60 : 500);
      }
    }
    gate.addEventListener("click", open);
    gate.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") open(); });
  })();

  /* التمرير التلقائي أُزيل بقرار كرار — يرجع لاحقاً كميزة تُفعّل من المحرر */

  /* ------- الأوركيدة تنزلق على خيط البرنامج مع التمرير -------
     موضعها على الخيط = موضع القسم من الشاشة، فتنزل مع نزول الضيف
     وتصعد مع صعوده. تُحدَّث داخل rAF فلا تُثقل التمرير. */
  (function setupOrchid() {
    var list = $("schedList"), orchid = $("schedOrchid");
    if (!list || !orchid) return;
    var ticking = false;
    function place() {
      ticking = false;
      var r = list.getBoundingClientRect();
      if (r.height <= 0) return;
      /* نقطة القياس منتصف الشاشة تقريباً: كم قطع الخيط منها */
      var p = (innerHeight * 0.52 - r.top) / r.height;
      p = Math.max(0.03, Math.min(0.97, p));
      orchid.style.top = (p * 100).toFixed(2) + "%";
    }
    addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(place); }
    }, { passive: true });
    addEventListener("resize", place);
    place();
  })();

  /* ------- ظهور الأقسام مع التمرير ------- */
  (function setupReveal() {
    var items = document.querySelectorAll(".creveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px 16% 0px" });
    items.forEach(function (el) { obs.observe(el); });
  })();

  /* ------- موسيقى المعاينة الثابتة -------
     الدعوة الحقيقية تأخذ موسيقاها من إعداداتها (تحقنها المنصّة). الاستعراض
     الثابت بلا إعدادات فيبقى صامتاً — نشغّل هنا أغنية معاينة مناسبة،
     وتُلغى تماماً على أي دعوة حقيقية. */
  var PREVIEW_MUSIC = "OcSMzzi0GH4"; /* لا إله إلا الله — حسين الجسمي */
  (function previewMusic() {
    var isLive = !!(window.__INVITE__ && window.__INVITE__.config) || !!document.getElementById("da3wa-music");
    if (isLive || !PREVIEW_MUSIC) return;

    /* نفس مسار المنصّة: IFrame API، تشغيل صامت تلقائي (مسموح بلا لمسة)،
       ثم فكّ الكتم داخل لمسة فتح الظرف — الأوثق على iOS */
    var host = document.createElement("div");
    host.id = "swPvYt";
    host.style.cssText = "position:fixed;left:-9999px;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none";
    host.setAttribute("aria-hidden", "true");
    document.body.appendChild(host);

    /* نفس معرّف زرّ المنصّة: قاعدة تموضعه فوق البوابة تخدم الاثنين بلا تكرار */
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "da3wa-music";
    btn.setAttribute("aria-label", "الموسيقى");
    btn.textContent = "🔇";
    btn.style.cssText = "position:fixed;inset-inline-start:16px;bottom:16px;z-index:60;width:50px;height:50px;"
      + "border-radius:50%;border:none;cursor:pointer;background:rgba(255,255,255,.92);"
      + "box-shadow:0 8px 22px rgba(0,0,0,.22);font-size:22px;display:grid;place-items:center;line-height:1";
    document.body.appendChild(btn);

    var player, ready = false, gestured = false, audible = false, tries = 0;
    function paint() { btn.textContent = audible ? "🔊" : "🔇"; }
    function loud() {
      if (!ready) return false;
      try { player.unMute(); player.setVolume(70); player.playVideo(); } catch (e) { return false; }
      var m = true; try { m = player.isMuted(); } catch (e) {}
      if (!m) { audible = true; paint(); return true; }
      return false;
    }
    function pump() {
      if (audible || !gestured) return;
      if (loud()) return;
      if (tries++ < 30) setTimeout(pump, 120);
    }
    window.__da3waMusicGo = function () { gestured = true; pump(); };
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("swPvYt", {
        videoId: PREVIEW_MUSIC,
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, loop: 1,
          playlist: PREVIEW_MUSIC, playsinline: 1, modestbranding: 1, rel: 0 },
        events: { onReady: function () {
          ready = true;
          try { player.mute(); player.playVideo(); } catch (e) {}
          pump();
        } }
      });
    };
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); gestured = true;
      if (audible) { try { player.pauseVideo(); } catch (er) {} audible = false; paint(); }
      else pump();
    });
    document.addEventListener("click", window.__da3waMusicGo);
    document.addEventListener("touchstart", window.__da3waMusicGo, { passive: true });
  })();

  /* ------- كتلة معاينة تأكيد الحضور -------
     تشرح مكان النموذج على الاستعراض الثابت فقط. أي دعوة حقيقية
     (لها __INVITE__.config) أو أي صفحة حُقن فيها قسم المنصّة تحذفها فوراً،
     فلا يرى ضيفٌ نموذجين أبداً. */
  (function previewOnlyRsvp() {
    var el = $("rsvpPreview");
    if (!el) return;
    var isLive = !!(window.__INVITE__ && window.__INVITE__.config) || !!document.getElementById("da3wa-rsvp");
    if (isLive && el.parentElement) el.parentElement.removeChild(el);
  })();

  /* ------- التوقيع إلى آخر الصفحة (بعد الأقسام المحقونة) ------- */
  (function moveCredit() {
    var cr = $("creditFoot");
    if (cr && cr.parentElement) cr.parentElement.appendChild(cr);
  })();
})();

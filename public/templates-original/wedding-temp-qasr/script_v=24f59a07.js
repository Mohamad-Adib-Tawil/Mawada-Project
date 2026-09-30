/* ============================================================
   qasr — قالب «قَصر» (VIP، عربي)
   فيلم كرار (جدار ورد أبيض ينشقّ عن النور) دخوليةً → النور يذوب إلى
   لوحة القصر → نافذة مقنطرة → ممرّ الحديقة → ميدالية العروسين.
   المحتوى الحيّ (الأسماء، التاريخ، القاعة، البرنامج، التنويهات)
   من إعدادات الدعوة حين تصل، والافتراضي محتوى استعراضي للمعاينة.
   المحرّك مشتقّ من قالب warda المجرّب، مع ميل اللوحة ورشّة اللمس.
   ============================================================ */
(function () {
  var CFG = (window.__INVITE__ && window.__INVITE__.config) || {};
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }

  var TEXTS = {};
  try { TEXTS = JSON.parse($("qasrTexts").textContent); } catch (e) { /* تبقى فارغة */ }

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

  /* هل هذه دعوة حقيقية (بإعدادات محقونة) أم الاستعراض الثابت؟ */
  var IS_LIVE = !!(window.__INVITE__ && window.__INVITE__.config);

  /* ------- الكتل الاستعراضية (نموذج تأكيد الحضور الشكلي وعيّنة الملاحظة البارزة) -------
     تشرح الكسوة على الاستعراض الثابت فقط. أي دعوة حقيقية، أو أي صفحة حُقن
     فيها قسم من المنصّة، تحذفها فوراً — فلا يرى ضيفٌ نموذجين أبداً. */
  (function dropDemoBlocks() {
    var live = IS_LIVE || !!$("da3wa-rsvp") || !!$("da3wa-note") || !!$("da3wa-cal");
    if (!live) return;
    var els = document.querySelectorAll("[data-demo]");
    for (var i = els.length - 1; i >= 0; i--) if (els[i].parentNode) els[i].parentNode.removeChild(els[i]);
  })();

  /* ------- الأسماء ------- */
  (function fillNames() {
    var g = val(CFG.groom, "اسم العريس"), b = val(CFG.bride, "اسم العروس");
    if (g) setTxt("groomName", g);
    if (b) setTxt("brideName", b);
    function first(s) { return s.split(/\s+/)[0] || s; }
    var gN = $("groomName").textContent, bN = $("brideName").textContent;
    setTxt("closingNames", first(gN) + " & " + first(bN));
    /* عنوان التبويب وفق الأسماء الفعلية (المعاينة تُبقي عنوان القالب) */
    if (g || b) document.title = first(gN) + " & " + first(bN) + " — " + (TEXTS.titleSuffix || "دعوة زفاف");
  })();

  /* ------- أهل العروسين -------
     الأسماء من المحرر. بالدعوة الحقيقية لا تبقى أسماء الاستعراض أبداً:
     الفارغ يمحو صفّه، والاثنان فارغان يخفيان الفقرة كلها (وحارس المنصّة
     يتكفّل بعدها بالتسميات المخصّصة ومفتاح إخفاء الأهل). */
  (function fillFamilies() {
    var box = $("familiesBox");
    if (!box) return;
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
      box.classList.add("families--one"); /* الشبكة من ثلاثة أعمدة إلى عمود */
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
    link.href = val(CFG.contactUrl) || ("https://wa.me/" + digits);
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
  setTxt("venueEl", val(CFG.venueName, "اسم القاعة"));
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
      var day = dt.getDate(), mo = dt.getMonth() + 1;
      setTxt("closingDate", toAr((day < 10 ? "0" : "") + day) + " · " + toAr((mo < 10 ? "0" : "") + mo) + " · " + toAr(dt.getFullYear()));
    }
  })();

  /* ------- عنوان بطاقة الموعد («موعد الفرحة») ------- */
  (function dateKicker() {
    var el = $("dateKicker");
    if (!el) return;
    if (CFG.showDateKicker === false) { el.style.display = "none"; return; }
    var t = val(CFG.dateKicker);
    if (t) el.textContent = t;
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

  /* ------- التقويم: شهر الموعد كاملاً واليوم بدائرة -------
     على الدعوة الحقيقية تحقن المنصّة بطاقة «احفظ الموعد» (#da3wa-cal) —
     نخفيها (CSS) ونأخذ منها اسم الشهر واليوم والوقت كما تبنيها هي (فتتبع
     خيارات المحرر مثل أسماء الأشهر) وزرَّي تقويم الهاتف. غيابها على دعوة
     حقيقية = الزبون أطفأ التقويم من المحرر، فيُخفى قسمنا أيضاً. الاستعراض
     الثابت يبني كل شيء من موعد المعاينة. الأسبوع يبدأ بالسبت كتقاويم المنطقة. */
  (function buildCalendar() {
    var sec = $("calSec"), grid = $("calGrid");
    if (!sec || !grid) return;
    var plat = $("da3wa-cal");
    if (IS_LIVE && !plat) { sec.hidden = true; return; }
    var y = target.getFullYear(), m = target.getMonth(), d = target.getDate();
    var monthName = (TEXTS.months || [])[m] || "";
    var yearTxt = toAr(y);
    var wdName = (TEXTS.days || [])[target.getDay()] || "";
    var timeTxt = val(CFG.timeText);
    if (plat) {
      var top = plat.querySelector(".cal-top"), wd = plat.querySelector(".cal-wd"), tm = plat.querySelector(".cal-time");
      if (top) {
        var mt = top.textContent.trim().match(/^(.*?)\s*(\d{4})\s*$/);
        if (mt) { monthName = mt[1]; yearTxt = toAr(mt[2]); }
      }
      if (wd && wd.textContent.trim()) wdName = wd.textContent.trim();
      if (tm && tm.textContent.trim()) timeTxt = tm.textContent.trim();
    }
    setTxt("calMonth", (monthName + " " + yearTxt).trim());

    var short = TEXTS.dayShort || ["س", "ح", "ن", "ث", "ر", "خ", "ج"];
    for (var i = 0; i < 7; i++) {
      var h = document.createElement("span"); h.className = "cal__wd"; h.textContent = short[i]; grid.appendChild(h);
    }
    var first = new Date(y, m, 1).getDay();  /* ٠ = الأحد … ٦ = السبت */
    var pad = (first + 1) % 7;               /* إزاحة أول الشهر عن السبت */
    var days = new Date(y, m + 1, 0).getDate();
    for (var p = 0; p < pad; p++) {
      var e = document.createElement("span"); e.className = "cal__day cal__day--pad"; grid.appendChild(e);
    }
    for (var dd = 1; dd <= days; dd++) {
      var c = document.createElement("span");
      c.className = "cal__day" + (dd === d ? " cal__day--event" : "");
      c.textContent = toAr(dd);
      if (dd === d) c.setAttribute("aria-label", "يوم المناسبة");
      grid.appendChild(c);
    }
    var line = wdName ? "يوم " + wdName : "";
    if (timeTxt) line += (line ? " — " : "") + timeTxt;
    var ln = $("calLine");
    if (ln) { if (line) ln.textContent = line; else ln.hidden = true; }

    /* زرّا تقويم الهاتف: من بطاقة المنصّة على الدعوة الحقيقية */
    var btns = $("calBtns"), foot = $("calFoot");
    if (plat && btns) {
      var links = plat.querySelectorAll(".cal-btns a");
      btns.textContent = "";
      for (var k = 0; k < links.length; k++) {
        var a = links[k].cloneNode(true); a.className = "cal__btn"; btns.appendChild(a);
      }
      if (!links.length && foot) foot.hidden = true;
    }
  })();

  /* ------- برنامج الحفل ------- */
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
    if (!IS_LIVE && !notes.length) notes = TEXTS.demoNotes || []; /* عيّنات المعاينة فقط */
    for (var i = 0; i < notes.length && i < 8; i++) {
      var s = unesc(notes[i]); if (!s) continue;
      var li = document.createElement("li"); li.textContent = s;
      list.appendChild(li);
    }
    if (list.children.length || sec.querySelector("#da3wa-note, #qasrNoteDemo, [id^='da3wa']")) sec.hidden = false;
  })();

  /* ------- البتلات البيضاء -------
     تتساقط على طول الصفحة امتداداً لبتلات الفيلم، وأي لمسة ترشّ حزمة
     منها من مكان الإصبع. شفافة وصغيرة فلا تزاحم النص، وتتوقّف تماماً
     حين تكون الصفحة مخفية فلا تستهلك بطارية بلا فائدة. */
  var burstAt = function () {};
  (function petalFall() {
    var cv = $("petals");
    if (!cv || REDUCED || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, petals = [], sparks = [], raf = null;
    var TINTS = ["#ffffff", "#fbf8f0", "#f3ecdc", "#fdfcf8"];

    function resize() {
      W = innerWidth; H = innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var want = Math.min(28, Math.round(W / 24));
      while (petals.length < want) petals.push(make(true));
      petals.length = want;
    }
    function make(spread) {
      return {
        x: Math.random() * W,
        y: spread ? Math.random() * H : -20,
        r: 4 + Math.random() * 6,          /* نصف الطول */
        vy: .26 + Math.random() * .5,
        sway: .5 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * .022,
        rot: Math.random() * Math.PI,
        a: .5 + Math.random() * .35,
        c: TINTS[(Math.random() * TINTS.length) | 0]
      };
    }
    function petal(p, alpha) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.c;
      /* ظلّ خفيف: البتلة البيضاء لا تُرى على ورق فاتح بلا حافّة */
      ctx.shadowColor = "rgba(82, 89, 63, .45)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;
      /* بتلة: قوسان يلتقيان بطرفين — لا دائرة، فتُقرأ وردةً لا فقاعة */
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * .95, -p.r * .5, p.r * .8, p.r * .6, 0, p.r);
      ctx.bezierCurveTo(-p.r * .8, p.r * .6, -p.r * .95, -p.r * .5, 0, -p.r);
      ctx.fill();
      ctx.restore();
    }
    function draw() {
      raf = null;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < petals.length; i++) {
        var p = petals[i];
        p.y += p.vy;
        p.phase += .012;
        p.x += Math.sin(p.phase) * p.sway * .5;
        p.rot += p.spin;
        if (p.y > H + 24) { petals[i] = make(false); continue; }
        petal(p, p.a);
      }
      /* حزم اللمس: تنطلق بقوّة ثم تهدأ وتهبط وتذوب */
      for (var k = sparks.length - 1; k >= 0; k--) {
        var s = sparks[k];
        s.life -= .012;
        if (s.life <= 0) { sparks.splice(k, 1); continue; }
        s.vx *= .965; s.vy = s.vy * .965 + .05;
        s.x += s.vx; s.y += s.vy; s.rot += s.spin;
        petal(s, Math.min(1, s.life * 1.6) * .9);
      }
      loop();
    }
    function loop() { if (!document.hidden && !raf) raf = requestAnimationFrame(draw); }
    burstAt = function (x, y, n) {
      if (document.hidden) return;
      for (var i = 0; i < (n || 14); i++) {
        var ang = Math.random() * Math.PI * 2, sp = 2.2 + Math.random() * 3.4;
        sparks.push({
          x: x, y: y, r: 4 + Math.random() * 5,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.4,
          rot: Math.random() * Math.PI, spin: (Math.random() - .5) * .18,
          life: 1, c: TINTS[(Math.random() * TINTS.length) | 0]
        });
      }
      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
      loop();
    };
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else loop();
    });
    resize();
    loop();
  })();

  /* أي نقرة على الصفحة (لا على زرّ أو حقل أو رابط) ترشّ بتلات من مكانها.
     click لا pointerdown: التمرير بالإصبع لا يُطلق click فلا ترشّ مع كل سحبة */
  (function tapBurst() {
    if (REDUCED) return;
    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("locked")) return;
      var t = e.target;
      if (t && t.closest && t.closest("a, button, input, textarea, select, label, iframe, #da3wa-music")) return;
      burstAt(e.clientX, e.clientY, 14);
    }, { passive: true });
  })();

  /* ------- ميل اللوحة مع الجهاز (gyro) أو الفأرة -------
     إزاحة صغيرة على الواجهة فقط: تُقرأ «نافذة حيّة» لا رسمة ثابتة.
     إذن حسّاس الحركة على آيفون يُطلَب داخل لمسة فتح البوابة (انظر open). */
  var tilt = (function () {
    var art = $("heroArt"), hero = $("heroSec");
    var tx = 0, ty = 0, gx = 0, gy = 0, raf = null, on = false;
    if (!art || !hero || REDUCED) return { arm: function () {}, ask: function () {} };
    function paint() {
      raf = null;
      tx += (gx - tx) * .12; ty += (gy - ty) * .12;
      art.style.setProperty("--tx", tx.toFixed(2) + "px");
      art.style.setProperty("--ty", ty.toFixed(2) + "px");
      if (Math.abs(gx - tx) > .05 || Math.abs(gy - ty) > .05) raf = requestAnimationFrame(paint);
    }
    function set(x, y) {
      /* لا نُحرّك اللوحة وهي خارج الشاشة */
      var r = hero.getBoundingClientRect();
      if (r.bottom < 0) return;
      gx = Math.max(-16, Math.min(16, x)); gy = Math.max(-12, Math.min(12, y));
      if (!raf) raf = requestAnimationFrame(paint);
    }
    function onOrient(e) {
      if (e.gamma == null || e.beta == null) return;
      /* gamma: ميل يمين/يسار ±٩٠، beta: أمام/خلف؛ نطرح ٤٥° (وضع اليد الطبيعي) */
      set(-(e.gamma / 45) * 14, -((e.beta - 45) / 45) * 10);
    }
    function onMouse(e) {
      set(-((e.clientX / innerWidth) - .5) * 24, -((e.clientY / innerHeight) - .5) * 16);
    }
    function arm() {
      if (on) return; on = true;
      if ("ontouchstart" in window) addEventListener("deviceorientation", onOrient, { passive: true });
      else addEventListener("mousemove", onMouse, { passive: true });
    }
    /* iOS 13+: الإذن يُطلَب من داخل لمسة المستخدم وإلا رُفض بصمت */
    function ask() {
      try {
        var D = window.DeviceOrientationEvent;
        if (D && typeof D.requestPermission === "function") {
          D.requestPermission().then(function (st) { if (st === "granted") arm(); }).catch(function () {});
        } else arm();
      } catch (e) { arm(); }
    }
    return { arm: arm, ask: ask };
  })();

  /* ------- بوابة الفيلم -------
     الفيلم يشقّ جدار الورد الأبيض عن النور، وعند آخره يطغى توهّج أبيض
     تذوب منه البوابة عن الواجهة التي تصل مغمورةً بالضوء ثم تهدأ —
     فيبدو الانتقال «من النور إلى الحديقة» لا قطعاً بين مشهدين. */
  (function setupGate() {
    var gate = $("gate");
    if (!gate) return;
    var vid = $("gateVid");
    var opened = false, revealed = false;

    /* لا يُفتح قبل جاهزية الفيديو: نسبة من buffered/‏readyState،
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
      vid.addEventListener("error", done, { once: true });
      setTimeout(done, 12000); /* مهلة أمان */
      /* لا نُعيد تحميلاً جارياً: load() تُلقي ما نزل وتبدأ من الصفر */
      try { if (vid.readyState === 0 && vid.networkState !== 2) vid.load(); } catch (e) {}
      step();
    })();

    /* اللوحة تنتظر خلف البوابة مغمورةً بالضوء (الدعوة مخفية فلا يُرى ذلك).
       الاستعراض الثابت بلا بوابة يبقى طبيعياً — الصنف يُضاف هنا فقط. */
    var siteEl = $("site");
    if (siteEl && !REDUCED) siteEl.classList.add("hero-pre");

    function reveal() {
      if (revealed) return; revealed = true;
      gate.classList.add("is-bloom");            /* التوهّج الأبيض يطغى */
      document.body.classList.remove("locked");
      var site = $("site");
      if (site) {
        site.setAttribute("aria-hidden", "false");
        site.classList.add("opened");
        /* نزع الحالة المغمورة = اللوحة تهدأ وتتلوّن. مؤقّت لا rAF فقط:
           rAF يتجمّد في التبويبات المخفية فتبقى الواجهة مغمورة. */
        var unpre = function () { site.classList.remove("hero-pre"); };
        setTimeout(unpre, 380);
        /* بعد استقرار اللوحة تتبع الميل بسرعة */
        setTimeout(function () { site.classList.add("is-live"); }, 3300);
      }
      setTimeout(function () {
        gate.classList.add("is-done");
        gate.style.transition = "opacity 1.3s ease";
        gate.style.opacity = "0";
        /* رشّة بتلات من قلب النور لحظة انكشاف اللوحة */
        burstAt(innerWidth / 2, innerHeight * .42, 22);
      }, 520);
      setTimeout(function () { gate.style.display = "none"; }, 2000);
      /* شبكة أمان: لو جمّد المتصفح أنيميشن الظهور المتدرّج نفرضه كاملاً */
      setTimeout(function () { if (site) site.classList.add("rv-done"); }, 4800);
    }

    /* ⚠️ الضغطة قبل جهوزية الفيديو لا تُبتلع. كانت تُتجاهَل بصمت حتى يجهز الفيديو
       (وآيفون لا يحمّله قبل اللمسة، فلا يجهز إلا بمهلة الأمان ١٢ث) — بينما تصل
       اللمسة مستمعَ الموسيقى فتنطلق الأغنية والباب ساكن، فيضغط الضيف ثانيةً بعد
       حين (شكوى ٢٠٢٦-٠٩-٢٢). الآن تُحفَظ الضغطة: ما يلزمه لمسة حيّة (إذن الميل،
       تسليم الأغنية) يقع فوراً، والتحميل يُطلق داخل اللمسة، ويُفتح الباب لحظة
       الجهوزية (done) — أو بعد ثانيتين ونصف مهما كان، فلا ينتظر الضيف ما لن يأتي. */
    var wanted = false, gestureDone = false;
    function open() {
      if (opened) return;
      if (!gestureDone) {
        gestureDone = true;
        tilt.ask();                        /* داخل لمسة المستخدم — شرط آيفون */
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
        /* الفيلم ٦ث (مُبطّأ) — نكشف قبيل نهايته فيتداخل التوهّج مع آخر النور */
        setTimeout(reveal, 5300);
      } else {
        setTimeout(reveal, REDUCED ? 60 : 500);
      }
    }
    gate.addEventListener("click", open);
    gate.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") open(); });
  })();

  /* الاستعراض الثابت بلا بوابة (لو حُذفت) يسلّح الميل مباشرة */
  if (!$("gate")) tilt.arm();

  /* ------- ممرّ الحديقة يمتدّ مع التمرير والوردة تنزلق عليه -------
     طول الخيط المرسوم = ما قطعه الضيف من القسم، والوردة تجلس عند رأسه
     فتنزل مع نزوله وتصعد مع صعوده. كله داخل rAF فلا يُثقل التمرير. */
  (function setupPath() {
    var wrap = document.querySelector(".sched__wrap");
    var path = $("vinePath"), rose = $("schedRose");
    if (!wrap || !path || !rose) return;

    var LEN = 600;
    try { LEN = path.getTotalLength(); } catch (e) { /* يبقى الافتراضي */ }
    path.style.setProperty("--vine-len", LEN);
    path.style.setProperty("--vine-off", LEN);

    var ticking = false;
    function place() {
      ticking = false;
      var r = wrap.getBoundingClientRect();
      if (r.height <= 0) return;
      /* نقطة القياس منتصف الشاشة تقريباً: كم قطع الضيف من القسم */
      var p = (innerHeight * 0.55 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      path.style.setProperty("--vine-off", (LEN * (1 - p)).toFixed(1));
      rose.style.top = (p * 100).toFixed(2) + "%";
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
      Array.prototype.forEach.call(items, function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px 16% 0px" });
    Array.prototype.forEach.call(items, function (el) { obs.observe(el); });
  })();

  /* ------- موسيقى المعاينة الثابتة -------
     الدعوة الحقيقية تأخذ موسيقاها من إعداداتها (تحقنها المنصّة). الاستعراض
     الثابت بلا إعدادات فيبقى صامتاً — نشغّل هنا أغنية معاينة مناسبة،
     وتُلغى تماماً على أي دعوة حقيقية. */
  var PREVIEW_MUSIC = "OcSMzzi0GH4"; /* لا إله إلا الله — حسين الجسمي */
  (function previewMusic() {
    var isLive = !!(window.__INVITE__ && window.__INVITE__.config) || !!document.getElementById("da3wa-music");
    if (isLive || !PREVIEW_MUSIC) return;

    var host = document.createElement("div");
    host.id = "qsPvYt";
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
      player = new YT.Player("qsPvYt", {
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

  /* ------- النموذج الشكلي (الاستعراض الثابت): خياراته وعدّاده يتفاعلان -------
     كي يُرى شكل الحالات (نعم/لا، العدّاد) قبل النشر. لا يرسل شيئاً. */
  (function mockRsvp() {
    var box = $("rsvpPreview");
    if (!box) return;
    var pills = box.querySelectorAll(".pill");
    Array.prototype.forEach.call(pills, function (p) {
      p.addEventListener("click", function () {
        Array.prototype.forEach.call(pills, function (q) { q.setAttribute("aria-pressed", "false"); });
        p.setAttribute("aria-pressed", "true");
      });
    });
    var step = box.querySelector(".step");
    if (!step) return;
    var n = 0, out = step.querySelector("span"), bs = step.querySelectorAll("button");
    if (bs.length < 2 || !out) return;
    bs[0].addEventListener("click", function () { n = Math.max(0, n - 1); out.textContent = toAr(n); });
    bs[1].addEventListener("click", function () { n = Math.min(9, n + 1); out.textContent = toAr(n); });
  })();

  /* ------- قسم تأكيد الحضور المحقون يسبق الختام -------
     المنصّة تلحقه بآخر الصفحة؛ ننقله قبل بطاقة الختام كي تبقى هي الخاتمة.
     نقل العقدة لا يعيد تنفيذ سكربتها ولا يقطع مراجعها. نتحقّق أن الاثنين
     شقيقان مباشران (بالتجربة المجانية يُلفّ القسم بغلاف قفل فلا نلمسه). */
  (function placeRsvp() {
    var r = $("da3wa-rsvp"), c = $("closingSec");
    if (r && c && r.parentNode && r.parentNode === c.parentNode) c.parentNode.insertBefore(r, c);
  })();

  /* ------- التوقيع إلى آخر الصفحة (بعد الأقسام المحقونة) ------- */
  (function moveCredit() {
    var cr = $("creditFoot");
    if (cr && cr.parentElement) cr.parentElement.appendChild(cr);
  })();
})();

/* «كتاب الحكاية»: الفيديو يحمل صوته الأصلي، والواجهة تظهر فوقه عند الثانية ٧ تقريباً
   (لا عند نهايته) لأن الصفحة المرسومة تملأ الشاشة هناك — فيذوب الفيديو في اللوحة نفسها. */
(function () {
  "use strict";

  var FALLBACK = {
    groom: "أحمد",
    bride: "مريم",
    date: "2026-12-18T19:00:00",
    dateText: "يوم الجمعة، ١٨ كانون الأول ٢٠٢٦",
    timeText: "الساعة السابعة مساءً",
    heroSub: "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر",
    verse: "اللّهُمَّ بارِكْ لهُما وبارِكْ عليهِما واجمَعْ بينهُما في خير",
    invitationText: "بقلوبٍ مفعمة بالفرح، نتشرّف بدعوتكم لمشاركتنا فصلاً جديداً من حكايتنا؛ فبحضوركم تكتمل الصفحة وتزهو الحكاية.",
    groomParents: "السيد محمد والسيدة سعاد",
    brideParents: "السيد علي والسيدة ليلى",
    venueName: "قاعة القصر الأبيض",
    venueAddr: "بغداد — المنصور",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Baghdad",
    program: [
      { time: "٧:٠٠ مساءً", title: "استقبال الضيوف" },
      { time: "٨:٠٠ مساءً", title: "مراسم الزفاف" },
      { time: "٩:٠٠ مساءً", title: "العشاء والاحتفال" }
    ],
    notes: ["يُرجى الحضور قبل الموعد بنصف ساعة", "الدعوة خاصة مع التقدير"],
    closingNote: "حضوركم يزيّن فرحتنا",
    closingFamilies: "عائلتا أحمد ومريم",
    hashtag: "#أحمد_ومريم",
    contactLabel: "للاستفسار والتأكيد",
    contactName: "تأكيد الحضور",
    contactPhone: "+9647700000000",
    images: {}
  };

  var CONFIG = (window.__INVITE__ && window.__INVITE__.config) || FALLBACK;
  var IS_PLATFORM = !!window.__INVITE__;
  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* توقيت المشهد: الصفحة المرسومة تملأ الإطار قرابة الثانية السابعة */
  var REVEAL_AT = 5.85;      /* الثانية التي تبدأ عندها الواجهة بالظهور فوق الفيديو (الفيديو الجديد مقصوص من ثانيته الأولى، والصفحة تملأ الإطار هنا) */
  var CROSSFADE_MS = 1500;   /* مدة ذوبان الفيديو في اللوحة */
  var MUSIC_LEAD = 0.45;     /* حيث يمكن خفض صوت الفيديو تدريجياً: تدخل الموسيقى قبل الذوبان بهذا القدر لتتقاطعا بلا فراغ */
  var MUSIC_FADE_MS = 2400;  /* صعود صوت الموسيقى تدريجياً حيث يسمح الجهاز */
  var VIDEO_FADE_MS = 1500;  /* هبوط صوت الفيديو تدريجياً حيث يسمح الجهاز (iPhone يمنعه فيبدأ فيه كل شيء عند الذوبان) */
  var REVEAL_HARD_MS = 10000; /* حارس أخير: الواجهة تظهر حتماً بعد هذا الوقت من الضغطة مهما جرى للفيديو */
  var NAMES_AT_MS = 420;     /* بعد بدء الذوبان: تبدأ الأسماء بالظهور */
  var READY_FALLBACK_MS = 4000;

  function byId(id) { return document.getElementById(id); }
  function clean(value) { return value == null ? "" : String(value).trim(); }
  function setText(id, value) { var node = byId(id); if (node) node.textContent = clean(value); }

  /* ============================================================
     تعبئة المحتوى
     ============================================================ */
  function fillContent() {
    var c = CONFIG;
    var groom = clean(c.groom);
    var bride = clean(c.bride);
    var names = [groom, bride].filter(Boolean).join(" & ");

    setText("gateGroom", groom);
    setText("gateBride", bride);
    setText("gateDate", c.dateText);
    setText("heroGroom", groom);
    setText("heroBride", bride);
    setText("heroSub", c.heroSub);
    setText("heroDate", c.dateText);
    setText("verseText", c.verse);
    setText("invitationText", c.invitationText);
    setText("groomParentsLabel", c.groomParentsLabel || "والدا العريس");
    setText("brideParentsLabel", c.brideParentsLabel || "والدا العروس");
    setText("groomParents", c.groomParents || "—");
    setText("brideParents", c.brideParents || "—");
    setText("detailDate", c.dateText);
    setText("detailTime", c.timeText);
    setText("venueName", c.venueName);
    setText("venueAddr", c.venueAddr);
    setText("closingNote", c.closingNote);
    setText("closingNames", names);
    setText("closingFamilies", c.closingFamilies);
    setText("closingHashtag", c.hashtag);
    setText("scratchNames", names);
    setText("contactLabel", c.contactLabel || "للاستفسار والتأكيد");

    /* صورة الزبون (إن رفعها) تدخل وساماً مذهّباً فوق الآية — اللوحة نفسها تبقى واجهة الحكاية */
    var portraitBox = byId("portraitBox");
    var portrait = byId("portraitImage");
    var heroUrl = c.images && c.images.hero ? String(c.images.hero) : "";
    if (portraitBox && portrait && heroUrl) {
      portrait.src = heroUrl;
      portraitBox.hidden = false;
      portrait.addEventListener("error", function () { portraitBox.hidden = true; }, { once: true });
    }

    var map = byId("mapButton");
    if (map && clean(c.mapUrl)) map.href = c.mapUrl;
    else if (map) map.hidden = true;

    buildProgram(c.program);
    buildNotes(c.notes);
    buildContact(c);
    hideEmptyFamilies(c);
    document.title = "دعوة زفاف " + names;
  }

  function hideEmptyFamilies(c) {
    var emptyGroom = !clean(c.groomParents) || clean(c.groomParents) === "—";
    var emptyBride = !clean(c.brideParents) || clean(c.brideParents) === "—";
    var groomText = byId("groomParents");
    var brideText = byId("brideParents");
    var groomCard = groomText ? groomText.closest(".family-card") : null;
    var brideCard = brideText ? brideText.closest(".family-card") : null;
    var grid = groomCard ? groomCard.parentElement : (brideCard ? brideCard.parentElement : null);

    if (groomCard) groomCard.hidden = emptyGroom;
    if (brideCard) brideCard.hidden = emptyBride;
    if (grid) grid.classList.toggle("is-single", emptyGroom !== emptyBride);
    if (emptyGroom && emptyBride) byId("familiesSection").hidden = true;
  }

  function buildProgram(items) {
    var list = byId("programList");
    if (!list) return;
    list.replaceChildren();
    (Array.isArray(items) ? items : []).forEach(function (item) {
      var row = document.createElement("li");
      var time = document.createElement("span");
      var dot = document.createElement("span");
      var card = document.createElement("div");
      row.className = "timeline__item";
      time.className = "timeline__time";
      dot.className = "timeline__dot";
      card.className = "timeline__card";
      dot.setAttribute("aria-hidden", "true");
      time.textContent = clean(item && item.time);
      card.textContent = clean(item && item.title);
      row.append(time, dot, card);
      list.append(row);
    });
    if (!list.children.length) byId("programSection").hidden = true;
  }

  function buildNotes(items) {
    var list = byId("notesList");
    if (!list) return;
    list.replaceChildren();
    (Array.isArray(items) ? items : []).forEach(function (note) {
      var row = document.createElement("li");
      var mark = document.createElement("span");
      var text = document.createElement("span");
      row.className = "notes__item";
      mark.className = "notes__mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "✦";
      text.textContent = clean(note);
      row.append(mark, text);
      list.append(row);
    });
    if (!list.children.length) byId("notesSection").hidden = true;
  }

  function buildContact(c) {
    var box = byId("contactBox");
    var link = byId("contactLink");
    var phone = clean(c.contactPhone).replace(/[^0-9]/g, "");
    if (!box || !link || !phone) {
      if (box) box.hidden = true;
      return;
    }
    link.href = "https://wa.me/" + phone;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = clean(c.contactName) || clean(c.contactPhone);
  }

  /* أرقام إنكليزية بكل القالب، وأسماء الأشهر بصيغتها الشائعة (ديسمبر لا كانون الأول) —
     تمرّ على نصوص القالب والأقسام المحقونة معاً بعد التعبئة */
  var MONTHS = [
    [/كانون الثاني/g, "يناير"], [/شباط/g, "فبراير"], [/[آا]ذار/g, "مارس"], [/نيسان/g, "أبريل"],
    [/[أا]يار/g, "مايو"], [/حزيران/g, "يونيو"], [/تموز/g, "يوليو"], [/(^|[\s،,\/-])آب(?=$|[\s،,\/-])/g, "$1أوغسطس"],
    [/[أا]يلول/g, "سبتمبر"], [/تشرين الأول/g, "أكتوبر"], [/تشرين الثاني/g, "نوفمبر"], [/كانون الأول/g, "ديسمبر"]
  ];
  function latinDigits(value) {
    return String(value)
      .replace(/[٠-٩]/g, function (d) { return String("٠١٢٣٤٥٦٧٨٩".indexOf(d)); })
      .replace(/[۰-۹]/g, function (d) { return String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)); });
  }
  function localizeText(value) {
    var out = latinDigits(value);
    for (var i = 0; i < MONTHS.length; i += 1) out = out.replace(MONTHS[i][0], MONTHS[i][1]);
    return out;
  }
  function localizeTree(root) {
    if (!root || !document.createTreeWalker) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentNode;
      if (!parent || parent.nodeName === "SCRIPT" || parent.nodeName === "STYLE") continue;
      var text = node.nodeValue;
      if (!/[٠-٩۰-۹]|كانون|شباط|[آا]ذار|نيسان|[أا]يار|حزيران|تموز|آب|[أا]يلول|تشرين/.test(text)) continue;
      var next = localizeText(text);
      if (next !== text) node.nodeValue = next;
    }
  }
  function twoDigits(value) { return String(value).padStart(2, "0"); }

  function setupCountdown() {
    var target = new Date(CONFIG.date).getTime();
    if (!Number.isFinite(target)) {
      byId("countdownSection").hidden = true;
      return;
    }
    var timer = 0;
    function tick() {
      var remaining = target - Date.now();
      if (remaining <= 0) {
        byId("countdown").hidden = true;
        byId("countdownArrived").hidden = false;
        window.clearInterval(timer);
        return;
      }
      setText("cdDays", twoDigits(Math.floor(remaining / 86400000)));
      setText("cdHours", twoDigits(Math.floor((remaining % 86400000) / 3600000)));
      setText("cdMinutes", twoDigits(Math.floor((remaining % 3600000) / 60000)));
      setText("cdSeconds", twoDigits(Math.floor((remaining % 60000) / 1000)));
    }
    timer = window.setInterval(tick, 1000);
    tick();
  }

  /* ============================================================
     الموسيقى: مشغّل المنصّة يُهيَّأ صامتاً ضمن ضغطة الفتح (شرط iPhone)
     ثم يُرفع صوته عند ذوبان الفيديو في اللوحة.
     ============================================================ */
  var MUSIC = { started: false, muted: false, fadeTimer: 0 };

  /* iPhone يمنع تغيير volume للفيديو والمشغّل؛ نكتشف ذلك مرة ونبني التوقيت عليه:
     حيث يمكن الخفض تدريجياً تتقاطع الموسيقى مع صوت الفيديو، وإلا تدخل عند الذوبان مباشرة. */
  var CAN_FADE = null;
  function canFadeVideo(video) {
    if (CAN_FADE !== null) return CAN_FADE;
    try { video.volume = .5; CAN_FADE = Math.abs(video.volume - .5) < .01; video.volume = 1; } catch (_) { CAN_FADE = false; }
    return CAN_FADE;
  }

  function musicVolumeControl() {
    var audio = byId("da3wa-audio");
    if (audio) return { get: function () { return audio.volume * 100; }, set: function (v) { try { audio.volume = v / 100; } catch (_) {} } };
    var frame = byId("da3wa-yt");
    if (frame && window.YT && typeof window.YT.get === "function") {
      var player = window.YT.get("da3wa-yt");
      if (player && typeof player.setVolume === "function") {
        return { get: function () { try { return player.getVolume(); } catch (_) { return 70; } }, set: function (v) { try { player.setVolume(Math.round(v)); } catch (_) {} } };
      }
    }
    return null;
  }

  function fadeInMusic(duration) {
    var control = musicVolumeControl();
    if (!control) return;
    var TARGET = 70;
    var steps = Math.max(8, Math.round(duration / 80));
    var step = 0;
    control.set(0);
    window.clearInterval(MUSIC.fadeTimer);
    MUSIC.fadeTimer = window.setInterval(function () {
      step += 1;
      if (MUSIC.muted) { window.clearInterval(MUSIC.fadeTimer); return; }
      var t = step / steps;
      control.set(TARGET * (t * t * (3 - 2 * t)));
      if (step >= steps) { window.clearInterval(MUSIC.fadeTimer); control.set(TARGET); }
    }, duration / steps);
  }

  window.__storybookAudio = {
    videoGain: function () { var v = byId("entranceVideo"); return v ? (v.muted ? 0 : v.volume) : null; },
    musicVolume: function () { var c = musicVolumeControl(); return c ? c.get() : null; },
    canFade: function () { return CAN_FADE; }
  };

  function prepareMusic() {
    if (!IS_PLATFORM) return;
    if (typeof window.__da3waMusicPrime === "function") {
      try { window.__da3waMusicPrime(); } catch (_) {}
    }
  }

  function startMusic() {
    if (MUSIC.started) return;
    /* غياب الدالة يعني أن الباقة بلا موسيقى؛ يبقى القالب صامتاً ولا نلتف على صلاحيات الباقة */
    if (!IS_PLATFORM || typeof window.__da3waMusicGo !== "function") return;
    try { window.__da3waMusicGo(); } catch (_) { return; }
    MUSIC.started = true;
    MUSIC.muted = false;
    fadeInMusic(MUSIC_FADE_MS);
    showMusicButton();
  }

  function showMusicButton() {
    var button = byId("musicButton");
    if (!button) return;
    button.hidden = false;
    paintMusicButton();
  }

  function paintMusicButton() {
    var button = byId("musicButton");
    if (!button) return;
    button.textContent = MUSIC.muted ? "🔇" : "🔊";
    button.setAttribute("aria-label", MUSIC.muted ? "تشغيل الموسيقى" : "إيقاف الموسيقى");
  }

  function toggleMusic() {
    if (!MUSIC.started) {
      MUSIC.muted = false;
      startMusic();
      return;
    }
    MUSIC.muted = !MUSIC.muted;
    var action = MUSIC.muted ? window.__da3waMusicPause : window.__da3waMusicGo;
    if (typeof action === "function") {
      try { action(); } catch (_) {}
    }
    paintMusicButton();
  }

  /* ============================================================
     الدخول: الكتاب يُفتح بصوته، وعند الثانية ٧ تذوب صفحته في الواجهة
     ============================================================ */
  function setupEntrance() {
    var gate = byId("gate");
    var video = byId("entranceVideo");
    var button = byId("openBtn");
    var label = byId("openLabel");
    var progress = byId("gateProgress");
    var invite = byId("invite");
    if (!gate || !video || !button || !invite) return;

    var started = false;
    var revealing = false;
    var finished = false;
    var frame = 0;
    var videoReady = false;
    var musicWaitUntil = Date.now() + 3000;
    var revealTimer = 0;
    var hardTimer = 0;
    var resumeTried = false;

    video.controls = false;
    video.removeAttribute("controls");

    /* لا تصل لمسات شاشة الدخول إلى مستمعي المنصّة (حتى لا تبدأ الموسيقى قبل الفيديو) */
    ["pointerdown", "touchstart", "click"].forEach(function (type) {
      gate.addEventListener(type, function (event) { event.stopPropagation(); }, { passive: type === "touchstart" });
    });

    function musicReady() {
      if (!IS_PLATFORM) return true;
      if (window.__da3waMusicReady) return true;
      return Date.now() >= musicWaitUntil;
    }

    /* ⚠️ الزرّ فعّال من أول لحظة ولا يُعطَّل انتظاراً لشيء: كان معطّلاً حتى يجهز الفيديو
       ومشغّل المنصّة معاً (٣–٤ ثوانٍ)، فضغطة الضيف المتعجّل تُبتلع بصمت ويظنّ الزرّ
       معطوباً فيضغط ثانيةً بعد حين (شكوى ٢٠٢٦-٠٩-٢٢). begin() يتكفّل بفيديو لم يجهز
       بعد: «يُفتح الكتاب…» حتى يبدأ، وحارس REVEAL_HARD_MS يكشف الواجهة إن تعثّر.
       الجاهزية صارت زينةً فقط (is-ready) لمن يصبر حتى يمتلئ الشريط. */
    button.disabled = false;
    label.textContent = "افتحوا كتاب الحكاية";
    function ready() {
      if (revealing || finished || started) return;
      videoReady = true;
      /* مشغّل المنصّة: تهيئته لا تنجح إلا داخل الضغطة نفسها — ننتظره للزينة لا للتفعيل */
      if (!musicReady()) { window.setTimeout(ready, 200); return; }
      progress.style.width = "100%";
      gate.classList.add("is-ready");
    }

    function updateProgress() {
      if (!video.duration || !video.buffered || !video.buffered.length) return;
      var end = video.buffered.end(video.buffered.length - 1);
      progress.style.width = Math.max(8, Math.min(100, end / video.duration * 100)) + "%";
    }

    function fadeVideoAudio() {
      if (!canFadeVideo(video)) return; /* iPhone: يكفي إيقاف الفيديو عند نهاية الذوبان */
      var steps = 14;
      var step = 0;
      var start = video.volume;
      var timer = window.setInterval(function () {
        step += 1;
        try { video.volume = Math.max(0, start * (1 - step / steps)); } catch (_) {}
        if (step >= steps) window.clearInterval(timer);
      }, VIDEO_FADE_MS / steps);
    }

    function beginReveal() {
      if (revealing) return;
      revealing = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(revealTimer);
      window.clearTimeout(hardTimer);
      /* الإنهاء يُجدوَل أولاً كي لا يمنعه أي عطل صوتي لاحق */
      window.setTimeout(finishReveal, CROSSFADE_MS);
      window.setTimeout(revealHero, NAMES_AT_MS);
      invite.classList.add("visible");
      invite.setAttribute("aria-hidden", "false");
      gate.classList.add("is-ending");
      try { if (started) fadeVideoAudio(); } catch (_) {}
      try { startMusic(); } catch (_) {}
    }

    /* لحظة دخول الموسيقى: قبل الذوبان بقليل حيث يمكن خفض صوت الفيديو، وإلا عند الذوبان نفسه */
    function musicMoment() { return canFadeVideo(video) ? REVEAL_AT - MUSIC_LEAD : REVEAL_AT; }

    function finishReveal() {
      if (finished) return;
      finished = true;
      gate.classList.add("is-finished");
      try { video.pause(); } catch (_) {}
      video.muted = true;
      document.body.classList.remove("locked");
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    function watch() {
      if (revealing) return;
      if (video.currentTime >= musicMoment()) { try { startMusic(); } catch (_) {} }
      if (video.currentTime >= REVEAL_AT) { beginReveal(); return; }
      frame = window.requestAnimationFrame(watch);
    }

    function failedPlayback() {
      gate.classList.remove("is-loading");
      label.textContent = "ادخلوا إلى الحكاية";
      beginReveal();
    }

    function begin(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (started || revealing) return;
      started = true;
      prepareMusic();
      canFadeVideo(video);
      button.disabled = true;
      /* حارس أخير: إن لم يصل الفيديو إلى لحظة الانتقال لأي سبب (توقّف، انقطاع، متصفح مقيّد) تظهر الواجهة */
      hardTimer = window.setTimeout(beginReveal, REVEAL_HARD_MS);
      label.textContent = "يُفتح الكتاب…";
      gate.classList.add("is-loading");
      video.muted = false;
      try { video.volume = 1; } catch (_) {}
      try { video.currentTime = 0; } catch (_) {}
      var request = video.play();
      if (request && typeof request.catch === "function") request.catch(failedPlayback);
    }

    button.addEventListener("click", begin);

    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("progress", updateProgress);
    video.addEventListener("loadeddata", ready, { once: true });
    video.addEventListener("canplay", ready, { once: true });
    video.addEventListener("playing", function () {
      gate.classList.remove("is-loading");
      gate.classList.add("is-playing");
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(watch);
      /* ساعة حائط موازية: لو توقّف عدّاد الفيديو (كما يفعل iPhone عند تعارض الصوت) يقع الانتقال في موعده */
      window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(beginReveal, Math.max(0, REVEAL_AT - video.currentTime) * 1000 + 350);
    });
    video.addEventListener("timeupdate", function () {
      if (!started) return;
      if (video.currentTime >= musicMoment()) { try { startMusic(); } catch (_) {} }
      if (video.currentTime >= REVEAL_AT) beginReveal();
    });
    video.addEventListener("pause", function () {
      /* توقّف غير مقصود قبل الانتقال (مقاطعة صوتية على iPhone): محاولة استئناف واحدة ثم الانتقال */
      if (!started || revealing || finished || video.ended) return;
      if (!resumeTried) {
        resumeTried = true;
        var again = video.play();
        if (again && typeof again.catch === "function") again.catch(function () { beginReveal(); });
        window.setTimeout(function () { if (!revealing && video.paused) beginReveal(); }, 600);
      } else {
        beginReveal();
      }
    });
    video.addEventListener("ended", beginReveal);
    video.addEventListener("error", function () {
      if (started) failedPlayback();
      else ready();
    });

    /* الشبكات البطيئة لا تحبس الضيف خلف زر معطّل */
    window.setTimeout(ready, READY_FALLBACK_MS);
    video.load();

    /* لقطات المعرض والاختبارات: تخطّي الفيديو مباشرة إلى اللوحة */
    if (/[?&]autoopen=1/.test(location.search)) {
      revealing = true;
      finished = true;
      gate.classList.add("is-finished");
      invite.classList.add("visible");
      invite.setAttribute("aria-hidden", "false");
      document.body.classList.remove("locked");
      window.setTimeout(revealHero, 60);
    }
  }

  function revealHero() {
    document.querySelectorAll(".hero-reveal").forEach(function (element, index) {
      element.style.transitionDelay = 120 + index * 130 + "ms";
      window.requestAnimationFrame(function () { element.classList.add("is-visible"); });
    });
  }

  function setupReveal() {
    var sections = Array.from(document.querySelectorAll(".reveal-section"));
    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (section) { section.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .11, rootMargin: "0px 0px -6%" });
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* خيط البرنامج: يمتلئ ذهباً وتنزل عليه الفراشة بحسب موضع التمرير */
  function setupTimeline() {
    var wrap = byId("timelineWrap");
    var list = byId("programList");
    var fill = byId("timelineFill");
    var marker = byId("timelineMarker");
    var track = wrap ? wrap.querySelector(".timeline__track") : null;
    if (!wrap || !list || !fill || !marker || !track || !list.children.length) return;
    var items = Array.from(list.children);
    var target = 0, current = 0, animating = false;
    function measure() {
      var rect = track.getBoundingClientRect();
      var focus = window.innerHeight * .58;
      target = Math.max(0, Math.min(1, (focus - rect.top) / Math.max(1, rect.height)));
      if (!animating) { animating = true; window.requestAnimationFrame(step); }
    }
    function step() {
      current += (target - current) * (REDUCED_MOTION ? 1 : .16);
      if (Math.abs(target - current) < .0015) current = target;
      var rect = track.getBoundingClientRect();
      var wrapRect = wrap.getBoundingClientRect();
      var y = rect.top - wrapRect.top + rect.height * current;
      fill.style.height = (current * 100) + "%";
      marker.style.top = y + "px";
      items.forEach(function (item) {
        var r = item.getBoundingClientRect();
        var center = r.top - wrapRect.top + r.height / 2;
        item.classList.toggle("is-passed", y >= center - 8);
      });
      if (current !== target) window.requestAnimationFrame(step); else animating = false;
    }
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();
  }

  /* غبار ذهبي يطفو في السماء (أعمدة متفرّقة كي لا يغطي النص) */
  function addDust(container, count, topMax) {
    if (!container || REDUCED_MOTION) return;
    var columns = [4, 12, 22, 34, 50, 66, 78, 88, 96];
    for (var index = 0; index < count; index += 1) {
      var spark = document.createElement("i");
      var column = columns[index % columns.length];
      spark.style.left = Math.max(1, Math.min(99, column + (Math.random() * 8 - 4))) + "%";
      spark.style.top = (3 + Math.random() * topMax) + "%";
      spark.style.setProperty("--s", (1.4 + Math.random() * 2.6) + "px");
      spark.style.setProperty("--t", (2.6 + Math.random() * 3.6) + "s");
      spark.style.setProperty("--delay", (Math.random() * 4) + "s");
      container.append(spark);
    }
  }

  /* بتلات وردية تهبط ببطء من ورد اللوحة */
  function addPetals(container, count) {
    if (!container || REDUCED_MOTION) return;
    for (var index = 0; index < count; index += 1) {
      var petal = document.createElement("i");
      petal.style.setProperty("--x", (3 + Math.random() * 94) + "%");
      petal.style.setProperty("--w", (7 + Math.random() * 7) + "px");
      petal.style.setProperty("--t", (11 + Math.random() * 9) + "s");
      petal.style.setProperty("--delay", (-Math.random() * 18) + "s");
      petal.style.setProperty("--drift", (Math.random() * 70 - 35) + "px");
      container.append(petal);
    }
  }

  /* أثر النجوم: منحنى من الطائر (أعلى اليمين) إلى الكيكة (أسفل اليمين) يتلألأ بالتتابع */
  function addTrail(container) {
    if (!container || REDUCED_MOTION) return;
    var count = 18;
    var p0 = { x: 85, y: 26 }, p1 = { x: 97, y: 45 }, p2 = { x: 88, y: 64 };
    for (var k = 0; k < count; k += 1) {
      var t = k / (count - 1);
      var x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      var y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      var star = document.createElement("i");
      star.style.left = (x + (Math.random() * 3 - 1.5)) + "%";
      star.style.top = (y + (Math.random() * 2 - 1)) + "%";
      star.style.setProperty("--s", (8 + Math.random() * 10) + "px");
      star.style.setProperty("--delay", (k * .17) + "s");
      container.append(star);
    }
  }

  /* الختام يبقى آخر الدعوة بعد الأقسام المحقونة وفوتر المنصّة */
  /* الهبوط على طول الدعوة: طبقة ثابتة فوق الشاشة تبقى تهبط أثناء التمرير بكل الأقسام */
  function addFall(container) {
    if (!container || REDUCED_MOTION) return;
    var kinds = ["", "", "", "is-blush", "is-gold", "is-gold", "is-leaf"];
    for (var i = 0; i < 30; i += 1) {
      var piece = document.createElement("i");
      var kind = kinds[i % kinds.length];
      if (kind) piece.className = kind;
      var gold = kind === "is-gold";
      piece.style.setProperty("--x", (2 + Math.random() * 96) + "%");
      piece.style.setProperty("--w", (gold ? 3 + Math.random() * 3 : 8 + Math.random() * 7) + "px");
      piece.style.setProperty("--t", (13 + Math.random() * 11) + "s");
      piece.style.setProperty("--delay", (-Math.random() * 24) + "s");
      piece.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
      container.append(piece);
    }
  }

  function keepClosingLast() {
    var invite = byId("invite");
    var closing = byId("templateClosing");
    if (invite && closing) invite.append(closing);
  }

  fillContent();
  localizeTree(byId("gate"));
  localizeTree(byId("invite"));
  setupCountdown();
  setupTimeline();
  setupReveal();
  addDust(byId("gateDust"), 16, 90);
  addDust(byId("heroDust"), 26, 64);
  addDust(byId("skyDust"), 12, 80);
  addDust(byId("closingDust"), 14, 70);
  addFall(byId("pageFall"));
  addPetals(byId("gatePetals"), 7);
  addTrail(byId("heroTrail"));
  setupEntrance();
  keepClosingLast();

  var musicButton = byId("musicButton");
  if (musicButton) {
    musicButton.addEventListener("touchstart", function (event) { event.stopPropagation(); }, { passive: true });
    musicButton.addEventListener("click", function (event) { event.stopPropagation(); toggleMusic(); });
  }
})();


/* ============================================================
   تفاعلات الحكاية: شرارات اللمس، نجوم الأمنيات، ألعاب القصر النارية،
   عمق يتبع الفأرة أو ميل الهاتف، بتلات الحمامة، فراشات تهرب من الإصبع،
   بطاقة خدش ذهبية، واحتفال بعد تأكيد الحضور.
   كل تفاعل مستقل ويتعطّل بهدوء إن غاب عنصره أو طُلب تقليل الحركة.
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function byId(id) { return document.getElementById(id); }
  var hero = byId("hero");
  var fx = byId("heroFx");
  /* ألوان مشبعة تُرى فوق الرقّ الكريمي (الباستيل الفاتح يذوب فيه) */
  var PALETTE = ["#e2a93a", "#e07a8c", "#5f9fd6", "#a684d9", "#f2c15c", "#d98b93"];

  /* ---------- قماش الجسيمات: شرارات + ألعاب نارية ---------- */
  var ctx = fx && fx.getContext ? fx.getContext("2d") : null;
  var particles = [];
  var running = false;
  var W = 0, H = 0;

  function resizeCanvas() {
    if (!ctx || !hero) return;
    var rect = hero.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    fx.width = Math.round(W * dpr);
    fx.height = Math.round(H * dpr);
    fx.style.width = W + "px";
    fx.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function startLoop() {
    if (running || !ctx) return;
    running = true;
    window.requestAnimationFrame(drawFrame);
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    for (var i = particles.length - 1; i >= 0; i -= 1) {
      var p = particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.spin += .12;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      var alpha = Math.max(0, Math.min(1, p.life));
      /* هالة دافئة تحت كل شرارة كي تبرز على اللوحة الفاتحة */
      ctx.globalAlpha = alpha * .11;
      ctx.fillStyle = "#8a5a22";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.star) {
        drawStar(p.x, p.y, p.size * (1 + Math.sin(p.spin) * .3), p.spin);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = alpha * .85;
      ctx.fillStyle = "#fffbef";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * .36, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    if (particles.length) window.requestAnimationFrame(drawFrame);
    else { running = false; ctx.clearRect(0, 0, W, H); }
  }

  function drawStar(x, y, r, rot) {
    ctx.beginPath();
    for (var k = 0; k < 8; k += 1) {
      var radius = k % 2 === 0 ? r * 1.8 : r * .55;
      var a = rot + k * Math.PI / 4;
      var px = x + Math.cos(a) * radius;
      var py = y + Math.sin(a) * radius;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  function sparkle(x, y, count, spread, lift) {
    if (!ctx || REDUCED) return;
    for (var i = 0; i < count; i += 1) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - .5) * spread,
        vy: -Math.random() * (lift || 1.4) - .3,
        g: .012, drag: .985,
        life: 1, decay: .016 + Math.random() * .022,
        size: 1 + Math.random() * 1.7,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        star: Math.random() < .45, spin: Math.random() * 6
      });
    }
    startLoop();
  }

  function firework(x, y) {
    if (!ctx || REDUCED) return;
    var count = 92;
    var tint = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    /* ومضة مركزية تسبق التفتّح */
    particles.push({ x: x, y: y, vx: 0, vy: 0, g: 0, drag: 1, life: 1, decay: .07, size: 11, color: "#f7d27a", star: false, spin: 0 });
    for (var i = 0; i < count; i += 1) {
      var angle = (i / count) * Math.PI * 2 + Math.random() * .25;
      var speed = 2.3 + Math.random() * 3.4;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        g: .038, drag: .972,
        life: 1, decay: .0065 + Math.random() * .008,
        size: 1.1 + Math.random() * 1.8,
        color: Math.random() < .5 ? tint : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        star: Math.random() < .3, spin: Math.random() * 6
      });
    }
    sparkle(x, y, 14, 3.5, 2.2);
  }

  /* رنّة ناعمة تُصنع محلياً (بلا ملفات) مع الألعاب النارية */
  var audioCtx = null;
  function chime() {
    try {
      var Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      audioCtx = audioCtx || new Context();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var now = audioCtx.currentTime;
      [880, 1318.5, 1760].forEach(function (freq, index) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.05 / (index + 1), now + .02 + index * .05);
        gain.gain.exponentialRampToValueAtTime(.0001, now + 1.1 + index * .2);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + index * .05);
        osc.stop(now + 1.4 + index * .2);
      });
    } catch (_) {}
  }

  /* ---------- لمسات الواجهة: أثر شرارات، نجمة أمنية، القصر ---------- */
  var wishSky = byId("wishSky");
  var castleHint = byId("castleHint");
  var wishes = [];

  function localPoint(event) {
    var rect = hero.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, w: rect.width, h: rect.height };
  }

  function inCastle(pt) {
    return pt.x > pt.w * .2 && pt.x < pt.w * .8 && pt.y > pt.h * .48 && pt.y < pt.h * .86;
  }

  function wishStar(pt) {
    if (!wishSky || REDUCED) return;
    var star = document.createElement("i");
    var core = document.createElement("b");
    star.className = "wish-star";
    star.style.left = pt.x + "px";
    star.style.top = pt.y + "px";
    var rise = 90 + Math.random() * 170;
    if (pt.y - rise < 24) rise = Math.max(30, pt.y - 24);
    star.style.setProperty("--dy", (-rise) + "px");
    star.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    star.append(core);
    wishSky.append(star);
    wishes.push(star);
    if (wishes.length > 24) { var old = wishes.shift(); if (old) old.remove(); }
  }

  function castleShow(pt) {
    if (REDUCED) return;
    var base = { x: pt ? pt.x : W * .5, y: pt ? Math.min(pt.y, H * .62) : H * .58 };
    firework(base.x, base.y - H * .06);
    window.setTimeout(function () { firework(base.x - W * .16, base.y - H * .12); }, 260);
    window.setTimeout(function () { firework(base.x + W * .15, base.y - H * .1); }, 520);
    chime();
    if (castleHint) castleHint.classList.add("is-done");
  }

  if (hero && ctx && !REDUCED) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    var pressed = false, moved = 0, downX = 0, downY = 0, lastSpark = 0;
    hero.addEventListener("pointerdown", function (event) {
      if (event.target.closest("a, button")) return;
      pressed = true; moved = 0; downX = event.clientX; downY = event.clientY;
    });
    hero.addEventListener("pointermove", function (event) {
      var pt = localPoint(event);
      if (event.pointerType === "mouse" || pressed) {
        var now = performance.now();
        if (now - lastSpark > 26) { lastSpark = now; sparkle(pt.x, pt.y, 2, 1.2); }
      }
      if (pressed) moved += Math.abs(event.clientX - downX) + Math.abs(event.clientY - downY);
    });
    hero.addEventListener("pointerup", function (event) {
      if (!pressed) return;
      pressed = false;
      if (moved > 14 || event.target.closest("a, button")) return;
      var pt = localPoint(event);
      sparkle(pt.x, pt.y, 26, 3.8, 2.2);
      if (inCastle(pt)) castleShow(pt); else wishStar(pt);
    });
    hero.addEventListener("pointercancel", function () { pressed = false; });
    if (castleHint) {
      castleHint.addEventListener("click", function () {
        var rect = castleHint.getBoundingClientRect();
        var heroRect = hero.getBoundingClientRect();
        castleShow({ x: rect.left - heroRect.left + rect.width / 2, y: rect.top - heroRect.top });
      });
    }
  } else if (castleHint) {
    castleHint.hidden = true;
  }

  /* ---------- عمق: الفأرة على الحاسوب، وميل الهاتف حيث لا يحتاج إذناً ---------- */
  var bg = byId("heroBg");
  var copy = hero ? hero.querySelector(".hero__copy") : null;
  var layers = [byId("heroDust"), byId("heroPetals"), byId("heroTrail"), wishSky].filter(Boolean);
  var tx = 0, ty = 0, cx = 0, cy = 0, parallaxRunning = false;

  function setTarget(nx, ny) {
    tx = Math.max(-1, Math.min(1, nx));
    ty = Math.max(-1, Math.min(1, ny));
    if (!parallaxRunning) { parallaxRunning = true; window.requestAnimationFrame(stepParallax); }
  }
  function stepParallax() {
    cx += (tx - cx) * .07;
    cy += (ty - cy) * .07;
    if (bg) bg.style.transform = "translate3d(" + (-cx * 9).toFixed(2) + "px," + (-cy * 7).toFixed(2) + "px,0)";
    if (copy) copy.style.transform = "translate3d(" + (cx * 5).toFixed(2) + "px," + (cy * 4).toFixed(2) + "px,0)";
    layers.forEach(function (layer) { layer.style.transform = "translate3d(" + (cx * 12).toFixed(2) + "px," + (cy * 9).toFixed(2) + "px,0)"; });
    if (Math.abs(tx - cx) > .002 || Math.abs(ty - cy) > .002) window.requestAnimationFrame(stepParallax);
    else parallaxRunning = false;
  }
  if (hero && !REDUCED) {
    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      setTarget((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
    });
    hero.addEventListener("mouseleave", function () { setTarget(0, 0); });
    /* iPhone يطلب إذناً بنافذة نظام لميل الجهاز — نتركه للفأرة واللمس هناك؛ أندرويد يعمل مباشرة */
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission !== "function") {
      var baseTilt = null;
      window.addEventListener("deviceorientation", function (event) {
        if (event.gamma == null || event.beta == null) return;
        if (baseTilt === null) baseTilt = { g: event.gamma, b: event.beta };
        setTarget((event.gamma - baseTilt.g) / 18, (event.beta - baseTilt.b) / 18);
      });
    }
  }

  /* ---------- الحمامة تنثر البتلات ---------- */
  var dove = byId("doveOrn");
  function burstPetals(anchor) {
    if (REDUCED) return;
    var section = anchor.closest("section") || anchor.parentElement;
    var rect = anchor.getBoundingClientRect();
    var sectionRect = section.getBoundingClientRect();
    var box = document.createElement("div");
    box.className = "petal-burst";
    section.append(box);
    for (var i = 0; i < 16; i += 1) {
      var petal = document.createElement("i");
      petal.style.left = (rect.left - sectionRect.left + rect.width * .55) + "px";
      petal.style.top = (rect.top - sectionRect.top + rect.height * .6) + "px";
      petal.style.setProperty("--dx", (Math.random() * 200 - 100) + "px");
      petal.style.setProperty("--dy", (120 + Math.random() * 200) + "px");
      petal.style.setProperty("--t", (1.6 + Math.random() * 1.3) + "s");
      petal.style.setProperty("--w", (7 + Math.random() * 7) + "px");
      box.append(petal);
    }
    window.setTimeout(function () { box.remove(); }, 3400);
  }
  if (dove) {
    var hop = function () {
      dove.classList.remove("is-hopping");
      void dove.offsetWidth;
      dove.classList.add("is-hopping");
      burstPetals(dove);
    };
    dove.addEventListener("click", hop);
    dove.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); hop(); }
    });
  }

  /* ---------- الفراشات تهرب من الإصبع ---------- */
  var families = byId("familiesSection");
  var butterflies = [byId("bfBlue"), byId("bfPink")].filter(Boolean);
  if (families && butterflies.length && !REDUCED) {
    var lastFlee = 0;
    families.addEventListener("pointermove", function (event) {
      var now = performance.now();
      if (now - lastFlee < 220) return;
      var bounds = families.getBoundingClientRect();
      butterflies.forEach(function (fly) {
        var rect = fly.getBoundingClientRect();
        var dx = event.clientX - (rect.left + rect.width / 2);
        var dy = event.clientY - (rect.top + rect.height / 2);
        if (Math.hypot(dx, dy) > 105) return;
        lastFlee = now;
        var current = fly.__offset || { x: 0, y: 0 };
        var angle = Math.atan2(-dy, -dx) + (Math.random() - .5) * 1.2;
        var distance = 110 + Math.random() * 110;
        var nx = Math.max(-bounds.width * .34, Math.min(bounds.width * .34, current.x + Math.cos(angle) * distance));
        var ny = Math.max(-bounds.height * .38, Math.min(bounds.height * .38, current.y + Math.sin(angle) * distance));
        fly.__offset = { x: nx, y: ny };
        fly.style.setProperty("--fx", nx + "px");
        fly.style.setProperty("--fy", ny + "px");
        fly.classList.add("is-fleeing");
        window.clearTimeout(fly.__timer);
        fly.__timer = window.setTimeout(function () { fly.classList.remove("is-fleeing"); }, 1400);
      });
    });
  }

  /* ---------- بطاقة الخدش الذهبية ---------- */
  var card = byId("scratchCard");
  var foil = byId("scratchFoil");
  if (card && foil && foil.getContext) {
    var fctx = foil.getContext("2d");
    var fw = 0, fh = 0, touched = false, scratching = false, lastPoint = null;
    var paintFoil = function () {
      var gradient = fctx.createLinearGradient(0, 0, fw, fh);
      gradient.addColorStop(0, "#e9cf9a");
      gradient.addColorStop(.32, "#c9a55f");
      gradient.addColorStop(.5, "#f3e1b3");
      gradient.addColorStop(.7, "#c39a55");
      gradient.addColorStop(1, "#e6c98f");
      fctx.globalCompositeOperation = "source-over";
      fctx.fillStyle = gradient;
      fctx.fillRect(0, 0, fw, fh);
      for (var i = 0; i < 48; i += 1) {
        fctx.fillStyle = "rgba(255,250,235," + (.25 + Math.random() * .55) + ")";
        fctx.beginPath();
        fctx.arc(Math.random() * fw, Math.random() * fh, Math.random() * 1.7 + .4, 0, Math.PI * 2);
        fctx.fill();
      }
      fctx.strokeStyle = "rgba(255,250,235,.55)";
      fctx.lineWidth = 1;
      fctx.strokeRect(9.5, 9.5, fw - 19, fh - 19);
      fctx.fillStyle = "rgba(90,60,30,.85)";
      fctx.font = "700 15px Tajawal, sans-serif";
      fctx.textAlign = "center";
      fctx.textBaseline = "middle";
      fctx.fillText("اخدشوا الذهب ❦", fw / 2, fh / 2);
    };
    var sizeFoil = function () {
      if (touched) return;
      var rect = card.getBoundingClientRect();
      if (!rect.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      fw = rect.width; fh = rect.height;
      foil.width = Math.round(fw * dpr);
      foil.height = Math.round(fh * dpr);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil();
    };
    var scratchAt = function (x, y) {
      fctx.globalCompositeOperation = "destination-out";
      fctx.lineCap = "round";
      fctx.lineJoin = "round";
      fctx.lineWidth = 34;
      fctx.strokeStyle = "rgba(0,0,0,1)";
      fctx.beginPath();
      fctx.moveTo(lastPoint ? lastPoint.x : x, lastPoint ? lastPoint.y : y);
      fctx.lineTo(x, y);
      fctx.stroke();
      lastPoint = { x: x, y: y };
    };
    var checkCleared = function () {
      try {
        var data = fctx.getImageData(0, 0, foil.width, foil.height).data;
        var total = 0, clear = 0;
        for (var i = 3; i < data.length; i += 4 * 9) { total += 1; if (data[i] < 40) clear += 1; }
        if (total && clear / total > .48) card.classList.add("is-revealed");
      } catch (_) {}
    };
    foil.addEventListener("pointerdown", function (event) {
      scratching = true; touched = true; lastPoint = null;
      try { foil.setPointerCapture(event.pointerId); } catch (_) {}
      var rect = foil.getBoundingClientRect();
      scratchAt(event.clientX - rect.left, event.clientY - rect.top);
    });
    foil.addEventListener("pointermove", function (event) {
      if (!scratching) return;
      var rect = foil.getBoundingClientRect();
      scratchAt(event.clientX - rect.left, event.clientY - rect.top);
    });
    var endScratch = function () { if (!scratching) return; scratching = false; lastPoint = null; checkCleared(); };
    foil.addEventListener("pointerup", endScratch);
    foil.addEventListener("pointercancel", endScratch);
    foil.addEventListener("lostpointercapture", endScratch);
    window.addEventListener("resize", sizeFoil);
    sizeFoil();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeFoil);
    if ("IntersectionObserver" in window) {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { sizeFoil(); seen.disconnect(); } });
      });
      seen.observe(card);
    }
  }

  /* ---------- احتفال عند تأكيد الحضور (قسم المنصّة يضيف .ok عند النجاح) ---------- */
  var rsvp = byId("da3wa-rsvp");
  function celebrate() {
    if (REDUCED) return;
    var box = document.createElement("div");
    box.className = "celebrate";
    document.body.append(box);
    for (var i = 0; i < 72; i += 1) {
      var piece = document.createElement("i");
      piece.style.setProperty("--x", (Math.random() * 100) + "%");
      piece.style.setProperty("--t", (2.6 + Math.random() * 2.2) + "s");
      piece.style.setProperty("--delay", (Math.random() * 1.1) + "s");
      piece.style.setProperty("--w", (6 + Math.random() * 8) + "px");
      piece.style.setProperty("--c", PALETTE[i % PALETTE.length]);
      piece.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      box.append(piece);
    }
    window.setTimeout(function () { box.remove(); }, 5600);
  }
  if (rsvp && "MutationObserver" in window) {
    var watcher = new MutationObserver(function () {
      if (rsvp.querySelector(".ok")) { watcher.disconnect(); celebrate(); }
    });
    watcher.observe(rsvp, { childList: true, subtree: true });
  }
})();

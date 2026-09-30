/* ============================================================
   قالب classic «كلاسيك»
   الدخول + الهيرو: محرّك Codex السينمائي (باب ← تحميل ← وميض ← طيور)
   الأقسام أسفل الهيرو: منطق البطاقة (ملء المحتوى + عدّاد + ظهور)
   ============================================================ */

const WEDDING_CONFIG = (typeof window !== "undefined" && window.__INVITE__ && window.__INVITE__.config) || {};

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  setText("heroGroom", c.groom);
  setText("heroBride", c.bride);
  const hero = document.getElementById("hero");
  if (hero && Math.max(String(c.groom || "").length, String(c.bride || "").length) > 10) hero.classList.add("hero--long-names");
  setText("heroInvite", c.heroSub);
  setText("heroDate", c.dateText);
  setText("verseText", c.verse);
  setText("invitationText", c.invitationText);
  setText("groomParents", c.groomParents);
  setText("brideParents", c.brideParents);
  setText("weddingDate", c.dateText);
  setText("weddingTime", c.timeText);
  setText("venueName", c.venueName);
  setText("venueAddr", c.venueAddr);
  setText("closingNote", c.closingNote);
  setText("closingHashtag", c.hashtag);
  setText("closingFamilies", c.closingFamilies);

  const mapBtn = document.getElementById("mapBtn");
  if (mapBtn && c.mapUrl) { mapBtn.href = c.mapUrl; }
  else if (mapBtn) { mapBtn.style.display = "none"; }

  const names = document.getElementById("preloaderNames");
  if (names && c.groom && c.bride) names.textContent = `${c.groom} & ${c.bride}`;

  buildTimeline(c.program);
  buildNotes(c.notes);
  buildContact(c);
  applyHeroVerseFirst(c);

  document.title = `دعوة زفاف ${c.groom} & ${c.bride}`;
}

function setText(id, value) { const el = document.getElementById(id); if (el && value != null) el.textContent = value; }

/* ---------------- ترتيب الواجهة التقليدي (مفتاح المحرر heroVerseFirst) ----------------
   الواجهة تصير: الآية ← عبارة الأهل ← أسماء العرسان ← التاريخ، بدل الأسماء أولاً.
   المفتاح مطفأ افتراضياً فيخرج الحارس فوراً ولا تتأثر أي دعوة كلاسيك قائمة.
   نحرّك العناصر بالـDOM (لا order بالـCSS) كي يمشي تدرّج الظهور مع الترتيب الجديد. */
function applyHeroVerseFirst(c) {
  if (!c.heroVerseFirst) return;
  const box = document.querySelector(".hero__content");
  const verseText = String(c.verse == null ? "" : c.verse).trim();
  if (!box || !verseText) return;                     /* بلا آية لا معنى للترتيب */

  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("hero--verse-first");  /* الواجهة تتمدد مع النص وتصغّر الأسماء */

  /* «بسم الله الرحمن الرحيم» المحفورة تختفي: نصّ الآية يبدأ بالبسملة عادةً فلا تتكرر */
  const eyebrow = box.querySelector(".hero__eyebrow");
  if (eyebrow) eyebrow.remove();

  const verse = document.createElement("p");
  verse.className = "hero__verse reveal";
  verse.textContent = verseText;                      /* نصّ خام: لا يُفسَّر HTML أبداً */
  box.insertBefore(verse, box.firstChild);

  /* عبارة الأهل تصعد فوق أول اسم */
  const invite = document.getElementById("heroInvite");
  const firstName = box.querySelector(".mask-reveal");
  if (invite && firstName) box.insertBefore(invite, firstName);

  /* الصيغة الرسمية بعمودين — الشكل الذي طلبه الزبون:
                          يتشرّفان
       حرم السيد … (يمين)   &   حرم الحاج … (يسار)
          الشاب رامي              الآنسة رهام
              بدعوتكم لمشاركتهما فرحة نجليهما
     كل جهة عمود: اسم عائلتها فوق واسم صاحبها تحت. الحقول فارغة ⇒ نبقي
     سطر heroSub الواحد كما هو، فكل دعوة قائمة لا تتأثر. */
  const famA = String(c.heroFamilyGroom == null ? "" : c.heroFamilyGroom).trim();
  const famB = String(c.heroFamilyBride == null ? "" : c.heroFamilyBride).trim();
  const famLead = String(c.heroFamilyLead == null ? "" : c.heroFamilyLead).trim();
  const famNote = String(c.heroFamilyNote == null ? "" : c.heroFamilyNote).trim();
  if ((famA || famB) && invite) {
    hero && hero.classList.add("hero--two-col");

    if (famLead) {
      const lead = document.createElement("p");
      lead.className = "hero__lead reveal";
      lead.textContent = famLead;                       /* نصّ خام: لا يُفسَّر HTML أبداً */
      box.insertBefore(lead, invite);
    }

    /* الشبكة: عمود يمين ← «&» ← عمود يسار (الصفحة RTL فأول عمود هو اليمين) */
    const grid = document.createElement("div");
    grid.className = "hero__pair";
    const amp = box.querySelector(".hero__amp");
    const masks = box.querySelectorAll(".mask-reveal");

    const col = (famName, maskEl) => {
      const c2 = document.createElement("div");
      c2.className = "hero__col";
      if (famName) {
        const p = document.createElement("p");
        p.className = "hero__family reveal";
        p.textContent = famName;                        /* نصّ خام */
        c2.appendChild(p);
      }
      if (maskEl) c2.appendChild(maskEl);               /* اسم العريس/العروس كما هو بغلافه */
      return c2;
    };

    grid.appendChild(col(famA, masks[0]));
    if (amp) grid.appendChild(amp);
    grid.appendChild(col(famB, masks[1]));
    box.insertBefore(grid, invite);

    /* العبارة الختامية تحت الشبكة */
    if (famNote) invite.textContent = famNote;
    else if (!invite.textContent.trim()) invite.remove();
    if (invite.parentNode) box.insertBefore(invite, grid.nextSibling);
  }

  /* قسم «الدعاء الافتتاحي» تحت الواجهة ينطفئ — الآية انتقلت فوق ولا تُعرض مرتين */
  const verseEl = document.getElementById("verseText");
  const verseSection = verseEl && verseEl.closest(".verse");
  if (verseSection) verseSection.style.display = "none";

  /* إعادة ترقيم تدرّج الظهور من الأعلى للأسفل بالترتيب الجديد */
  const steps = box.querySelectorAll(".reveal, .reveal-mask");
  for (let i = 0; i < steps.length; i++) steps[i].dataset.delay = String(150 + i * 240);
}

/* ---------------- صورة القاعة (إن وُجدت) ---------------- */
function loadImages() {
  const imgs = WEDDING_CONFIG.images || {};
  applyImageIfExists(imgs.venue, (src) => {
    const vp = document.getElementById("venuePhoto");
    const venue = document.querySelector(".venue");
    if (vp) vp.style.backgroundImage = `url("${src}")`;
    if (venue) venue.classList.add("has-photo");
  });
}
function applyImageIfExists(src, onload) {
  if (!src) return;
  const img = new Image();
  img.onload = () => onload(src);
  img.src = src;
}

function buildTimeline(items) {
  const ul = document.getElementById("timeline");
  if (!ul || !Array.isArray(items)) return;
  ul.innerHTML = "";
  items.forEach((it) => {
    const li = document.createElement("li");
    li.className = "timeline__item";
    li.innerHTML = `<span class="timeline__dot" aria-hidden="true"></span>
      <span class="timeline__time">${it.time}</span>
      <span class="timeline__title">${it.title}</span>`;
    ul.appendChild(li);
  });
}

function buildNotes(items) {
  const ul = document.getElementById("notesList");
  if (!ul || !Array.isArray(items)) return;
  ul.innerHTML = "";
  items.forEach((txt) => {
    const li = document.createElement("li");
    li.className = "notes__item";
    li.innerHTML = `<span class="notes__mark" aria-hidden="true">&#10047;</span><span>${txt}</span>`;
    ul.appendChild(li);
  });
  /* قسم بلا تنويهات لا يُترك بعنوانه — والملاحظة البارزة المحقونة تُنقل خارجه قبل إخفائه */
  if (!ul.children.length) {
    const sec = ul.closest(".notes");
    if (sec) {
      const note = sec.querySelector("#da3wa-note");
      if (note && sec.parentNode) sec.parentNode.insertBefore(note, sec);
      sec.style.display = "none";
    }
  }
}

function buildContact(c) {
  const link = document.getElementById("contactLink");
  const label = document.querySelector(".contact__label");
  if (label && c.contactLabel) label.textContent = c.contactLabel;
  if (!link) return;
  const wa = (c.contactPhone || "").replace(/[^0-9]/g, "");
  if (wa) {
    link.href = c.contactUrl || `https://wa.me/${wa}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.innerHTML = `<span aria-hidden="true">&#9742;</span> `;
    link.appendChild(document.createTextNode(c.contactName ? c.contactName : c.contactPhone));
  } else {
    const box = document.getElementById("contactBox");
    if (box) box.style.display = "none";
  }
}

/* ---------------- ظهور أقسام البطاقة عند التمرير ---------------- */
function setupReveal() {
  const items = document.querySelectorAll(".creveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => obs.observe(el));
}

/* ---------------- العدّاد التنازلي (أرقام عربية) ---------------- */
function setupCountdown() {
  const target = new Date(WEDDING_CONFIG.date).getTime();
  if (isNaN(target)) return;
  const els = {
    days: document.getElementById("cdDays"), hours: document.getElementById("cdHours"),
    mins: document.getElementById("cdMins"), secs: document.getElementById("cdSecs"),
  };
  const cd = document.getElementById("countdown");
  const arrived = document.getElementById("cdArrived");
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { if (cd) cd.hidden = true; if (arrived) arrived.hidden = false; clearInterval(timer); return; }
    if (els.days) els.days.textContent = pad(Math.floor(diff / 86400000));
    if (els.hours) els.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (els.mins) els.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    if (els.secs) els.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  const timer = setInterval(tick, 1000);
  tick();
}
function pad(n) { return toArabicDigits(String(n).padStart(2, "0")); }
function toArabicDigits(s) {
  const ar = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(s).replace(/[0-9]/g, (d) => ar[+d]);
}

/* ---------------- بتلات ورموز عائمة (تبدأ عند كشف الموقع) ---------------- */
function startPetals(count) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.getElementById("petals");
  if (!layer || layer.dataset.on) return;
  layer.dataset.on = "1";
  const glyphs = ["❀", "✿", "❁", "·"];
  const colors = ["#c9a87c", "#b8924f", "#cdab6a", "#8a7a64"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.color = colors[i % colors.length];
    s.style.fontSize = (9 + Math.random() * 15) + "px";
    s.style.animationDuration = (6 + Math.random() * 6) + "s";
    s.style.animationDelay = (Math.random() * 5) + "s";
    layer.appendChild(s);
  }
}

/* ============================================================
   محرّك Codex السينمائي — منسوخ حرفياً (يعمل على iPhone Karar)
   preloader (باب) ← شريط تحميل بنسبة ← وميض أبيض ← كشف ← فيديو الطيور
   ============================================================ */
(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const body = document.body;
  const site = $("#site");
  const preloader = $("#preloader");
  const preloaderPoster = $("#preloaderPoster");
  const preloaderVideo = $("#preloaderVideo");
  const heroVideo = $("#heroVideo");
  const preloaderText = preloaderPoster ? $(".preloader-text", preloaderPoster) : null;
  const preloaderLabel = preloaderPoster ? $(".preloader-cta__label", preloaderPoster) : null;
  const preloaderHint = preloaderPoster ? $(".preloader-cta__hint", preloaderPoster) : null;
  const preloaderProgress = $("#preloaderProgress");
  const preloaderProgressBar = $("#preloaderProgressBar");
  const preloaderPercent = $("#preloaderPercent");
  let introTimer = null;
  let progressTimer = null;
  let introStarting = false;
  let introFinishing = false;
  let doorReady = false;          /* جهوزية الباب تُثبَّت ولا تُنقض — انظر updatePreloaderProgress */
  let doorFailed = false;         /* الفيديو أعلن عجزه: لا نُجرّبه ثانيةً ولا نُبقي الضيف ينتظر */
  let heroPreparePromise = null;
  const HAVE_CURRENT_DATA = 2;
  const HAVE_FUTURE_DATA = 3;
  const HAVE_ENOUGH_DATA = 4;

  function waitForAny(target, events, timeoutMs) {
    return new Promise((resolve, reject) => {
      let timer = null;
      const cleanup = () => {
        events.forEach((eventName) => target.removeEventListener(eventName, done));
        if (timer) window.clearTimeout(timer);
      };
      const done = (event) => { cleanup(); resolve(event); };
      events.forEach((eventName) => target.addEventListener(eventName, done, { once: true }));
      if (timeoutMs > 0) {
        timer = window.setTimeout(() => { cleanup(); reject(new Error("media timeout")); }, timeoutMs);
      }
    });
  }

  function hasFirstFrame(video) { return Boolean(video && video.readyState >= HAVE_CURRENT_DATA); }
  function clampPercent(value) { return Math.max(0, Math.min(100, Math.round(value))); }

  function getBufferedPercent(video) {
    if (!video) return 0;
    if (video.readyState >= HAVE_ENOUGH_DATA) return 100;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0 || !video.buffered?.length) {
      return hasFirstFrame(video) ? 35 : 0;
    }
    let bufferedEnd = 0;
    for (let index = 0; index < video.buffered.length; index += 1) {
      bufferedEnd = Math.max(bufferedEnd, video.buffered.end(index));
    }
    return clampPercent((bufferedEnd / duration) * 100);
  }

  /* ــ الشريط: القياس شيء والعرض شيء آخر ــــــــــــــــــــــــــــــــــــــــ
     getBufferedPercent دالّة درجية لا خطّ متدرّج: يبقى صفراً حتى يقرأ المتصفح
     رأس الملف (moov)، ثم يقفز إلى ١٠٠ لحظة readyState=4؛ وكل نداء
     updatePreloaderProgress(100) كان يرسم ١٠٠٪ ثم تسحبه الدورة التالية إلى
     الوراء. فيرى الضيف «٠٪» ثابتة تقفز مرّةً واحدةً ثم تختفي، لا شريط تحميل.
     الآن: targetPercent يقيس، وshownPercent يصعد نحوه بنعومة ولا ينزل أبداً. */
  let shownPercent = 0;
  let loadSettled = false;
  let lastStepAt = 0;             /* «اكتمل» صار إعلاناً يُثبَّت لا رقماً يُرسم */
  const progressStartedAt = Date.now();
  const CREEP_FULL_MS = 9000;          /* زحف زمني حين لا يصل أي قياس من الفيديو */

  function targetPercent() {
    if (loadSettled) return 100;
    if (preloaderVideo && preloaderVideo.readyState >= HAVE_ENOUGH_DATA) return 100;
    const measured = getBufferedPercent(preloaderVideo);
    if (measured > 0) return Math.min(measured, 99);
    /* لا قياس بعد — تقدّم زمني حتى ٩٠٪ كي لا يتجمّد الشريط على صفر */
    return Math.min(90, ((Date.now() - progressStartedAt) / CREEP_FULL_MS) * 90);
  }

  function updatePreloaderProgress(forcePercent) {
    if (!preloaderVideo || !preloaderPoster) return;
    if (Number.isFinite(forcePercent) && forcePercent >= 100) loadSettled = true;
    const target = targetPercent();
    /* صعود مُخفَّف بوحدة زمنية لا بوحدة نبضة: يبلغ ١٠٠٪ في ٨٠٠ms تقريباً مهما
       تباطأت النبضات، فحتى القفزة المفاجئة تُرى امتلاءً لا وميضاً */
    const nowMs = Date.now();
    const frames = lastStepAt ? Math.min(6, (nowMs - lastStepAt) / 16.7) : 1;   /* لا قفزة بعد تجمّد التبويب */
    lastStepAt = nowMs;
    if (target > shownPercent) {
      shownPercent = Math.min(target, shownPercent + Math.max(0.38, (target - shownPercent) * 0.10) * frames);
    }
    const percent = clampPercent(shownPercent);
    /* الجهوزية تُثبَّت: زرٌّ يصير قابلاً للنقر ثم يعود يرفضه يبتلع ضغطات الضيف
       بصمت — وتلك كانت حبسته في شاشة البداية، لأن مؤقّت الأمان كان يفعّل الزر
       ثم يمحو المراقبُ الدوريُّ تفعيلَه بعد ربع ثانية. */
    if (loadSettled || percent >= 100 || preloaderVideo.readyState >= HAVE_FUTURE_DATA) doorReady = true;
    const ready = doorReady;
    preloaderPoster.classList.toggle("is-ready", ready);
    if (preloaderProgressBar) preloaderProgressBar.style.setProperty("--progress", shownPercent.toFixed(1) + "%");
    if (preloaderProgress) preloaderProgress.setAttribute("aria-valuenow", String(percent));
    if (preloaderPercent) preloaderPercent.textContent = `${percent}%`;
    if (shownPercent < 100) startProgressWatch();   /* الحلقة تُكمل الصعود ولو أُوقفت */
    if (introStarting || introFinishing) return;
    if (preloaderText) preloaderText.textContent = ready ? "اضغط لفتح الباب" : "جارٍ التحميل…";
  }

  /* تعذّر فيديو الباب (شبكة مقطوعة، صيغة مرفوضة): لا ننتظر ما لن يأتي —
     نُثبّت جهوزية الباب فوراً ونوقف المراقبة، فالنقرة التالية تفتح الدعوة. */
  function failOpenDoor() {
    doorFailed = true;
    stopProgressWatch();
    updatePreloaderProgress(100);
  }

  function startProgressWatch() {
    if (progressTimer) return;
    /* ٢٥ms لا ٢٥٠: الصعود يُرسم لا يُقفز. setInterval لا rAF كي تبقى الجهوزية
       تتقدّم حتى لو غاب الضيف عن التبويب. */
    progressTimer = window.setInterval(() => {
      updatePreloaderProgress();
      if (shownPercent >= 100 && doorReady) stopProgressWatch();
    }, 25);
    updatePreloaderProgress();
  }
  function stopProgressWatch() {
    if (progressTimer) window.clearInterval(progressTimer);
    progressTimer = null;
  }

  function timeoutValue(timeoutMs, value = false) {
    return new Promise((resolve) => { window.setTimeout(() => resolve(value), timeoutMs); });
  }

  async function waitForMediaReady(video, timeoutMs = 6000) {
    if (!video) return false;
    if (hasFirstFrame(video)) return true;
    video.preload = "auto";
    /* load() يُعيد التحميل من الصفر: لا نناديه والمتصفح يحمّل فعلاً (NETWORK_LOADING = 2)،
       فالضغطة المبكّرة تُكمل ما بدأ بدل أن تُهدره. آيفون لا يبدأ التحميل قبل اللمسة
       فيبقى دون هذه الحالة، وهناك load() داخل اللمسة هو ما يُطلقه. */
    if (video.networkState !== 2) {
      try { video.load(); } catch { return hasFirstFrame(video); }
    }
    try { await waitForAny(video, ["loadeddata", "canplay", "canplaythrough"], timeoutMs); }
    catch { return hasFirstFrame(video); }
    return hasFirstFrame(video);
  }

  function markHeroReady() { if (hasFirstFrame(heroVideo)) heroVideo.classList.add("is-ready"); }
  function markPreloaderReady() { if (hasFirstFrame(preloaderVideo)) preloaderVideo.classList.add("is-ready"); }

  function prepareHeroVideo() {
    if (!heroVideo) return Promise.resolve(false);
    if (heroPreparePromise) return heroPreparePromise;
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroPreparePromise = waitForMediaReady(heroVideo, 7000).then((ready) => {
      if (ready) markHeroReady();
      else heroPreparePromise = null;
      return ready;
    });
    return heroPreparePromise;
  }

  async function startVideoPlayback(video, timeoutMs = 4500) {
    if (!video) return false;
    if (!video.paused && !video.ended) return true;
    try {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        await Promise.race([playPromise, waitForAny(video, ["playing", "timeupdate"], timeoutMs)]);
      } else {
        await waitForAny(video, ["playing", "timeupdate"], timeoutMs);
      }
    } catch { return false; }
    return !video.paused || video.currentTime > 0;
  }

  async function playHeroVideo(timeoutMs = 4500) {
    if (!heroVideo) return false;
    await Promise.race([prepareHeroVideo(), timeoutValue(timeoutMs)]);
    if (hasFirstFrame(heroVideo)) markHeroReady();
    if (!heroVideo.paused && !heroVideo.ended) return true;
    const started = await startVideoPlayback(heroVideo, timeoutMs);
    markHeroReady();
    return started || hasFirstFrame(heroVideo);
  }

  async function startPreloaderVideo() {
    preloaderVideo.muted = true;
    preloaderVideo.playsInline = true;
    preloaderVideo.preload = "auto";
    await waitForMediaReady(preloaderVideo, 8000);
    markPreloaderReady();
    updatePreloaderProgress(100);
    try { preloaderVideo.currentTime = 0; } catch { /* بعض المتصفحات ترفض seek قبل اكتمال البيانات */ }
    const started = await startVideoPlayback(preloaderVideo, 7000);
    markPreloaderReady();
    updatePreloaderProgress(100);
    return started;
  }

  function armIntroTimer() {
    window.clearTimeout(introTimer);
    const duration = Number.isFinite(preloaderVideo.duration) && preloaderVideo.duration > 0 ? preloaderVideo.duration : 10;
    const currentTime = Number.isFinite(preloaderVideo.currentTime) ? preloaderVideo.currentTime : 0;
    const remainingMs = Math.max(2200, Math.ceil((duration - currentTime) * 1000) + 900);
    introTimer = window.setTimeout(finishIntro, remainingMs);
  }

  function revealHeroText() {
    $$(".hero .reveal, .hero .reveal-mask").forEach((element) => {
      const delay = Number(element.dataset.delay || 0);
      window.setTimeout(() => element.classList.add("is-in"), delay);
    });
  }

  function revealSite() {
    /* غلاف الهيرو كان يُحمَّل مع الصفحة وهو خلف الباب — الآن يأتي عند كشفه */
    if (heroVideo && heroVideo.dataset.poster) {
      heroVideo.poster = heroVideo.dataset.poster;
      delete heroVideo.dataset.poster;
    }
    body.classList.remove("locked");
    site.classList.add("visible");
    /* الآن صار للواجهة عرض حقيقي — نقيس أسماء العرسان (نداء الإقلاع خرج فارغاً) */
    if (typeof fitHeroNames === "function") fitHeroNames();
    playHeroVideo(3000).catch(() => {});
    revealHeroText();
    if (typeof startPetals === "function") startPetals(20);   // بتلات تصميمي فوق المشهد
  }

  async function finishIntro() {
    if (!preloader || preloader.classList.contains("fade-out") || introFinishing) return;
    introFinishing = true;
    window.clearTimeout(introTimer);
    playHeroVideo(2500).catch(() => {});
    preloader.classList.add("whiteout");
    window.setTimeout(() => {
      revealSite();
      preloader.classList.add("fade-out");
      window.setTimeout(() => preloader.classList.add("hidden"), 950);
    }, 520);
  }

  if (preloaderPoster && preloaderVideo) {
    preloaderVideo.load();
    startProgressWatch();
    // أمان ضدّ التعلّق: فعّل الزر بعد ٦ ثوانٍ حتى لو لم يُطلق الفيديو حدث الجهوزية
    window.setTimeout(() => { if (!introStarting && !introFinishing) updatePreloaderProgress(100); }, 2500);
    /* متصفّحات آيفون لا تُحمّل الفيديو قبل لمسة الضيف، فيظلّ الشريط على ٠٪
       بلا طائل وينتظر الضيف انتظاراً لا ينتهي بشيء. فإن لم يبتلع العنصر
       بايتاً واحداً ولم يكن يُحمّل، الباب جاهز الآن — والتحميل يبدأ باللمسة. */
    window.setTimeout(() => {
      if (introStarting || introFinishing) return;
      if (preloaderVideo.readyState === 0 && preloaderVideo.networkState !== 2 && !preloaderVideo.buffered.length) {
        updatePreloaderProgress(100);
      }
    }, 1000);


    preloaderPoster.addEventListener("click", async () => {
      if (introStarting || introFinishing) return;
      /* ⚠️ لا تُبتلع ضغطة مبكّرة. كانت النقرة قبل جهوزية الباب — فيديو لم يُحمَّل بعد
         (شبكة بطيئة، آيفون لا يحمّل قبل اللمسة)، أو مشغّل موسيقى لم يجهز — تُتجاهَل
         بصمت، بينما تصل لمستُها مستمعَ الموسيقى على المستند فتنطلق الأغنية بلا أن
         يُفتح شيء، فيظنّ الضيف الزرّ معطوباً ويضغط ثانيةً بعد حين (شكوى ٢٠٢٦-٠٩-٢٢).
         الآن كل ضغطة تمضي في المسار نفسه: «جارٍ الفتح…» ثم انتظار الفيديو بمهلته
         داخل startPreloaderVideo، وحارس الثماني ثوانٍ يكشف الدعوة إن تعثّر —
         فالباب زينة والدعوة حقّ الضيف. */
      introStarting = true;
      preloaderPoster.classList.add("loading");
      preloaderPoster.setAttribute("aria-busy", "true");
      preloaderPoster.disabled = true;
      if (preloaderText) preloaderText.textContent = "جارٍ الفتح…";

      /* الفيديو أعلن عجزه سلفاً: لا معنى لانتظاره — تُكشف الدعوة الآن */
      if (doorFailed) { preloaderPoster.classList.add("hidden"); finishIntro(); return; }

      /* حارس النقرة: مهما تعثّر الفيديو لا يبقى الضيف أمام «جارٍ الفتح…».
         يُلغى فور انطلاق الباب، فالمشهد الطبيعي لا يُقصّ. */
      const openGuard = window.setTimeout(() => {
        if (introFinishing) return;
        preloaderPoster.classList.add("hidden");
        finishIntro();
      }, 8000);

      const introStarted = await startPreloaderVideo();
      window.clearTimeout(openGuard);
      if (introFinishing) return;                 /* الحارس سبقنا وكشف الدعوة */

      if (!introStarted) {
        /* الباب زينة، والدعوة حقّ الضيف: يُكشف المحتوى بلا مشهد الباب */
        introStarting = false;
        preloaderPoster.classList.add("hidden");
        finishIntro();
        return;
      }

      preloaderPoster.classList.add("hidden");
      window.setTimeout(() => { playHeroVideo(2500).catch(() => {}); }, 250);
      armIntroTimer();
      /* نقرة أثناء مشهد الباب = دخول فوري: من لا يريد انتظار المشهد لا يُجبَر */
      preloader.addEventListener("click", finishIntro, { once: true });
    });

    ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "progress", "suspend", "stalled", "timeupdate"].forEach((eventName) => {
      preloaderVideo.addEventListener(eventName, updatePreloaderProgress);
    });
    preloaderVideo.addEventListener("ended", finishIntro);
    preloaderVideo.addEventListener("error", failOpenDoor);

    // خطّاف اختبار: ?autoopen=1 ينقر الزر تلقائياً بعد جهوزية التحميل
    if (/[?&]autoopen=1/.test(location.search)) {
      const ao = window.setInterval(() => {
        if (preloaderPoster.classList.contains("is-ready")) { window.clearInterval(ao); preloaderPoster.click(); }
      }, 300);
    }
  } else {
    window.setTimeout(finishIntro, 600);
  }

  if (heroVideo) {
    ["loadeddata", "canplay", "playing"].forEach((eventName) => heroVideo.addEventListener(eventName, markHeroReady));
  }
  if (preloaderVideo) {
    ["loadeddata", "canplay", "playing"].forEach((eventName) => preloaderVideo.addEventListener(eventName, markPreloaderReady));
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && site && site.classList.contains("visible")) playHeroVideo(2500).catch(() => {});
  });
})();

/* قياس ديناميكي لاسمَي الهيرو: الاسم الطويل يصغر خطه ليملأ سطراً واحداً بلا التفاف ولا قصّ */
function fitHeroNames() {
  ["heroGroom", "heroBride"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.whiteSpace = "nowrap";
    el.style.fontSize = "";                          // نبدأ من حجم الـCSS الأصلي كل مرة
    /* بصيغة العمودين يُقاس الاسم على عرض عموده لا على عرض الواجهة كلها */
    var host = el.closest(".hero__col") || el.closest(".hero__content") || el.parentElement;
    /* الواجهة مخفيّة خلف الباب عند أول نداء فعرضها صفر — لا نقيس على عدم،
       وإلا صغّرنا الاسم إلى أدنى حدّ. revealSite ينادينا ثانيةً بعد الفتح. */
    if (!host || host.clientWidth < 40) return;
    var narrow = host.classList.contains("hero__col");
    var max = host.clientWidth - (narrow ? 6 : 28);
    var size = parseFloat(getComputedStyle(el).fontSize);
    var guard = 40;
    while (el.scrollWidth > max && size > 20 && guard--) {
      size -= 2;
      el.style.fontSize = size + "px";
    }
  });

  /* بصيغة العمودين: اسم أطول يصغر وحده فيطلع الاسمان بحجمين مختلفين جنب بعض.
     نوحّدهما على الأصغر كي يبقى الصفّ متّزناً. */
  if (document.querySelector(".hero--two-col")) {
    var sizes = ["heroGroom", "heroBride"].map(function (id) {
      var e = document.getElementById(id);
      return e ? parseFloat(getComputedStyle(e).fontSize) : Infinity;
    });
    var smallest = Math.min.apply(null, sizes);
    if (isFinite(smallest)) {
      ["heroGroom", "heroBride"].forEach(function (id) {
        var e = document.getElementById(id);
        if (e) e.style.fontSize = smallest + "px";
      });
    }
  }
}
var fitNamesTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(fitNamesTimer);
  fitNamesTimer = setTimeout(fitHeroNames, 150);
});

/* ---------------- تشغيل ملء المحتوى (DOM جاهز: defer / نهاية body) ---------------- */
fillContent();
fitHeroNames();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeroNames);
loadImages();
setupReveal();
setupCountdown();

/* مؤشّر تشخيص لحالة فيديو الطيور (؟debug=1) */
if (/[?&]debug=1/.test(location.search)) {
  const b = document.getElementById("heroVideo");
  const d = document.createElement("div");
  d.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(0,0,0,.85);color:#0f0;font:13px monospace;padding:6px;text-align:center";
  document.body.appendChild(d);
  setInterval(() => {
    if (!b) { d.textContent = "no hero el"; return; }
    d.textContent = "t=" + b.currentTime.toFixed(2) + " paused=" + b.paused + " rs=" + b.readyState + " err=" + (b.error ? b.error.code : 0) + " src=" + (b.currentSrc.split("/").pop() || "-");
  }, 400);
}

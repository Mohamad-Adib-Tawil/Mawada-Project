/* ============================================================
   قالب disney «ديزني» — خطوبة سحرية
   الدخول + الهيرو: محرّك مُجرّب (بوّابة ← تحميل ← توهّج كبير ← قصر)
   الأقسام: منطق البطاقة (ملء المحتوى + عدّاد + ظهور + بريق وفراشات)
   ============================================================ */

const WEDDING_CONFIG = (typeof window !== "undefined" && window.__INVITE__ && window.__INVITE__.config) || {
  groom: "علي",
  bride: "منار",

  date: "2026-12-18T19:00:00",
  dateText: "يوم الجمعة، ١٨ كانون الأول ٢٠٢٦",
  timeText: "الساعة السابعة مساءً",

  heroSub: "يتشرّفان بدعوتكم لمشاركتهما فرحة الخطوبة",

  verse: "على بركة الله وأطيب الأمنيات، تمّت خطوبتنا",

  invitationText: "بقلوبٍ مفعمةٍ بالفرح، نتشرّف بدعوتكم لحضور حفل خطوبتنا، لتكتمل فرحتنا بحضوركم الكريم.",

  groomParents: "نجل السيّد كريم عبد الله و السيّدة هدى",
  brideParents: "كريمة السيّد سامي حسن و السيّدة رنا",

  venueName: "قاعة الأميرة الكبرى",
  venueAddr: "بغداد — المنصور",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Baghdad",

  program: [
    { time: "٧:٠٠ مساءً", title: "استقبال الضيوف" },
    { time: "٧:٣٠ مساءً", title: "لحظة الخطوبة" },
    { time: "٨:٣٠ مساءً", title: "الكوكتيل والتصوير" },
    { time: "٩:٣٠ مساءً", title: "العشاء" },
    { time: "١٠:٣٠ مساءً", title: "السهرة" },
  ],

  notes: [
    "يُرجى الحضور قبل الموعد بنصف ساعة",
    "نتشرّف بحضوركم بأبهى حلّة",
    "الدعوة تشمل حاملها والعائلة الكريمة",
  ],

  closingNote: "حضوركم يزيّن فرحتنا",
  hashtag: "#علي_ومنار",
  contactLabel: "للاستفسار والتأكيد",
  contactName: "أبو علي",
  contactPhone: "+9647700000000",
  closingFamilies: "عائلة عبد الله  &  عائلة حسن",

  images: { venue: "", background: "" },
};

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  setText("heroGroom", c.groom);
  setText("heroBride", c.bride);
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

  document.title = `دعوة خطوبة ${c.groom} & ${c.bride}`;
}

function setText(id, value) { const el = document.getElementById(id); if (el && value != null) el.textContent = value; }

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
    li.innerHTML = `<span class="notes__mark" aria-hidden="true">✦</span><span>${txt}</span>`;
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
    link.href = `https://wa.me/${wa}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.innerHTML = `<span aria-hidden="true">☎</span> `;
    link.appendChild(document.createTextNode(c.contactName ? c.contactName : c.contactPhone));
  } else {
    const box = document.getElementById("contactBox");
    if (box) box.style.display = "none";
  }
}

/* ---------------- ظهور أقسام البطاقة ---------------- */
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

/* ---------------- بريق + فراشات + بتلات (تبدأ عند الكشف) ---------------- */
function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

function startSparkles(count) {
  if (reduced()) return;
  const layer = document.getElementById("sparkles");
  if (!layer || layer.dataset.on) return;
  layer.dataset.on = "1";
  const glyphs = ["✦", "✧", "⋆", "·", "✩"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = (7 + Math.random() * 12) + "px";
    s.style.setProperty("--tw", (2 + Math.random() * 3).toFixed(1) + "s");
    s.style.animationDelay = (Math.random() * 4).toFixed(1) + "s";
    layer.appendChild(s);
  }
}

/* فراشة مرسومة لا إيموجي: 🦋 زرقاء على آيفون، والإيموجي الملوّن لا يقبل
   `color` — فكانت تشذّ وحدها عن لوحة القالب الوردية (بتلاته ملوّنة بالفعل هكذا،
   لأن محارفها نصّية). الرسم بـcurrentColor فيأخذ لونه من اللوحة كالبتلات،
   ويبقى نفسه على كل جهاز بدل أن يتبدّل بخطّ إيموجي النظام.
   عرضه `1em` كي يبقى مقاسه على `font-size` نفسه الذي تستعمله الحركة. */
const BFLY_WING_UP = "M32 19 C 27 8, 16 1, 8.5 3.2 C 1.5 5.4, 1.2 16, 9 22.8 C 15 28, 25 30.2, 31.2 30.4 Z";
const BFLY_WING_LOW = "M31 31.4 C 22 32.4, 12.4 36.2, 11.4 43 C 10.6 49, 19 50.2, 25 45.2 C 29 41.8, 31.4 37.2, 32 34 Z";
const BFLY_BODY = "M32 15 C 33.4 16.6, 34 22, 34 30 C 34 38, 33.3 44.2, 32 46 C 30.7 44.2, 30 38, 30 30 C 30 22, 30.6 16.6, 32 15 Z";
const BFLY_ANTENNA = "M31.2 16.2 C 28.4 10.4, 24.6 7.2, 20.8 6.2";
function butterflySvg(ink) {
  const mirror = (d) => `<path d="${d}"/><g transform="translate(64,0) scale(-1,1)"><path d="${d}"/></g>`;
  return `<svg viewBox="0 0 64 52" width="1em" height="0.8125em" aria-hidden="true" focusable="false" style="display:block">
    <g fill="currentColor" stroke="${ink}" stroke-width="1.1" stroke-opacity=".55" stroke-linejoin="round">${mirror(BFLY_WING_UP)}${mirror(BFLY_WING_LOW)}</g>
    <g fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".7">${mirror(BFLY_ANTENNA)}</g>
    <path d="${BFLY_BODY}" fill="${ink}" fill-opacity=".85"/>
  </svg>`;
}

function startButterflies(count) {
  if (reduced()) return;
  const layer = document.getElementById("butterflies");
  if (!layer || layer.dataset.on) return;
  layer.dataset.on = "1";
  /* وردي كلّه بتدرّجاتٍ كفراشات المشهد — لا ليلكيّ بينها، وحبرُ كلٍّ أغمق درجةً من جناحها */
  const wings = ["#ef9fc9", "#e489bd", "#f8c3db", "#f2b3d4"];
  const inks  = ["#8a3f6b", "#7d3560", "#96547a", "#8f4a70"];
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "bfly";
    b.style.color = wings[i % wings.length];
    b.innerHTML = butterflySvg(inks[i % inks.length]);
    b.style.left = (5 + Math.random() * 85) + "%";
    b.style.bottom = (-6 - Math.random() * 8) + "%";
    b.style.fontSize = (16 + Math.random() * 16) + "px";
    b.style.setProperty("--fx", (Math.random() * 40 - 20) + "vw");
    b.style.setProperty("--fl", (12 + Math.random() * 9).toFixed(1) + "s");
    b.style.animationDelay = (Math.random() * 8).toFixed(1) + "s";
    b.style.filter = "drop-shadow(0 4px 6px rgba(150,80,140,.3))";
    layer.appendChild(b);
  }
}

function startPetals(count) {
  if (reduced()) return;
  const layer = document.getElementById("petals");
  if (!layer || layer.dataset.on) return;
  layer.dataset.on = "1";
  const glyphs = ["❀", "✿", "❁", "🌸"];
  const colors = ["#efb9d6", "#ded0f2", "#f7d9e8", "#e6bd74"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.color = colors[i % colors.length];
    s.style.fontSize = (10 + Math.random() * 14) + "px";
    s.style.animationDuration = (7 + Math.random() * 6) + "s";
    s.style.animationDelay = (Math.random() * 5) + "s";
    layer.appendChild(s);
  }
}

/* ============================================================
   محرّك الدخول السينمائي (مُجرّب) — بوّابة + شريط تحميل + توهّج كبير + قصر
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
  const preloaderProgress = $("#preloaderProgress");
  const preloaderProgressBar = $("#preloaderProgressBar");
  const preloaderPercent = $("#preloaderPercent");
  let introTimer = null;
  let progressTimer = null;
  let introStarting = false;
  let introFinishing = false;
  let doorReady = false;          /* جهوزية الباب تُثبَّت ولا تُنقض — انظر updatePreloaderProgress */
  let doorFailed = false;         /* الفيديو أعلن عجزه: لا نُجرّبه ثانيةً ولا نُبقي الضيف ينتظر */
  let siteRevealed = false;
  let heroPreparePromise = null;
  let heroRetryTimer = null;
  const HAVE_CURRENT_DATA = 2;
  const HAVE_FUTURE_DATA = 3;
  const HAVE_ENOUGH_DATA = 4;

  function waitForAny(target, events, timeoutMs) {
    return new Promise((resolve, reject) => {
      let timer = null;
      const cleanup = () => { events.forEach((e) => target.removeEventListener(e, done)); if (timer) window.clearTimeout(timer); };
      const done = (event) => { cleanup(); resolve(event); };
      events.forEach((e) => target.addEventListener(e, done, { once: true }));
      if (timeoutMs > 0) timer = window.setTimeout(() => { cleanup(); reject(new Error("media timeout")); }, timeoutMs);
    });
  }
  function hasFirstFrame(v) { return Boolean(v && v.readyState >= HAVE_CURRENT_DATA); }
  function clampPercent(v) { return Math.max(0, Math.min(100, Math.round(v))); }
  function ensureVideoSource(video) {
    if (!video) return;
    const src = video.dataset?.src;
    if (src && !video.getAttribute("src")) video.setAttribute("src", src);
  }

  function getBufferedPercent(video) {
    if (!video) return 0;
    if (video.readyState >= HAVE_ENOUGH_DATA) return 100;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0 || !video.buffered?.length) return hasFirstFrame(video) ? 35 : 0;
    let end = 0;
    for (let i = 0; i < video.buffered.length; i += 1) end = Math.max(end, video.buffered.end(i));
    return clampPercent((end / duration) * 100);
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
       بصمت — وتلك تحبسه في شاشة البداية، لأن مؤقّت الأمان يفعّل الزر ثم يمحو
       المراقبُ الدوريُّ تفعيلَه بعد ربع ثانية. */
    if (loadSettled || percent >= 100 || preloaderVideo.readyState >= HAVE_FUTURE_DATA) doorReady = true;
    const ready = doorReady;
    preloaderPoster.classList.toggle("is-ready", ready);
    if (preloaderProgressBar) preloaderProgressBar.style.setProperty("--progress", shownPercent.toFixed(1) + "%");
    if (preloaderProgress) preloaderProgress.setAttribute("aria-valuenow", String(percent));
    if (preloaderPercent) preloaderPercent.textContent = `${percent}%`;
    if (shownPercent < 100) startProgressWatch();   /* الحلقة تُكمل الصعود ولو أُوقفت */
    if (introStarting || introFinishing) return;
    if (preloaderText) preloaderText.textContent = ready ? "اضغط لفتح البوّابة" : "جارٍ التحميل…";
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

  function timeoutValue(ms, value = false) { return new Promise((resolve) => window.setTimeout(() => resolve(value), ms)); }
  function isTouchPhone() {
    const ua = navigator.userAgent || "";
    return /[?&]mobilehero=1/.test(location.search) || /iPhone|iPad|iPod|Android/i.test(ua) || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }

  async function waitForMediaReady(video, timeoutMs = 6000) {
    if (!video) return false;
    if (hasFirstFrame(video)) return true;
    ensureVideoSource(video);
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

  function setupHeroVideoElement() {
    if (!heroVideo) return;
    ensureVideoSource(heroVideo);
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.loop = true;
    heroVideo.autoplay = true;
    heroVideo.playsInline = true;
    heroVideo.preload = "auto";
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");
  }

  function prepareHeroVideo() {
    if (!heroVideo) return Promise.resolve(false);
    if (heroPreparePromise) return heroPreparePromise;
    setupHeroVideoElement();
    heroPreparePromise = waitForMediaReady(heroVideo, 7000).then((ready) => { if (ready) markHeroReady(); else heroPreparePromise = null; return ready; });
    return heroPreparePromise;
  }

  async function startVideoPlayback(video, timeoutMs = 4500) {
    if (!video) return false;
    if (!video.paused && !video.ended) return true;
    try {
      const p = video.play();
      if (p && typeof p.then === "function") await Promise.race([p, waitForAny(video, ["playing", "timeupdate"], timeoutMs)]);
      else await waitForAny(video, ["playing", "timeupdate"], timeoutMs);
    } catch { return false; }
    return !video.paused || video.currentTime > 0;
  }

  function stopPreloaderVideo() {
    if (!preloaderVideo) return;
    try { preloaderVideo.pause(); } catch { /* تجاهل */ }
    try { preloaderVideo.removeAttribute("src"); preloaderVideo.load(); } catch { /* تجاهل */ }
  }

  async function playHeroVideo(timeoutMs = 4500) {
    if (!heroVideo) return false;
    setupHeroVideoElement();
    await Promise.race([prepareHeroVideo(), timeoutValue(timeoutMs)]);
    if (hasFirstFrame(heroVideo)) markHeroReady();
    if (!heroVideo.paused && !heroVideo.ended) return true;
    const started = await startVideoPlayback(heroVideo, timeoutMs);
    markHeroReady();
    return started || hasFirstFrame(heroVideo);
  }

  function keepHeroPlaying(durationMs = 9000) {
    if (!heroVideo) return;
    window.clearInterval(heroRetryTimer);
    const stopAt = Date.now() + durationMs;
    const tick = () => {
      if (!site || !site.classList.contains("visible")) return;
      playHeroVideo(1400).catch(() => {});
      if (Date.now() >= stopAt || (!heroVideo.paused && heroVideo.readyState >= HAVE_FUTURE_DATA)) {
        window.clearInterval(heroRetryTimer);
      }
    };
    tick();
    heroRetryTimer = window.setInterval(tick, 900);
  }

  async function startPreloaderVideo() {
    ensureVideoSource(preloaderVideo);
    preloaderVideo.muted = true;
    preloaderVideo.playsInline = true;
    preloaderVideo.preload = "auto";
    await waitForMediaReady(preloaderVideo, 8000);
    markPreloaderReady();
    updatePreloaderProgress(100);
    try { preloaderVideo.currentTime = 0; } catch { /* بعض المتصفحات ترفض seek مبكراً */ }
    const started = await startVideoPlayback(preloaderVideo, 7000);
    markPreloaderReady();
    updatePreloaderProgress(100);
    return started;
  }

  function armIntroTimer() {
    window.clearTimeout(introTimer);
    const duration = Number.isFinite(preloaderVideo.duration) && preloaderVideo.duration > 0 ? preloaderVideo.duration : 6;
    const currentTime = Number.isFinite(preloaderVideo.currentTime) ? preloaderVideo.currentTime : 0;
    const remainingMs = Math.max(2200, Math.ceil((duration - currentTime) * 1000) + 700);
    introTimer = window.setTimeout(finishIntro, remainingMs);
  }

  function revealHeroText() {
    $$(".hero .reveal, .hero .reveal-mask").forEach((el) => {
      const delay = Number(el.dataset.delay || 0);
      window.setTimeout(() => el.classList.add("is-in"), delay);
    });
  }

  function revealSite() {
    if (siteRevealed) { keepHeroPlaying(5000); return; }
    siteRevealed = true;
    body.classList.remove("locked");
    site.classList.add("visible");
    playHeroVideo(3000).catch(() => {});
    keepHeroPlaying();
    revealHeroText();
    if (typeof startSparkles === "function") startSparkles(46);
    if (typeof startButterflies === "function") startButterflies(9);
    if (typeof startPetals === "function") startPetals(16);
  }

  async function finishIntro() {
    if (!preloader || preloader.classList.contains("fade-out") || introFinishing) return;
    introFinishing = true;
    window.clearTimeout(introTimer);
    playHeroVideo(2500).catch(() => {});
    // توهّج سحري كبير ينفجر أولاً، ثم يبيّض، ثم الانتقال للواجهة
    preloader.classList.add("glow");
    window.setTimeout(() => preloader.classList.add("whiteout"), 500);
    window.setTimeout(() => {
      revealSite();
      preloader.classList.add("fade-out");
      /* ⚠️ بلعُ الفيديو بعد إخفاء الشاشة لا قبل الشعاع. `stopPreloaderVideo`
         تفعل removeAttribute("src")+load()، وذلك يرتدّ بالعنصر إلى **ملصقه** —
         الباب مغلقاً — فكان الضيف يرى المشهد يرجع إلى بدايته تحت شعاعٍ شفافيته
         ما زالت تتدرّج (٠٫٥٥ث). أخواه لا يفعلانها أصلاً: classic يترك آخر إطار،
         وvangogh يكتفي بـpause(). أُبقيت هنا لتحرير مفكّك الترميز — مؤجَّلةً
         إلى ما بعد `hidden` حيث لا يُرى شيء (شكوى كرار ٢٠٢٦-٠٩-٢٦). */
      window.setTimeout(() => { preloader.classList.add("hidden"); stopPreloaderVideo(); }, 1000);
    }, 1080);
  }

  function openHeroDirectlyForPhone() {
    if (!preloader || introFinishing) return;
    introFinishing = true;
    window.clearTimeout(introTimer);
    stopProgressWatch();
    setupHeroVideoElement();
    revealSite();
    startVideoPlayback(heroVideo, 2400).catch(() => {});
    keepHeroPlaying(12000);
    preloaderPoster.classList.add("hidden");
    preloader.classList.add("glow");
    window.setTimeout(() => preloader.classList.add("whiteout"), 120);
    window.setTimeout(() => {
      preloader.classList.add("fade-out");
      /* كما في finishIntro: البلع بعد الإخفاء، وإلا ارتدّ الباب إلى ملصقه أمام الضيف */
      window.setTimeout(() => { preloader.classList.add("hidden"); stopPreloaderVideo(); }, 700);
    }, 520);
  }

  if (preloaderPoster && preloaderVideo) {
    ensureVideoSource(preloaderVideo);
    preloaderVideo.load();
    startProgressWatch();
    // أمان ضدّ التعلّق: فعّل الزر بعد ثانيتين حتى لو لم يُطلق الفيديو حدث الجهوزية
    window.setTimeout(() => { if (!introStarting && !introFinishing) updatePreloaderProgress(100); }, 2000);
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

      prepareHeroVideo().catch(() => {});
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
      window.setTimeout(() => { playHeroVideo(2500).catch(() => {}); keepHeroPlaying(5000); }, 250);
      armIntroTimer();
      /* نقرة أثناء مشهد الباب = دخول فوري: من لا يريد انتظار المشهد لا يُجبَر */
      preloader.addEventListener("click", finishIntro, { once: true });
    });

    ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "progress", "suspend", "stalled", "timeupdate"].forEach((e) => {
      preloaderVideo.addEventListener(e, updatePreloaderProgress);
    });
    preloaderVideo.addEventListener("ended", finishIntro);
    preloaderVideo.addEventListener("error", failOpenDoor);

    if (/[?&]autoopen=1/.test(location.search)) {
      const ao = window.setInterval(() => {
        if (preloaderPoster.classList.contains("is-ready")) { window.clearInterval(ao); preloaderPoster.click(); }
      }, 300);
    }
  } else {
    window.setTimeout(finishIntro, 600);
  }

  window.setTimeout(() => { prepareHeroVideo().catch(() => {}); }, isTouchPhone() ? 250 : 650);

  if (heroVideo) ["loadeddata", "canplay", "playing", "timeupdate"].forEach((e) => heroVideo.addEventListener(e, markHeroReady));
  if (preloaderVideo) ["loadeddata", "canplay", "playing"].forEach((e) => preloaderVideo.addEventListener(e, markPreloaderReady));

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && site && site.classList.contains("visible")) keepHeroPlaying(5000);
  });
  window.addEventListener("pageshow", () => { if (site && site.classList.contains("visible")) keepHeroPlaying(5000); });
  ["pointerdown", "touchstart", "click"].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      if (site && site.classList.contains("visible") && heroVideo && heroVideo.paused) playHeroVideo(1600).catch(() => {});
    }, { passive: true });
  });
})();

/* ---------------- تشغيل ملء المحتوى ---------------- */
fillContent();
loadImages();
setupReveal();
setupCountdown();

/* مؤشّر تشخيص (؟debug=1) */
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

/* ============================================================
   قالب clouds — الإعدادات والتفاعل (بشارة مولود جديد، سماء نهارية ناعمة)
   عدّل بيانات المولود من WEDDING_CONFIG في الأسفل فقط.
   ============================================================ */

const WEDDING_CONFIG = window.__INVITE__?.config;

/* ---------------- أرقام عربية-هندية ---------------- */
const AR_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
function toAr(s) { return String(s).replace(/[0-9]/g, (d) => AR_DIGITS[+d]); }

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  const babyName = c.celebrant || c.babyName || "";   // مولود: الاسم من celebrant/babyName فقط — لا groom الزفافي
  const parents = c.parents || "";

  setText("celebrantName", babyName || null);
  setText("englishName", c.englishName || "");
  setText("parentsLine", parents ? `الوالدان: ${parents}` : "");
  setText("birthDateLabel", c.birthDateText ? `تاريخ الميلاد: ${c.birthDateText}` : "");

  // صورة المولود في الترويسة — تظهر فقط عند تحميل صورة بنجاح
  const _imgs = (c.images) || {};
  const _src = _imgs.hero;
  const _box = document.getElementById('heroPhoto');
  const _im = document.getElementById('heroPhotoImg');
  if (_box && _im && _src) {
    _im.onload = function () { _box.classList.add('is-shown'); };
    _im.onerror = function () { _box.classList.remove('is-shown'); };
    _im.src = _src;
  }

  // خلفية اختيارية بحواف متلاشية خلف الغلاف والترويسة — تظهر فقط عند تحميلها بنجاح
  const _bg = (c.images && c.images.background);
  ['coverBg', 'heroBg'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el && _bg) {
      const p = new Image();
      p.onload = function () { el.style.backgroundImage = 'url("' + _bg + '")'; el.classList.add('is-shown'); };
      p.onerror = function () { el.classList.remove('is-shown'); };
      p.src = _bg;
    }
  });

  // صورة القاعة — تحلّ محلّ الرسم اليدوي، وتظهر فقط عند تحميلها بنجاح
  const _venue = _imgs.venue;
  const _venueEl = document.getElementById('venuePhoto');
  if (_venueEl && _venue) {
    const vp = new Image();
    vp.onload = function () {
      _venueEl.style.backgroundImage = 'url("' + _venue + '")';
      _venueEl.classList.add('has-img');
      const art = document.querySelector('.venue__art');
      if (art) art.style.display = 'none';
    };
    vp.src = _venue;
  }

  setText("heroKicker", c.heroSub || "بشرى سارة");
  setText("heroGreet", `أهلاً بـ ${babyName}`);
  setText("heroVerse", c.verse);
  setText("heroDate", [c.dateText, c.timeText].filter(Boolean).join(" • "));
  setText("invitationText", c.invitationText);
  setText("venueDate", c.dateText);
  setText("venueTime", c.timeText);
  setText("venueName", c.venueName);
  setText("venueAddr", c.venueAddr);
  setText("closingNote", c.closingNote);
  setText("closingHashtag", c.hashtag);
  setText("closingHost", c.closingHost || (parents ? `بدعوة من ${parents}` : ""));

  // الوزن — يظهر فقط إن وُجد
  const weightWrap = document.getElementById("weightWrap");
  if (weightWrap) {
    if (c.weight != null && String(c.weight).trim() !== "") {
      setText("weightNum", toAr(c.weight));
      weightWrap.hidden = false;
    } else {
      weightWrap.hidden = true;
    }
  }

  const mapBtn = document.getElementById("mapBtn");
  if (mapBtn && c.mapUrl) mapBtn.href = c.mapUrl;
  else if (mapBtn) mapBtn.style.display = "none";

  const mono = document.getElementById("coverMono");
  if (mono && babyName) mono.textContent = `أهلاً بـ ${babyName}`;

  buildTimeline(c.program);
  buildNotes(c.notes);
  if (!Array.isArray(c.program) || c.program.length === 0) document.getElementById("programSection")?.remove();
  if (!Array.isArray(c.notes) || c.notes.length === 0) document.getElementById("notesSection")?.remove();
  buildContact(c);
  applyGender(c.gender);

  if (babyName) document.title = `بشارة مولود — ${babyName}`;
}

/* ---------------- لمسة المولود (ولد/بنت/حياد) ---------------- */
function applyGender(gender) {
  const root = document.documentElement;
  root.classList.remove("is-boy", "is-girl");
  if (gender === "boy") root.classList.add("is-boy");
  else if (gender === "girl") root.classList.add("is-girl");
  // غير محدّد → تبقى الألوان السماوية المحايدة الافتراضية
}

function setText(id, value) { const el = document.getElementById(id); if (el && value != null) el.textContent = value; }

function buildTimeline(items) {
  const ul = document.getElementById("timeline");
  if (!ul || !Array.isArray(items)) return;
  ul.innerHTML = "";
  items.forEach((it) => {
    const li = document.createElement("li");
    li.className = "timeline__item";
    const dot = document.createElement("span");
    dot.className = "timeline__dot";
    dot.setAttribute("aria-hidden", "true");
    const time = document.createElement("span");
    time.className = "timeline__time";
    time.textContent = it.time || "";
    const title = document.createElement("span");
    title.className = "timeline__title";
    title.textContent = it.title || "";
    li.append(dot, time, title);
    ul.appendChild(li);
  });
}

function buildNotes(items) {
  const ul = document.getElementById("notesList");
  if (!ul || !Array.isArray(items)) return;
  ul.innerHTML = "";
  const marks = ["🍼", "☁️", "🎈", "⭐", "🤍"];
  items.forEach((txt, i) => {
    const li = document.createElement("li");
    li.className = "notes__item";
    const mark = document.createElement("span");
    mark.className = "notes__mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = marks[i % marks.length];
    const text = document.createElement("span");
    text.textContent = txt;
    li.append(mark, text);
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
  const label = document.getElementById("contactLabel");
  if (label && c.contactLabel) label.textContent = c.contactLabel;
  if (!link) return;
  if (c.whatsappUrl) {
    link.href = c.whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = c.contactName || c.whatsappUrl;
  } else {
    const box = document.getElementById("contactBox");
    if (box) box.style.display = "none";
  }
}

/* ---------------- غيوم وفقاعات ناعمة تطفو على الغلاف ---------------- */
function buildCoverSky(count) {
  if (reduced()) return;
  const layer = document.getElementById("coverSky");
  if (!layer) return;
  const glyphs = ["☁️", "🎈", "⭐", "🤍", "🍼", "✨"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = (12 + Math.random() * 16) + "px";
    s.style.animationDuration = (7 + Math.random() * 7) + "s";
    s.style.animationDelay = (Math.random() * 7) + "s";
    layer.appendChild(s);
  }
}

/* ---------------- فتح الغلاف: البالون يرتفع ثم تنكشف البشارة ---------------- */
function setupCover() {
  const cover = document.getElementById("cover");
  const invite = document.getElementById("invite");
  const btn = document.getElementById("openBtn");
  const scene = document.querySelector(".skySvg");
  if (!cover || !btn || !invite) return;
  btn.addEventListener("click", () => {
    if (scene) scene.classList.add("is-lift");
    const liftDur = reduced() ? 0 : 950;
    setTimeout(() => {
      cover.classList.add("is-open");
      invite.setAttribute("aria-hidden", "false");
      revealFirst();
      startFloaties(28);
    }, liftDur);
    setTimeout(() => { cover.style.display = "none"; }, liftDur + 1100);
  }, { once: true });
}

/* ---------------- ظهور الأقسام ---------------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => obs.observe(el));
}
function revealFirst() { document.querySelectorAll(".hero.reveal").forEach((el) => el.classList.add("is-visible")); }

/* ---------------- العدّاد التنازلي ---------------- */
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
function pad(n) { return toAr(String(n).padStart(2, "0")); }
function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

/* ---------------- غيوم وبالونات تطفو عند الفتح ---------------- */
function startFloaties(count) {
  if (reduced()) return;
  const layer = document.getElementById("floaties");
  if (!layer) return;
  const glyphs = ["☁️", "🎈", "⭐", "🤍", "🍼", "✨", "🕊️"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "floaty";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = (14 + Math.random() * 18) + "px";
    s.style.animationDuration = (7 + Math.random() * 7) + "s";
    s.style.animationDelay = (Math.random() * 4) + "s";
    layer.appendChild(s);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillContent();
  buildCoverSky(20);
  setupCover();
  setupReveal();
  setupCountdown();
});

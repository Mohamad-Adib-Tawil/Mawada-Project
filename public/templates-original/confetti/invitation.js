/* ============================================================
   قالب confetti — عيد ميلاد: الإعدادات والتفاعل
   عدّل بيانات الحفلة من WEDDING_CONFIG في الأسفل فقط.
   ============================================================ */

const WEDDING_CONFIG = (typeof window!=="undefined" && window.__INVITE__ && window.__INVITE__.config) || {
  // ===== الأساسيات (عيد ميلاد) =====
  groom: "لمار",            // اسم صاحب/صاحبة عيد الميلاد (الاسم الكبير)
  bride: "عائلة الجبوري",   // المضيف / العائلة
  celebrant: "لمار",        // نفس groom
  age: 7,                    // العمر (رقم) — اختياري
  host: "عائلة الجبوري",

  // تاريخ ووقت الحفلة: YYYY-MM-DDTHH:MM:SS (نظام 24 ساعة) — لازم مستقبلي
  date: "2026-09-12T17:00:00",
  dateText: "يوم السبت، ١٢ أيلول ٢٠٢٦",
  timeText: "الساعة الخامسة عصراً",

  // ===== تحية افتتاحية =====
  verse: "عامٌ جديد من الضحكة والفرح — تعالوا نحتفل 🎉",

  heroSub: "ندعوكم لمشاركتنا الفرح",

  // ===== نص الدعوة =====
  invitationText: "بقلوبٍ مليئة بالفرح، ندعوكم لمشاركتنا أجمل لحظة في حياة صغيرتنا، حفل عيد ميلادها. وجودكم يرسم البسمة ويزيّن فرحتنا، فكونوا معنا لنحتفل سويّاً.",

  // ===== القاعة =====
  venueName: "قاعة فرح لاند للأطفال",
  venueAddr: "بغداد — المنصور، شارع الأميرات",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Baghdad",

  // ===== برنامج الحفلة =====
  program: [
    { time: "٥:٠٠ عصراً", title: "استقبال الضيوف والأطفال" },
    { time: "٦:٠٠ مساءً", title: "الألعاب والفقرات الترفيهية" },
    { time: "٧:٠٠ مساءً", title: "قصّ الكيكة وإطفاء الشموع" },
    { time: "٨:٠٠ مساءً", title: "العشاء وتوزيع الهدايا" },
  ],

  // ===== ملاحظات =====
  notes: [
    "الدعوة تشمل الأطفال، فأحضروا صغاركم للّعب",
    "يُرجى الحضور في الموعد لنبدأ المرح سويّاً",
    "التصوير مسموح، شاركونا أحلى اللقطات",
  ],

  // ===== الخاتمة =====
  closingNote: "بوجودكم تكتمل فرحتنا",
  hashtag: "#عيد_ميلاد_لمار",
  contactLabel: "للاستفسار والتأكيد",
  contactName: "أبو لمار",
  contactPhone: "+9647700000000",   // رقم التواصل (واتساب)
  host: "بدعوة من عائلة الجبوري",

  images: { hero: "assets/hero.jpg", venue: "assets/venue.jpg" },
};

/* ---------------- أرقام عربية-هندية ---------------- */
const AR_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
function toArabic(input) { return String(input).replace(/[0-9]/g, (d) => AR_DIGITS[+d]); }

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  const name = c.celebrant || "";   // عيد ميلاد: الاسم من celebrant فقط — لا نتراجع لـ groom الزفافي
  const host = c.host || c.bride;

  setText("celebrantName", name || null);
  setText("coverLabel", `دعوة ${c.occasion || "مناسبة"}`);
  setText("heroKicker", `حفل ${c.occasion || "المناسبة"}`);

  // صورة الطفل في الترويسة — تظهر فقط عند توفّر صورة صالحة
  const _imgs = (c.images) || {};
  const _src = _imgs.hero;
  const _box = document.getElementById('heroPhoto');
  const _im = document.getElementById('heroPhotoImg');
  if (_box && _im && _src) {
    _im.onload = function () { _box.classList.add('is-shown'); };
    _im.onerror = function () { _box.classList.remove('is-shown'); };
    _im.src = _src;
  }

  // خلفية صورة اختيارية بحواف متلاشية خلف الغلاف والترويسة — تظهر فقط عند نجاح التحميل
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

  // صورة القاعة من الزبون — تحلّ محلّ الرسمة، وتظهر فقط عند نجاح التحميل
  const _venue = _imgs.venue;
  const _vEl = document.getElementById('venuePhoto');
  if (_vEl && _venue) {
    const vp = new Image();
    vp.onload = function () {
      _vEl.style.backgroundImage = 'url("' + _venue + '")';
      _vEl.classList.add('has-img');
      const card = _vEl.closest('.venue');
      const art = card && card.querySelector('.venue__art');
      if (art) art.style.display = 'none';
    };
    vp.src = _venue;
  }

  setText("heroGreet", `${c.occasion || "مناسبة"} ${c.celebrant || c.groom}`);
  setText("heroDate", [c.dateText, c.timeText].filter(Boolean).join(" • "));
  setText("invitationText", c.invitationText);
  setText("weddingDate", c.dateText);
  setText("weddingTime", c.timeText);
  setText("calendarDateText", c.dateText);
  setText("calendarTimeText", c.timeText);
  setText("venueName", c.venueName);
  setText("venueAddr", c.venueAddr);
  setText("closingNote", c.closingNote);
  setText("closingHashtag", c.hashtag);
  setText("closingHost", host);

  // العمر على شارة دائرية (إن وُجد)
  const ageWrap = document.getElementById("ageWrap");
  if (ageWrap) {
    const age = c.age;
    if (age != null && age !== "" && !isNaN(Number(age))) {
      setText("ageNum", toArabic(age));
      setText("ageLbl", Number(age) <= 10 ? "سنوات" : "سنة");
      ageWrap.hidden = false;
    } else {
      ageWrap.hidden = true;
    }
  }

  const mapBtn = document.getElementById("mapBtn");
  if (mapBtn && c.mapUrl) mapBtn.href = c.mapUrl;
  else if (mapBtn) mapBtn.style.display = "none";

  const mono = document.getElementById("coverMono");
  if (mono && name) mono.textContent = name;

  buildTimeline(c.program);
  buildNotes(c.notes);
  buildContact(c);

  if (name) document.title = `دعوة ${c.occasion || "مناسبة"} ${name}`;
  const description = [c.dateText, c.venueName].filter(Boolean).join(" • ");
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  if (c.shareImage) document.querySelector('meta[property="og:image"]')?.setAttribute("content", c.shareImage);
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
  const marks = ["🎈","🎁","🎊","🧁","⭐"];
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
  const label = document.querySelector(".contact__label");
  if (label && c.contactLabel) label.textContent = c.contactLabel;
  if (!link) return;
  if (c.contactPhone) {
    const wa = c.contactPhone.replace(/[^0-9]/g, "");
    link.href = `https://wa.me/${wa}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = c.contactName ? c.contactName : c.contactPhone;
  } else {
    const box = document.getElementById("contactBox");
    if (box) box.style.display = "none";
  }
}

/* ---------------- القصاصات الملوّنة ---------------- */
const CONFETTI_COLORS = ["#ff5d73", "#ffd23f", "#2dd4bf", "#7b5cff", "#ff8aa0", "#f4a000"];
function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

/* انفجار القصاصات من الجوانب/الأعلى عند الفتح */
function confettiBurst(count) {
  if (reduced()) return;
  const layer = document.getElementById("confetti");
  if (!layer) return;
  const vw = window.innerWidth, vh = window.innerHeight;
  // ثلاث مصادر: بوّاقة يسار، بوّاقة يمين، وفوق
  const sources = [
    { x: vw * 0.08, y: vh * 0.88, ang: -60, spread: 50 },  // يسار للأعلى
    { x: vw * 0.92, y: vh * 0.88, ang: -120, spread: 50 }, // يمين للأعلى
    { x: vw * 0.5,  y: -10,       ang: 90,  spread: 70 },  // من فوق للأسفل
  ];
  for (let i = 0; i < count; i++) {
    const src = sources[i % sources.length];
    const isStreamer = Math.random() < 0.18;
    const piece = document.createElement("span");
    piece.className = isStreamer ? "streamer streamer--burst" : "confetto confetto--burst";
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.background = color;
    if (!isStreamer && Math.random() < 0.4) piece.style.borderRadius = "50%";
    piece.style.left = src.x + "px";
    piece.style.top = src.y + "px";
    const angle = (src.ang + (Math.random() * src.spread - src.spread / 2)) * Math.PI / 180;
    const dist = 180 + Math.random() * (Math.max(vw, vh) * 0.7);
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist + (Math.random() * vh * 0.4);
    piece.style.setProperty("--tx", tx.toFixed(0) + "px");
    piece.style.setProperty("--ty", ty.toFixed(0) + "px");
    piece.style.setProperty("--rot", (Math.random() * 1080 - 540).toFixed(0) + "deg");
    piece.style.setProperty("--dur", (1.3 + Math.random() * 1.4).toFixed(2) + "s");
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

/* انسياب هادئ مستمر للقصاصات في الخلفية */
function confettiDrift(count) {
  if (reduced()) return;
  const layer = document.getElementById("confetti");
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetto confetto--drift";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    if (Math.random() < 0.4) piece.style.borderRadius = "50%";
    piece.style.left = (Math.random() * 100) + "%";
    piece.style.setProperty("--sway", (Math.random() * 80 - 40).toFixed(0) + "px");
    piece.style.setProperty("--dur", (7 + Math.random() * 7).toFixed(1) + "s");
    piece.style.animationDelay = (Math.random() * 8).toFixed(1) + "s";
    layer.appendChild(piece);
  }
}

/* ---------------- فتح الغلاف ---------------- */
function setupCover() {
  const cover = document.getElementById("cover");
  const invite = document.getElementById("invite");
  const btn = document.getElementById("openBtn");
  if (!cover || !btn || !invite) return;
  btn.addEventListener("click", () => {
    confettiBurst(140);                  // الانفجار الكبير أولاً
    setTimeout(() => {
      cover.classList.add("is-open");
      invite.setAttribute("aria-hidden", "false");
      revealFirst();
      confettiDrift(26);                 // انسياب لطيف في الخلفية
    }, 250);
    setTimeout(() => { cover.style.display = "none"; }, 1000);
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
function pad(n) { return toArabic(String(n).padStart(2, "0")); }

document.addEventListener("DOMContentLoaded", () => {
  fillContent();
  setupCover();
  setupReveal();
  setupCountdown();
});

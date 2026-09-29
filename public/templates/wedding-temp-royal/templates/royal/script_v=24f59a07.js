/* ============================================================
   قالب royal — الإعدادات والتفاعل
   عدّل بيانات العرس من WEDDING_CONFIG في الأسفل فقط.
   ============================================================ */

const WEDDING_CONFIG = window.__INVITE__.config;

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  setText("groomName", c.groom);
  setText("brideName", c.bride);
  setText("heroDate", [c.dateText, c.timeText].filter(Boolean).join(" • "));
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
  if (mapBtn && c.mapUrl) mapBtn.href = c.mapUrl;
  else if (mapBtn) mapBtn.style.display = "none";

  const mono = document.getElementById("crestMono");
  if (mono) mono.textContent = `${firstLetter(c.bride)} ${firstLetter(c.groom)}`;
  const coverNames = document.getElementById("coverNames");
  if (coverNames) coverNames.textContent = [c.groom, c.bride].filter(Boolean).join(" & ");

  const _imgs = (WEDDING_CONFIG.images) || {};
  const _src = _imgs.hero;
  const _box = document.getElementById("heroPhoto");
  const _im = document.getElementById("heroPhotoImg");
  if (_box && _im && _src) {
    _im.onload = function () { _box.classList.add("is-shown"); };
    _im.onerror = function () { _box.classList.remove("is-shown"); };
    _im.src = _src;
  }

  // خلفية مخصّصة اختيارية بحواف متلاشية خلف الغلاف والواجهة — تظهر فقط عند نجاح التحميل
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

  buildTimeline(c.program);
  buildNotes(c.notes);
  buildContact(c);
  document.title = `دعوة زفاف ${[c.groom, c.bride].filter(Boolean).join(" & ")}`;
}
function setText(id, value) { const el = document.getElementById(id); if (el && value != null) el.textContent = value; }
function firstLetter(name) { return (name || "").trim().charAt(0) || ""; }

function buildTimeline(items) {
  const ul = document.getElementById("timeline");
  if (!ul || !Array.isArray(items)) return;
  ul.innerHTML = "";
  items.forEach((it) => {
    const li = document.createElement("li");
    li.className = "timeline__item";
    li.innerHTML = `<span class="timeline__dot" aria-hidden="true"></span>
      <span class="timeline__time">${it.time}</span><span class="timeline__title">${it.title}</span>`;
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
  const contactUrl = c.whatsappUrl || (c.contactPhone ? `https://wa.me/${c.contactPhone.replace(/[^0-9]/g, "")}` : "");
  if (contactUrl) {
    link.href = contactUrl;
    link.target = "_blank"; link.rel = "noopener";
    link.textContent = c.contactName || c.contactPhone || contactUrl;
  } else { document.getElementById("contactBox").style.display = "none"; }
}

/* ---------------- الصور التلقائية ---------------- */
function loadImages() {
  const imgs = WEDDING_CONFIG.images || {};
  applyImg(imgs.venue, (s) => { const el = document.getElementById("venuePhoto"); const v = document.querySelector(".venue"); if (el) el.style.backgroundImage = `url("${s}")`; if (v) v.classList.add("has-photo"); });
}
function applyImg(src, cb) { if (!src) return; const i = new Image(); i.onload = () => cb(src); i.src = src; }

/* ---------------- جزيئات ذهبية ---------------- */
function buildParticles(n) {
  if (reduced()) return;
  const layer = document.getElementById("particles");
  if (!layer) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "pt";
    p.style.left = Math.random() * 100 + "%";
    const s = 2 + Math.random() * 4;
    p.style.width = p.style.height = s + "px";
    p.style.animationDuration = (9 + Math.random() * 10) + "s";
    p.style.animationDelay = (Math.random() * 12) + "s";
    layer.appendChild(p);
  }
}

/* ---------------- أشعة الماندالا ---------------- */
function buildMandala() {
  const g = document.querySelector(".m-rays");
  if (!g) return;
  const cx = 200, cy = 200;
  for (let a = 0; a < 360; a += 15) {
    const r = a % 30 === 0 ? 150 : 120;
    const ang = a * Math.PI / 180;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx + 92 * Math.cos(ang));
    line.setAttribute("y1", cy + 92 * Math.sin(ang));
    line.setAttribute("x2", cx + r * Math.cos(ang));
    line.setAttribute("y2", cy + r * Math.sin(ang));
    line.setAttribute("opacity", "0.5");
    g.appendChild(line);
  }
}

/* ---------------- فتح الستارة ---------------- */
function setupTheater() {
  const theater = document.getElementById("theater");
  const invite = document.getElementById("invite");
  const btn = document.getElementById("openBtn");
  const hero = document.querySelector(".hero");
  if (!theater || !btn || !invite) return;
  btn.addEventListener("click", () => {
    // الستارتان تنزلقان جانبياً فتظهر صفحة الدعوة خلفهما مباشرة
    theater.classList.add("is-open");
    invite.setAttribute("aria-hidden", "false");
    if (hero) { hero.classList.add("play"); hero.classList.add("is-visible"); }
    setTimeout(() => { theater.style.display = "none"; }, 1450);
  }, { once: true });
}

/* ---------------- ظهور الأقسام ---------------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach((el) => obs.observe(el));
}

/* ---------------- العدّاد التنازلي ---------------- */
function setupCountdown() {
  const target = new Date(WEDDING_CONFIG.date).getTime();
  if (isNaN(target)) return;
  const els = { days: el("cdDays"), hours: el("cdHours"), mins: el("cdMins"), secs: el("cdSecs") };
  const cd = document.getElementById("countdown");
  const arrived = document.getElementById("cdArrived");
  const prev = {};
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { if (cd) cd.hidden = true; if (arrived) arrived.hidden = false; clearInterval(t); return; }
    set(els.days, pad(Math.floor(diff / 86400000)), "days");
    set(els.hours, pad(Math.floor((diff % 86400000) / 3600000)), "hours");
    set(els.mins, pad(Math.floor((diff % 3600000) / 60000)), "mins");
    set(els.secs, pad(Math.floor((diff % 60000) / 1000)), "secs");
  }
  function set(node, val, key) {
    if (!node || prev[key] === val) return;
    prev[key] = val; node.textContent = val;
    if (reduced()) return;
    node.classList.remove("flip"); void node.offsetWidth; node.classList.add("flip");
  }
  const t = setInterval(tick, 1000); tick();
}
function el(id) { return document.getElementById(id); }
function pad(n) { return String(n).padStart(2, "0"); }
function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

document.addEventListener("DOMContentLoaded", () => {
  fillContent();
  loadImages();
  buildParticles(34);
  buildMandala();
  setupTheater();
  setupReveal();
  setupCountdown();
});

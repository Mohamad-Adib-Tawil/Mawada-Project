/* ============================================================
   قالب doves — الإعدادات والتفاعل
   عدّل بيانات العرس من wedding.config.js فقط.
   ============================================================ */

const WEDDING_CONFIG = window.__INVITE__?.config;
if (!WEDDING_CONFIG) {
  throw new Error("Load wedding.config.js before the invitation template.");
}

const DOVE_SVG = '<div class="rbird"></div>';

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  const assets = c.images || {};
  const emblem = document.querySelector(".emblem__dove");
  if (emblem && assets.emblem) emblem.style.backgroundImage = `url("${assets.emblem}")`;
  if (assets.doveSprite) {
    document.querySelectorAll(".rbird").forEach((bird) => {
      bird.style.backgroundImage = `url("${assets.doveSprite}")`;
    });
  }
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

  const _imgs = (WEDDING_CONFIG.images) || {};
  const _src = _imgs.hero;
  const _box = document.getElementById('heroPhoto');
  const _im = document.getElementById('heroPhotoImg');
  if (_box && _im && _src) {
    _im.onload = function () { _box.classList.add('is-shown'); };
    _im.onerror = function () { _box.classList.remove('is-shown'); };
    _im.src = _src;
  }

  const _bg = (c.images && c.images.background);
  ['coverBg','heroBg'].forEach(function(id){
    const el = document.getElementById(id);
    if (el && _bg) { const p = new Image(); p.onload = function(){ el.style.backgroundImage = 'url("' + _bg + '")'; el.classList.add('is-shown'); }; p.onerror = function(){ el.classList.remove('is-shown'); }; p.src = _bg; }
  });

  const mapBtn = document.getElementById("mapBtn");
  if (mapBtn && c.mapUrl) mapBtn.href = c.mapUrl;
  else if (mapBtn) mapBtn.style.display = "none";
  const mono = document.getElementById("coverMono");
  if (mono) mono.textContent = [c.groom, c.bride].filter(Boolean).join(" & ");

  buildTimeline(c.program);
  buildNotes(c.notes);
  buildContact(c);
  buildGallery(assets.gallery);
  document.title = `دعوة زفاف ${[c.groom, c.bride].filter(Boolean).join(" & ")}`;
}

function buildGallery(images) {
  const gallery = document.getElementById("memory-gallery");
  if (!gallery || !Array.isArray(images)) return;
  gallery.replaceChildren();
  gallery.className = `mem-grid ${images.length <= 4 ? `n${images.length}` : "many"}`;
  images.forEach((src, index) => {
    const figure = document.createElement("figure");
    figure.className = "mem-cell";
    const image = document.createElement("img");
    image.src = src;
    image.alt = `ذكرى ${index + 1}`;
    image.loading = "lazy";
    image.decoding = "async";
    figure.append(image);
    gallery.append(figure);
  });
}
function setText(id, v) { const el = document.getElementById(id); if (el && v != null) el.textContent = v; }

function buildTimeline(items) {
  const ul = document.getElementById("timeline");
  if (!ul || !Array.isArray(items)) return;
  ul.replaceChildren();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline__item";
    const dot = document.createElement("span");
    dot.className = "timeline__dot";
    dot.setAttribute("aria-hidden", "true");
    const time = document.createElement("span");
    time.className = "timeline__time";
    time.textContent = item.time || "";
    const title = document.createElement("span");
    title.className = "timeline__title";
    title.textContent = item.title || "";
    li.append(dot, time, title);
    ul.append(li);
  });
}
function buildNotes(items) {
  const ul = document.getElementById("notesList");
  if (!ul || !Array.isArray(items)) return;
  ul.replaceChildren();
  items.forEach((text) => {
    const li = document.createElement("li");
    li.className = "notes__item";
    const mark = document.createElement("span");
    mark.className = "notes__mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "❋";
    const content = document.createElement("span");
    content.textContent = text;
    li.append(mark, content);
    ul.append(li);
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
  if (c.whatsappUrl) {
    link.href = c.whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = c.contactName || "واتساب";
  }
  else { document.getElementById("contactBox").style.display = "none"; }
}

/* ---------------- الصور التلقائية ---------------- */
function loadImages() {
  const im = WEDDING_CONFIG.images || {};
  applyImg(im.venue, (s) => { const el = document.getElementById("venuePhoto"); const v = document.querySelector(".venue"); if (el) el.style.backgroundImage = `url("${s}")`; if (v) v.classList.add("has-photo"); });
}
function applyImg(src, cb) { if (!src) return; const i = new Image(); i.onload = () => cb(src); i.src = src; }

/* ---------------- إطلاق الحمام عند الفتح ---------------- */
function releaseFlock(count) {
  if (reduced()) return;
  const flock = document.getElementById("flock");
  if (!flock) return;
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "dove dove--fly";
    d.innerHTML = DOVE_SVG; { const rb = d.firstElementChild; if (rb) rb.style.animationDelay = (-Math.random() * 0.7).toFixed(2) + "s"; }
    const startX = 30 + Math.random() * 40;          // ينطلق من وسط الأسفل
    d.style.left = startX + "%";
    d.style.bottom = (-8 - Math.random() * 10) + "%";
    const size = 92 + Math.random() * 70;
    d.style.width = size + "px";
    d.style.setProperty("--dx", (Math.random() * 60 - 30) + "vw");
    d.style.setProperty("--rot", (Math.random() * 24 - 12) + "deg");
    d.style.setProperty("--sc", (0.8 + Math.random() * 0.5).toFixed(2));
    d.style.animationDuration = (2.4 + Math.random() * 1.8) + "s";
    d.style.animationDelay = (Math.random() * 0.7) + "s";
    flock.appendChild(d);
    setTimeout(() => d.remove(), 5200);
  }
}

/* ---------------- حمام ينساب بهدوء في الخلفية ---------------- */
function ambientDoves(count) {
  if (reduced()) return;
  const flock = document.getElementById("flock");
  if (!flock) return;
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "dove dove--glide";
    d.innerHTML = DOVE_SVG; { const rb = d.firstElementChild; if (rb) rb.style.animationDelay = (-Math.random() * 0.7).toFixed(2) + "s"; }
    d.style.top = (8 + Math.random() * 42) + "%";
    d.style.left = "100vw";
    const size = 74 + Math.random() * 48;
    d.style.width = size + "px";
    d.style.setProperty("--sc", (0.7 + Math.random() * 0.5).toFixed(2));
    d.style.setProperty("--gd", (24 + Math.random() * 22) + "s");
    d.style.animationDelay = (Math.random() * 18) + "s";
    flock.appendChild(d);
  }
}

/* ---------------- الفتح ---------------- */
function setupCover() {
  const cover = document.getElementById("cover");
  const invite = document.getElementById("invite");
  const btn = document.getElementById("openBtn");
  const hero = document.querySelector(".hero");
  if (!cover || !btn || !invite) return;
  btn.addEventListener("click", () => {
    releaseFlock(16);                       // الحمام يطير أولاً
    setTimeout(() => {
      cover.classList.add("is-open");
      invite.setAttribute("aria-hidden", "false");
      if (hero) { hero.classList.add("play"); }
      ambientDoves(4);
    }, 450);
    setTimeout(() => { cover.style.display = "none"; }, 1700);
  }, { once: true });
}

/* ---------------- ظهور الأقسام ---------------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
  const obs = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } }); }, { threshold: 0.12 });
  items.forEach((el) => obs.observe(el));
}

/* ---------------- العدّاد ---------------- */
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
    set(els.days, pad(Math.floor(diff / 86400000)), "d");
    set(els.hours, pad(Math.floor((diff % 86400000) / 3600000)), "h");
    set(els.mins, pad(Math.floor((diff % 3600000) / 60000)), "m");
    set(els.secs, pad(Math.floor((diff % 60000) / 1000)), "s");
  }
  function set(node, val, k) { if (!node || prev[k] === val) return; prev[k] = val; node.textContent = val; if (reduced()) return; node.classList.remove("flip"); void node.offsetWidth; node.classList.add("flip"); }
  const t = setInterval(tick, 1000); tick();
}
function el(id) { return document.getElementById(id); }
function pad(n) { return String(n).padStart(2, "0"); }
function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

document.addEventListener("DOMContentLoaded", () => {
  fillContent();
  loadImages();
  setupCover();
  setupReveal();
  setupCountdown();
});

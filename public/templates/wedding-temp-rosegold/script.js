/* ============================================================
   قالب rosegold — الإعدادات والتفاعل
   عدّل بيانات العرس من WEDDING_CONFIG في الأسفل فقط.
   ============================================================ */

const WEDDING_CONFIG = window.__INVITE__.config;

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  setText("groomName", c.groom);
  setText("brideName", c.bride);
  setText("heroSub", c.heroSub);
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

  const mono = document.getElementById("sealMono");
  if (mono) mono.textContent = [firstLetter(c.bride), firstLetter(c.groom)].filter(Boolean).join(" ");
  const coverNames = document.getElementById("coverNames");
  if (coverNames) coverNames.textContent = [c.groom, c.bride].filter(Boolean).join(" & ");

  // ===== صورة العرسين المؤطّرة في الواجهة (تظهر فقط إن وُجدت الصورة) =====
  const _imgs = (WEDDING_CONFIG.images) || {};
  const _src = _imgs.hero;
  const _box = document.getElementById("heroPhoto");
  const _im = document.getElementById("heroPhotoImg");
  if (_box && _im && _src) {
    _im.onload = function () { _box.classList.add("is-shown"); };
    _im.onerror = function () { _box.classList.remove("is-shown"); };
    _im.src = _src;
  }

  // ===== خلفية مخصّصة بحواف متلاشية (تظهر فقط إن حُمّلت الصورة بنجاح) =====
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
  setupGallery(c.gallery);
  setupCalendar(c);

  const description = [c.dateText, c.venueName, c.venueAddr].filter(Boolean).join(" • ");
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  const pageTitle = `دعوة زفاف ${[c.groom, c.bride].filter(Boolean).join(" & ")}`;
  const orderLink = document.getElementById("orderLink");
  const siteUrl = c.siteUrl || location.href;
  const heroImage = c.images && c.images.hero ? new URL(c.images.hero, siteUrl).href : "";
  if (metaDescription) metaDescription.content = description;
  if (ogTitle) ogTitle.content = pageTitle;
  if (ogDescription) ogDescription.content = description;
  if (ogUrl) ogUrl.content = siteUrl;
  if (ogImage && heroImage) ogImage.content = heroImage;
  if (twitterImage && heroImage) twitterImage.content = heroImage;
  if (orderLink) orderLink.href = c.orderUrl || c.whatsappUrl || "#";
  document.title = pageTitle;
}

function setText(id, value) { const el = document.getElementById(id); if (el && value != null) el.textContent = value; }
function firstLetter(name) { return (name || "").trim().charAt(0) || ""; }

/* ---------------- تحميل الصور تلقائياً (إن وُجدت) ---------------- */
function loadImages() {
  const imgs = WEDDING_CONFIG.images || {};
  applyImageIfExists(imgs.venue, (src) => {
    const vp = document.getElementById("venuePhoto");
    const venue = document.querySelector(".venue");
    if (vp) vp.style.backgroundImage = `url("${src}")`;
    if (venue) venue.classList.add("has-photo");
  });
  applyImageIfExists(imgs.background, (src) => {
    document.body.style.backgroundImage = `url("${src}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
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
  if (c.contactPhone) {
    const wa = c.contactPhone.replace(/[^0-9]/g, "");
    link.href = c.whatsappUrl || `https://wa.me/${wa}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = c.contactName ? `${c.contactName}` : c.contactPhone;
  } else {
    document.getElementById("contactBox").style.display = "none";
  }
}

function setupGallery(images) {
  if (!Array.isArray(images)) return;
  document.querySelectorAll("#da3wa-mem [data-gallery-index]").forEach((image) => {
    const source = images[Number(image.dataset.galleryIndex)];
    if (source) image.src = source;
  });
}

function setupCalendar(c) {
  if (!c.date) return;
  const date = new Date(c.date);
  if (Number.isNaN(date.getTime())) return;
  const end = new Date(date.getTime() + 4 * 60 * 60 * 1000);
  const day = new Intl.DateTimeFormat("ar", { weekday: "long", timeZone: c.timezone || "Asia/Baghdad" }).format(date);
  const month = new Intl.DateTimeFormat("ar", { month: "long", year: "numeric", timeZone: c.timezone || "Asia/Baghdad" }).format(date);
  const dayNumber = new Intl.DateTimeFormat("ar", { day: "numeric", timeZone: c.timezone || "Asia/Baghdad" }).format(date);
  setText("calendarMonth", month);
  setText("calendarWeekday", day);
  setText("calendarDay", dayNumber);

  const buttons = document.querySelectorAll("#da3wa-cal .cal-btns a");
  const startValue = calendarDateTime(date, c.timezone || "Asia/Baghdad");
  const endValue = calendarDateTime(end, c.timezone || "Asia/Baghdad");
  const title = `دعوة زفاف ${c.groom} & ${c.bride}`;
  const details = `رابط الدعوة: ${location.href}`;
  const locationText = [c.venueName, c.venueAddr].filter(Boolean).join(" — ");
  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  googleUrl.search = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startValue}/${endValue}`,
    ctz: c.timezone || "Asia/Baghdad",
    location: locationText,
    details,
  }).toString();
  if (buttons[0]) buttons[0].href = googleUrl.toString();
  if (buttons[1]) {
    buttons[1].removeAttribute("href");
    buttons[1].removeAttribute("download");
    buttons[1].addEventListener("click", () => {
      const stamp = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//AR",
        "BEGIN:VEVENT", `DTSTART:${stamp(date)}`, `DTEND:${stamp(end)}`,
        `SUMMARY:${icsEscape(title)}`, `LOCATION:${icsEscape(locationText)}`, `DESCRIPTION:${icsEscape(details)}`,
        "END:VEVENT", "END:VCALENDAR",
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const download = document.createElement("a");
      download.href = url;
      download.download = "wedding.ics";
      download.click();
      URL.revokeObjectURL(url);
    });
  }
}

function calendarDateTime(date, timezone) {
  const values = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${values.year}${values.month}${values.day}T${values.hour}${values.minute}${values.second}`;
}

function icsEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/* ---------------- فتح المظروف ---------------- */
function setupEnvelope() {
  const env = document.getElementById("envelope");
  const invite = document.getElementById("invite");
  const btn = document.getElementById("openBtn");
  if (!env || !btn || !invite) return;
  btn.addEventListener("click", () => {
    env.classList.add("is-open");
    invite.setAttribute("aria-hidden", "false");
    revealFirst();
    startPetals(26);
    setTimeout(() => { env.style.display = "none"; }, 1700);
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
function pad(n) { return String(n).padStart(2, "0"); }

/* ---------------- بتلات وردية متساقطة ---------------- */
function startPetals(count) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.getElementById("petals");
  if (!layer) return;
  const glyphs = ["❀", "✿", "❁", "·"];
  const colors = ["#d99a8c", "#c2a25c", "#e7b7ab", "#cf8f7f"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.color = colors[i % colors.length];
    s.style.fontSize = (9 + Math.random() * 16) + "px";
    s.style.animationDuration = (6 + Math.random() * 6) + "s";
    s.style.animationDelay = (Math.random() * 5) + "s";
    layer.appendChild(s);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillContent();
  loadImages();
  setupEnvelope();
  setupReveal();
  setupCountdown();
});

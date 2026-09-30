/* ============================================================
   قالب garden — الإعدادات والتفاعل
   عدّل بيانات العرس من WEDDING_CONFIG في الأسفل فقط.
   ============================================================ */

const WEDDING_CONFIG = window.__INVITE__ && window.__INVITE__.config;
if (!WEDDING_CONFIG) throw new Error("config.js must load before script.js");

/* ---------------- تعبئة المحتوى ---------------- */
function fillContent() {
  const c = WEDDING_CONFIG;
  setText("groomName", c.groom);
  setText("brideName", c.bride);
  setText("groomNameEn", c.groomEn);
  setText("brideNameEn", c.brideEn);

  (c.images && c.images.gallery || []).forEach(function (src, index) {
    const image = document.querySelector('#da3wa-mem [data-gallery-index="' + index + '"]');
    if (image) image.src = src;
  });

  const _imgs = (c.images) || {};
  const _src = _imgs.hero;
  const _box = document.getElementById('heroPhoto');
  const _im = document.getElementById('heroPhotoImg');
  if (_box && _im && _src) {
    _im.onload = function () { _box.classList.add('is-shown'); };
    _im.onerror = function () { _box.classList.remove('is-shown'); };
    _im.src = _src;
  }

  // صورة خلفية اختيارية بحواف متلاشية — تظهر فقط عند نجاح التحميل
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

  // صورة القاعة التي يرفعها الزبون — تظهر بعد نجاح التحميل وتحلّ محلّ الرسمة
  const _venue = _imgs.venue;
  const _venueEl = document.getElementById("venuePhoto");
  if (_venueEl && _venue) {
    const vp = new Image();
    vp.onload = function () {
      _venueEl.style.backgroundImage = 'url("' + _venue + '")';
      _venueEl.classList.add("has-img");
      const art = document.querySelector(".venue__art");
      if (art) art.style.display = "none";
    };
    vp.src = _venue;
  }

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

  const whatsappUrl = c.whatsappUrl || "https://wa.me/" + (c.contactPhone || "").replace(/[^0-9]/g, "");
  ["orderCta", "whatsappCta"].forEach(function (id) {
    const link = document.getElementById(id);
    if (!link) return;
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
  setText("orderCta", c.orderCtaLabel);
  const ctaText = document.getElementById("demoCtaText");
  if (ctaText) {
    const note = ctaText.querySelector("small");
    if (note && c.orderCtaText) note.textContent = c.orderCtaText;
    if (ctaText.firstChild) ctaText.firstChild.textContent = c.ctaTitle || "يسعدنا تواصلكم";
  }
  buildCalendarLinks(c);

  const description = [c.dateText, c.timeText, c.venueName].filter(Boolean).join(" • ");
  const title = `دعوة زفاف ${[c.groom, c.bride].filter(Boolean).join(" & ")}`;
  document.title = title;
  const setMeta = function (selector, value, property) {
    const meta = document.querySelector(selector);
    if (meta) meta.setAttribute(property || "content", value);
  };
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', location.href);
  if (c.images && c.images.share) {
    const shareUrl = new URL(c.images.share, location.href).href;
    setMeta('meta[property="og:image"]', shareUrl);
    setMeta('meta[name="twitter:image"]', shareUrl);
  }

  const mapBtn = document.getElementById("mapBtn");
  if (mapBtn && c.mapUrl) mapBtn.href = c.mapUrl;
  else if (mapBtn) mapBtn.style.display = "none";

  const mono = document.getElementById("coverMono");
  if (mono) mono.textContent = [c.groom, c.bride].filter(Boolean).join(" & ");

  buildTimeline(c.program);
  buildNotes(c.notes);
  buildContact(c);

}

function buildCalendarLinks(c) {
  const m = String(c.date || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return;
  const [, y, mo, d, h, mi, sec = "00"] = m;
  const startWall = Date.UTC(+y, +mo - 1, +d, +h, +mi, +sec);
  const endWall = startWall + Number(c.eventDurationHours || 4) * 3600000;
  const calendarDate = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +sec));
  const monthName = new Intl.DateTimeFormat("ar-IQ", { month: "long", timeZone: "UTC" }).format(calendarDate);
  const weekday = new Intl.DateTimeFormat("ar-IQ", { weekday: "long", timeZone: "UTC" }).format(calendarDate);
  setText("calendarMonth", monthName + " " + y);
  setText("calendarWeekday", weekday);
  setText("calendarDay", String(Number(d)));
  setText("calendarTime", c.timeText);
  const pad2 = function (n) { return String(n).padStart(2, "0"); };
  const stamp = function (ms) {
    const date = new Date(ms);
    return date.getUTCFullYear() + pad2(date.getUTCMonth() + 1) + pad2(date.getUTCDate()) +
      "T" + pad2(date.getUTCHours()) + pad2(date.getUTCMinutes()) + pad2(date.getUTCSeconds());
  };
  const name = "زفاف " + c.groom + " و" + c.bride;
  const place = [c.venueName, c.venueAddr].filter(Boolean).join(" — ");
  const google = document.getElementById("calendarGoogle");
  if (google) {
    const url = new URL("https://calendar.google.com/calendar/render");
    url.search = new URLSearchParams({
      action: "TEMPLATE", text: name, dates: stamp(startWall) + "/" + stamp(endWall),
      ctz: c.timeZone || "Asia/Baghdad", location: place, details: "رابط الدعوة: " + location.href,
    });
    google.href = url.href;
  }
  const offset = Number(c.timeZoneOffsetHours == null ? 3 : c.timeZoneOffsetHours) * 3600000;
  const utcDate = function (wall) {
    const date = new Date(wall - offset);
    return stamp(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())) + "Z";
  };
  const escapeIcs = function (text) {
    return String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  };
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//Garden//AR",
    "CALSCALE:GREGORIAN", "BEGIN:VEVENT", "UID:" + Date.now() + "@wedding-invitation",
    "DTSTAMP:" + stamp(Date.now()) + "Z", "DTSTART:" + utcDate(startWall), "DTEND:" + utcDate(endWall),
    "SUMMARY:" + escapeIcs(name), "LOCATION:" + escapeIcs(place),
    "DESCRIPTION:" + escapeIcs("رابط الدعوة: " + location.href), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const apple = document.getElementById("calendarApple");
  if (apple) {
    apple.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    apple.download = "wedding-invitation.ics";
  }
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
    link.href = `https://wa.me/${wa}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = c.contactName ? `${c.contactName}` : c.contactPhone;
  } else {
    document.getElementById("contactBox").style.display = "none";
  }
}

/* ---------------- إكليل من الأوراق على الغلاف ---------------- */
function buildWreath() {
  const g = document.querySelector(".wreath__leaves");
  if (!g) return;
  const cx = 110, cy = 110, r = 82;
  const ranges = [[140, 220], [320, 40]];
  ranges.forEach(([from, to]) => {
    for (let a = from; a <= (to < from ? to + 360 : to); a += 12) {
      const ang = (a % 360) * Math.PI / 180;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang);
      const leaf = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      leaf.setAttribute("cx", x.toFixed(1));
      leaf.setAttribute("cy", y.toFixed(1));
      leaf.setAttribute("rx", "6");
      leaf.setAttribute("ry", "2.6");
      leaf.setAttribute("transform", `rotate(${(a + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})`);
      leaf.setAttribute("opacity", "0.85");
      g.appendChild(leaf);
    }
  });
}

/* ---------------- فتح الغلاف ---------------- */
function setupCover() {
  const cover = document.getElementById("cover");
  const invite = document.getElementById("invite");
  const btn = document.getElementById("openBtn");
  if (!cover || !btn || !invite) return;
  btn.addEventListener("click", () => {
    cover.classList.add("is-open");
    invite.setAttribute("aria-hidden", "false");
    revealFirst();
    startLeaves(24);
    setTimeout(() => {
      cover.style.display = "none";
      const musicToggle = document.getElementById("da3wa-music");
      if (musicToggle) musicToggle.style.display = "grid";
    }, 1100);
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

/* ---------------- أوراق متساقطة ---------------- */
function startLeaves(count) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.getElementById("leaves");
  if (!layer) return;
  const glyphs = ["❧", "✿", "❀", "·"];
  const colors = ["#8aa68f", "#b89b62", "#5f7d68", "#a9c0ac"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "leaf";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.color = colors[i % colors.length];
    s.style.fontSize = (10 + Math.random() * 14) + "px";
    s.style.animationDuration = (6 + Math.random() * 6) + "s";
    s.style.animationDelay = (Math.random() * 5) + "s";
    layer.appendChild(s);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillContent();
  buildWreath();
  setupCover();
  setupReveal();
  setupCountdown();
});

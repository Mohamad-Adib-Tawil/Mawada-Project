(() => {
  const c = window.INVITATION;
  const $ = (id) => document.getElementById(id);
  const arabicDigits = (value) => String(value).replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
  const setText = (id, value) => { if (value) $(id).textContent = value; };

  const pageTitle = `دعوة ${c.occasion} ${c.celebrant}`;
  document.title = pageTitle;
  document.querySelector('meta[property="og:title"]').content = pageTitle;
  document.querySelector('meta[property="og:description"]').content = `${c.dateText} — ${c.timeText}`;
  document.querySelector('meta[name="description"]').content = `${c.dateText} — ${c.timeText}`;
  document.querySelector('meta[property="og:image"]').content = c.shareImage;
  document.querySelector('meta[name="twitter:image"]').content = c.shareImage;
  setText("coverLabel", `دعوة ${c.occasion}`);
  setText("heroKicker", `حفل ${c.occasion}`);
  setText("coverName", c.celebrant);
  setText("celebrantName", c.celebrant);
  setText("ageBadge", c.age);
  setText("ageLine", `أتمّ عامه ${arabicDigits(c.age)} 🎂`);
  setText("heroGreeting", `${c.occasion} ${c.celebrant}`);
  setText("heroDate", c.dateText);
  setText("invitationText", c.invitationText);
  setText("venueDate", c.dateText);
  setText("venueTime", c.timeText);
  setText("venueName", c.venueName);
  setText("venueAddr", c.venueAddress);
  setText("closingNote", c.closingNote);
  setText("closingHost", c.host);
  setText("contactLabel", c.contactLabel);
  $("mapBtn").href = c.mapUrl;
  $("contactLink").href = c.whatsapp;

  const timeline = $("timeline");
  c.program.forEach(({ time, title }) => {
    const item = document.createElement("li");
    item.className = "timeline__item";
    const dot = document.createElement("span"); dot.className = "timeline__dot"; dot.setAttribute("aria-hidden", "true");
    const timeEl = document.createElement("span"); timeEl.className = "timeline__time"; timeEl.textContent = time;
    const titleEl = document.createElement("span"); titleEl.className = "timeline__title"; titleEl.textContent = title;
    item.append(dot, timeEl, titleEl); timeline.append(item);
  });
  const notes = $("notesList");
  c.notes.forEach((text) => {
    const item = document.createElement("li"); item.className = "notes__item";
    const mark = document.createElement("span"); mark.className = "notes__mark"; mark.setAttribute("aria-hidden", "true"); mark.textContent = "🎈";
    const body = document.createElement("span"); body.textContent = text; item.append(mark, body); notes.append(item);
  });

  const date = new Date(c.date);
  const dateParts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baghdad", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const part = (type) => dateParts.find((item) => item.type === type)?.value ?? "";
  const calendarTitle = `دعوة ${c.occasion} ${c.celebrant}`;
  $("calendarMonth").textContent = new Intl.DateTimeFormat("ar-IQ", { timeZone: "Asia/Baghdad", month: "long", year: "numeric" }).format(date);
  $("calendarWeekday").textContent = new Intl.DateTimeFormat("ar-IQ", { timeZone: "Asia/Baghdad", weekday: "long" }).format(date);
  $("calendarDay").textContent = arabicDigits(part("day"));
  $("calendarTime").textContent = c.timeText;
  const dateStamp = `${part("year")}${part("month")}${part("day")}`;
  const calendarEnd = new Date(date.getTime() + 30 * 60 * 1000);
  const endParts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baghdad", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(calendarEnd);
  const endPart = (type) => endParts.find((item) => item.type === type)?.value ?? "";
  const dateEndStamp = `${endPart("year")}${endPart("month")}${endPart("day")}T${endPart("hour")}${endPart("minute")}00`;
  const googleParams = new URLSearchParams({ action: "TEMPLATE", text: calendarTitle, dates: `${dateStamp}T${part("hour")}${part("minute")}00/${dateEndStamp}`, ctz: "Asia/Baghdad", location: `${c.venueName} — ${c.venueAddress}` });
  // Google Calendar requires an end time; a 30-minute placeholder is only the calendar slot.
  $("googleCalendar").href = `https://calendar.google.com/calendar/render?${googleParams}`;
  const icsStart = `${part("year")}${part("month")}${part("day")}T${part("hour")}${part("minute")}00`;
  const icsEnd = dateEndStamp;
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitation//AR", "BEGIN:VEVENT", `DTSTART;TZID=Asia/Baghdad:${icsStart}`, `DTEND;TZID=Asia/Baghdad:${icsEnd}`, `SUMMARY:${calendarTitle}`, `LOCATION:${c.venueName} — ${c.venueAddress}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  $("icsCalendar").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));

  const wishList = $("wishList");
  const colors = ["#5b8def", "#ff6b9d", "#ffb02e", "#14c2b0", "#8a5cf0"];
  c.wishes.forEach(({ name, message }, index) => {
    const card = document.createElement("article"); card.className = "wish";
    const avatar = document.createElement("span"); avatar.className = "wish-av"; avatar.style.background = colors[index % colors.length]; avatar.textContent = name.slice(0, 1);
    const body = document.createElement("div"); body.className = "wish-body";
    const nameEl = document.createElement("strong"); nameEl.className = "wish-name"; nameEl.textContent = name;
    const messageEl = document.createElement("p"); messageEl.className = "wish-msg"; messageEl.textContent = message;
    const reply = document.createElement("a"); reply.className = "wish-reply"; reply.href = `${c.whatsapp}?text=${encodeURIComponent(`تهنئتك: «${message}»\nأرسل تهنئتي لتيم 🎈`)}`; reply.target = "_blank"; reply.rel = "noopener"; reply.textContent = "أرسل تهنئتك عبر واتساب";
    body.append(nameEl, messageEl, reply); card.append(avatar, body); wishList.append(card);
  });

  let attendance = "نعم";
  $("attendance").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-value]"); if (!button) return;
    attendance = button.dataset.value;
    $("attendance").querySelectorAll("button").forEach((item) => item.classList.toggle("is-selected", item === button));
  });
  let companions = 0;
  const renderCompanions = () => { $("companions").textContent = arabicDigits(companions); };
  $("minus").addEventListener("click", () => { companions = Math.max(0, companions - 1); renderCompanions(); });
  $("plus").addEventListener("click", () => { companions = Math.min(20, companions + 1); renderCompanions(); });
  $("rsvpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("guestName").value.trim(); if (!name) return;
    const message = $("wishMessage").value.trim();
    const text = [`تأكيد حضور عيد ميلاد ${c.celebrant}`, `الاسم: ${name}`, `الحضور: ${attendance}`, `المرافقون: ${arabicDigits(companions)}`, message && `التهنئة: ${message}`].filter(Boolean).join("\n");
    window.open(`${c.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    reveal.forEach((section) => observer.observe(section));
  } else reveal.forEach((section) => section.classList.add("is-visible"));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const buildSparkles = (count) => { if (reducedMotion) return; for (let i = 0; i < count; i++) { const star = document.createElement("span"); star.className = "sparkle"; const size = 3 + Math.random() * 6; star.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-duration:${2.5 + Math.random() * 3.5}s;animation-delay:${Math.random() * 4}s`; $("sparkles").append(star); } };
  const colorsBalloon = ["#a8e6cf", "#ffd3b6", "#d9c2f0", "#aed9ff", "#ffc2d9"];
  const launchBalloons = (count, burst = false) => {
    if (reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const balloon = document.createElement("div"); balloon.className = "balloon";
      const size = 34 + Math.random() * 40; const duration = burst ? 4.5 + Math.random() * 3 : 9 + Math.random() * 7;
      balloon.style.cssText = `width:${size}px;height:${size * 1.42}px;left:${Math.random() * 92}%;--sway:${Math.random() * 80 - 40}px;animation-duration:${duration}s;animation-delay:${burst ? Math.random() * .9 : Math.random() * 9}s`;
      balloon.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 60 86" aria-hidden="true"><path d="M30 70Q26 78 30 86" fill="none" stroke="rgba(120,110,150,.4)"/><ellipse cx="30" cy="34" rx="24" ry="30" fill="${colorsBalloon[i % colorsBalloon.length]}"/><path d="m30 64-5 7h10z" fill="${colorsBalloon[i % colorsBalloon.length]}"/><ellipse cx="22" cy="24" rx="6" ry="9" fill="rgba(255,255,255,.5)"/></svg>`;
      $("balloonsLayer").append(balloon); if (burst) setTimeout(() => balloon.remove(), (duration + 1) * 1000);
    }
  };

  $("openBtn").addEventListener("click", () => {
    $("cover").classList.add("is-open"); $("invite").setAttribute("aria-hidden", "false"); document.querySelector(".hero").classList.add("is-visible");
    launchBalloons(18, true); launchBalloons(7); buildSparkles(36); startMusic();
    setTimeout(() => { $("cover").style.display = "none"; }, 1100);
  }, { once: true });

  const target = date.getTime();
  let countdownTimer;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) { $("countdown").hidden = true; $("cdArrived").hidden = false; if (countdownTimer) clearInterval(countdownTimer); return; }
    $("cdDays").textContent = arabicDigits(String(Math.floor(diff / 86400000)).padStart(2, "0"));
    $("cdHours").textContent = arabicDigits(String(Math.floor(diff % 86400000 / 3600000)).padStart(2, "0"));
    $("cdMins").textContent = arabicDigits(String(Math.floor(diff % 3600000 / 60000)).padStart(2, "0"));
    $("cdSecs").textContent = arabicDigits(String(Math.floor(diff % 60000 / 1000)).padStart(2, "0"));
  };
  tick(); if (target > Date.now()) countdownTimer = setInterval(tick, 1000);

  let player; let musicReady = false; let playing = false;
  const musicButton = $("musicButton");
  function updateMusic() { musicButton.textContent = playing ? "🔊" : "🎵"; $("musicStatus").textContent = playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"; musicButton.setAttribute("aria-label", playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"); }
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("youtubeAudio", { height: "0", width: "0", videoId: c.musicVideoId, playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: c.musicVideoId, playsinline: 1 }, events: { onReady: () => { musicReady = true; $("musicControl").hidden = false; }, onStateChange: (event) => { playing = event.data === YT.PlayerState.PLAYING; updateMusic(); } } });
  };
  function startMusic() { if (musicReady && player) { player.unMute(); player.setVolume(40); player.playVideo(); } }
  musicButton.addEventListener("click", () => { if (!musicReady || !player) return; if (playing) player.pauseVideo(); else startMusic(); });
  const ytApi = document.createElement("script"); ytApi.src = "https://www.youtube.com/iframe_api"; ytApi.async = true; document.head.append(ytApi);
})();

(function () {
  "use strict";

  var config = window.__INVITE_CONFIG__;
  if (!config) return;

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var opened = false;
  var musicPlayer = null;
  var musicReady = false;
  var musicRequested = false;
  var musicPlaying = false;
  var attendance = "yes";
  var companions = 0;

  function byId(id) { return document.getElementById(id); }
  function setText(id, value) { var element = byId(id); if (element) element.textContent = value == null ? "" : value; }
  function arabicDigits(value) { return String(value).replace(/[0-9]/g, function (digit) { return "٠١٢٣٤٥٦٧٨٩"[Number(digit)]; }); }
  function padded(value) { return arabicDigits(String(Math.max(0, value)).padStart(2, "0")); }

  function fillContent() {
    var names = config.groom + " و " + config.bride;
    ["gate-names", "gate-reveal-names", "hero-names"].forEach(function (id) { setText(id, names); });
    setText("gate-reveal-date", config.event.dateText);
    setText("hero-sub", config.copy.heroSub);
    setText("hero-date", config.event.dateText);
    setText("hero-time", config.event.timeText);
    setText("verse-text", config.copy.verse);
    setText("invitation-text", config.copy.invitationText);
    setText("groom-parents", config.copy.groomParents);
    setText("bride-parents", config.copy.brideParents);
    setText("detail-date", config.event.dateText);
    setText("detail-time", config.event.timeText);
    setText("venue-name", config.event.venueName);
    setText("venue-address", config.event.venueAddress);
    setText("closing-note", config.copy.closingNote);
    setText("closing-families", config.copy.closingFamilies);
    setText("closing-hashtag", config.copy.hashtag);
    setText("contact-label", config.copy.contactLabel);
    setText("contact-link", config.copy.contactName);
    setText("calendar-month", config.event.monthText);
    setText("calendar-weekday", config.event.weekdayText);
    setText("calendar-day", config.event.day);
    setText("calendar-time", config.event.timeText);
    document.title = config.title;

    var mapButton = byId("map-button");
    if (mapButton) mapButton.href = config.event.mapUrl;
    var contactLink = byId("contact-link");
    if (contactLink) { contactLink.href = config.links.whatsapp; contactLink.target = "_blank"; contactLink.rel = "noopener"; }
    var orderLink = byId("order-link");
    var orderWa = byId("order-wa");
    if (orderLink) orderLink.href = config.links.order;
    if (orderWa) orderWa.href = config.links.whatsapp;
    setText("order-copy", config.copy.orderTitle);
    var orderCopy = byId("order-copy");
    if (orderCopy) {
      orderCopy.innerHTML = "";
      var title = document.createTextNode(config.copy.orderTitle);
      var subtitle = document.createElement("small"); subtitle.textContent = config.copy.orderSubtitle;
      var note = document.createElement("small"); note.className = "order-bar__note"; note.textContent = config.copy.orderNote;
      orderCopy.append(title, subtitle, note);
    }
    buildProgram();
    buildNotes();
    buildWishes();
  }

  function buildProgram() {
    var list = byId("program-list");
    if (!list) return;
    list.replaceChildren();
    config.copy.program.forEach(function (item) {
      var row = document.createElement("div"); row.className = "timeline__row";
      var time = document.createElement("span"); time.className = "timeline__time"; time.textContent = item.time;
      var dot = document.createElement("span"); dot.className = "timeline__dot"; dot.setAttribute("aria-hidden", "true");
      var title = document.createElement("span"); title.className = "timeline__title"; title.textContent = item.title;
      row.append(time, dot, title); list.appendChild(row);
    });
  }

  function buildNotes() {
    var list = byId("notes-list");
    if (!list) return;
    list.replaceChildren();
    config.copy.notes.forEach(function (note) { var item = document.createElement("li"); item.textContent = note; list.appendChild(item); });
  }

  function buildWishes() {
    var list = byId("wish-list");
    if (!list) return;
    list.replaceChildren();
    config.rsvp.wishes.forEach(function (wish) {
      var item = document.createElement("article"); item.className = "wish";
      var avatar = document.createElement("div"); avatar.className = "wish__avatar"; avatar.style.background = wish.color; avatar.textContent = wish.initial;
      var body = document.createElement("div");
      var name = document.createElement("div"); name.className = "wish__name"; name.textContent = wish.name;
      var message = document.createElement("div"); message.className = "wish__message"; message.textContent = wish.message;
      body.append(name, message); item.append(avatar, body); list.appendChild(item);
    });
  }

  function setupCountdown() {
    var target = new Date(config.event.date).getTime();
    if (!Number.isFinite(target)) return;
    function tick() {
      var difference = target - Date.now();
      if (difference <= 0) {
        var countdown = byId("countdown");
        var arrived = byId("countdown-arrived");
        if (countdown) countdown.hidden = true;
        if (arrived) arrived.hidden = false;
        return;
      }
      setText("countdown-days", padded(Math.floor(difference / 86400000)));
      setText("countdown-hours", padded(Math.floor(difference % 86400000 / 3600000)));
      setText("countdown-minutes", padded(Math.floor(difference % 3600000 / 60000)));
      setText("countdown-seconds", padded(Math.floor(difference % 60000 / 1000)));
    }
    tick(); window.setInterval(tick, 1000);
  }

  function setupReveal() {
    var sections = document.querySelectorAll(".creveal");
    if (reducedMotion || !("IntersectionObserver" in window)) { sections.forEach(function (element) { element.classList.add("is-visible"); }); return; }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -5% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function startPetals() {
    if (reducedMotion) return;
    var host = byId("petals");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    ["❧", "•", "❦", "•", "❧"].forEach(function () {});
    for (var index = 0; index < 15; index += 1) {
      var petal = document.createElement("span"); petal.className = "petal"; petal.textContent = ["❧", "•", "❦", "•", "❧"][index % 5];
      petal.style.left = (3 + Math.random() * 94) + "%";
      petal.style.fontSize = (9 + Math.random() * 12) + "px";
      petal.style.animationDuration = (9 + Math.random() * 7) + "s";
      petal.style.animationDelay = (-Math.random() * 13) + "s";
      petal.style.setProperty("--drift", (-40 + Math.random() * 80) + "px");
      host.appendChild(petal);
    }
  }

  function revealInvite() {
    if (!opened) opened = true;
    document.body.classList.remove("locked");
    var invite = byId("invite");
    var gate = byId("gate");
    if (invite) { invite.classList.add("is-visible"); invite.setAttribute("aria-hidden", "false"); }
    if (gate) { gate.classList.add("is-done"); window.setTimeout(function () { gate.style.display = "none"; }, 1150); }
    setupReveal(); startPetals();
  }

  function openInvite() {
    if (opened) return;
    var gate = byId("gate");
    var button = byId("open-button");
    var video = byId("intro-video");
    if (button) button.disabled = true;
    if (gate) gate.classList.add("is-playing");
    startMusic(true);
    if (!video || reducedMotion) { window.setTimeout(revealInvite, reducedMotion ? 80 : 420); return; }
    var finished = false;
    function finish() { if (finished) return; finished = true; window.setTimeout(revealInvite, 650); }
    video.addEventListener("timeupdate", function () {
      var duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 4.375;
      if (video.currentTime >= duration - .9) {
        var reveal = byId("gate-reveal"); if (reveal) reveal.classList.add("is-revealing");
      }
    });
    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
    var waiting = window.setTimeout(function () { setText("open-label", "لحظة…"); }, 600);
    video.addEventListener("playing", function () { window.clearTimeout(waiting); }, { once: true });
    video.classList.remove("is-live");
    var playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(finish);
    if (typeof video.requestVideoFrameCallback === "function") video.requestVideoFrameCallback(function () { video.classList.add("is-live"); });
    else video.addEventListener("timeupdate", function () { if (video.currentTime > .03) video.classList.add("is-live"); }, { once: true });
    window.setTimeout(finish, 7600);
  }

  function setupGate() {
    var video = byId("intro-video");
    var button = byId("open-button");
    if (video) video.load();
    if (button) button.addEventListener("click", openInvite);
    if (/[?&]autoopen=1/.test(window.location.search)) window.setTimeout(function () { if (button && !button.disabled) button.click(); }, 250);
  }

  function setupCalendar() {
    var start = new Date(config.event.date);
    var end = new Date(start.getTime() + config.event.durationHours * 3600000);
    var format = function (date) { return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var params = new URLSearchParams({ action: "TEMPLATE", text: config.title, dates: format(start) + "/" + format(end), ctz: config.event.timezone, location: config.event.venueName + " — " + config.event.venueAddress, details: "دعوة ليلة الحنّة" });
    var google = byId("google-calendar");
    if (google) google.addEventListener("click", function () { window.open("https://calendar.google.com/calendar/render?" + params.toString(), "_blank", "noopener"); });
    var apple = byId("apple-calendar");
    if (apple) apple.addEventListener("click", function () {
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//AR", "BEGIN:VEVENT", "DTSTART:" + format(start), "DTEND:" + format(end), "SUMMARY:" + config.title, "LOCATION:" + config.event.venueName + " — " + config.event.venueAddress, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" })); link.download = "laylat-henna.ics"; link.click(); URL.revokeObjectURL(link.href);
    });
  }

  function setupRsvp() {
    var form = byId("rsvp-form");
    if (!form) return;
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(config.rsvp.localStorageKey) || "null"); } catch (_) {}
    if (stored) showRsvpSuccess(stored);
    document.querySelectorAll("#rsvp-attendance button").forEach(function (button) {
      button.addEventListener("click", function () { attendance = button.dataset.value; document.querySelectorAll("#rsvp-attendance button").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); }); });
    });
    byId("companions-minus").addEventListener("click", function () { companions = Math.max(0, companions - 1); setText("companions-value", companions); });
    byId("companions-plus").addEventListener("click", function () { companions = Math.min(config.rsvp.maxCompanions, companions + 1); setText("companions-value", companions); });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = byId("guest-name").value.trim();
      if (!name) { setText("rsvp-status", "يرجى كتابة الاسم الكريم"); return; }
      var response = { name: name, attending: attendance, companions: companions, message: byId("guest-message").value.trim(), savedAt: Date.now() };
      try { localStorage.setItem(config.rsvp.localStorageKey, JSON.stringify(response)); } catch (_) {}
      showRsvpSuccess(response);
    });
  }

  function showRsvpSuccess(response) {
    var formView = byId("rsvp-form-view");
    var success = byId("rsvp-success");
    if (!formView || !success) return;
    formView.hidden = true; success.hidden = false; success.replaceChildren();
    var mark = document.createElement("div"); mark.textContent = "🌹";
    var title = document.createElement("strong"); title.textContent = response.attending === "no" ? "شكرًا لإخبارنا" : "تم تأكيد حضوركم";
    var message = document.createElement("p"); message.textContent = "أهلًا " + response.name + "، سعداء بمشاركتكم فرحتنا.";
    success.append(mark, title, message);
  }

  function setupOrderBar() {
    var close = document.querySelector(".order-bar__close");
    if (close) close.addEventListener("click", function () { var bar = byId("order-bar"); if (bar) bar.remove(); });
  }

  function paintMusic() { var button = byId("music-toggle"); if (button) { button.textContent = musicPlaying ? "🔊" : "🔇"; button.title = musicPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"; } }
  function startMusic(fromGesture) {
    musicRequested = true;
    if (!config.music.enabled || !musicPlayer || !musicReady) return;
    try {
      musicPlayer.playVideo();
      if (fromGesture) { musicPlayer.unMute(); musicPlayer.setVolume(70); musicPlaying = true; paintMusic(); }
    } catch (_) {}
  }
  function setupMusic() {
    var button = byId("music-toggle");
    if (!config.music.enabled) { if (button) button.hidden = true; return; }
    window.onYouTubeIframeAPIReady = function () {
      musicPlayer = new window.YT.Player("music-player", { videoId: config.music.youtubeId, playerVars: { autoplay: 0, mute: 1, controls: 0, disablekb: 1, fs: 0, loop: 1, playlist: config.music.youtubeId, playsinline: 1, modestbranding: 1, rel: 0, start: config.music.startAt }, events: { onReady: function () { musicReady = true; if (musicRequested) startMusic(true); } } });
    };
    var script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api"; script.async = true; document.head.appendChild(script);
    if (button) button.addEventListener("click", function () { if (!musicReady) { musicRequested = true; return; } if (musicPlaying) { musicPlayer.pauseVideo(); musicPlayer.mute(); musicPlaying = false; } else { musicPlayer.unMute(); musicPlayer.setVolume(70); musicPlayer.playVideo(); musicPlaying = true; } paintMusic(); });
  }

  fillContent();
  setupCountdown();
  setupGate();
  setupCalendar();
  setupRsvp();
  setupOrderBar();
  setupMusic();
})();

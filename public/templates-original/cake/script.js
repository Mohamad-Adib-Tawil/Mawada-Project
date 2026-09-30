(() => {
  const config = window.__INVITE__?.config ?? {};
  const digits = "٠١٢٣٤٥٦٧٨٩";
  const toArabicDigits = (value) => String(value).replace(/\d/g, (digit) => digits[Number(digit)]);
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element && value != null) element.textContent = value;
  };
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function fillContent() {
    const person = config.celebrant || "";
    const host = config.host || "";
    const title = `دعوة ${config.occasion || "مناسبة"} ${person}`.trim();
    const description = [config.dateText, config.venueName].filter(Boolean).join(" • ");
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    if (config.shareImage) {
      document.querySelector('meta[property="og:image"]')?.setAttribute("content", new URL(config.shareImage, location.href).href);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", new URL(config.shareImage, location.href).href);
    }
    setText("coverLabel", `دعوة ${config.occasion || "مناسبة"}`);
    setText("heroKicker", `حفل ${config.occasion || "مناسبة"}`);
    setText("coverMono", `عيد ميلاد ${person}`);
    setText("celebrantName", person);
    setText("heroGreet", `عيد ميلاد ${person}`);
    setText("heroDate", [config.dateText, config.timeText].filter(Boolean).join(" • "));
    setText("invitationText", config.invitationText);
    setText("venueDate", config.dateText);
    setText("venueTime", config.timeText);
    setText("venueName", config.venueName);
    setText("venueAddr", config.venueAddr);
    setText("closingNote", config.closingNote);
    setText("closingHashtag", config.hashtag);
    setText("closingHost", config.closingHost || (host ? `بدعوة من ${host}` : ""));
    const age = document.getElementById("ageWrap");
    if (age && Number.isFinite(Number(config.age))) {
      setText("ageNum", toArabicDigits(config.age));
      age.hidden = false;
    }
    const map = document.getElementById("mapBtn");
    if (map && config.mapUrl) map.href = config.mapUrl;
    const contact = document.getElementById("contactLink");
    if (contact && config.whatsappUrl) {
      contact.href = config.whatsappUrl;
      contact.target = "_blank";
      contact.rel = "noopener noreferrer";
      contact.textContent = config.contactName || config.contactPhone;
    }
    const label = document.querySelector(".contact__label");
    if (label) label.textContent = config.contactLabel || "للتواصل";
    buildList("timeline", config.program, (item) => [item.time, item.title]);
    buildNotes(config.notes);
    buildWishes(config.wishes);
    fillCalendar();
  }

  function buildList(id, items, fields) {
    const list = document.getElementById(id);
    if (!list || !Array.isArray(items)) return;
    list.replaceChildren();
    items.forEach((item) => {
      const row = document.createElement("li");
      row.className = "timeline__item";
      const dot = document.createElement("span");
      dot.className = "timeline__dot";
      dot.setAttribute("aria-hidden", "true");
      row.append(dot);
      fields(item).forEach((value, index) => {
        const span = document.createElement("span");
        span.className = index === 0 ? "timeline__time" : "timeline__title";
        span.textContent = value ?? "";
        row.append(span);
      });
      list.append(row);
    });
  }

  function buildNotes(items) {
    const list = document.getElementById("notesList");
    if (!list || !Array.isArray(items)) return;
    list.replaceChildren();
    const marks = ["🎈", "🎁", "🎉", "🧁", "✨"];
    items.forEach((text, index) => {
      const row = document.createElement("li");
      row.className = "notes__item";
      const mark = document.createElement("span");
      mark.className = "notes__mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = marks[index % marks.length];
      const copy = document.createElement("span");
      copy.textContent = text;
      row.append(mark, copy);
      list.append(row);
    });
    if (!list.children.length) list.closest(".notes")?.remove();
  }

  function buildWishes(items) {
    const list = document.getElementById("wishList");
    if (!list || !Array.isArray(items)) return;
    const colors = ["#e7689b", "#ffb02e", "#7ab4e0", "#b07de0", "#ff8fab"];
    items.forEach((wish, index) => {
      const card = document.createElement("article");
      card.className = "wish";
      const avatar = document.createElement("span");
      avatar.className = "wish-av";
      avatar.style.backgroundColor = colors[index % colors.length];
      avatar.textContent = (wish.name || "♥").trim().charAt(0);
      const body = document.createElement("div");
      body.className = "wish-body";
      const name = document.createElement("strong");
      name.className = "wish-name";
      name.textContent = wish.name || "";
      const message = document.createElement("p");
      message.className = "wish-msg";
      message.textContent = wish.text || "";
      body.append(name, message);
      card.append(avatar, body);
      list.append(card);
    });
  }

  function fillCalendar() {
    if (!config.date) return;
    const date = new Date(config.date);
    if (Number.isNaN(date.getTime())) return;
    const arabic = new Intl.DateTimeFormat("ar", { timeZone: "Asia/Baghdad", month: "long", year: "numeric" });
    const weekday = new Intl.DateTimeFormat("ar", { timeZone: "Asia/Baghdad", weekday: "long" });
    const day = new Intl.DateTimeFormat("ar", { timeZone: "Asia/Baghdad", day: "numeric" });
    setText("calMonth", arabic.format(date));
    setText("calWeekday", weekday.format(date));
    setText("calDay", day.format(date));
    setText("calTime", config.timeText || "");
    const begin = date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const end = new Date(date.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const params = new URLSearchParams({ action: "TEMPLATE", text: `دعوة عيد ميلاد ${config.celebrant || ""}`, dates: `${begin}/${end}`, ctz: "Asia/Baghdad", location: `${config.venueName || ""} — ${config.venueAddr || ""}`, details: config.invitationText || "" });
    const link = document.getElementById("calendarLink");
    if (link) link.href = `https://calendar.google.com/calendar/render?${params}`;
  }

  function setupInteractions() {
    const cover = document.getElementById("cover");
    const invite = document.getElementById("invite");
    document.getElementById("openBtn")?.addEventListener("click", () => {
      const cake = document.querySelector(".cakeSvg");
      cake?.classList.add("lit");
      document.querySelectorAll(".candle").forEach((candle, index) => {
        window.setTimeout(() => candle.classList.add("is-lit"), reducedMotion ? 0 : 250 + index * 280);
      });
      window.setTimeout(() => cake?.classList.add("blown"), reducedMotion ? 0 : 1150);
      window.setTimeout(() => {
        cover?.classList.add("is-open");
        invite?.setAttribute("aria-hidden", "false");
        document.querySelector(".hero.reveal")?.classList.add("is-visible");
        startConfetti(34);
      }, reducedMotion ? 0 : 1650);
      window.setTimeout(() => { if (cover) cover.style.display = "none"; }, reducedMotion ? 0 : 2850);
    }, { once: true });

    const reveals = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) reveals.forEach((el) => el.classList.add("is-visible"));
    else {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      }), { threshold: 0.12 });
      reveals.forEach((element) => observer.observe(element));
    }
    setupCountdown();
    setupRsvp();
    setupMusic();
    buildCoverSprinkles(26);
  }

  function setupCountdown() {
    if (!config.date) return;
    const target = new Date(config.date).getTime();
    const countdown = document.getElementById("countdown");
    const arrived = document.getElementById("cdArrived");
    const units = [["cdDays", 86400000], ["cdHours", 3600000], ["cdMins", 60000], ["cdSecs", 1000]];
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { if (countdown) countdown.hidden = true; if (arrived) { arrived.hidden = false; arrived.textContent = "حلّ موعد الحفل 🎂"; } return false; }
      let rest = diff;
      units.forEach(([id, value], index) => {
        const amount = Math.floor(rest / value);
        rest %= value;
        setText(id, toArabicDigits(index === 0 ? amount : String(amount).padStart(2, "0")));
      });
      return true;
    };
    if (tick()) window.setInterval(tick, 1000);
  }

  function setupRsvp() {
    let answer = "نعم";
    let companions = 0;
    const count = document.getElementById("companionCount");
    document.getElementById("attendance")?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-answer]");
      if (!button) return;
      answer = button.dataset.answer;
      document.querySelectorAll("#attendance button").forEach((item) => item.classList.toggle("selected", item === button));
    });
    document.getElementById("minus")?.addEventListener("click", () => { companions = Math.max(0, companions - 1); setText("companionCount", toArabicDigits(companions)); });
    document.getElementById("plus")?.addEventListener("click", () => { companions = Math.min(20, companions + 1); setText("companionCount", toArabicDigits(companions)); });
    document.getElementById("rsvpForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("guestName").value.trim();
      const greeting = document.getElementById("greeting").value.trim();
      const lines = [`تأكيد حضور عيد ميلاد ${config.celebrant || ""}`, `الاسم: ${name}`, `الحضور: ${answer}`, `المرافقون: ${toArabicDigits(companions)}`];
      if (greeting) lines.push(`التهنئة: ${greeting}`);
      window.open(`${config.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
    });
  }

  function setupMusic() {
    const button = document.getElementById("musicButton");
    const playerContainer = document.getElementById("musicPlayer");
    if (!button || !playerContainer || !config.music?.youtubeVideoId) { button?.remove(); return; }
    let player;
    let loading = false;
    let playing = false;
    let playbackRequested = false;
    const paint = () => {
      button.textContent = playing ? "🔊" : "🎵";
      button.setAttribute("aria-pressed", String(playing));
      button.setAttribute("aria-label", playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى");
    };
    function createPlayer() {
      if (!window.YT?.Player || loading) return;
      loading = true;
      player = new YT.Player("musicPlayer", {
        videoId: config.music.youtubeVideoId,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, playsinline: 1, rel: 0, origin: location.origin, start: config.music.startSeconds || 0 },
        events: {
          onReady: (event) => {
            loading = false;
            if (playbackRequested) event.target.playVideo();
          },
          onStateChange: (event) => {
            playing = event.data === YT.PlayerState.PLAYING;
            paint();
            if (event.data === YT.PlayerState.ENDED) event.target.playVideo();
          }
        }
      });
    }
    button.addEventListener("click", () => {
      if (playing) { player?.pauseVideo(); playing = false; paint(); return; }
      playbackRequested = true;
      if (player) { player.playVideo(); return; }
      if (window.YT?.Player) { createPlayer(); return; }
      button.textContent = "…";
    });
    if (!document.getElementById("youtube-api")) {
      const api = document.createElement("script");
      api.id = "youtube-api";
      api.src = "https://www.youtube.com/iframe_api";
      document.head.append(api);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else if (window.YT?.Player) createPlayer();
  }

  function buildCoverSprinkles(count) {
    if (reducedMotion) return;
    const layer = document.getElementById("coverSprinkles");
    if (!layer) return;
    const colors = ["#ff5d8f", "#4cc4d6", "#ffb22e", "#8a6cff", "#ff7aa6"];
    for (let i = 0; i < count; i += 1) {
      const sprinkle = document.createElement("span");
      sprinkle.style.left = `${Math.random() * 100}%`;
      sprinkle.style.background = colors[i % colors.length];
      sprinkle.style.height = `${10 + Math.random() * 10}px`;
      sprinkle.style.animationDuration = `${5 + Math.random() * 5}s`;
      sprinkle.style.animationDelay = `${Math.random() * 5}s`;
      layer.append(sprinkle);
    }
  }

  function startConfetti(count) {
    if (reducedMotion) return;
    const layer = document.getElementById("confetti");
    if (!layer) return;
    const colors = ["#ff5d8f", "#4cc4d6", "#ffb22e", "#8a6cff", "#ff7aa6", "#7ee3a0"];
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("span");
      piece.className = "conf";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.width = `${6 + Math.random() * 6}px`;
      piece.style.height = `${10 + Math.random() * 8}px`;
      piece.style.animationDuration = `${5 + Math.random() * 5}s`;
      piece.style.animationDelay = `${Math.random() * 4}s`;
      layer.append(piece);
    }
  }
  fillContent();
  setupInteractions();
})();

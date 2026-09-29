(() => {
  const config = window.__INVITE__?.config;
  if (!config) return;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "";
  };

  function buildPrayers() {
    const list = document.getElementById("prayersList");
    if (!list || !Array.isArray(config.prayers)) return;
    config.prayers.forEach((prayer) => {
      const card = document.createElement("article");
      card.className = "prayer-card";
      const text = document.createElement("p");
      text.textContent = prayer.text;
      const source = document.createElement("a");
      source.href = prayer.url;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = prayer.source;
      card.append(text, source);
      list.append(card);
    });
  }

  function buildHadith() {
    const card = document.getElementById("hadithCard");
    if (!card || !config.hadith) return;
    const quote = document.createElement("blockquote");
    quote.textContent = `«${config.hadith.text}»`;
    const source = document.createElement("p");
    source.className = "source";
    source.textContent = config.hadith.source;
    const link = document.createElement("a");
    link.href = config.hadith.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "مصدر الحديث";
    card.append(quote, source, link);
  }

  function buildCalendar() {
    const event = config.date;
    if (!event) {
      document.getElementById("calendarSection")?.remove();
      return;
    }
    setText("calendarDate", config.dateText);
    setText("calendarTime", config.timeText);
    const start = new Date(event);
    const end = new Date(start.getTime() + (Number(config.durationHours || 4) * 60 * 60 * 1000));
    const parts = (date) => Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
      timeZone: config.timezone || "Asia/Baghdad",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(date).map(({ type, value }) => [type, value]));
    const asCalendarDate = (value) => {
      const p = parts(value);
      return `${p.year}${p.month}${p.day}T${p.hour}${p.minute}`;
    };
    const startValue = asCalendarDate(start);
    const endValue = asCalendarDate(end);
    const title = `بشارة مولود ${config.celebrant}`;
    const details = config.invitationText || "";
    const location = [config.venueName, config.venueAddr].filter(Boolean).join(" — ");
    const google = new URL("https://calendar.google.com/calendar/render");
    google.search = new URLSearchParams({
      action: "TEMPLATE", text: title, dates: `${startValue}/${endValue}`,
      ctz: config.timezone || "Asia/Baghdad", details, location
    });
    const googleLink = document.getElementById("googleCalendar");
    if (googleLink) googleLink.href = google.toString();

    const eventDate = event.slice(0, 10).replaceAll("-", "");
    const eventTime = event.slice(11, 16).replace(":", "");
    const endDateTime = asCalendarDate(end);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nour Aldeen Mokhmalji//Newborn Announcement//AR",
      "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${eventDate}-${eventTime}@nour-aldeen-invitation`,
      `DTSTART;TZID=${config.timezone || "Asia/Baghdad"}:${eventDate}T${eventTime}`,
      `DTEND;TZID=${config.timezone || "Asia/Baghdad"}:${endDateTime}`,
      `SUMMARY:${title}`, `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
      `LOCATION:${location}`, "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const icsLink = document.getElementById("icsCalendar");
    if (icsLink) icsLink.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  }

  function fillMetadata() {
    const title = `بشارة مولود ${config.celebrant}`;
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", config.invitationText || title);
    document.querySelector('meta[name="description"]')?.setAttribute("content", config.invitationText || title);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);
    const share = config.images?.share;
    if (share) {
      const shareUrl = new URL(share, window.location.href).href;
      document.querySelector('meta[property="og:image"]')?.setAttribute("content", shareUrl);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", shareUrl);
    }
  }

  function setupRsvp() {
    const section = document.getElementById("rsvpSection");
    if (!section) return;
    if (!config.whatsappUrl) {
      section.remove();
      return;
    }
    section.hidden = false;
    let attendance = "نعم";
    let companions = 0;
    const counter = document.getElementById("guestCount");
    const updateCounter = () => { counter.textContent = new Intl.NumberFormat("ar").format(companions); };
    section.querySelectorAll("[data-attendance]").forEach((button) => {
      button.addEventListener("click", () => {
        attendance = button.dataset.attendance;
        section.querySelectorAll("[data-attendance]").forEach((option) => {
          option.setAttribute("aria-pressed", String(option === button));
        });
      });
    });
    document.getElementById("guestMinus").addEventListener("click", () => {
      companions = Math.max(0, companions - 1);
      updateCounter();
    });
    document.getElementById("guestPlus").addEventListener("click", () => {
      companions += 1;
      updateCounter();
    });
    document.getElementById("rsvpForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("guestName").value.trim();
      const greeting = document.getElementById("guestMessage").value.trim();
      const message = [
        `تأكيد حضور لبشارة المولود ${config.celebrant}`,
        `الاسم: ${name}`,
        `الحضور: ${attendance}`,
        `عدد المرافقين: ${new Intl.NumberFormat("ar").format(companions)}`,
        greeting ? `التهنئة: ${greeting}` : ""
      ].filter(Boolean).join("\n");
      try {
        const url = new URL(config.whatsappUrl);
        url.searchParams.set("text", message);
        window.open(url.href, "_blank", "noopener,noreferrer");
      } catch (_) {
        window.alert("تحقّق من رابط واتساب في ملف الإعدادات.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setText("parentsLine", config.parents ? `الوالدان: ${config.parents}` : "");
    buildPrayers();
    buildHadith();
    buildCalendar();
    setupRsvp();
    fillMetadata();
  });
})();

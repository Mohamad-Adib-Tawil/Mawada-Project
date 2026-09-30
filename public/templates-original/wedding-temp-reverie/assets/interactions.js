(() => {
  const config = window.__INVITE__?.config;
  if (!config) return;

  const orderUrl = config.whatsappUrl;
  const assets = config.assets;
  const envelope = document.querySelector("#envVid");
  const hero = document.querySelector("#heroVid");
  if (envelope) { envelope.poster = assets.envelopePoster; envelope.querySelector('[data-video="envelope"]').src = assets.envelopeVideo; envelope.load(); }
  if (hero) { hero.poster = assets.heroPoster; hero.querySelector('[data-video="hero"]').src = assets.heroVideo; hero.load(); }
  document.querySelectorAll("[data-gallery-index]").forEach((image) => {
    const path = assets.gallery[Number(image.dataset.galleryIndex)];
    if (path) image.src = path;
  });
  const title = `دعوة زفاف ${config.groom} & ${config.bride}`;
  document.title = title;
  const shareTitle = document.querySelector('meta[property="og:title"]');
  if (shareTitle) shareTitle.content = title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${config.dateText} • ${config.venueName}`;
  const shareDescription = document.querySelector('meta[property="og:description"]');
  if (shareDescription) shareDescription.content = `${config.dateText} • ${config.venueName}`;
  const shareImage = document.querySelector('meta[property="og:image"]');
  if (shareImage) shareImage.content = new URL(assets.shareImage, document.baseURI).href;
  const month = document.getElementById("calendar-month");
  const weekday = document.getElementById("calendar-weekday");
  const day = document.getElementById("calendar-day");
  if (month) month.textContent = config.calendar.monthText;
  if (weekday) weekday.textContent = config.calendar.weekdayText;
  if (day) day.textContent = config.calendar.dayText;
  ["request-order", "request-whatsapp"].forEach((id) => {
    const link = document.getElementById(id);
    if (link && orderUrl) {
      link.href = orderUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  const eventTitle = `دعوة زفاف ${config.groom} & ${config.bride}`;
  const start = new Date(config.date);
  const end = new Date(start.getTime() + (config.calendar.durationHours || 4) * 3600000);
  const toCalendarDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  googleUrl.searchParams.set("action", "TEMPLATE");
  googleUrl.searchParams.set("text", eventTitle);
  googleUrl.searchParams.set("dates", `${toCalendarDate(start)}/${toCalendarDate(end)}`);
  googleUrl.searchParams.set("ctz", config.calendar.timezone);
  googleUrl.searchParams.set("location", config.calendar.location);
  googleUrl.searchParams.set("details", config.invitationText);
  const googleLink = document.getElementById("google-calendar");
  if (googleLink) googleLink.href = googleUrl.toString();

  const appleLink = document.getElementById("apple-calendar");
  if (appleLink) {
    appleLink.addEventListener("click", (event) => {
      event.preventDefault();
      const escapeIcs = (text) => String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//AR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
        `UID:${Date.now()}@wedding-invitation`, `DTSTAMP:${toCalendarDate(new Date())}`,
        `DTSTART:${toCalendarDate(start)}`, `DTEND:${toCalendarDate(end)}`,
        `SUMMARY:${escapeIcs(eventTitle)}`, `LOCATION:${escapeIcs(config.calendar.location)}`,
        `DESCRIPTION:${escapeIcs(config.invitationText)}`, "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      const file = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const download = document.createElement("a");
      download.href = URL.createObjectURL(file);
      download.download = "wedding-invitation.ics";
      download.click();
      URL.revokeObjectURL(download.href);
    });
  }

  const form = document.getElementById("da3wa-rsvp-form");
  if (!form) return;
  const error = document.getElementById("da3wa-err");
  const counter = document.getElementById("da3wa-guests");
  const minus = document.getElementById("da3wa-minus");
  const plus = document.getElementById("da3wa-plus");
  const pills = [...document.querySelectorAll("#da3wa-att .pill")];
  let attendance = "yes";
  let companions = 0;
  const paintCounter = () => { counter.textContent = String(companions); };
  pills.forEach((pill) => pill.addEventListener("click", () => {
    attendance = pill.dataset.v;
    pills.forEach((option) => option.setAttribute("aria-pressed", String(option === pill)));
  }));
  minus.addEventListener("click", () => { companions = Math.max(0, companions - 1); paintCounter(); });
  plus.addEventListener("click", () => { companions = Math.min(49, companions + 1); paintCounter(); });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    if (!form.reportValidity()) return;
    const guestName = form.elements.guest_name.value.trim();
    const message = form.elements.message.value.trim();
    const status = attendance === "yes" ? "شكراً لتأكيد حضورك، بانتظارك بكل شوق 🤍" : attendance === "no" ? "شكراً لإبلاغنا، سنفتقد حضورك 🤍" : "شكراً لردّك، نأمل أن نراك في فرحتنا 🤍";
    const result = document.createElement("div");
    result.className = "ok";
    result.setAttribute("role", "status");
    result.innerHTML = `<div class="emoji">🎉</div><h3>تم تسجيل ردّك على هذا الجهاز</h3><p class="sub"></p>`;
    result.querySelector(".sub").textContent = status;
    form.replaceWith(result);

    if (message) {
      const list = document.getElementById("da3wa-wish-list");
      const card = document.createElement("div");
      card.className = "wish";
      const avatar = document.createElement("div");
      avatar.className = "wish-av";
      avatar.textContent = guestName.charAt(0) || "♥";
      const body = document.createElement("div");
      body.className = "wish-body";
      const name = document.createElement("div");
      name.className = "wish-name";
      name.textContent = guestName;
      const note = document.createElement("div");
      note.className = "wish-msg";
      note.textContent = message;
      body.append(name, note);
      card.append(avatar, body);
      list.prepend(card);
    }
  });
})();

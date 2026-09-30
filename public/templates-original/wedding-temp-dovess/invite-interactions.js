(function () {
  "use strict";

  const config = window.__INVITE__?.config ?? {};

  function initRsvp() {
    const form = document.getElementById("da3wa-rsvp-form");
    if (!form) return;

    let attendance = "yes";
    let guests = 0;
    const count = document.getElementById("da3wa-guests");
    const error = document.getElementById("da3wa-err");
    const pills = [...document.querySelectorAll("#da3wa-att .pill")];

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        attendance = pill.dataset.v || "yes";
        pills.forEach((option) => {
          option.setAttribute("aria-pressed", String(option === pill));
        });
      });
    });

    document.getElementById("da3wa-minus")?.addEventListener("click", () => {
      guests = Math.max(0, guests - 1);
      if (count) count.textContent = String(guests);
    });

    document.getElementById("da3wa-plus")?.addEventListener("click", () => {
      guests = Math.min(20, guests + 1);
      if (count) count.textContent = String(guests);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const guestName = String(data.get("guest_name") || "").trim();
      const message = String(data.get("message") || "").trim();
      const attendanceText = {
        yes: "نعم، سأحضر",
        no: "أعتذر عن الحضور",
        maybe: "لم أقرر بعد",
      }[attendance];
      const body = [
        `تأكيد حضور زفاف ${config.groom || "العريس"} و${config.bride || "العروس"}`,
        `الاسم: ${guestName}`,
        `الحضور: ${attendanceText}`,
        `عدد المرافقين: ${guests}`,
        message ? `رسالة للعروسين: ${message}` : "",
      ].filter(Boolean).join("\n");

      if (message) addWish(guestName, message);
      if (error) {
        error.textContent = "سيُفتح واتساب لإرسال التأكيد. أكمل الإرسال من هناك.";
        error.setAttribute("role", "status");
      }

      const whatsapp = config.whatsappUrl;
      if (!whatsapp) {
        if (error) error.textContent = "رابط واتساب غير مضبوط في ملف إعدادات الدعوة.";
        return;
      }
      const separator = whatsapp.includes("?") ? "&" : "?";
      window.open(`${whatsapp}${separator}text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
    });
  }

  function addWish(name, message) {
    const list = document.getElementById("da3wa-wish-list");
    if (!list) return;

    const colors = ["#7c84a3", "#a3b3d0", "#c8b8a6", "#8fa0c0", "#b3a3c8"];
    const card = document.createElement("div");
    card.className = "wish";
    const avatar = document.createElement("div");
    avatar.className = "wish-av";
    avatar.style.background = colors[list.children.length % colors.length];
    avatar.textContent = name.trim().charAt(0) || "♡";
    const body = document.createElement("div");
    body.className = "wish-body";
    const guest = document.createElement("div");
    guest.className = "wish-name";
    guest.textContent = name;
    const note = document.createElement("div");
    note.className = "wish-msg";
    note.textContent = message;
    body.append(guest, note);
    card.append(avatar, body);
    list.prepend(card);
  }

  function setWhatsAppLinks() {
    const url = config.whatsappUrl;
    if (!url) return;

    const names = document.getElementById("order-names");
    if (names) names.textContent = [config.groom, config.bride].filter(Boolean).join(" & ");
    document.querySelectorAll("#da3wa-democta a").forEach((link) => {
      link.href = url;
    });
  }

  function updateCalendar() {
    const date = new Date(config.date);
    if (Number.isNaN(date.getTime())) return;

    const months = [
      "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
      "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول",
    ];
    const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const [day, month, year] = config.date.slice(0, 10).split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    const top = document.querySelector("#da3wa-cal .cal-top");
    const weekday = document.querySelector("#da3wa-cal .cal-wd");
    const dayNode = document.querySelector("#da3wa-cal .cal-day");
    const time = document.querySelector("#da3wa-cal .cal-time");
    if (top) top.textContent = `${months[month - 1]} ${year}`;
    if (weekday) weekday.textContent = weekdays[localDate.getDay()];
    if (dayNode) dayNode.textContent = String(day);
    if (time) time.textContent = config.timeText || "";

    const [datePart, timePart = "00:00"] = config.date.split("T");
    const start = `${datePart.replaceAll("-", "")}T${timePart.slice(0, 5).replaceAll(":", "")}00`;
    const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
    const end = [
      endDate.getFullYear(),
      String(endDate.getMonth() + 1).padStart(2, "0"),
      String(endDate.getDate()).padStart(2, "0"),
    ].join("") + "T" + String(endDate.getHours()).padStart(2, "0") + String(endDate.getMinutes()).padStart(2, "0") + "00";
    const title = `دعوة زفاف ${config.groom || ""} & ${config.bride || ""}`;
    const location = [config.venueName, config.venueAddr].filter(Boolean).join(" — ");
    const details = [config.invitationText, config.siteUrl].filter(Boolean).join("\n\n");
    const google = new URL("https://calendar.google.com/calendar/render");
    google.search = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${start}/${end}`,
      ctz: config.timeZone || "Asia/Baghdad",
      location,
      details,
    }).toString();
    const googleLink = document.querySelector("#da3wa-cal .cal-btns a:first-child");
    const appleLink = document.querySelector("#da3wa-cal .cal-btns a:nth-child(2)");
    if (googleLink) googleLink.href = google.toString();
    if (appleLink) {
      const eventStart = new Date(`${datePart}T${timePart}Z`);
      const eventEnd = new Date(eventStart.getTime() + 4 * 60 * 60 * 1000);
      const formatLocal = (value) => value.toISOString().slice(0, 19).replaceAll(/[-:]/g, "");
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Wedding Invitation//Doves//AR",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `DTSTART;TZID=${config.timeZone || "Asia/Baghdad"}:${formatLocal(eventStart)}`,
        `DTEND;TZID=${config.timeZone || "Asia/Baghdad"}:${formatLocal(eventEnd)}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${details.replaceAll("\n", "\\n")}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
      const file = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      appleLink.href = URL.createObjectURL(file);
      appleLink.download = "wedding-invitation.ics";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initRsvp();
    setWhatsAppLinks();
    updateCalendar();
  });
})();

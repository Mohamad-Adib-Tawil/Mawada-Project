(() => {
  const config = window.__INVITE__?.config;
  if (!config) return;

  const $ = (selector) => document.querySelector(selector);
  const arabicDigits = (value) => String(value).replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]);
  const date = new Date(config.date);

  function setupCalendar() {
    if (Number.isNaN(date.getTime())) return;

    const months = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
    const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    $(".cal-top").textContent = `${months[date.getMonth()]} ${arabicDigits(date.getFullYear())}`;
    $(".cal-wd").textContent = weekdays[date.getDay()];
    $(".cal-day").textContent = arabicDigits(date.getDate());
    $(".cal-time").textContent = config.timeText;

    const pad = (value) => String(value).padStart(2, "0");
    const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const start = `${day}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
    const end = `${day}T${pad(date.getHours() + 4)}${pad(date.getMinutes())}00`;
    const title = `دعوة خطوبة ${config.groom} & ${config.bride}`;
    const location = `${config.venueName} — ${config.venueAddr}`;
    const google = new URL("https://calendar.google.com/calendar/render");
    google.searchParams.set("action", "TEMPLATE");
    google.searchParams.set("text", title);
    google.searchParams.set("dates", `${start}/${end}`);
    google.searchParams.set("ctz", config.calendarTimezone || "Asia/Damascus");
    google.searchParams.set("location", location);
    google.searchParams.set("details", "دعوة المناسبة");
    $("#googleCalendarLink").href = google.toString();

    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//AR", "BEGIN:VEVENT", `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${title}`, `LOCATION:${location}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    $("#appleCalendarLink").href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }

  function setupRsvp() {
    const form = $("#da3wa-rsvp-form");
    const error = $("#da3wa-err");
    const count = $("#da3wa-guests");
    if (!form || !error || !count) return;

    let attendance = "yes";
    let companions = 0;
    document.querySelectorAll("#da3wa-att .pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        attendance = pill.dataset.v || "yes";
        document.querySelectorAll("#da3wa-att .pill").forEach((item) => item.setAttribute("aria-pressed", String(item === pill)));
      });
    });
    $("#da3wa-minus")?.addEventListener("click", () => { companions = Math.max(0, companions - 1); count.textContent = companions; });
    $("#da3wa-plus")?.addEventListener("click", () => { companions = Math.min(20, companions + 1); count.textContent = companions; });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      error.textContent = "";
      const name = form.elements.guest_name.value.trim();
      const message = form.elements.message.value.trim();
      if (!name) { error.textContent = "يرجى كتابة الاسم الكريم"; return; }
      const attendanceText = { yes: "نعم", no: "لا", maybe: "ربما" }[attendance];
      const body = [`تأكيد حضور — ${config.groom} و ${config.bride}`, `الاسم: ${name}`, `الحضور: ${attendanceText}`, `المرافقون: ${companions}`, message ? `التهنئة: ${message}` : ""].filter(Boolean).join("\n");
      const phone = String(config.contactPhone).replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
      form.reset();
      companions = 0;
      count.textContent = "0";
      document.querySelector("#da3wa-att .pill[data-v='yes']")?.click();
      error.textContent = "سيتم فتح واتساب لإرسال التأكيد";
    });
  }

  function setupOrderLinks() {
    document.querySelectorAll("#da3wa-democta .dc-order, #da3wa-democta .dc-wa").forEach((link) => { link.href = config.orderUrl; });
  }

  setupCalendar();
  setupRsvp();
  setupOrderLinks();
})();

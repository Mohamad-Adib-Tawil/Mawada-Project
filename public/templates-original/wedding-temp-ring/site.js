(function () {
  "use strict";
  var config = (window.__INVITE__ || {}).config || {};
  var assets = config.assets || {};
  function byId(id) { return document.getElementById(id); }
  function setText(id, value) { var el = byId(id); if (el && value != null) el.textContent = value; }

  function applyAssets() {
    document.querySelectorAll("[data-asset]").forEach(function (element) {
      var path = assets[element.getAttribute("data-asset")];
      if (!path) return;
      if (element.tagName === "META") element.content = new URL(path, location.href).href;
      else if (element.tagName === "LINK") element.href = path;
      else if (element.tagName === "VIDEO") element.src = path;
      else element.src = path;
    });
    document.documentElement.style.setProperty("--cover-poster", "url('" + (assets.videoPoster || "") + "')");
    document.documentElement.style.setProperty("--open-box-image", "url('" + (assets.openBox || "") + "')");
    var video = byId("boxVideo");
    if (video && assets.videoPoster) video.poster = assets.videoPoster;
  }

  function applyInvitation() {
    document.title = config.invitationTitle || document.title;
    var description = document.querySelector('meta[name="description"]');
    if (description) description.content = config.invitationDescription || "";
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = config.invitationTitle || "";
    var ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = config.invitationDescription || "";
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = config.invitationUrl || location.href;
    setText("calendarMonth", config.monthText);
    setText("calendarWeekday", config.weekdayText);
    setText("calendarDay", config.dayText);
    setText("calendarTime", config.timeText);
    document.querySelectorAll(".occasion-label").forEach(function (el) { el.textContent = config.occasionLabel || ""; });
    document.querySelectorAll(".occasion-latin").forEach(function (el) { el.textContent = config.occasionLatin || ""; });

    var eventDate = new Date(config.date);
    if (!isNaN(eventDate.getTime())) {
      var end = new Date(eventDate.getTime() + (config.durationHours || 4) * 3600000);
      function stamp(date) {
        return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      }
      var title = "دعوة خطوبة " + [config.groom, config.bride].filter(Boolean).join(" & ");
      var locationText = [config.venueName, config.venueAddr].filter(Boolean).join(" — ");
      var details = "رابط الدعوة: " + (config.invitationUrl || location.href);
      var query = new URLSearchParams({
        action: "TEMPLATE", text: title, dates: stamp(eventDate) + "/" + stamp(end),
        ctz: config.timezone || "Asia/Baghdad", location: locationText, details: details
      });
      var google = byId("calendarGoogle");
      if (google) google.href = "https://calendar.google.com/calendar/render?" + query.toString();
      var ical = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
        "DTSTART:" + stamp(eventDate), "DTEND:" + stamp(end), "SUMMARY:" + title,
        "LOCATION:" + locationText, "DESCRIPTION:" + details, "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var apple = byId("calendarApple");
      if (apple) apple.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ical);
    }

    ["contactLink", "orderLink", "orderWhatsApp"].forEach(function (id) {
      var link = byId(id);
      if (link) link.href = id === "orderLink" ? (config.orderUrl || config.whatsappUrl || "#") : (config.whatsappUrl || "#");
    });
    setText("contactPhoneText", config.contactButtonText || "واتساب");
    setText("orderButtonText", config.orderButtonText || "اطلبه 🎉");
    setText("orderTitleText", config.orderTitleText || "هل ترغب بطلب الدعوة؟");
    setText("orderPromptText", config.orderPromptText || "تواصل معنا عبر واتساب لطلبها أو للاستفسار.");
    setText("orderNoteText", config.orderNoteText || "نرحّب برسالتكم");

    var wishes = byId("da3wa-wish-list");
    if (wishes && config.rsvp && Array.isArray(config.rsvp.wishes)) {
      var colors = ["#d4af6a", "#b0546e", "#c9973f", "#e79aac", "#8f3c52"];
      wishes.replaceChildren();
      config.rsvp.wishes.forEach(function (wish, index) {
        var card = document.createElement("div"); card.className = "wish";
        var avatar = document.createElement("div"); avatar.className = "wish-av";
        avatar.style.background = colors[index % colors.length];
        avatar.textContent = (wish.name || "♥").charAt(0);
        var body = document.createElement("div"); body.className = "wish-body";
        var name = document.createElement("div"); name.className = "wish-name"; name.textContent = wish.name || "";
        var message = document.createElement("div"); message.className = "wish-msg"; message.textContent = wish.message || "";
        body.append(name, message); card.append(avatar, body); wishes.append(card);
      });
    }
  }

  applyAssets();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyInvitation, { once: true });
  else applyInvitation();
})();

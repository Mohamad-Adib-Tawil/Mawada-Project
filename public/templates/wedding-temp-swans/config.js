/* Update event details, text, links, and asset paths here. */
window.INVITATION = {
  couple: {
    groom: { ar: "كنان", en: "Kenan" },
    bride: { ar: "سارة", en: "Sara" }
  },
  event: {
    kind: "wedding",
    date: "2026-11-06T18:00:00",
    timezone: "Asia/Baghdad",
    dateText: "يوم الجمعة، ٦ تشرين الثاني ٢٠٢٦",
    timeText: "الساعة السادسة مساءً",
    calendarMonth: "تشرين الثاني ٢٠٢٦",
    calendarWeekday: "الجمعة",
    calendarDay: "٦"
  },
  venue: {
    name: "قاعة زنبق الكبرى",
    address: "بغداد — المنصور",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Baghdad"
  },
  text: {
    welcome: "نتشرّف بحضوركم لحفل زفافنا",
    familyIntro: "مع عائلتَيهما",
    invitation: "بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا",
    blessing: "اللّهُمَّ بارِكْ لهُما، وبارِكْ عليهِما، واجمَعْ بينهُما في خير",
    closing: "اغمرونا بصادق دعواتكم",
    notes: [
      "يُرجى تأكيد الحضور قبل ٣٠ تشرين الأول ليتسنّى لنا حسن استقبالكم",
      "الرجاء الحضور قبل الموعد بنصف ساعة — دخول العروسين الساعة السابعة تماماً",
      "تتوفر مواقف سيارات خاصة داخل القاعة"
    ],
    programme: [],
    specialNote: "نعتذر عن اصطحاب الأطفال — جنة الأطفال منازلهم 🤍",
    titleSuffix: "دعوة زفاف",
    loading: "جارٍ تجهيز الدعوة…",
    welcomeHenna: "نتشرّف بحضوركم لحفل الحنّة",
    welcomeNikah: "نتشرّف بحضوركم لعقد القِران",
    mapTitle: "خريطة",
    thanksTitleYes: "شكراً {name}!",
    thanksYes: "بانتظاركم بكل الشوق",
    thanksTitleNo: "شكراً {name}",
    thanksNo: "وجودكم سيُفتقد",
    errorMessage: "حدث خطأ — حاولوا مرة أخرى",
    calendarTitle: "احفظ الموعد 🤍",
    calendarHint: "📲 أضِف الموعد إلى تقويم هاتفك بضغطة",
    rsvpTitle: "تأكيد الحضور",
    rsvpWelcome: "يسعدنا تأكيد حضوركم",
    wishesTitle: "كلمات المهنّئين 🤍"
  },
  links: {
    whatsapp: "https://wa.me/+963992688759",
    invitation: "https://mohamad-adib-tawil.github.io/wedding-temp-swans/",
    soundtrackVideoId: "Hp8WTVqR_0U"
  },
  assets: {
    entranceVideo: "./assets/entrance.mp4",
    entrancePoster: "./assets/entrance-poster.jpg",
    hero: "./assets/hero.jpg",
    orchid: "./assets/orchid.png",
    socialShare: "./assets/share.jpg"
  }
};

const invitation = window.INVITATION;
invitation.texts = {
  program: [["٦:٠٠ مساءً", "استقبال الضيوف"], ["٧:٠٠ مساءً", "دخول العروسين"], ["٨:٠٠ مساءً", "مأدبة العشاء"], ["٩:٠٠ مساءً", "إلى ساحة الرقص"]],
  loading: invitation.text.loading,
  titleSuffix: invitation.text.titleSuffix,
  welcomeHenna: invitation.text.welcomeHenna,
  welcomeNikah: invitation.text.welcomeNikah,
  mapTitle: invitation.text.mapTitle,
  thanksTitleYes: invitation.text.thanksTitleYes,
  thanksYes: invitation.text.thanksYes,
  thanksTitleNo: invitation.text.thanksTitleNo,
  thanksNo: invitation.text.thanksNo,
  err: invitation.text.errorMessage,
  mapQuery: ""
};
const assetUrl = name => new URL(invitation.assets[name], document.baseURI).href;
document.documentElement.style.setProperty("--asset-entrance-poster", `url("${assetUrl("entrancePoster")}")`);
document.documentElement.style.setProperty("--asset-hero", `url("${assetUrl("hero")}")`);
const digitMap = "٠١٢٣٤٥٦٧٨٩";
const arabicDigits = value => String(value).replace(/[0-9]/g, digit => digitMap[Number(digit)]);
const localDate = new Date(invitation.event.date);
const toCompactDate = date => {
  const part = value => `${value}`.padStart(2, "0");
  return `${date.getFullYear()}${part(date.getMonth() + 1)}${part(date.getDate())}T${part(date.getHours())}${part(date.getMinutes())}00`;
};
const clean = value => String(value ?? "").replace(/[\\,;]/g, " ");
const escapeIcs = value => clean(value).replace(/\n/g, "\\n");
const makeIcs = () => [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//AR", "CALSCALE:GREGORIAN",
  "BEGIN:VEVENT", `DTSTART;TZID=${invitation.event.timezone}:${toCompactDate(localDate)}`,
  `DTEND;TZID=${invitation.event.timezone}:${toCompactDate(new Date(localDate.getTime() + 4 * 60 * 60 * 1000))}`,
  `SUMMARY:${escapeIcs(`زفاف ${invitation.couple.groom.ar} و${invitation.couple.bride.ar}`)}`,
  `LOCATION:${escapeIcs(`${invitation.venue.name} — ${invitation.venue.address}`)}`,
  `DESCRIPTION:${escapeIcs(invitation.links.invitation)}`, "END:VEVENT", "END:VCALENDAR"
].join("\r\n");

window.__INVITE__ = { config: {
  date: invitation.event.date,
  dateText: invitation.event.dateText,
  timeText: invitation.event.timeText,
  invitationText: invitation.text.invitation,
  venueName: invitation.venue.name,
  venueAddr: invitation.venue.address,
  mapUrl: invitation.venue.mapUrl,
  program: invitation.text.programme,
  notes: invitation.text.notes,
  closingNote: invitation.text.closing,
  occasion: invitation.event.kind,
  groom: invitation.couple.groom.ar,
  bride: invitation.couple.bride.ar,
  groomRelationName: invitation.couple.groom.ar,
  brideRelationName: invitation.couple.bride.ar,
  groomParents: "السيّد كريم عبد الله وعقيلته",
  brideParents: "السيّد سامي حسن وعقيلته",
  verse: invitation.text.blessing,
  contactPhone: invitation.links.whatsapp.replace("https://wa.me/", ""),
  contactLabel: "للاستفسار والتأكيد",
  contactName: "واتساب"
}};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-asset]").forEach(element => {
    const path = invitation.assets[element.dataset.asset];
    if (!path) return;
    if (element.tagName === "LINK") element.href = path;
    else element.src = path;
  });
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
  const title = `دعوة زفاف ${invitation.couple.groom.ar} & ${invitation.couple.bride.ar}`;
  document.title = title;
  const description = `دعوة زفاف ${invitation.couple.groom.ar} (${invitation.couple.groom.en}) و${invitation.couple.bride.ar} (${invitation.couple.bride.en}) — ${invitation.event.dateText}`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", invitation.links.invitation);
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", new URL(invitation.assets.socialShare, invitation.links.invitation).href);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", new URL(invitation.assets.socialShare, invitation.links.invitation).href);

  const welcome = document.querySelector("#welcomeAr");
  if (welcome) {
    const textNode = Array.from(welcome.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
    if (textNode) textNode.nodeValue = ` ${invitation.text.welcome} `;
  }
  const familyIntro = document.querySelector("#togetherAr");
  if (familyIntro) familyIntro.textContent = invitation.text.familyIntro;
  const specialNote = document.querySelector("#da3wa-note .hn-text");
  if (specialNote) specialNote.textContent = invitation.text.specialNote;
  document.querySelector("#da3wa-cal .cal-title")?.replaceChildren(document.createTextNode(invitation.text.calendarTitle));
  const calendarHint = document.querySelector("#da3wa-cal .cal-cap");
  if (calendarHint) calendarHint.textContent = invitation.text.calendarHint;
  const rsvpHeading = document.querySelector("#da3wa-form-wrap h3");
  const rsvpIntro = document.querySelector("#da3wa-form-wrap .sub");
  const wishesHeading = document.querySelector("#da3wa-wishes .wishes-h h3");
  if (rsvpHeading) rsvpHeading.textContent = invitation.text.rsvpTitle;
  if (rsvpIntro) rsvpIntro.textContent = invitation.text.rsvpWelcome;
  if (wishesHeading) wishesHeading.textContent = invitation.text.wishesTitle;

  const topDate = document.querySelector("#dateAr");
  const bodyDate = document.querySelector("#dateBody");
  const dateLabel = `${invitation.event.dateText} — ${invitation.event.timeText}`;
  if (topDate) topDate.textContent = dateLabel;
  if (bodyDate) bodyDate.textContent = dateLabel;
  const month = document.querySelector("#da3wa-cal .cal-top");
  const weekday = document.querySelector("#da3wa-cal .cal-wd");
  const day = document.querySelector("#da3wa-cal .cal-day");
  const calTime = document.querySelector("#da3wa-cal .cal-time");
  if (month) month.textContent = invitation.event.calendarMonth;
  if (weekday) weekday.textContent = invitation.event.calendarWeekday;
  if (day) day.textContent = invitation.event.calendarDay;
  if (calTime) calTime.textContent = invitation.event.timeText;

  const googleCalendar = new URL("https://calendar.google.com/calendar/render");
  googleCalendar.search = new URLSearchParams({
    action: "TEMPLATE",
    text: `دعوة زفاف ${invitation.couple.groom.ar} & ${invitation.couple.bride.ar}`,
    dates: `${toCompactDate(localDate)}/${toCompactDate(new Date(localDate.getTime() + 4 * 60 * 60 * 1000))}`,
    ctz: invitation.event.timezone,
    location: `${invitation.venue.name} — ${invitation.venue.address}`,
    details: `رابط الدعوة: ${invitation.links.invitation}`
  }).toString();
  const gcal = document.querySelector("#googleCalendarLink");
  if (gcal) gcal.href = googleCalendar.href;
  const icsLink = document.querySelector("#appleCalendarLink");
  if (icsLink) {
    icsLink.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(makeIcs())}`;
    icsLink.download = "wedding-invitation.ics";
  }

  document.querySelectorAll("#da3wa-democta .dc-order, #da3wa-democta .dc-wa").forEach(link => {
    link.href = invitation.links.whatsapp;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  const contact = document.querySelector("#contactLink");
  if (contact) contact.href = invitation.links.whatsapp;
  const map = document.querySelector("#mapBtn");
  if (map) map.href = invitation.venue.mapUrl;

  // Static hosting has no RSVP API. Hand the completed reply to WhatsApp for sending.
  const form = document.querySelector("#da3wa-rsvp-form");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const name = form.elements.guest_name.value.trim();
    const attendance = document.querySelector('#da3wa-att [aria-pressed="true"]')?.dataset.v || "yes";
    const attendanceText = { yes: "نعم، سأحضر", no: "أعتذر عن الحضور", maybe: "ربما أحضر" }[attendance];
    const guests = document.querySelector("#da3wa-guests")?.textContent || "0";
    const message = form.elements.message.value.trim();
    const text = [
      `تأكيد حضور — ${invitation.couple.groom.ar} و${invitation.couple.bride.ar}`,
      `الاسم: ${name}`, `الرد: ${attendanceText}`, `المرافقون: ${guests}`,
      message ? `رسالة: ${message}` : ""
    ].filter(Boolean).join("\n");
    window.open(`${invitation.links.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }, true);
});

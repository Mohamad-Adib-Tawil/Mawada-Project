/*
 * بيانات الدعوة القابلة للتعديل.
 * اترك النصوص التي لا تريد تغييرها كما هي، وعدّل هذا الملف لتحديث الدعوة.
 */
window.__INVITE__ = {
  config: {
    groom: "مروان",
    groomEnglish: "Marwan",
    bride: "بيان",
    brideEnglish: "Bayan",

    date: "2026-12-18T19:00:00",
    timeZone: "Asia/Baghdad",
    musicVideoId: "Hp8WTVqR_0U",
    dateText: "يوم الجمعة، ١٨ كانون الأول ٢٠٢٦",
    timeText: "الساعة السابعة مساءً",
    heroSub: "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر",
    invitationText:
      "بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.",
    verse: "اللّهُمَّ بارِكْ لهُما، وبارِكْ عليهِما، واجمَعْ بينهُما في خير",

    groomParents: "نجل السيّد عبد الله حنّا و السيّدة مريم",
    brideParents: "كريمة السيّد عبد العزيز و السيّدة ليلى",
    closingFamilies: "عائلة حنّا  &  عائلة عبد العزيز",
    showFamilies: true,

    venueName: "قاعة الحمراء للمناسبات",
    venueAddr: "بغداد — شارع الكرادة",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Baghdad",

    program: [
      { time: "٧:٠٠ مساءً", title: "استقبال الضيوف" },
      { time: "٨:٠٠ مساءً", title: "مراسم الزفاف" },
      { time: "٩:٠٠ مساءً", title: "العشاء" },
      { time: "١٠:٣٠ مساءً", title: "السهرة والاحتفال" },
    ],
    notes: [
      "يُرجى الحضور قبل الموعد بنصف ساعة",
      "نتشرّف بحضوركم بأبهى حلّة",
      "التصوير مسموح، شاركونا أجمل اللحظات",
      "الدعوة تشمل حاملها والعائلة الكريمة",
    ],

    closingNote: "حضوركم يزيّن فرحتنا",
    hashtag: "#مروان_أديب_وبيان",
    contactLabel: "للاستفسار والتأكيد",
    contactName: "+963 992 688 759",
    whatsappUrl: "https://wa.me/+963992688759",
    siteUrl: "https://mohamad-adib-tawil.github.io/wedding-temp-dovess/",

    images: {
      hero: "",
      background: "",
      venue: "",
      emblem: "templates/doves/assets/emblem-dove.png",
      doveSprite: "templates/doves/assets/bird.webp",
      gallery: [
        "media/gallery/1.jpg",
        "media/gallery/2.jpg",
        "media/gallery/3.jpg",
        "media/gallery/4.jpg",
      ],
      share: "share.jpg",
    },
  },
};

const invitationConfig = window.__INVITE__.config;
document.title = `دعوة زفاف ${invitationConfig.groom} & ${invitationConfig.bride}`;
const metaDescription = [invitationConfig.dateText, invitationConfig.venueName].filter(Boolean).join(" • ");
document.querySelector('meta[name="description"]')?.setAttribute("content", metaDescription);
document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
document.querySelector('meta[property="og:description"]')?.setAttribute("content", metaDescription);
document.querySelector('meta[property="og:url"]')?.setAttribute("content", invitationConfig.siteUrl);
document.querySelector('meta[property="og:image"]')?.setAttribute(
  "content",
  new URL(invitationConfig.images.share, invitationConfig.siteUrl).href,
);
document.querySelector('meta[name="twitter:image"]')?.setAttribute(
  "content",
  new URL(invitationConfig.images.share, invitationConfig.siteUrl).href,
);

window.__da3waStoryText = {
  primary: `${window.__INVITE__.config.groom} & ${window.__INVITE__.config.bride}`,
  brand: "",
};

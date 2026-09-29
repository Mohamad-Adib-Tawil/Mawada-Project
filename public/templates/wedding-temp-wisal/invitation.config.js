/* Editable invitation content and asset paths. Keep event copy and links here. */
window.__INVITE__ = {
  config: {
    groom: "محمد أديب طويل",
    groomLatin: "Mohamad Adib Tawil",
    bride: "رزان بطايحي",
    brideLatin: "Razan Bataihi",
    date: "2026-10-24T19:00:00+03:00",
    dateText: "يوم السبت، ٢٤ تشرين الأول ٢٠٢٦",
    timeText: "الساعة السابعة مساءً",
    timeZone: "Asia/Baghdad",
    calendarMonthText: "تشرين الأول 2026",
    calendarWeekdayText: "السبت",
    calendarDayText: "24",
    publicUrl: "https://mohamad-adib-tawil.github.io/wedding-temp-wisal/",
    durationHours: 4,
    heroSub: "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر",
    verse: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    invitationText: "بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.",
    groomParents: "نجل السيّد كريم عبد الله و السيّدة هدى",
    brideParents: "كريمة السيّد سامي حسن و السيّدة رنا",
    venueName: "قاعة الوصال",
    venueAddr: "بغداد — المنصور",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Baghdad",
    program: [
      { time: "٧:٠٠ مساءً", title: "استقبال الضيوف" },
      { time: "٨:٠٠ مساءً", title: "بدء الحفل" },
      { time: "٩:٣٠ مساءً", title: "العشاء" },
      { time: "١٠:٣٠ مساءً", title: "السهرة" }
    ],
    notes: ["يُرجى الحضور قبل الموعد بنصف ساعة", "نتشرّف بحضوركم بأبهى حلّة"],
    closingNote: "حضوركم يزيّن فرحتنا ويُكمل بهجتنا",
    hashtag: "#محمد_ورزان",
    contactLabel: "للاستفسار والتأكيد",
    contactName: "واتساب",
    contactPhone: "+963992688759",
    whatsappLink: "https://wa.me/+963992688759",
    orderLink: "https://wa.me/+963992688759",
    closingFamilies: "عائلة عبد الله  &  عائلة حسن",
    occasion: "wedding",
    showFamilies: true,
    brideFirst: false,
    musicVideoId: "Hp8WTVqR_0U",
    assets: {
      entranceVideo: "assets/entrance.mp4",
      poster: "assets/poster.jpg",
      hero: "assets/hero.webp",
      share: "assets/share.jpg",
      favicon: "assets/favicon.svg"
    }
  }
};

(function applyInvitationAssets() {
  const config = window.__INVITE__.config;
  const assets = config.assets;
  document.documentElement.style.setProperty("--poster-image", `url("${assets.poster}")`);
  document.documentElement.style.setProperty("--hero-image", `url("${assets.hero}")`);
  const video = document.getElementById("entVideo");
  if (video) {
    video.poster = assets.poster;
    video.src = assets.entranceVideo;
  }
  const icon = document.querySelector('link[rel="icon"]');
  if (icon) icon.href = assets.favicon;
  const image = document.querySelector('meta[property="og:image"]');
  if (image) image.content = new URL(assets.share, config.publicUrl).href;
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) twitterImage.content = new URL(assets.share, config.publicUrl).href;
  const canonical = document.querySelector('meta[property="og:url"]');
  if (canonical) canonical.content = config.publicUrl;
  const order = document.querySelector("#da3wa-democta .dc-order");
  if (order) order.href = config.orderLink;
  const whatsapp = document.querySelector("#da3wa-democta .dc-wa");
  if (whatsapp) whatsapp.href = config.whatsappLink;
})();

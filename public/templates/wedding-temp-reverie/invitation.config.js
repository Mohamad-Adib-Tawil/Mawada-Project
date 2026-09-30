/**
 * Single source of editable invitation content, links, and bundled assets.
 * Dates use ISO 8601 with the Asia/Damascus time zone for calendar output.
 */
window.__INVITE__ = {
  config: {
    groom: "أنس",
    groomEnglish: "Anas",
    bride: "لمى",
    brideEnglish: "Lama",
    date: "2026-11-20T19:00:00+03:00",
    dateText: "يوم الجمعة، ٢٠ تشرين الثاني ٢٠٢٦",
    timeText: "الساعة السابعة مساءً",
    heroSub: "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر",
    verse: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    invitationText: "بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.",
    groomParents: "نجل السيّد كريم عبد الله و السيّدة هدى",
    brideParents: "كريمة السيّد سامي حسن و السيّدة رنا",
    venueName: "قاعة بابل الكبرى",
    venueAddr: "بغداد — المنصور",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Babylon+Hotel+Baghdad",
    program: [
      { time: "٧:٠٠ مساءً", title: "استقبال الضيوف" },
      { time: "٧:٣٠ مساءً", title: "عقد القران" },
      { time: "٨:٣٠ مساءً", title: "الكوكتيل" },
      { time: "٩:٣٠ مساءً", title: "العشاء" },
      { time: "١٠:٣٠ مساءً", title: "الرقص والسهرة" }
    ],
    notes: [
      "يُرجى الحضور قبل الموعد بنصف ساعة",
      "نتشرّف بحضوركم بأبهى حلّة",
      "الدعوة تشمل حاملها والعائلة الكريمة"
    ],
    closingNote: "حضوركم يزيّن فرحتنا",
    hashtag: "#أنس_وزينب",
    closingFamilies: "عائلة عبد الله  &  عائلة حسن",
    contactLabel: "للاستفسار والتأكيد",
    contactName: "واتساب",
    contactPhone: "+963992688759",
    whatsappUrl: "https://wa.me/+963992688759",
    calendar: {
      timezone: "Asia/Baghdad",
      durationHours: 4,
      monthText: "تشرين الثاني 2026",
      weekdayText: "الجمعة",
      dayText: "20",
      location: "قاعة بابل الكبرى — بغداد — المنصور"
    },
    music: { youtubeVideoId: "Hp8WTVqR_0U" },
    assets: {
      envelopeVideo: "assets/envelope.mp4",
      envelopePoster: "assets/envelope-poster.jpg",
      envelopeImage: "assets/envelope.jpg",
      heroVideo: "assets/hero.mp4",
      heroPoster: "assets/hero-poster.jpg",
      shareImage: "assets/share.jpg",
      gallery: [
        "assets/gallery/1.jpg",
        "assets/gallery/2.jpg",
        "assets/gallery/3.jpg",
        "assets/gallery/4.jpg"
      ],
      stylesheet: "assets/styles.css",
      invitationScript: "assets/invitation.js"
    }
  }
};

const inviteAssets = window.__INVITE__.config.assets;
document.documentElement.style.setProperty("--hero-poster", `url("${new URL(inviteAssets.heroPoster, document.baseURI).href}")`);
document.documentElement.style.setProperty("--envelope-image", `url("${new URL(inviteAssets.envelopeImage, document.baseURI).href}")`);

window.__INVITE__ = { config: {
  "date": "2026-11-20T19:00:00",
  "dateText": "يوم الجمعة، ٢٠ تشرين الثاني ٢٠٢٦",
  "timeText": "الساعة السابعة مساءً",
  "heroSub": "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر",
  "invitationText": "بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.",
  "venueName": "قاعة بابل الكبرى",
  "venueAddr": "بغداد — المنصور",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=Babylon+Hotel+Baghdad",
  "program": [
    {
      "time": "٧:٠٠ مساءً",
      "title": "استقبال الضيوف"
    },
    {
      "time": "٧:٣٠ مساءً",
      "title": "عقد القران"
    },
    {
      "time": "٨:٣٠ مساءً",
      "title": "الكوكتيل"
    },
    {
      "time": "٩:٣٠ مساءً",
      "title": "العشاء"
    },
    {
      "time": "١٠:٣٠ مساءً",
      "title": "الرقص والسهرة"
    }
  ],
  "notes": [
    "يُرجى الحضور قبل الموعد بنصف ساعة",
    "نتشرّف بحضوركم بأبهى حلّة",
    "الدعوة تشمل حاملها والعائلة الكريمة"
  ],
  "closingNote": "حضوركم يزيّن فرحتنا",
  "hashtag": "#محمد_ورزان",
  "contactLabel": "للاستفسار والتأكيد",
  "contactName": "واتساب",
  "contactPhone": "+963992688759",
  "dateKicker": "",
  "showDateKicker": true,
  "occasion": "wedding",
  "teddyColor": "natural",
  "brideFirst": false,
  "heroVariant": "1",
  "coverPlaque": false,
  "heroVerseFirst": false,
  "showFamilies": true,
  "groomParentsLabel": "",
  "brideParentsLabel": "",
  "coupleInviteLine": "",
  "groomRelationLabel": "",
  "brideRelationLabel": "",
  "groomRelationName": "محمد أديب طويل",
  "brideRelationName": "رزان بطايحي",
  "groom": "محمد أديب طويل",
  "bride": "رزان بطايحي",
  "verse": "اللّهُمَّ بارِكْ لهُما وبارِكْ عليهِما واجمَعْ بينهُما في خير",
  "groomParents": "نجل السيّد كريم عبد الله و السيّدة هدى",
  "brideParents": "كريمة السيّد سامي حسن و السيّدة رنا",
  "closingFamilies": "عائلة عبد الله  &  عائلة حسن",
  "groomEnglish": "Mohamad Adib Tawil",
  "brideEnglish": "Razan Bataihi",
  "contactUrl": "https://wa.me/+963992688759",
  "orderUrl": "https://wa.me/+963992688759",
  "gallery": [
    "media/gallery/1.jpg",
    "media/gallery/2.jpg",
    "media/gallery/3.jpg",
    "media/gallery/4.jpg"
  ],
  "assets": {
    "hero": "assets/hero.mp4",
    "preloader": "assets/preloader.mp4",
    "poster": "assets/poster.jpg",
    "preloaderPoster": "assets/preloader-poster.jpg",
    "share": "assets/share.jpg",
    "favicon": "assets/favicon.svg"
  },
  "timezone": "Asia/Baghdad",
  "images": {
    "venue": "",
    "background": ""
  },
  "musicVideoId": "Hp8WTVqR_0U"
} };
window.__SITE_SETTINGS__ = window.__INVITE__.config;

document.addEventListener("DOMContentLoaded", function(){
  var c=window.__SITE_SETTINGS__;
  document.title="دعوة زفاف "+c.groom+" & "+c.bride;
  var description=c.dateText+" • "+c.venueName;
  document.querySelectorAll('meta[name="description"],meta[property="og:description"]').forEach(function(m){m.content=description;});
  var title=document.querySelector('meta[property="og:title"]');if(title)title.content=document.title;
  var date=new Date(String(c.date||'2026-11-20T19:00:00').slice(0,16)+':00Z');
  var zone=c.timezone||'Asia/Baghdad';
  var month=document.querySelector('#da3wa-cal .cal-top');if(month)month.textContent=new Intl.DateTimeFormat('ar',{month:'long',year:'numeric',timeZone:zone}).format(date);
  var weekday=document.querySelector('#da3wa-cal .cal-wd');if(weekday)weekday.textContent=new Intl.DateTimeFormat('ar',{weekday:'long',timeZone:zone}).format(date);
  var day=document.querySelector('#da3wa-cal .cal-day');if(day)day.textContent=new Intl.DateTimeFormat('en',{day:'numeric',timeZone:zone}).format(date);
  var time=document.querySelector('#da3wa-cal .cal-time');if(time)time.textContent=c.timeText||'';
});

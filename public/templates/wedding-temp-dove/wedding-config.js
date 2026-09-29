/* All invitation content and asset paths live here for easy updates. */
window.WEDDING_DATA = {
  couple: {
    groom: 'محمد أديب طويل',
    groomEnglish: 'Mohamad Adib Tawil',
    bride: 'رزان بطايحي',
    brideEnglish: 'Razan Bataihi',
    hashtag: '#محمد_ورزان'
  },
  event: {
    date: '2026-11-20T19:00:00+03:00',
    dateText: 'يوم الجمعة، ٢٠ تشرين الثاني ٢٠٢٦',
    timeText: 'الساعة السابعة مساءً',
    timezone: 'Asia/Baghdad',
    durationHours: 4,
    title: 'دعوة زفاف محمد أديب طويل ورزان بطايحي',
    heroSub: 'بكم يكتملُ الفرح… وبحضوركم تحلو الحكاية',
    invitationText: 'أطلقنا هديلَنا الأبيض يزفُّ البشارة: في حديقةٍ يتعانق فيها الوردُ والرخام، وتحت سماءٍ صافيةٍ كقلوبنا، نحتفل بإذن الله بأجمل ليالي العمر. كونوا شهودَ فرحتنا — فبحضوركم تكتمل البهجة، وبدعائكم تدوم.',
    verse: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    closingNote: 'حضوركم هديلُ فرحتنا… وتمامُ بهجتنا'
  },
  families: {
    groomParents: 'السيّد كريم عبد الله والسيّدة هدى',
    brideParents: 'السيّد سامي حسن والسيّدة رنا',
    closing: 'عائلة عبد الله  &  عائلة حسن'
  },
  venue: {
    name: 'قاعة بابل الكبرى',
    address: 'بغداد — المنصور',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Baghdad'
  },
  program: [
    { time: '٧:٠٠ مساءً', title: 'استقبال الضيوف' },
    { time: '٧:٣٠ مساءً', title: 'عقد القران' },
    { time: '٩:٠٠ مساءً', title: 'العشاء' },
    { time: '١٠:٠٠ مساءً', title: 'السهرة' }
  ],
  notes: ['يُرجى الحضور قبل الموعد بنصف ساعة', 'الدعوة تشمل حاملها والعائلة الكريمة'],
  contact: {
    label: 'للتواصل والتأكيد',
    name: 'واتساب',
    phone: '+963992688759',
    url: 'https://wa.me/+963992688759'
  },
  calendar: {
    month: 'تشرين الثاني 2026',
    weekday: 'الجمعة',
    day: '20',
    time: 'الساعة السابعة مساءً'
  },
  messages: [
    { name: 'أم محمد', text: 'ألف مبروك 🤍 بالرفاه والبنين إن شاء الله، فرحتكم فرحتنا', color: '#b76e83' },
    { name: 'سارة', text: 'عقبال ما نفرح بيكم بأحلى المناسبات، دعوة بغاية الذوق 😍', color: '#c2a05e' },
    { name: 'حيدر', text: 'مبارك الزواج، الله يجعل أيامكم كلها أفراح', color: '#dfa8b6' },
    { name: 'نور الهدى', text: 'بيت جديد عامر بالمحبة إن شاء الله، ألف مبروك', color: '#7f9a7d' },
    { name: 'أبو علي', text: 'الله يبارك لكما ويبارك عليكما ويجمع بينكما في خير', color: '#a7c4de' }
  ],
  rsvp: {
    title: 'تأكيد الحضور',
    subtitle: 'يسعدنا تأكيد حضوركم',
    sendLabel: 'إرسال التأكيد عبر واتساب',
    whatsappMessage: 'تأكيد حضور حفل زفاف محمد أديب طويل ورزان بطايحي'
  },
  pageUrl: 'https://mohamad-adib-tawil.github.io/wedding-temp-dove/',
  assets: {
    flightVideo: 'assets/flight.mp4',
    loopVideo: 'assets/loop.mp4',
    doveSprite: 'assets/dove-sprite.png',
    poster: 'assets/poster.jpg',
    endingImage: 'assets/end.jpg',
    shareImage: 'assets/share.jpg'
  },
  fonts: ['Aref Ruqaa', 'Amiri', 'Reem Kufi', 'Tajawal']
};

const data = window.WEDDING_DATA;
window.__INVITE__ = { config: {
  groom: data.couple.groom,
  bride: data.couple.bride,
  date: data.event.date,
  dateText: data.event.dateText,
  timeText: data.event.timeText,
  heroSub: data.event.heroSub,
  verse: data.event.verse,
  invitationText: data.event.invitationText,
  groomParents: data.families.groomParents,
  brideParents: data.families.brideParents,
  venueName: data.venue.name,
  venueAddr: data.venue.address,
  mapUrl: data.venue.mapUrl,
  program: data.program,
  notes: data.notes,
  closingNote: data.event.closingNote,
  hashtag: data.couple.hashtag,
  contactLabel: data.contact.label,
  contactName: data.contact.name,
  contactPhone: data.contact.phone,
  closingFamilies: data.families.closing,
  images: { poster: data.assets.poster, share: data.assets.share },
  showFamilies: true,
  occasion: 'wedding'
} };

document.addEventListener('DOMContentLoaded', () => {
  const text = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
  document.title = data.event.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${data.event.dateText} • ${data.venue.name}`;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = data.event.title;
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = `${data.event.dateText} • ${data.venue.name}`;
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = data.assets.shareImage;
  text('#da3wa-cal .cal-top', data.calendar.month);
  text('#da3wa-cal .cal-wd', data.calendar.weekday);
  text('#da3wa-cal .cal-day', data.calendar.day);
  text('#da3wa-cal .cal-time', data.calendar.time);
  text('#da3wa-rsvp h3', data.rsvp.title);
  text('#da3wa-rsvp .sub', data.rsvp.subtitle);
  text('#da3wa-rsvp .send', data.rsvp.sendLabel);
  const wishes = document.querySelector('#da3wa-wish-list');
  if (wishes) wishes.replaceChildren(...data.messages.map((item) => {
    const card = document.createElement('div'); card.className = 'wish';
    const avatar = document.createElement('div'); avatar.className = 'wish-av'; avatar.style.background = item.color; avatar.textContent = [...item.name][0];
    const body = document.createElement('div'); body.className = 'wish-body';
    const name = document.createElement('div'); name.className = 'wish-name'; name.textContent = item.name;
    const message = document.createElement('div'); message.className = 'wish-msg'; message.textContent = item.text;
    body.append(name, message); card.append(avatar, body); return card;
  }));
  const date = new Date(data.event.date);
  const end = new Date(date.getTime() + data.event.durationHours * 3600000);
  const compact = (value) => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const title = encodeURIComponent(data.event.title);
  const location = encodeURIComponent(`${data.venue.name} — ${data.venue.address}`);
  const details = encodeURIComponent(`رابط الدعوة: ${data.pageUrl}`);
  const pageUrl = document.querySelector('meta[property="og:url"]');
  if (pageUrl) pageUrl.content = data.pageUrl;
  const offsetMatch = data.event.date.match(/([+-])(\d{2}):?(\d{2})$/);
  const offsetMinutes = offsetMatch ? (offsetMatch[1] === '-' ? -1 : 1) * (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3])) : 0;
  const calendarTime = (value) => new Date(value.getTime() + offsetMinutes * 60000).toISOString().slice(0, 19).replace(/[-:]/g, '');
  const google = document.querySelector('#da3wa-cal .cal-btns a:first-child');
  if (google) google.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${calendarTime(date)}/${calendarTime(end)}&ctz=${encodeURIComponent(data.event.timezone)}&location=${location}&details=${details}`;
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//AR','BEGIN:VEVENT',`DTSTART:${compact(date)}`,`DTEND:${compact(end)}`,`SUMMARY:${data.event.title}`,`LOCATION:${data.venue.name} — ${data.venue.address}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const apple = document.querySelector('#da3wa-cal .cal-btns a:last-child');
  if (apple) { apple.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`; apple.download = 'wedding-invitation.ics'; }
  const cta = document.querySelector('#da3wa-democta .dc-order');
  if (cta) cta.href = data.contact.url;
  const ctaWa = document.querySelector('#da3wa-democta .dc-wa');
  if (ctaWa) ctaWa.href = data.contact.url;
  const contact = document.querySelector('#contactLink');
  if (contact) contact.href = data.contact.url;
  const map = document.querySelector('#mapBtn');
  if (map) map.href = data.venue.mapUrl;
});

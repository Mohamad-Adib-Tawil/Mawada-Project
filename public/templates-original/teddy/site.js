'use strict';

(async function () {
  const response = await fetch('./site.config.json');
  const config = await response.json();
  const $ = (id) => document.getElementById(id);
  const digits = (value) => String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const text = (id, value) => { const node = $(id); if (node && value != null) node.textContent = value; };

  const pageTitle = `دعوة عيد ميلاد ${config.nameAr}`;
  document.title = pageTitle;
  document.querySelector('meta[name="description"]').content = `${config.dateText} • ${config.venue}`;
  document.querySelector('meta[property="og:title"]').content = pageTitle;
  document.querySelector('meta[property="og:description"]').content = `${config.dateText} • ${config.venue}`;
  document.querySelector('meta[property="og:image"]').content = config.images.share;
  text('coverMono', `${config.occasion} ${config.nameAr}`);
  text('celebrantName', config.nameAr);
  text('ageNum', digits(config.age));
  text('heroGreet', `${config.occasion} ${config.nameAr}`);
  text('heroDate', `${config.dateText} • ${config.timeText}`);
  text('invitationText', config.invitationText);
  text('venueDate', config.dateText);
  text('venueTime', config.timeText);
  text('venueName', config.venue);
  text('venueAddr', config.location);
  text('closingNote', config.closingNote);
  text('closingHashtag', config.hashtag);
  text('closingHost', `بدعوة من ${config.host}`);
  text('calMonth', config.monthText);
  text('calWeekday', config.weekdayText);
  text('calDay', config.dayNumber);
  text('calTime', config.timeText);
  $('mapBtn').href = config.mapUrl;
  $('contactLink').href = config.whatsappUrl;

  const timeline = $('timeline');
  config.program.forEach(({time, title}) => {
    const item = document.createElement('li');
    item.className = 'timeline__item';
    item.innerHTML = '<span class="timeline__dot" aria-hidden="true"></span>';
    const timeNode = document.createElement('span'); timeNode.className = 'timeline__time'; timeNode.textContent = time;
    const titleNode = document.createElement('span'); titleNode.className = 'timeline__title'; titleNode.textContent = title;
    item.append(timeNode, titleNode); timeline.append(item);
  });
  const noteMarks = ['🧸','🎈','🎁'];
  config.notes.forEach((note, index) => {
    const item = document.createElement('li'); item.className = 'notes__item';
    const mark = document.createElement('span'); mark.className = 'notes__mark'; mark.textContent = noteMarks[index % noteMarks.length];
    const content = document.createElement('span'); content.textContent = note; item.append(mark, content); $('notesList').append(item);
  });
  config.wishes.forEach(({name, message, color}) => {
    const item = document.createElement('article'); item.className = 'wish';
    const avatar = document.createElement('div'); avatar.className = 'wish-av'; avatar.style.background = color; avatar.textContent = name.slice(0, 1);
    const body = document.createElement('div'); body.className = 'wish-body';
    const guestName = document.createElement('div'); guestName.className = 'wish-name'; guestName.textContent = name;
    const greeting = document.createElement('div'); greeting.className = 'wish-msg'; greeting.textContent = message;
    body.append(guestName, greeting); item.append(avatar, body); $('wishList').append(item);
  });
  const wishes = $('wishList');
  if (config.wishes.length > 3) $('wishMore').hidden = false;
  $('wishMore').addEventListener('click', () => { wishes.classList.toggle('expanded'); $('wishMore').textContent = wishes.classList.contains('expanded') ? 'عرض أقل' : 'عرض المزيد'; });

  const start = new Date(config.date).getTime();
  const calendarStart = new Date(start);
  const calendarEnd = new Date(start + 4 * 60 * 60 * 1000);
  const partsInDamascus = (date) => Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Damascus', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).filter(({type}) => type !== 'literal').map(({type, value}) => [type, value]));
  const localCompactDate = (date) => {
    const parts = partsInDamascus(date);
    return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
  };
  const utcCompactDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const calendarTitle = `دعوة عيد ميلاد ${config.nameAr}`;
  const calendarLocation = `${config.venue} — ${config.location}`;
  const calendarUrl = new URL('https://calendar.google.com/calendar/render');
  calendarUrl.search = new URLSearchParams({action:'TEMPLATE',text:calendarTitle,dates:`${localCompactDate(calendarStart)}/${localCompactDate(calendarEnd)}`,ctz:'Asia/Damascus',location:calendarLocation,details:config.invitationText}).toString();
  $('googleCalendar').href = calendarUrl.href;
  $('appleCalendar').href = `data:text/calendar;charset=utf-8,${encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${utcCompactDate(calendarStart)}\nDTEND:${utcCompactDate(calendarEnd)}\nSUMMARY:${calendarTitle}\nLOCATION:${calendarLocation}\nDESCRIPTION:${config.invitationText}\nEND:VEVENT\nEND:VCALENDAR`)}`;

  const arrived = $('cdArrived');
  const updateCountdown = () => {
    const difference = start - Date.now();
    if (difference <= 0) {
      $('countdown').hidden = true;
      $('countdownTitle').hidden = true;
      text('cdArrived', config.countdownPast);
      arrived.hidden = false;
      return;
    }
    const values = [Math.floor(difference / 864e5), Math.floor(difference / 36e5) % 24, Math.floor(difference / 6e4) % 60, Math.floor(difference / 1e3) % 60];
    ['cdDays','cdHours','cdMins','cdSecs'].forEach((id, index) => text(id, digits(String(values[index]).padStart(2, '0'))));
  };
  updateCountdown(); setInterval(updateCountdown, 1000);

  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:0.12});
  document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));
  for (let index = 0; index < 22; index++) {
    const particle = document.createElement('span'); particle.textContent = ['🧸','🎈','💛','🤎','🩷','⭐'][index % 6];
    particle.style.left = `${Math.random() * 100}%`; particle.style.fontSize = `${12 + Math.random() * 14}px`;
    particle.style.animationDuration = `${6 + Math.random() * 6}s`; particle.style.animationDelay = `${Math.random() * 6}s`; $('coverHearts').append(particle);
  }
  $('openBtn').addEventListener('click', () => {
    document.querySelector('.teddySvg').classList.add('is-pop');
    setTimeout(() => { $('cover').classList.add('is-open'); $('invite').setAttribute('aria-hidden','false'); document.querySelector('.hero').classList.add('is-visible'); }, 900);
    setTimeout(() => { $('cover').style.display = 'none'; }, 1900);
  }, {once:true});

  let companionCount = 0;
  $('minus').addEventListener('click', () => { companionCount = Math.max(0, companionCount - 1); text('guestCount', digits(companionCount)); });
  $('plus').addEventListener('click', () => { companionCount = Math.min(20, companionCount + 1); text('guestCount', digits(companionCount)); });
  let attendance = 'نعم';
  document.querySelectorAll('#attendance .pill').forEach((button) => button.addEventListener('click', () => {
    attendance = button.dataset.value;
    document.querySelectorAll('#attendance .pill').forEach((pill) => pill.setAttribute('aria-pressed', String(pill === button)));
  }));
  const whatsappLink = (message) => `${config.whatsappUrl}?text=${encodeURIComponent(message)}`;
  $('rsvpForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const guest = $('guestName').value.trim();
    const message = $('message').value.trim();
    const reply = [`تأكيد حضور عيد ميلاد ${config.nameAr}`, `الاسم: ${guest}`, `الحضور: ${attendance}`, `المرافقون: ${digits(companionCount)}`, message ? `التهنئة: ${message}` : ''].filter(Boolean).join('\n');
    const destination = whatsappLink(reply);
    const whatsappWindow = window.open(destination, '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;
    text('formHint', whatsappWindow
      ? 'فتحنا واتساب برسالتك؛ أرسلها هناك لإتمام التأكيد. لا تُحفظ البيانات على هذا الموقع.'
      : 'جهّزنا رسالة التأكيد. تابع إلى واتساب لإرسالها؛ لا تُحفظ البيانات على هذا الموقع.');
    if (!whatsappWindow) {
      $('whatsappSubmitLink').href = destination;
      $('whatsappSubmitLink').hidden = false;
    }
  });
  $('wishShare').href = whatsappLink(`كل عام وأنتِ بألف خير يا ${config.nameAr} 🎂🎈`);

  let player;
  let playerReady = false;
  let playerFailed = false;
  const musicButton = $('musicToggle');
  const updatePlayerButton = (playing) => { musicButton.setAttribute('aria-pressed', String(playing)); musicButton.setAttribute('aria-label', playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'); musicButton.textContent = playing ? '🔊' : '🎵'; };
  const loadPlayer = () => {
    if (window.YT?.Player) { createPlayer(); return; }
    if (!document.getElementById('youtubeApi')) {
      const script = document.createElement('script'); script.id = 'youtubeApi'; script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => { playerFailed = true; musicButton.setAttribute('aria-label','تعذر تحميل الموسيقى — اضغط لفتح يوتيوب'); };
      document.head.append(script);
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  };
  const createPlayer = () => {
    if (player || !window.YT?.Player) return;
    player = new YT.Player('audioPlayer', {width:'1',height:'1',videoId:config.music.videoId,playerVars:{playsinline:1,controls:0,rel:0},events:{onReady:()=>{playerReady=true; player.setVolume(38);},onError:()=>{playerFailed=true; musicButton.setAttribute('aria-label','تعذر تشغيل الموسيقى — اضغط لفتح يوتيوب');},onStateChange:(event)=>updatePlayerButton(event.data === YT.PlayerState.PLAYING)}});
  };
  musicButton.addEventListener('click', () => {
    if (playerFailed) { window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(config.music.videoId)}`, '_blank', 'noopener,noreferrer'); return; }
    if (playerReady && player) { if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo(); else player.playVideo(); return; }
    loadPlayer(); musicButton.setAttribute('aria-label','جارٍ تجهيز الموسيقى');
    const ensurePlay = (deadline) => {
      if (playerReady && player) { player.playVideo(); updatePlayerButton(true); return; }
      if (Date.now() >= deadline) { playerFailed = true; musicButton.setAttribute('aria-label','تعذر تشغيل الموسيقى — اضغط لفتح يوتيوب'); return; }
      setTimeout(() => ensurePlay(deadline), 250);
    };
    ensurePlay(Date.now() + 8000);
  });
})();

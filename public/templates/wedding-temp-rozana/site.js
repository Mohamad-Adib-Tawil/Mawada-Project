(() => {
  const config = window.__INVITE__?.config;
  if (!config) return;

  const assets = config.assets;
  const assetMap = {
        '[data-event-asset="seal"]': assets.seal,
    '[data-event-asset="sprig"]': assets.sprig,
    '[data-event-asset="entranceVideo"]': assets.entranceVideo,
  };
  Object.entries(assetMap).forEach(([selector, src]) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element instanceof HTMLVideoElement) {
        element.src = src;
        element.poster = assets.poster;
      } else element.src = src;
    });
  });
  document.querySelectorAll('#da3wa-mem .mem-cell img').forEach((image, index) => {
    image.src = assets.memories[index] || '';
  });
  document.body.style.setProperty('--asset-paper', `url("${assets.paper}")`);
  document.documentElement.style.setProperty('--asset-paper', `url("${assets.paper}")`);
  document.documentElement.style.setProperty('--asset-hero', `url("${assets.hero}")`);
  document.documentElement.style.setProperty('--asset-paper-card', `url("${assets.paperCard}")`);
  document.documentElement.style.setProperty('--asset-tear', `url("${assets.tear}")`);

  const pageTitle = `دعوة زفاف ${config.groom} & ${config.bride}`;
  document.title = pageTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = `${config.dateText} • ${config.venueName}`;
  const canonical = document.querySelector('meta[property="og:title"]');
  if (canonical) canonical.content = pageTitle;
  const canonicalUrl = document.querySelector('meta[property="og:url"]');
  if (canonicalUrl) canonicalUrl.content = config.links.canonical || location.href;
  document.querySelectorAll('meta[property="og:description"]').forEach((meta) => {
    meta.content = `${config.dateText} • ${config.venueName}`;
  });
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = assets.favicon;
  document.querySelectorAll('link[rel="preload"][as="image"]').forEach((preload) => {
    if (preload.href.includes('poster')) preload.href = assets.poster;
    if (preload.href.includes('hero')) preload.href = assets.hero;
  });
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
    meta.content = assets.share;
  });

  const contact = document.getElementById('contactLink');
  if (contact) {
    contact.href = config.links.whatsapp;
    contact.textContent = config.contactName;
    contact.target = '_blank';
    contact.rel = 'noopener';
  }
  const map = document.getElementById('mapBtn');
  if (map) map.href = config.links.map;
  document.querySelectorAll('#da3wa-democta .dc-order, #da3wa-democta .dc-wa').forEach((link) => {
    link.href = config.links.whatsapp;
  });

  const [year, month, day] = config.date.slice(0, 10).split('-').map(Number);
  const eventDate = new Date(config.date);
  const calendarTitle = encodeURIComponent(`دعوة زفاف ${config.groom} & ${config.bride}`);
  const venue = encodeURIComponent(`${config.venueName} — ${config.venueAddr}`);
  const googleDatePart = (date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
  const googleEnd = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000);
  const googleDates = `${googleDatePart(eventDate)}/${googleDatePart(googleEnd)}`;
  const gcal = document.querySelector('#da3wa-cal .cal-btns a');
  if (gcal) {
    gcal.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${googleDates}&ctz=${encodeURIComponent(config.timezone)}&location=${venue}&details=${encodeURIComponent('رابط الدعوة: ' + location.href)}`;
    gcal.target = '_blank';
    gcal.rel = 'noopener';
  }
  const ics = document.getElementById('icsDownload');
  if (ics) {
    const end = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000);
    const localStamp = (date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
    const escapeIcs = (value) => value.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//AR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${Date.now()}@wedding-invitation`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART;TZID=${config.timezone}:${localStamp(eventDate)}`, `DTEND;TZID=${config.timezone}:${localStamp(end)}`, `SUMMARY:${escapeIcs(decodeURIComponent(calendarTitle))}`, `LOCATION:${escapeIcs(decodeURIComponent(venue))}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    ics.href = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
    ics.download = 'wedding-invitation.ics';
  }

  const calendarMonth = document.querySelector('#da3wa-cal .cal-top');
  const calendarDay = document.querySelector('#da3wa-cal .cal-day');
  if (calendarMonth && calendarDay) {
    const monthNames = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
    calendarMonth.textContent = `${monthNames[month - 1]} ${year}`;
    calendarDay.textContent = new Intl.NumberFormat('ar').format(day);
  }
})();

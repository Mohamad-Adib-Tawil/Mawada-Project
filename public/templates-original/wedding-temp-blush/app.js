(() => {
  const config = window.__INVITE__?.config ?? {};
  const calendar = config.calendar ?? {};
  const whatsappUrl = config.whatsappUrl || `https://wa.me/${(config.contactPhone || '').replace(/\D/g, '')}`;

  const setImageVariable = (name, path) => {
    if (path) document.documentElement.style.setProperty(name, `url("${path}")`);
  };
  setImageVariable('--envelope-image', config.images?.envelope);
  setImageVariable('--hero-image', config.images?.hero);
  config.images?.memories?.forEach((path, index) => {
    const image = document.querySelector(`[data-memory-index="${index + 1}"]`);
    if (image) image.src = path;
  });
  const shareMeta = document.querySelector('meta[property="og:image"]');
  const twitterMeta = document.querySelector('meta[name="twitter:image"]');
  if (shareMeta && config.images?.share) shareMeta.content = config.images.share;
  if (twitterMeta && config.images?.share) twitterMeta.content = config.images.share;
  const title = `دعوة زفاف ${config.groom} & ${config.bride}`;
  document.title = title;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = title;
  const description = `${config.dateText || ''} • ${config.venueName || ''}`;
  document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach((meta) => { meta.content = description; });
  [config.images?.envelope, config.images?.hero].filter(Boolean).forEach((href, index) => {
    const preload = document.createElement('link');
    preload.rel = 'preload'; preload.as = 'image'; preload.href = href;
    if (index === 1) preload.fetchPriority = 'high';
    document.head.appendChild(preload);
  });

  document.querySelectorAll('[data-config-link="whatsappUrl"], [data-config-link="orderUrl"]')
    .forEach((link) => { link.href = link.dataset.configLink === 'orderUrl' ? (config.orderUrl || whatsappUrl) : whatsappUrl; });

  const googleCalendar = document.getElementById('googleCalendarBtn');
  const icsLink = document.getElementById('icsBtn');
  const start = new Date(config.date);
  if (!Number.isNaN(start.getTime())) {
    const calendarTime = config.calendar ?? {};
    const datePart = String(config.date || '').split('T')[0];
    const wallTime = (time) => {
      const [hour = '00', minute = '00', second = '00'] = String(time || '23:00').split(':');
      return `${datePart.replace(/-/g, '')}T${hour.padStart(2, '0')}${minute.padStart(2, '0')}${second.padStart(2, '0')}`;
    };
    const startWall = wallTime(String(config.date).split('T')[1] || '19:00');
    const endWall = wallTime(calendarTime.endTime || '23:00');
    const title = `دعوة زفاف ${config.groom} & ${config.bride}`;
    const location = [config.venueName, config.venueAddr].filter(Boolean).join(' — ');
    const formatGoogle = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    if (googleCalendar) {
      const params = new URLSearchParams({
        action: 'TEMPLATE', text: title,
        dates: `${startWall}/${endWall}`,
        ctz: config.timezone || 'Asia/Baghdad', location,
      });
      googleCalendar.href = `https://calendar.google.com/calendar/render?${params}`;
      googleCalendar.target = '_blank';
      googleCalendar.rel = 'noopener';
    }
    if (icsLink) {
      const offset = String(config.utcOffset || '+03:00');
      const offsetMinutes = (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6))) * (offset.startsWith('-') ? -1 : 1);
      const toUtc = (wall) => {
        const match = wall.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
        if (!match) return start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
        const [, y, mo, d, h, mi, sec] = match;
        return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +sec) - offsetMinutes * 60000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      };
      const escapeIcs = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//AR', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT', `DTSTART:${toUtc(startWall)}`, `DTEND:${toUtc(endWall)}`,
        `SUMMARY:${escapeIcs(title)}`, `LOCATION:${escapeIcs(location)}`,
        `DESCRIPTION:${escapeIcs(config.invitationText)}`, 'END:VEVENT', 'END:VCALENDAR', '',
      ].join('\r\n');
      icsLink.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    }
  }
  const calendarTop = document.querySelector('#da3wa-cal .cal-top');
  const calendarDay = document.querySelector('#da3wa-cal .cal-day');
  const calendarWeekday = document.querySelector('#da3wa-cal .cal-wd');
  const calendarTime = document.querySelector('#da3wa-cal .cal-time');
  if (calendarTop && calendar.month) calendarTop.textContent = calendar.month;
  if (calendarDay && calendar.day) calendarDay.textContent = calendar.day;
  if (calendarWeekday && calendar.weekday) calendarWeekday.textContent = calendar.weekday;
  if (calendarTime && config.timeText) calendarTime.textContent = config.timeText;

  const attendance = document.getElementById('da3wa-att');
  let reply = 'yes';
  attendance?.querySelectorAll('.pill').forEach((button) => {
    button.addEventListener('click', () => {
      reply = button.dataset.v || 'yes';
      attendance.querySelectorAll('.pill').forEach((option) => {
        option.setAttribute('aria-pressed', String(option === button));
      });
    });
  });

  let companions = 0;
  const count = document.getElementById('da3wa-guests');
  document.getElementById('da3wa-minus')?.addEventListener('click', () => {
    companions = Math.max(0, companions - 1);
    if (count) count.textContent = String(companions);
  });
  document.getElementById('da3wa-plus')?.addEventListener('click', () => {
    companions = Math.min(10, companions + 1);
    if (count) count.textContent = String(companions);
  });

  const form = document.getElementById('da3wa-rsvp-form');
  const status = document.getElementById('da3wa-err');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = String(new FormData(form).get('guest_name') || '').trim();
      const message = String(new FormData(form).get('message') || '').trim();
      const attendanceText = { yes: 'نعم، سأحضر', no: 'أعتذر عن الحضور', maybe: 'ربما أحضر' }[reply];
      const details = [
        `تأكيد حضور زفاف ${config.groom} و${config.bride}`,
        `الاسم: ${name}`, `الحضور: ${attendanceText}`,
        reply === 'yes' ? `عدد الحضور: ${companions + 1}` : '',
        message ? `رسالة: ${message}` : '',
      ].filter(Boolean).join('\n');
      const target = `${whatsappUrl}${whatsappUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(details)}`;
      window.open(target, '_blank', 'noopener,noreferrer');
      if (status) {
        status.textContent = 'جهّزنا رسالة التأكيد في واتساب لإرسالها.';
        status.classList.add('success');
      }
    });
  }

  const phoneLink = document.getElementById('contactLink');
  if (phoneLink && whatsappUrl) phoneLink.href = whatsappUrl;
})();

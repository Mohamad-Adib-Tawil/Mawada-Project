(function () {
  'use strict';
  const config = window.INVITATION_CONFIG;
  const copy = config.copy;
  const byId = (id) => document.getElementById(id);
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  };

  document.querySelectorAll('[data-copy]').forEach((node) => {
    const value = copy[node.dataset.copy];
    if (value != null) node.textContent = value;
  });
  const gallery = document.getElementById('galleryGrid');
  config.images.gallery.forEach((path, index) => {
    const frame = document.createElement('figure'); frame.className = 'mem-cell';
    const image = document.createElement('img'); image.src = path; image.alt = `${copy.galleryAlt} ${index + 1}`; image.loading = 'lazy'; image.decoding = 'async';
    frame.append(image); gallery.append(frame);
  });
  byId('guestName').placeholder = copy.namePlaceholder;
  byId('guestMessage').placeholder = copy.messagePlaceholder;
  document.querySelector('[data-copy="calendarMonth"]').textContent = config.calendar.month;
  document.querySelector('[data-copy="calendarWeekday"]').textContent = config.calendar.weekday;
  byId('calendarDay').textContent = config.calendar.day;
  byId('calendarTime').textContent = config.timeText;
  document.querySelectorAll('.contact__link').forEach((link) => { link.href = config.links.whatsapp; link.target = '_blank'; link.rel = 'noopener'; });
  byId('orderLink').href = config.links.whatsapp;
  byId('orderWhatsapp').href = config.links.whatsapp;
  const start = new Date(config.date);
  const end = new Date(start.getTime() + config.calendar.durationHours * 3600000);
  const format = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const eventTitle = `دعوة زفاف ${config.groom} & ${config.bride}`;
  const details = `${config.invitationText}\n${location.href}`;
  const calendarUrl = new URL('https://calendar.google.com/calendar/render');
  calendarUrl.search = new URLSearchParams({
    action: 'TEMPLATE', text: eventTitle, dates: `${format(start)}/${format(end)}`,
    ctz: config.timezone, location: `${config.venueName} — ${config.venueAddr}`, details,
  }).toString();
  byId('googleCalendar').href = calendarUrl.href;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//AR', 'BEGIN:VEVENT',
    `DTSTART:${format(start)}`, `DTEND:${format(end)}`, `SUMMARY:${eventTitle}`,
    `LOCATION:${config.venueName} — ${config.venueAddr}`, `DESCRIPTION:${config.invitationText}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  byId('appleCalendar').href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));

  const list = byId('wishList');
  config.wishes.forEach((wish) => {
    const card = document.createElement('div'); card.className = 'wish';
    const avatar = document.createElement('div'); avatar.className = 'wish-av';
    avatar.style.backgroundColor = wish.color; avatar.textContent = wish.name.trim()[0] || '♥';
    const body = document.createElement('div'); body.className = 'wish-body';
    const name = document.createElement('div'); name.className = 'wish-name'; name.textContent = wish.name;
    const message = document.createElement('div'); message.className = 'wish-msg'; message.textContent = wish.message;
    body.append(name, message); card.append(avatar, body); list.append(card);
  });

  let attendance = 'yes';
  let companions = 0;
  const count = byId('guestCount');
  document.querySelectorAll('#attendanceOptions .pill').forEach((button) => {
    button.addEventListener('click', () => {
      attendance = button.dataset.v;
      document.querySelectorAll('#attendanceOptions .pill').forEach((pill) => {
        pill.setAttribute('aria-pressed', String(pill === button));
      });
    });
  });
  byId('guestMinus').addEventListener('click', () => {
    companions = Math.max(0, companions - 1); count.textContent = companions;
  });
  byId('guestPlus').addEventListener('click', () => {
    companions = Math.min(49, companions + 1); count.textContent = companions;
  });
  byId('rsvpForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const confirmation = {
      name: byId('guestName').value.trim(), attendance, companions,
      message: byId('guestMessage').value.trim(), savedAt: new Date().toISOString(),
    };
    try {
      const saved = JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
      saved.push(confirmation);
      localStorage.setItem('wedding-rsvp', JSON.stringify(saved));
    } catch (_) {
      byId('rsvpError').textContent = copy.localRsvpNotice;
      return;
    }
    const wrap = byId('rsvpFormWrap');
    wrap.replaceChildren();
    const success = document.createElement('div'); success.className = 'ok';
    const emoji = document.createElement('div'); emoji.className = 'emoji'; emoji.textContent = '🎉';
    const title = document.createElement('h3'); title.textContent = copy.thanks;
    const confirmationText = document.createElement('p'); confirmationText.className = 'sub'; confirmationText.textContent = copy.confirmed;
    const storageNote = document.createElement('p'); storageNote.className = 'sub'; storageNote.textContent = copy.localRsvpNotice;
    success.append(emoji, title, confirmationText, storageNote); wrap.append(success);
  });
})();

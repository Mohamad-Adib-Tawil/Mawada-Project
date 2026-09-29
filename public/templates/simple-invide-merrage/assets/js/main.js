import { weddingConfig as config } from './wedding-config.js';
import { initExperience } from './invitation-experience.js';

const $ = (selector) => document.querySelector(selector);
const toast = $('#toast');
let toastTimer;

function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('ar', { timeZone: config.timeZone || undefined, ...options }).format(date);
}

function zonedDateTime(dateValue, timeValue = '00:00') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;
  if (!/^\d{2}:\d{2}$/.test(timeValue)) return null;
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour, minute] = timeValue.split(':').map(Number);
  const intendedUtc = Date.UTC(year, month - 1, day, hour, minute);
  if (!config.timeZone) return new Date(`${dateValue}T${timeValue}:00`);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  let candidate = intendedUtc;
  // Correct the UTC guess using the configured venue's time zone offset.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(candidate)).map(({ type, value }) => [type, value]));
    const representedUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    candidate += intendedUtc - representedUtc;
  }
  return new Date(candidate);
}

function parseWeddingDate() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.weddingDate)) return null;
  const date = zonedDateTime(config.weddingDate, config.startTime || '00:00');
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function hydrateNames() {
  document.querySelectorAll('[data-config="groomArabic"]').forEach((node) => { node.textContent = config.groomArabic; });
  document.querySelectorAll('[data-config="brideArabic"]').forEach((node) => { node.textContent = config.brideArabic; });
  document.querySelectorAll('[data-config="groomEnglish"]').forEach((node) => { node.textContent = config.groomEnglish; });
  document.querySelectorAll('[data-config="brideEnglish"]').forEach((node) => { node.textContent = config.brideEnglish; });
  document.querySelectorAll('[data-config="monogramGroomArabic"]').forEach((node) => { node.textContent = config.monogramGroomArabic; });
  document.querySelectorAll('[data-config="monogramBrideArabic"]').forEach((node) => { node.textContent = config.monogramBrideArabic; });
  $('#open-invitation').setAttribute('aria-label', `افتح دعوة ${config.groomArabic} و${config.brideArabic}`);
  document.title = `${config.groomArabic} & ${config.brideArabic} | دعوة زفاف`;
  document.querySelectorAll('[data-wording]').forEach((node) => {
    const wording = config.wording[node.dataset.wording];
    if (typeof wording === 'string' && wording) node.textContent = wording;
  });
  if (config.wording.familyNames.length) {
    $('#scene-families').textContent = config.wording.familyNames.join(' • ');
    $('#scene-families').hidden = false;
  }
}

function renderDate() {
  const date = parseWeddingDate();
  const hasVenue = Boolean(config.venue || config.address || config.mapsUrl);
  $('#date-card').hidden = !date;
  $('#venue-card').hidden = !hasVenue;
  $('#details').hidden = !date && !hasVenue && $('#guest-notes-card').hidden;
  const detailsAvailable = !$('#details').hidden;
  $('.scroll-cue').href = detailsAvailable ? '#details' : '#closing';
  $('.scroll-cue span:first-child').textContent = detailsAvailable ? 'اكتشفوا التفاصيل' : 'تابعوا الدعوة';
  $('#details-note').hidden = true;

  if (!date) return;
  const dateLabel = formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#event-date').textContent = dateLabel;
  $('#hero-date').textContent = dateLabel;
  $('#hero-date').hidden = false;
  $('#footer-date').textContent = dateLabel;
  $('#footer-date').hidden = false;
  $('#scene-cover-date').textContent = dateLabel;
  $('#scene-cover-date').hidden = false;
  $('#scene-date').textContent = dateLabel;
  $('#scene-date').hidden = false;
  $('#event-time').textContent = config.startTime ? `الساعة ${config.startTime}${config.endTime ? ` – ${config.endTime}` : ''}` : '';
  $('#calendar-button').hidden = false;

  const countdownSection = $('#countdown-section');
  countdownSection.hidden = false;
  if (date.getTime() <= Date.now()) {
    $('#countdown').hidden = true;
    $('#countdown-passed').hidden = false;
    return;
  }
  updateCountdown(date);
  window.setInterval(() => updateCountdown(date), 1000);

}

function updateCountdown(date) {
  const remaining = Math.max(0, date.getTime() - Date.now());
  if (remaining === 0) {
    $('#countdown').hidden = true;
    $('#countdown-passed').hidden = false;
    return;
  }
  const values = [
    [Math.floor(remaining / 86_400_000), 'يوماً'],
    [Math.floor((remaining % 86_400_000) / 3_600_000), 'ساعة'],
    [Math.floor((remaining % 3_600_000) / 60_000), 'دقيقة'],
    [Math.floor((remaining % 60_000) / 1_000), 'ثانية'],
  ];
  $('#countdown').innerHTML = values.map(([value, label]) => `<div class="countdown__unit"><strong>${String(value).padStart(2, '0')}</strong><span>${label}</span></div>`).join('');
}

function renderGuestNotes() {
  const notes = [config.audience, config.dressCode, config.guestInstructions];
  if (config.childrenInvited !== null) notes.push(config.childrenInvited ? 'الأطفال مرحب بهم' : 'الدعوة للبالغين');
  const list = $('#guest-notes');
  list.replaceChildren(...notes.filter(Boolean).map((note) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = note;
    return paragraph;
  }));
  $('#guest-notes-card').hidden = list.childElementCount === 0;
}

function renderVenue() {
  $('#venue-name').textContent = config.venue;
  $('#venue-name').hidden = !config.venue;
  $('#venue-address').textContent = config.address;
  $('#venue-address').hidden = !config.address;
  const map = $('#map-link');
  map.hidden = !config.mapsUrl;
  if (config.mapsUrl) map.href = config.mapsUrl;
  const sceneVenue = [config.venue, config.address].filter(Boolean).join('، ');
  $('#scene-venue').textContent = sceneVenue;
  $('#scene-venue').hidden = !sceneVenue;
}

function renderSceneDetails() {
  const hasSceneDetails = !$('#scene-date').hidden || !$('#scene-venue').hidden;
  $('[data-chapter="details"]').hidden = !hasSceneDetails;
}

function renderRsvp() {
  const enabled = config.rsvp.enabled && /^\d{7,15}$/.test(config.rsvp.whatsappNumber);
  $('#rsvp-section').hidden = !enabled;
  if (!enabled) return;
  const whatsappUrl = `https://wa.me/${config.rsvp.whatsappNumber}`;
  const message = config.rsvp.messageTemplate || `السلام عليكم، أود تأكيد حضوري حفل زفاف ${config.groomArabic} و${config.brideArabic}.`;
  $('#rsvp-copy').textContent = config.rsvp.deadline ? `يرجى تأكيد الحضور قبل ${config.rsvp.deadline}.` : 'يسعدنا تأكيد حضوركم عبر واتساب.';
  $('#rsvp-link').href = `${whatsappUrl}?text=${encodeURIComponent(message)}`;
  $('#order-link').href = whatsappUrl;
}

function escapeIcs(value = '') {
  return String(value).replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');
}

function downloadCalendarEvent() {
  const start = parseWeddingDate();
  if (!start) return;
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  if (config.endTime && /^\d{2}:\d{2}$/.test(config.endTime)) {
    const configuredEnd = zonedDateTime(config.weddingDate, config.endTime);
    if (configuredEnd) end.setTime(configuredEnd.getTime());
    if (end <= start) end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
  }
  const toUtc = (date) => date.toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}/, '');
  const location = [config.venue, config.address].filter(Boolean).join(', ');
  const description = config.mapsUrl ? `الموقع: ${config.mapsUrl}` : '';
  const uid = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mohamad and Razan//Wedding Invitation//AR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${uid}@wedding`, `DTSTAMP:${toUtc(new Date())}`, `DTSTART:${toUtc(start)}`, `DTEND:${toUtc(end)}`, `SUMMARY:${escapeIcs(`${config.groomEnglish} & ${config.brideEnglish} Wedding`)}`, `LOCATION:${escapeIcs(location)}`, `DESCRIPTION:${escapeIcs(description)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: 'mohamad-and-razan-wedding.ics' });
  link.click();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('toast--visible'), 2600);
}

async function shareInvitation() {
  const shareData = { title: document.title, text: config.wording.share || `دعوة زفاف ${config.groomArabic} و${config.brideArabic}`, url: window.location.href };
  try {
    if (navigator.share) await navigator.share(shareData);
    else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast('تم نسخ رابط الدعوة');
    } else showToast('يمكنك نسخ رابط الصفحة من المتصفح');
  } catch (error) {
    if (error?.name !== 'AbortError') showToast('تعذرت المشاركة، يمكنك نسخ رابط الصفحة');
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('تم نسخ رابط الدعوة');
  } catch {
    showToast('يمكنك نسخ رابط الصفحة من المتصفح');
  }
}

hydrateNames();
renderGuestNotes();
renderDate();
renderVenue();
renderSceneDetails();
renderRsvp();
initExperience(config, showToast);
$('#calendar-button').addEventListener('click', downloadCalendarEvent);
$('#share-button').addEventListener('click', shareInvitation);
$('#copy-link').addEventListener('click', copyLink);

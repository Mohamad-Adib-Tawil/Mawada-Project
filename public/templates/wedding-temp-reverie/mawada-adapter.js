(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const encoded = params.get('mawada');
  if (!encoded) return;

  let invitation;
  try {
    const binary = atob(encoded.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - encoded.length % 4) % 4));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    invitation = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return; }

  if (!invitation || typeof invitation !== 'object') return;
  const clean = value => String(value ?? '').trim();
  const formatDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(clean(value))) return '';
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('ar', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day, 12)));
  };
  const formatTime = value => {
    if (!/^\d{2}:\d{2}$/.test(clean(value))) return '';
    return `الساعة ${new Intl.DateTimeFormat('ar', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(new Date(`2000-01-01T${value}:00Z`))}`;
  };
  const offsetHoursFor = (date, time, timeZone) => {
    if (!date || !time || !timeZone) return '';
    try {
      const stamp = new Date(`${date}T12:00:00Z`);
      const value = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' })
        .formatToParts(stamp).find(part => part.type === 'timeZoneName')?.value || '';
      const match = value.match(/^GMT([+-])(\d{2}):(\d{2})$/);
      if (!match) return value === 'GMT' ? 0 : '';
      const sign = match[1] === '-' ? -1 : 1;
      return sign * (Number(match[2]) + Number(match[3]) / 60);
    } catch { return ''; }
  };
  const youtubeId = value => {
    try {
      const url = new URL(value);
      if (url.hostname === 'youtu.be') return url.pathname.slice(1);
      if (url.hostname.endsWith('youtube.com')) return url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).at(-1) || '';
    } catch { /* A direct audio URL may be supported by a template as-is. */ }
    return clean(value);
  };
  const program = Array.isArray(invitation.program) ? invitation.program.filter(row => row && row.title).map(row => ({ time: clean(row.time), title: clean(row.title) })) : [];
  const notes = Array.isArray(invitation.notes) ? invitation.notes.map(clean).filter(Boolean) : [];
  const values = {
    groom: clean(invitation.groomNameAr),
    bride: clean(invitation.brideNameAr),
    groomEn: clean(invitation.groomNameEn),
    brideEn: clean(invitation.brideNameEn),
    child: clean(invitation.childNameAr),
    childEn: clean(invitation.childNameEn),
    host: clean(invitation.hostName),
    date: invitation.eventDate && invitation.eventTime ? `${invitation.eventDate}T${invitation.eventTime}` : '',
    dateText: formatDate(invitation.eventDate),
    timeText: formatTime(invitation.eventTime),
    timeZone: clean(invitation.timeZone),
    timeZoneOffsetHours: offsetHoursFor(clean(invitation.eventDate), clean(invitation.eventTime), clean(invitation.timeZone)),
    venue: clean(invitation.venueName),
    address: clean(invitation.address),
    map: clean(invitation.mapUrl),
    welcome: clean(invitation.welcomeLine),
    invitationText: clean(invitation.invitationText),
    verse: clean(invitation.verse),
    groomParents: clean(invitation.groomParents),
    brideParents: clean(invitation.brideParents),
    families: clean(invitation.closingFamilies),
    notes,
    program,
    closing: clean(invitation.closingNote),
    music: youtubeId(clean(invitation.musicUrl)),
    title: [clean(invitation.groomNameAr), clean(invitation.brideNameAr)].filter(Boolean).join(' و ') || clean(invitation.childNameAr) || 'دعوة مناسبة',
    phone: '963992688759',
    whatsapp: 'https://wa.me/963992688759',
  };

  const normalize = value => String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  const assignAliases = (object, path = []) => {
    if (!object || typeof object !== 'object') return;
    for (const key of Object.keys(object)) {
      const normalized = normalize(key);
      const context = [...path, normalized].join('.');
      let value;
      if (context.includes('groom')) {
        if (/(english|eng|en)$/.test(normalized)) value = values.groomEn;
        else if (/(arabic|ar|name|groom)$/.test(normalized)) value = values.groom;
      } else if (context.includes('bride')) {
        if (/(english|eng|en)$/.test(normalized)) value = values.brideEn;
        else if (/(arabic|ar|name|bride)$/.test(normalized)) value = values.bride;
      } else if (/(baby|newborn|child|birthday|kid)/.test(context)) {
        if (/(english|eng|en)$/.test(normalized)) value = values.childEn;
        else if (/(name|arabic|ar|baby)$/.test(normalized)) value = values.child;
      }
      if (value === undefined) {
        if (['groomarabic','groomar','groomnamear','groomname','groomrelationname'].includes(normalized)) value = values.groom;
        else if (['bridearabic','bridear','bridenamear','bridename','briderelationname'].includes(normalized)) value = values.bride;
        else if (['groomenglish','groomen','groomnameen'].includes(normalized)) value = values.groomEn;
        else if (['brideenglish','brideen','bridenameen'].includes(normalized)) value = values.brideEn;
        else if (['childname','childnamear','babyname','namear','namearabic'].includes(normalized) && ['birthday','newborn'].includes(invitation.occasion)) value = values.child;
        else if (['childnameen','babynameen','nameen'].includes(normalized) && ['birthday','newborn'].includes(invitation.occasion)) value = values.childEn;
        else if (['eventdate','weddingdate','dateiso','date'].includes(normalized)) value = values.date;
        else if (normalized === 'timezone') value = values.timeZone;
        else if (normalized === 'timezoneoffsethours') value = values.timeZoneOffsetHours;
        else if (['datetext','dateformatted','datecaption'].includes(normalized)) value = values.dateText;
        else if (['timetext','eventtime','starttime','time'].includes(normalized)) value = normalized === 'time' && path.includes('calendar') ? invitation.eventTime : values.timeText;
        else if (['venuename','venue','hallname','locationname'].includes(normalized)) value = values.venue;
        else if (['venueaddr','address','venueaddress','location','locationaddress'].includes(normalized)) value = values.address;
        else if (['mapurl','mapsurl','maplink','mapslink'].includes(normalized)) value = values.map;
        else if (['welcomeline','herosub','welcome','welcometext','heroline'].includes(normalized)) value = values.welcome;
        else if (['invitationtext','invitationmessage','invitationcopy'].includes(normalized)) value = values.invitationText;
        else if (['verse','versetext','blessing','dua'].includes(normalized)) value = values.verse;
        else if (['groomparents','groomfamily','groomparentsname'].includes(normalized)) value = values.groomParents;
        else if (['brideparents','bridefamily','brideparentsname'].includes(normalized)) value = values.brideParents;
        else if (['closingfamilies','families','familyline'].includes(normalized)) value = values.families;
        else if (['program','programme','schedule','timeline'].includes(normalized) && Array.isArray(object[key])) value = values.program;
        else if (['notes','guestnotes','notices','announcements'].includes(normalized) && Array.isArray(object[key])) value = values.notes;
        else if (['closingnote','closingtext','closing'].includes(normalized)) value = values.closing;
        else if (['musicvideoid','youtubevideoid','soundtrackvideoid','videoid'].includes(normalized)) value = values.music;
        else if (['whatsappurl','whatsapp','order','contacturl','demowhatsapp'].includes(normalized)) value = values.whatsapp;
        else if (['contactphone','phonenumber','whatsappnumber','phone'].includes(normalized)) value = `+${values.phone}`;
        else if (['contactname','contactlabel'].includes(normalized)) value = 'تواصل عبر واتساب';
        else if (['orderctalabel','rsvpsubmit','rsvpbutton','confirmbutton'].includes(normalized)) value = 'تواصل عبر واتساب';
        else if (['pagetitle','title'].includes(normalized)) value = values.title;
      }
      if (value !== undefined) {
        if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
          if (normalized === 'groom' || normalized === 'bride') assignAliases(object[key], [...path, normalized]);
        } else {
          object[key] = value;
        }
      } else if (typeof object[key] === 'object' && object[key] !== null) {
        assignAliases(object[key], [...path, normalized]);
      }
    }
  };

  const applyConfiguration = config => {
    if (!config) return config;
    assignAliases(config);
    return config;
  };
  window.__MAWADA_INVITATION__ = invitation;
  for (const globalName of ['__INVITE__', 'SITE_CONFIG', 'INVITATION', 'INVITATION_CONFIG', 'INVITATION_DATA', 'TEMPLATE_CONFIG']) {
    try {
      let current = window[globalName];
      Object.defineProperty(window, globalName, {
        configurable: true,
        enumerable: true,
        get: () => current,
        set: value => { current = applyConfiguration(value); },
      });
      if (current) applyConfiguration(current);
    } catch { /* A template may expose a non-configurable global. */ }
  }

  if (typeof window.fetch === 'function') {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const requestUrl = String(args[0] instanceof Request ? args[0].url : args[0]);
      if (!/site\.config\.json(?:[?#]|$)/i.test(requestUrl) || !response.ok) return response;
      try {
        const json = applyConfiguration(await response.clone().json());
        return new Response(JSON.stringify(json), { status: response.status, statusText: response.statusText, headers: response.headers });
      } catch { return response; }
    };
  }

  const removePromotion = () => {
    for (const element of document.querySelectorAll('a,small,span,p,div,footer')) {
      if (element.childElementCount > 4) continue;
      const text = (element.textContent || '').trim();
      if (/صنع\s+(?:من\s+خلال|بواسطة|عبر)\s+هلاهيل|هلاهيل\.كوم|halaheel\.com|powered\s+by\s+halaheel/i.test(text)) {
        if (element.matches('footer')) element.remove();
        else if (element.parentElement?.matches('footer,[class*=made-by],[class*=powered]')) element.parentElement.remove();
        else element.remove();
      }
    }
    if (document.title !== values.title) document.title = values.title;
  };
  const connectContactActions = () => {
    for (const anchor of document.querySelectorAll('a[href]')) {
      const text = (anchor.textContent || '').trim();
      const href = anchor.getAttribute('href') || '';
      if (/whatsapp|wa\.me/i.test(href) || /اطلب(?:ه|وا|ي)?|تأكيد الحضور|تواصل(?:وا)?|تهنئة|مبارك|استفسار/i.test(text)) {
        const url = new URL(values.whatsapp);
        url.searchParams.set('text', `مرحبًا، أود التواصل بخصوص ${values.title}.`);
        anchor.setAttribute('href', url.href);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noreferrer');
      }
      if (/^(?:#|javascript:)/i.test(href) && /اطلب|تواصل|تهنئة/i.test(text)) anchor.setAttribute('href', values.whatsapp);
    }
  };
  const routeFormsToWhatsApp = () => {
    for (const form of document.querySelectorAll('form')) {
      if (form.dataset.mawadaWhatsApp === 'true') continue;
      form.dataset.mawadaWhatsApp = 'true';
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const fields = [...form.querySelectorAll('input:not([type="hidden"]),textarea,select')]
          .filter(field => field.name && field.value.trim())
          .map(field => {
            const label = (field.id && form.querySelector(`label[for="${CSS.escape(field.id)}"]`)?.textContent)
              || field.closest('label')?.textContent
              || field.getAttribute('aria-label')
              || field.placeholder
              || field.name;
            return `${clean(label).replace(/\s+/g, ' ')}: ${clean(field.value)}`;
          });
        const selected = form.querySelector('[aria-pressed="true"],input[type="radio"]:checked,option:checked');
        if (selected && selected.matches('[aria-pressed="true"]')) fields.push(`الحضور: ${clean(selected.textContent)}`);
        const message = [
          `مرحبًا، أود تأكيد الحضور بخصوص ${values.title}.`,
          ...fields,
          `رابط الدعوة: ${location.href.split('?')[0]}`,
        ].join('\n');
        const url = new URL(values.whatsapp);
        url.searchParams.set('text', message);
        const confirmation = document.createElement('p');
        confirmation.className = 'mawada-feedback-note';
        confirmation.setAttribute('role', 'status');
        confirmation.textContent = 'افتحوا رسالة واتساب وأرسلوها لإتمام الرد. لا تُحفظ الردود في هذا الموقع.';
        form.after(confirmation);
        const link = document.createElement('a');
        link.className = 'mawada-feedback-link';
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'متابعة إلى واتساب';
        confirmation.append(' ', link);
        window.open(url.href, '_blank', 'noopener,noreferrer');
      }, true);
    }
  };
  const clearExampleWishes = () => {
    const selectors = '#da3wa-wish-list,#wishList,#wish-list,.wish-list,.wishes-list,.guestbook-list,[data-wishes-list]';
    for (const list of document.querySelectorAll(selectors)) {
      if (list.dataset.mawadaCleared === 'true' && list.children.length === 1 && list.firstElementChild?.classList.contains('mawada-feedback-note')) continue;
      list.dataset.mawadaCleared = 'true';
      list.replaceChildren();
      const note = document.createElement('p');
      note.className = 'mawada-feedback-note';
      note.textContent = 'ترسل التهاني وتأكيدات الحضور عبر واتساب.';
      list.append(note);
    }
  };
  const hideUnavailableSchedule = () => {
    if (invitation.eventDate && invitation.eventTime && values.timeZone) return;
    const hidden = new Set();
    for (const element of document.querySelectorAll('[role="timer"],[id*="countdown" i],[class*="countdown" i]')) {
      hidden.add(element.closest('section') || element);
    }
    for (const link of document.querySelectorAll('#calendarGoogle,#calendarApple,#googleCalendar,#appleCalendar,a[href*="calendar.google.com"],a[download$=".ics"]')) {
      hidden.add(link.closest('.cal,.calendar,[class*="calendar-card"]') || link);
    }
    for (const element of hidden) {
      if (!element.hidden) element.hidden = true;
      if (element.style.display !== 'none') element.style.display = 'none';
    }
  };
  const setTheme = () => {
    const root = document.documentElement;
    const scheduleComplete = Boolean(invitation.eventDate && invitation.eventTime && invitation.timeZone);
    if (!scheduleComplete) root.dataset.mawadaNoSchedule = 'true';
    else delete root.dataset.mawadaNoSchedule;
    if (typeof invitation.accentColor === 'string' && /^#[0-9a-f]{6}$/i.test(invitation.accentColor)) root.style.setProperty('--accent-color', invitation.accentColor);
    if (['Tajawal','Amiri','Aref Ruqaa','Reem Kufi'].includes(invitation.fontFamily)) root.style.setProperty('--mawada-font', `'${invitation.fontFamily}', sans-serif`);
    root.dataset.mawadaInvitation = 'true';
    if (!document.getElementById('mawada-theme')) {
      const style = document.createElement('style');
      style.id = 'mawada-theme';
      style.textContent = `body{font-family:var(--mawada-font,inherit)}button,.button,.btn,.cta{--template-accent:var(--accent-color,#c63f72)}.mawada-feedback-note{margin:12px 0;padding:10px 13px;border-radius:12px;background:rgba(255,255,255,.82);color:#706876;font-size:.9rem;line-height:1.7;text-align:center}.mawada-feedback-link{display:inline-block;margin-inline-start:6px;color:var(--accent-color,#c63f72);font-weight:700;text-decoration:underline}html[data-mawada-no-schedule="true"] [role="timer"],html[data-mawada-no-schedule="true"] [id*="countdown" i],html[data-mawada-no-schedule="true"] [class*="countdown" i],html[data-mawada-no-schedule="true"] #calendarGoogle,html[data-mawada-no-schedule="true"] #calendarApple,html[data-mawada-no-schedule="true"] #googleCalendar,html[data-mawada-no-schedule="true"] #appleCalendar,html[data-mawada-no-schedule="true"] a[href*="calendar.google.com"],html[data-mawada-no-schedule="true"] a[download$=".ics"],html[data-mawada-no-schedule="true"] .cal{display:none!important}`;
      document.head.append(style);
    }
  };
  const refresh = () => { removePromotion(); connectContactActions(); routeFormsToWhatsApp(); clearExampleWishes(); hideUnavailableSchedule(); setTheme(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
  new MutationObserver(refresh).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
})();

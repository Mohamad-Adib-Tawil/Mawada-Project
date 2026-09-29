// GitHub Pages is static, so send a guest's RSVP to the configured WhatsApp contact.
document.addEventListener('submit', function (event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== 'da3wa-rsvp-form') return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const config = window.__INVITE__ && window.__INVITE__.config;
  const contactUrl = config && config.whatsappUrl;
  if (!contactUrl) return;

  const selected = form.querySelector('#da3wa-att .pill[aria-pressed="true"]');
  const attendanceLabels = { yes: 'نعم، سأحضر', no: 'أعتذر عن الحضور', maybe: 'ربما أحضر' };
  const name = form.elements.namedItem('guest_name').value.trim();
  const companions = form.querySelector('#da3wa-guests').textContent.trim();
  const message = form.elements.namedItem('message').value.trim();
  const lines = [
    `تأكيد حضور حفل زفاف ${config.groom} و${config.bride}`,
    `الاسم: ${name}`,
    `الحضور: ${(selected && attendanceLabels[selected.dataset.v]) || attendanceLabels.yes}`,
    `عدد المرافقين: ${companions}`,
  ];
  if (message) lines.push(`رسالة: ${message}`);

  const url = `${contactUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  const card = document.getElementById('da3wa-rsvp-card');
  if (!card) return;
  const confirmation = document.createElement('div');
  confirmation.className = 'ok';
  const emoji = document.createElement('div');
  emoji.className = 'emoji';
  emoji.textContent = '💌';
  const heading = document.createElement('h3');
  heading.textContent = 'تم تجهيز رسالة التأكيد';
  const note = document.createElement('p');
  note.className = 'sub';
  note.textContent = 'أرسل الرسالة في واتساب لإتمام تأكيد حضورك.';
  const link = document.createElement('a');
  link.className = 'send';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'المتابعة إلى واتساب';
  confirmation.append(emoji, heading, note, link);
  card.replaceChildren(confirmation);
}, true);

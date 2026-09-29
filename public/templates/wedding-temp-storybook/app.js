(function () {
  'use strict';

  var config = window.__INVITE__ && window.__INVITE__.config;
  if (!config) return;

  var requestButton = document.getElementById('requestButton');
  if (requestButton) {
    requestButton.href = config.requestUrl || config.whatsappUrl;
    requestButton.textContent = config.requestLabel || 'اطلبه عبر واتساب';
  }

  var contactLink = document.getElementById('contactLink');
  if (contactLink) contactLink.href = config.whatsappUrl || config.requestUrl;

  var calendarButton = document.getElementById('calendarDownload');
  var calendarAnchor = document.getElementById('googleCalendarLink');
  var startDate = new Date(config.date);
  if (Number.isFinite(startDate.getTime())) {
    var endDate = new Date(startDate.getTime() + (config.calendarDurationHours || 4) * 3600000);
    var stamp = function (date) {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    };
    var details = 'رابط الدعوة: ' + window.location.href;
    var locationText = [config.venueName, config.venueAddr].filter(Boolean).join(' — ');
    var calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(config.calendarTitle) +
      '&dates=' + stamp(startDate) + '/' + stamp(endDate) +
      '&location=' + encodeURIComponent(locationText) +
      '&details=' + encodeURIComponent(details);
    if (calendarAnchor) calendarAnchor.href = calendarUrl;
    if (calendarButton) {
      calendarButton.addEventListener('click', function (event) {
        event.preventDefault();
        var ics = [
          'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//AR',
          'BEGIN:VEVENT', 'UID:' + Date.now() + '@wedding-invitation',
          'DTSTAMP:' + stamp(new Date()), 'DTSTART:' + stamp(startDate), 'DTEND:' + stamp(endDate),
          'SUMMARY:' + config.calendarTitle, 'LOCATION:' + locationText,
          'DESCRIPTION:' + details, 'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
        var link = document.createElement('a');
        link.href = url;
        link.download = 'wedding-invitation.ics';
        link.click();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });
    }
  }

  var form = document.getElementById('da3wa-rsvp-form');
  var error = document.getElementById('da3wa-err');
  var status = document.createElement('p');
  status.className = 'rsvp-status';
  status.setAttribute('role', 'status');
  if (form && error) error.after(status);

  var attendance = 'yes';
  document.querySelectorAll('#da3wa-att .pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      attendance = pill.dataset.v || 'yes';
      document.querySelectorAll('#da3wa-att .pill').forEach(function (item) {
        item.setAttribute('aria-pressed', item === pill ? 'true' : 'false');
      });
    });
  });

  var guestCount = 0;
  var count = document.getElementById('da3wa-guests');
  var minus = document.getElementById('da3wa-minus');
  var plus = document.getElementById('da3wa-plus');
  if (minus) minus.addEventListener('click', function () {
    guestCount = Math.max(0, guestCount - 1);
    count.textContent = String(guestCount);
  });
  if (plus) plus.addEventListener('click', function () {
    guestCount = Math.min(49, guestCount + 1);
    count.textContent = String(guestCount);
  });

  if (form) form.addEventListener('submit', function (event) {
    event.preventDefault();
    error.textContent = '';
    var name = form.elements.guest_name.value.trim();
    var message = form.elements.message.value.trim();
    var response = attendance === 'yes' ? 'سأحضر' : (attendance === 'no' ? 'أعتذر عن الحضور' : 'ربما أحضر');
    var lines = [
      'تأكيد حضور زفاف ' + config.groom + ' و' + config.bride,
      'الاسم: ' + name,
      'الرد: ' + response,
      attendance === 'yes' ? 'عدد الحضور: ' + (guestCount + 1) : '',
      message ? 'رسالة: ' + message : ''
    ].filter(Boolean);
    var url = (config.whatsappUrl || config.requestUrl) + '?text=' + encodeURIComponent(lines.join('\n'));
    status.textContent = 'سيتم فتح واتساب لإرسال ردّك بعد مراجعة الرسالة.';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

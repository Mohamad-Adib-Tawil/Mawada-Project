document.addEventListener("DOMContentLoaded", function () {
  var c = window.__INVITE__.config;
  var title = "دعوة زفاف " + c.groom + " & " + c.bride;
  document.title = title;
  var canonical=document.querySelector('meta[property="og:url"]'); if(canonical)canonical.content=c.siteUrl||location.href;
  ["og:title"].forEach(function (key) { var m=document.querySelector('meta[property="'+key+'"]'); if(m)m.content=title; });
  var description = c.dateText + " • " + c.venueName;
  ["description","og:description"].forEach(function (key) { var m=document.querySelector('meta[name="'+key+'"],meta[property="'+key+'"]'); if(m)m.content=description; });
  var promo = document.querySelector("#da3wa-democta .dc-order");
  var wa = document.querySelector("#da3wa-democta .dc-wa");
  [promo,wa].forEach(function (a) { if(a){a.href=c.whatsappUrl;a.target="_blank";a.rel="noopener";} });
  var root = document.documentElement;
  root.style.setProperty("--curtain-image", "url(\"../../" + c.assets.curtainWebp + "\")");
  var preload=document.querySelector('link[fetchpriority="high"]'); if(preload)preload.href="../../"+c.assets.curtainWebp;
  var gallery=document.querySelectorAll("#da3wa-mem .mem-cell img"); c.assets.gallery.forEach(function(src,i){if(gallery[i])gallery[i].src="../../"+src;});
  var socialImage="../../"+c.assets.share; ["og:image"].forEach(function(key){var m=document.querySelector('meta[property="'+key+'"]');if(m)m.content=socialImage;});
  var twitterImage=document.querySelector('meta[name="twitter:image"]');if(twitterImage)twitterImage.content=socialImage;
  var cal = document.querySelector("#da3wa-cal .cal");
  if (cal) { var top=cal.querySelector(".cal-top"), wd=cal.querySelector(".cal-wd"), day=cal.querySelector(".cal-day"), time=cal.querySelector(".cal-time");
    var date=new Date(c.date); var tz=c.timezone||"Asia/Baghdad";
    var format=function(options){options.timeZone=tz;return new Intl.DateTimeFormat("ar",options).format(date)};
    if(top)top.textContent=format({month:"long",year:"numeric"}); if(wd)wd.textContent=format({weekday:"long"}); if(day)day.textContent=format({day:"numeric"}); if(time)time.textContent=c.timeText;
    var civil=function(value){var m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);return m?m.slice(1).join(""):""};
    var shiftCivil=function(value,hours){var m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);if(!m)return "";var d=new Date(Date.UTC(+m[1],+m[2]-1,+m[3],+m[4]+hours,+m[5],+m[6]));return [d.getUTCFullYear(),String(d.getUTCMonth()+1).padStart(2,"0"),String(d.getUTCDate()).padStart(2,"0"),"T",String(d.getUTCHours()).padStart(2,"0"),String(d.getUTCMinutes()).padStart(2,"0"),String(d.getUTCSeconds()).padStart(2,"0")].join("")};
    var start=civil(c.date),end=shiftCivil(c.date,4);
    var gcal=cal.querySelector(".cal-btns a:first-child"); if(gcal)gcal.href="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+start+"/"+end+"&ctz="+encodeURIComponent(tz)+"&location="+encodeURIComponent(c.venueName+" — "+c.venueAddr)+"&details="+encodeURIComponent(description);
    var ical=cal.querySelector(".cal-btns a:last-child"); if(ical){ical.href="#";ical.addEventListener("click",function(e){e.preventDefault();var ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Wedding Invitation//AR","BEGIN:VEVENT","DTSTART;TZID="+tz+":"+start,"DTEND;TZID="+tz+":"+end,"SUMMARY:"+title,"LOCATION:"+c.venueName+" — "+c.venueAddr,"DESCRIPTION:"+description,"END:VEVENT","END:VCALENDAR"].join("\r\n");var blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="wedding-invitation.ics";a.click();URL.revokeObjectURL(url);});}
  }
});

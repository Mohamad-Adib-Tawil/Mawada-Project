/**
 * Orchestrates the reference-inspired opening without baking guest text into images.
 * Timings live here; personal copy and media paths remain in wedding-config.js.
 */
export function initExperience(config, showToast) {
  const root = document.querySelector('#experience');
  const copy = document.querySelector('#experience-copy');
  const site = document.querySelector('#wedding-content');
  const openButton = document.querySelector('#open-invitation');
  const skipButton = document.querySelector('#skip-intro');
  const continueButton = document.querySelector('#continue-to-site');
  const soundButton = document.querySelector('#sound-toggle');
  const video = document.querySelector('#invitation-video');
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timers = new Set();

  function schedule(callback, delay) {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);
    timers.add(timer);
  }

  function clearTimeline() {
    timers.forEach(window.clearTimeout);
    timers.clear();
  }

  function showChapter(name) {
    chapters.forEach((chapter) => {
      const active = chapter.dataset.chapter === name && !chapter.hidden;
      chapter.classList.toggle('is-active', active);
      chapter.setAttribute('aria-hidden', String(!active));
    });
  }

  function revealSite() {
    if (root.hidden || root.classList.contains('experience--leaving')) return;
    clearTimeline();
    video.pause();
    root.classList.add('experience--leaving');
    schedule(() => {
      root.hidden = true;
      document.querySelector('.skip-link').hidden = false;
      site.inert = false;
      site.setAttribute('aria-hidden', 'false');
      document.body.classList.remove('is-locked');
      const hero = document.querySelector('#home');
      hero.setAttribute('tabindex', '-1');
      hero.focus({ preventScroll: true });
    }, reduceMotion.matches ? 0 : 650);
  }

  function startVideo() {
    video.hidden = false;
    video.src = config.invitationVideo;
    if (config.invitationPoster) video.poster = config.invitationPoster;
    video.muted = true;
    soundButton.hidden = false;
    video.play().catch(() => {
      showToast('يمكنك تشغيل الفيديو أو متابعة الدعوة.');
    });
  }

  function startOpening() {
    if (root.classList.contains('experience--opening')) return;
    root.classList.add('experience--opening');
    openButton.hidden = true;
    skipButton.hidden = false;
    const openingDelay = reduceMotion.matches ? 0 : 2600;

    schedule(() => {
      root.classList.add('experience--opened');
      copy.inert = false;
      continueButton.hidden = false;
      if (config.invitationVideo) {
        startVideo();
        return;
      }
      showChapter(reduceMotion.matches ? 'message' : 'names');
    }, openingDelay);

    if (config.invitationVideo || reduceMotion.matches) return;
    schedule(() => showChapter('message'), openingDelay + 4700);
    const hasDetails = !document.querySelector('[data-chapter="details"]').hidden;
    if (hasDetails) schedule(() => showChapter('details'), openingDelay + 13900);
    schedule(revealSite, hasDetails ? 35000 : 22000);
  }

  function replayInvitation() {
    clearTimeline();
    video.pause();
    video.hidden = true;
    video.removeAttribute('src');
    video.load();
    soundButton.hidden = true;
    soundButton.setAttribute('aria-pressed', 'false');
    soundButton.textContent = 'تشغيل الصوت';
    document.body.classList.add('is-locked');
    document.querySelector('.skip-link').hidden = true;
    site.inert = true;
    site.setAttribute('aria-hidden', 'true');
    root.hidden = false;
    root.classList.remove('experience--opening', 'experience--opened', 'experience--leaving');
    copy.inert = true;
    showChapter('');
    openButton.hidden = false;
    skipButton.hidden = true;
    continueButton.hidden = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    openButton.focus();
  }

  openButton.addEventListener('click', startOpening);
  skipButton.addEventListener('click', revealSite);
  continueButton.addEventListener('click', revealSite);
  document.querySelector('#replay-invitation').addEventListener('click', replayInvitation);
  video.addEventListener('ended', revealSite);
  video.addEventListener('error', () => {
    if (video.hidden) return;
    video.hidden = true;
    soundButton.hidden = true;
    showChapter('message');
    showToast('تعذر تحميل الفيديو. يمكنك متابعة الدعوة.');
  });
  soundButton.addEventListener('click', () => {
    video.muted = !video.muted;
    soundButton.setAttribute('aria-pressed', String(!video.muted));
    soundButton.textContent = video.muted ? 'تشغيل الصوت' : 'كتم الصوت';
  });
}

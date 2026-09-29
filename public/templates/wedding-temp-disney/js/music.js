(() => {
  const button = document.getElementById("da3wa-music");
  const host = document.getElementById("da3wa-yt");
  if (!button || !host) return;

  let player;
  let ready = false;
  let playing = false;
  const paint = () => { button.textContent = playing ? "🔊" : "🔇"; button.setAttribute("aria-label", playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"); };
  const play = () => {
    if (!ready) return;
    player.unMute(); player.setVolume(70); player.playVideo(); playing = true; paint();
  };

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(host, { videoId: "Hp8WTVqR_0U", playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, loop: 1, playlist: "Hp8WTVqR_0U", playsinline: 1, rel: 0 }, events: { onReady: () => { ready = true; player.mute(); paint(); } } });
  };
  const api = document.createElement("script");
  api.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(api);
  button.addEventListener("click", (event) => { event.stopPropagation(); if (!ready) return; if (playing) { player.pauseVideo(); playing = false; paint(); } else play(); });
  document.addEventListener("pointerdown", () => { if (!playing) play(); }, { once: true, passive: true });
  paint();
})();

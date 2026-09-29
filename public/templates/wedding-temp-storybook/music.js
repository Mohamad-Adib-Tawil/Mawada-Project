(function () {
  'use strict';

  var config = window.__INVITE__ && window.__INVITE__.config;
  var videoId = config && config.music && config.music.youtubeVideoId;
  var player;
  var ready = false;
  var pendingAction = '';

  function createPlayer() {
    if (!window.YT || !window.YT.Player || player) return;
    player = new window.YT.Player('da3wa-yt', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: videoId,
        playsinline: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: function () {
          ready = true;
          window.__da3waMusicReady = true;
          player.mute();
          if (pendingAction) run(pendingAction);
        }
      }
    });
  }

  function run(action) {
    if (!ready || !player) {
      pendingAction = action;
      return;
    }
    pendingAction = '';
    try {
      if (action === 'prime') {
        player.mute();
        player.seekTo(0, true);
        player.playVideo();
      } else if (action === 'play') {
        player.unMute();
        player.setVolume(70);
        player.playVideo();
      } else if (action === 'pause') {
        player.mute();
        player.pauseVideo();
      }
    } catch (_) {}
  }

  window.__da3waMusicPrime = function () { run('prime'); };
  window.__da3waMusicGo = function () { run('play'); };
  window.__da3waMusicPause = function () { run('pause'); };

  if (!videoId) return;
  window.onYouTubeIframeAPIReady = createPlayer;
  var api = document.createElement('script');
  api.src = 'https://www.youtube.com/iframe_api';
  api.async = true;
  document.head.appendChild(api);
})();

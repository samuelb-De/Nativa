// Reproductor de video interactivo para la presentación de producto (8 seg)
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-video-player');
  const video = document.getElementById('product-presentation-video');
  const centerPlayBtn = document.getElementById('video-center-play-btn');
  const playBtn = document.getElementById('btn-video-play');
  const muteBtn = document.getElementById('btn-video-mute');
  const fullscreenBtn = document.getElementById('btn-video-fullscreen');
  const progressWrap = document.getElementById('video-progress-wrap');
  const progressBar = document.getElementById('video-progress-bar');
  const timeDisplay = document.getElementById('video-time-display');

  if (!video || !container) return;

  function formatTime(seconds) {
    const s = Math.floor(seconds || 0);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `${m}:${remS < 10 ? '0' : ''}${remS}`;
  }

  function updatePlayState(isPlaying) {
    if (isPlaying) {
      container.classList.add('playing');
      if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      if (centerPlayBtn) centerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      container.classList.remove('playing');
      if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
      if (centerPlayBtn) centerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.warn('Auto-playback issue:', err);
      });
    } else {
      video.pause();
      updatePlayState(false);
    }
  }

  if (centerPlayBtn) {
    centerPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  video.addEventListener('click', () => {
    togglePlay();
  });

  video.addEventListener('play', () => updatePlayState(true));
  video.addEventListener('pause', () => updatePlayState(false));

  video.addEventListener('ended', () => {
    updatePlayState(false);
    if (progressBar) progressBar.style.width = '100%';
    if (timeDisplay) timeDisplay.textContent = '0:08 / 0:08';
    setTimeout(() => {
      video.currentTime = 0;
      if (progressBar) progressBar.style.width = '0%';
      if (timeDisplay) timeDisplay.textContent = '0:00 / 0:08';
    }, 1200);
  });

  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime;
    const dur = video.duration || 8;
    const percent = Math.min(100, (cur / dur) * 100);
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur || 8)}`;
    }
  });

  if (progressWrap) {
    function seek(e) {
      const rect = progressWrap.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const clamped = Math.max(0, Math.min(1, pos));
      const dur = video.duration || 8;
      video.currentTime = clamped * dur;
    }

    progressWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      seek(e);
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }
});

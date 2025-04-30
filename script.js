// Only run once
function startVideo() {
    // Prevent multiple triggers
    if (window.hasStarted) return;
    window.hasStarted = true;
  
    const startText = document.getElementById('startText');
  
    // Fade out text
    startText.style.opacity = '0';
  
    // Remove text after fade-out
    setTimeout(() => {
      startText.remove();
    }, 1000);
  
    // Create video element
    const video = document.createElement('video');
    video.classList.add('fullscreen-video');
    video.autoplay = true;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('preload', 'auto');
    video.setAttribute('src', 'Opening.mp4');
  
    // Add video to body
    document.body.appendChild(video);
  
    // Important: wait for the video to be in DOM before trying to play with audio
    requestAnimationFrame(() => {
      video.style.opacity = '1';
  
      // Try to play with sound (after user interaction)
      video.muted = false;
      video.volume = 1.0;
  
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Autoplay with audio was blocked:', error);
        });
      }
    });
  }
  
  // Trigger on first key press or click
  document.addEventListener('keydown', startVideo, { once: true });
  document.addEventListener('click', startVideo, { once: true });
  
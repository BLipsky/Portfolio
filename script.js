document.addEventListener('DOMContentLoaded', () => {
  // If we detect the “Choose” page by its #contentArea container,
  // we disable video playback entirely.
  const isChoosePage = !!document.getElementById('contentArea');

  let isLoginActive = false;
  let failedAttempts  = 0;
  window.hasStarted  = false;

  // === 1. Video Intro Logic ===
  function startVideo() {
    // never start on the Choose page
    if (isChoosePage) return;

    if (window.hasStarted || isLoginActive) return;
    window.hasStarted = true;

    const startText = document.getElementById('startText');
    if (startText) {
      startText.style.opacity = '0';
      setTimeout(() => startText.remove(), 1000);
    }

    const video = document.createElement('video');
    video.classList.add('fullscreen-video');
    video.autoplay   = true;
    video.controls   = false;
    video.playsInline= true;
    video.preload    = 'auto';
    video.src        = 'Opening.mp4';
    video.style.opacity = '0';
    document.body.appendChild(video);

    requestAnimationFrame(() => {
      video.style.opacity = '1';
      video.muted  = false;
      video.volume = 1.0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.warn('Autoplay blocked:', err));
      }
      video.addEventListener('ended', () => {
        window.location.href = 'main.html';
      });
    });
  }

  // === 2. Unified Click Handler ===
  document.addEventListener('click', e => {
    const manageClicked = !!e.target.closest('#managePagesBtn');
    if (manageClicked) {
      e.preventDefault();
      e.stopPropagation();
      showLogin();
    } else {
      startVideo();
    }
  }, { once: true });

  // Also allow keyboard start (but still disabled on Choose page)
  document.addEventListener('keydown', startVideo, { once: true });

  // === 3. Login UI Logic ===
  function showLogin() {
    isLoginActive = true;
    const manageLink = document.querySelector('.manage-link');
    if (manageLink) manageLink.style.display = 'none';

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="login-wrapper">
        <h2>Sign In</h2>
        <input type="text" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />
        <button id="loginBtn">Sign In</button>
        <p id="error" class="error-msg"></p>
      </div>
    `;
    document.getElementById('loginBtn')
            .addEventListener('click', checkLogin);
  }

  window.checkLogin = function() {
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error');

    if (email === 'accountedit@gmail.com' && password === 'oversoon') {
      window.location.href = 'edit.html';
      return;
    }

    failedAttempts++;
    errorMsg.textContent = 'Wrong email or password.';
    document.getElementById('password').value = '';

    if (failedAttempts >= 5) {
      // restore profiles view
      const manageLink = document.querySelector('.manage-link');
      if (manageLink) manageLink.style.display = 'flex';

      const contentArea = document.getElementById('contentArea');
      contentArea.innerHTML = `
        <div class="profiles">
          <a href="htmls/home.html" class="profile">
            <div class="box1 profile-box"></div><div class="label">Home</div>
          </a>
          <a href="htmls/about.html" class="profile">
            <div class="profile-box box2"></div><div class="label">About</div>
          </a>
          <a href="htmls/gallery.html" class="profile">
            <div class="profile-box box3"></div><div class="label">Gallery</div>
          </a>
          <a href="htmls/contact.html" class="profile">
            <div class="profile-box box4"></div><div class="label">Contact</div>
          </a>
          <a href="htmls/other.html" class="profile">
            <div class="profile-box box5"></div><div class="label">Other</div>
          </a>
        </div>
      `;
    }
  };

  // === 4. Carousel Logic ===
const carouselImages = [
  { img: '../img-sites/nfl.png', title: 'SeasonForm', description: 'When a young boy vanishes…' },
  { img: '../img-sites/cafe.png', title: 'Whisp Cafe', description: 'A mutated monster hunter…' },
  { img: '../img-sites/spooky.png', title: 'Spooky Ghost', description: 'Lucifer relocates to L.A.…' }
];

const track = document.querySelector('.carousel-track');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
const heroContent = document.querySelector('.hero-content');

let currentSlide = 0;

function createSlides() {
  carouselImages.forEach(({img}, i) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    if (i === 0) slide.classList.add('active');
    slide.style.backgroundImage = `url(${img})`;
    track.appendChild(slide);
  });
  updateHeroText();
}

function updateHeroText() {
  heroTitle.textContent = carouselImages[currentSlide].title;
  heroDesc.textContent = carouselImages[currentSlide].description;
  heroContent.classList.add('show');
}

function updateSlidePosition() {
  const slides = document.querySelectorAll('.carousel-slide');
  slides.forEach(slide => slide.classList.remove('active'));
  slides[currentSlide].classList.add('active');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateHeroText();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselImages.length;
  updateSlidePosition();
}

createSlides();
updateSlidePosition();
setInterval(nextSlide, 7000);




});

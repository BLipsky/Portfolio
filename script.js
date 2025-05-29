document.addEventListener('DOMContentLoaded', () => {
  const isChoosePage = !!document.getElementById('contentArea');
  let isLoginActive = false;
  let failedAttempts = 0;
  window.hasStarted = false;
  const startText = document.getElementById('startText');
  if (!startText) {
    // Not the start page, do nothing for start video
    return;
  }

  
function startVideo() {
  if (isChoosePage || window.hasStarted || isLoginActive) return;
  window.hasStarted = true;

  // Hides the "Press Any Key to Start" text

  if (startText) startText.style.display = 'none';

  const video = document.createElement('video');
  video.classList.add('fullscreen-video');
  video.src = 'Opening.mp4';
  video.autoplay = true;
  video.playsInline = true;
  video.muted = false;
  video.volume = 1;
  video.style.opacity = '0';
  document.body.appendChild(video);

  requestAnimationFrame(() => {
    video.style.opacity = '1';
    video.play().catch(err => console.warn('Autoplay blocked:', err));
  });

  video.addEventListener('ended', () => {
    window.location.href = 'main.html';
  });
}

  document.addEventListener('click', e => {
    const isManage = !!e.target.closest('#managePagesBtn');
    if (isManage) {
      e.preventDefault();
      e.stopPropagation();
      showLogin();
    } else {
      startVideo();
    }
  }, { once: true });

  document.addEventListener('keydown', startVideo, { once: true });

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
    document.getElementById('loginBtn').addEventListener('click', checkLogin);
  }

  window.checkLogin = function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    if (email === 'accountedit@gmail.com' && password === 'oversoon') {
      window.location.href = 'edit.html';
      return;
    }

    failedAttempts++;
    error.textContent = 'Wrong email or password.';
    document.getElementById('password').value = '';

    if (failedAttempts >= 5) {
      const contentArea = document.getElementById('contentArea');
      contentArea.innerHTML = `
        <div class="profiles">
          <a href="htmls/home.html" class="profile"><div class="profile-box box1"></div><div class="label">Home</div></a>
          <a href="htmls/about.html" class="profile"><div class="profile-box box2"></div><div class="label">About</div></a>
          <a href="htmls/gallery.html" class="profile"><div class="profile-box box3"></div><div class="label">Gallery</div></a>
          <a href="htmls/contact.html" class="profile"><div class="profile-box box4"></div><div class="label">Contact</div></a>
          <a href="htmls/other.html" class="profile"><div class="profile-box box5"></div><div class="label">Other</div></a>
        </div>
      `;
    }
  };

  // === Hero Carousel ===
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
    carouselImages.forEach(({ img }, i) => {
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
  setInterval(nextSlide, 7000);

loadPosters();
fetch('../posters.json')
async function loadPosters() {
  const container = document.getElementById('poster-container');
  container.innerHTML = ''; // Clear old posters

  try {
    const response = await fetch('posters.json'); // Adjust path as necessary
    if (!response.ok) throw new Error('Failed to load posters.json');

    const data = await response.json();

    data.posters.forEach(poster => {
      // Create poster div
      const posterDiv = document.createElement('div');
      posterDiv.classList.add('poster');
      posterDiv.style.backgroundImage = `url(${poster.backgroundImage})`;
      posterDiv.title = poster.description; // Tooltip on hover

      const link = document.createElement('a');
      link.href = `${poster.link}`; // or link to details page
      link.appendChild(posterDiv);
      container.appendChild(link);

      // Add label overlay
      const label = document.createElement('div');
      label.classList.add('poster-label');
      label.textContent = poster.name;

      posterDiv.appendChild(label);

      container.appendChild(posterDiv);
    });
  } catch (error) {
    console.error('Error loading posters:', error);
    container.textContent = 'Failed to load posters.';
  }
}

  document.querySelector('.control-edit-poster-btn').addEventListener('click', () => {
    const poster = document.querySelector(".control-poster-select").value;
    alert("Editing: " + poster);
  });

  document.querySelector('.control-launch-apply-btn').addEventListener('click', () => {
    const seconds = document.querySelector(".control-launch-input").value;
    alert("Launch shortened by " + seconds + " seconds.");
  });

  document.querySelector('.control-cover-update-btn').addEventListener('click', () => {
    const url = document.querySelector(".control-cover-input").value;
    alert("Cover site changed to: " + url);
  });

  document.querySelector('.control-schedule-btn').addEventListener('click', () => {
    const datetime = document.querySelector(".control-schedule-input").value;
    alert("Content update scheduled for: " + datetime);
  });

  document.querySelector('.control-genre-set-btn').addEventListener('click', () => {
    const genre = document.querySelector(".control-genre-select").value;
    alert("Featured genre set to: " + genre);
  });

  let autoRefreshEnabled = false;
  const autoRefreshBtn = document.getElementById("auto-refresh-btn");
  autoRefreshBtn.addEventListener('click', () => {
    autoRefreshEnabled = !autoRefreshEnabled;
    autoRefreshBtn.textContent = autoRefreshEnabled ? "Disable Auto Refresh" : "Enable Auto Refresh";
    alert("Auto Refresh " + (autoRefreshEnabled ? "Enabled" : "Disabled"));
  });

});

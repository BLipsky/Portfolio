document.addEventListener('DOMContentLoaded', () => {

  // Start Video Function
  function startVideo() {
    if (window.hasStarted) return;
    window.hasStarted = true;

    const startText = document.getElementById('startText');
    startText.style.opacity = '0';
    setTimeout(() => {
      startText.remove();
    }, 1000);

    const video = document.createElement('video');
    video.classList.add('fullscreen-video');
    video.autoplay = true;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('preload', 'auto');
    video.setAttribute('src', 'Opening.mp4');

    document.body.appendChild(video);

    requestAnimationFrame(() => {
      video.style.opacity = '1';
      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Autoplay with audio was blocked:', error);
        });
      }

      video.addEventListener('ended', () => {
        window.location.href = 'main.html';
      });
    });
  }

  document.addEventListener('keydown', startVideo, { once: true });
  document.addEventListener('click', startVideo, { once: true });

  // Login Logic
  let failedAttempts = 0;

  function showLogin() {
    const manageLink = document.querySelector('.manage-link');
    if (manageLink) {
      manageLink.style.display = 'none';
    }

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="login-wrapper">
        <h2>Sign In</h2>
        <input type="text" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />
        <button onclick="checkLogin()">Sign In</button>
        <p id="error" class="error-msg"></p>
      </div>
    `;
  }

  window.checkLogin = function() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error");

    if (email === "accountedit@gmail.com" && password === "oversoon") {
      window.location.href = "edit.html";
    } else {
      failedAttempts++;
      errorMsg.textContent = "Wrong email or password.";
      document.getElementById("password").value = "";

      if (failedAttempts >= 5) {
        const manageLink = document.querySelector('.manage-link');
        if (manageLink) {
          manageLink.style.display = 'flex';
        }

        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
          <div class="profiles">
            <a href="home.html" class="profile">
              <div class="box1 profile-box"></div>
              <div class="label">Home</div>
            </a>
            <a href="about.html" class="profile">
              <div class="profile-box box2"></div>
              <div class="label">About</div>
            </a>
            <a href="gallery.html" class="profile">
              <div class="profile-box box3"></div>
              <div class="label">Gallery</div>
            </a>
            <a href="contact.html" class="profile">
              <div class="profile-box box4"></div>
              <div class="label">Contact</div>
            </a>
            <a href="other.html" class="profile">
              <div class="profile-box box5"></div>
              <div class="label">Other</div>
            </a>
          </div>
        `;
      }
    }
  };

  // Carousel Logic
  const carouselImages = [
    {
      img: '../img-sites/nfl.png',
      title: 'SeasonForm',
      description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and a strange little girl.'
    },
    {
      img: '../img-sites/cafe.png',
      title: 'Whisp Cafe',
      description: 'A mutated monster hunter struggles to find his place in a world where people often prove more wicked than beasts.'
    },
    {
      img: '../img-sites/spooky.png',
      title: 'Spooky Ghost',
      description: 'Lucifer Morningstar, the Devil, relocates to Los Angeles and opens a nightclub while becoming a consultant to the LAPD.'
    }
  ];

  const track = document.querySelector('.carousel-track');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroContent = document.querySelector('.hero-content');

  carouselImages.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    slide.style.backgroundImage = `url(${image.img})`;

    if (index === 0) slide.classList.add('active');
    track.appendChild(slide);
  });

  let currentSlide = 0;

  function updateSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    track.style.transform = `translateX(-${index * 100}%)`;

    // Update hero content with animation
    heroTitle.textContent = carouselImages[index].title;
    heroDesc.textContent = carouselImages[index].description;
    heroContent.classList.remove('show');

    // Force reflow to restart CSS animation cleanly
    void heroContent.offsetWidth;
    
    heroContent.classList.add('show');
      }

  updateSlide(0); // Initialize

  setInterval(() => {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    updateSlide(currentSlide);
  }, 5000);

});

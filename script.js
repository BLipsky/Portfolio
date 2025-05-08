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

    // Play the video with sound
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay with audio was blocked:', error);
      });
    }

    // Redirect after video ends
    video.addEventListener('ended', () => {
      window.location.href = 'main.html'; // change to your actual next page
    });
  });
}

document.addEventListener('keydown', startVideo, { once: true });
document.addEventListener('click', startVideo, { once: true });

let failedAttempts = 0;

function showLogin() {
  // Hide the Manage Pages link when clicked
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

function checkLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("error");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === "accountedit@gmail.com" && password === "oversoon") {
    window.location.href = "edit.html";
  } else {
    failedAttempts++;
    errorMsg.textContent = "Wrong email or password.";
    passwordInput.value = "";

    if (failedAttempts >= 5) {
      // Re-show Manage Pages link
      const manageLink = document.querySelector('.manage-link');
      if (manageLink) {
        manageLink.style.display = 'flex';
      }

      // Clear login form and show main content again
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
}
// Array of background image URLs
const carouselImages = [
  'https://picsum.photos/1600/900?random=101',
  'https://picsum.photos/1600/900?random=102',
  'https://picsum.photos/1600/900?random=103',
  'https://picsum.photos/1600/900?random=104',
  'https://picsum.photos/1600/900?random=105'
];

let currentIndex = 0;

// Set initial image
// Carousel rotation logic
// Get all the carousel slides
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Start the carousel
setInterval(nextSlide, 4000); // Change slide every 4 seconds

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

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const carouselText = document.querySelector(".carousel-text");
  const posterRow = document.querySelector(".poster-row");

  // Load posters.json and initialize everything
  fetch("htmls/posters.json")
    .then(response => response.json())
    .then(data => {
      initCarousel(data);
      loadPosters(data);
    })
    .catch(error => console.error("Failed to load posters.json:", error));

  function initCarousel(posters) {
    let index = 0;

    const updateCarousel = () => {
      const { image, title, genre, description } = posters[index];

      carousel.style.backgroundImage = `url('${image}')`;
      carouselText.innerHTML = `
        <h1>${title}</h1>
        <h3>${genre}</h3>
        <p>${description}</p>
      `;

      index = (index + 1) % posters.length;
    };

    updateCarousel();
    setInterval(updateCarousel, 5000);
  }

  function loadPosters(posters) {
    posters.forEach(({ title, image }) => {
      const poster = document.createElement("div");
      poster.classList.add("poster");

      const img = document.createElement("img");
      img.src = image;
      img.alt = title;

      poster.appendChild(img);
      posterRow.appendChild(poster);
    });
  }
});

  // Keep all the rest of your control buttons handlers untouched below

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

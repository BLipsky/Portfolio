document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on the "choose page" by presence of #contentArea element
  const isChoosePage = !!document.getElementById('contentArea');
  let isLoginActive = false;  // Tracks if login form is active
  let failedAttempts = 0;     // Counts failed login attempts
  window.hasStarted = false;  // Global flag if start video has played

  // Get the "Press Any Key to Start" text element
  const startText = document.getElementById('startText');
  if (!startText) {
    // If not on the start page (no startText), stop further processing related to start video
    return;
  }

  // Function to start the opening video intro
  function startVideo() {
    // Prevent starting video if on choose page, already started, or login active
    if (isChoosePage || window.hasStarted || isLoginActive) return;
    window.hasStarted = true;

    // Hide the "Press Any Key to Start" text
    if (startText) startText.style.display = 'none';

    // Create and configure video element
    const video = document.createElement('video');
    video.classList.add('fullscreen-video');
    video.src = 'Opening.mp4';       // Set video source
    video.autoplay = true;
    video.playsInline = true;        // For mobile browsers to play inline
    video.muted = false;
    video.volume = 1;
    video.style.opacity = '0';       // Start invisible for fade-in effect

    // Append video to body
    document.body.appendChild(video);

    // On next animation frame, fade in video and play it
    requestAnimationFrame(() => {
      video.style.opacity = '1';
      video.play().catch(err => console.warn('Autoplay blocked:', err));
    });

    // When video ends, redirect to main.html page
    video.addEventListener('ended', () => {
      window.location.href = 'main.html';
    });
  }

  // Add a one-time click listener to document
  document.addEventListener('click', e => {
    // Check if clicked element or its parent is the Manage Pages button
    const isManage = !!e.target.closest('#managePagesBtn');
    if (isManage) {
      // Prevent default link behavior and stop event propagation
      e.preventDefault();
      e.stopPropagation();
      // Show login form on manage pages click
      showLogin();
    } else {
      // Otherwise, start the video intro
      startVideo();
    }
  }, { once: true });  // Only run once on first click

  // Add a one-time keydown listener to start the video on any key press
  document.addEventListener('keydown', startVideo, { once: true });

  // Function to display the login form for Manage Pages
  function showLogin() {
    isLoginActive = true;

    // Hide the manage link element to avoid multiple login triggers
    const manageLink = document.querySelector('.manage-link');
    if (manageLink) manageLink.style.display = 'none';

    // Replace the contentArea inner HTML with login form markup
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

    // Add click event listener to login button to check credentials
    document.getElementById('loginBtn').addEventListener('click', checkLogin);
  }

  // Function to check login credentials
  window.checkLogin = function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    // Hardcoded valid credentials check
    if (email === 'accountedit@gmail.com' && password === 'oversoon') {
      // Redirect to edit.html if login is successful
      window.location.href = 'edit.html';
      return;
    }

    // Increment failed attempts counter
    failedAttempts++;
    // Show error message
    error.textContent = 'Wrong email or password.';
    // Clear password field for retry
    document.getElementById('password').value = '';

    // If 5 or more failed attempts, show public profile links instead of login
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

  // ----------- CAROUSEL & POSTERS CODE --------------

  // Array of carousel items with image paths and captions
  const carouselItems = [
    {
      image: '../img-sites/cafe.jpg',
      text: 'Cozy Cafe Vibes'
    },
    {
      image: '../img-sites/nfl.jpg',
      text: 'Big Game Highlights'
    },
    {
      image: '../img-sites/spooky.jpg',
      text: 'Spooky Season Specials'
    }
  ];

  // Select carousel container and caption elements
  const carousel = document.querySelector('.carousel');
  const carouselText = document.querySelector('.carousel-text');

  // Create an img element inside the carousel container to display images
  const carouselImg = document.createElement('img');
  carousel.appendChild(carouselImg);

  let currentIndex = 0;

  // Function to update carousel image and text based on current index
  function showCarouselItem(index) {
    const item = carouselItems[index];
    carouselImg.src = item.image;
    carouselText.textContent = item.text;
  }

  // Show first carousel item on load
  showCarouselItem(currentIndex);

  // Auto rotate carousel every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    showCarouselItem(currentIndex);
  }, 5000);

  // --------- POSTERS ROW -----------

  // Get container for posters
  const posterRowsContainer = document.getElementById('poster-rows');
  if (posterRowsContainer) {
    posterRowsContainer.innerHTML = ''; // Clear existing posters content

    // Determine base path for fetching posters.json depending on current page location
    // If inside /htmls/, basePath is empty; otherwise 'htmls/'
    const isInHtmls = window.location.pathname.includes('/htmls/');
    const basePath = isInHtmls ? '' : 'htmls/';

    // Fetch posters.json to get poster data
    fetch(basePath + 'posters.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load posters.json');
        return response.json();
      })
      .then(data => {
        const posters = data.posters;

        // Create a new div to hold poster row
        const posterRow = document.getElementById("poster-row");
        posterRow.classList.add('poster-row');

        posters.forEach(poster => {
          // Adjust image source path by removing "../" and prepending basePath
          let imgSrc = poster.backgroundImage.replace(/^(\.\.\/)+/, basePath);

          // Create link element for each poster
          const link = document.createElement('a');
          link.href = poster.link;
          link.target = '_blank';               // Open in new tab
          link.rel = 'noopener noreferrer';    // Security best practice

          // Create img element with poster image and alt text
          const img = document.createElement('img');
          img.src = imgSrc;
          img.alt = poster.name;

          // Append img to link, and link to poster row
          link.appendChild(img);
          posterRow.appendChild(link);
        });

        // Append populated poster row to container
        posterRowsContainer.appendChild(posterRow);
      })
      .catch(error => {
        // Log any error while loading posters
        console.error('Error loading posters:', error);
      });
  }
});

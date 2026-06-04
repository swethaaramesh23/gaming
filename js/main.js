document.addEventListener('DOMContentLoaded', () => {
  // 1. --- Preloader Logic (2.5 seconds lock) ---
  const preloader = document.getElementById('preloader');
  const percentText = document.querySelector('.loader-percentage');
  const fillBar = document.querySelector('.loader-bar-fill');
  const statusText = document.querySelector('.loader-text');
  const body = document.body;

  // Set loading lock on body initially
  body.classList.add('loading-lock');

  const loadingMessages = [
    'Connecting Players...',
    'Game On Loading...',
    'Loading Experience...',
    'Unlocking New Levels...'
  ];

  let start = null;
  const duration = 2000; // 2 seconds exactly

  function updatePreloader(timestamp) {
    if (!start) start = timestamp;
    const progressTime = timestamp - start;
    const progress = Math.min(progressTime / duration, 1);
    const percentage = Math.floor(progress * 100);

    // Update percentage UI
    if (percentText) {
      percentText.textContent = `${percentage}%`;
    }
    if (fillBar) {
      fillBar.style.width = `${percentage}%`;
    }

    // Update status text messages based on percentage progress
    if (statusText) {
      const msgIndex = Math.floor(progress * (loadingMessages.length - 1));
      statusText.textContent = loadingMessages[msgIndex];
    }

    if (progressTime < duration) {
      requestAnimationFrame(updatePreloader);
    } else {
      // 2.5 seconds completed! Hide preloader
      if (preloader) {
        preloader.classList.add('fade-out');
      }
      body.classList.remove('loading-lock');
      
      // Trigger scroll animations immediately for visible elements
      setTimeout(() => {
        if (preloader) preloader.style.display = 'none';
        triggerScrollReveal();
      }, 500); // Wait for fade-out CSS transition
    }
  }

  // Start the loading animation ticker
  requestAnimationFrame(updatePreloader);


  // 2. --- Sticky Header Scroll Logic ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initially on load


  // 3. --- Mobile Hamburger Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.contains('open');
      if (isOpen) {
        mobileToggle.classList.remove('open');
        mobileOverlay.classList.remove('open');
        body.classList.remove('loading-lock');
      } else {
        mobileToggle.classList.add('open');
        mobileOverlay.classList.add('open');
        body.classList.add('loading-lock');
      }
    });

    // Close mobile menu when clicking a normal link (excluding dropdown triggers)
    const overlayLinks = mobileOverlay.querySelectorAll('.nav-link:not(.mobile-dropdown-trigger), .dropdown-item a');
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileOverlay.classList.remove('open');
        body.classList.remove('loading-lock');
      });
    });

    // Close button (×) inside mobile overlay
    const mobileCloseBtn = mobileOverlay.querySelector('.mobile-close');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileOverlay.classList.remove('open');
        body.classList.remove('loading-lock');
      });
    }

    // Close menu when clicking on the dark backdrop itself
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        mobileToggle.classList.remove('open');
        mobileOverlay.classList.remove('open');
        body.classList.remove('loading-lock');
      }
    });
  }


  // 4. --- Mobile Menu Dropdown Toggle ---
  const mobileDropdownTrigger = document.querySelector('.mobile-dropdown-trigger');
  const mobileDropdown = document.querySelector('.mobile-dropdown');

  if (mobileDropdownTrigger && mobileDropdown) {
    mobileDropdownTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      mobileDropdown.classList.toggle('open');
      
      // Update chevron rotation if any indicator exists
      const chevron = mobileDropdownTrigger.querySelector('.submenu-indicator');
      if (chevron) {
        chevron.style.transform = mobileDropdown.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  }


  // 5. --- FAQ Accordion Logic ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    const answerContainer = item.querySelector('.faq-answer');

    if (questionButton && answerContainer) {
      questionButton.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items first
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = '0';
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answerContainer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          answerContainer.style.maxHeight = `${answerContainer.scrollHeight}px`;
        }
      });
    }
  });


  // 6. --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  function triggerScrollReveal() {
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight * 0.9) {
        el.classList.add('active');
        // If the element contains counters, animate them once
        const counters = el.querySelectorAll('.counter');
        counters.forEach(counter => {
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            startCounter(counter);
          }
        });
      }
    });
  }

  // Fallback Scroll Listener for revealing elements
  window.addEventListener('scroll', triggerScrollReveal);

  // 7. --- Role Card Selection in Signup ---
  const roleCards = document.querySelectorAll('.role-option-card');
  const roleInput = document.getElementById('form-role');

  if (roleCards.length > 0 && roleInput) {
    roleCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all cards
        roleCards.forEach(c => c.classList.remove('active'));
        // Add active class to current card
        card.classList.add('active');
        // Set selected role to hidden input
        roleInput.value = card.getAttribute('data-role');
      });
    });
  }

  // 8. --- Signup Form Submission Routing ---
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const role = roleInput ? roleInput.value : 'gamer';

      // Save user profile to mock database (localStorage)
      localStorage.setItem('STACKLY_user_name', username);
      localStorage.setItem('STACKLY_user_email', email);
      localStorage.setItem('STACKLY_user_role', role);

      // Redirect depending on role selected
      if (role === 'learner') {
        window.location.href = 'learner-dashboard.html';
      } else {
        window.location.href = 'gamer-dashboard.html';
      }
    });
  }

  // 9. --- Login Form Submission Routing ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      
      // Save login state
      localStorage.setItem('STACKLY_user_email', email);
      localStorage.setItem('STACKLY_user_name', email.split('@')[0]);

      // If email contains 'learner', route to Learner Dashboard, otherwise Gamer
      if (email.toLowerCase().includes('learner')) {
        localStorage.setItem('STACKLY_user_role', 'learner');
        window.location.href = 'learner-dashboard.html';
      } else {
        localStorage.setItem('STACKLY_user_role', 'gamer');
        window.location.href = 'gamer-dashboard.html';
      }
    });
  }

  // 10. --- Load Dashboard Username dynamically ---
  const welcomeText = document.getElementById('dashboard-welcome-user');
  if (welcomeText) {
    const savedName = localStorage.getItem('STACKLY_user_name') || 'EliteGamer';
    welcomeText.textContent = savedName;
    // Initialize counters for stats and leaderboard
    animateCounters();
  }

  // Counter animation utility (Replaced with CountUp.js)
  function startCounter(counter) {
    const target = +counter.getAttribute('data-target');
    if (typeof countUp !== 'undefined' && countUp.CountUp) {
      const anim = new countUp.CountUp(counter, target, { duration: 2.5 });
      if (!anim.error) {
        anim.start();
      }
    } else {
      counter.textContent = target.toLocaleString();
    }
  }

  // Animate all counters that are visible
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      if (!counter.dataset.animated) {
        counter.dataset.animated = 'true';
        startCounter(counter);
      }
    });
  }

  // 11. --- Hero Carousel Rotation (GSAP) ---
  const heroImages = document.querySelectorAll('.hero-carousel .carousel-image');
  if (heroImages.length > 0 && typeof gsap !== 'undefined') {
    let currentHeroImageIndex = 0;
    gsap.set(heroImages, { opacity: 0, scale: 1 });
    gsap.set(heroImages[0], { opacity: 1, scale: 1.05 });
    
    setInterval(() => {
      const currentImg = heroImages[currentHeroImageIndex];
      currentHeroImageIndex = (currentHeroImageIndex + 1) % heroImages.length;
      const nextImg = heroImages[currentHeroImageIndex];
      
      gsap.to(currentImg, { opacity: 0, scale: 1, duration: 1, ease: "power2.inOut" });
      gsap.fromTo(nextImg, 
        { opacity: 0, scale: 1 }, 
        { opacity: 1, scale: 1.05, duration: 1, ease: "power2.inOut" }
      );
    }, 4000);
  }

  // 12. --- Initialize AOS ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // 13. --- Testimonials Swiper ---
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      }
    });
  }

  // 14. --- Back to Top Button ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

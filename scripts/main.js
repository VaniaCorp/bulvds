// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the elements
  const heroBtn = document.querySelector('.hero-btn');
  const mapForm = document.querySelector('.map-form');
  const mapSection = document.getElementById('map');

  // Hide #map by default
  if (mapSection) {
    mapSection.style.display = 'none';
  }

  // Add click event listener to hero button
  heroBtn.addEventListener('click', function() {
    // Show and animate the map form in
    gsap.to(mapForm, {
      opacity: 1,
      visibility: 'visible',
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: function() {
        // Show #map and scroll to .map-form
        if (mapSection) {
          mapSection.style.display = '';
        }
        mapForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});

// Header hide/show and color change on scroll

(function() {
  // Get the header element
  const header = document.querySelector('.main-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let isHidden = false;
  let colorSwitched = false;

  // Thresholds
  const hideShowThreshold = 60; // px before header hides
  const colorSwitchThreshold = 200; // px before color changes

  function onScroll() {
    const currentScrollY = window.scrollY;

    // Hide header when scrolling down past threshold
    if (currentScrollY > lastScrollY && currentScrollY > hideShowThreshold) {
      if (!isHidden) {
        header.style.transform = 'translate(-50%, -200%)';
        header.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
        isHidden = true;
      }
    } else {
      // Show header when scrolling up
      if (isHidden) {
        header.style.transform = 'translate(-50%, 0)';
        header.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
        isHidden = false;
      }
    }

    // Color switch logic
    if (currentScrollY > colorSwitchThreshold) {
      if (!colorSwitched) {
        header.classList.remove('tr-white');
        header.classList.add('tr-black-thick');
        colorSwitched = true;
      }
    } else {
      if (colorSwitched) {
        header.classList.remove('tr-black-thick');
        header.classList.add('tr-white');
        colorSwitched = false;
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
})();

(function () {
  // Get the #second-section element and header
  const secondSection = document.getElementById('second-section');
  const body = document.body;
  const header = document.querySelector('.main-header');
  let bgSwitched = false;

  // Helper to get the top of #second-section relative to document
  function getSecondSectionTop() {
    if (!secondSection) return Infinity;
    const rect = secondSection.getBoundingClientRect();
    return rect.top + window.scrollY;
  }

  // Helper to get the height of #second-section
  function getSecondSectionHeight() {
    if (!secondSection) return 0;
    return secondSection.offsetHeight;
  }

  // Helper to get 20% of the viewport height
  function getViewport20Percent() {
    return window.innerHeight * 1.1;
  }

  // Helper to get 40% of the viewport height
  function getViewport40Percent() {
    return window.innerHeight * 0.8;
  }

  // Inject a smooth background transition for body and header
  function injectBgBlackSectionStyle() {
    if (document.getElementById('bg-black-section-style')) return;
    const style = document.createElement('style');
    style.id = 'bg-black-section-style';
    style.innerHTML = `
      body {
        transition: background 0.6s cubic-bezier(.4,0,.2,1);
      }
      body.bg-black-section {
        background: rgb(0,0,0) !important;
      }
      .main-header {
        transition: background 0.6s cubic-bezier(.4,0,.2,1), border-color 0.6s cubic-bezier(.4,0,.2,1);
      }
    `;
    document.head.appendChild(style);
  }

  injectBgBlackSectionStyle();

  function onBgScroll() {
    const scrollY = window.scrollY;
    const sectionTop = getSecondSectionTop();
    const sectionHeight = getSecondSectionHeight();
    const offsetEnter = getViewport20Percent();
    const offsetLeave = getViewport40Percent();

    // Enter: 20% before entering second-section
    // Leave: 40% before leaving second-section
    const enterPoint = sectionTop - offsetEnter;
    const leavePoint = sectionTop + sectionHeight - offsetLeave;

    if (scrollY + 1 >= enterPoint && scrollY < leavePoint) {
      if (!bgSwitched) {
        body.classList.add('bg-black-section');
        // Ensure header has tr-white for contrast
        if (header) {
          header.classList.add('tr-white');
          header.classList.remove('tr-black-thick');
        }
        bgSwitched = true;
      }
    } else {
      if (bgSwitched) {
        body.classList.remove('bg-black-section');
        // Revert header color for contrast
        if (header) {
          header.classList.remove('tr-white');
          header.classList.add('tr-black-thick');
        }
        bgSwitched = false;
      }
    }
  }

  window.addEventListener('scroll', onBgScroll, { passive: true });
  window.addEventListener('DOMContentLoaded', onBgScroll);
  window.addEventListener('resize', onBgScroll);
})();

// Mobile Menu Functionality
(function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.main-header nav');
  
  if (!mobileMenuToggle || !mobileNav) return;

  let isMenuOpen = false;

  // Function to open the mobile menu
  function openMobileMenu() {
    isMenuOpen = true;
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('mobile-open');
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Add staggered animation classes to menu items
    const menuItems = mobileNav.querySelectorAll('a');
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transitionDelay = `${index * 0.1}s`;
      }, 50);
    });
  }

  // Function to close the mobile menu
  function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('mobile-open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Remove transition delays
    const menuItems = mobileNav.querySelectorAll('a');
    menuItems.forEach(item => {
      item.style.transitionDelay = '';
    });
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Event listeners
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (isMenuOpen && 
        !mobileMenuToggle.contains(event.target) && 
        !mobileNav.contains(event.target)) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Close menu on window resize (if switching to desktop)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991 && isMenuOpen) {
      closeMobileMenu();
    }
  });
})();

// Parallax Scrolling Functionality
(function() {
  // Get parallax elements
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const heroBg = document.querySelector('#main-img');
  const heroContent = document.querySelector('#main-display');
  const sofaImage = document.querySelector('#sofa');
  const africanImage = document.querySelector('#african');
  
  if (!parallaxElements.length && !heroBg && !heroContent) return;

  let ticking = false;
  let lastScrollY = window.scrollY;

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Hero section parallax
    if (heroBg) {
      const heroRect = heroBg.getBoundingClientRect();
      const heroTop = heroRect.top;
      const heroHeight = heroRect.height;
      
      // Only apply parallax when hero is in view
      if (heroTop < windowHeight && heroTop + heroHeight > 0) {
        const progress = (windowHeight - heroTop) / (windowHeight + heroHeight);
        const translateY = progress * 50; // Move up to 50px
        const scale = 1 + (progress * 0.1); // Scale up to 1.1
        
        heroBg.style.transform = `translateY(${translateY}px) scale(${scale})`;
      }
    }

    // Hero content parallax (moves slower than background)
    if (heroContent) {
      const heroRect = heroContent.getBoundingClientRect();
      const heroTop = heroRect.top;
      const heroHeight = heroRect.height;
      
      if (heroTop < windowHeight && heroTop + heroHeight > 0) {
        const progress = (windowHeight - heroTop) / (windowHeight + heroHeight);
        const translateY = progress * 25; // Move up to 25px (slower than background)
        
        heroContent.style.transform = `translateY(${translateY}px)`;
      }
    }

    // Sofa image parallax
    if (sofaImage) {
      const sofaRect = sofaImage.getBoundingClientRect();
      const sofaTop = sofaRect.top;
      const sofaHeight = sofaRect.height;
      
      if (sofaTop < windowHeight && sofaTop + sofaHeight > 0) {
        const progress = (windowHeight - sofaTop) / (windowHeight + sofaHeight);
        const translateX = progress * 30; // Move right to 30px
        const translateY = progress * 20; // Move up to 20px
        
        sofaImage.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    }

    // African image parallax
    if (africanImage) {
      const africanRect = africanImage.getBoundingClientRect();
      const africanTop = africanRect.top;
      const africanHeight = africanRect.height;
      
      if (africanTop < windowHeight && africanTop + africanHeight > 0) {
        const progress = (windowHeight - africanTop) / (windowHeight + africanHeight);
        const translateX = -progress * 25; // Move left to -25px
        const translateY = progress * 15; // Move up to 15px
        
        africanImage.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    }

    // Generic parallax elements with data-parallax attribute
    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const top = rect.top;
      const height = rect.height;
      
      if (top < windowHeight && top + height > 0) {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const progress = (windowHeight - top) / (windowHeight + height);
        const translateY = progress * (100 * speed); // Adjust based on speed attribute
        
        element.style.transform = `translateY(${translateY}px)`;
      }
    });

    lastScrollY = scrollY;
    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Add smooth transitions to parallax elements
  function addParallaxTransitions() {
    const elements = [heroBg, heroContent, sofaImage, africanImage, ...parallaxElements].filter(Boolean);
    
    elements.forEach(element => {
      element.style.transition = 'transform 0.1s ease-out';
      element.style.willChange = 'transform';
    });
  }

  // Initialize parallax
  function initParallax() {
    addParallaxTransitions();
    updateParallax();
  }

  // Event listeners
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', initParallax);
  window.addEventListener('DOMContentLoaded', initParallax);
  
  // Initial setup
  initParallax();
})();


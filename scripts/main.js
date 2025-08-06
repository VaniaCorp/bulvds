// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the elements
  const heroBtn = document.querySelector('.hero-btn');
  const mapForm = document.querySelector('.map-form');
  
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
        // Smoothly scroll to the map form
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

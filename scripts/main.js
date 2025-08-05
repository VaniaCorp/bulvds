// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the elements
  const heroBtn = document.querySelector('.hero-btn');
  const mapForm = document.querySelector('.map-form');
  
  // Add click event listener to hero button
  heroBtn.addEventListener('click', function() {
    // Animate hero button out
    gsap.to(heroBtn, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.out",
      onComplete: function() {
        // Hide the button completely
        heroBtn.style.display = 'none';
        
        // Show and animate the map form in
        gsap.to(mapForm, {
          opacity: 1,
          visibility: 'visible',
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1
        });
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

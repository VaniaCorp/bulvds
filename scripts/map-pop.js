(function() {
  // Path to the pin SVG
  const pinSrc = '/assets/icons/pin.svg';
  // Number of pins to pop at once (random between 3 and 5)
  const minPins = 3;
  const maxPins = 5;
  // How long each pin stays visible (ms)
  const pinVisibleDuration = 1400;

  // Get the #map container
  const map = document.getElementById('map');
  if (!map) return;

  // Ensure #map is position: relative or absolute
  if (getComputedStyle(map).position === 'static') {
    map.style.position = 'relative';
  }

  // Helper to get random position within #map, keeping pin fully inside
  function getRandomPosition(pinWidth, pinHeight) {
    const maxLeft = map.clientWidth - pinWidth;
    const maxTop = map.clientHeight - pinHeight;
    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;
    return { left, top };
  }

  // Track current pins
  let currentPins = [];

  // Helper to create and animate a pin
  function createPin() {
    const pin = document.createElement('img');
    pin.src = pinSrc;
    pin.alt = '';
    pin.setAttribute('aria-hidden', 'true');
    pin.style.position = 'absolute';
    pin.style.width = '48px';
    pin.style.height = '58px';
    pin.style.pointerEvents = 'none';
    pin.style.zIndex = 10;
    pin.style.opacity = '0';
    pin.style.transform = 'scale(0.7)';
    // Wait for image to load to get correct size
    pin.onload = function() {
      const { left, top } = getRandomPosition(pin.width, pin.height);
      pin.style.left = `${left}px`;
      pin.style.top = `${top}px`;
      // Animate in: fade and bounce
      pin.animate([
        { opacity: 0, transform: 'scale(0.7) translateY(20px)' },
        { opacity: 1, transform: 'scale(1.15) translateY(-10px)' },
        { opacity: 1, transform: 'scale(0.95) translateY(0px)' },
        { opacity: 1, transform: 'scale(1.05) translateY(-5px)' },
        { opacity: 1, transform: 'scale(1) translateY(0px)' }
      ], {
        duration: 300,
        easing: 'cubic-bezier(.4,1.6,.6,1)',
        fill: 'forwards'
      });
      pin.style.opacity = '1';
      pin.style.transform = 'scale(1)';
      // Hide after duration with a fade out and scale down
      setTimeout(() => {
        pin.animate([
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.7) translateY(20px)' }
        ], {
          duration: 200,
          easing: 'cubic-bezier(.4,0,.2,1)',
          fill: 'forwards'
        });
        setTimeout(() => {
          if (pin.parentNode) pin.parentNode.removeChild(pin);
          // Remove from currentPins
          const idx = currentPins.indexOf(pin);
          if (idx !== -1) currentPins.splice(idx, 1);
        }, 220);
      }, pinVisibleDuration);
    };
    map.appendChild(pin);
    currentPins.push(pin);
  }

  // Main loop: pop pins in batches, but never more than 3-5 at a time
  function popPinsBatch() {
    // Remove any pins that are no longer in DOM (safety)
    currentPins = currentPins.filter(pin => pin.parentNode === map);

    // Only pop a new batch if there are less than minPins pins currently
    if (currentPins.length < minPins) {
      // Remove all remaining pins (if any)
      currentPins.forEach(pin => {
        if (pin.parentNode) pin.parentNode.removeChild(pin);
      });
      currentPins = [];
      // Pop a new batch
      const numPins = Math.floor(Math.random() * (maxPins - minPins + 1)) + minPins;
      for (let i = 0; i < numPins; i++) {
        setTimeout(createPin, i * 60 + Math.random() * 40); // slight random offset for natural effect
      }
    }
    // Otherwise, do nothing (wait for pins to disappear)
  }

  // Start the popping loop
  setInterval(popPinsBatch, 200);

  // Pop a batch immediately on load
  popPinsBatch();
})();

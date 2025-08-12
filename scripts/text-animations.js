gsap.registerPlugin(SplitText, ScrollTrigger);

const ANIMATION_CONFIG = {
  hero: { stagger: 0.015, duration: 0.5, ease: "power3.out" },
  reveal: { stagger: 0.02, duration: 1, ease: "power2.out" },
  bright: { stagger: 0.07, amount: 0.7, ease: "power2.out" },
  card: { duration: 0.4, ease: "power2" },
  paragraph: { stagger: 0.015, duration: 0.7, ease: "power1.out" },
};

// --- TEXT ANIMATIONS ---
function initTextAnimations() {
  // Hero Title Animation
  const heroText = document.querySelectorAll("h1.animate-title, h2.animate-title, h3.animate-title, h4.animate-title, h5.animate-title, h6.animate-title");
  if (heroText.length) {
    heroText.forEach(text => {
      const split = new SplitText(text, { type: "chars,words" });
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: text, // Trigger animation when the specific h1 element enters viewport
          start: "top 80%", // Start when top of element hits 80% of viewport height
          toggleActions: "play none none none", // Play animation once on enter
        },
        opacity: 1,
        yPercent: 200,
        stagger: ANIMATION_CONFIG.hero.stagger,
        duration: ANIMATION_CONFIG.hero.duration,
        ease: ANIMATION_CONFIG.hero.ease,
      });
    });
  }

  // Reveal Text Animation (used in "Let's Work" section)
  const revealText = document.querySelectorAll(".reveal-text");
  if (revealText.length) {
    revealText.forEach(text => {
      const split = new SplitText(text, { type: "words" });
      gsap.from(split.words, {
        scrollTrigger: {
          trigger: text, // Trigger when the specific reveal-text element enters viewport
          start: "top 80%", // Consistent start position
          toggleActions: "play none none none",
        },
        opacity: 0,
        yPercent: 200,
        duration: ANIMATION_CONFIG.reveal.duration,
        stagger: ANIMATION_CONFIG.reveal.stagger,
        ease: ANIMATION_CONFIG.reveal.ease,
      });
    });
  }

  // Bright Text Animation
  const brightTextPara = document.querySelector(".bright-text");
  if (brightTextPara) {
    const split = new SplitText(brightTextPara, { type: "words" });
    split.words.forEach(word => word.classList.add("highlight-fade"));
    gsap.to(split.words, {
      scrollTrigger: {
        trigger: brightTextPara, // Trigger when bright-text element enters viewport
        start: "top 80%",
        end: "bottom 20%",
        scrub: true, // Smoothly animate with scroll
      },
      color: "var(--color-white)",
      stagger: {
        each: ANIMATION_CONFIG.bright.stagger,
        amount: ANIMATION_CONFIG.bright.amount,
      },
      ease: ANIMATION_CONFIG.bright.ease,
      onUpdate: function () {
        split.words.forEach(word => {
          if (window.getComputedStyle(word).color === "rgb(242, 242, 242)") {
            word.classList.remove("highlight-fade");
          }
        });
      },
    });
  }

  // Paragraph Animation (lines)
  const paragraphs = document.querySelectorAll("p.animate-paragraph, h2.animate-paragraph");
  if (paragraphs.length) {
    paragraphs.forEach(paragraph => {
      const split = new SplitText(paragraph, { type: "lines" });
      gsap.from(split.lines, {
        scrollTrigger: {
          trigger: paragraph, // Trigger when the specific paragraph enters viewport
          start: "top 85%", // Slightly different start for visual hierarchy
          toggleActions: "play none none none",
        },
        opacity: 0, // Start from opacity 0 for fade-in effect
        y: 100,
        stagger: ANIMATION_CONFIG.paragraph.stagger,
        duration: ANIMATION_CONFIG.paragraph.duration,
        ease: ANIMATION_CONFIG.paragraph.ease,
      });
    });
  }
}

// Initialize animations after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTextAnimations();
  ScrollTrigger.refresh();
});
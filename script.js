// Lenis Smooth Scroll ------------------------------------------
const lenis = new Lenis({
  smooth: true,
  lerp: 0.1,
  wheelMultiplier: 1,
  infinite: false,
  normalizeWheel: true,
  gestureOrientation: "vertical",
});

// Sync Lenis with GSAPs ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

// Ensure Lenis height updates correctly
function updateLenisHeight() {
  setTimeout(() => {
    lenis.resize();
    ScrollTrigger.refresh();
    console.log("Lenis height recalculated:", document.body.scrollHeight);
  }, 100); // Small delay to let everything load
}

// Run updates when everything is loaded
window.addEventListener("load", updateLenisHeight);
window.addEventListener("resize", updateLenisHeight);

// Extra Fix: Run one last update after 2 seconds (for lazy-loaded elements)
setTimeout(updateLenisHeight, 2000);

// Keep animation frame running for Lenis
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// IPAD interaction (tilt) GSAP / Scrolltrigger ---------------------
$(document).ready(function () {
  // Keep Lenis & ScrollTrigger in Sync
  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });

  // Function to fix Lenis height issues & reinitialize GSAP animations
  function updateLenisHeight() {
    setTimeout(() => {
      lenis.resize(); // Ensure Lenis detects full page height
      ScrollTrigger.refresh(); // Fixes GSAP animations
      console.log("Lenis height recalculated:", document.body.scrollHeight);

      // Re-run iPad animations after Lenis updates
      initIpadAnimations();
    }, 100);
  }

  // Run updates when everything is loaded
  window.addEventListener("load", updateLenisHeight);
  window.addEventListener("resize", updateLenisHeight);
  setTimeout(updateLenisHeight, 2000); // Extra delay for lazy-loaded elements

  // Keep animation frame running for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Function to reinitialize GSAP iPad animations
  function initIpadAnimations() {
    let ipadWrapper = $(".ipad-wrapper");
    let image = $(".home_app-features_lightbox-image");

    // Kill any previous GSAP animations (prevents duplication issues)
    gsap.killTweensOf([image, ipadWrapper]);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Remove old ScrollTriggers

    // Set initial transforms
    gsap.set(ipadWrapper, {
      transformPerspective: 800,
      transformOrigin: "center center",
      scale: 1.1,
    });

    // Scroll-triggered entrance animation (Scale down smoothly)
    gsap.to(ipadWrapper, {
      scale: 1,
      ease: "power2.out",
      duration: 2.5,
      scrollTrigger: {
        trigger: ".header75_ix-trigger",
        start: "top 75%",
        end: "top 25%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Mouse-follow tilt effect (Works independently)
    $(window).on("mousemove", function (e) {
      let xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      let yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(image, {
        rotationY: xPercent * 15,
        rotationX: yPercent * -10,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    // Reset mouse tilt smoothly when leaving
    $(window).on("mouseleave", function () {
      gsap.to(image, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    // Refresh ScrollTrigger again after animations are added
    ScrollTrigger.refresh();
  }

  // Run iPad animations initially
  initIpadAnimations();
});

//--- Slider Arrows Disable --------------------------
$(document).ready(function () {
  var $slider = $(".home_how-it-works_group.w-slider");
  var $prevArrow = $(".slider-arrow.is-bottom-previous.w-slider-arrow-left");
  var $nextArrow = $(".slider-arrow.is-bottom-next.w-slider-arrow-right");
  var $slides = $slider.find(".w-slide");
  var $mask = $slider.find(".w-slider-mask");

  function updateArrows() {
    var activeIndex = $slides.filter('[aria-hidden="false"]').index(); // Get current slide index
    var totalSlides = $slides.length;

    // Ensure arrows are always visible
    $prevArrow.css({ display: "flex" });
    $nextArrow.css({ display: "flex" });

    // Disable previous arrow if at the first slide
    if (activeIndex === 0) {
      $prevArrow.css({ opacity: "0.2", "pointer-events": "none" });
    } else {
      $prevArrow.css({ opacity: "1", "pointer-events": "auto" });
    }

    // Disable next arrow if at the last slide
    if (activeIndex === totalSlides - 1) {
      $nextArrow.css({ opacity: "0.2", "pointer-events": "none" });
    } else {
      $nextArrow.css({ opacity: "1", "pointer-events": "auto" });
    }
  }

  // Initial check on page load
  updateArrows();

  // Listen for Webflow’s slide change event
  $mask.on("transitionend webkitTransitionEnd oTransitionEnd", function () {
    setTimeout(updateArrows, 50);
  });

  // Extra check in case Webflow overrides styles after initialization
  setTimeout(updateArrows, 500);
});

//-- Line Dots Interaction - CTA ---------------------------->
$(document).ready(function () {
  function drawLine() {
    let $dot1 = document.querySelector(".dot");
    let $dot2 = document.querySelector(".dot.is-2");
    let $dot3 = document.querySelector(".dot.is-3");
    let $wrapper = document.querySelector(".home_membership_image-wrapper");

    if (!$dot1 || !$dot2 || !$dot3 || !$wrapper) return;

    let rect1 = $dot1.getBoundingClientRect();
    let rect2 = $dot2.getBoundingClientRect();
    let rect3 = $dot3.getBoundingClientRect();
    let wrapperRect = $wrapper.getBoundingClientRect();

    // Calculate dot center positions relative to the wrapper
    let x1 = rect1.left + rect1.width / 2 - wrapperRect.left;
    let y1 = rect1.top + rect1.height / 2 - wrapperRect.top;
    let x2 = rect2.left + rect2.width / 2 - wrapperRect.left;
    let y2 = rect2.top + rect2.height / 2 - wrapperRect.top;
    let x3 = rect3.left + rect3.width / 2 - wrapperRect.left;
    let y3 = rect3.top + rect3.height / 2 - wrapperRect.top;

    let line1 = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="${x1},${y1} ${x2},${y2}" 
                                  stroke="white" stroke-width="1" fill="none"/>
                     </svg>`;

    let line2 = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="${x2},${y2} ${x3},${y3}" 
                                  stroke="white" stroke-width="1" fill="none"/>
                     </svg>`;

    $(".line_wrap--low").html(line1); // Line between dot 1 and dot 2
    $(".line_wrap--high").html(line2); // Line between dot 2 and dot 3
  }

  function updateLineOnAnimation() {
    drawLine();
    requestAnimationFrame(updateLineOnAnimation);
  }

  updateLineOnAnimation();
});

//--- Horizontal Scroll Marquee ---------------------------->
$(document).ready(function () {
  let wrap = $(".scroll_horizontal_wrap");
  let track = $(".scroll_horizontal_track");

  // Get the total width of the scrolling content
  let totalWidth = track[0].scrollWidth;

  // Set the wrap height correctly
  wrap.css("height", totalWidth + "px");

  // Horizontal Scroll Animation
  let horizontalScroll = gsap.to(track, {
    x: () => -(totalWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: () => "+=" + totalWidth,
      scrub: 1,
      pin: ".scroll_horizontal_contain",
      anticipatePin: 1, // Prevents layout jumps
      invalidateOnRefresh: true,
    },
  });

  // Sync Lenis with ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Ensure Lenis detects correct height (fix for pinned sections)
  function updateLenis() {
    lenis.resize();
    ScrollTrigger.refresh();
  }

  window.addEventListener("load", updateLenis);
  window.addEventListener("resize", updateLenis);
  setTimeout(updateLenis, 1000); // Extra fix for lazy loading

  console.log("Horizontal Scroll Initialized");
});

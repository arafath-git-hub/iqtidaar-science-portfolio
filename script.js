
/* ==========================================
   IQTIDAAR ARAFATH — SCIENCE OS 3000
   Main JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ------------------------------------------
  // 1. ELEMENTS
  // ------------------------------------------

  const bootSequence = document.getElementById("bootSequence");
  const bootFill = document.getElementById("bootFill");
  const bootStatus = document.getElementById("bootStatus");
  const skipSequence = document.getElementById("skipSequence");

  const mainNav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");

  const deepSpaceToggle = document.getElementById("deepSpaceToggle");

  const bootCanvas = document.getElementById("bootCanvas");
  const starsCanvas = document.getElementById("starsCanvas");
  const orbitCanvas = document.getElementById("orbitCanvas");

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // ------------------------------------------
  // 2. BOOT SEQUENCE
  // ------------------------------------------

  let bootFinished = false;
  let bootTimer = null;
  let bootProgress = 0;

  const bootMessages = [
    "INITIALIZING SYSTEMS...",
    "CONNECTING TO STAR MAP...",
    "LOADING SCIENCE DATABASE...",
    "CALIBRATING ORBITAL DISPLAY...",
    "ALL SYSTEMS ONLINE."
  ];

  function finishBoot() {
    if (bootFinished) return;

    bootFinished = true;

    if (bootTimer !== null) {
      clearInterval(bootTimer);
      bootTimer = null;
    }

    if (bootFill) bootFill.style.width = "100%";
    if (bootStatus) bootStatus.textContent = "SYSTEM ONLINE.";

    if (bootSequence) {
      bootSequence.classList.add("finished");
    }

    // Show the main site even if the boot animation is skipped.
    document.body.classList.add("system-ready");

    // Refresh canvas sizes after the main page becomes visible.
    window.dispatchEvent(new Event("resize"));
  }

  if (bootSequence) {
    bootTimer = setInterval(() => {
      bootProgress += 2;

      if (bootFill) {
        bootFill.style.width = `${Math.min(bootProgress, 100)}%`;
      }

      if (bootStatus) {
        const messageIndex = Math.min(
          Math.floor(bootProgress / 22),
          bootMessages.length - 1
        );

        bootStatus.textContent = bootMessages[messageIndex];
      }

      if (bootProgress >= 100) {
        finishBoot();
      }
    }, 55);
  }

  if (skipSequence) {
    skipSequence.addEventListener("click", finishBoot);
  }

  // Fallback: the boot screen should never block the website forever.
  window.setTimeout(finishBoot, 4500);

  // ------------------------------------------
  // 3. PAGE NAVIGATION
  // ------------------------------------------

  const navLinks = document.querySelectorAll("[data-panel]");
  const panels = document.querySelectorAll(".panel");

  function showPanel(panelId) {
    const target = document.getElementById(panelId);

    if (!target || !target.classList.contains("panel")) return;

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === panelId);
    });

    navLinks.forEach((link) => {
      const isActive = link.dataset.panel === panelId;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Close the mobile menu after a selection.
    if (mainNav) mainNav.classList.remove("open");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      showPanel(link.dataset.panel);
    });
  });

  // Home section buttons that open another panel.
  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      showPanel(button.dataset.scroll);
    });
  });

  // ------------------------------------------
  // 4. MOBILE MENU
  // ------------------------------------------

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "CLOSE ✕" : "MENU ☰";
    });
  }

  // ------------------------------------------
  // 5. SPACE EXPLORER TABS
  // ------------------------------------------

  const tabButtons = document.querySelectorAll("[data-tab]");
  const tabContents = document.querySelectorAll(".tab-content");

  function showTab(tabId) {
    const target = document.getElementById(tabId);

    if (!target || !target.classList.contains("tab-content")) return;

    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tabId;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === tabId);
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tab);
    });
  });

  // ------------------------------------------
  // 6. DEEP SPACE MODE
  // ------------------------------------------

  if (deepSpaceToggle) {
    deepSpaceToggle.addEventListener("click", () => {
      const enabled = document.body.classList.toggle("deep-space");

      deepSpaceToggle.textContent = enabled
        ? "EXIT DEEP SPACE"
        : "DEEP SPACE MODE";

      deepSpaceToggle.setAttribute(
        "aria-pressed",
        String(enabled)
      );
    });
  }

  // ------------------------------------------
  // 7. CONTACT FORM DEMO
  // ------------------------------------------

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formStatus.textContent =
        "DEMO ONLY: No message was sent. Connect an email service to enable delivery.";
    });
  }

  // ------------------------------------------
  // 8. CANVAS HELPERS
  // ------------------------------------------

  function setupCanvas(canvas) {
    if (!canvas) return null;

    const context = canvas.getContext("2d");
    if (!context) return null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resize();

    return {
      canvas,
      context,
      resize
    };
  }

  // ------------------------------------------
  // 9. ANIMATED STAR FIELD
  // ------------------------------------------

  const starSetup = setupCanvas(starsCanvas);
  let stars = [];
  let starWidth = 0;
  let starHeight = 0;

  function createStars() {
    if (!starSetup) return;

    const rect = starsCanvas.getBoundingClientRect();

    starWidth = rect.width;
    starHeight = rect.height;

    const count = Math.min(
      180,
      Math.max(50, Math.floor((starWidth * starHeight) / 8500))
    );

    stars = Array.from({ length: count }, () => ({
      x: Math.random() * starWidth,
      y: Math.random() * starHeight,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.25 + 0.04,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawStars(time = 0) {
    if (!starSetup) return;

    const { context } = starSetup;

    context.clearRect(0, 0, starWidth, starHeight);

    stars.forEach((star) => {
      const twinkle =
        0.55 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.35;

      context.beginPath();
      context.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle = `rgba(170, 225, 255, ${
        Math.max(0.1, star.alpha * twinkle)
      })`;

      context.fill();
    });

    requestAnimationFrame(drawStars);
  }

  if (starSetup) {
    createStars();
    requestAnimationFrame(drawStars);
  }

  // ------------------------------------------
  // 10. ORBITAL SOLAR SYSTEM ANIMATION
  // ------------------------------------------

  const orbitSetup = setupCanvas(orbitCanvas);
  let orbitWidth = 0;
  let orbitHeight = 0;

  function resizeOrbit() {
    if (!orbitSetup) return;

    orbitSetup.resize();

    const rect = orbitCanvas.getBoundingClientRect();
    orbitWidth = rect.width;
    orbitHeight = rect.height;
  }

  const planets = [
    { orbit: 35, radius: 2, speed: 1.6, color: "#9da9bd" },
    { orbit: 55, radius: 3, speed: 1.2, color: "#ffbf83" },
    { orbit: 77, radius: 4, speed: 0.95, color: "#4e9cff" },
    { orbit: 99, radius: 3, speed: 0.75, color: "#ff795f" },
    { orbit: 130, radius: 8, speed: 0.42, color: "#e9bd91" },
    { orbit: 160, radius: 7, speed: 0.32, color: "#e5d2a4" },
    { orbit: 190, radius: 5, speed: 0.24, color: "#87edff" }
  ];

  function drawOrbit(time = 0) {
    if (!orbitSetup) return;

    const { context } = orbitSetup;

    context.clearRect(0, 0, orbitWidth, orbitHeight);

    const cx = orbitWidth / 2;
    const cy = orbitHeight / 2;
    const scale = Math.min(1, orbitWidth / 440, orbitHeight / 440);

    context.save();
    context.translate(cx, cy);
    context.scale(scale, scale);

    // Orbit rings.
    planets.forEach((planet) => {
      context.beginPath();
      context.arc(0, 0, planet.orbit, 0, Math.PI * 2);
      context.strokeStyle = "rgba(94, 181, 255, 0.22)";
      context.lineWidth = 1;
      context.stroke();
    });

    // Sun glow.
    const glow = context.createRadialGradient(0, 0, 3, 0, 0, 32);

    glow.addColorStop(0, "rgba(255, 242, 165, 1)");
    glow.addColorStop(0.35, "rgba(255, 165, 60, 0.7)");
    glow.addColorStop(1, "rgba(255, 130, 35, 0)");

    context.beginPath();
    context.arc(0, 0, 32, 0, Math.PI * 2);
    context.fillStyle = glow;
    context.fill();

    context.beginPath();
    context.arc(0, 0, 12, 0, Math.PI * 2);
    context.fillStyle = "#ffe9a3";
    context.fill();

    // Planets move around the Sun.
    planets.forEach((planet, index) => {
      const angle =
        time * 0.00015 * planet.speed + index * 1.1;

      const x = Math.cos(angle) * planet.orbit;
      const y = Math.sin(angle) * planet.orbit;

      context.beginPath();
      context.arc(x, y, planet.radius, 0, Math.PI * 2);
      context.fillStyle = planet.color;
      context.fill();

      if (index === 5) {
        context.beginPath();
        context.ellipse(
          x,
          y,
          planet.radius * 1.8,
          planet.radius * 0.65,
          -0.35,
          0,
          Math.PI * 2
        );

        context.strokeStyle = "rgba(230, 220, 185, 0.8)";
        context.lineWidth = 1.5;
        context.stroke();
      }
    });

    context.restore();

    requestAnimationFrame(drawOrbit);
  }

  if (orbitSetup) {
    resizeOrbit();
    requestAnimationFrame(drawOrbit);
  }

  // ------------------------------------------
  // 11. RESPONSIVE CANVAS RESIZING
  // ------------------------------------------

  let resizeTimeout = null;

  window.addEventListener("resize", () => {
    if (resizeTimeout !== null) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(() => {
      if (starSetup) {
        starSetup.resize();
        createStars();
      }

      if (orbitSetup) {
        resizeOrbit();
      }

      if (bootSequence && !bootFinished && bootCanvas) {
        const bootSetup = setupCanvas(bootCanvas);

        if (bootSetup) {
          bootSetup.context.clearRect(
            0,
            0,
            bootCanvas.width,
            bootCanvas.height
          );
        }
      }
    }, 120);
  });

  // ------------------------------------------
  // 12. KEYBOARD SHORTCUTS
  // ------------------------------------------

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (mainNav) mainNav.classList.remove("open");

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "MENU ☰";
      }
    }
  });

  // ------------------------------------------
  // 13. INITIALIZE
  // ------------------------------------------

  showTab("solar");

  console.log(
    "%c SCIENCE OS 3000 ONLINE ",
    "background:#061426;color:#35e7ff;padding:8px;font-weight:bold;"
  );

});


/* ==========================================
   YEAR 3000 — SCIENCE OS PORTFOLIO
   Main JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Opening screen
  const opening = document.getElementById("opening");
  const enterButton = document.getElementById("enterButton");

  function closeOpening() {
    if (opening) {
      opening.classList.add("hidden");
    }
  }

  if (enterButton) {
    enterButton.addEventListener("click", closeOpening);
  }

  // Automatically hide the intro after 2.5 seconds
  if (opening) {
    window.setTimeout(closeOpening, 2500);
  }

  // Page navigation
  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll("[data-page]");

  function showPage(pageId) {
    const target = document.getElementById(pageId);

    if (!target || !target.classList.contains("page")) {
      console.warn("Portfolio page not found:", pageId);
      return;
    }

    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageId);
    });

    navButtons.forEach((button) => {
      const isActive = button.dataset.page === pageId;
      button.classList.toggle("active", isActive);

      if (button.tagName === "BUTTON") {
        button.setAttribute("aria-current", isActive ? "page" : "false");
      }
    });

    closeOpening();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      showPage(button.dataset.page);
    });
  });

  // Buttons that navigate to another page
  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.go);
    });
  });

  // Space Explorer tabs
  const explorerTabs = document.querySelectorAll("[data-explorer]");
  const explorerOutput = document.getElementById("explorerOutput");

  const explorerData = {
    planets: {
      title: "Planetary Systems",
      text: "Explore worlds orbiting stars, from rocky planets to giant gas planets."
    },
    stars: {
      title: "Stellar Evolution",
      text: "Stars form in clouds of gas and dust, evolve over time, and eventually change or die."
    },
    galaxies: {
      title: "Galaxies",
      text: "Galaxies contain stars, gas, dust, and dark matter, bound together by gravity."
    },
    blackholes: {
      title: "Black Holes",
      text: "Black holes have such strong gravity that nothing can escape from within their event horizon."
    },
    nebulae: {
      title: "Nebulae",
      text: "Nebulae are vast clouds of gas and dust where stars can form or stellar material can spread."
    },
    missions: {
      title: "Space Missions",
      text: "Space missions use spacecraft, instruments, and scientific observations to explore the universe."
    }
  };

  explorerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const topic = tab.dataset.explorer;
      const item = explorerData[topic];

      if (!item || !explorerOutput) return;

      explorerTabs.forEach((otherTab) => {
        otherTab.classList.toggle("active", otherTab === tab);
      });

      explorerOutput.innerHTML = `
        <article class="card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `;
    });
  });

  // Deep Space mode
  const deepSpaceButton = document.getElementById("deepSpaceToggle");

  if (deepSpaceButton) {
    deepSpaceButton.addEventListener("click", () => {
      document.body.classList.toggle("deep-space");
      const enabled = document.body.classList.contains("deep-space");

      deepSpaceButton.setAttribute("aria-pressed", String(enabled));
      deepSpaceButton.textContent = enabled
        ? "Exit Deep Space"
        : "Enter Deep Space";
    });
  }

  // Contact form demo
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const status = document.getElementById("formStatus");

      if (status) {
        status.textContent =
          "This is a demo form. It does not send messages yet.";
      }
    });
  }

  // Set the initial page
  const initialPage = document.querySelector(".page.active");
  if (!initialPage && document.getElementById("home")) {
    showPage("home");
  }

  console.log("Science OS Portfolio initialized successfully.");
});

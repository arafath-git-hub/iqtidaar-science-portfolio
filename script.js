const bootSequenceEl = document.getElementById("bootSequence");
const mainContent = document.getElementById("mainContent");
const bootBar = document.getElementById("bootBar");
const bootStatus = document.getElementById("bootStatus");
const skipBootBtn = document.getElementById("skipBootBtn");
const navLinks = document.querySelectorAll(".nav-link");
const panels = document.querySelectorAll(".panel");
const tabBtns = document.querySelectorAll(".tab-btn");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const deepSpaceToggle = document.getElementById("deepSpaceToggle");
const contactForm = document.getElementById("contactForm");

const bootMessages = [
  "INITIALIZING SYSTEMS...",
  "LOADING SCIENCE DATABASE...",
  "SYNCING ASTRO MODULES...",
  "CALIBRATING CREATIVITY ENGINE...",
  "READY FOR DEPLOYMENT..."
];

function runBootSequence() {
  let step = 0;
  let progress = 0;

  const interval = setInterval(() => {
    progress += 20;
    bootBar.style.width = progress + "%";

    if (step < bootMessages.length) {
      bootStatus.textContent = bootMessages[step];
      step++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        bootSequenceEl.classList.add("hidden");
        mainContent.classList.remove("hidden");
      }, 400);
    }
  }, 420);
}

skipBootBtn.addEventListener("click", () => {
  bootSequenceEl.classList.add("hidden");
  mainContent.classList.remove("hidden");
});

runBootSequence();

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.target;
    navLinks.forEach((item) => item.classList.toggle("active", item === link));
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === target);
    });

    if (window.innerWidth <= 720) {
      mainNav.classList.remove("open");
    }
  });
});

document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.dataset.scroll;
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

tabBtns.forEach((button) => {
  button.addEventListener("click", () => {
    tabBtns.forEach((btn) => btn.classList.toggle("active", btn === button));
    const tab = button.dataset.tab;
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("active", content.id === tab);
    });
  });
});

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  const originalText = button.textContent;
  button.textContent = "MESSAGE QUEUED";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    contactForm.reset();
  }, 1500);
});

deepSpaceToggle.addEventListener("click", () => {
  document.body.classList.toggle("deep-space");
  const active = document.body.classList.contains("deep-space");
  document.body.style.background =
    active
      ? "radial-gradient(circle at top, rgba(54, 80, 180, 0.4), transparent 30%), radial-gradient(circle at bottom, rgba(124, 58, 237, 0.35), transparent 35%), linear-gradient(180deg, #010611 0%, #090d22 40%, #040a17 100%)"
      : "";
  deepSpaceToggle.textContent = active ? "NORMAL MODE" : "DEEP SPACE MODE";
});

function createStars(canvas, count = 120) {
  const ctx = canvas.getContext("2d");
  const stars = [];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.7 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      star.y += star.speed;
      if (star.y > canvas.clientHeight) {
        star.y = 0;
        star.x = Math.random() * canvas.clientWidth;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  resize();
  animate();

  window.addEventListener("resize", resize);
}

function createOrbitCanvas() {
  const canvas = document.getElementById("orbitCanvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  const centerX = () => canvas.clientWidth / 2;
  const centerY = () => canvas.clientHeight / 2;

  function draw(time) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const cx = centerX();
    const cy = centerY();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(102,228,255,0.18)";
    ctx.lineWidth = 1;
    ctx.arc(cx, cy, 138, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(156,107,255,0.18)";
    ctx.lineWidth = 1;
    ctx.arc(cx, cy, 196, 0, Math.PI * 2);
    ctx.stroke();

    const orbit1Angle = time * 0.00035;
    const orbit2Angle = time * 0.00018;

    const p1 = {
      x: cx + Math.cos(orbit1Angle) * 138,
      y: cy + Math.sin(orbit1Angle) * 138
    };

    const p2 = {
      x: cx + Math.cos(orbit2Angle + Math.PI / 2) * 196,
      y: cy + Math.sin(orbit2Angle + Math.PI / 2) * 196
    };

    ctx.beginPath();
    ctx.fillStyle = "#66e4ff";
    ctx.arc(p1.x, p1.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#9c6bff";
    ctx.arc(p2.x, p2.y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#dfefff";
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
}

function createSkillsCanvas() {
  const canvas = document.getElementById("skillsCanvas");
  const ctx = canvas.getContext("2d");
  const nodes = [
    { x: 0.18, y: 0.7, label: "CANVA" },
    { x: 0.35, y: 0.22, label: "EXCEL" },
    { x: 0.58, y: 0.38, label: "DESIGN" },
    { x: 0.8, y: 0.7, label: "ASTRO" },
    { x: 0.5, y: 0.8, label: "DATA" }
  ];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(time) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        ctx.beginPath();
        ctx.strokeStyle = "rgba(102,228,255,0.18)";
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }
    }

    nodes.forEach((node, idx) => {
      const x = node.x * width;
      const y = node.y * height;

      const glow = 0.5 + Math.sin(time * 0.002 + idx) * 0.35;
      ctx.beginPath();
      ctx.fillStyle = `rgba(102,228,255,${0.4 + glow})`;
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#eaf9ff";
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#d9f5ff";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, x, y - 20);
    });

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
}

function createConstellationCanvas() {
  const canvas = document.getElementById("constellationCanvas");
  const ctx = canvas.getContext("2d");
  const points = [
    { x: 0.12, y: 0.7 },
    { x: 0.25, y: 0.42 },
    { x: 0.35, y: 0.78 },
    { x: 0.48, y: 0.35 },
    { x: 0.62, y: 0.6 },
    { x: 0.77, y: 0.4 },
    { x: 0.88, y: 0.72 }
  ];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        ctx.beginPath();
        ctx.strokeStyle = "rgba(102,228,255,0.22)";
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }
    }

    points.forEach((point) => {
      const x = point.x * width;
      const y = point.y * height;
      ctx.beginPath();
      ctx.fillStyle = "#66e4ff";
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

function createBootCanvas() {
  const canvas = document.getElementById("bootCanvas");
  const ctx = canvas.getContext("2d");
  const particles = [];

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.y += 0.5;
      if (p.y > canvas.clientHeight) {
        p.y = 0;
        p.x = Math.random() * canvas.clientWidth;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);
}

createBootCanvas();
createStars(document.getElementById("starsCanvas"), 150);
createOrbitCanvas();
createSkillsCanvas();
createConstellationCanvas();

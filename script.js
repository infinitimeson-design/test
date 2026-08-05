/* ========== FX MODE ========== */
const FX = {
  mode: "full",
  viewportTier: "desktop",
  matrix: true,
  particles: true,
  particleCount: 40,
  matrixFps: 18,
  linkRadius: 120,
  particleLinks: true,
  pageVisible: true,
  reducedMotion: false,
};

const TIER_FX = {
  desktop: { matrix: true, particles: true, particleCount: 40, matrixFps: 18, particleLinks: true },
  laptop: { matrix: true, particles: true, particleCount: 30, matrixFps: 16, particleLinks: true },
  tablet: { matrix: true, particles: true, particleCount: 18, matrixFps: 15, particleLinks: true },
  mobile: { matrix: true, particles: true, particleCount: 12, matrixFps: 12, particleLinks: false },
  compact: { matrix: false, particles: true, particleCount: 8, matrixFps: 0, particleLinks: false },
};

const canvasRuntimes = {
  matrix: null,
  particles: null,
};

function detectViewportTier() {
  const width = window.innerWidth;
  if (width >= 1200) return "desktop";
  if (width >= 992) return "laptop";
  if (width >= 768) return "tablet";
  if (width > 420) return "mobile";
  return "compact";
}

function applyViewportTier(tier) {
  FX.viewportTier = tier;
  document.body.classList.remove("vp-desktop", "vp-laptop", "vp-tablet", "vp-mobile", "vp-compact");
  document.body.classList.add(`vp-${tier}`);
}

function detectFxMode() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "minimal";
  const tier = FX.viewportTier || detectViewportTier();
  if (tier === "compact") return "minimal";
  if (tier === "mobile") return "lite";
  if (tier === "tablet" || tier === "laptop") return "lite";
  return "full";
}

function applyTierSettings(tier) {
  const settings = TIER_FX[tier] || TIER_FX.desktop;
  FX.matrix = settings.matrix;
  FX.particles = settings.particles;
  FX.particleCount = settings.particleCount;
  FX.matrixFps = settings.matrixFps;
  FX.particleLinks = settings.particleLinks;
}

function applyFxMode(mode) {
  FX.mode = mode;
  FX.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tier = FX.viewportTier || detectViewportTier();

  if (mode === "minimal") {
    FX.matrix = false;
    FX.particles = false;
    FX.particleCount = 0;
    FX.matrixFps = 0;
    FX.particleLinks = false;
  } else {
    applyTierSettings(tier);
  }

  document.body.classList.remove("fx-full", "fx-lite", "fx-minimal");
  document.body.classList.add(`fx-${mode}`);

  canvasRuntimes.matrix?.syncMode();
  canvasRuntimes.particles?.syncMode();
}

function syncResponsiveState() {
  applyViewportTier(detectViewportTier());
  applyFxMode(detectFxMode());
}

function setupFxLifecycle() {
  syncResponsiveState();

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
    syncResponsiveState();
  });

  document.addEventListener("visibilitychange", () => {
    FX.pageVisible = !document.hidden;
    if (FX.pageVisible) {
      canvasRuntimes.matrix?.start();
      canvasRuntimes.particles?.start();
    } else {
      canvasRuntimes.matrix?.stop();
      canvasRuntimes.particles?.stop();
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => syncResponsiveState(), 200);
  });
}

function shouldReduceMotion() {
  return FX.reducedMotion || FX.mode === "minimal";
}

document.addEventListener("DOMContentLoaded", () => {
  setupFxLifecycle();
  canvasRuntimes.matrix = setupMatrixCanvas();
  canvasRuntimes.particles = setupParticlesCanvas();
  setupSidebar();
  setupTyping();
  setupLineNumbers();
  setupNavigation();
  setupRevealAnimations();
  setupCounters();
  setupSkillBars();
  setupCursor();
  setupContactForm();
});

function setupTyping() {
  const items = [
    { selector: "#typing-name", text: "Full Stack Developer" },
    { selector: "#typing-role", text: "Senior Software Engineer" },
    { selector: "#typing-passion", text: "Building scalable web apps" },
  ];

  if (shouldReduceMotion()) {
    items.forEach((item) => {
      const element = document.querySelector(item.selector);
      if (element) element.textContent = item.text;
    });
    return;
  }

  let delay = 300;
  items.forEach((item) => {
    const element = document.querySelector(item.selector);
    if (!element) return;

    window.setTimeout(() => typeText(element, item.text), delay);
    delay += item.text.length * 55 + 450;
  });
}

function typeText(element, text, index = 0) {
  if (index > text.length) return;

  element.textContent = text.slice(0, index);
  window.setTimeout(() => typeText(element, text, index + 1), 55);
}

function setupLineNumbers() {
  const lineNumberContainer = document.querySelector("#about-lines");
  const codeBlock = document.querySelector(".code-content code");
  if (!lineNumberContainer || !codeBlock) return;

  const lineCount = codeBlock.textContent.split("\n").length;
  lineNumberContainer.textContent = Array.from(
    { length: lineCount },
    (_, index) => index + 1,
  ).join("\n");
}

function setupMatrixCanvas() {
  const canvas = document.querySelector("#matrix-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return null;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@";
  const fontSize = 14;
  let columns = 0;
  let drops = [];
  let animationId = null;
  let lastFrame = 0;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * canvas.height);
  };

  const draw = () => {
    context.fillStyle = "rgba(10, 10, 10, 0.08)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#00ff41";
    context.font = `${fontSize}px Fira Code, monospace`;

    drops.forEach((drop, index) => {
      const character = characters[Math.floor(Math.random() * characters.length)];
      context.fillText(character, index * fontSize, drop * fontSize);

      if (drop * fontSize > canvas.height && Math.random() > 0.975) {
        drops[index] = 0;
      } else {
        drops[index] += 1;
      }
    });
  };

  const loop = (timestamp) => {
    if (!FX.matrix || !FX.pageVisible) {
      animationId = null;
      return;
    }

    const frameInterval = FX.matrixFps > 0 ? 1000 / FX.matrixFps : Infinity;
    if (timestamp - lastFrame >= frameInterval) {
      lastFrame = timestamp;
      draw();
    }

    animationId = window.requestAnimationFrame(loop);
  };

  const start = () => {
    if (!FX.matrix || !FX.pageVisible || animationId !== null) return;
    lastFrame = 0;
    animationId = window.requestAnimationFrame(loop);
  };

  const stop = () => {
    if (animationId !== null) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const syncMode = () => {
    stop();
    if (FX.matrix) start();
  };

  resize();
  window.addEventListener("resize", resize);
  start();

  return { start, stop, syncMode };
}

function setupParticlesCanvas() {
  const canvas = document.querySelector("#particles-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return null;

  const context = canvas.getContext("2d");
  if (!context) return null;

  let particles = [];
  let animationId = null;
  let mouseX = 0;
  let mouseY = 0;
  let mouseKnown = false;
  const mouseRadius = 150;

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      mouseKnown = true;
    },
    { passive: true },
  );

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = FX.particleCount;

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
    }));
  };

  const drawLinks = () => {
    if (!mouseKnown || !FX.particleLinks) return;

    const nearMouse = particles.filter(
      (particle) => Math.hypot(particle.x - mouseX, particle.y - mouseY) < mouseRadius,
    );

    for (let index = 0; index < nearMouse.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < nearMouse.length; nextIndex += 1) {
        const a = nearMouse[index];
        const b = nearMouse[nextIndex];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < FX.linkRadius) {
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(0, 212, 255, ${1 - distance / FX.linkRadius})`;
          context.lineWidth = 0.5;
          context.stroke();
        }
      }
    }
  };

  const draw = () => {
    if (!FX.particles || !FX.pageVisible) {
      animationId = null;
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(0, 212, 255, 0.55)";
      context.fill();
    });

    drawLinks();
    animationId = window.requestAnimationFrame(draw);
  };

  const start = () => {
    if (!FX.particles || !FX.pageVisible || animationId !== null) return;
    animationId = window.requestAnimationFrame(draw);
  };

  const stop = () => {
    if (animationId !== null) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const syncMode = () => {
    stop();
    resize();
    if (FX.particles) start();
  };

  resize();
  window.addEventListener("resize", resize);
  start();

  return { start, stop, syncMode };
}

function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");
  if (!sidebar || !toggle || !overlay) return;

  const isDrawerMode = () => {
    const tier = FX.viewportTier || detectViewportTier();
    return tier === "mobile" || tier === "compact";
  };

  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    overlay.setAttribute("aria-hidden", "true");
  };

  const openSidebar = () => {
    if (!isDrawerMode()) return;
    sidebar.scrollTop = 0;
    const nav = sidebar.querySelector(".sidebar-nav");
    if (nav) nav.scrollTop = 0;
    document.body.classList.add("sidebar-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    overlay.setAttribute("aria-hidden", "false");
  };

  toggle.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });

  window.addEventListener("resize", () => {
    if (!isDrawerMode()) closeSidebar();
  });
}

function setupNavigation() {
  const links = Array.from(document.querySelectorAll(".sidebar-link"));
  const toggle = document.getElementById("sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");
  const sectionIds = ["hero", "about", "skills", "projects", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    }
    if (overlay) overlay.setAttribute("aria-hidden", "true");
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href") || "");
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeSidebar();
    });
  });

  const updateActiveLink = () => {
    let current = null;

    for (let index = sections.length - 1; index >= 0; index -= 1) {
      if (sections[index].getBoundingClientRect().top <= 120) {
        current = sections[index];
        break;
      }
    }

    if (!current) return;

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(
    ".section-header, .terminal-window, .about-stats, .skill-category, .project-card, .contact-terminal, .contact-info",
  );

  elements.forEach((element) => element.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elements.forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.getAttribute("data-target") || "0");
        animateCounter(element, target);
        observer.unobserve(element);
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element, target) {
  if (shouldReduceMotion()) {
    element.textContent = String(target);
    return;
  }

  let current = 0;
  const step = Math.max(1, Math.ceil(target / 80));

  const tick = () => {
    current = Math.min(target, current + step);
    element.textContent = String(current);

    if (current < target) {
      window.requestAnimationFrame(tick);
    }
  };

  tick();
}

function setupSkillBars() {
  const skills = document.querySelectorAll(".skill-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 },
  );

  skills.forEach((skill) => observer.observe(skill));
}

function setupCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".cursor-follower");
  if (!cursor || !follower) return;

  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate(${event.clientX - 6}px, ${event.clientY - 6}px)`;
    follower.style.transform = `translate(${event.clientX - 15}px, ${event.clientY - 15}px)`;
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const response = document.querySelector("#form-response");
  if (!(form instanceof HTMLFormElement) || !response) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = getInputValue("#name");
    const email = getInputValue("#email");
    const subject = getInputValue("#subject");
    const message = getInputValue("#message");

    if (!name || !email || !subject || !message) {
      showFormResponse(response, "Please fill out every field.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormResponse(response, "Please enter a valid email address.");
      return;
    }

    showFormResponse(response, "Message prepared successfully. Connect a backend endpoint to send it.");
    form.reset();
  });
}

function sanitizeInput(value) {
  return value.replace(/[<>]/g, "").trim();
}

function getInputValue(selector) {
  const field = document.querySelector(selector);
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
    ? sanitizeInput(field.value)
    : "";
}

function showFormResponse(element, message) {
  element.textContent = message;
  element.classList.add("show");
}

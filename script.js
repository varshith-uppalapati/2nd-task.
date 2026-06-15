const root = document.documentElement;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const cursorLight = document.querySelector(".cursor-light");
const revealEls = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const typingText = document.querySelector("#typing-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (!prefersReducedMotion && cursorLight) {
  window.addEventListener("pointermove", (event) => {
    cursorLight.animate(
      {
        transform: `translate3d(${event.clientX - 210}px, ${event.clientY - 210}px, 0)`,
      },
      { duration: 450, fill: "forwards", easing: "ease-out" },
    );
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("skill-card")) {
        const progress = entry.target.querySelector(".progress span");
        progress.style.width = `${entry.target.dataset.progress}%`;
      }

      if (entry.target.classList.contains("stat-card")) {
        animateCounter(entry.target.querySelector("[data-count]"));
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
);

revealEls.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  revealObserver.observe(el);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.45 },
);

sections.forEach((section) => sectionObserver.observe(section));

function animateCounter(counter) {
  if (!counter || counter.dataset.done) return;
  counter.dataset.done = "true";

  const target = Number(counter.dataset.count);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toLocaleString();

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

if (typingText && !prefersReducedMotion) {
  const lines = [
    "Designing cinematic interfaces with code, motion, and story.",
    "Turning portfolios into premium launch experiences.",
    "Building responsive web moments that recruiters remember.",
  ];
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const line = lines[lineIndex];
    typingText.textContent = line.slice(0, charIndex);

    if (!deleting && charIndex < line.length) {
      charIndex += 1;
      setTimeout(type, 42);
      return;
    }

    if (!deleting && charIndex === line.length) {
      deleting = true;
      setTimeout(type, 1350);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 22);
      return;
    }

    deleting = false;
    lineIndex = (lineIndex + 1) % lines.length;
    setTimeout(type, 360);
  };

  type();
} else if (typingText) {
  typingText.textContent = "Designing cinematic interfaces with code, motion, and story.";
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  if (prefersReducedMotion) return;

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll("[data-depth]").forEach((el) => {
  if (prefersReducedMotion) return;

  window.addEventListener("pointermove", (event) => {
    const depth = Number(el.dataset.depth);
    const x = (event.clientX / window.innerWidth - 0.5) * depth;
    const y = (event.clientY / window.innerHeight - 0.5) * depth;
    el.style.translate = `${x}px ${y}px`;
  });
});

const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project-card[data-category]");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const value = filter.dataset.filter;

    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");

    projects.forEach((project) => {
      project.classList.toggle("hidden", value !== "all" && project.dataset.category !== value);
    });
  });
});

const track = document.querySelector(".testimonial-track");
const dots = document.querySelectorAll(".carousel-dots button");
let testimonialIndex = 0;

function showTestimonial(index) {
  if (!track) return;
  testimonialIndex = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showTestimonial(index));
});

if (track && dots.length > 0 && !prefersReducedMotion) {
  setInterval(() => {
    showTestimonial((testimonialIndex + 1) % dots.length);
  }, 4400);
}

const canvas = document.querySelector("#particle-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = Math.floor(canvasWidth * dpr);
  canvas.height = Math.floor(canvasHeight * dpr);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(150, Math.floor((canvasWidth * canvasHeight) / 12000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 1.7 + 0.45,
    a: Math.random() * 0.58 + 0.16,
  }));
}

function drawParticles() {
  if (!ctx || prefersReducedMotion) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvasWidth) p.vx *= -1;
    if (p.y < 0 || p.y > canvasHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${p.a})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 112) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(123, 97, 255, ${(1 - dist / 112) * 0.16})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
drawParticles();

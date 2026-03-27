/* ============================================================
   KREDAL FINCORP — Premium Fintech Landing Page Script
   ============================================================ */

'use strict';

// ============================================================
// STARSCAPE
// ============================================================
(function initStarscape() {
  const canvas = document.getElementById('starscape');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H, stars = [];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 9000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.15,
        da:    (Math.random() - 0.5) * 0.006,
        dx:    (Math.random() - 0.5) * 0.08,
        dy:    (Math.random() - 0.5) * 0.04,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.alpha += s.da;
      if (s.alpha <= 0.05 || s.alpha >= 0.7) s.da *= -1;
      s.x = (s.x + s.dx + W) % W;
      s.y = (s.y + s.dy + H) % H;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.alpha.toFixed(3)})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);
  tick();
})();

// ============================================================
// SCROLL PROGRESS BAR + NAVBAR
// ============================================================
(function initScrollUI() {
  const bar    = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  if (!bar && !navbar) return;

  function onScroll() {
    const scrolled = window.scrollY;
    const docH     = document.documentElement.scrollHeight - window.innerHeight;

    if (bar) bar.style.width = (docH > 0 ? (scrolled / docH) * 100 : 0) + '%';
    if (navbar) {
      if (scrolled > 40) navbar.classList.add('nav-scrolled');
      else               navbar.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// MOBILE MENU TOGGLE
// ============================================================
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMobile');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

// ============================================================
// REVEAL ON SCROLL (IntersectionObserver)
// ============================================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Stagger siblings within same parent
      const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
      const idx = siblings.indexOf(el);
      const delay = idx >= 0 ? idx * 80 : 0;
      setTimeout(() => el.classList.add('in-view'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => io.observe(el));
})();

// ============================================================
// COUNT-UP ANIMATIONS (metrics)
// ============================================================
(function initCountUp() {
  const cards = document.querySelectorAll('.metric-num[data-target]');
  if (!cards.length) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(t);
      const value = Math.round(target * eased);
      el.textContent = prefix + value + suffix;
      if (t < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  cards.forEach(el => io.observe(el));
})();

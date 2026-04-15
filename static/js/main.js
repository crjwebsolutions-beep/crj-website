// ── Cursor glow ───────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursorGlow');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// ── Navbar scroll effect ───────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Hamburger menu ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ── Contact form submit ────────────────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    const data = {};
    new FormData(form).forEach((val, key) => data[key] = val);
    try {
      const res = await fetch('/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        btn.textContent = '✓ Message Sent! I\'ll be in touch within 24 hours.';
        btn.style.background = '#00cc66';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 5000);
      } else { throw new Error(); }
    } catch {
      btn.textContent = 'Error — Please Try Again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  });
}

// ── Network canvas animation ───────────────────────────────────────────────────
const canvas = document.getElementById('networkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;
  const NODE_COUNT = 60;
  const CONNECT_DIST = 130;
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
  }
  function drawNetwork() {
    if (document.hidden) { animId = requestAnimationFrame(drawNetwork); return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x-nodes[j].x, dy = nodes[i].y-nodes[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,170,255,${0.18*(1-d/CONNECT_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.8, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,170,255,0.7)';
      ctx.fill();
    });
    animId = requestAnimationFrame(drawNetwork);
  }
  drawNetwork();
}

// ── Scroll-in animations ───────────────────────────────────────────────────────
const fadeStyle = document.createElement('style');
fadeStyle.textContent = '.anim-in { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(fadeStyle);
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-in'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.srv-card, .pc, .port-card, .pillar, .step-block, .faq-item, .why-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});

// ========== NAV SCROLL BEHAVIOR ==========
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ========== MOBILE NAV TOGGLE ==========
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  const closeMenu = () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when a link is tapped
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu if user resizes back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// ========== GENERIC REVEAL OBSERVER ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .service-card, .timeline-item, .project-card, .stat')
  .forEach(el => revealObserver.observe(el));

// ========== STICKY TEXT REVEAL (Apple-style) ==========
const aboutSection = document.querySelector('.about');
const aboutWords = document.querySelectorAll('#aboutText span[data-reveal]');

// Initialize: dim every word
aboutWords.forEach(w => {
  w.style.color = 'rgba(245, 245, 247, 0.15)';
});

function updateAboutScroll() {
  if (!aboutSection) return;
  const rect = aboutSection.getBoundingClientRect();
  const sectionHeight = aboutSection.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  let progress = scrolled / sectionHeight;
  progress = Math.max(0, Math.min(1, progress));

  const totalWords = aboutWords.length;
  const wordsToReveal = Math.floor(progress * totalWords * 1.15);

  aboutWords.forEach((word, i) => {
    if (i < wordsToReveal) {
      word.style.color = 'rgba(245, 245, 247, 1)';
    } else if (i === wordsToReveal) {
      word.style.color = 'rgba(245, 245, 247, 0.6)';
    } else {
      word.style.color = 'rgba(245, 245, 247, 0.15)';
    }
  });
}

window.addEventListener('scroll', updateAboutScroll);
updateAboutScroll();

// ========== PARALLAX ORBS IN HERO ==========
const orbs = document.querySelectorAll('.orb');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = i === 0 ? 0.3 : 0.5;
    orb.style.transform = `translateY(${y * speed}px)`;
  });
});

// ========== SMOOTH SCROLL FOR NAV LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== ANIMATED COUNTERS ==========
const animateCount = (el, target) => {
  const duration = 1500;
  const start = performance.now();
  const isPercent = target.includes('%');
  const isPlus = target.includes('+');
  const isM = target.includes('M');
  const numTarget = parseFloat(target);

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = numTarget * eased;
    let display;
    if (isM) display = current.toFixed(0) + 'M';
    else if (isPercent) display = current.toFixed(0) + '%';
    else display = current.toFixed(0);
    if (isPlus) display += '+';
    el.textContent = display;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target.querySelector('.stat-number');
      if (el && !el.dataset.animated) {
        el.dataset.animated = 'true';
        const target = el.textContent;
        animateCount(el, target);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));

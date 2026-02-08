/* ========================================
   Mobile Navigation Toggle
   ======================================== */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ========================================
   Password Protection (SHA-256)
   ======================================== */
// SHA-256 hash of "portfolio2024"
const VALID_HASH = 'e191cdbf5bb9d55705f93723ddb61646823e72c051db47ead5dbf7446b1d0297';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function initPasswordProtection() {
  const overlay = document.getElementById('password-overlay');
  if (!overlay) return;

  const input = document.getElementById('password-input');
  const btn = document.getElementById('password-submit');
  const error = document.getElementById('password-error');

  // Check sessionStorage
  if (sessionStorage.getItem('portfolio_auth') === 'true') {
    overlay.classList.add('hidden');
    return;
  }

  async function checkPassword() {
    const password = input.value.trim();
    if (!password) {
      error.textContent = 'Please enter a password.';
      return;
    }

    const hash = await sha256(password);

    if (hash === VALID_HASH) {
      sessionStorage.setItem('portfolio_auth', 'true');
      overlay.classList.add('hidden');
      error.textContent = '';
    } else {
      error.textContent = 'Incorrect password. Please try again.';
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', checkPassword);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword();
  });

  input.focus();
}

/* ========================================
   Project Card Expand/Collapse
   ======================================== */
function initProjectToggle() {
  document.querySelectorAll('.project-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.previousElementSibling;
      if (!details) return;

      const isExpanded = details.classList.contains('expanded');
      details.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'View Details →' : 'Hide Details ↑';
    });
  });
}

/* ========================================
   Init
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollAnimations();
  initPasswordProtection();
  initProjectToggle();
});

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
const header = document.querySelector('.site-header');
let lastScrollY = window.scrollY;
const HIDE_OFFSET = 18;
const SHOW_OFFSET = 1;

const updateHeaderState = () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 24 || nav?.classList.contains('open') || header?.contains(document.activeElement)) {
    header?.classList.remove('is-hidden');
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY + HIDE_OFFSET) {
    header?.classList.add('is-hidden');
  } else if (currentScrollY < lastScrollY - SHOW_OFFSET) {
    header?.classList.remove('is-hidden');
  }

  lastScrollY = currentScrollY;
};

window.addEventListener('scroll', updateHeaderState, { passive: true });

const setMenuOpen = open => {
  nav?.classList.toggle('open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  if (open) header?.classList.remove('is-hidden');
};
menuButton?.addEventListener('click', () => {
  setMenuOpen(!nav?.classList.contains('open'));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  setMenuOpen(false);
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    setMenuOpen(false);
    menuButton?.focus();
  }
});
document.addEventListener('click', event => {
  if (!header?.contains(event.target)) setMenuOpen(false);
});
window.matchMedia('(max-width:760px)').addEventListener('change', () => setMenuOpen(false));

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  reveals.forEach(el => {
    el.classList.add('reveal-pending');
    revealObserver.observe(el);
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('#primary-nav a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const glow = document.querySelector('.cursor-glow');
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('pointermove', event => {
  if (glow) {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }

  if (!heroVisual) return;
  const rect = heroVisual.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
  const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
  heroVisual.style.setProperty('--move-x', `${offsetX}px`);
  heroVisual.style.setProperty('--move-y', `${offsetY}px`);
}, { passive: true });

window.addEventListener('pointerleave', () => {
  if (!heroVisual) return;
  heroVisual.style.setProperty('--move-x', '0px');
  heroVisual.style.setProperty('--move-y', '0px');
});

document.querySelector('#year').textContent = new Date().getFullYear();

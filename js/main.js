'use strict';

/* =====================================================
   Divadlo Vitus — hlavní JavaScript
   - Mobilní menu (hamburger)
   - Zvýraznění aktivní sekce v navigaci
   - Lightbox pro fotogalerii a plakáty
   ===================================================== */

// ─── KONFIGURACE ─────────────────────────────────────────────────────────────

const CONFIG = {
  comingSoon: false, // true = zobrazit pouze hero + „Stránky se připravují..."
};

if (CONFIG.comingSoon) {
  document.body.classList.add('coming-soon');
}

// ─── MOBILNÍ MENU ────────────────────────────────────────────────────────────

const siteHeader = document.getElementById('site-header');
const navToggle  = document.querySelector('.nav-toggle');
const navMenu    = document.querySelector('.nav-menu');

function setMenuOpen(isOpen) {
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Zavřít menu' : 'Otevřít menu');
  navToggle.classList.toggle('is-open', isOpen);
  navMenu.classList.toggle('is-open', isOpen);
}

navToggle.addEventListener('click', () => {
  setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    navToggle.focus();
  }
});

document.addEventListener('click', e => {
  if (!siteHeader.contains(e.target)) setMenuOpen(false);
});

window.matchMedia('(max-width: 768px)').addEventListener('change', () => setMenuOpen(false));

// ─── SCROLL — stav headeru a aktivní odkaz ───────────────────────────────────

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.remove('active'));
    const active = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, {
  // Označit sekci jako aktivní, když její horní třetina překryje střed viewportu
  rootMargin: '-15% 0px -60% 0px',
});

sections.forEach(s => sectionObserver.observe(s));

// ─── ROK V PATIČCE ───────────────────────────────────────────────────────────

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = lightbox.querySelector('.lightbox-img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev  = lightbox.querySelector('.lightbox-prev');
const lightboxNext  = lightbox.querySelector('.lightbox-next');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const imageTriggers = Array.from(document.querySelectorAll('[data-lightbox-group]'));
const pageRegions = document.querySelectorAll('body > header, body > main, body > footer, body > .skip-link');

let currentImages = [];
let currentIndex = 0;
let lightboxOpener = null;
let previousOverflow = '';

function showImage(index) {
  currentIndex = (index + currentImages.length) % currentImages.length;
  const img = currentImages[currentIndex].querySelector('img');
  lightboxImg.src = img.dataset.full ?? img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = `${img.alt} · ${currentIndex + 1} / ${currentImages.length}`;
  const multiple = currentImages.length > 1;
  lightboxPrev.hidden = !multiple;
  lightboxNext.hidden = !multiple;
}

function openLightbox(trigger) {
  currentImages = imageTriggers.filter(item => item.dataset.lightboxGroup === trigger.dataset.lightboxGroup);
  lightboxOpener = trigger;
  previousOverflow = document.body.style.overflow;
  showImage(currentImages.indexOf(trigger));
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  pageRegions.forEach(region => { region.inert = true; });
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = previousOverflow;
  pageRegions.forEach(region => { region.inert = false; });
  lightboxOpener?.focus({ preventScroll: true });
}

imageTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  switch (e.key) {
    case 'Escape':
      e.preventDefault();
      closeLightbox();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      showImage(currentIndex - 1);
      break;
    case 'ArrowRight':
      e.preventDefault();
      showImage(currentIndex + 1);
      break;
    case 'Tab': {
      const buttons = Array.from(lightbox.querySelectorAll('button')).filter(button => !button.hidden);
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      break;
    }
  }
});

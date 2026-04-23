/* =========================================================
   Sangeeta Parakala — Portfolio interactions
   ========================================================= */

(function () {
  'use strict';

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const header = document.getElementById('siteHeader');
  const toggleHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  toggleHeader();
  window.addEventListener('scroll', toggleHeader, { passive: true });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Intersection Observer: reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Active nav link based on visible section
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
      navAnchors.forEach((a) => {
        const isActive = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', isActive);
      });
    };
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }
})();

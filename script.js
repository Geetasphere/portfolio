/* =========================================================
   Sangeeta Parakala — Portfolio interactions
   ========================================================= */

(function () {
  'use strict';

  // Set current year in footer
  const yr = new Date().getFullYear();
  document.querySelectorAll('#year, .year').forEach(el => el.textContent = yr);

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
      { rootMargin: '0px 0px -5% 0px', threshold: 0.01 }
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
  // Contact modal
  const backdrop   = document.getElementById('contactModal');
  const openBtn    = document.getElementById('openContactModal');
  const closeBtn   = document.getElementById('closeContactModal');
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('contactSubmit');
  const statusEl   = document.getElementById('contactStatus');

  function openModal() {
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    statusEl.textContent = '';
    statusEl.className = 'modal__status';
  }

  if (openBtn)  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) closeModal();
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.textContent = '';
      statusEl.className = 'modal__status';

      const data = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: '5bd8be9f-93e8-4657-b124-20ae5101bae7',
            subject: 'Portfolio Inquiry from ' + data.name,
            name: data.name,
            message: data.message,
          }),
        });

        const json = await res.json();
        if (json.success) {
          statusEl.textContent = 'Sent! I\'ll be in touch soon.';
          statusEl.classList.add('is-success');
          form.reset();
          setTimeout(closeModal, 2500);
        } else {
          throw new Error('failed');
        }
      } catch {
        statusEl.textContent = 'Something went wrong — try emailing sparakala@gmail.com directly.';
        statusEl.classList.add('is-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
    });
  }

  // Zoom lens: hover-driven magnifier for high-res figures
  const zoomFigures = document.querySelectorAll('.zoom-figure');
  zoomFigures.forEach(fig => {
    const img = fig.querySelector('.zoom-figure__img');
    const lens = fig.querySelector('.zoom-lens');
    if (!img || !lens) return;

    const hiResUrl = fig.dataset.hires || img.currentSrc || img.src;

    // State: hiW/hiH are the dimensions used for background-size.
    // Default to a 2x zoom of the display image until the hi-res loads.
    let hiW = 0, hiH = 0;

    const setBg = (url, w, h) => {
      lens.style.backgroundImage = `url("${url}")`;
      lens.style.backgroundSize = `${w}px ${h}px`;
      hiW = w;
      hiH = h;
    };

    const initFallback = () => {
      const dispW = img.clientWidth;
      const dispH = img.clientHeight;
      if (dispW && dispH) setBg(img.currentSrc || img.src, dispW * 2.5, dispH * 2.5);
    };

    if (img.complete && img.naturalWidth) {
      initFallback();
    } else {
      img.addEventListener('load', initFallback, { once: true });
    }

    // Preload hi-res and upgrade once available.
    const hi = new Image();
    hi.onload = () => setBg(hiResUrl, hi.naturalWidth, hi.naturalHeight);
    hi.src = hiResUrl;

    const move = (e) => {
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height || !hiW) {
        fig.classList.remove('is-active');
        return;
      }
      fig.classList.add('is-active');

      const lensW = lens.offsetWidth;
      const lensH = lens.offsetHeight;
      const figRect = fig.getBoundingClientRect();
      const lensLeft = e.clientX - figRect.left - lensW / 2;
      const lensTop = e.clientY - figRect.top - lensH / 2;
      lens.style.transform = `translate(${lensLeft}px, ${lensTop}px)`;

      const px = x / rect.width;
      const py = y / rect.height;
      const bgX = -(px * hiW - lensW / 2);
      const bgY = -(py * hiH - lensH / 2);
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    };

    fig.addEventListener('mousemove', move);
    fig.addEventListener('mouseenter', move);
    fig.addEventListener('mouseleave', () => fig.classList.remove('is-active'));
  });

})();

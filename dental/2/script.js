/* ═══════════════════════════════════════════════════
   BRITE SMILE DENTAL CARE — script.js
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navbar: scroll shadow + hamburger ── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  /* ────────────────────────────────────────
     Generic Carousel factory
     ──────────────────────────────────────── */
  function buildCarousel({ trackId, prevId, nextId, dotsId, itemSelector, perPage }) {
    const track   = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsWrap = document.getElementById(dotsId);

    if (!track) return;

    const items = Array.from(track.querySelectorAll(itemSelector));
    if (!items.length) return;

    let current = 0;

    // Responsive perPage
    function getPerPage() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return perPage;
    }

    function maxIndex() {
      return Math.max(0, items.length - getPerPage());
    }

    // Build dots
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const total = maxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 'dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', `Go to slide ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      dotsWrap?.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      const pp = getPerPage();
      // Calculate gap (24px) and item width
      const gap       = 24;
      const totalGap  = gap * (pp - 1);
      const itemWidth = (track.offsetWidth - totalGap) / pp;
      const offset    = current * (itemWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
      updateButtons();
    }

    function updateButtons() {
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current >= maxIndex();
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Auto-advance
    let autoInterval = setInterval(() => {
      if (current >= maxIndex()) goTo(0);
      else goTo(current + 1);
    }, 5000);

    track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoInterval));
    track.parentElement?.addEventListener('mouseleave', () => {
      autoInterval = setInterval(() => {
        if (current >= maxIndex()) goTo(0);
        else goTo(current + 1);
      }, 5000);
    });

    // Touch / swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    // Rebuild on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        current = Math.min(current, maxIndex());
        buildDots();
        goTo(current);
      }, 150);
    });

    buildDots();
    goTo(0);
  }

  // Team carousel
  buildCarousel({
    trackId:      'teamCarousel',
    prevId:       'teamPrev',
    nextId:       'teamNext',
    dotsId:       'teamDots',
    itemSelector: '.team-card',
    perPage:      3,
  });

  // Testimonials carousel
  buildCarousel({
    trackId:      'testimonialsTrack',
    prevId:       'testPrev',
    nextId:       'testNext',
    dotsId:       'testDots',
    itemSelector: '.testimonial-card',
    perPage:      3,
  });

  /* ────────────────────────────────────────
     Animated counter (IntersectionObserver)
     ──────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const steps    = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, duration / steps);
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const counters = statsSection.querySelectorAll('.stat-count');
    let animated = false;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        counters.forEach(c => animateCounter(c));
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  /* ────────────────────────────────────────
     Scroll-reveal (fade + slide up)
     ──────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.service-card, .team-card, .testimonial-card, .why-item, .about-features li, .stat-item'
  );

  // Set initial hidden state via JS (not CSS) so it degrades gracefully
  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .55s ease ${(i % 4) * 0.1}s, transform .55s ease ${(i % 4) * 0.1}s`;
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ────────────────────────────────────────
     Active nav link highlight on scroll
     ──────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          a.style.background = '';
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) {
          active.style.color = 'var(--blue-600)';
          active.style.background = 'var(--blue-50)';
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ────────────────────────────────────────
     Smooth scroll for anchor links
     ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

})();
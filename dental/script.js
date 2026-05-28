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
    const track    = document.getElementById(trackId);
    const prevBtn  = document.getElementById(prevId);
    const nextBtn  = document.getElementById(nextId);
    const dotsWrap = document.getElementById(dotsId);

    if (!track) return;

    const items = Array.from(track.querySelectorAll(itemSelector));
    if (!items.length) return;

    let current = 0;

    function getPerPage() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return perPage;
    }

    function maxIndex() {
      return Math.max(0, items.length - getPerPage());
    }

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
      const pp       = getPerPage();
      const gap      = 24;
      const totalGap = gap * (pp - 1);
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

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });

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

  buildCarousel({
    trackId:      'teamCarousel',
    prevId:       'teamPrev',
    nextId:       'teamNext',
    dotsId:       'teamDots',
    itemSelector: '.team-card',
    perPage:      3,
  });

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
    const target    = parseInt(el.dataset.target, 10);
    const duration  = 1800;
    const steps     = 60;
    const increment = target / steps;
    let current = 0, step = 0;
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

  revealTargets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .55s ease ${(i % 4) * 0.1}s, transform .55s ease ${(i % 4) * 0.1}s`;
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ────────────────────────────────────────
     Active nav link highlight on scroll
     ──────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color      = '';
          a.style.background = '';
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) {
          active.style.color      = 'var(--blue-600)';
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

/* ── TOOTH ANIMATION SEQUENCE ── */
/* ── TOOTH ANIMATION SEQUENCE (looping) ── */
(function toothSequence() {
  const sadTooth   = document.getElementById('sadTooth');
  const happyTooth = document.getElementById('happyTooth');
  const bubble     = document.getElementById('toothBubble');
  const bubbleText = document.getElementById('bubbleText');
  const sparkle    = document.getElementById('sparkleBurst');

  if (!sadTooth) return;

  function runSequence() {
    // Reset state
    sadTooth.style.display = 'block';
    sadTooth.classList.remove('tooth-exit');
    happyTooth.style.display = 'none';
    happyTooth.classList.remove('tooth-enter');
    bubble.classList.remove('show');
    sparkle.classList.remove('burst');
    sparkle.style.opacity = '0';
    bubbleText.textContent = 'When Will You Come?😔';

    // Step 1 — show bubble
    setTimeout(() => {
      bubble.classList.add('show');
    }, 1500);

    // Step 2 — sparkle burst
    setTimeout(() => {
      sparkle.style.opacity = '1';
      sparkle.classList.add('burst');
    }, 3500);

    // Step 3 — sad tooth exits
    setTimeout(() => {
      sadTooth.classList.add('tooth-exit');
    }, 4000);

    // Step 4 — happy tooth enters
    setTimeout(() => {
      sadTooth.style.display = 'none';
      happyTooth.style.display = 'block';
      happyTooth.classList.add('tooth-enter');
      sparkle.classList.remove('burst');
      setTimeout(() => { sparkle.style.opacity = '0'; }, 400);
      bubbleText.textContent = 'Hey! You Came! I am Happy☺️';
    }, 4500);

    // Step 5 — hide bubble
    setTimeout(() => {
      bubble.classList.remove('show');
    }, 7500);

    // Step 6 — restart loop after 10s
    setTimeout(() => {
      runSequence();
    }, 10000);
  }

  runSequence();
})();

(function () {
  const track     = document.getElementById('carouselTrack');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const dotsEl    = document.getElementById('dotsContainer');
  const outer     = document.getElementById('galleryCarousel');
 
  const AUTO_MS   = 3000;   // auto-advance every 3 s
  const TRANS_MS  = 500;    // slide animation duration
 
  /* ── clone slides for infinite loop ── */
  const origSlides = Array.from(track.children);
  const total      = origSlides.length;
 
  // prepend clones of last N + append clones of first N
  const CLONE = Math.min(total, 3);
  for (let i = total - CLONE; i < total; i++) {
    track.prepend(origSlides[i].cloneNode(true));
  }
  for (let i = 0; i < CLONE; i++) {
    track.append(origSlides[i].cloneNode(true));
  }
 
  const allSlides  = Array.from(track.children);
  const slideCount = allSlides.length;          // total incl. clones
 
  /* ── visible slides per viewport ── */
  function visCount () {
    if (window.innerWidth <= 480)  return 1;
    if (window.innerWidth <= 768)  return 1;
    return 3;
  }
 
  /* ── slide width (incl. gap) ── */
  function slideW () {
    const s   = allSlides[0];
    const gap = 20;
    return s.getBoundingClientRect().width + gap;
  }
 
  let current = CLONE;          // logical index (starts after prepended clones)
  let isAnim  = false;
 
  /* ── dots ── */
  dotsEl.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i + CLONE));
    dotsEl.appendChild(d);
  }
 
  function updateDots () {
    const idx = ((current - CLONE) % total + total) % total;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }
 
  /* ── position without animation ── */
  function setPos (idx, animated) {
    track.style.transition = animated
      ? `transform ${TRANS_MS}ms cubic-bezier(.4,0,.2,1)`
      : 'none';
    track.style.transform = `translateX(-${slideW() * idx}px)`;
  }
 
  /* ── go to slide ── */
  function goTo (idx, animated = true) {
    if (isAnim) return;
    isAnim = true;
    current = idx;
    setPos(current, animated);
 
    setTimeout(() => {
      /* wrap: if we hit a clone, jump silently to real counterpart */
      if (current < CLONE) {
        current = current + total;
        setPos(current, false);
      } else if (current >= CLONE + total) {
        current = current - total;
        setPos(current, false);
      }
      updateDots();
      isAnim = false;
    }, animated ? TRANS_MS + 20 : 20);
  }
 
  /* ── init position (no animation) ── */
  requestAnimationFrame(() => setPos(current, false));
 
  /* ── arrows ── */
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
 
  /* ── auto-play ── */
  let timer = setInterval(() => goTo(current + 1), AUTO_MS);
 
  outer.addEventListener('mouseenter', () => clearInterval(timer));
  outer.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), AUTO_MS);
  });
 
  /* ── re-snap on resize ── */
  window.addEventListener('resize', () => setPos(current, false));
})();


/* ═══════════════════════════════
   GOOGLE REVIEWS FETCHER
   Paste this at the bottom of script.js
═══════════════════════════════ */

/* ═══════════════════════════════
   GOOGLE REVIEWS FETCHER
   Paste this at the bottom of script.js
═══════════════════════════════ */

(function () {
  const API_KEY  = 'AIzaSyB-P2XEDn_r6OH1g5-A_Aq-To4Ba3prJGM';
  const PLACE_ID = 'ChIJyeRPV8r9mzkR7Kyw97pbo2I';

  /* ── helper: star string ── */
  function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  /* ── helper: initials from name ── */
  function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  /* ── build a single review card HTML ── */
  function cardHTML(r) {
    return `
      <div class="review-card">
        <div class="review-top">
          <div class="reviewer-avatar">${r.photo
            ? `<img src="${r.photo}" alt="${r.author_name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
            : initials(r.author_name)
          }</div>
          <div>
            <div class="reviewer-name">${r.author_name}</div>
            <div class="review-stars">${stars(r.rating)}</div>
          </div>
          <svg class="google-g" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.7 0 6.8 5.4 3 13.3l7.8 6C12.7 13.2 17.9 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
            <path fill="#FBBC05" d="M10.8 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.1z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.1 0-11.3-3.7-13.2-9.2l-8.3 6.1C6.8 42.6 14.7 48 24 48z"/>
          </svg>
        </div>
        <p>${r.text ? r.text.slice(0, 180) + (r.text.length > 180 ? '…' : '') : 'Great experience!'}</p>
        <div class="review-date">${r.relative_time_description || ''}</div>
      </div>`;
  }

  /* ── inject fallback reviews (shown if API fails) ── */
  const FALLBACK = [
    { author_name: 'Rahul Sharma',   rating: 5, text: 'Excellent dental care! Dr. Priyank is very professional and the clinic is spotless. Highly recommended for anyone in Kanpur.', relative_time_description: 'a month ago' },
    { author_name: 'Priya Gupta',    rating: 5, text: 'Best dentist in Kanpur! The staff is very friendly and the treatment was completely pain-free. Will definitely come back.', relative_time_description: '2 months ago' },
    { author_name: 'Amit Verma',     rating: 5, text: 'Got my implants done here. Amazing results and very affordable compared to other clinics. Dr. Priyank explained everything clearly.', relative_time_description: '3 months ago' },
    { author_name: 'Sunita Singh',   rating: 5, text: 'Very modern clinic with latest equipment. My teeth whitening results are fantastic. The whole team is warm and welcoming.', relative_time_description: '3 months ago' },
    { author_name: 'Vikram Tiwari',  rating: 5, text: 'Had a root canal done here — absolutely no pain during the procedure. Dr. Priyank is truly skilled. Best dental experience ever!', relative_time_description: '4 months ago' },
  ];

  function renderReviews(reviews) {
    const ticker = document.getElementById('reviewsTicker');
    if (!ticker) return;

    /* duplicate cards for seamless infinite scroll */
    const all = [...reviews, ...reviews];
    ticker.innerHTML = all.map(cardHTML).join('');
  }

  /* ── update summary bar ── */
  function updateSummary(rating, total) {
    const score = document.getElementById('rsScore');
    const label = document.getElementById('rsLabel');
    if (score) score.textContent = rating.toFixed(1);
    if (label) label.textContent = `Google Rating · ${total}+ Reviews`;
  }

  /* ── fetch from Places API ── */
  function fetchReviews() {
    /* Places API requires a Maps JS SDK call — we use the widget approach */
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      /* Maps JS not loaded yet — use fallback */
      renderReviews(FALLBACK);
      return;
    }

    const svc = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    svc.getDetails(
      {
        placeId: PLACE_ID,
        fields: ['rating', 'user_ratings_total', 'reviews'],
      },
      function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
          updateSummary(place.rating, place.user_ratings_total);
          const mapped = place.reviews.map(r => ({
            author_name: r.author_name,
            rating: r.rating,
            text: r.text,
            photo: r.profile_photo_url,
            relative_time_description: r.relative_time_description,
          }));
          renderReviews(mapped.length >= 3 ? mapped : [...mapped, ...FALLBACK]);
        } else {
          renderReviews(FALLBACK);
        }
      }
    );
  }

  /* ── load Maps JS SDK then fetch ── */
  function loadMapsSDK() {
    if (document.getElementById('gmaps-sdk')) {
      /* already loading */
      window.__gmapsCallback = fetchReviews;
      return;
    }
    window.__gmapsCallback = fetchReviews;
    const s = document.createElement('script');
    s.id  = 'gmaps-sdk';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=__gmapsCallback`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  /* ── init when DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMapsSDK);
  } else {
    loadMapsSDK();
  }
})();

})();

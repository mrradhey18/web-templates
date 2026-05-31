/* ═══════════════════════════════════════════
   MEETU UNISEX SALOON — SCRIPT.JS
   All animations, interactions, 3D effects
   Built by NexaFlow — nexaflow.bar
═══════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────
// 1. LOADER
// ─────────────────────────────────────────────
document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 800);
});

document.body.style.overflow = 'hidden';

// ─────────────────────────────────────────────
// 2. CUSTOM CURSOR
// ─────────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail with RAF
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor scale on hover over interactive elements
document.querySelectorAll('a, button, .service-card, .gallery-item, .team-card, .price-card, input, select').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '24px';
    cursor.style.height = '24px';
    cursorTrail.style.width  = '56px';
    cursorTrail.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    cursorTrail.style.width  = '36px';
    cursorTrail.style.height = '36px';
  });
});

// ─────────────────────────────────────────────
// 3. NAVBAR SCROLL BEHAVIOR
// ─────────────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ─────────────────────────────────────────────
// 4. MOBILE MENU
// ─────────────────────────────────────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = 'auto';
  });
});

// ─────────────────────────────────────────────
// 5. SMOOTH SCROLL FOR NAV LINKS
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────────
// 6. SCROLL REVEAL — INTERSECTION OBSERVER
// ─────────────────────────────────────────────
function initReveal() {
  // Add reveal class to all target elements
  const targets = [
    '.service-card',
    '.gallery-item',
    '.price-card',
    '.team-card',
    '.info-card',
    '.section-head',
    '.contact-form',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────
// 7. HERO ANIMATIONS (post-loader)
// ─────────────────────────────────────────────
function initHeroAnimations() {
  initReveal();
  initParallax();
  initServiceCardTilt();
  initTeamCardHover();
  initGalleryHover();
  initCounters();
}

// ─────────────────────────────────────────────
// 8. PARALLAX — ORB MOVEMENT ON MOUSE
// ─────────────────────────────────────────────
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  const hero = document.querySelector('.hero');

  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 15;
      orb.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    orbs.forEach(orb => {
      orb.style.transform = '';
    });
  });
}

// ─────────────────────────────────────────────
// 9. 3D CARD TILT — SERVICE CARDS
// ─────────────────────────────────────────────
function initServiceCardTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX = cy * -12;
      const rotY = cx * 12;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, border-color 0.4s ease, box-shadow 0.4s ease';
    });
  });
}

// ─────────────────────────────────────────────
// 10. TEAM CARD 3D HOVER
// ─────────────────────────────────────────────
function initTeamCardHover() {
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX = cy * -8;
      const rotY = cx * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ─────────────────────────────────────────────
// 11. GALLERY HOVER EFFECT
// ─────────────────────────────────────────────
function initGalleryHover() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Dim siblings
      document.querySelectorAll('.gallery-item').forEach(sibling => {
        if (sibling !== item) sibling.style.opacity = '0.5';
      });
    });

    item.addEventListener('mouseleave', () => {
      document.querySelectorAll('.gallery-item').forEach(sibling => {
        sibling.style.opacity = '1';
      });
    });
  });
}

// ─────────────────────────────────────────────
// 12. ANIMATED COUNTERS — HERO STATS
// ─────────────────────────────────────────────
function initCounters() {
  const counters = [
    { el: document.querySelector('.stat:nth-child(1) strong'), target: 2000, suffix: '+' },
    { el: document.querySelector('.stat:nth-child(3) strong'), target: 8, suffix: '+' },
    { el: document.querySelector('.stat:nth-child(5) strong'), target: 15, suffix: '+' },
  ];

  counters.forEach(({ el, target, suffix }) => {
    if (!el) return;
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, duration / steps);
  });
}

// ─────────────────────────────────────────────
// 13. SCISSOR 3D — MOUSE PARALLAX
// ─────────────────────────────────────────────
const scissor3d = document.getElementById('scissor3d');

if (scissor3d) {
  document.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 20;
    const cy = (e.clientY / window.innerHeight - 0.5) * 20;
    scissor3d.style.setProperty('--mouse-x', cx + 'deg');
    scissor3d.style.setProperty('--mouse-y', cy + 'deg');
  });
}

// ─────────────────────────────────────────────
// 14. MARQUEE SPEED — HOVER PAUSE
// ─────────────────────────────────────────────
const marqueeTrack = document.querySelector('.marquee-track');

if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ─────────────────────────────────────────────
// 15. FORM INTERACTIONS
// ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  // Floating label effect
  contactForm.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('label').style.display = 'block';
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.querySelector('label').style.display = 'none';
      }
    });
  });

  // Submit animation
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const span = btn.querySelector('span');

    btn.style.transform = 'scale(0.97)';
    span.textContent = 'Booking...';

    setTimeout(() => {
      btn.style.transform = '';
      span.textContent = '✓ Appointment Requested!';
      btn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';

      setTimeout(() => {
        span.textContent = 'Book My Appointment';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    }, 1200);
  });
}

// ─────────────────────────────────────────────
// 16. PRICING CARD HOVER GLOW
// ─────────────────────────────────────────────
document.querySelectorAll('.price-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `
      radial-gradient(circle 200px at ${x}px ${y}px, rgba(255,45,120,0.06), transparent),
      var(--card-bg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ─────────────────────────────────────────────
// 17. SCROLL PROGRESS INDICATOR
// ─────────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff2d78, #00d4ff);
  z-index: 600;
  transition: width 0.1s ease;
  width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress  = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

// ─────────────────────────────────────────────
// 18. SECTION ACTIVE NAV HIGHLIGHT
// ─────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--hot-pink)';
    }
  });
}, { passive: true });

// ─────────────────────────────────────────────
// 19. FLOATING PILLS PARALLAX
// ─────────────────────────────────────────────
const pills = document.querySelectorAll('.float-pill');

document.addEventListener('mousemove', (e) => {
  const cx = e.clientX / window.innerWidth  - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;

  pills.forEach((pill, i) => {
    const depth = (i + 1) * 8;
    pill.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
  });
});

// ─────────────────────────────────────────────
// 20. TEXT GLITCH EFFECT — HERO TITLE
// ─────────────────────────────────────────────
function initGlitch() {
  const titleLines = document.querySelectorAll('.title-line');

  titleLines.forEach(line => {
    const original = line.textContent;
    let interval = null;

    line.addEventListener('mouseenter', () => {
      // Clear any running interval first
      if (interval) clearInterval(interval);
      
      let iterations = 0;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      interval = setInterval(() => {
        line.textContent = original
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iterations) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iterations >= original.length) {
          clearInterval(interval);
          interval = null;
          line.textContent = original;
        }

        iterations += 0.5;
      }, 40);
    });

    // Reset immediately on mouseleave
    line.addEventListener('mouseleave', () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      line.textContent = original;
    });
  });
}

// Init glitch after loader
setTimeout(initGlitch, 2500);

// Run glitch once on load for mobile
setTimeout(() => {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.title-line').forEach((line, index) => {
      const original = line.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let iterations = 0;

      setTimeout(() => {
        const interval = setInterval(() => {
          line.textContent = original
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iterations) return original[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (iterations >= original.length) {
            clearInterval(interval);
            line.textContent = original;
          }
          iterations += 0.5;
        }, 40);
      }, index * 300);
    });
  }
}, 1000);

// ─────────────────────────────────────────────
// 21. GALLERY ITEM TILT
// ─────────────────────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    item.style.transform = `perspective(600px) rotateX(${cy * -6}deg) rotateY(${cx * 6}deg) scale(1.03)`;
    item.style.transition = 'transform 0.1s ease';
    item.style.zIndex = '2';
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease';
    item.style.zIndex = '';
  });
});

// ─────────────────────────────────────────────
// 22. ORBS CLICK BURST
// ─────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 0; height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,45,120,0.6), transparent);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9997;
    animation: burstAnim 0.6s ease forwards;
  `;
  document.body.appendChild(burst);

  // Inject keyframes if not already done
  if (!document.getElementById('burst-style')) {
    const style = document.createElement('style');
    style.id = 'burst-style';
    style.textContent = `
      @keyframes burstAnim {
        0%   { width: 0; height: 0; opacity: 1; }
        100% { width: 80px; height: 80px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => burst.remove(), 600);
});

// ─────────────────────────────────────────────
// 23. INIT ON DOM READY
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Staggered service card animation delay reset
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.setAttribute('data-index', i);
  });

  console.log('%c⚡ Meetu Unisex Saloon', 'color: #ff2d78; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with ❤️ by NexaFlow — nexaflow.bar', 'color: #00d4ff; font-size: 12px;');
});

// ── FOLLOW BUTTON TOGGLE ──
document.querySelectorAll('.ig-follow').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('following')) {
      btn.classList.remove('following');
      btn.textContent = 'Follow';
    } else {
      btn.classList.add('following');
      btn.textContent = '✓ Following';
    }
  });
});


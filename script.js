/* ============================================
   ABHISHEK JAISWAL : PORTFOLIO
   Interactions: nav, reveal-on-scroll, count-up
   ============================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = Math.min(i * 60, 240);
            setTimeout(function () { el.classList.add('is-visible'); }, delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  function animateCountUp(el) {
    var target = parseFloat(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }

    var duration = 1300;
    var start = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = easeOutExpo(progress);
      var current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  var metricGrid = document.getElementById('metric-grid');
  if (metricGrid) {
    var statEls = metricGrid.querySelectorAll('.stat-value');
    var progressFill = metricGrid.querySelector('.progress-fill');

    if (!('IntersectionObserver' in window)) {
      statEls.forEach(animateCountUp);
      if (progressFill) {
        progressFill.style.width = progressFill.getAttribute('data-progress-to') + '%';
      }
    } else {
      var metricObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              statEls.forEach(animateCountUp);
              if (progressFill) {
                var to = progressFill.getAttribute('data-progress-to');
                requestAnimationFrame(function () {
                  progressFill.style.width = to + '%';
                });
              }
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      metricObserver.observe(metricGrid);
    }
  }

  /* ---------- Benchmark bar fill ---------- */
  var benchBars = document.querySelectorAll('.bench-bar');
  if (benchBars.length) {
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      benchBars.forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-bench-width') + '%';
      });
    } else {
      var benchObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var bar = entry.target;
              requestAnimationFrame(function () {
                bar.style.width = bar.getAttribute('data-bench-width') + '%';
              });
              obs.unobserve(bar);
            }
          });
        },
        { threshold: 0.4 }
      );
      benchBars.forEach(function (bar) { benchObserver.observe(bar); });
    }
  }

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute('id');
          var link = document.querySelector('.nav-link[href="#' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.style.color = ''; });
            link.style.color = 'var(--text-primary)';
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    var lastState = false;
    window.addEventListener(
      'scroll',
      function () {
        var scrolled = window.scrollY > 8;
        if (scrolled !== lastState) {
          header.style.boxShadow = scrolled ? '0 8px 24px -16px rgba(0,0,0,0.6)' : 'none';
          lastState = scrolled;
        }
      },
      { passive: true }
    );
  }
})();

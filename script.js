/* ============================================================
   Abhishek Jaiswal · Portfolio · Interactions
   ============================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: glass on scroll ---------- */

  var header = document.getElementById("site-header");

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */

  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Staggered reveal on scroll ---------- */

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    // Stagger siblings that enter in the same frame
    var pending = [];
    var flushScheduled = false;

    function flush() {
      pending
        .sort(function (a, b) {
          return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
        })
        .forEach(function (el, i) {
          el.style.setProperty("--reveal-delay", (i * 70) + "ms");
          el.classList.add("is-visible");
        });
      pending = [];
      flushScheduled = false;
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          pending.push(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
      if (pending.length && !flushScheduled) {
        flushScheduled = true;
        requestAnimationFrame(flush);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Animated counters + progress bars ---------- */

  function animateValue(el, target, duration) {
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var metricGrid = document.getElementById("metric-grid");

  if (metricGrid) {
    var runMetrics = function () {
      metricGrid.querySelectorAll(".stat-value").forEach(function (el) {
        animateValue(el, parseInt(el.getAttribute("data-target"), 10) || 0, 1400);
      });
      metricGrid.querySelectorAll(".progress-fill").forEach(function (el) {
        var to = parseInt(el.getAttribute("data-progress-to"), 10) || 0;
        requestAnimationFrame(function () { el.style.width = to + "%"; });
      });
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      runMetrics();
    } else {
      var metricsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          runMetrics();
          metricsObserver.disconnect();
        }
      }, { threshold: 0.25 });
      metricsObserver.observe(metricGrid);
    }
  }

  /* ---------- Benchmark bars ---------- */

  var benchBars = document.querySelectorAll(".bench-bar");

  if (benchBars.length) {
    var runBench = function () {
      benchBars.forEach(function (bar) {
        var w = parseInt(bar.getAttribute("data-bench-width"), 10) || 0;
        requestAnimationFrame(function () { bar.style.width = w + "%"; });
      });
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      runBench();
    } else {
      var benchObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          runBench();
          benchObserver.disconnect();
        }
      }, { threshold: 0.3 });
      benchObserver.observe(benchBars[0].closest(".bench-compare"));
    }
  }

  /* ---------- Card spotlight (follows cursor) ---------- */

  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".spot").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(function (s) { activeObserver.observe(s); });
  }
})();

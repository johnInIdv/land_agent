/* ===========================
   LandAgent — Shared JavaScript
   =========================== */

(function () {
  'use strict';

  /* ---------------------------
     Mobile Navigation Toggle
     --------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    var navLinks = links.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* ---------------------------
     Active Nav Link
     --------------------------- */
  function setActiveNavLink() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
      var href = navLinks[i].getAttribute('href');
      if (href === page) {
        navLinks[i].classList.add('active');
      } else {
        navLinks[i].classList.remove('active');
      }
    }
  }

  /* ---------------------------
     Hero Scroll Text Effect
     --------------------------- */
  function initHeroScroll() {
    var heroSection = document.getElementById('hero');
    var heroText = document.getElementById('hero-text');
    if (!heroSection || !heroText) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Split text into word spans
    var originalText = heroText.textContent.trim();
    var words = originalText.split(/\s+/);
    heroText.innerHTML = words.map(function (word) {
      return '<span class="word">' + word + '</span>';
    }).join(' ');

    var wordSpans = heroText.querySelectorAll('.word');
    var subtitle = document.getElementById('hero-subtitle');
    var cta = document.querySelector('.hero-cta');

    function updateWords() {
      var rect = heroSection.getBoundingClientRect();
      var sectionHeight = rect.height;
      var scrolled = -rect.top;
      var scrollRange = sectionHeight - window.innerHeight;
      var scrollProgress = Math.max(0, Math.min(1, scrolled / scrollRange));
      var totalWords = wordSpans.length;

      for (var i = 0; i < totalWords; i++) {
        // Each word gets a staggered reveal window
        var wordStart = (i / totalWords) * 0.7;
        var wordEnd = wordStart + (1 / totalWords) * 1.8;

        var wordProgress = (scrollProgress - wordStart) / (wordEnd - wordStart);
        wordProgress = Math.max(0, Math.min(1, wordProgress));

        // Opacity: 0.25 -> 1.0
        var opacity = 0.25 + wordProgress * 0.75;

        // Color: gold (#CEB888 = 206,184,136) -> black (0,0,0)
        var r = Math.round(206 * (1 - wordProgress));
        var g = Math.round(184 * (1 - wordProgress));
        var b = Math.round(136 * (1 - wordProgress));

        wordSpans[i].style.opacity = opacity;
        wordSpans[i].style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
      }

      // Subtitle fades in late
      if (subtitle) {
        var subProgress = Math.max(0, Math.min(1, (scrollProgress - 0.65) / 0.2));
        subtitle.style.opacity = subProgress;
      }

      // CTA fades in last
      if (cta) {
        var ctaProgress = Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.2));
        cta.style.opacity = ctaProgress;
      }
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateWords();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateWords(); // Initial state
  }

  /* ---------------------------
     Contact Form Handler
     --------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation — HTML5 required attributes handle most of it
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        return;
      }

      // Show success message
      form.style.display = 'none';
      var success = document.getElementById('form-success');
      if (success) {
        success.classList.add('visible');
      }
    });
  }

  /* ---------------------------
     Initialize
     --------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    setActiveNavLink();
    initHeroScroll();
    initContactForm();
  });
})();

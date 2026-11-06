// Mobile-Menü
document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('[data-nav-burger]');
  var menu = document.querySelector('[data-nav-links]');
  var nav = burger ? burger.closest('.hopfen-nav') : null;
  if (burger && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    var close = function (focusBurger) {
      if (!menu.classList.contains('is-open')) return;
      setOpen(false);
      if (focusBurger) burger.focus();
    };

    burger.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      setOpen(open);
      // Fokus mit ins Menü nehmen, sonst läuft Tab am offenen Menü vorbei
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });
    // Escape schließt das Menü und gibt den Fokus an den Burger zurück
    if (nav) {
      nav.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.key === 'Esc') close(true);
      });
      // Klick außerhalb schließt ohne Fokuswechsel
      document.addEventListener('click', function (event) {
        if (!nav.contains(event.target)) close(false);
      });
    }
  }

  // Footer-Jahr aktuell halten (das HTML bleibt ohne JS korrekt)
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Instagram-Feed (LightWidget) erst nach Klick laden – der Klick gilt als Einwilligung.
  var instaEmbed = document.querySelector('[data-insta-embed]');
  var instaBtn = document.querySelector('[data-insta-load]');
  if (instaEmbed && instaBtn) {
    instaBtn.addEventListener('click', function () {
      var script = document.createElement('script');
      script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
      var iframe = document.createElement('iframe');
      iframe.src = instaEmbed.getAttribute('data-src');
      iframe.className = 'lightwidget-widget';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('title', 'Instagram-Feed von The Hopfen Swingers');
      instaEmbed.innerHTML = '';
      instaEmbed.classList.add('is-loaded');
      instaEmbed.appendChild(script);
      instaEmbed.appendChild(iframe);
    });
  }

  // Vergangene Termine ausblenden.
  // Jede Karte trägt data-date="JJJJ-MM-TT" (optional data-end für mehrtägige
  // Events). Am Veranstaltungstag selbst bleibt der Termin noch sichtbar.
  var eventCards = document.querySelectorAll('.event-card[data-date]');
  if (eventCards.length) {
    var now = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    eventCards.forEach(function (card) {
      var last = card.getAttribute('data-end') || card.getAttribute('data-date');
      if (last < today) card.remove();
    });
    if (!document.querySelector('.event-card')) {
      var eventsCarousel = document.querySelector('#events [data-carousel]');
      if (eventsCarousel) eventsCarousel.classList.add('is-empty');
    }
  }

  // Pfeil-Karussells (Events, Band). Scrollt den Track um eine Kartenbreite.
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    if (!track) return;

    function step() {
      var card = track.querySelector(':scope > *');
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    }

    function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      var maxScroll = track.scrollWidth - track.clientWidth - 1;
      // Reicht der Platz für alle Karten, werden die Pfeile ganz ausgeblendet
      var hasOverflow = maxScroll > 0;
      prevBtn.classList.toggle('hopfen-arrow-hidden', !hasOverflow);
      nextBtn.classList.toggle('hopfen-arrow-hidden', !hasOverflow);
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      });
    }
    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    window.addEventListener('load', updateArrows);
    updateArrows();
  });
});

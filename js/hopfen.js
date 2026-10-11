// Mobile-Menü
document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('[data-nav-burger]');
  var menu = document.querySelector('[data-nav-links]');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
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

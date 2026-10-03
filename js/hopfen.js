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
      var canScroll = track.scrollWidth > track.clientWidth;
      prevBtn.classList.toggle("is-hidden", !canScroll);
      nextBtn.classList.toggle("is-hidden", !canScroll);
      var maxScroll = track.scrollWidth - track.clientWidth - 1;
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
    updateArrows();
  });
});

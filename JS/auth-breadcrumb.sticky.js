// SIMBEDA - Sticky header kecil saat scroll
(function () {
  'use strict';
  document.addEventListener('scroll', () => {
    const h = document.getElementById('header');
    if (!h) return;
    if (window.scrollY > 8) h.classList.add('is-sticky');
    else h.classList.remove('is-sticky');
  });
})();

// SIMBEDA - Quotes footer (ganti tiap 5 menit)
(function () {
  'use strict';
  const QUOTES = [
    "Siaga hari ini, selamatkan esok.",
    "Respons cepat, nyawa selamat.",
    "Data rapi, aksi pasti.",
    "Kerja sama kuat, bencana surut.",
    "Dari Dumai, untuk keselamatan bersama."
  ];
  const TARGET = '#footer-quote';          // pastikan ada elemen ini di footer.html
  const INTERVAL_MS = 5 * 60 * 1000;

  function pick(i) { return QUOTES[i % QUOTES.length]; }

  function render(i) {
    const el = document.querySelector(TARGET);
    if (!el) return;
    el.textContent = pick(i);
  }

  document.addEventListener('DOMContentLoaded', () => {
    let idx = Math.floor((Date.now()/INTERVAL_MS)) % QUOTES.length;
    render(idx++);
    setInterval(() => render(idx++), INTERVAL_MS);
  });
})();

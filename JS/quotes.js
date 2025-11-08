// SIMBEDA - Footer Quotes + Real-time Clock (robust init)
// - Tampilkan jam real-time di #footer-clock
// - Putar quotes tiap 5 menit di #footer-quote
// - Jalan walau script dimuat setelah DOMContentLoaded
(function () {
  'use strict';

  const QUOTES = [
    "Siaga hari ini, selamatkan esok.",
    "Respons cepat, nyawa selamat.",
    "Data rapi, aksi pasti.",
    "Kerja sama kuat, bencana surut.",
    "Dari Dumai, untuk keselamatan bersama."
  ];

  const Q_SEL = '#footer-quote';
  const C_SEL = '#footer-clock';
  const QUOTE_INTERVAL = 5 * 60 * 1000; // 5 menit
  const CLOCK_INTERVAL = 1000;          // 1 detik

  function startClock(clockEl) {
    const tick = () => { clockEl.textContent = new Date().toLocaleTimeString('id-ID', { hour12:false }); };
    tick();
    setInterval(tick, CLOCK_INTERVAL);
  }

  function startQuotes(quoteEl) {
    let idx = Math.floor(Date.now() / QUOTE_INTERVAL) % QUOTES.length;
    const render = () => { quoteEl.textContent = QUOTES[idx % QUOTES.length]; idx++; };
    render();
    setInterval(render, QUOTE_INTERVAL);
  }

  // Inisialisasi yang aman terhadap timing injection
  function initFooterUI() {
    let tries = 0, max = 150; // ~15 detik retry
    (function waitForElements() {
      const quoteEl = document.querySelector(Q_SEL);
      const clockEl = document.querySelector(C_SEL);
      if (quoteEl && clockEl) {
        startClock(clockEl);
        startQuotes(quoteEl);
        return;
      }
      if (tries++ < max) setTimeout(waitForElements, 100);
    })();
  }

  // Jalankan segera bila dokumen sudah siap; jika belum, tunggu sekali.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFooterUI();
  } else {
    document.addEventListener('DOMContentLoaded', initFooterUI, { once:true });
  }

  // Ekspor hook opsional agar bisa dipanggil manual dari layout.js setelah inject
  window.SIMBEDA_FOOTER_BOOT = initFooterUI;
})();

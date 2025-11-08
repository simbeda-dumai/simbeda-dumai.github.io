// SIMBEDA - Footer Quotes + Real-time Clock
// - Memutarkan quotes tiap 5 menit
// - Menampilkan jam real-time (HH:mm:ss) di #footer-clock
(function () {
  'use strict';

  const QUOTES = [
    "Siaga hari ini, selamatkan esok.",
    "Respons cepat, nyawa selamat.",
    "Data rapi, aksi pasti.",
    "Kerja sama kuat, bencana surut.",
    "Dari Dumai, untuk keselamatan bersama."
  ];
  const Q_TARGET = '#footer-quote';
  const C_TARGET = '#footer-clock';
  const QUOTE_INTERVAL = 5 * 60 * 1000; // 5 menit
  const CLOCK_INTERVAL = 1000;          // 1 detik

  function fmtTime(d) {
    return d.toLocaleTimeString('id-ID', { hour12:false });
  }

  function bindWhenReady(sel, cb, tries=0) {
    const el = document.querySelector(sel);
    if (el) { cb(el); return; }
    if (tries > 300) return; // max ~5 menit total kalau footer diinject lambat
    setTimeout(() => bindWhenReady(sel, cb, tries+1), 1000);
  }

  function startClock(el) {
    const tick = () => { el.textContent = fmtTime(new Date()); };
    tick();
    setInterval(tick, CLOCK_INTERVAL);
  }

  function startQuotes(el) {
    let idx = Math.floor(Date.now() / QUOTE_INTERVAL) % QUOTES.length;
    const render = () => { el.textContent = QUOTES[idx % QUOTES.length]; idx++; };
    render();
    setInterval(render, QUOTE_INTERVAL);
  }

  // Footer diinject via layout.js → pastikan elemen siap dulu
  document.addEventListener('DOMContentLoaded', () => {
    bindWhenReady(C_TARGET, startClock);
    bindWhenReady(Q_TARGET, startQuotes);
  });
})();

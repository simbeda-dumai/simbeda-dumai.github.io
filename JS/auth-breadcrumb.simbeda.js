// SIMBEDA - Breadcrumb akun sederhana (render di header)
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const raw = localStorage.getItem('simbeda_auth');
      if (!raw) return;
      const s = JSON.parse(raw);
      const host = document.querySelector('[data-auth-slot]') || document.getElementById('header');
      if (!host) return;
      const el = document.createElement('div');
      el.className = 'auth-crumb';
      el.innerHTML = `
        <span>${s.username || '-'}</span>
        <span class="sep">•</span>
        <span>${s.role || '-'}</span>
        <span class="sep">•</span>
        <span>${s.area || '-'}</span>
      `;
      host.appendChild(el);
    } catch (_) {}
  });
})();

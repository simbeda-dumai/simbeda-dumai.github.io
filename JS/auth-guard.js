// SIMBEDA - Auth Guard (aktif hanya untuk modul tertentu)
(function () {
  'use strict';

  // HANYA modul ini yang dijaga
  const ENFORCED_MODULES = new Set(['dashboard', 'laporan_cepat']);

  function getSession() {
    try {
      const raw = localStorage.getItem('simbeda_auth');
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function getRequiredModule() {
    const m = document.querySelector('meta[name="simbeda:module"]');
    return m ? (m.getAttribute('content') || '').trim() : '';
  }

  function hasAccess(sess, mod) {
    if (!mod) return true;                     // kalau modul tak didefinisikan, abaikan
    if (!sess || !Array.isArray(sess.modules)) return false;
    return sess.modules.includes(mod);
  }

  function boot() {
    const mod = getRequiredModule();

    // Jika bukan modul yang diproteksi, jangan apa-apa
    if (!ENFORCED_MODULES.has(mod)) return;

    const sess = getSession();
    if (!sess) {
      window.location.replace('/HTML/login.html');
      return;
    }

    if (!hasAccess(sess, mod)) {
      alert('Akses ditolak untuk modul: ' + mod);
      window.location.replace('/HTML/dashboard.html');
      return;
    }

    // Expose info user ke DOM (opsional untuk UI)
    document.documentElement.setAttribute('data-simbeda-user', sess.username || '');
    document.documentElement.setAttribute('data-simbeda-role', sess.role || '');
    document.documentElement.setAttribute('data-simbeda-area', sess.area || '');
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

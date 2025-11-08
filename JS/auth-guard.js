// SIMBEDA - Auth Guard (dashboard publik, modul lain butuh login + izin)
(function () {
  'use strict';

  const meta = document.querySelector('meta[name="simbeda:module"]');
  const moduleName = (meta?.content || '').trim().toLowerCase();

  // Kalau halaman tidak mendeklarasikan modul → tidak dijaga
  if (!moduleName) return;

  // Dashboard kini publik (abaikan guard meski ada meta)
  if (moduleName === 'dashboard') return;

  // Ambil sesi
  let sess = null;
  try { sess = JSON.parse(localStorage.getItem('simbeda_auth') || 'null'); } catch (_) {}

  // Wajib login untuk modul selain dashboard
  if (!sess) {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    location.assign(`/HTML/login.html?next=${next}`);
    return;
  }

  // Cek izin modul jika ada daftar modules pada sesi
  const mods = Array.isArray(sess.modules) ? sess.modules.map(m => String(m).toLowerCase()) : null;
  if (mods && !mods.includes(moduleName)) {
    // Tidak berizin → arahkan ke login agar jelas
    location.assign('/HTML/login.html');
    return;
  }

  // Lolos guard
})();

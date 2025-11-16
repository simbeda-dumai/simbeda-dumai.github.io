(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  // Cek jika ada sesi di localStorage
  function checkAuth() {
    const session = JSON.parse(localStorage.getItem('simbeda_auth'));
    if (!session || !session.username) {
      window.location.href = '/HTML/login.html';  // Jika tidak ada sesi, arahkan ke login
    }
  }

  // Cek akses berdasarkan role
  function checkRole() {
    const session = JSON.parse(localStorage.getItem('simbeda_auth'));
    if (session && session.role === 'Kota') {
      // Allow access to Kota
    } else if (session && session.role === 'Kecamatan') {
      // Allow access to Kecamatan
    } else {
      window.location.href = '/HTML/login.html'; // Redirect jika role tidak sesuai
    }
  }

  // Main function to check authentication
  function initGuard() {
    checkAuth();
    checkRole();
  }

  document.addEventListener('DOMContentLoaded', initGuard);
})();

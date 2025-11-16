(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  // Cek sesi login dari localStorage
  function checkAuth() {
    const session = JSON.parse(localStorage.getItem('simbeda_auth'));
    if (session && session.username) {
      // Sembunyikan tombol login, tampilkan tombol logout dan nama pengguna
      $('#login-button').style.display = 'none';
      $('#logout-button').style.display = 'inline';
      $('#user-name').style.display = 'inline';
      $('#username-display').textContent = session.username;
    } else {
      // Tampilkan tombol login, sembunyikan tombol logout
      $('#login-button').style.display = 'inline';
      $('#logout-button').style.display = 'none';
      $('#user-name').style.display = 'none';
    }
  }

  // Logout dan hapus session
  $('#logout-button').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('simbeda_auth');
    checkAuth();  // Perbarui navbar setelah logout
    window.location.href = '/HTML/login.html';  // Arahkan ke halaman login
  });

  // Cek status autentikasi saat halaman dimuat
  document.addEventListener('DOMContentLoaded', checkAuth);
})();

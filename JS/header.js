(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  // Cek sesi login dari localStorage
  function checkAuth() {
    const session = JSON.parse(localStorage.getItem('simbeda_auth'));
    if (session && session.username) {
      // Pastikan tombol login disembunyikan hanya jika sudah login
      $('#login-button').style.display = 'none';  // Sembunyikan tombol login
      $('#logout-button').style.display = 'inline';  // Tampilkan tombol logout
      $('#user-name').style.display = 'inline';  // Tampilkan nama pengguna
      $('#username-display').textContent = session.username;  // Tampilkan nama pengguna
    } else {
      // Pastikan tombol login muncul jika belum login
      $('#login-button').style.display = 'inline';
      $('#logout-button').style.display = 'none';
      $('#user-name').style.display = 'none';
    }
  }

  // Logout dan hapus session
  $('#logout-button').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('simbeda_auth');  // Hapus session dari localStorage
    checkAuth();  // Perbarui navbar setelah logout
    window.location.href = '/HTML/login.html';  // Arahkan ke halaman login
  });

  // Cek status autentikasi saat halaman dimuat
  document.addEventListener('DOMContentLoaded', checkAuth);
})();

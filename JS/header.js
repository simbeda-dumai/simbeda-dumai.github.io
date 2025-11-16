(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  // Ambil data session dari localStorage
  function checkAuth() {
    const session = JSON.parse(localStorage.getItem('simbeda_auth'));
    if (session && session.username) {
      // Tampilkan nama pengguna dan tombol logout
      $('#login-button').style.display = 'none';  // Sembunyikan tombol login
      $('#logout-button').style.display = 'inline';  // Tampilkan tombol logout
      $('#user-name').style.display = 'inline';  // Tampilkan nama pengguna
      $('#username-display').textContent = session.username;  // Tampilkan nama pengguna
    } else {
      // Sembunyikan nama pengguna dan tombol logout jika belum login
      $('#login-button').style.display = 'inline';  // Tampilkan tombol login
      $('#logout-button').style.display = 'none';  // Sembunyikan tombol logout
      $('#user-name').style.display = 'none';  // Sembunyikan nama pengguna
    }
  }

  // Logout dan hapus session
  $('#logout-button').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('simbeda_auth');  // Hapus session dari localStorage
    checkAuth();  // Perbarui navbar setelah logout
    window.location.href = '/HTML/login.html';  // Arahkan ke halaman login
  });

  // Panggil fungsi untuk cek status autentikasi saat halaman dimuat
  document.addEventListener('DOMContentLoaded', checkAuth);
})();

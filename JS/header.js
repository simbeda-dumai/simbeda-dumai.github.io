(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  // Cek sesi login dari localStorage
  function checkAuth() {
    const session = JSON.parse(localStorage.getItem('simbeda_auth'));
    console.log("Session data: ", session); // Debugging line to check session data
    
    if (session && session.username) {
      // Debug: Log to confirm login state
      console.log("User logged in: " + session.username);
      
      $('#login-button').style.display = 'none';  // Sembunyikan tombol login
      $('#logout-button').style.display = 'inline';  // Tampilkan tombol logout
      $('#user-name').style.display = 'inline';  // Tampilkan nama pengguna
      $('#username-display').textContent = session.username;  // Tampilkan nama pengguna
    } else {
      // Debug: Log to confirm no session
      console.log("No session, showing login button");
      
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

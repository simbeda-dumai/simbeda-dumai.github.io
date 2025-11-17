// Fungsi login user
function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login berhasil!");
        updateNavbar(user);  // Memperbarui navbar setelah login
        loadModule('beranda');  // Tampilkan beranda setelah login
    } else {
        alert("Username atau Password salah!");
    }
}

// Memperbarui Navbar setelah login
function updateNavbar(user) {
    const navbar = document.getElementById("navbar");

    // Pastikan navbar ter-update setelah login
    navbar.innerHTML = `
        <button onclick="loadModule('beranda')">Home</button>
        <button onclick="loadModule('laporanWarga')">Laporan Warga</button>
        <button onclick="logoutUser()">Logout</button>
    `;

    // Menampilkan informasi user di navbar
    const userInfo = document.createElement('span');
    userInfo.textContent = `Logged in as: ${user.username}`;
    navbar.appendChild(userInfo);
}

// Fungsi logout
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("Logout berhasil!");
    window.location.reload();  // Refresh halaman setelah logout
}

// Fungsi untuk memuat modul berdasarkan nama
function loadModule(module) {
    alert('Modul ' + module + ' dimuat!');
}

// Event listener untuk form login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    loginUser();
});

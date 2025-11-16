// Fungsi login user
function loginUser() {
    const username = prompt("Masukkan Username");
    const password = prompt("Masukkan Password");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login berhasil!");
        updateNavbar(user);  // Update navbar setelah login
        loadModule('beranda');  // Tampilkan beranda setelah login
    } else {
        alert("Username atau Password salah!");
    }
}

// Memperbarui Navbar setelah login
function updateNavbar(user) {
    const navbar = document.getElementById("navbar");

    navbar.innerHTML = `
        <button onclick="loadModule('beranda')">Home</button>
        <button onclick="loadModule('laporanWarga')">Laporan Warga</button>
        <button onclick="logoutUser()">Logout</button>
    `;

    const userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = `Selamat datang, ${user.username}`;

    // Menampilkan tombol khusus untuk admin atau kecamatan
    if (user.role !== "warga") {
        navbar.innerHTML += `<button onclick="loadModule('laporanWilayah')">Laporan Wilayah</button>`;
    }
}

// Fungsi logout
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("Logout berhasil!");
    updateNavbar({});  // Reset navbar saat logout
    loadModule('beranda');
}

// Fungsi untuk memuat modul-modul berdasarkan file HTML terpisah
function loadModule(moduleName) {
    const contentDiv = document.getElementById("mainContent");
    
    fetch(`html/${moduleName}.html`)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
        });
}

// Memperbarui navbar jika user sudah login saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        updateNavbar(user);
    } else {
        // Jika belum login, tampilkan tombol login
        document.getElementById("loginButton").style.display = "inline";
    }
});

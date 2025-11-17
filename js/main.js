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

    // Pastikan navbar berfungsi setelah login
    navbar.innerHTML = `
        <button onclick="loadModule('beranda')">Home</button>
        <button onclick="loadModule('laporanWarga')">Laporan Warga</button>
        <button onclick="logoutUser()">Logout</button>
    `;

    // Update dengan informasi user di navbar jika perlu
    const userInfo = document.createElement('span');
    userInfo.textContent = `Logged in as: ${user.username}`;
    navbar.appendChild(userInfo);
}

// Fungsi untuk logout
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("Logout berhasil!");
    window.location.reload();  // Refresh halaman setelah logout
}

// Fungsi untuk memuat modul berdasarkan nama
function loadModule(module) {
    // Menambahkan logika pemuatan modul di sini (misalnya beranda, laporan warga)
    alert('Modul ' + module + ' dimuat!');
}

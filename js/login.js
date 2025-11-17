// Fungsi untuk memvalidasi login pengguna
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

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
});

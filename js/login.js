// Fungsi login untuk validasi username dan password
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login berhasil!");
        window.location.href = "index.html";  // Redirect ke halaman utama setelah login
    } else {
        alert("Username atau Password salah!");
    }
});
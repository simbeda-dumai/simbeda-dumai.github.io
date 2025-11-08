// ===== efek transisi antar halaman =====
document.body.classList.add("fade-in");

window.addEventListener("beforeunload", () => {
  document.body.classList.add("fade-out");
});

document.addEventListener("DOMContentLoaded", () => {
  // Muat header
  fetch("components/header/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    })
    .catch(() => console.error("Gagal memuat header"));

  // Muat footer
  fetch("components/footer/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
      // setelah footer dimuat, muat script quotes (waktu & kata bijak)
      const script = document.createElement("script");
      script.src = "components/footer/quotes.js";
      document.body.appendChild(script);
    })
    .catch(() => console.error("Gagal memuat footer"));
});

// ===== Efek transisi antar halaman =====
document.body.classList.add("fade-in");
window.addEventListener("beforeunload", () => {
  document.body.classList.add("fade-out");
});

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  // muat header dari root (GitHub Pages safe)
  fetch("/components/header/header.html")
    .then(r => {
      if (!r.ok) throw new Error("Header gagal dimuat");
      return r.text();
    })
    .then(html => headerEl.innerHTML = html)
    .catch(err => {
      headerEl.innerHTML = `<div style="background:#fee2e2;color:#b91c1c;padding:8px;text-align:center;">
        ⚠️ ${err.message}
      </div>`;
    });

  // muat footer
  fetch("/components/footer/footer.html")
    .then(r => {
      if (!r.ok) throw new Error("Footer gagal dimuat");
      return r.text();
    })
    .then(html => {
      footerEl.innerHTML = html;

      // pastikan quotes.js dimuat setelah footer selesai
      const script = document.createElement("script");
      script.src = "/components/footer/quotes.js";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(err => {
      footerEl.innerHTML = `<div style="background:#fee2e2;color:#b91c1c;padding:8px;text-align:center;">
        ⚠️ ${err.message}
      </div>`;
    });
});

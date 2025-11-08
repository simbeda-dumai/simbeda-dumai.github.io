// ===== efek transisi antar halaman =====
document.body.classList.add("fade-in");

window.addEventListener("beforeunload", () => {
  document.body.classList.add("fade-out");
});

document.addEventListener("DOMContentLoaded", () => {
  // Deteksi level folder agar path selalu benar di GitHub Pages
  let basePath = "";
  const depth = window.location.pathname.split("/").length - 2;
  for (let i = 0; i < depth; i++) basePath += "../";

  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  // ===== MUAT HEADER =====
  fetch(`${basePath}components/header/header.html`)
    .then(res => {
      if (!res.ok) throw new Error("Header 404");
      return res.text();
    })
    .then(html => {
      if (headerEl) headerEl.innerHTML = html;
    })
    .catch(() => {
      if (headerEl)
        headerEl.innerHTML = `<div style="background:#fee2e2;color:#b91c1c;padding:10px;text-align:center;">
          ⚠️ Header tidak ditemukan (404)
        </div>`;
    });

  // ===== MUAT FOOTER =====
  fetch(`${basePath}components/footer/footer.html`)
    .then(res => {
      if (!res.ok) throw new Error("Footer 404");
      return res.text();
    })
    .then(html => {
      if (footerEl) footerEl.innerHTML = html;
      const script = document.createElement("script");
      script.src = `${basePath}components/footer/quotes.js`;
      document.body.appendChild(script);
    })
    .catch(() => {
      if (footerEl)
        footerEl.innerHTML = `<div style="background:#fee2e2;color:#b91c1c;padding:10px;text-align:center;">
          ⚠️ Footer tidak ditemukan (404)
        </div>`;
    });
});

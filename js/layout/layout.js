// ===== Efek Transisi Antar Halaman =====
document.body.classList.add("fade-in");
window.addEventListener("beforeunload", () => {
  document.body.classList.add("fade-out");
});

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  // Deteksi path base otomatis
  const tryPaths = [
    "/components/", // root GitHub Pages
    "../components/",
    "../../components/"
  ];

  const loadHTML = async (target, file) => {
    for (const path of tryPaths) {
      try {
        const res = await fetch(`${path}${file}`);
        if (res.ok) {
          const html = await res.text();
          target.innerHTML = html;
          // jika footer, muat quotes.js juga
          if (file.includes("footer")) {
            const script = document.createElement("script");
            script.src = `${path}footer/quotes.js`;
            document.body.appendChild(script);
          }
          return;
        }
      } catch {}
    }
    target.innerHTML = `<div style="background:#fee2e2;color:#b91c1c;padding:10px;text-align:center;">
      ⚠️ Gagal memuat ${file} (404)
    </div>`;
  };

  if (headerEl) loadHTML(headerEl, "header/header.html");
  if (footerEl) loadHTML(footerEl, "footer/footer.html");
});

// Memuat header & footer secara dinamis + menjamin CSS transisi & Roboto selalu terpasang
(function () {
  // Hitung base path agar aman di root atau di project pages GitHub
  function computeBase() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    const roots = new Set(['modules','components','assets','js']);
    return (!first || roots.has(first)) ? '/' : `/${first}/`;
  }

  const BASE = computeBase();
  window.SIMBEDA_BASE = BASE; // bisa dipakai modul lain

  function insertOnce(tagName, attrs) {
    const href = attrs.href || attrs.src || '';
    if (!href) return null;
    const exists = Array.from(document.querySelectorAll(tagName)).some(el => (el.href === href || el.src === href));
    if (exists) return null;
    const el = document.createElement(tagName);
    Object.entries(attrs).forEach(([k,v]) => { if (v != null) el.setAttribute(k, v); });
    (tagName === 'script' ? document.body : document.head).appendChild(el);
    return el;
  }

  // Pastikan CSS transisi & Roboto terpasang di semua halaman yang memakai layout
  insertOnce('link', { rel: 'stylesheet', href: BASE + 'assets/css/transition.css', 'data-auto': '1' });
  insertOnce('link', { rel: 'stylesheet', href: BASE + '/CSS/Roboto.css', 'data-auto': '1' });

  const header = document.getElementById('header');
  const footer = document.getElementById('footer');

  if (header) {
    fetch(BASE + 'components/header/header.html')
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(html => {
        header.innerHTML = html;
        insertOnce('link', { rel: 'stylesheet', href: BASE + 'components/header/header.css' });
      })
      .catch(() => console.warn('[layout] Gagal memuat header'));
  }

  if (footer) {
    fetch(BASE + 'components/footer/footer.html')
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(html => {
        footer.innerHTML = html;
        insertOnce('link', { rel: 'stylesheet', href: BASE + 'components/footer/footer.css' });
        if (!window.__quotesLoaded) {
          const s = insertOnce('script', { src: BASE + 'components/footer/quotes.js', defer: 'defer' });
          if (s) s.onload = () => { window.__quotesLoaded = true; };
        }
      })
      .catch(() => console.warn('[layout] Gagal memuat footer'));
  }

  // Efek transisi halus
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      document.body.classList.add('fade-in');
    }
  });
  window.addEventListener('beforeunload', () => {
    document.body.classList.add('fade-out');
  });
})();
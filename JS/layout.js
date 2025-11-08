// SIMBEDA - Layout injector (ABSOLUTE PATHS + panggil quotes setelah footer siap)
(function () {
  'use strict';

  const CSS_LIST   = ['/CSS/Roboto.css', '/CSS/transition.css', '/CSS/header.css', '/CSS/footer.css'];
  const HEADER_HTML = '/HTML/header.html';
  const FOOTER_HTML = '/HTML/footer.html';
  const QUOTES_JS   = '/JS/quotes.js';

  function injectCssOnce(href) {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(l => l.href.includes(href))) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function ensureScript(src, onload) {
    const exists = [...document.querySelectorAll('script')].some(s => (s.src || '').includes(src));
    if (exists) { try { onload && onload(); } catch(_){} return; }
    const sc = document.createElement('script');
    sc.src = src;
    sc.onload = () => { try { onload && onload(); } catch(_){} };
    document.body.appendChild(sc);
  }

  async function fetchHtml(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal load: ' + url);
    return await res.text();
  }

  async function loadShell() {
    // CSS umum
    CSS_LIST.forEach(injectCssOnce);

    // Host header/footer
    const headerHost = document.getElementById('header') || (() => {
      const d = document.createElement('div'); d.id = 'header'; document.body.prepend(d); return d;
    })();
    const footerHost = document.getElementById('footer') || (() => {
      const d = document.createElement('div'); d.id = 'footer'; document.body.appendChild(d); return d;
    })();

    // Inject HTML
    try { headerHost.innerHTML = await fetchHtml(HEADER_HTML); } catch (e) { console.error(e); }
    try {
      footerHost.innerHTML = await fetchHtml(FOOTER_HTML);
      // Pastikan quotes.js dimuat, lalu paksa boot ulang jika tersedia
      ensureScript(QUOTES_JS, () => {
        if (typeof window.SIMBEDA_FOOTER_BOOT === 'function') {
          window.SIMBEDA_FOOTER_BOOT();
        }
      });
    } catch (e) { console.error(e); }

    // Tandai nav aktif
    try {
      const path = location.pathname.replace(/\/+/g, '/');
      document.querySelectorAll('[data-nav]').forEach(a => {
        const target = a.getAttribute('data-nav');
        if (path.endsWith(target)) a.classList.add('active');
      });
    } catch (_) {}

    // Breadcrumb user sederhana
    try {
      const raw = localStorage.getItem('simbeda_auth');
      if (raw) {
        const s = JSON.parse(raw);
        const slot = document.querySelector('[data-auth-slot]') || document.querySelector('#header');
        if (slot) {
          const el = document.createElement('div');
          el.className = 'auth-crumb';
          el.innerHTML = `
            <span>${s.username || '-'}</span>
            <span class="sep">•</span>
            <span>${s.role || '-'}</span>
            <span class="sep">•</span>
            <span>${s.area || '-'}</span>
          `;
          slot.appendChild(el);
        }
      }
    } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', loadShell);
})();

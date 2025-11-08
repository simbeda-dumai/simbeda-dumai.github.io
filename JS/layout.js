// SIMBEDA - Layout injector (ABSOLUTE PATHS)
(function () {
  'use strict';

  // ABSOLUTE paths
  const CSS_LIST = ['/CSS/Roboto.css', '/CSS/transition.css', '/CSS/header.css', '/CSS/footer.css'];
  const HEADER_HTML = '/HTML/header.html';
  const FOOTER_HTML = '/HTML/footer.html';

  function injectCssOnce(href) {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(l => l.href.includes(href))) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  async function fetchHtml(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal load: ' + url);
    return await res.text();
  }

  async function loadShell() {
    // CSS
    CSS_LIST.forEach(injectCssOnce);

    // HEADER
    const headerHost = document.getElementById('header') || (() => {
      const d = document.createElement('div');
      d.id = 'header'; document.body.prepend(d); return d;
    })();
    // FOOTER
    const footerHost = document.getElementById('footer') || (() => {
      const d = document.createElement('div');
      d.id = 'footer'; document.body.appendChild(d); return d;
    })();

    // Inject HTML
    try { headerHost.innerHTML = await fetchHtml(HEADER_HTML); } catch (e) { console.error(e); }
    try { footerHost.innerHTML = await fetchHtml(FOOTER_HTML); } catch (e) { console.error(e); }

    // Set nav active (berdasarkan path)
    try {
      const path = location.pathname.replace(/\/+/g, '/');
      document.querySelectorAll('[data-nav]').forEach(a => {
        const target = a.getAttribute('data-nav');
        if (path.endsWith(target)) a.classList.add('active');
      });
    } catch (_) {}

    // Render breadcrumb user (jika ada)
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

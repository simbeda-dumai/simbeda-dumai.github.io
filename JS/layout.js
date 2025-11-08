// SIMBEDA - Layout injector (ABS PATHS + footer quotes + user pill + beranda hide login)
(function () {
  'use strict';

  const CSS_LIST    = ['/CSS/Roboto.css', '/CSS/transition.css', '/CSS/header.css', '/CSS/footer.css'];
  const HEADER_HTML = '/HTML/header.html';
  const FOOTER_HTML = '/HTML/footer.html';
  const QUOTES_JS   = '/JS/quotes.js';

  // --- helpers ---
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
    sc.defer = true;
    sc.onload = () => { try { onload && onload(); } catch(_){} };
    document.body.appendChild(sc);
  }

  async function fetchHtml(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal load: ' + url);
    return await res.text();
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem('simbeda_auth') || 'null'); } catch(_) { return null; }
  }

  function isHome() {
    const p = location.pathname.replace(/\/+$/,'');
    return p === '' || p === '/' || p.endsWith('/index.html');
  }

  // Tambahkan/ubah area login di navbar
  function decorateNavbarWithAuth(sess) {
    const nav = document.querySelector('.sb-nav');
    if (!nav) return;

    const loginLink = nav.querySelector('.sb-link-login');

    // 1) Beranda: jangan tampilkan "Masuk"
    if (isHome() && loginLink) {
      loginLink.remove();
    }

    // 2) Jika punya sesi → ganti "Masuk" jadi pill user + Logout
    if (sess) {
      // Jika link Masuk masih ada, replace; kalau tidak, append di ujung kanan
      const pill = document.createElement('div');
      pill.className = 'sb-userpill';
      pill.innerHTML = `
        <span class="sb-user" title="${sess.area || ''}">${sess.username || '-'}</span>
        <button id="sb-logout" class="sb-logout" type="button" title="Keluar dari sistem">Logout</button>
      `;

      if (loginLink) loginLink.replaceWith(pill);
      else nav.appendChild(pill);

      // Handler logout
      const btn = pill.querySelector('#sb-logout');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try { localStorage.removeItem('simbeda_auth'); } catch(_) {}
        window.location.assign('/HTML/login.html');
      });
    }
  }

  // Breadcrumb kecil (hanya jika tidak ada user pill)
  function renderAuthCrumb(sess) {
    if (!sess) return;
    if (document.querySelector('.sb-userpill')) return; // jangan double
    const slot = document.querySelector('[data-auth-slot]') || document.querySelector('#header');
    if (!slot) return;
    const el = document.createElement('div');
    el.className = 'auth-crumb';
    el.innerHTML = `
      <span>${sess.username || '-'}</span>
      <span class="sep">•</span>
      <span>${sess.role || '-'}</span>
      <span class="sep">•</span>
      <span>${sess.area || '-'}</span>
    `;
    slot.appendChild(el);
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
      ensureScript(QUOTES_JS, () => {
        if (typeof window.SIMBEDA_FOOTER_BOOT === 'function') window.SIMBEDA_FOOTER_BOOT();
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

    // Render auth (user pill + crumb fallback)
    const sess = getSession();
    decorateNavbarWithAuth(sess);
    renderAuthCrumb(sess);
  }

  document.addEventListener('DOMContentLoaded', loadShell);
})();

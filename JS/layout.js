// SIMBEDA - Layout injector (ABS PATHS + footer quotes + user pill + hide login CTA on Home)
(function () {
  'use strict';

  const CSS_LIST    = ['/CSS/Roboto.css', '/CSS/transition.css', '/CSS/header.css', '/CSS/footer.css'];
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
    sc.src = src; sc.defer = true;
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

  // HILANGKAN CTA "Masuk ke Sistem" di beranda (apa pun markup-nya)
  function hideHomeLoginCTAs() {
    if (!isHome()) return;
    const selectors = [
      'a[href="/HTML/login.html"]',
      'a[href="HTML/login.html"]',
      'a[href="/login.html"]',
      'a[href="login.html"]',
      '#cta-login', '.cta-login', '.login-cta', '[data-hide-on-home="login"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      // hapus node CTA
      el.remove();
      // jika parent kosong dengan kelas card/hero, bisa disembunyikan biar rapi
      const p = el.parentElement;
      if (p && p.childElementCount === 0 && /(card|hero|section|cta)/i.test(p.className||'')) {
        p.style.display = 'none';
      }
    });
  }

  function decorateNavbarWithAuth(sess) {
    const nav = document.querySelector('.sb-nav');
    if (!nav) return;
    const loginLink = nav.querySelector('.sb-link-login');

    // Beranda: jangan tampilkan "Masuk" di navbar
    if (isHome() && loginLink) loginLink.remove();

    // Jika sudah login → ganti dengan pill user + logout
    if (sess) {
      const pill = document.createElement('div');
      pill.className = 'sb-userpill';
      pill.innerHTML = `
        <span class="sb-user" title="${sess.area || ''}">${sess.username || '-'}</span>
        <button id="sb-logout" class="sb-logout" type="button" title="Keluar dari sistem">Logout</button>
      `;
      if (loginLink) loginLink.replaceWith(pill); else nav.appendChild(pill);
      pill.querySelector('#sb-logout').addEventListener('click', (e) => {
        e.preventDefault();
        try { localStorage.removeItem('simbeda_auth'); } catch(_) {}
        window.location.assign('/HTML/login.html');
      });
    }
  }

  function renderAuthCrumb(sess) {
    if (!sess) return;
    if (document.querySelector('.sb-userpill')) return;
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
    CSS_LIST.forEach(injectCssOnce);

    const headerHost = document.getElementById('header') || (() => {
      const d = document.createElement('div'); d.id = 'header'; document.body.prepend(d); return d;
    })();
    const footerHost = document.getElementById('footer') || (() => {
      const d = document.createElement('div'); d.id = 'footer'; document.body.appendChild(d); return d;
    })();

    try { headerHost.innerHTML = await fetchHtml(HEADER_HTML); } catch (e) { console.error(e); }
    try {
      footerHost.innerHTML = await fetchHtml(FOOTER_HTML);
      ensureScript(QUOTES_JS, () => {
        if (typeof window.SIMBEDA_FOOTER_BOOT === 'function') window.SIMBEDA_FOOTER_BOOT();
      });
    } catch (e) { console.error(e); }

    try {
      const path = location.pathname.replace(/\/+/g, '/');
      document.querySelectorAll('[data-nav]').forEach(a => {
        const target = a.getAttribute('data-nav');
        if (path.endsWith(target)) a.classList.add('active');
      });
    } catch (_) {}

    const sess = getSession();
    decorateNavbarWithAuth(sess);
    renderAuthCrumb(sess);

    // ← ini penting: hapus CTA login di beranda
    hideHomeLoginCTAs();
  }

  document.addEventListener('DOMContentLoaded', loadShell);
})();

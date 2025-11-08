/* layout.js — SIMBEDA Dumai (final)
 * - Inject Roboto + base
 * - Robust fetch header/footer (GitHub Pages)
 * - Auth Guard (public whitelist) + redirect
 * - Navbar account: show name/role/unit + Logout
 * - Breadcrumb custom label map
 * - Helper scope peran (window.getUserScope)
 */

(function(){
  // ===== Utilities =====
  const head = document.head || document.getElementsByTagName('head')[0];

  function addLink(rel, href){
    const l = document.createElement('link');
    l.rel = rel; l.href = href; head.appendChild(l);
  }
  function addStyle(css){
    const s = document.createElement('style'); s.textContent = css; head.appendChild(s);
  }
  function loadScript(src, {defer=true}={}){
    return new Promise((resolve,reject)=>{
      const s = document.createElement('script');
      s.src = src; s.defer = defer;
      s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  async function fetchText(paths){
    const errs = [];
    for(const p of paths){
      try{
        const r = await fetch(p, {cache:'no-cache'});
        if(r.ok) return await r.text();
        errs.push(r.status);
      }catch(e){ errs.push(e.message); }
    }
    throw new Error('Failed fetch: '+paths.join(' | ')+' :: '+errs.join(', '));
  }
  function escapeHTML(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m])); }

  // ===== Base font & transition =====
  addLink('preconnect','https://fonts.googleapis.com');
  addLink('preconnect','https://fonts.gstatic.com');
  addLink('stylesheet','https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
  addStyle(`:root{--t:.18s ease} html,body{font-family:Roboto,system-ui,-apple-system,"Segoe UI",Arial,"Noto Sans","Helvetica Neue",sans-serif} a,button{transition:all var(--t)}`);


  // ===== Auth Guard =====
  const PUBLIC_PATHS = [
    '/', 
    '/index.html',
    '/modules/login/login.html',
    '/modules/login/',
    '/assets/',
    '/css/', '/js/', '/components/', '/modules/home/'
  ];
  function isPublicPath(pathname){
    if(pathname === '/' || pathname === '/index.html') return true;
    return PUBLIC_PATHS.some(p => pathname.startsWith(p));
  }
  function readSession(){
    try{
      const raw = localStorage.getItem('session_user');
      if(!raw) return null;
      const o = JSON.parse(raw);
      if(o && (o.name || o.username)) return o;
      return null;
    }catch(_){ return null; }
  }
  (function enforceAuth(){
    const path = window.location.pathname;
    if(isPublicPath(path)) return;
    const s = readSession();
    if(!s){
      const back = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.replace(`/modules/login/login.html?redirect=${back}`);
    }
  })();


  // ===== Robust path and injection for header/footer =====
  const headerHTMLPaths = ['/components/header/header.html', './components/header/header.html'];
  const footerHTMLPaths = ['/components/footer/footer.html', './components/footer/footer.html'];
  const headerCSS = '/components/header/header.css';
  const footerCSS = '/components/footer/footer.css';
  const quotesJS  = '/components/footer/quotes.js';

  function ensureMount(sel, tag){
    let el = document.querySelector(sel);
    if(!el){
      el = document.createElement(tag);
      (sel.startsWith('header') ? document.body.prepend(el) : document.body.appendChild(el));
    }
    return el;
  }
  const hdrMount = ensureMount('header.app-header', 'header');
  const ftrMount = ensureMount('footer.app-footer', 'footer');

  Promise.all([ fetchText(headerHTMLPaths), fetchText(footerHTMLPaths) ])
    .then(async ([hdrHTML, ftrHTML])=>{
      addLink('stylesheet', headerCSS);
      addLink('stylesheet', footerCSS);

      hdrMount.outerHTML = hdrHTML;
      ftrMount.outerHTML = ftrHTML;

      const headerEl = document.querySelector('header.app-header') || document.querySelector('header');
      try{ await loadScript(quotesJS); }catch(_){ /* optional */ }

      hydrateAccount(headerEl);
      renderBreadcrumb(document.getElementById('breadcrumb'));
    })
    .catch(e=>console.error('Inject header/footer gagal:', e));


  // ===== Account (navbar) & Logout =====
  function logout(){
    try{ localStorage.removeItem('session_user'); }catch(_){}
    window.location.href = '/';
  }
  function hydrateAccount(headerEl){
    const account = (headerEl || document).querySelector('#account-area');
    if(!account) return;

    const s = readSession();
    if(!s){
      account.innerHTML = `<a class="btn btn-login" href="/modules/login/login.html">Masuk</a>`;
      return;
    }
    const displayName = s.name || s.username || 'Pengguna';
    const role  = s.role ? String(s.role) : '';
    const unit  = s.unit ? ` · ${s.unit}` : '';
    account.innerHTML = `
      <div class="user-chip" title="${escapeHTML(displayName)}">
        <span class="name">${escapeHTML(displayName)}</span>
        <span class="meta">${escapeHTML(role)}${escapeHTML(unit)}</span>
      </div>
      <button class="btn btn-logout" id="btn-logout">Keluar</button>
    `;
    account.querySelector('#btn-logout')?.addEventListener('click', logout);
  }


  // ===== Breadcrumb (custom label map) =====
  const TITLE_MAP = {
    'modules': 'Modul',
    'dashboard': 'Dashboard',
    'lapor_warga': 'Lapor Warga',
    'laporan_cepat': 'Laporan Cepat',
    'agenda': 'Agenda',
    'nota_dinas': 'Nota Dinas',
    'login': 'Masuk'
  };
  function toLabel(part){
    const base = part.replace('.html','').replace(/_/g,'-');
    if (TITLE_MAP[base]) return TITLE_MAP[base];
    if (TITLE_MAP[part]) return TITLE_MAP[part];
    return base.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
  }
  function renderBreadcrumb(host){
    if(!host) return;
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if(parts.length === 0){ host.innerHTML = `<span>Beranda</span>`; return; }

    const crumbs = [`<a href="/">Beranda</a>`];
    let acc = '';
    for(let i=0;i<parts.length;i++){
      acc += '/'+parts[i];
      const isLast = i === parts.length-1;
      const label = toLabel(parts[i]);
      if(isLast){ crumbs.push(`<span>${label}</span>`); }
      else{ crumbs.push(`<a href="${acc}/">${label}</a>`); }
    }
    host.innerHTML = crumbs.join(' / ');
  }


  // ===== Role/Scope Helper =====
  function guessLevelFromUnit(unit){
    if(!unit) return 'kota';
    try{
      if (typeof CONFIG !== 'undefined' && CONFIG?.wilayah){
        const w = CONFIG.wilayah;
        if (Array.isArray(w.kecamatan) && w.kecamatan.includes(unit)) return 'kecamatan';
        if (w.kelurahan){
          for (const k in w.kelurahan){
            if (Array.isArray(w.kelurahan[k]) && w.kelurahan[k].includes(unit)) return 'kelurahan';
          }
        }
      }
    }catch(_){}
    return 'kota';
  }
  window.getUserScope = function(){
    const s = (function(){ try{ return JSON.parse(localStorage.getItem('session_user')||'null'); }catch(_){ return null; }})();
    if(!s) return { level:'public', unit:null, label:'Publik' };
    const level = s.level || guessLevelFromUnit(s.unit);
    const role  = s.role || 'User';
    const name  = s.name || s.username || 'User';
    const label = s.unit ? `${role} ${s.unit}` : role;
    return { level, unit: s.unit || null, label, name, role };
  };

})();

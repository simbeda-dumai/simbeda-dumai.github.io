/* layout.js — MINIMAL + HEADER/FOOTER INJECTION (ABSOLUTE PATHS, UX-PRESERVING)
 * Fitur:
 * 1) Auth Guard (non-public redirect ke login).
 * 2) Account Hydration (jika #account-area ada): Nama + (Role · Unit) + Logout.
 * 3) Breadcrumb (jika #breadcrumb ada).
 * 4) Auto-Inject Header & Footer dari /components/header/footer (ABSOLUTE), dengan fallback relatif.
 *    - Memuat CSS header/footer
 *    - Menyisipkan quotes.js footer (jika ada)
 *    - Tidak menambah style lain, tidak memodifikasi UX selain menampilkan header/footer sesuai file kamu.
 */
(function(){
  // ---------- Helpers ----------
  function readSession(){
    try{
      const raw = localStorage.getItem('session_user');
      if(!raw) return null;
      const o = JSON.parse(raw);
      return (o && (o.name || o.username)) ? o : null;
    }catch(_){ return null; }
  }
  function logout(){
    try{ localStorage.removeItem('session_user'); }catch(_){}
    location.href = '/';
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[m])); }
  function addLink(rel, href){ var l=document.createElement('link'); l.rel=rel; l.href=href; document.head.appendChild(l); return l; }
  function loadScript(src){ return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=src; s.defer=true; s.onload=res; s.onerror=rej; document.body.appendChild(s); }); }
  function ensureEl(selector, tag){
    var el = document.querySelector(selector);
    if(el) return el;
    el = document.createElement(tag);
    if(tag.toLowerCase()==='header'){ document.body.prepend(el); }
    else { document.body.appendChild(el); }
    return el;
  }
  async function fetchText(paths){
    for(var i=0;i<paths.length;i++){
      try{
        var r = await fetch(paths[i], {cache:'no-cache'});
        if(r.ok) return await r.text();
      }catch(_){}
    }
    throw new Error('Failed to fetch: ' + paths.join(' | '));
  }

  // ---------- Auth Guard ----------
  (function guard(){
    const PUBLIC = [
      '/', '/index.html',
      '/modules/login/', '/modules/login/login.html',
      '/assets/', '/css/', '/js/', '/components/', '/modules/home/'
    ];
    const p = location.pathname;
    const isPublic = (p === '/' || p === '/index.html' || PUBLIC.some(x => p.startsWith(x)));
    if (!isPublic && !readSession()){
      const back = encodeURIComponent(location.pathname + location.search);
      location.replace('/modules/login/login.html?redirect=' + back);
    }
  })();

  // ---------- Inject Header & Footer (ABS first, then relative fallback) ----------
  (function injectHF(){
    var headerMount = ensureEl('header.app-header','header');
    var footerMount = ensureEl('footer.app-footer','footer');

    // Load CSS (non-blocking if sudah ada)
    addLink('stylesheet','/components/header/header.css');
    addLink('stylesheet','/components/footer/footer.css');

    Promise.all([
      fetchText(['/components/header/header.html','./components/header/header.html']),
      fetchText(['/components/footer/footer.html','./components/footer/footer.html'])
    ]).then(function(arr){
      var hdrHTML = arr[0], ftrHTML = arr[1];
      // Replace mounts with fetched HTML (do not alter internal classes)
      headerMount.outerHTML = hdrHTML;
      footerMount.outerHTML = ftrHTML;
      // Load quotes.js if available
      loadScript('/components/footer/quotes.js').catch(function(){});
      // After header exists in DOM, hydrate account + breadcrumb
      try{
        hydrateAccount();
        renderBreadcrumb();
      }catch(_){}
    }).catch(function(e){
      // Fallback: if fetch fails, biarkan halaman tetap tampil tanpa header/footer injected
      console.warn('Header/Footer injection failed:', e);
    });
  })();

  // ---------- Account Hydration (non-intrusive) ----------
  function hydrateAccount(){
    var host = document.getElementById('account-area');
    if(!host) return; // hormati UX bila kontainer tak ada
    var s = readSession();
    if(!s){
      // Biarkan tombol "Masuk" yang sudah ada.
      return;
    }
    var name = s.name || s.username || 'Pengguna';
    var role = s.role ? String(s.role) : '';
    var unit = s.unit ? (' · ' + s.unit) : '';
    host.innerHTML =
      '<span class="user-name">'+esc(name)+'</span>' +
      ((role || unit) ? '<span class="user-meta">'+esc(role+unit)+'</span>' : '') +
      '<button id="btn-logout" class="btn btn-logout" type="button">Keluar</button>';
    var btn = document.getElementById('btn-logout');
    if(btn){ btn.addEventListener('click', logout); }
  }

  // ---------- Breadcrumb (aman) ----------
  function renderBreadcrumb(){
    var box = document.getElementById('breadcrumb');
    if(!box) return;
    var TITLE_MAP = { modules:'Modul', dashboard:'Dashboard', lapor_warga:'Lapor Warga', laporan_cepat:'Laporan Cepat', login:'Masuk' };
    var parts = location.pathname.split('/').filter(Boolean);
    if(parts.length === 0){ box.innerHTML = '<span>Beranda</span>'; return; }
    function toLabel(part){
      var base = part.replace('.html','').replace(/_/g,'-');
      return TITLE_MAP[base] || base.split('-').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' ');
    }
    var crumbs = ['<a href=\"/\">Beranda</a>'];
    var acc = '';
    for(var i=0;i<parts.length;i++){
      acc += '/' + parts[i];
      var last = i === parts.length - 1;
      var label = toLabel(parts[i]);
      if(last) crumbs.push('<span>'+label+'</span>');
      else crumbs.push('<a href=\"'+acc+'/\">'+label+'</a>');
    }
    box.innerHTML = crumbs.join(' / ');
  }

  // In case header/footer tidak termuat (misal cache terblok), coba hydrate setelah DOM ready juga.
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      try{ hydrateAccount(); renderBreadcrumb(); }catch(_){}
    });
  } else {
    try{ hydrateAccount(); renderBreadcrumb(); }catch(_){}
  }
})();
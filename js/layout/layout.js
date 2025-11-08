/* layout.js — MINIMAL FEATURE PACK (ABSOLUTE PATHS, UX-PRESERVING)
 * Fitur:
 * 1) Auth Guard: halaman non-publik redirect ke login jika belum login.
 * 2) Account Hydration: jika #account-area ada dan user login, tampilkan Nama + (Role · Unit) + tombol Keluar.
 *    Jika tidak login, biarkan tombol "Masuk" yang sudah ada — tidak diubah.
 * 3) Breadcrumb: render ke #breadcrumb kalau elemennya ada.
 * Catatan: Tidak mengubah CSS/HTML kamu. Semua path ABSOLUTE (/components, /modules, /css, /js, /assets).
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

  // ---------- Account Hydration (non-intrusive) ----------
  (function hydrateAccount(){
    const host = document.getElementById('account-area');
    if(!host) return; // hormati UX kamu bila tidak ada kontainer

    const s = readSession();
    if(!s){
      // Biarkan tombol "Masuk" yang sudah ada di HTML kamu.
      return;
    }
    const name = s.name || s.username || 'Pengguna';
    const role = s.role ? String(s.role) : '';
    const unit = s.unit ? (' · ' + s.unit) : '';
    host.innerHTML =
      '<span class="user-name">'+esc(name)+'</span>' +
      ((role || unit) ? '<span class="user-meta">'+esc(role+unit)+'</span>' : '') +
      '<button id="btn-logout" class="btn btn-logout" type="button">Keluar</button>';
    host.querySelector('#btn-logout')?.addEventListener('click', logout);
  })();

  // ---------- Breadcrumb (aman) ----------
  (function breadcrumb(){
    const box = document.getElementById('breadcrumb');
    if(!box) return;
    const TITLE_MAP = { modules:'Modul', dashboard:'Dashboard', lapor_warga:'Lapor Warga', laporan_cepat:'Laporan Cepat', login:'Masuk' };
    const parts = location.pathname.split('/').filter(Boolean);
    if(parts.length === 0){ box.innerHTML = '<span>Beranda</span>'; return; }
    function toLabel(part){
      const base = part.replace('.html','').replace(/_/g,'-');
      return TITLE_MAP[base] || base.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
    }
    const crumbs = ['<a href=\"/\">Beranda</a>'];
    let acc = '';
    for(let i=0;i<parts.length;i++){
      acc += '/' + parts[i];
      const last = i === parts.length - 1;
      const label = toLabel(parts[i]);
      if(last) crumbs.push('<span>'+label+'</span>');
      else crumbs.push('<a href=\"'+acc+'/\">'+label+'</a>');
    }
    box.innerHTML = crumbs.join(' / ');
  })();
})();
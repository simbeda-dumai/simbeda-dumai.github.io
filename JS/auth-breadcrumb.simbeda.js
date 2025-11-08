/* auth-breadcrumb.simbeda.js — companion ONLY
 * - Tidak mengubah layout.js & CSS kamu.
 * - User-site (BASE = ""), aman untuk https://simbeda-dumai.github.io/
 * Fitur:
 * 1) #account-area: jika session ada → tampilkan Nama + (Role · Unit) + tombol Keluar
 * 2) #breadcrumb: teks "Beranda / …" dari URL (tanpa gaya)
 * 3) (Opsional) Auth Guard: OFF by default
 * Sumber wilayah: window.SIMBEDA_WILAYAH (kecamatan & kelurahan).  // dipakai hanya untuk validasi unit
 */

(function(){
  var ENABLE_AUTH_GUARD = false; // ubah true jika mau paksa login utk halaman non-publik
  var BASE = ""; // user/organization site di GitHub Pages

  function readSession(){
    try{
      var raw = localStorage.getItem('session_user');
      if(!raw) return null;
      var o = JSON.parse(raw);
      return (o && (o.name || o.username)) ? o : null;
    }catch(_){ return null; }
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[m])); }
  function logout(){
    try{ localStorage.removeItem('session_user'); }catch(_){}
    location.href = BASE || '/';
  }

  // --- opsional: normalisasi label role/unit dengan data wilayah kamu
  function normalizeMeta(u){
    var role = u && u.role ? String(u.role) : "";
    var unit = u && u.unit ? String(u.unit) : "";
    try{
      var W = (typeof window !== 'undefined' && window.SIMBEDA_WILAYAH) ? window.SIMBEDA_WILAYAH : null;
      if (W && Array.isArray(W.kecamatan)) {
        // Jika unit = salah satu kecamatan, biarkan
        // Jika unit = salah satu kelurahan, biarkan
        // (Tidak mengubah format; hanya validasi ringan)
        var isKec = W.kecamatan.includes(unit);
        var isKel = false;
        if (W.kelurahanByKecamatan && typeof W.kelurahanByKecamatan === 'object') {
          for (var k in W.kelurahanByKecamatan) {
            if (Array.isArray(W.kelurahanByKecamatan[k]) && W.kelurahanByKecamatan[k].includes(unit)) { isKel = true; break; }
          }
        }
        // kalau unit kosong/invalid, kosongkan saja (tidak maksa)
        if (!isKec && !isKel) unit = unit;
      }
    }catch(_){}
    return { role: role, unit: unit };
  }

  // --- Account area ---
  function hydrateAccount(){
    var host = document.getElementById('account-area');
    if(!host) return; // hormati UX kamu kalau tidak ada kontainer
    var s = readSession();
    if(!s) return; // biarkan tombol "Masuk" bawaan header.html

    var meta = normalizeMeta(s);
    var name = s.name || s.username || 'Pengguna';
    var suffix = (meta.role || meta.unit) ? (meta.role + (meta.unit ? (' · ' + meta.unit) : '')) : '';

    host.innerHTML =
      '<span class="user-name">'+esc(name)+'</span>' +
      (suffix ? '<span class="user-meta">'+esc(suffix)+'</span>' : '') +
      '<button id="btn-logout" class="btn btn-logout" type="button">Keluar</button>';

    var btn = document.getElementById('btn-logout');
    if (btn) btn.addEventListener('click', logout);
  }

  // --- Breadcrumb (teks saja) ---
  function renderBreadcrumb(){
    var box = document.getElementById('breadcrumb');
    if(!box) return;
    var parts = location.pathname.split('/').filter(Boolean);
    // user-site → tidak perlu buang segmen base
    if (parts.length === 0){ box.textContent = 'Beranda'; return; }

    function toLabel(seg){
      var s = seg.replace('.html','').replace(/_/g,'-');
      return s.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
    }

    var labels = ['Beranda'];
    for (var i=0;i<parts.length;i++) labels.push(toLabel(parts[i]));
    box.textContent = labels.join(' / ');
  }

  // --- (opsional) Auth guard ---
  function authGuard(){
    if(!ENABLE_AUTH_GUARD) return;
    var PUBLIC = ['/', '/index.html', '/modules/login/', '/assets/', '/css/', '/js/', '/components/', '/modules/home/'];
    var p = location.pathname;
    var isPublic = (p === '/' || p === '/index.html' || PUBLIC.some(x => p.startsWith(x)));
    if (!isPublic && !readSession()){
      var back = encodeURIComponent(location.pathname + location.search);
      location.replace('/modules/login/login.html?redirect=' + back);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      try{ authGuard(); hydrateAccount(); renderBreadcrumb(); }catch(_){}
    });
  } else {
    try{ authGuard(); hydrateAccount(); renderBreadcrumb(); }catch(_){}
  }
})();

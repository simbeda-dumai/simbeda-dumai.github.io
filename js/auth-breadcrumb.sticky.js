/* auth-breadcrumb.sticky.js — companion (TIDAK mengubah layout.js atau CSS)
 * Tujuan:
 * - Setelah login, tombol "Masuk" di header otomatis berubah menjadi: Nama + (Role · Unit) + tombol "Keluar".
 * - Bekerja walaupun header/footer di-inject belakangan (pakai MutationObserver + retry).
 * - Breadcrumb text-only ke #breadcrumb (jika ada).
 * - Auth guard: OFF (bisa diaktifkan dengan ENABLE_AUTH_GUARD = true).
 *
 * Syarat minimal:
 * - Di header.html kamu ada elemen: <div id="account-area">…</div>
 *   (kalau belum ada, tambahkan satu baris ini ke header.html tanpa ubah style)
 * - (Opsional) <div id="breadcrumb"></div> kalau mau breadcrumb tampil.
 * - Login kamu menyimpan data user ke localStorage key "session_user"
 *   contoh:
 *   localStorage.setItem('session_user', JSON.stringify({name:'Kalaksa BPBD', role:'Kalaksa', unit:'BPBD'}));
 */

(function(){
  var ENABLE_AUTH_GUARD = false;     // ubah ke true jika mau wajib login untuk halaman non-publik
  var SESSION_KEY = 'session_user';  // samakan dengan login kamu
  var lastHydratedValue = null;
  var observed = false;

  function esc(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[m]);
    });
  }
  function readSession(){
    try{
      var raw = localStorage.getItem(SESSION_KEY);
      if(!raw) return null;
      var o = JSON.parse(raw);
      return (o && (o.name || o.username)) ? o : null;
    }catch(_){ return null; }
  }
  function logout(){
    try{ localStorage.removeItem(SESSION_KEY);}catch(_){}
    // reload supaya header balik ke "Masuk" dan state bersih
    location.reload();
  }

  // ---- Render Akun (ganti "Masuk" -> Nama + Logout) ----
  function mountAccount(){
    var host = document.getElementById('account-area');
    if(!host) return false;

    var s = readSession();
    if(!s) return false; // biarkan tombol "Masuk" bawaan header kamu

    var v = localStorage.getItem(SESSION_KEY);
    if (v === lastHydratedValue && host.querySelector('#btn-logout')) return true; // sudah di-hydrate

    var name = s.name || s.username || 'Pengguna';
    var role = s.role ? String(s.role) : '';
    var unit = s.unit ? (' · ' + s.unit) : '';

    host.innerHTML =
      '<span class="user-name">'+esc(name)+'</span>' +
      ((role || unit) ? '<span class="user-meta">'+esc(role+unit)+'</span>' : '') +
      '<button id="btn-logout" class="btn btn-logout" type="button">Keluar</button>';

    var btn = document.getElementById('btn-logout');
    if(btn) btn.addEventListener('click', logout);

    lastHydratedValue = v;
    return true;
  }

  // ---- Breadcrumb (text-only, aman) ----
  function mountBreadcrumb(){
    var box = document.getElementById('breadcrumb');
    if(!box) return;
    var parts = location.pathname.split('/').filter(Boolean);
    if(parts.length === 0){ box.textContent = 'Beranda'; return; }

    function toLabel(p){
      var b = p.replace('.html','').replace(/_/g,'-');
      return b.split('-').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' ');
    }
    var labels = ['Beranda'];
    for (var i=0;i<parts.length;i++) labels.push(toLabel(parts[i]));
    box.textContent = labels.join(' / ');
  }

  // ---- (Opsional) Auth Guard ----
  function authGuard(){
    if(!ENABLE_AUTH_GUARD) return;
    var PUBLIC = ['/', '/index.html', '/modules/login/', '/assets/', '/css/', '/js/', '/components/', '/modules/home/'];
    var p = location.pathname;
    var isPub = (p === '/' || p === '/index.html' || PUBLIC.some(function(x){ return p.startsWith(x); }));
    if(!isPub && !readSession()){
      var back = encodeURIComponent(location.pathname + location.search);
      location.replace('/modules/login/login.html?redirect='+back);
    }
  }

  // ---- Hydrate sekali & pada event penting ----
  function tryHydrate(){
    mountAccount();
    mountBreadcrumb();
  }

  // DOM siap
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      authGuard();
      tryHydrate();
    });
  } else {
    authGuard();
    tryHydrate();
  }

  // Amati perubahan DOM (header/footer di-inject belakangan)
  function observe(){
    if (observed) return;
    observed = true;
    var obs = new MutationObserver(function(_muts){
      tryHydrate(); // murah, aman dipanggil sering
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
  observe();

  // Hydrate ulang kalau session berubah (login di tab lain, dll.)
  window.addEventListener('storage', function(e){
    if (e.key === SESSION_KEY){
      lastHydratedValue = null;
      tryHydrate();
    }
  });

  // Safety retry (kalau fetch header lambat)
  var retries = 20;
  (function tick(){
    if (retries-- <= 0) return;
    var ok = mountAccount();
    if (!ok) setTimeout(tick, 250);
  })();
})();

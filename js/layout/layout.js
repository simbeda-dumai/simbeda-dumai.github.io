/* layout.js — USER-SITE VERSION (BASE='')
 * Pakai ini jika situsmu di root domain: https://simbeda-dumai.github.io/...
 * Header/footer, auth, account, breadcrumb — TANPA ubah UX/CSS.
 */
(function(){
  var BASE = ''; // user/organization site -> root

  function readSession(){ try{ const raw=localStorage.getItem('session_user'); if(!raw) return null; const o=JSON.parse(raw); return (o&&(o.name||o.username))?o:null; }catch(_){ return null; } }
  function logout(){ try{ localStorage.removeItem('session_user'); }catch(_){ } location.href = '/'; }
  function esc(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[m])); }
  function addLink(rel,href){ var l=document.createElement('link'); l.rel=rel; l.href=href; document.head.appendChild(l); return l; }
  function loadScript(src){ return new Promise((res,rej)=>{ var s=document.createElement('script'); s.src=src; s.defer=true; s.onload=res; s.onerror=rej; document.body.appendChild(s); }); }
  function ensureEl(sel,tag){ var el=document.querySelector(sel); if(el) return el; el=document.createElement(tag); if(tag.toLowerCase()==='header') document.body.prepend(el); else document.body.appendChild(el); return el; }
  async function fetchText(paths){ for (var i=0;i<paths.length;i++){ try{ var r=await fetch(paths[i],{cache:'no-cache'}); if(r.ok) return await r.text(); }catch(_){ } } throw new Error('fetch fail'); }

  // Auth guard
  (function(){
    const PUBLIC=['/','/index.html','/modules/login/','/modules/login/login.html','/assets/','/css/','/js/','/components/','/modules/home/'];
    const p=location.pathname;
    const isPublic = (p==='/'||p==='/index.html'||PUBLIC.some(x=>p.startsWith(x)));
    if(!isPublic && !readSession()){
      const back=encodeURIComponent(location.pathname+location.search);
      location.replace('/modules/login/login.html?redirect='+back);
    }
  })();

  // Inject header/footer
  (function(){
    var headerMount=ensureEl('header.app-header','header');
    var footerMount=ensureEl('footer.app-footer','footer');
    addLink('stylesheet','/components/header/header.css');
    addLink('stylesheet','/components/footer/footer.css');
    Promise.all([
      fetchText(['/components/header/header.html','./components/header/header.html']),
      fetchText(['/components/footer/footer.html','./components/footer/footer.html'])
    ]).then(([h,f])=>{
      headerMount.outerHTML=h; footerMount.outerHTML=f;
      loadScript('/components/footer/quotes.js').catch(()=>{});
      try{ hydrateAccount(); renderBreadcrumb(); }catch(_){}
    }).catch(e=>console.warn('HF inject fail',e));
  })();

  function hydrateAccount(){
    var host=document.getElementById('account-area'); if(!host) return;
    var s=readSession(); if(!s) return;
    var name=s.name||s.username||'Pengguna'; var role=s.role?String(s.role):''; var unit=s.unit?(' · '+s.unit):'';
    host.innerHTML='<span class="user-name">'+esc(name)+'</span>'+(role||unit?'<span class="user-meta">'+esc(role+unit)+'</span>':'')+'<button id="btn-logout" class="btn btn-logout" type="button">Keluar</button>';
    host.querySelector('#btn-logout')?.addEventListener('click',logout);
  }
  function renderBreadcrumb(){
    var box=document.getElementById('breadcrumb'); if(!box) return;
    var TITLE_MAP={modules:'Modul',dashboard:'Dashboard',lapor_warga:'Lapor Warga',laporan_cepat:'Laporan Cepat',login:'Masuk'};
    var parts=location.pathname.split('/').filter(Boolean);
    if(parts.length===0){ box.innerHTML='<span>Beranda</span>'; return; }
    function toLabel(p){ var b=p.replace('.html','').replace(/_/g,'-'); return TITLE_MAP[b]||b.split('-').map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' '); }
    var crumbs=['<a href=\"/\">Beranda</a>']; var acc='';
    for(var i=0;i<parts.length;i++){ acc+='/'+parts[i]; var last=i===parts.length-1; var label=toLabel(parts[i]); crumbs.push(last?'<span>'+label+'</span>':'<a href=\"'+acc+'/\">'+label+'</a>'); }
    box.innerHTML=crumbs.join(' / ');
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',()=>{ try{ hydrateAccount(); renderBreadcrumb(); }catch(_){}}); } else { try{ hydrateAccount(); renderBreadcrumb(); }catch(_){} }
})();
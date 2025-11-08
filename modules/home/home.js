(function(){
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));

  const readLS = (k)=>{ try{const r=localStorage.getItem(k); if(!r) return []; const d=JSON.parse(r); return Array.isArray(d)?d:(typeof d==='object'?Object.values(d):[]);}catch(_){return[];} };
  const fmt = (v)=>{ try{const d=new Date(v); if(isNaN(d))return'—'; return d.toLocaleString('id-ID',{timeZone:'Asia/Jakarta',year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'});}catch(_){return'—';} };
  const escapeHTML = (s)=>String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // Stats
  const lw = readLS('lapor_warga'); const lc = readLS('laporan_cepat');
  const set = (id,v)=>{const e=document.getElementById(id); if(e) e.textContent=v;};
  set('stat-lapor-warga', lw.length); set('stat-laporan-cepat', lc.length);

  const times=[...lw.map(i=>i.created_at||i.tanggal||i.time||i.date), ...lc.map(i=>i.created_at||i.tanggal||i.time||i.date)]
    .filter(Boolean).map(v=>new Date(v)).filter(d=>!isNaN(d)).sort((a,b)=>b-a);
  set('stat-update', times[0]?fmt(times[0]):'—');

  // Wilayah info
  function getWilayah(){ 
    try{
      if(typeof CONFIG!=='undefined' && CONFIG?.wilayah){
        const w=CONFIG.wilayah, kec=Array.isArray(w.kecamatan)?w.kecamatan:[], kelMap=w.kelurahan||{};
        const kelTotal=Object.values(kelMap).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0);
        return {kec, kelMap, kelTotal: kelTotal||36};
      }
    }catch(_){}
    return {kec:['Dumai Barat','Dumai Timur','Bukit Kapur','Sungai Sembilan','Medang Kampai','Dumai Kota','Dumai Selatan'], kelMap:{}, kelTotal:36};
  }
  const w = getWilayah();
  set('stat-kecamatan', w.kec.length); const kelF=document.getElementById('stat-kelurahan'); if(kelF) kelF.textContent=w.kelTotal;
  const k1=document.getElementById('wilayah-kec-count'); if(k1) k1.textContent=w.kec.length;
  const k2=document.getElementById('wilayah-kel-count'); if(k2) k2.textContent=w.kelTotal;

  // Toggle detail wilayah
  $('#btn-toggle-wilayah')?.addEventListener('click', ()=>{
    const box=$('#wilayah-detail'); if(!box) return;
    if(box.hasAttribute('hidden')){
      box.innerHTML='';
      if(Object.keys(w.kelMap).length){
        for(const kec of Object.keys(w.kelMap)){
          const arr=Array.isArray(w.kelMap[kec])?w.kelMap[kec]:[];
          const div=document.createElement('div');
          div.className='wilayah-group';
          div.innerHTML=`<h3>${kec} <small>(${arr.length} kelurahan)</small></h3>
          <div class="tags">${arr.map(n=>`<span class="tag">${n}</span>`).join('')}</div>`;
          box.appendChild(div);
        }
      }else{
        const div=document.createElement('div');
        div.className='wilayah-group';
        div.innerHTML=`<h3>Daftar Kecamatan</h3><div class="tags">${w.kec.map(n=>`<span class="tag">${n}</span>`).join('')}</div>`;
        box.appendChild(div);
      }
      box.removeAttribute('hidden');
      $('#btn-toggle-wilayah').textContent='Sembunyikan Rincian';
    }else{
      box.setAttribute('hidden','hidden');
      $('#btn-toggle-wilayah').textContent='Tampilkan Rincian';
    }
  });

  // Lists
  function bindList(id, arr){
    const ul=document.getElementById(id); if(!ul) return;
    const items=arr.slice(-5).reverse();
    if(items.length===0){ ul.innerHTML=`<li><span class="item-title">Belum ada data.</span><span class="item-meta">—</span></li>`; return; }
    ul.innerHTML='';
    for(const it of items){
      const title=it.judul||it.title||it.kejadian||it.peristiwa||it.topik||it.subject||'—';
      const time=it.created_at||it.tanggal||it.time||it.date||null;
      const lokasi=it.lokasi||it.alamat||it.kelurahan||it.kecamatan||'';
      const li=document.createElement('li');
      li.innerHTML=`<div><div class="item-title">${escapeHTML(String(title))}</div>
        <div class="item-meta">${fmt(time)}${lokasi?(' · '+escapeHTML(String(lokasi))):''}</div></div>
        <div><span class="badge">baru</span></div>`;
      ul.appendChild(li);
    }
  }
  bindList('list-lapor-warga', lw);
  bindList('list-laporan-cepat', lc);

  // Sapaan jika login
  document.addEventListener('DOMContentLoaded', ()=>{
    if(typeof getUserScope==='function'){
      const scope=getUserScope();
      const hint=document.querySelector('.hero__hint');
      if(scope && scope.name && hint) hint.innerHTML=`<small>Halo <strong>${escapeHTML(scope.name)}</strong>${scope.unit?`, ${escapeHTML(scope.unit)}`:''} — akses cepat tersedia di bawah.</small>`;
    }
  });

  // Map lite (deferred)
  $('#btn-load-map')?.addEventListener('click', ()=>{
    const cont=$('#map-container'); const ph=$('#map-placeholder');
    if(!cont||!ph) return; ph.setAttribute('hidden','hidden'); cont.removeAttribute('hidden');
    cont.innerHTML=`<div style="height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;">
      <strong>Peta mini (stub)</strong>
      <span>Untuk performa, peta interaktif tidak dimuat di Beranda.</span>
      <a class="btn sm" href="/modules/dashboard/dashboard.html">Lihat peta di Dashboard</a></div>`;
  });
})();

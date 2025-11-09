// SIMBEDA - Lapor Warga (publik + GPS + dropdown Jenis + manual hanya saat "Lainnya")
(function () {
  'use strict';

  const KEY = 'lapor_warga';
  const $ = (s) => document.querySelector(s);

  const JENIS_LIST = [
    'Banjir',
    'Kebakaran',
    'Angin Kencang / Puting Beliung',
    'Pohon Tumbang',
    'Tanah Longsor',
    'Kebakaran Lahan',
    'Gelombang Pasang / Rob',
    'Kecelakaan',
    'Lainnya' // ← manual hanya saat ini dipilih
  ];

  function readLS(key, def){ try{ const raw=localStorage.getItem(key); return raw?JSON.parse(raw):def; }catch(_){ return def; } }
  function writeLS(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(_){} }
  function nowLocalISO(){ const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,16); }

  // wilayah (non-role)
  function populateWilayah(){
    const kec=$('#kecamatan'); const kel=$('#kelurahan'); const W=window.SIMBEDA_WILAYAH;
    if(!W || !kec || !kel) return;
    kec.innerHTML = '<option value="">— Pilih kecamatan —</option>';
    W.kecamatan.forEach(k => kec.appendChild(new Option(k, k)));
    kec.addEventListener('change', ()=>{
      const v=kec.value.trim();
      kel.innerHTML = '<option value="">— Pilih kelurahan —</option>';
      if(!v) return;
      (W.kelurahanByKecamatan[v]||[]).forEach(nm => kel.appendChild(new Option(nm, nm)));
    });
  }

  // Jenis + manual hanya saat "Lainnya"
  function buildJenis(){
    const sel=$('#jenis'), wrap=$('#jenisManualWrap'), manual=$('#jenisManual');
    if(!sel||!wrap||!manual) return;

    sel.innerHTML='';
    // Placeholder
    sel.appendChild(new Option('— Pilih jenis —', '', true, true));
    sel.firstElementChild.disabled = true;

    // Opsi
    JENIS_LIST.forEach(txt=>{
      const val = (txt === 'Lainnya') ? 'manual' : txt;
      sel.appendChild(new Option(txt, val, false, false));
    });

    const toggle=()=>{
      const isManual = sel.value === 'manual';
      wrap.hidden = !isManual;
      if (!isManual) manual.value = '';
    };
    sel.addEventListener('change', toggle);
    toggle(); // awal pasti hidden
  }

  // GPS
  function setLocStatus(msg, ok=false){ const s=$('#loc-status'); if(!s) return; s.textContent=msg||''; s.style.color = ok ? '#99f59a' : '#ffd966'; }
  function enableGeoButton(){
    const btn=$('#btn-lokasi'), input=$('#lokasi'); if(!btn||!input) return;
    btn.addEventListener('click', async ()=>{
      setLocStatus('Mengambil lokasi… izinkan GPS.', true);
      if(!('geolocation' in navigator)){ setLocStatus('Perangkat tidak mendukung geolokasi.', false); return; }
      try{
        const pos=await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true,timeout:10000,maximumAge:0}));
        const lat=pos.coords.latitude, lng=pos.coords.longitude, acc=Math.round(pos.coords.accuracy||0);
        input.value = `lat:${lat.toFixed(6)} lng:${lng.toFixed(6)}`;
        setLocStatus(`Koordinat terset (±${acc} m).`, true);
      }catch(e){ setLocStatus('Gagal mengambil lokasi. Coba lagi atau isi manual.', false); }
    });
  }

  // form
  function readForm(){
    const selJenis = $('#jenis')?.value || '';
    const isManual = selJenis === 'manual';
    const manualJenis = isManual ? ($('#jenisManual')?.value || '').trim() : '';
    const jenisFinal = isManual ? manualJenis : selJenis;

    return {
      waktu: $('#waktu')?.value || new Date().toISOString(),
      kecamatan: $('#kecamatan')?.value || '',
      kelurahan: $('#kelurahan')?.value || '',
      lokasi: $('#lokasi')?.value || '',
      detail_lokasi: $('#detail_lokasi')?.value || '',
      jenis: jenisFinal,
      deskripsi: $('#deskripsi')?.value || ''
    };
  }

  function save(rec){ const arr=readLS(KEY, []); arr.unshift(rec); writeLS(KEY, arr); }
  function showMsg(t, ok=false){ const el=$('#msg'); if(!el) return; el.textContent=t||''; el.style.color=ok?'#7CFC7C':'#ffd966'; }

  function boot(){
    if($('#waktu') && !$('#waktu').value) $('#waktu').value = nowLocalISO();
    populateWilayah();
    buildJenis();
    enableGeoButton();

    $('#btn-kirim')?.addEventListener('click', (e)=>{
      e.preventDefault();
      const rec=readForm();

      if(!rec.kecamatan || !rec.kelurahan){ showMsg('Lengkapi kecamatan & kelurahan.', false); return; }
      if(!rec.jenis){ showMsg('Pilih/isi jenis kejadian.', false); return; }
      if(!rec.lokasi){ showMsg('Isi lokasi (alamat/koordinat).', false); return; }

      save(rec);
      showMsg('Laporan warga terkirim. (Marker akan tampil di Dashboard)', true);
      $('#deskripsi') && ($('#deskripsi').value = '');
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

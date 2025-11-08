// SIMBEDA - Laporan Cepat (role-aware + GPS → koordinat otomatis + kompatibel Dashboard)
(function () {
  'use strict';

  const KEY = 'laporan_cepat';
  const $ = (s) => document.querySelector(s);

  function getSession() {
    try { return JSON.parse(localStorage.getItem('simbeda_auth') || 'null'); }
    catch(_) { return null; }
  }

  function readLS(key, def) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; }
    catch(_) { return def; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(_) {}
  }

  function nowLocalISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  }

  // ————— Dropdown wilayah (dengan pembatasan role) —————
  function populateWilayah(sess) {
    const kec = $('#kecamatan'); const kel = $('#kelurahan');
    const lock = $('#kec-lock');
    if (!kec || !kel) return;

    const W = window.SIMBEDA_WILAYAH;
    if (!W || !Array.isArray(W.kecamatan)) return;

    // reset
    kec.innerHTML = '<option value="">— Pilih kecamatan —</option>';
    kel.innerHTML = '<option value="">— Pilih kelurahan —</option>';

    const role = (sess?.role || '').toLowerCase();  // "kota" / "kecamatan"
    const area = (sess?.area || '').trim();         // mis. "Dumai Kota"

    // Jika user kecamatan → kunci kecamatan ke area
    const areaIsKecamatan = W.kecamatan.includes(area);

    if (role === 'kecamatan' && areaIsKecamatan) {
      // isi satu opsi saja = area login
      const opt = document.createElement('option');
      opt.value = opt.textContent = area;
      kec.appendChild(opt);
      kec.value = area;
      kec.disabled = true;
      if (lock) lock.hidden = false;

      // isi kelurahan untuk area itu
      const list = (W.kelurahanByKecamatan && W.kelurahanByKecamatan[area]) || [];
      for (const nm of list) {
        const o = document.createElement('option');
        o.value = o.textContent = nm;
        kel.appendChild(o);
      }

    } else {
      // role kota / selain itu → bisa pilih seluruh kecamatan
      for (const k of W.kecamatan) {
        const opt = document.createElement('option');
        opt.value = opt.textContent = k;
        kec.appendChild(opt);
      }
      kec.addEventListener('change', () => {
        const val = kec.value.trim();
        kel.innerHTML = '<option value="">— Pilih kelurahan —</option>';
        if (!val) return;
        const list = (W.kelurahanByKecamatan && W.kelurahanByKecamatan[val]) || [];
        for (const nm of list) {
          const o = document.createElement('option');
          o.value = o.textContent = nm;
          kel.appendChild(o);
        }
      });

      // Auto-isi kelurahan jika user area adalah kecamatan valid
      if (areaIsKecamatan) {
        kec.value = area;
        kec.dispatchEvent(new Event('change'));
      }
    }
  }

  // ————— GPS → isi koordinat dalam format "lat:.. lng:.." —————
  function setLocStatus(msg, ok=false) {
    const s = $('#loc-status'); if (!s) return;
    s.textContent = msg || '';
    s.style.color = ok ? '#99f59a' : '#ffd966';
  }

  function enableGeoButton() {
    const btn = $('#btn-lokasi');
    const input = $('#lokasi');
    if (!btn || !input) return;

    btn.addEventListener('click', async () => {
      setLocStatus('Mengambil lokasi… izinkan GPS di browser.', true);
      if (!('geolocation' in navigator)) {
        setLocStatus('Perangkat tidak mendukung geolokasi.', false);
        return;
      }
      try {
        const pos = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(
            (p) => res(p),
            (e) => rej(e),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        });
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy || 0);
        const str = `lat:${lat.toFixed(6)} lng:${lng.toFixed(6)}`;
        input.value = str; // Dashboard parser akan menangkap format ini
        setLocStatus(`Koordinat terset (±${acc} m). Pastikan alamat ringkas tetap diisi jika perlu.`, true);
      } catch (e) {
        setLocStatus('Gagal mengambil lokasi. Coba lagi atau isi manual.', false);
      }
    });
  }

  // ————— CRUD localStorage —————
  function readForm() {
    return {
      waktu: $('#waktu')?.value || new Date().toISOString(),
      kecamatan: $('#kecamatan')?.value || '',
      kelurahan: $('#kelurahan')?.value || '',
      lokasi: $('#lokasi')?.value || '',
      jenis: $('#jenis')?.value || '',
      deskripsi: $('#deskripsi')?.value || ''
    };
  }

  function save(rec) {
    const arr = readLS(KEY, []);
    arr.unshift(rec);
    writeLS(KEY, arr);
  }

  function showMsg(txt, ok=false) {
    const el = $('#msg'); if (!el) return;
    el.textContent = txt || '';
    el.style.color = ok ? '#7CFC7C' : '#ffd966';
  }

  function resetForm(partial=false) {
    if (!partial) {
      $('#jenis') && ($('#jenis').value = '');
      $('#deskripsi') && ($('#deskripsi').value = '');
    }
    // lokasi tetap dipertahankan agar user bisa simpan beberapa kejadian dekat lokasi yang sama
  }

  function boot() {
    const sess = getSession();

    if ($('#waktu') && !$('#waktu').value) $('#waktu').value = nowLocalISO();

    populateWilayah(sess);
    enableGeoButton();

    const btn = $('#btn-simpan');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rec = readForm();

      // validasi minimal
      if (!rec.kecamatan || !rec.kelurahan || !rec.jenis) {
        showMsg('Lengkapi kecamatan/kelurahan/jenis.', false);
        return;
      }
      if (!rec.lokasi) {
        showMsg('Sertakan lokasi (alamat/koordinat).', false);
        return;
      }

      save(rec);
      showMsg('Laporan cepat disimpan. (Marker akan muncul di Dashboard)', true);
      resetForm();
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

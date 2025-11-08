// SIMBEDA - Laporan Cepat (guard aktif)
// Simpan ke localStorage('laporan_cepat') + isi dropdown dari SIMBEDA_WILAYAH bila tersedia
(function () {
  'use strict';

  const KEY = 'laporan_cepat';
  const $ = (s) => document.querySelector(s);

  function readLS(key, def) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; }
    catch(_) { return def; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(_) {}
  }

  function nowLocalISO() {
    // datetime-local butuh "YYYY-MM-DDTHH:MM"
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  }

  function populateWilayah() {
    const kec = $('#kecamatan'); const kel = $('#kelurahan');
    if (!kec || !kel) return;

    // Isi kecamatan dari window.SIMBEDA_WILAYAH (jika ada)
    const W = window.SIMBEDA_WILAYAH;
    if (!W || !Array.isArray(W.kecamatan)) return;

    // reset
    kec.innerHTML = '<option value="">— Pilih kecamatan —</option>';
    kel.innerHTML = '<option value="">— Pilih kelurahan —</option>';

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
  }

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

  function resetForm() {
    $('#lokasi') && ($('#lokasi').value = '');
    $('#jenis') && ($('#jenis').value = '');
    $('#deskripsi') && ($('#deskripsi').value = '');
  }

  function boot() {
    // default waktu sekarang
    if ($('#waktu') && !$('#waktu').value) $('#waktu').value = nowLocalISO();

    // isi dropdown wilayah jika ada config.js
    populateWilayah();

    const btn = $('#btn-simpan');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rec = readForm();
      if (!rec.kecamatan || !rec.kelurahan || !rec.jenis) {
        showMsg('Lengkapi kecamatan/kelurahan/jenis.', false);
        return;
      }
      save(rec);
      showMsg('Laporan cepat disimpan.', true);
      resetForm();
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

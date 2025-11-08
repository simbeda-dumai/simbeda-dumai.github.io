// SIMBEDA - Lapor Warga (tanpa guard)
// Simpan ke localStorage('lapor_warga') + isi dropdown dari SIMBEDA_WILAYAH bila tersedia
(function () {
  'use strict';

  const KEY = 'lapor_warga';
  const $ = (s) => document.querySelector(s);

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

  function populateWilayah() {
    const kec = $('#kecamatan'); const kel = $('#kelurahan');
    if (!kec || !kel) return;

    const W = window.SIMBEDA_WILAYAH;
    if (!W || !Array.isArray(W.kecamatan)) return;

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
      nama: $('#nama')?.value || '',
      kontak: $('#kontak')?.value || '',
      kecamatan: $('#kecamatan')?.value || '',
      kelurahan: $('#kelurahan')?.value || '',
      lokasi: $('#lokasi')?.value || '',
      kejadian: $('#kejadian')?.value || '',
      keterangan: $('#keterangan')?.value || ''
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
    ['nama','kontak','lokasi','kejadian','keterangan'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  function boot() {
    if ($('#waktu') && !$('#waktu').value) $('#waktu').value = nowLocalISO();
    populateWilayah();

    const btn = $('#btn-kirim');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rec = readForm();
      if (!rec.kecamatan || !rec.kelurahan || !rec.kejadian) {
        showMsg('Lengkapi kecamatan/kelurahan/kejadian.', false);
        return;
      }
      save(rec);
      showMsg('Laporan warga terkirim (tersimpan lokal).', true);
      resetForm();
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

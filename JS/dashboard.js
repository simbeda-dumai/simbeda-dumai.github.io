// SIMBEDA - Dashboard (Leaflet + Statistik + Counter Kunjungan)
// Halaman ini diproteksi oleh /JS/auth-guard.js via <meta name="simbeda:module" content="dashboard">
(function () {
  'use strict';

  // ----- Konstanta peta -----
  const MAP_ELEMENT_ID = 'map';
  // Pusat Dumai (perkiraan) & zoom default
  const DEFAULT_CENTER = [1.666, 101.45];
  const DEFAULT_ZOOM = 12;

  // ----- Util kecil -----
  const $ = (s) => document.querySelector(s);

  function getSession() {
    try { return JSON.parse(localStorage.getItem('simbeda_auth') || 'null'); }
    catch(_) { return null; }
  }

  // Baca localStorage dengan default
  function readLS(key, def) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return def;
      return JSON.parse(raw);
    } catch (_) { return def; }
  }

  // Naikkan counter pengunjung dashboard
  function bumpVisitCounter() {
    try {
      const k = 'simbeda_dashboard_visits';
      const n = Number(localStorage.getItem(k) || '0') + 1;
      localStorage.setItem(k, String(n));
      return n;
    } catch (_) { return 1; }
  }

  // Coba ambil koordinat dari teks "lokasi" (mis. "1.67, 101.45" / "lat:1.67 lng:101.45")
  function parseLatLngFromText(txt) {
    if (!txt || typeof txt !== 'string') return null;

    // Pola 1: ada kata lat/lng eksplisit
    const m1 = txt.match(/lat\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*[, ]+\s*lng\s*[:=]?\s*(-?\d+(?:\.\d+)?)/i);
    if (m1) {
      const lat = parseFloat(m1[1]), lng = parseFloat(m1[2]);
      if (isFinite(lat) && isFinite(lng)) return [lat, lng];
    }

    // Pola 2: dua angka float dipisah spasi/koma
    const nums = txt.match(/-?\d+(?:\.\d+)?/g);
    if (nums && nums.length >= 2) {
      const lat = parseFloat(nums[0]), lng = parseFloat(nums[1]);
      if (isFinite(lat) && isFinite(lng)) return [lat, lng];
    }
    return null;
  }

  // Kumpulkan laporan dari dua sumber localStorage
  function collectReports() {
    const cepat = readLS('laporan_cepat', []);   // [{waktu,kecamatan,kelurahan,lokasi,jenis,deskripsi}]
    const warga = readLS('lapor_warga', []);     // [{waktu,nama,kontak,kecamatan,kelurahan,lokasi,kejadian,keterangan}]

    const norm = [];

    for (const r of cepat) {
      const ll = parseLatLngFromText(r.lokasi);
      norm.push({
        source: 'laporan_cepat',
        waktu: r.waktu || '',
        kecamatan: r.kecamatan || '',
        kelurahan: r.kelurahan || '',
        lokasi: r.lokasi || '',
        jenis: r.jenis || '',
        deskripsi: r.deskripsi || '',
        latlng: ll
      });
    }

    for (const r of warga) {
      const ll = parseLatLngFromText(r.lokasi);
      norm.push({
        source: 'lapor_warga',
        waktu: r.waktu || '',
        kecamatan: r.kecamatan || '',
        kelurahan: r.kelurahan || '',
        lokasi: r.lokasi || '',
        jenis: r.kejadian || '',
        deskripsi: r.keterangan || '',
        latlng: ll
      });
    }

    return norm;
  }

  // Render angka ringkasan
  function renderStats(reports, visits) {
    const total = reports.length;
    const kecSet = new Set();
    for (const r of reports) {
      if (r.kecamatan && String(r.kecamatan).trim()) {
        kecSet.add(String(r.kecamatan).trim());
      }
    }
    $('#totalLaporan') && ($('#totalLaporan').textContent = String(total));
    $('#asalLaporan') && ($('#asalLaporan').textContent = String(kecSet.size));
    $('#pengunjung') && ($('#pengunjung').textContent = String(visits));
  }

  // Inisialisasi peta Leaflet + marker
  function initMapAndMarkers(reports) {
    if (typeof L === 'undefined') {
      console.error('Leaflet L tidak tersedia. Pastikan <script leaflet> sudah dimuat.');
      return;
    }
    const host = document.getElementById(MAP_ELEMENT_ID);
    if (!host) return;

    const map = L.map(host, { scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
    }).addTo(map);

    const bounds = [];
    for (const r of reports) {
      if (!r.latlng) continue;
      const [lat, lng] = r.latlng;
      const marker = L.marker([lat, lng]).addTo(map);
      const info = `
        <b>${r.jenis || '(tidak ada jenis)'}</b><br/>
        <small>${r.kelurahan ? r.kelurahan + ', ' : ''}${r.kecamatan || ''}</small><br/>
        <small>${r.waktu || ''}</small><br/>
        <div style="margin-top:6px">${r.lokasi || ''}</div>
      `;
      marker.bindPopup(info);
      bounds.push([lat, lng]);
    }

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [24, 24] });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }

  // Render judul/area dari sesi (opsional)
  function renderHeader(sess) {
    const el = document.querySelector('[data-dashboard-area]');
    if (el) el.textContent = sess?.area || '-';
  }

  function boot() {
    const sess = getSession();
    renderHeader(sess);

    const reports = collectReports();
    const visits = bumpVisitCounter();

    renderStats(reports, visits);
    initMapAndMarkers(reports);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

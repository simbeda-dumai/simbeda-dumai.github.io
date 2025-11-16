// SIMBEDA - Dashboard: Ambil data laporan dari dummy.json, tampilkan di peta & statistik
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);

  async function loadReports() {
    // Ambil data laporan dari dummy.json (atau endpoint API kalau ada)
    const res = await fetch('/JSON/dummy.json');
    if (!res.ok) {
      console.error('Gagal ambil data laporan');
      return [];
    }
    return await res.json();
  }

  function initMap(reports) {
    const map = L.map('map').setView([1.6667, 101.4400], 12); // Koordinat awal (Kota Dumai)

    // Leaflet tile layer (OSM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Tambahkan marker untuk setiap laporan
    reports.forEach(report => {
      const { lokasi, jenis, deskripsi, markerColor } = report;
      const [lat, lng] = lokasi.split(' ').map(coord => parseFloat(coord.split(':')[1]));
      
      L.marker([lat, lng], { icon: L.divIcon({ className: 'leaflet-div-icon', html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%;"></div>` }) })
        .addTo(map)
        .bindPopup(`<b>${jenis}</b><br>${deskripsi}`);
    });
  }

  function updateStats(reports) {
    const totalLaporan = reports.length;
    const asalLaporan = reports.filter(r => r.kecamatan).length;
    const pengunjung = 1200; // Angka sementara, bisa dari statistik pengunjung

    $('#totalLaporan').textContent = totalLaporan;
    $('#asalLaporan').textContent = asalLaporan;
    $('#pengunjung').textContent = pengunjung;
  }

  async function boot() {
    const reports = await loadReports();

    initMap(reports);  // Tampilkan peta dan laporan
    updateStats(reports);  // Update statistik di dashboard
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

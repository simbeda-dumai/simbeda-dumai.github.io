// ===== Proteksi Login =====
const user = localStorage.getItem("user_login");
if (!user) {
  alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "/modules/login/login.html";
}

// ===== Dummy Statistik =====
document.getElementById("totalLaporan").innerText = "128";
document.getElementById("asalLaporan").innerText = "7 Kecamatan";
document.getElementById("pengunjung").innerText = "56";

// ===== Peta =====
setTimeout(() => {
  if (typeof L === "undefined") {
    alert("Gagal memuat peta. Cek koneksi Leaflet JS!");
    return;
  }

  const map = L.map('map').setView([1.683, 101.45], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const dataDummy = [
    { lat: 1.6862, lng: 101.4173, jenis: "Banjir", lokasi: "Dumai Barat" },
    { lat: 1.6789, lng: 101.4475, jenis: "Kebakaran", lokasi: "Dumai Kota" },
    { lat: 1.7144, lng: 101.3900, jenis: "Tanah Longsor", lokasi: "Sungai Sembilan" }
  ];

  dataDummy.forEach(d => {
    L.marker([d.lat, d.lng])
      .addTo(map)
      .bindPopup(`<b>${d.jenis}</b><br>${d.lokasi}`);
  });
}, 500);

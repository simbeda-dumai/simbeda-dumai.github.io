document.addEventListener("DOMContentLoaded", async () => {
  const map = L.map('map').setView([1.6815, 101.4495], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  try {
    const response = await fetch("/data/data_dummy.json");
    const data = await response.json();
    data.forEach(d => {
      L.marker([d.lat, d.lng]).addTo(map).bindPopup(`
        <b>${d.jenis}</b><br>${d.lokasi}<br><small>${d.tanggal}</small><br>
        <i>${d.status}</i><hr>${d.kerugian}<br>${d.korban}
      `);
    });
  } catch (err) {
    console.error("Gagal memuat data dummy:", err);
  }
});

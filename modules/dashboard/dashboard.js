document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([1.6815, 101.4495], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const dummyData = [
    { lokasi: "Bukit Timah", lat: 1.690, lng: 101.455, jenis: "Banjir" },
    { lokasi: "Jalan Ombak", lat: 1.682, lng: 101.447, jenis: "Kebakaran" }
  ];

  dummyData.forEach(d => {
    L.marker([d.lat, d.lng]).addTo(map)
      .bindPopup(`<b>${d.jenis}</b><br>${d.lokasi}`);
  });
});

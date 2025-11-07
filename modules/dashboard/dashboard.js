document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user_login");
  const name = localStorage.getItem("user_name");
  const area = localStorage.getItem("user_area");

  if (!user) {
    alert("⚠️ Anda belum login!");
    window.location.href = "../../modules/login/login.html";
    return;
  }

  document.getElementById("userName").textContent = name;
  document.getElementById("userArea").textContent = area;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    alert("Anda telah logout.");
    window.location.href = "../../modules/login/login.html";
  });

  const map = L.map("map").setView([1.6815, 101.4495], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  Promise.all([
    fetch("../../data/data_dummy.json").then(r => r.json()),
    JSON.parse(localStorage.getItem("laporan_warga") || "[]")
  ]).then(([adminData, wargaData]) => {
    const isBPBD = ["kalaksa", "sekre", "kabid", "admin"].includes(user);
    if (!isBPBD && area.includes("Kecamatan")) {
      const wilayah = area.replace("Kecamatan ", "").trim();
      wargaData = wargaData.filter(d => d.kecamatan === wilayah);
      adminData = adminData.filter(d => d.lokasi.includes(wilayah));
    }

    const allData = [
      ...adminData.map(d => ({ ...d, sumber: "Admin" })),
      ...wargaData.map((d, i) => ({
        id: 1000 + i,
        jenis: d.jenis,
        lokasi: `${d.kelurahan}, ${d.kecamatan}`,
        lat: d.latitude || 1.6815 + (Math.random() - 0.5) * 0.02,
        lng: d.longitude || 101.4495 + (Math.random() - 0.5) * 0.02,
        tanggal: d.waktu,
        status: "Laporan Warga",
        sumber: "Warga"
      }))
    ];

    document.getElementById("reportsCount").textContent = allData.length;
    document.getElementById("adminCount").textContent = adminData.length;
    document.getElementById("wargaCount").textContent = wargaData.length;

    allData.forEach(d => {
      const color = d.sumber === "Warga" ? "red" : "blue";
      L.circleMarker([d.lat, d.lng], {
        color,
        fillColor: color,
        fillOpacity: 0.8,
        radius: 7
      })
        .addTo(map)
        .bindPopup(`<b>${d.jenis}</b><br>${d.lokasi}<br><small>${d.tanggal}</small><br>${d.status}`);
    });
  });
});

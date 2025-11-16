// Fungsi untuk menampilkan peta kejadian
function showPetaKejadian() {
    const reports = JSON.parse(localStorage.getItem("laporanWarga")) || [];

    if (reports.length === 0) {
        alert("Tidak ada laporan kejadian terbaru.");
        return;
    }

    const map = L.map('map').setView([1.6333, 101.4477], 12);  // Pusat peta di Dumai
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Menambahkan marker ke peta untuk setiap laporan
    reports.forEach(report => {
        const lokasi = report.lokasi.split(" ");
        const lat = parseFloat(lokasi[0]);
        const lon = parseFloat(lokasi[1]);

        L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${report.jenisKejadian}</b><br>Lokasi: ${report.lokasi}<br>Waktu: ${report.timestamp}`);
    });
}

// Memanggil fungsi untuk menampilkan peta kejadian saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    showPetaKejadian();
});
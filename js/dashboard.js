// Fungsi untuk menampilkan dashboard sesuai role user
function showDashboard() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const reports = JSON.parse(localStorage.getItem("laporanWilayah")) || [];

    if (!user) {
        alert("Harap login terlebih dahulu.");
        return;
    }

    const statsDiv = document.getElementById("wilayahStats");

    // Menampilkan statistik laporan per wilayah
    const wilayahLaporan = {};
    reports.forEach(report => {
        const wilayah = report.lokasi.split(" ")[0]; // Ambil kecamatan atau kelurahan dari lokasi
        if (!wilayahLaporan[wilayah]) {
            wilayahLaporan[wilayah] = 1;
        } else {
            wilayahLaporan[wilayah]++;
        }
    });

    // Tampilkan statistik
    let statsHTML = "<ul>";
    for (const wilayah in wilayahLaporan) {
        statsHTML += `<li>${wilayah}: ${wilayahLaporan[wilayah]} laporan</li>`;
    }
    statsHTML += "</ul>";
    statsDiv.innerHTML = statsHTML;

    // Menampilkan peta kejadian
    showMap(reports);
}

// Fungsi untuk menampilkan peta kejadian dengan Leaflet.js
function showMap(reports) {
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

// Memuat dashboard setelah halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
    showDashboard();
});

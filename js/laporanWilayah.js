// Fungsi untuk mengirim laporan wilayah
document.getElementById("laporWilayahForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const jenisKejadian = document.getElementById("jenisKejadian").value;
    const lokasi = document.getElementById("lokasi").value;
    const waktuKejadian = document.getElementById("waktuKejadian").value;
    const uraian = document.getElementById("uraian").value;

    // Simpan laporan wilayah di LocalStorage
    let reports = JSON.parse(localStorage.getItem('laporanWilayah')) || [];
    const report = { jenisKejadian, lokasi, waktuKejadian, uraian, timestamp: new Date().toISOString() };
    reports.push(report);
    localStorage.setItem('laporanWilayah', JSON.stringify(reports));

    alert("Laporan wilayah berhasil dikirim!");
});

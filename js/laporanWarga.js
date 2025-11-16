// Fungsi untuk mengirim laporan warga
document.getElementById("laporWargaForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const jenisKejadian = document.getElementById("jenisKejadian").value;
    const lokasi = document.getElementById("lokasi").value;
    const waktuKejadian = document.getElementById("waktuKejadian").value;
    const uraian = document.getElementById("uraian").value;

    // Simpan laporan warga di LocalStorage
    let reports = JSON.parse(localStorage.getItem('laporanWarga')) || [];
    const report = { jenisKejadian, lokasi, waktuKejadian, uraian, timestamp: new Date().toISOString() };
    reports.push(report);
    localStorage.setItem('laporanWarga', JSON.stringify(reports));

    alert("Laporan berhasil dikirim!");
});
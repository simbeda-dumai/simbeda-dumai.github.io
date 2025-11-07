// daftar kelurahan per kecamatan
const dataKelurahan = {
  "Sungai Sembilan": ["Bangsal Aceh", "Tanjung Penyembal", "Lubuk Gaung", "Batu Teritip", "Basilam Baru"],
  "Dumai Barat": ["Purnama", "Bumi Ayu", "Simpang Tetap Darul Ihsan", "Bukit Datuk"],
  "Dumai Kota": ["Rimba Sekampung", "Teluk Binjai", "Bintan", "Laksamana"],
  "Dumai Timur": ["Tanjung Palas", "Bukit Timah", "Buluh Kasap", "Jaya Mukti"],
  "Dumai Selatan": ["Bumi Ayu Selatan", "Mekar Sari", "Bukit Batrem", "Ratu Sima"],
  "Bukit Kapur": ["Bukit Kayu Kapur", "Gurun Panjang", "Kampung Baru", "Bukit Nenas"],
  "Medang Kampai": ["Guntung", "Pelintung", "Teluk Makmur"]
};

function isiKelurahan() {
  const kecamatan = document.getElementById("kecamatan").value;
  const kelSelect = document.getElementById("kelurahan");
  kelSelect.innerHTML = '<option value="">-- Pilih Kelurahan --</option>';
  if (dataKelurahan[kecamatan]) {
    dataKelurahan[kecamatan].forEach(kel => {
      const opt = document.createElement("option");
      opt.value = kel;
      opt.textContent = kel;
      kelSelect.appendChild(opt);
    });
  }
}

function cekJenisManual() {
  const jenis = document.getElementById("jenisBencana").value;
  document.getElementById("manualJenis").style.display = jenis === "Lainnya" ? "block" : "none";
}

function simpanLaporanWarga(e) {
  e.preventDefault();

  const laporan = {
    nama: document.getElementById("nama").value.trim(),
    nik: document.getElementById("nik").value.trim(),
    pekerjaan: document.getElementById("pekerjaan").value.trim(),
    alamat: document.getElementById("alamat").value.trim(),
    kecamatan: document.getElementById("kecamatan").value,
    kelurahan: document.getElementById("kelurahan").value,
    jenis: document.getElementById("jenisBencana").value === "Lainnya"
      ? document.getElementById("jenisManual").value.trim()
      : document.getElementById("jenisBencana").value,
    latitude: document.getElementById("latitude").value.trim(),
    longitude: document.getElementById("longitude").value.trim(),
    deskripsi: document.getElementById("deskripsi").value.trim(),
    waktu: new Date().toLocaleString("id-ID")
  };

  if (!laporan.nama || !laporan.nik || !laporan.kecamatan || !laporan.kelurahan || !laporan.jenis) {
    alert("❌ Mohon lengkapi semua data penting!");
    return false;
  }

  let data = JSON.parse(localStorage.getItem("laporan_warga") || "[]");
  data.unshift(laporan);
  localStorage.setItem("laporan_warga", JSON.stringify(data));

  document.getElementById("formWarga").reset();
  alert("✅ Laporan warga berhasil dikirim!");
}

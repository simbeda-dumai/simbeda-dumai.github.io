// ===== Proteksi Login =====
const user = localStorage.getItem("user_login");
if (!user) {
  alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "/modules/login/login.html";
}

// ===== Daftar kelurahan per kecamatan =====
const kelurahanData = {
  "Sungai Sembilan": ["Lubuk Gaung", "Batu Teritip", "Tanjung Penyembal", "Bangsal Aceh", "Pangkalan Sesai"],
  "Dumai Barat": ["Purnama", "Bukit Datuk", "Bumi Ayu"],
  "Dumai Kota": ["Bintan", "Laksamana", "Rimba Sekampung", "Teluk Binjai"],
  "Dumai Timur": ["Tanjung Palas", "Jaya Mukti", "Bumi Ayu", "Buluh Kasap"],
  "Dumai Selatan": ["Mekar Sari", "Bukit Batrem", "Ratu Sima"],
  "Bukit Kapur": ["Bukit Nenas", "Kampung Baru", "Tanjung Penyembal"],
  "Medang Kampai": ["Pelintung", "Guntung", "Teluk Makmur"]
};

// ===== Filter kelurahan berdasarkan kecamatan =====
document.getElementById("kecamatan").addEventListener("change", e => {
  const kec = e.target.value;
  const kelurahanSelect = document.getElementById("kelurahan");
  kelurahanSelect.innerHTML = '<option value="">-- Pilih Kelurahan --</option>';
  if (kelurahanData[kec]) {
    kelurahanData[kec].forEach(kel => {
      const opt = document.createElement("option");
      opt.value = kel;
      opt.textContent = kel;
      kelurahanSelect.appendChild(opt);
    });
  }
});

// ===== Input manual jenis bencana =====
document.getElementById("jenisBencana").addEventListener("change", e => {
  document.getElementById("jenisManual").style.display =
    e.target.value === "manual" ? "block" : "none";
});

// ===== Ambil lokasi otomatis (OpenStreetMap) =====
function ambilLokasi() {
  if (!navigator.geolocation) return alert("Geolocation tidak didukung browser ini.");
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(5);
    const lng = pos.coords.longitude.toFixed(5);
    document.getElementById("koordinat").value = `${lat}, ${lng}`;
  }, err => {
    alert("Gagal mengambil lokasi: " + err.message);
  });
}

// ===== Simpan laporan =====
document.getElementById("formLaporanCepat").addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    jenis: document.getElementById("jenisBencana").value === "manual"
      ? document.getElementById("jenisManual").value
      : document.getElementById("jenisBencana").value,
    kecamatan: document.getElementById("kecamatan").value,
    kelurahan: document.getElementById("kelurahan").value,
    lokasi: document.getElementById("lokasi").value,
    koordinat: document.getElementById("koordinat").value,
    deskripsi: document.getElementById("deskripsi").value,
    waktu: new Date().toLocaleString()
  };
  console.log("📩 Data laporan cepat:", data);
  alert("✅ Laporan cepat berhasil disimpan!");
  e.target.reset();
});

// ===== Proteksi Login =====
const user = localStorage.getItem("user_login");
if (!user) {
  alert("⚠️ Anda belum login. Silakan login terlebih dahulu.");
  window.location.href = "/modules/login/login.html";
}

function simpanLaporan(e) {
  e.preventDefault();

  const jenis = document.getElementById("jenis").value.trim();
  const lokasi = document.getElementById("lokasi").value.trim();
  const deskripsi = document.getElementById("deskripsi").value.trim();
  const waktu = new Date().toLocaleString("id-ID");
  const user = localStorage.getItem("user_name") || "Anonim";

  const laporan = { waktu, user, jenis, lokasi, deskripsi };

  let log = JSON.parse(localStorage.getItem("laporan_cepat") || "[]");
  log.unshift(laporan);
  localStorage.setItem("laporan_cepat", JSON.stringify(log));

  tampilkanLog();
  document.getElementById("formLaporan").reset();
  alert("✅ Laporan berhasil disimpan!");
}

function tampilkanLog() {
  const tbody = document.querySelector("#tabelLog tbody");
  tbody.innerHTML = "";
  const log = JSON.parse(localStorage.getItem("laporan_cepat") || "[]");

  log.forEach(l => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.waktu}</td>
      <td>${l.user}</td>
      <td>${l.jenis}</td>
      <td>${l.lokasi}</td>
      <td>${l.deskripsi}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", tampilkanLog);

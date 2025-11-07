const users = {
  // BPBD
  kalaksa: { name: "Kepala Pelaksana", area: "BPBD Kota Dumai" },
  sekre: { name: "Sekretaris", area: "BPBD Kota Dumai" },
  kabid: { name: "Kepala Bidang", area: "BPBD Kota Dumai" },
  admin: { name: "Admin BPBD", area: "BPBD Kota Dumai" },

  // Kecamatan
  ss: { name: "Kecamatan Sungai Sembilan", area: "Kecamatan Sungai Sembilan" },
  dk: { name: "Kecamatan Dumai Kota", area: "Kecamatan Dumai Kota" },
  db: { name: "Kecamatan Dumai Barat", area: "Kecamatan Dumai Barat" },
  dt: { name: "Kecamatan Dumai Timur", area: "Kecamatan Dumai Timur" },
  ds: { name: "Kecamatan Dumai Selatan", area: "Kecamatan Dumai Selatan" },
  bk: { name: "Kecamatan Bukit Kapur", area: "Kecamatan Bukit Kapur" },
  mk: { name: "Kecamatan Medang Kampai", area: "Kecamatan Medang Kampai" }
};

function loginUser(e) {
  e.preventDefault();
  const u = document.getElementById("username").value.trim().toLowerCase();
  const p = document.getElementById("password").value.trim();

  if (!users[u]) {
    alert("❌ Username tidak ditemukan!");
    return false;
  }

  if (p !== "dumaisiaga") {
    alert("❌ Password salah!");
    return false;
  }

  localStorage.setItem("user_login", u);
  localStorage.setItem("user_name", users[u].name);
  localStorage.setItem("user_area", users[u].area);
  alert(`✅ Selamat datang, ${users[u].name}!`);

  window.location.href = "../../modules/dashboard/dashboard.html";
  return false;
}

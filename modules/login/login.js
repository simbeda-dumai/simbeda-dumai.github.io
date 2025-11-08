// modules/login/login.js (REPLACE PENUH)

const users = {
  kalaksa: { name: "Kepala Pelaksana", area: "BPBD Kota Dumai", password: "siagasatu" },
  sekre:   { name: "Sekretaris", area: "BPBD Kota Dumai" },
  kabid:   { name: "Kepala Bidang", area: "BPBD Kota Dumai" },
  admin:   { name: "Admin BPBD", area: "BPBD Kota Dumai" },
  ss:      { name: "Kecamatan Sungai Sembilan", area: "Sungai Sembilan" },
  dk:      { name: "Kecamatan Dumai Kota", area: "Dumai Kota" },
  db:      { name: "Kecamatan Dumai Barat", area: "Dumai Barat" },
  dt:      { name: "Kecamatan Dumai Timur", area: "Dumai Timur" },
  ds:      { name: "Kecamatan Dumai Selatan", area: "Dumai Selatan" },
  bk:      { name: "Kecamatan Bukit Kapur", area: "Bukit Kapur" },
  mk:      { name: "Kecamatan Medang Kampai", area: "Medang Kampai" }
};

const DEFAULT_PASSWORD = "dumaisiaga";

function loginUser(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const u = document.getElementById("username").value.trim().toLowerCase();
  const p = document.getElementById("password").value.trim();

  if (!users[u]) {
    alert("❌ Username tidak ditemukan!");
    return false;
  }

  // Jika user punya password spesifik, pakai itu; jika tidak, pakai default
  const expected = users[u].password ? String(users[u].password) : DEFAULT_PASSWORD;
  if (p !== expected) {
    alert("❌ Password salah!");
    return false;
  }

  // efek loading
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner"></div> Memproses...`;

  localStorage.setItem("user_login", u);
  localStorage.setItem("user_name", users[u].name);
  localStorage.setItem("user_area", users[u].area);

  setTimeout(() => {
    alert(`✅ Selamat datang, ${users[u].name}!`);
    window.location.href = "/modules/dashboard/dashboard.html";
  }, 800);
}

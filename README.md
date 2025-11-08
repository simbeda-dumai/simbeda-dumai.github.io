SIMBEDA — Sistem Manajemen Bencana Daerah (Kota Dumai)












Portal SIMBEDA membantu pencatatan cepat kejadian, pelaporan warga, dan tampilan ringkas situasi via peta untuk wilayah Kota Dumai.

🔧 Fitur Utama

Struktur Repo Sederhana (tanpa subfolder modul) dengan path absolut:

/CSS, /JS, /HTML, /IMG, /JSON, /fonts, /index.html


Header & Footer gradasi (hijau muda → kuning → oranye → biru tua), logo & link ABSOLUTE PATH.

Footer dinamis: jam real-time + 50 quotes (motivasi kerja, manajemen bencana, Kota Dumai) — font NotoSans Italic Bold.

Login via /JSON/users.json (tanpa backend) → sesi disimpan localStorage('simbeda_auth').

Guard Akses (role-based) untuk:

dashboard → butuh login & izin modul.

laporan_cepat → butuh login & izin modul.

lapor_warga → tanpa guard (akses publik).

Dashboard: statistik (total laporan, jumlah kecamatan asal, pengunjung) + peta Leaflet (OSM). Marker otomatis bila kolom “lokasi” berisi koordinat.

Konfigurasi wilayah tersentral di /JS/config.js (7 kecamatan, 36 kelurahan).

Penyimpanan data klien:

localStorage('laporan_cepat')

localStorage('lapor_warga')

localStorage('simbeda_auth')

📁 Struktur Repositori
CSS/        # stylesheet (header.css, footer.css, dashboard.css, login.css, laporan_cepat.css, lapor_warga.css, Roboto.css, transition.css)
JS/         # script (layout.js, quotes.js, login.js, auth-guard.js, dashboard.js, laporan_cepat.js, lapor_warga.js, config.js, util breadcrumb)
HTML/       # halaman modul (header.html, footer.html, dashboard.html, laporan_cepat.html, lapor_warga.html, login.html)
IMG/        # aset gambar (logo_simbeda.png, dumai_idaman.png, asn.png)
JSON/       # data (users.json, data_dummy.json)
fonts/      # NotoSans & Roboto (variable fonts)
index.html  # beranda
README.md


Semua link/asset memakai path absolut (mis. /JS/layout.js, /HTML/login.html, /IMG/logo_simbeda.png).

🚀 Cara Menjalankan
1) GitHub Pages (direkomendasikan)

Commit & push. Akses melalui URL Pages repo ini. Struktur sudah Pages-ready.

2) Lokal (tanpa backend)

Pakailah server statis (agar fetch('/JSON/users.json') tidak di-block):

VS Code “Live Server” / python -m http.server / http-server.

Buka di browser: http://localhost:XXXX.

🧭 Halaman & Modul

Beranda: /index.html

Login: /HTML/login.html

Dashboard (guard): /HTML/dashboard.html

Memerlukan sesi login + izin modul.

Laporan Cepat (guard): /HTML/laporan_cepat.html

Simpan ringkas kejadian, opsi isi koordinat.

Lapor Warga (publik): /HTML/lapor_warga.html

Header & footer di-inject otomatis oleh /JS/layout.js.

🔐 Login & Hak Akses

Sumber user: /JSON/users.json (format object map direkomendasikan):

{
  "kalaksa": { "password": "siagasatu", "role": "Kota", "area": "BPBD Kota Dumai", "modules": ["dashboard","laporan_cepat","lapor_warga","admin"] },
  "dk":      { "password": "dumaisiaga", "role": "Kecamatan", "area": "Dumai Kota", "modules": ["dashboard","laporan_cepat","lapor_warga"] }
}


Penyimpanan sesi: localStorage('simbeda_auth').

Guard:

Tambahkan di <head> halaman yang dijaga:

<meta name="simbeda:module" content="dashboard">  <!-- atau: laporan_cepat -->
<script src="/JS/auth-guard.js" defer></script>


Redirect pasca login: ditangani di /JS/login.js (mapping role → halaman). Default ke /HTML/dashboard.html.

🗺️ Peta (Dashboard)

CDN Leaflet:

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>


Elemen peta:

<div id="map" style="height:380px;"></div>


Sumber marker: gabungan data localStorage('laporan_cepat') & localStorage('lapor_warga').
Isi koordinat di kolom lokasi (contoh: 1.668, 101.45 atau lat:1.668 lng:101.45).

🧩 Potongan Include Penting

Layout (di semua halaman):

<div id="header"></div>
<!-- konten halaman -->
<div id="footer"></div>

<script src="/JS/layout.js" defer></script>


Guard (khusus dashboard & laporan_cepat):

<meta name="simbeda:module" content="dashboard"> <!-- atau laporan_cepat -->
<script src="/JS/auth-guard.js" defer></script>


Login:

<link rel="stylesheet" href="/CSS/login.css" />
<script src="/JS/login.js" defer></script>

⚙️ Konfigurasi Wilayah

Ubah di /JS/config.js (kecamatan & kelurahan). Form Laporan Cepat dan Lapor Warga akan mengisi dropdown otomatis.

🧪 Troubleshooting

Jam/Quotes footer tidak tampil
Pastikan /JS/layout.js memuat /HTML/footer.html lalu menyusul /JS/quotes.js. Versi terbaru sudah memanggil SIMBEDA_FOOTER_BOOT() otomatis.

Login gagal

Cek Network → users.json harus 200 OK di /JSON/users.json.

Pastikan field password cocok. Username tidak case-sensitive.

Peta kosong

Pastikan elemen #map ada dan punya tinggi.

Isi koordinat di kolom lokasi.

🛡️ Catatan Keamanan

Repositori ini tanpa backend; jangan menaruh data sensitif di users.json. Untuk produksi, gunakan server & autentikasi yang aman.

📌 Rencana Pengembangan

Ekspor PDF/CSV rekap.

Filter peta per-kecamatan, time range.

Sinkronisasi data ke backend (API) bila disiapkan.

👥 Kontribusi

Fork → branch → PR.

Ikuti gaya kode yang ada (path absolut, tidak membuat subfolder modul).

📝 Lisensi

Tentukan lisensi proyek sesuai kebijakan instansi. (Contoh: MIT / Apache-2.0).

SIMBEDA Kota Dumai — “Data rapi, aksi pasti.”

# SIMBEDA — Sistem Manajemen Bencana Daerah (Kota Dumai)

[![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)](#)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-live-blue.svg)](#)
[![Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-informational.svg)](#)
[![Map](https://img.shields.io/badge/map-Leaflet-199900.svg)](#)
[![UI](https://img.shields.io/badge/UI-gradient--header%2Ffooter-green--yellow--orange--navy.svg)](#)
[![Data](https://img.shields.io/badge/data-localStorage-yellow.svg)](#)

Portal **SIMBEDA** membantu pencatatan cepat kejadian, pelaporan warga, dan tampilan ringkas situasi via peta untuk wilayah **Kota Dumai**.

---

## 🔧 Fitur Utama

- **Struktur Repo Sederhana** (tanpa subfolder modul) dengan **path absolut**:
  ```
  /CSS, /JS, /HTML, /IMG, /JSON, /fonts, /index.html
  ```
- **Header & Footer** gradasi terbaru: **hijau muda → kuning → oranye → biru tua**, logo & link **ABSOLUTE PATH**.
- **Footer dinamis**: **jam real-time** + **50 quotes** (motivasi kerja, manajemen bencana, Kota Dumai) — font **NotoSans Italic Bold**.
- **Login** via `/JSON/users.json` (tanpa backend) → sesi disimpan `localStorage('simbeda_auth')`.
- **Guard Akses** (role-based) untuk:
  - `dashboard` → butuh login & izin modul.
  - `laporan_cepat` → butuh login & izin modul.
  - `lapor_warga` → **tanpa guard** (akses publik).
- **Dashboard**: statistik (total laporan, jumlah kecamatan asal, pengunjung) + peta **Leaflet** (OSM). Marker otomatis bila kolom “lokasi” berisi koordinat.
- **Konfigurasi wilayah** tersentral di `/JS/config.js` (7 kecamatan, 36 kelurahan).
- Penyimpanan data klien:
  - `localStorage('laporan_cepat')`
  - `localStorage('lapor_warga')`
  - `localStorage('simbeda_auth')`

---

## 📁 Struktur Repositori

```
CSS/        # stylesheet (header.css, footer.css, dashboard.css, login.css, laporan_cepat.css, lapor_warga.css, Roboto.css, transition.css)
JS/         # script (layout.js, quotes.js, login.js, auth-guard.js, dashboard.js, laporan_cepat.js, lapor_warga.js, config.js, auth-breadcrumb*)
HTML/       # halaman (header.html, footer.html, dashboard.html, laporan_cepat.html, lapor_warga.html, login.html)
IMG/        # aset gambar (logo_simbeda.png, dumai_idaman.png, asn.png)
JSON/       # data (users.json, data_dummy.json)
fonts/      # NotoSans & Roboto (variable fonts)
index.html  # beranda
README.md
```

> Semua **link/asset** memakai **path absolut** (mis. `/JS/layout.js`, `/HTML/login.html`, `/IMG/logo_simbeda.png`).

---

## 🚀 Menjalankan Aplikasi

### 1) GitHub Pages (direkomendasikan)
Commit & push. Akses melalui URL Pages repo ini (struktur sudah **Pages-ready**).

### 2) Lokal (tanpa backend)
Gunakan server statis agar `fetch('/JSON/users.json')` tidak di-block (CORS/file restrictions):
- VS Code **Live Server** / `python -m http.server` / `npx http-server`

Buka: `http://localhost:PORT`

---

## 🧭 Halaman & Modul

- **Beranda**: `/index.html`
- **Login**: `/HTML/login.html`
- **Dashboard** *(guard)*: `/HTML/dashboard.html` — Statistik & Peta
- **Laporan Cepat** *(guard)*: `/HTML/laporan_cepat.html` — Catat kejadian singkat
- **Lapor Warga** *(publik)*: `/HTML/lapor_warga.html` — Form laporan warga

> Header & footer di-inject otomatis oleh `/JS/layout.js`.

---

## 🔐 Login & Hak Akses

**Sumber user**: `/JSON/users.json` (format object-map direkomendasikan)
```json
{
  "kalaksa": { "password": "siagasatu", "role": "Kota", "area": "BPBD Kota Dumai", "modules": ["dashboard","laporan_cepat","lapor_warga","admin"] },
  "dk":      { "password": "dumaisiaga", "role": "Kecamatan", "area": "Dumai Kota", "modules": ["dashboard","laporan_cepat","lapor_warga"] }
}
```

**Sesi**: `localStorage('simbeda_auth')`

**Guard** (hanya untuk `dashboard` & `laporan_cepat`): tambahkan di `<head>`
```html
<meta name="simbeda:module" content="dashboard"> <!-- atau 'laporan_cepat' -->
<script src="/JS/auth-guard.js" defer></script>
```

**Redirect pasca login**: diatur di `/JS/login.js` (mapping role → halaman). Default: `/HTML/dashboard.html`.

---

## 🗺️ Peta (Dashboard)

CDN Leaflet:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
```
Elemen peta:
```html
<div id="map" style="height:380px;"></div>
```
Sumber marker: gabungan `localStorage('laporan_cepat')` & `localStorage('lapor_warga')`.  
Isi koordinat di kolom **lokasi** (contoh: `1.668, 101.45` atau `lat:1.668 lng:101.45`).

---

## 🧩 Include Wajib

**Layout (semua halaman):**
```html
<div id="header"></div>
<!-- konten halaman -->
<div id="footer"></div>

<script src="/JS/layout.js" defer></script>
```

**Login:**
```html
<link rel="stylesheet" href="/CSS/login.css" />
<script src="/JS/login.js" defer></script>
```

**Footer dinamis (otomatis via layout.js):**
- `/HTML/footer.html` menyiapkan elemen `#footer-quote` dan `#footer-clock`
- `/JS/quotes.js` memutar **50** quotes dan menampilkan jam real-time
- Font quote: **NotoSans Italic Bold** (dari `/fonts`)

---

## ⚙️ Konfigurasi Wilayah

Ubah di `/JS/config.js` (7 kecamatan, 36 kelurahan).  
Form **Laporan Cepat** & **Lapor Warga** akan mengisi dropdown otomatis.

---

## 🧪 Troubleshooting

- **Jam/Quotes footer tidak tampil**  
  Pastikan `/JS/layout.js` memuat `/HTML/footer.html` lalu **/JS/quotes.js**. Versi terbaru memanggil `SIMBEDA_FOOTER_BOOT()` otomatis.
- **Login gagal**  
  - `Network` → `users.json` harus `200 OK` di `/JSON/users.json`  
  - Pastikan field **password** cocok. Username **tidak case-sensitive**
- **Peta kosong**  
  - Elemen `#map` harus ada & punya **tinggi**  
  - Isi koordinat pada **lokasi**

---

## 🛡️ Catatan Keamanan

Repositori ini **tanpa backend**; jangan menaruh data sensitif di `users.json`.  
Untuk produksi, gunakan server & autentikasi yang aman (OAuth/JWT/SSO).

---

## 📌 Rencana Pengembangan

- Ekspor PDF/CSV rekap & dashboard
- Filter peta per-kecamatan, time range
- Sinkronisasi data ke backend (API) bila tersedia

---

## 👥 Kontribusi

Fork → branch → PR.  
Ikuti gaya kode (path absolut, tidak membuat subfolder modul).

---

## 📝 Lisensi

Tentukan lisensi sesuai kebijakan instansi (MIT/Apache-2.0/dll).

---

**SIMBEDA Kota Dumai** — *“Data rapi, aksi pasti.”*

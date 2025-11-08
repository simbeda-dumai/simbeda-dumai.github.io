# 🛰️ SIMBEDA – Sistem Informasi Manajemen Bencana Daerah
### Badan Penanggulangan Bencana Daerah (BPBD) Kota Dumai

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Made with](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JavaScript-yellow)

---

## 📘 Tentang SIMBEDA

**SIMBEDA (Sistem Informasi Manajemen Bencana Daerah)** adalah platform digital resmi **BPBD Kota Dumai** yang berfungsi sebagai pusat data, pelaporan, dan informasi kebencanaan secara terpadu.  
Dibangun dengan teknologi web statis modern berbasis **HTML, CSS, dan JavaScript**, sistem ini dirancang **ringan, responsif, dan dapat diakses melalui GitHub Pages** tanpa memerlukan server backend.

### 🎯 Tujuan Utama
- Meningkatkan efisiensi dan transparansi pelaporan bencana.  
- Menyediakan **data real-time** tentang kejadian bencana di wilayah Kota Dumai.  
- Memudahkan koordinasi antara **BPBD**, **petugas lapangan**, dan **masyarakat**.  
- Mendukung sistem **lapor cepat, monitoring peta bencana, dan rekapitulasi laporan harian**.

---

## 🧩 Fitur Utama

| Fitur | Keterangan |
|-------|-------------|
| 🌐 **Dashboard Utama** | Menampilkan statistik kejadian bencana dan status laporan secara real-time. |
| 📱 **Lapor Warga** | Formulir pelaporan bencana oleh masyarakat (terhubung dengan WhatsApp Web). |
| ⚡ **Laporan Cepat** | Input dan rekap data oleh petugas lapangan dengan lokasi GPS. |
| 🗺️ **Peta Interaktif** | Pemetaan titik kejadian menggunakan **Leaflet.js**. |
| 🧭 **Agenda BPBD** | Jadwal kegiatan dan koordinasi penanggulangan bencana. |
| 🔐 **Login & Role User** | Sistem otentikasi berbasis `localStorage` untuk Admin BPBD, Petugas, dan Publik. |
| 🖨️ **Cetak & PDF** | Laporan dapat dicetak langsung atau diunduh dalam format PDF. |
| 💬 **Quotes Inspiratif** | Menampilkan pesan motivatif setiap 5 menit di bagian footer. |

---

## 🧱 Struktur Direktori

```
📁 / (root)
│── index.html
│── README.md
│
├── 📁 assets/
│   └── img/
│       ├── bpbd_logo.png
│       ├── dumai_logo.png
│       ├── indonesia_logo.png
│       └── bw_dumai.png
│
├── 📁 components/
│   ├── header/
│   │   ├── header.html
│   │   └── header.css
│   └── footer/
│       ├── footer.html
│       ├── footer.css
│       └── quotes.js
│
├── 📁 js/
│   ├── config.js
│   └── layout/
│       └── layout.js
│
└── 📁 modules/
    ├── dashboard/
    │   ├── dashboard.html
    │   ├── dashboard.css
    │   └── dashboard.js
    ├── laporan_cepat/
    │   ├── laporan_cepat.html
    │   ├── laporan_cepat.css
    │   └── laporan_cepat.js
    ├── lapor_warga/
    │   ├── lapor_warga.html
    │   ├── lapor_warga.css
    │   └── lapor_warga.js
    ├── agenda/
    │   ├── agenda.html
    │   ├── agenda.css
    │   └── agenda.js
    ├── login/
    │   ├── login.html
    │   ├── login.css
    │   ├── login.js
    │   └── users.js
    └── print/
        └── print.js
```

> Semua halaman otomatis memuat **header dan footer** melalui `layout.js`.  
> Kutipan inspiratif di footer berubah setiap **5 menit** via `quotes.js`.

---

## 🚀 Cara Penggunaan

### 🔹 A. Online (GitHub Pages)
1. Buka repositori `simbeda-dumai.github.io` di GitHub.  
2. Pastikan **Pages** aktif dengan pengaturan berikut:  
   - Source: `main`  
   - Folder: `/ (root)`  
3. Tunggu proses build otomatis oleh GitHub Pages.  
4. Akses portal di:  
   👉 [https://simbeda-dumai.github.io/](https://simbeda-dumai.github.io/)

### 🔹 B. Offline (Lokal)
Untuk menjalankan sistem secara lokal di laptop:
```bash
# Clone repository
git clone https://github.com/simbeda-dumai/simbeda-dumai.github.io.git

# Masuk ke direktori proyek
cd simbeda-dumai.github.io

# Jalankan server lokal (contoh dengan Python 3)
python -m http.server 8000

# Akses di browser
http://localhost:8000/
```

> 💡 Jika header/footer tidak muncul, pastikan file dijalankan melalui server lokal (bukan langsung file://) karena `fetch()` membutuhkan protokol HTTP.

---

## ⚙️ Panduan Pengembangan

| File / Folder | Fungsi |
|----------------|--------|
| `"/JS/layout.js"` | Menyuntikkan header dan footer ke seluruh halaman. |
| `/components/footer/quotes.js` | Mengatur rotasi kutipan inspiratif tiap 5 menit. |
| `/modules/print/print.js` | Mengelola format cetak & ekspor laporan ke PDF. |
| `/js/config.js` | Menyimpan pengaturan global sistem (versi, URL API, dll). |
| `/modules/login/users.js` | Data user & role untuk simulasi login lokal. |

### 🧠 Tips Pengembang
- Gunakan `console.log()` untuk debug error modul.  
- Cek Console di browser untuk pesan “404” atau kesalahan CORS.  
- Gunakan CDN untuk font & ikon agar loading cepat di GitHub Pages.  
- Semua gaya umum dikelola di `main.css`, sedangkan gaya khusus di setiap modul.  

---

## 🛠️ Teknologi yang Digunakan
- **HTML5** – Struktur halaman dan komponen.  
- **CSS3** – Desain responsif & layout modular.  
- **JavaScript (ES6)** – Interaktivitas, validasi, dan pemuatan dinamis.  
- **Leaflet.js** – Peta interaktif titik kejadian.  
- **GitHub Pages** – Hosting gratis dan otomatis untuk publikasi sistem.  

---

## 📊 Status dan Monitoring
- 🔄 Pengembangan: **Berjalan (Versi 1.0.0)**  
- 🧱 Repository: [simbeda-dumai.github.io](https://github.com/simbeda-dumai/simbeda-dumai.github.io)  
- 🌍 Hosting: GitHub Pages  
- 🧩 Developer: Tim SIMBEDA BPBD Dumai  

---

## 🤝 Kredit dan Lisensi

**Dikembangkan oleh:**  
🧭 *Bidang Pencegahan dan Kesiapsiagaan*  
**Badan Penanggulangan Bencana Daerah (BPBD) Kota Dumai**

**Dibimbing oleh:**  
Kepala BPBD Kota Dumai dan Sekretariat BPBD

**Lisensi:**  
MIT License — dapat digunakan untuk keperluan pengembangan sistem kebencanaan di wilayah Pemerintah Kota Dumai.

---

> _“Manajemen bencana yang cepat, transparan, dan terintegrasi adalah kunci keselamatan masyarakat.”_  
> — **SIMBEDA BPBD Kota Dumai, 2025**

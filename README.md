# 🏛️ SIMBEDA Dumai – *Barang Baru Rasa Lama*

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Made with](https://img.shields.io/badge/made%20with-HTML%2C%20CSS%2C%20JS-yellow)

---

## 📘 Deskripsi Proyek

**Barang Baru Rasa Lama** adalah proyek modernisasi portal manajemen digital untuk **Pemerintah Kecamatan Dumai Kota**.  
Sistem ini dikembangkan dengan pendekatan **modular dan reusable**, berbasis **HTML, CSS, dan JavaScript murni**, tanpa framework berat — sehingga ringan, cepat, dan mudah dikelola melalui **GitHub Pages**.

Portal ini berfungsi sebagai **SIMBEDA (Sistem Manajemen Berbasis Data)** yang mencakup:
- 📅 **Agenda Pemerintah Kecamatan & Kelurahan**
- 📄 **Nota Dinas & Disposisi Digital**
- 🧾 **Manajemen Laporan Cepat dan Arsip**
- 💬 **Integrasi WhatsApp dan Cetak PDF**
- 🧍‍♂️ **Manajemen Login dan Role (Camat, Sekcam, Lurah)**

---

## 🧱 Struktur Folder

```
📁 / (root)
│── index.html
│── README.md
│
├── 📁 assets/
│   └── img/
│       ├── dumai.png
│       ├── dumai_idaman.png
│       ├── asn.png
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
    ├── agenda/
    │   ├── agenda.html
    │   ├── agenda.css
    │   └── agenda.js
    ├── disposisi/
    │   ├── disposisi.html
    │   ├── disposisi.css
    │   └── disposisi.js
    ├── nota_dinas/
    │   ├── nota_dinas.html
    │   ├── nota_dinas.css
    │   └── nota_dinas.js
    ├── login/
    │   ├── login.html
    │   ├── login.css
    │   ├── login.js
    │   └── users.js
    └── print/
        └── print.js
```

---

## ⚙️ Fitur Utama

| Fitur | Deskripsi |
|-------|------------|
| 🔐 **Login Otomatis** | Autentikasi berbasis `localStorage`, mendukung role Camat, Sekcam, dan Lurah. |
| 🧭 **Header & Footer Modular** | Dimuat otomatis lewat `layout.js`, tampil konsisten di semua halaman. |
| 💬 **Quotes Inspiratif Dinamis** | Diperbarui setiap 5 menit melalui `quotes.js`. |
| 📅 **Agenda Kecamatan** | Pencatatan kegiatan Camat dan Kelurahan, dengan filter wilayah dan cetak PDF. |
| 🧾 **Nota Dinas & Disposisi** | Dokumen digital dengan nomor otomatis dan pengiriman daring. |
| 📱 **Integrasi WhatsApp** | Kirim data laporan langsung ke WhatsApp atau WhatsApp Web. |
| 🖨️ **Cetak Otomatis** | Fitur print laporan dan ekspor PDF per kelurahan atau kecamatan. |

---

## 🚀 Cara Menggunakan Aplikasi

### 1️⃣ Jalankan di GitHub Pages
1. Masuk ke **GitHub Desktop** dan buka repository ini.  
2. Lakukan **Commit & Push** semua perubahan.
3. Buka pengaturan repositori → **Settings → Pages**.  
4. Pada bagian **Branch**, pilih:  
   ```
   Source: main  |  Folder: / (root)
   ```
5. Klik **Save** dan tunggu beberapa detik.  
6. Akses aplikasi melalui URL:
   ```
   https://<username>.github.io/<nama-repo>/
   ```

---

### 2️⃣ Jalankan Secara Lokal
Jika ingin uji coba di laptop:
```bash
# Clone repo ke komputer
git clone https://github.com/<username>/<nama-repo>.git

# Masuk ke folder proyek
cd <nama-repo>

# Buka di browser
start index.html
```

> 💡 *Pastikan koneksi internet aktif agar ikon dan font (seperti Roboto & Bootstrap) dapat termuat dengan benar.*

---

## 🧩 Panduan Developer

- Semua **header** dan **footer** otomatis dimuat via `layout.js`.
- Tambahkan modul baru di folder `/modules/` dengan pola:
  ```
  /modules/nama_modul/
  ├── nama_modul.html
  ├── nama_modul.css
  └── nama_modul.js
  ```
- Gunakan `main.css` untuk gaya umum antarhalaman.
- Jangan ubah `quotes.js` tanpa menyesuaikan interval waktu.
- Untuk debugging: buka *Console* (F12 → Console) dan pastikan tidak ada error `404` pada pemanggilan komponen.

---

## 💡 Catatan Teknis

| Komponen | Fungsi | Lokasi |
|-----------|---------|--------|
| `layout.js` | Memuat header & footer otomatis di setiap halaman | `/js/layout/` |
| `quotes.js` | Menampilkan kutipan inspiratif berganti tiap 5 menit | `/components/footer/` |
| `config.js` | Menyimpan konfigurasi global (misalnya API, versi sistem) | `/js/` |
| `print.js` | Menangani pencetakan dan ekspor PDF laporan | `/modules/print/` |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).  
Dapat digunakan dan dimodifikasi secara bebas untuk keperluan **pengembangan layanan publik** di lingkungan Pemerintah Kota Dumai.

---

## ✨ Kontributor

- 👨‍💼 **Camat Dumai Kota** – Pembina Proyek  
- 👨‍💻 **Asisten Camat (Mahasiswa Ilmu Komunikasi, Universitas Terbuka)** – Developer & Dokumentator  
- 🧩 **LPS & Operator Kecamatan** – Pengguna Lapangan

---

> _“Teknologi bukan untuk menggantikan manusia, tetapi untuk mempermudah pelayanan publik agar lebih cepat, transparan, dan akuntabel.”_  
> — *Barang Baru Rasa Lama, 2025*

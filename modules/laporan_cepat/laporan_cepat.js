// Proteksi login + logika form Laporan Cepat
(function () {
  const BASE = window.SIMBEDA_BASE || (function(){
    const parts = window.location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    const roots = new Set(['modules','components','assets','js']);
    return (!first || roots.has(first)) ? '/' : `/${first}/`;
  })();

  // ==== Proteksi Login (halaman internal) ====
  const user = localStorage.getItem('user_login');
  if (!user) {
    // Redirect halus ke halaman login jika belum login
    const loginUrl = BASE + 'modules/login/login.html';
    try { window.location.replace(loginUrl); } catch (_) { window.location.href = loginUrl; }
    return;
  }

  // ==== Elemen ====
  const form = document.getElementById('form-laporan-cepat');
  const kecSel = document.getElementById('kecamatan');
  const kelSel = document.getElementById('kelurahan');
  const kecText = document.getElementById('kecamatan_text');
  const kelText = document.getElementById('kelurahan_text');

  // ==== Opsi Dinamis Minimal ====
  // Hindari data yang berpotensi salah: sediakan opsi manual saat "Lainnya"
  const kelByKec = {
    'Dumai Kota': [] // bisa diisi kemudian dari sumber resmi
  };

  function refreshKelurahan() {
    const kec = kecSel.value;
    kelSel.innerHTML = '<option value="">— pilih —</option>';
    if (kelByKec[kec] && kelByKec[kec].length) {
      kelByKec[kec].forEach(n => {
        const opt = document.createElement('option');
        opt.value = n; opt.textContent = n; kelSel.appendChild(opt);
      });
      kelSel.classList.remove('lc-hidden');
      kelText.classList.add('lc-hidden');
      kelText.value = '';
    } else {
      // kalau tidak ada daftar, arahkan user mengetik manual
      kelSel.classList.add('lc-hidden');
      kelText.classList.remove('lc-hidden');
      kelSel.value = '';
    }
  }

  function toggleKecamatanField() {
    if (kecSel.value === 'Lainnya') {
      kecText.classList.remove('lc-hidden');
      kelSel.classList.add('lc-hidden');
      kelText.classList.remove('lc-hidden');
      kelSel.value = '';
    } else {
      kecText.classList.add('lc-hidden');
      refreshKelurahan();
    }
  }

  if (kecSel && kelSel && kecText && kelText) {
    kecSel.addEventListener('change', toggleKecamatanField);
    toggleKecamatanField();
  }

  // ==== Ambil Lokasi (jika tombol belum di-bind dari inline fallback) ====
  const btnLok = document.getElementById('btn-lokasi');
  if (btnLok && !btnLok.dataset.bound) {
    btnLok.dataset.bound = '1';
    btnLok.addEventListener('click', function (e) {
      e.preventDefault();
      if (!navigator.geolocation) { alert('Geolocation tidak didukung browser.'); return; }
      navigator.geolocation.getCurrentPosition(function (pos) {
        const { latitude, longitude } = pos.coords;
        ['latitude','lat','lokasi_lat'].forEach(id => { const el = document.getElementById(id); if (el) el.value = latitude; });
        ['longitude','lng','lokasi_lng'].forEach(id => { const el = document.getElementById(id); if (el) el.value = longitude; });
      }, function (err) {
        alert('Gagal mengambil lokasi: ' + err.message);
      }, { enableHighAccuracy: true, timeout: 10000 });
    });
  }

  // ==== Submit ====
  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);

    const payload = {
      jenis: data.get('jenis') || 'Lainnya',
      deskripsi: (data.get('deskripsi') || '').trim(),
      kecamatan: (data.get('kecamatan') === 'Lainnya') ? (data.get('kecamatan_text') || '').trim() : (data.get('kecamatan') || '').trim(),
      kelurahan: kelSel && !kelSel.classList.contains('lc-hidden') ? (data.get('kelurahan') || '').trim() : (data.get('kelurahan_text') || '').trim(),
      latitude: (data.get('latitude') || data.get('lat') || data.get('lokasi_lat') || '').toString().trim(),
      longitude: (data.get('longitude') || data.get('lng') || data.get('lokasi_lng') || '').toString().trim(),
      alamat: (data.get('alamat') || '').trim(),
      created_at: new Date().toISOString(),
      by_user: localStorage.getItem('user_name') || localStorage.getItem('user_login') || 'unknown'
    };

    // Validasi minimal
    if (!payload.deskripsi) { alert('Deskripsi wajib diisi.'); return; }
    if (!payload.latitude || !payload.longitude) { alert('Koordinat belum terisi. Klik "Gunakan Lokasi Saya" atau isi manual.'); return; }

    // Simpan lokal (bisa diubah ke API di masa depan)
    const KEY = 'laporan_cepat';
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(payload);
    localStorage.setItem(KEY, JSON.stringify(arr));

    alert('Laporan cepat tersimpan. Tim akan melakukan tindak lanjut.');
    try { window.location.href = BASE + 'modules/dashboard/dashboard.html'; } catch (_) {}
  });
})();
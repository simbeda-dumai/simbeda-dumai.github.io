// Laporan Cepat — pakai data wilayah penuh dari js/config.js
(function () {
  const BASE = window.SIMBEDA_BASE || (function(){
    const parts = window.location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    const roots = new Set(['modules','components','assets','js']);
    return (!first || roots.has(first)) ? '/' : `/${first}/`;
  })();

  // Proteksi (internal)
  const user = localStorage.getItem('user_login');
  if (!user) {
    const loginUrl = BASE + 'modules/login/login.html';
    try { window.location.replace(loginUrl); } catch (_) { window.location.href = loginUrl; }
    return;
  }

  const wilayah = (window.SIMBEDA_WILAYAH || {});
  const LIST_KEC = Array.isArray(wilayah.kecamatan) ? wilayah.kecamatan.slice() : [];
  const KEL_BY_KEC = wilayah.kelurahanByKecamatan || {};

  const form = document.getElementById('form-laporan-cepat');
  const kecSel = document.getElementById('kecamatan');
  const kelSel = document.getElementById('kelurahan');
  const kecText = document.getElementById('kecamatan_text');
  const kelText = document.getElementById('kelurahan_text');

  function populateKecamatan() {
    if (!kecSel) return;
    const current = kecSel.value;
    kecSel.innerHTML = '<option value="">— pilih kecamatan —</option>';
    LIST_KEC.forEach(n => {
      const opt = document.createElement('option');
      opt.value = n; opt.textContent = n; kecSel.appendChild(opt);
    });
    const optLain = document.createElement('option');
    optLain.value = 'Lainnya'; optLain.textContent = 'Lainnya';
    kecSel.appendChild(optLain);
    if (current) Array.from(kecSel.options).some(o => (o.value === current) && (kecSel.value = current));
  }

  function populateKelurahan(kec) {
    if (!kelSel) return;
    kelSel.innerHTML = '<option value="">— pilih kelurahan —</option>';
    const arr = KEL_BY_KEC[kec] || [];
    if (arr.length) {
      arr.forEach(n => {
        const opt = document.createElement('option'); opt.value = n; opt.textContent = n; kelSel.appendChild(opt);
      });
      kelSel.classList.remove('lc-hidden');
      kelText.classList.add('lc-hidden'); kelText.value = '';
    } else {
      kelSel.classList.add('lc-hidden');
      kelText.classList.remove('lc-hidden');
      kelSel.value = '';
    }
  }

  function handleKecamatanChange() {
    const v = kecSel.value;
    if (v === 'Lainnya') {
      kecText.classList.remove('lc-hidden');
      populateKelurahan('');
    } else {
      kecText.classList.add('lc-hidden');
      populateKelurahan(v);
    }
  }

  // Init
  populateKecamatan();
  kecSel && kecSel.addEventListener('change', handleKecamatanChange);
  if (kecSel && kecSel.value) handleKecamatanChange();

  // Geolokasi
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

  // Submit
  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const isLain = (data.get('kecamatan') === 'Lainnya');
    const kecNama = isLain ? (data.get('kecamatan_text') || '').trim() : (data.get('kecamatan') || '').trim();
    const kelNama = (kelSel && !kelSel.classList.contains('lc-hidden')) ? (data.get('kelurahan') || '').trim() : (data.get('kelurahan_text') || '').trim();

    const payload = {
      jenis: data.get('jenis') || 'Lainnya',
      deskripsi: (data.get('deskripsi') || '').trim(),
      kecamatan: kecNama,
      kelurahan: kelNama,
      latitude: (data.get('latitude') || data.get('lat') || data.get('lokasi_lat') || '').toString().trim(),
      longitude: (data.get('longitude') || data.get('lng') || data.get('lokasi_lng') || '').toString().trim(),
      alamat: (data.get('alamat') || '').trim(),
      created_at: new Date().toISOString(),
      by_user: localStorage.getItem('user_name') || localStorage.getItem('user_login') || 'unknown'
    };

    if (!payload.deskripsi) { alert('Deskripsi wajib diisi.'); return; }
    if (!payload.kecamatan) { alert('Kecamatan harus dipilih/diisi.'); return; }
    if (!payload.kelurahan) { alert('Kelurahan harus dipilih/diisi.'); return; }
    if (!payload.latitude || !payload.longitude) { alert('Koordinat belum terisi. Klik \"Gunakan Lokasi Saya\" atau isi manual.'); return; }

    const KEY = 'laporan_cepat';
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(payload);
    localStorage.setItem(KEY, JSON.stringify(arr));

    alert('Laporan cepat tersimpan. Tim akan melakukan tindak lanjut.');
    try { window.location.href = BASE + 'modules/dashboard/dashboard.html'; } catch (_) {}
  });
})();
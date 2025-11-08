// Lapor Warga — gunakan data wilayah dari js/config.js dan simpan ke localStorage
(function () {
  const wilayah = (window.SIMBEDA_WILAYAH || {});
  const LIST_KEC = Array.isArray(wilayah.kecamatan) ? wilayah.kecamatan.slice() : [];
  const KEL_BY_KEC = wilayah.kelurahanByKecamatan || {};

  const form = document.getElementById('form-lapor-warga');
  const kecSel = document.getElementById('kecamatan');
  const kelSel = document.getElementById('kelurahan');
  const kecText = document.getElementById('kecamatan_text');
  const kelText = document.getElementById('kelurahan_text');

  function populateKecamatan() {
    if (!kecSel) return;
    kecSel.innerHTML = '<option value="">— pilih kecamatan —</option>';
    LIST_KEC.forEach(n => {
      const opt = document.createElement('option'); opt.value = n; opt.textContent = n; kecSel.appendChild(opt);
    });
    const optLain = document.createElement('option'); optLain.value = 'Lainnya'; optLain.textContent = 'Lainnya';
    kecSel.appendChild(optLain);
  }

  function populateKelurahan(kec) {
    if (!kelSel) return;
    kelSel.innerHTML = '<option value="">— pilih kelurahan —</option>';
    const arr = KEL_BY_KEC[kec] || [];
    if (arr.length) {
      arr.forEach(n => {
        const opt = document.createElement('option'); opt.value = n; opt.textContent = n; kelSel.appendChild(opt);
      });
      kelSel.classList.remove('lw-hidden');
      kelText.classList.add('lw-hidden'); kelText.value = '';
    } else {
      kelSel.classList.add('lw-hidden');
      kelText.classList.remove('lw-hidden');
      kelSel.value = '';
    }
  }

  function handleKecamatanChange() {
    const v = kecSel.value;
    if (v === 'Lainnya') {
      kecText.classList.remove('lw-hidden');
      populateKelurahan(''); // sembunyikan dropdown
    } else {
      kecText.classList.add('lw-hidden');
      populateKelurahan(v);
    }
  }

  // Init
  populateKecamatan();
  kecSel && kecSel.addEventListener('change', handleKecamatanChange);

  // Submit
  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const isLain = (data.get('kecamatan') === 'Lainnya');
    const kecNama = isLain ? (data.get('kecamatan_text') || '').trim() : (data.get('kecamatan') || '').trim();
    const kelNama = (kelSel && !kelSel.classList.contains('lw-hidden')) ? (data.get('kelurahan') || '').trim() : (data.get('kelurahan_text') || '').trim();

    const payload = {
      by_user: (data.get('nama') || '').trim(),
      kontak: (data.get('kontak') || '').trim(),
      jenis: (data.get('jenis') || 'Lainnya'),
      deskripsi: (data.get('deskripsi') || '').trim(),
      kecamatan: kecNama,
      kelurahan: kelNama,
      alamat: (data.get('alamat') || '').trim(),
      created_at: new Date().toISOString(),
      source: 'lapor_warga'
    };

    if (!payload.by_user) { alert('Nama wajib diisi.'); return; }
    if (!payload.kontak) { alert('Kontak wajib diisi.'); return; }
    if (!payload.kecamatan) { alert('Kecamatan harus dipilih/diisi.'); return; }
    if (!payload.kelurahan) { alert('Kelurahan harus dipilih/diisi.'); return; }
    if (!payload.deskripsi) { alert('Deskripsi wajib diisi.'); return; }

    const KEY = 'lapor_warga';
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(payload);
    localStorage.setItem(KEY, JSON.stringify(arr));

    alert('Laporan berhasil dikirim. Terima kasih!');
    try { window.location.reload(); } catch (_) {}
  });
})();
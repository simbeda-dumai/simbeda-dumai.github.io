(function(){
  const CFG = window.SIMBEDA_CONFIG;
  const elKec = document.getElementById("wKec");
  const elKel = document.getElementById("wKel");

  function fillKecamatan(){
    const list = CFG.listKecamatanNama();
    elKec.innerHTML = `<option value="">Pilih...</option>` + list.map(n => `<option>${n}</option>`).join("");
  }

  function fillKelurahan(namaKec){
    const list = CFG.getKelurahanByKecamatanNama(namaKec);
    elKel.innerHTML = `<option value="">Pilih...</option>` + list.map(n => `<option>${n}</option>`).join("");
  }

  elKec.addEventListener("change", () => fillKelurahan(elKec.value));

  const form = document.getElementById("formWarga");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    if(!data.kecamatan || !data.kelurahan){
      alert("Pilih kecamatan dan kelurahan."); return;
    }
    const KEY = "lapor_warga";
    const cur = JSON.parse(localStorage.getItem(KEY)||"[]");
    cur.push({ ...data, id: "W"+Date.now() });
    localStorage.setItem(KEY, JSON.stringify(cur));
    alert("Terima kasih, laporan Anda sudah terkirim.");
    form.reset();
  });

  fillKecamatan();
})();

(function(){
  const AUTH = window.SIMBEDA_AUTH;
  const CFG = window.SIMBEDA_CONFIG;

  const user = AUTH.getUser();
  const elKec = document.getElementById("fieldKecamatan");
  const elKel = document.getElementById("fieldKelurahan");
  const elJenis = document.getElementById("fieldJenis");
  const wrapJenisManual = document.getElementById("wrapJenisManual");
  const fieldJenisManual = document.getElementById("fieldJenisManual");

  function fillKecamatan(){
    const list = CFG.listKecamatanNama();
    elKec.innerHTML = `<option value="">Pilih...</option>` + list.map(n => `<option>${n}</option>`).join("");
  }

  function fillKelurahan(namaKec){
    const list = CFG.getKelurahanByKecamatanNama(namaKec);
    elKel.innerHTML = `<option value="">Pilih...</option>` + list.map(n => `<option>${n}</option>`).join("");
  }

  // Role-based: admin_kecamatan hanya boleh di kecamatan nya
  function applyRoleRestriction(){
    if (user?.role === "admin_kecamatan" && user?.nama_kec) {
      fillKecamatan();
      elKec.value = user.nama_kec;
      elKec.disabled = true;
      fillKelurahan(user.nama_kec);
    } else {
      fillKecamatan();
    }
  }

  elKec.addEventListener("change", () => fillKelurahan(elKec.value));

  // Jenis Kejadian: jika "Lainnya" tampilkan input manual
  function toggleJenisManual(){
    const v = (elJenis.value || "").toLowerCase();
    wrapJenisManual.style.display = (v === "lainnya") ? "" : "none";
    if (v !== "lainnya") fieldJenisManual.value = "";
  }
  elJenis.addEventListener("change", toggleJenisManual);

  // Simpan form
  const form = document.getElementById("formDetail");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const jenisFinal = (data.jenis || "").toLowerCase() === "lainnya" ? (data.jenis_manual||"").trim() : data.jenis;

    if(!data.kecamatan || !data.kelurahan){
      alert("Pilih kecamatan dan kelurahan."); return;
    }
    if((data.jenis||"") === "Lainnya" && !jenisFinal){
      alert("Isi jenis kejadian manual."); return;
    }

    const payload = {
      ...data,
      jenis: jenisFinal,
      user: { nama: user?.nama, role: user?.role, kode_kec: user?.kode_kec, nama_kec: user?.nama_kec },
      id: "L" + Date.now()
    };

    const KEY = "laporan_detail";
    const cur = JSON.parse(localStorage.getItem(KEY)||"[]");
    cur.push(payload);
    localStorage.setItem(KEY, JSON.stringify(cur));
    alert("Laporan disimpan.");
    form.reset();
    if (user?.role === "admin_kecamatan" && user?.nama_kec) {
      elKec.value = user.nama_kec;
      elKec.disabled = true;
      fillKelurahan(user.nama_kec);
    }
    toggleJenisManual();
  });

  // boot
  applyRoleRestriction();
  toggleJenisManual();
})();

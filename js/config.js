// js/config.js
window.SIMBEDA_CONFIG = (function(){
  const kecamatan = [
    { kode: "DT", nama: "Dumai Timur", kelurahan: ["Bukit Batrem","Jaya Mukti","Bintan","Tanjung Palas","Teluk Binjai"] },
    { kode: "DS", nama: "Dumai Selatan", kelurahan: ["Bukit Datuk","Bukit Timah","Rawa Fajar","Tanjung Penyembal","Mekar Sari"] },
    { kode: "DB", nama: "Dumai Barat", kelurahan: ["Purnama","Bumi Ayu","Sukasari","Bintan Jaya","Bukit Nenas"] },
    { kode: "DK", nama: "Dumai Kota", kelurahan: ["Dumai Kota","Rimba Sekampung","Laksamana","Sukaraja","Bintan"] },
    { kode: "BK", nama: "Bukit Kapur", kelurahan: ["Bukit Kapur","Tanjung Sari","Air Dingin","Kampung Baru"] },
    { kode: "MK", nama: "Medang Kampai", kelurahan: ["Pelintung","Gurun Panjang","Teluk Makmur","Geniot"] },
    { kode: "SS", nama: "Sungai Sembilan", kelurahan: ["Batu Teritip","Lubuk Gaung","Bukit Kerikil","Tanjung Penyembal"] }
  ];
  return {
    kecamatan,
    listKecamatanNama(){ return kecamatan.map(k=>k.nama); },
    getKecamatanByKode(k){ return kecamatan.find(x=>x.kode===String(k||'').toUpperCase())||null; },
    getKelurahanByKecamatanNama(n){
      const k = kecamatan.find(x=>x.nama.toLowerCase()===String(n||'').toLowerCase());
      return k ? [...k.kelurahan] : [];
    }
  };
})();

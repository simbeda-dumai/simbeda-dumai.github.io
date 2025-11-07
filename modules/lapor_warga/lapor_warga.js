document.getElementById('formLapor').addEventListener('submit',e=>{
e.preventDefault();
const laporan={nama:nama.value,nik:nik.value,pekerjaan:pekerjaan.value,alamat:alamat.value,jenis:jenis.value,deskripsi:deskripsi.value,waktu:new Date().toLocaleString()};
const ex=JSON.parse(localStorage.getItem('laporan_warga')||'[]');ex.push(laporan);
localStorage.setItem('laporan_warga',JSON.stringify(ex));
alert('Terima kasih! Laporan Anda sudah tersimpan.');e.target.reset();
});
document.addEventListener("DOMContentLoaded", async()=>{
const map=L.map('map').setView([1.6815,101.4495],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(map);
const admin=await fetch('/data/data_dummy.json').then(r=>r.json());
const warga=JSON.parse(localStorage.getItem('laporan_warga')||'[]');
const all=[...admin.map(d=>({...d,sumber:'Admin'})),...warga.map((d,i)=>({id:1000+i,jenis:d.jenis,lokasi:d.alamat,lat:1.6815+(Math.random()-0.5)*0.02,lng:101.4495+(Math.random()-0.5)*0.02,tanggal:d.waktu,kerugian:d.deskripsi,korban:'Pelapor: '+d.nama,status:'Laporan Warga',sumber:'Warga'}))];
all.forEach(d=>{const color=d.sumber==='Warga'?'red':'blue';L.circleMarker([d.lat,d.lng],{color,fillColor:color,fillOpacity:0.7,radius:7}).addTo(map).bindPopup(`<b>${d.jenis}</b><br>${d.lokasi}<br><small>${d.tanggal}</small><br>${d.status}<br>${d.korban}`);});
});
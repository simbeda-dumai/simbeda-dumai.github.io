function updateDateTime(){
 const dt=document.getElementById("datetime");
 if(!dt) return;
 const hari=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
 const bulan=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
 const now=new Date();
 const text=`${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()} | ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")} WIB`;
 dt.textContent=text;
}
function updateQuote(){
 const quotes=[
  "Kesiapsiagaan adalah kunci mengurangi risiko bencana.",
  "Satu langkah kecil hari ini bisa menyelamatkan banyak nyawa besok.",
  "Solidaritas adalah kekuatan dalam menghadapi bencana."
 ];
 const q=document.getElementById("quote");
 q.textContent=quotes[Math.floor(Math.random()*quotes.length)];
}
setInterval(updateDateTime,1000);
setInterval(updateQuote,300000);
updateDateTime();updateQuote();

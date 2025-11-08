// components/footer/quotes.js
(function(){
  const quotes=["“Selalu siap, sigap, dan solid.”","“Cegah lebih baik daripada tanggap.”","“Data akurat, respon cepat.”","“Bersama warga, kita kuat.”"];
  function tick(){ const el=document.getElementById("quotesBox"); if(!el) return; const i=Math.floor(Date.now()/1000/300)%quotes.length; el.textContent=quotes[i]; }
  tick(); setInterval(tick, 10000);
})();

const quotes=[
  "Kesiapsiagaan adalah kunci mengurangi risiko bencana.",
  "Kerja cepat, tanggap, dan tepat menyelamatkan banyak jiwa.",
  "Bersama kita kuat menghadapi bencana.",
  "Data yang baik menyelamatkan keputusan yang besar."
];
function updateQuote(){
 const el=document.getElementById('quote');
 const i=Math.floor(Math.random()*quotes.length);
 el.textContent=quotes[i];
}
setInterval(updateQuote,300000);
updateQuote();
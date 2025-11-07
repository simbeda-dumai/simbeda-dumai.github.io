const quotes = [
  "Kesiapsiagaan adalah kunci mengurangi risiko bencana.",
  "Kerja cepat, tanggap, dan tepat menyelamatkan banyak jiwa.",
  "Bersama kita kuat menghadapi bencana.",
  "Data yang baik menyelamatkan keputusan yang besar."
];
function updateQuote() {
  const quoteEl = document.getElementById('quote');
  const random = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = quotes[random];
}
setInterval(updateQuote, 300000);
updateQuote();

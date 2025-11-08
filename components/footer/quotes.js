const quotes = [
  "Kesiapsiagaan hari ini adalah keselamatan esok hari.",
  "Bencana bisa datang kapan saja, siaplah dari sekarang.",
  "Solidaritas adalah kekuatan terbesar saat bencana.",
  "Tanggap, tangguh, dan tumbuh bersama.",
  "Satu langkah siaga, sejuta nyawa terselamatkan."
];

function updateFooter() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quote").textContent = q;
  document.querySelector(".footer-right").style.animation = "fadeQuote 1s ease-in-out";
}

function updateTime() {
  const now = new Date();
  document.getElementById("timeNow").textContent =
    now.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" });
}

// Update awal
updateFooter();
updateTime();

// Ubah quotes tiap 60 detik
setInterval(updateFooter, 60000);
// Update waktu real-time tiap detik
setInterval(updateTime, 1000);

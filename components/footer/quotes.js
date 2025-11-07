// ===== WAKTU REAL-TIME =====
function updateTime() {
  const el = document.getElementById("timeNow");
  if (!el) return;
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const day = days[now.getDay()];
  const date = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const time = now.toLocaleTimeString("id-ID", { hour12: false });
  el.innerHTML = `${day}, ${date} — ${time}`;
}
setInterval(updateTime, 1000);
updateTime();

// ===== QUOTES INSPIRATIF =====
const quotes = [
  "Kesiapsiagaan hari ini adalah keselamatan esok hari.",
  "Bersama kita kuat, bersama kita selamat.",
  "Tanggap bukan hanya saat bencana datang, tapi sebelum bencana tiba.",
  "Setiap tindakan kecil bisa menyelamatkan nyawa besar.",
  "Gotong royong adalah kekuatan sejati dalam menghadapi bencana.",
  "Siaga bukan pilihan, tapi kewajiban setiap warga.",
  "Mencegah lebih baik daripada menanggulangi.",
  "Bencana menguji, kepedulian menyatukan.",
  "Ketangguhan dimulai dari kesadaran diri dan kebersamaan.",
  "Tidak ada yang lebih kuat dari masyarakat yang saling membantu."
];

const quoteElement = document.createElement("p");
quoteElement.id = "disasterQuote";
quoteElement.style.marginTop = "6px";
quoteElement.style.fontSize = "0.9em";
quoteElement.style.fontWeight = "500";
quoteElement.style.color = "#374151";
document.querySelector(".app-footer .footer-text").appendChild(quoteElement);

function updateQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = `"${randomQuote}"`;
}

// ubah kata bijak tiap 5 menit
updateQuote();
setInterval(updateQuote, 5 * 60 * 1000);

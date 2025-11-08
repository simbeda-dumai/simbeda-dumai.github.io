// SIMBEDA - Footer Quotes + Real-time Clock (robust init + 50 quotes)
(function () {
  'use strict';

  const QUOTES = [
    // Motivasi kerja (1–15)
    "Kerja tuntas lebih baik daripada rencana sempurna yang tak dimulai.",
    "Disiplin hari ini adalah kenyamanan esok hari.",
    "Kecil tapi konsisten mengalahkan besar tapi sesekali.",
    "Fokus pada satu prioritas sampai selesai.",
    "Belajar satu hal baru tiap hari—kemajuan kecil tetap kemajuan.",
    "Tujuan jelas, langkah tegas, hasil terasa.",
    "Waktu tidak kembali—rapikan jadwal, percepat hasil.",
    "Kerja cerdas: hilangkan yang tidak perlu.",
    "Kolaborasi mempercepat, ego memperlambat.",
    "Masalah adalah data; emosi hanyalah sinyal.",
    "Standar tinggi dimulai dari kebiasaan sederhana.",
    "Rapat singkat, aksi panjang.",
    "Catat, kerjakan, tindaklanjuti.",
    "Sukses itu kebiasaan, bukan kejutan.",
    "Layanan publik terbaik lahir dari detail yang rapi.",

    // Manajemen bencana (16–35)
    "Siaga bukan panik; tenang bukan lambat.",
    "Data tepat waktu menyelamatkan lebih banyak nyawa.",
    "Latihan hari ini mengurangi risiko besok.",
    "Peringatan dini tanpa aksi hanyalah bunyi.",
    "Peta risiko adalah kompas keputusan.",
    "Koordinasi cepat lebih penting daripada alat mahal.",
    "Informasi jelas mencegah kepanikan massal.",
    "Evakuasi yang terencana menghindari evakuasi yang tergesa.",
    "Logistik harus bergerak lebih cepat daripada rumor.",
    "Relawan kuat karena sistem yang rapi.",
    "Mitigasi hari ini mengurangi respon besok.",
    "Komando satu suara, aksi seribu tangan.",
    "Komunikasi yang empatik menyejukkan saat krisis.",
    "Setiap laporan warga adalah potongan puzzle situasi.",
    "Keamanan petugas adalah prasyarat penolong yang efektif.",
    "Skenario terburuk dilatih, agar tak jadi kejutan.",
    "Air surut bisa meninggalkan trauma—pendampingan itu juga respon.",
    "Bencana tidak pilih wilayah; sistem harus merata.",
    "Transparansi data menumbuhkan kepercayaan publik.",
    "Rehabilitasi yang baik dimulai dari dokumentasi yang baik.",

    // Kota Dumai (36–50)
    "Dumai siaga, Dumai saling jaga.",
    "Angin pesisir membawa pesan: waspada tanpa henti.",
    "Dari pelabuhan hingga pemukiman, informasi harus mengalir.",
    "Dumai kuat karena warganya saling menguatkan.",
    "Pantai tenang, sistem tangguh.",
    "Kota migas, data juga harus deras.",
    "Hujan boleh deras, koordinasi harus deras dua kali lipat.",
    "Dumai cepat, respon pun tepat.",
    "Langit biru Dumai butuh kesiapsiagaan hijau.",
    "Dari kelurahan ke kota: satu peta, satu data.",
    "Ketika sirine berbunyi, semua peran menjadi satu.",
    "Dumai tumbuh, resiliensi pun harus tumbuh.",
    "Keramahan Melayu, ketegasan saat darurat.",
    "Pelabuhan ramai, komunikasi jangan sampai berhenti.",
    "Dumai hari ini belajar untuk Dumai yang lebih aman besok."
  ];

  const Q_SEL = '#footer-quote';
  const C_SEL = '#footer-clock';
  const QUOTE_INTERVAL = 5 * 60 * 1000; // 5 menit
  const CLOCK_INTERVAL = 1000;          // 1 detik

  function startClock(clockEl) {
    const tick = () => { clockEl.textContent = new Date().toLocaleTimeString('id-ID', { hour12:false }); };
    tick();
    setInterval(tick, CLOCK_INTERVAL);
  }

  function startQuotes(quoteEl) {
    let idx = Math.floor(Date.now() / QUOTE_INTERVAL) % QUOTES.length;
    const render = () => { quoteEl.textContent = QUOTES[idx % QUOTES.length]; idx++; };
    render();
    setInterval(render, QUOTE_INTERVAL);
  }

  function initFooterUI() {
    let tries = 0, max = 150; // ~15 detik
    (function waitForElements() {
      const quoteEl = document.querySelector(Q_SEL);
      const clockEl = document.querySelector(C_SEL);
      if (quoteEl && clockEl) {
        startClock(clockEl);
        startQuotes(quoteEl);
        return;
      }
      if (tries++ < max) setTimeout(waitForElements, 100);
    })();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFooterUI();
  } else {
    document.addEventListener('DOMContentLoaded', initFooterUI, { once:true });
  }

  // Hook opsional untuk dipanggil manual dari layout.js
  window.SIMBEDA_FOOTER_BOOT = initFooterUI;
})();

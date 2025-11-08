(function(){
  var quotes = [
    "Siaga hari ini, aman esok hari.",
    "Kesigapan adalah separuh dari keselamatan.",
    "Data yang baik menyelamatkan banyak orang."
  ];
  function rot(){
    var el = document.getElementById('quote-rotator');
    if(!el) return;
    var i = Math.floor(Date.now()/300000) % quotes.length; // ganti tiap 5 menit
    el.textContent = "“" + quotes[i] + "”";
  }
  rot();
  setInterval(rot, 60*1000); // refresh per menit untuk sinkronisasi
})();

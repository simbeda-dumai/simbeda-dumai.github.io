let mapPicker;
let marker;

function gantiModeLokasi() {
  const mode = document.getElementById('modeLokasi').value;
  document.getElementById('inputLatLng').style.display = mode === 'latlng' ? 'block' : 'none';
  document.getElementById('inputUTM').style.display = mode === 'utm' ? 'block' : 'none';
  document.getElementById('inputMap').style.display = mode === 'map' ? 'block' : 'none';

  if (mode === 'map' && !mapPicker) initMapPicker();
}

function initMapPicker() {
  mapPicker = L.map('mapPicker').setView([1.6815, 101.4495], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapPicker);

  mapPicker.on('click', function (e) {
    const { lat, lng } = e.latlng;
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);

    if (marker) mapPicker.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(mapPicker)
      .bindPopup(`Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
  });
}

function konversiUTM() {
  const zona = document.getElementById('utmZona').value.trim();
  const easting = parseFloat(document.getElementById('utmEasting').value);
  const northing = parseFloat(document.getElementById('utmNorthing').value);

  if (!zona || isNaN(easting) || isNaN(northing)) {
    alert('Lengkapi data UTM terlebih dahulu.');
    return;
  }

  const proj4str = `+proj=utm +zone=${zona.replace(/\D/g, '')} +datum=WGS84 +units=m +no_defs`;
  const [lng, lat] = proj4(proj4str, '+proj=longlat +datum=WGS84 +no_defs', [easting, northing]);
  document.getElementById('latitude').value = lat.toFixed(6);
  document.getElementById('longitude').value = lng.toFixed(6);
  alert(`Hasil konversi: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
}

function simpanLaporan() {
  const laporan = {
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value),
    waktu: new Date().toISOString()
  };
  localStorage.setItem("laporan_terbaru", JSON.stringify(laporan));
  alert("Laporan berhasil disimpan di LocalStorage!");
}

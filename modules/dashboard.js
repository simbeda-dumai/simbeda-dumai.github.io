// Dashboard — tambah rekap laporan dari localStorage (laporan_cepat & lapor_warga)
(function () {
  const BASE = window.SIMBEDA_BASE || (function(){
    const parts = window.location.pathname.split('/').filter(Boolean);
    const first = parts[0];
    const roots = new Set(['modules','components','assets','js']);
    return (!first || roots.has(first)) ? '/' : `/${first}/`;
  })();

  // Proteksi login jika dashboard internal
  const user = localStorage.getItem('user_login');
  if (!user) {
    const loginUrl = BASE + 'modules/login/login.html';
    try { window.location.replace(loginUrl); } catch (_) { window.location.href = loginUrl; }
    return;
  }

  function read(key){ try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(_) { return []; } }
  const cepat = read('laporan_cepat').map(x => ({...x, __type:'cepat'}));
  const warga = read('lapor_warga').map(x => ({...x, __type:'warga'}));
  const all = [...cepat, ...warga];

  function groupBy(arr, fnKey) {
    const map = new Map();
    arr.forEach(item => {
      const k = fnKey(item);
      map.set(k, (map.get(k) || 0) + 1);
    });
    return map; // Map(key -> count)
  }

  function ensureStyles() {
    if (document.getElementById('recap-style')) return;
    const css = `
    .recap {max-width: 1200px; margin: 16px auto; padding: 0 16px;}
    .recap-cards {display: grid; grid-template-columns: 1fr; gap: 12px; margin: 12px 0;}
    @media(min-width: 780px){ .recap-cards { grid-template-columns: repeat(3, 1fr);} }
    .recap-card {background:#fff;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,.08);padding:16px}
    .recap-card h3{margin:0 0 6px;font-size:1rem}
    .recap-card .num{font-size:1.8rem;font-weight:800}
    .recap table{width:100%;border-collapse:collapse;margin-top:8px}
    .recap th,.recap td{border-bottom:1px solid #e5e7eb;padding:8px;text-align:left}
    .recap th{font-size:.9rem;color:#475569}
    .recap .muted{color:#64748b;font-size:.9rem}
    `;
    const s = document.createElement('style'); s.id = 'recap-style'; s.textContent = css; document.head.appendChild(s);
  }

  function formatInt(n){ return new Intl.NumberFormat('id-ID').format(n); }

  function renderRecap() {
    ensureStyles();
    let root = document.getElementById('recap-container');
    if (!root) {
      root = document.createElement('section');
      root.id = 'recap-container';
      root.className = 'recap';
      const anchor = document.querySelector('main') || document.body;
      anchor.appendChild(root);
    }
    root.innerHTML = '';

    // Cards summary
    const cardWrap = document.createElement('div'); cardWrap.className = 'recap-cards';
    const cardTotal = (title, num, sub) => {
      const el = document.createElement('div'); el.className = 'recap-card';
      el.innerHTML = `<h3>${title}</h3><div class="num">${formatInt(num)}</div>${sub?`<div class="muted">${sub}</div>`:''}`; return el;
    };
    cardWrap.appendChild(cardTotal('Total Semua Laporan', all.length, 'Laporan Cepat + Lapor Warga'));
    cardWrap.appendChild(cardTotal('Laporan Cepat', cepat.length, 'Internal petugas'));
    cardWrap.appendChild(cardTotal('Lapor Warga', warga.length, 'Dari masyarakat'));
    root.appendChild(cardWrap);

    // Table per kecamatan
    const kecMap = groupBy(all, x => (x.kecamatan || '—'));
    const kelMap = groupBy(all, x => (x.kelurahan || '—'));

    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>Wilayah</th><th>Jumlah</th></tr></thead>';
    const tb = document.createElement('tbody');
    Array.from(kecMap.entries()).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${k}</td><td>${formatInt(v)}</td>`; tb.appendChild(tr);
    });
    table.appendChild(tb);

    const title1 = document.createElement('h3'); title1.textContent = 'Rekap per Kecamatan';
    root.appendChild(title1);
    root.appendChild(table);

    // Table per kelurahan (top 20)
    const table2 = document.createElement('table');
    table2.innerHTML = '<thead><tr><th>Kelurahan/Desa</th><th>Jumlah</th></tr></thead>';
    const tb2 = document.createElement('tbody');
    Array.from(kelMap.entries()).sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([k,v])=>{
      const tr = document.createElement('tr'); tr.innerHTML = `<td>${k}</td><td>${formatInt(v)}</td>`; tb2.appendChild(tr);
    });
    table2.appendChild(tb2);

    const title2 = document.createElement('h3'); title2.textContent = 'Top 20 Kelurahan/Desa';
    root.appendChild(title2);
    root.appendChild(table2);
  }

  // Render setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderRecap);
  } else {
    renderRecap();
  }
})();

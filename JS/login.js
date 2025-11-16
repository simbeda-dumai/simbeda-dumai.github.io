(function () {
  'use strict';

  const USER_JSON_CANDIDATES = ['/JSON/users.json', 'JSON/users.json'];
  const REDIRECT_BY_ROLE = {
    'Kota': '/HTML/dashboard.html',
    'Kecamatan': '/HTML/dashboard.html',
    'default': '/HTML/dashboard.html'
  };

  const $ = (sel) => document.querySelector(sel);
  const pick = (...vals) => {
    for (const v of vals) if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  };

  async function loadUsers() {
    for (const url of USER_JSON_CANDIDATES) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) return normalizeUsers(await res.json());
      } catch (_) {}
    }
    throw new Error('users.json gagal dimuat. Periksa path: /JSON/users.json');
  }

  function normalizeUsers(raw) {
    const map = {};
    if (Array.isArray(raw)) {
      for (const u of raw) {
        const uname = pick(u.username, u.user, u.id, u.code);
        if (!uname) continue;
        map[String(uname).toLowerCase()] = { username: uname, ...u };
      }
      return map;
    }
    if (raw && typeof raw === 'object') {
      for (const [key, val] of Object.entries(raw)) {
        const uname = pick(val?.username, key);
        if (!uname) continue;
        map[String(uname).toLowerCase()] = { username: uname, ...val };
      }
      return map;
    }
    return map;
  }

  function getDom() {
    return {
      u: $('#username') || $('[name="username"]'),
      p: $('#password') || $('[name="password"]'),
      btn: $('#btn-login') || $('button[type="submit"], .btn-primary'),
      msg: $('#login-msg') || $('.msg')
    };
  }

  function showMsg(el, text, ok = false) {
    if (!el) return;
    el.textContent = text || '';
    el.style.color = ok ? '#7CFC7C' : '#ffd966';
  }

  function validate(users, uname, pass) {
    if (!uname || !pass) return ['Isi pengguna & kata sandi.'];
    const rec = users[String(uname).toLowerCase()];
    if (!rec) return ['Pengguna tidak ditemukan.'];
    const expected = pick(rec.password, rec.pass, rec.pw, rec.katasandi);
    if (String(pass) !== String(expected)) return ['Kata sandi salah.'];
    const role = pick(rec.role, rec.level, rec.jabatan, 'user');
    const area = pick(rec.area, rec.kecamatan, rec.kota);
    const modules = Array.isArray(rec.modules) ? rec.modules : [];
    return [null, { rec, role, area, modules }];
  }

  function nextUrl(info) {
    return REDIRECT_BY_ROLE[info?.role] || REDIRECT_BY_ROLE.default;
  }

  function saveSession(username, info) {
    try {
      const payload = {
        username,
        role: info?.role || null,
        area: info?.area || null,
        modules: info?.modules || [],
        t: Date.now()
      };
      localStorage.setItem('simbeda_auth', JSON.stringify(payload));
    } catch (_) {}
  }

  async function boot() {
    const dom = getDom();
    if (!dom.u || !dom.p || !dom.btn) return;

    let USERS = {};
    try {
      USERS = await loadUsers();
    } catch (err) {
      console.error(err);
      showMsg(dom.msg, 'Gagal memuat users.json. Periksa /JSON/users.json');
      return;
    }

    const submit = () => dom.btn.click();
    dom.u.addEventListener('keydown', (e) => (e.key === 'Enter') && submit());
    dom.p.addEventListener('keydown', (e) => (e.key === 'Enter') && submit());

    dom.btn.addEventListener('click', (e) => {
      e.preventDefault();
      const uname = (dom.u.value || '').trim();
      const pass = (dom.p.value || '').trim();
      const [err, info] = validate(USERS, uname, pass);
      if (err) return showMsg(dom.msg, err);
      showMsg(dom.msg, 'Berhasil masuk.', true);
      saveSession(uname, info);
      window.location.assign(nextUrl(info));
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

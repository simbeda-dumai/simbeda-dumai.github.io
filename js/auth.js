// js/auth.js
(function(){
  const KEY = "simbeda_current_user";
  function setUser(u){ localStorage.setItem(KEY, JSON.stringify(u)); }
  function getUser(){ try{ return JSON.parse(localStorage.getItem(KEY)||"null"); }catch(_){ return null; } }
  function isLoggedIn(){ return !!getUser(); }
  function logout(){ localStorage.removeItem(KEY); }
  window.SIMBEDA_AUTH = { setUser, getUser, isLoggedIn, logout };
  const isLoginPage = /\/modules\/login\/login\.html$/i.test(location.pathname) || /\/login\.html$/i.test(location.pathname);
  if(!isLoginPage && !isLoggedIn()){ location.replace("/modules/login/login.html"); }
  document.addEventListener("simbeda:header:ready", ()=>{
    const user = getUser();
    const box = document.querySelector("#userBox");
    if(!box) return;
    if(user){
      box.innerHTML = `
      <nav class="nav">
        <a href="/" class="brand">SIMBEDA</a>
        <div class="spacer"></div>
        <span class="user">👤 ${user.nama}${user.kode_kec?` · ${user.kode_kec}`:""}</span>
        <button id="btnLogout" class="logout">Logout</button>
      </nav>`;
      const btn = document.getElementById("btnLogout");
      btn?.addEventListener("click", ()=>{ logout(); location.replace("/modules/login/login.html"); });
    }else{
      box.innerHTML = `<nav class="nav"><a href="/" class="brand">SIMBEDA</a><div class="spacer"></div><a href="/modules/login/login.html">Login</a></nav>`;
    }
  });
})();

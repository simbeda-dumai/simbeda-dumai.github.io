// js/layout/layout.js
(function(){
  async function inject(part, sel){
    const res = await fetch(`/components/${part}/${part}.html`, {cache:"no-store"});
    const html = await res.text();
    document.querySelector(sel).innerHTML = html;
  }
  async function boot(){
    if(!document.querySelector("#app-header")){ const h=document.createElement("div"); h.id="app-header"; document.body.prepend(h); }
    if(!document.querySelector("#app-footer")){ const f=document.createElement("div"); f.id="app-footer"; document.body.append(f); }
    await inject("header", "#app-header");  document.dispatchEvent(new CustomEvent("simbeda:header:ready"));
    await inject("footer", "#app-footer");
  }
  document.addEventListener("DOMContentLoaded", boot);
})();

document.addEventListener("DOMContentLoaded",()=>{
 fetch("/components/header/header.html").then(r=>r.text()).then(h=>document.getElementById("header").innerHTML=h);
 fetch("/components/footer/footer.html").then(r=>r.text()).then(f=>{
  document.getElementById("footer").innerHTML=f;
  const s=document.createElement("script");
  s.src="/components/footer/quotes.js";document.body.appendChild(s);
 });
});

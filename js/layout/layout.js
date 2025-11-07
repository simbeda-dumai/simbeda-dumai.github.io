document.addEventListener("DOMContentLoaded", async () => {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  const [headerHTML, footerHTML] = await Promise.all([
    fetch("/components/header/header.html").then(r => r.text()),
    fetch("/components/footer/footer.html").then(r => r.text())
  ]);

  header.innerHTML = headerHTML;
  footer.innerHTML = footerHTML;

  const linkH = document.createElement("link");
  linkH.rel="stylesheet"; linkH.href="/components/header/header.css";
  document.head.appendChild(linkH);

  const linkF=document.createElement("link");
  linkF.rel="stylesheet"; linkF.href="/components/footer/footer.css";
  document.head.appendChild(linkF);

  const script=document.createElement("script");
  script.src="/components/footer/quotes.js";
  document.body.appendChild(script);
});

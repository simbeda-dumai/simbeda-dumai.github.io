document.addEventListener("DOMContentLoaded", async () => {
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  const [headerHTML, footerHTML] = await Promise.all([
    fetch("/components/header/header.html").then(r => r.text()),
    fetch("/components/footer/footer.html").then(r => r.text())
  ]);

  header.innerHTML = headerHTML;
  footer.innerHTML = footerHTML;

  const linkHeader = document.createElement("link");
  linkHeader.rel = "stylesheet";
  linkHeader.href = "/components/header/header.css";
  document.head.appendChild(linkHeader);

  const linkFooter = document.createElement("link");
  linkFooter.rel = "stylesheet";
  linkFooter.href = "/components/footer/footer.css";
  document.head.appendChild(linkFooter);

  const scriptQuotes = document.createElement("script");
  scriptQuotes.src = "/components/footer/quotes.js";
  document.body.appendChild(scriptQuotes);
});

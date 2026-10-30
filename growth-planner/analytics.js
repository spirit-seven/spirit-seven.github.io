// Cloudflare Web Analytics: cookie-free visit counts. Skipped for anyone who has opted out on
// the privacy page.
(function () {
  try {
    if (localStorage.getItem("noVisitCount")) return;
  } catch (e) {}
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute("data-cf-beacon", '{"token": "24db23541c8741f593bff9ea0e38ba56"}');
  document.head.appendChild(script);
})();

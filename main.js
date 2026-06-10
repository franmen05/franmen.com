/* Franmen — interacciones del sitio */
(function () {
  "use strict";

  /* ---- Tema claro/oscuro ---- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("fg-theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("fg-theme", next); } catch (e) {}
    });
  }

  /* ---- Nav: sombra al hacer scroll ---- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menú móvil ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () { navLinks.classList.toggle("open"); });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") navLinks.classList.remove("open");
    });
  }

  /* ---- Activar modo JS (habilita ocultar/revelar) ---- */
  root.classList.add("js");

  /* ---- Reveal al hacer scroll (detección manual, robusta) ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function checkReveal() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) {
        el.classList.add("in");
        revealEls.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", checkReveal, { passive: true });
  window.addEventListener("resize", checkReveal);
  window.addEventListener("load", checkReveal);
  // Primer pase tras el layout, con reintentos
  requestAnimationFrame(function () { requestAnimationFrame(checkReveal); });
  setTimeout(checkReveal, 80);
  setTimeout(checkReveal, 400);
  // Red de seguridad: nada permanece oculto pase lo que pase
  setTimeout(function () {
    revealEls.slice().forEach(function (el) { el.classList.add("in"); });
    revealEls.length = 0;
  }, 2200);

  /* ---- Resaltado de sección activa en el nav ---- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var linkMap = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var id = a.getAttribute("href");
    if (id && id.charAt(0) === "#") linkMap[id.slice(1)] = a;
  });
  function checkActive() {
    var pos = window.scrollY + (window.innerHeight || 0) * 0.35;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.getAttribute("id");
    });
    Object.keys(linkMap).forEach(function (k) {
      linkMap[k].classList.toggle("active", k === current);
    });
  }
  window.addEventListener("scroll", checkActive, { passive: true });
  checkActive();

  /* ---- Año dinámico ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

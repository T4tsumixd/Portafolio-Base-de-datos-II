/* ═══════════════════════════════════════════════════════════
   scroll-reveal.js — Animación de entrada al hacer scroll
   Todo elemento con clase .reveal aparece al entrar en vista
   ═══════════════════════════════════════════════════════════ */

(function () {
  const elementos = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ═══════════════════════════════════════════════════════════
   cursor.js — Cursor personalizado estilo DMC
   Controla el anillo rojo y el punto de seguimiento (trail)
   ═══════════════════════════════════════════════════════════ */

(function () {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');

  // Posición actual del mouse
  let mouseX = 0, mouseY = 0;
  // Posición interpolada del trail
  let trailX = 0, trailY = 0;

  // Seguir el mouse exactamente con el anillo
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Animar el trail con interpolación suave (lerp)
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Agrandar cursor al pasar sobre elementos clicables
  document.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    el.addEventListener('mouseleave', function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   particles.js — Sistema de partículas de fuego estilo DMC
   Renderiza brasas rojas y doradas que ascienden por pantalla
   ═══════════════════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('particulas');
  const ctx    = canvas.getContext('2d');

  let W, H;
  const CANTIDAD = 120;
  const particles = [];

  // Ajustar canvas al tamaño de la ventana
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ──────────────────────────────────
  // Clase Partícula
  // ──────────────────────────────────
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x     = Math.random() * W;
      this.y     = H + Math.random() * 100;   // empieza debajo de la pantalla
      this.vy    = -(0.3 + Math.random() * 1.2); // sube
      this.vx    = (Math.random() - 0.5) * 0.3;  // leve movimiento lateral
      this.r     = 0.5 + Math.random() * 2;
      this.life  = 1;
      this.decay = 0.003 + Math.random() * 0.005;

      // Color: 60% rojas, 40% doradas
      const esRoja = Math.random() < 0.6;
      if (esRoja) {
        this.color = `rgba(${180 + Math.floor(Math.random() * 75)}, ${Math.floor(Math.random() * 30)}, 0,`;
      } else {
        this.color = `rgba(${200 + Math.floor(Math.random() * 55)}, ${140 + Math.floor(Math.random() * 70)}, 0,`;
      }
    }

    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life -= this.decay;

      if (this.life <= 0 || this.y < -10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.life + ')';
      ctx.fill();
    }
  }

  // ──────────────────────────────────
  // Inicializar con posiciones dispersas
  // ──────────────────────────────────
  for (let i = 0; i < CANTIDAD; i++) {
    const p = new Particle();
    p.y = Math.random() * H; // distribuir por toda la pantalla al inicio
    particles.push(p);
  }

  // ──────────────────────────────────
  // Loop de animación
  // ──────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

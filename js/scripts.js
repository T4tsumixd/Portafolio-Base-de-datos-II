function scrollToTrabajos() {
  document.getElementById("trabajos").scrollIntoView({
    behavior: "smooth"
  });
}

function verProyecto() {
  alert("Aquí puedes poner el link de tu proyecto");
}

// Al cargar la página, revisa si hay un usuario en sesión
window.addEventListener('DOMContentLoaded', function () {
  const usuarioActivo = localStorage.getItem('usuarioActivo');

  if (usuarioActivo) {
    document.getElementById('navbar-nombre').textContent = '👤 ' + usuarioActivo;

    const btnAuth = document.getElementById('btn-auth');
    btnAuth.textContent = 'Cerrar sesión';
    btnAuth.href = '#';
    btnAuth.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('usuarioActivo');
      window.location.reload();
    });

    // 🔥 MOSTRAR PANEL ADMIN
    document.getElementById("panel-admin").style.display = "block";
  }

  // 🔥 CARGAR TRABAJOS SIEMPRE
  cargarTrabajos();
});

function agregarSemana() {
  const titulo = document.getElementById("titulo-semana").value;
  const descripcion = document.getElementById("descripcion-semana").value;
  const archivo = document.getElementById("archivo-semana").files[0];
  const unidad = document.getElementById("unidad-semana").value;

  if (!titulo || !descripcion || !archivo) {
    alert("Completa todos los campos");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const semanas = JSON.parse(localStorage.getItem("semanas")) || [];

    semanas.push({
      titulo,
      descripcion,
      archivo: e.target.result,
      unidad
    });

    localStorage.setItem("semanas", JSON.stringify(semanas));

    location.reload();
  };

  reader.readAsDataURL(archivo);
}

function cargarSemanas() {
  const semanas = JSON.parse(localStorage.getItem("semanas")) || [];

  semanas.forEach(s => {
    const contenedor = document.getElementById(`unidad-${s.unidad}`);

    if (contenedor) {
      const div = document.createElement("div");
      div.className = "col-md-4";

      div.innerHTML = `
        <div class="card p-3 semana-card">

          <span class="btn-eliminar" onclick="eliminarSemana(this)">🗑</span>

          <h5>${s.titulo}</h5>
          <p>${s.descripcion}</p>

          <a href="${s.archivo}" target="_blank" class="btn btn-primary mb-2">
            Ver Informe
          </a>

          <button class="btn btn-outline-primary btn-sm" onclick="verMas(this)">
            Ver más trabajos
          </button>

          <div class="extra-trabajos mt-2" style="display:none;"></div>

        </div>
      `;

      contenedor.appendChild(div);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuarioActivo");

  if (usuario) {
    const panel = document.getElementById("panel-admin");
    if (panel) panel.style.display = "block";
  }

  cargarTrabajos();
});
const usuarioActivo = localStorage.getItem('usuarioActivo');

window.addEventListener("DOMContentLoaded", () => {
  cargarSemanas();
});

if (usuarioActivo) {
  document.getElementById("btn-logout").style.display = "inline-block";

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.reload();
  });
}

function abrirModal(archivo) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("visor").src = archivo;
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

window.addEventListener("scroll", () => {
  document.querySelectorAll(".animar").forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
});

function verMas(btn) {
  const contenedor = btn.nextElementSibling;

  if (contenedor.style.display === "none") {
    contenedor.style.display = "block";
    btn.textContent = "Ver menos";
  } else {
    contenedor.style.display = "none";
    btn.textContent = "Ver más trabajos";
  }
}

function eliminarSemana(btn) {
  const card = btn.closest(".col-md-4");
  card.remove();
}

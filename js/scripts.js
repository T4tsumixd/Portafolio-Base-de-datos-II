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

function agregarTrabajo() {
  const titulo = document.getElementById("titulo-trabajo").value;
  const unidad = document.getElementById("unidad").value;
  const archivo = document.getElementById("archivo").files[0];

  if (!archivo) {
    alert("Sube un archivo");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];

    trabajos.push({
      titulo,
      unidad,
      archivo: e.target.result
    });

    localStorage.setItem("trabajos", JSON.stringify(trabajos));
    location.reload();
  };

  reader.readAsDataURL(archivo);
}

function cargarTrabajos() {
  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];

  trabajos.forEach(t => {
    const contenedor = document.getElementById(`unidad-${t.unidad}`);

    if (contenedor) {
      const div = document.createElement("div");
      div.className = "col-md-4 mb-4";

      div.innerHTML = `
        <div class="card p-3">
          <h5>${t.titulo}</h5>
          <button class="btn btn-primary" onclick="abrirModal('${t.archivo}')">
            Ver
          </button>
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
  cargarTrabajos();
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
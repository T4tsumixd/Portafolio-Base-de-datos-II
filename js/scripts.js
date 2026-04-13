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
  const desc = document.getElementById("desc-trabajo").value;
  const link = document.getElementById("link-trabajo").value;

  if (!titulo || !desc || !link) {
    alert("Completa todos los campos");
    return;
  }

  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];

  trabajos.push({ titulo, desc, link });

  localStorage.setItem("trabajos", JSON.stringify(trabajos));

  location.reload();
}
function cargarTrabajos() {
  const contenedor = document.getElementById("contenedor-trabajos");
  if (!contenedor) return;

  const trabajos = JSON.parse(localStorage.getItem("trabajos")) || [];

  contenedor.innerHTML = "";

  trabajos.forEach(trabajo => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";

    div.innerHTML = `
      <div class="card p-3">
        <h5>${trabajo.titulo}</h5>
        <p>${trabajo.desc}</p>
        <a href="${trabajo.link}" target="_blank" class="btn btn-primary">Ver</a>
      </div>
    `;

    contenedor.appendChild(div);
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

if (usuarioActivo) {
  document.getElementById("btn-logout").style.display = "inline-block";

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.reload();
  });
}

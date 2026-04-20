function scrollToTrabajos() {
  document.getElementById("trabajos").scrollIntoView({
    behavior: "smooth"
  });
}

function verProyecto() {
  alert("Aquí puedes poner el link de tu proyecto");
}

window.agregarSemana = function() {

  const titulo = document.getElementById("titulo-semana").value.trim();
  const descripcion = document.getElementById("descripcion-semana").value.trim();
  const archivoInput = document.getElementById("archivo-semana");
  const unidad = document.getElementById("unidad-semana").value;

  if (!titulo || !descripcion || archivoInput.files.length === 0) {
    alert("Completa todo");
    return;
  }

  const archivo = archivoInput.files[0];

  let semanas = JSON.parse(localStorage.getItem("semanas")) || [];

  semanas.push({
    titulo,
    descripcion,
    unidad,
    trabajos: [
      {
        nombre: archivo.name,
        archivo: "archivos/" + archivo.name
      }
    ]
  });

  localStorage.setItem("semanas", JSON.stringify(semanas));
  location.reload();
}

document.getElementById("btn-agregar")?.addEventListener("click", () => {
  console.log("CLICK DETECTADO");
  agregarSemana();
});

function cargarSemanas() {
  
  const semanas = JSON.parse(localStorage.getItem("semanas")) || [];
  const usuario = localStorage.getItem("usuarioActivo");

  semanas.forEach((s, index) => {

    const contenedor = document.getElementById(`unidad-${s.unidad}`);

    let trabajosHTML = "";

    (s.trabajos || []).forEach(t => {
  trabajosHTML += `
    <a href="${t.archivo}" target="_blank" class="btn btn-secondary btn-sm mb-1">
      ${t.nombre}
    </a>
  `;
});

    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";

    div.innerHTML = `
      <div class="card p-3 semana-card">

        ${usuario === "admin" ? `
          <span class="btn-eliminar" onclick="eliminarSemana(${index})">🗑</span>
          <span class="btn-editar" onclick="abrirEditar(${index})">✏️</span>
          <span class="btn-agregar-trabajo" onclick="agregarTrabajoExtra(${index})">➕</span>
        ` : ""}

        <h5>${s.titulo}</h5>
        <p>${s.descripcion}</p>

        ${trabajosHTML}

      </div>
    `;

    contenedor.appendChild(div);
  });
}

function agregarTrabajoExtra(index) {
  const archivoInput = document.createElement("input");
  archivoInput.type = "file";

  archivoInput.onchange = function() {
    const archivo = archivoInput.files[0];

    let semanas = JSON.parse(localStorage.getItem("semanas")) || [];

    semanas[index].trabajos.push({
      nombre: archivo.name,
      archivo: "archivos/" + archivo.name
    });

    localStorage.setItem("semanas", JSON.stringify(semanas));
    location.reload();
  };

  archivoInput.click();
}

window.addEventListener("DOMContentLoaded", () => {

  const usuario = localStorage.getItem("usuarioActivo");
  const panel = document.getElementById("panel-admin");

  // 👤 Mostrar nombre en navbar
  if (usuario) {
    const nombre = document.getElementById('navbar-nombre');
    if (nombre) nombre.textContent = '👤 ' + usuario;

    const btnAuth = document.getElementById('btn-auth');
    if (btnAuth) {
      btnAuth.textContent = 'Cerrar sesión';
      btnAuth.href = '#';

      btnAuth.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('usuarioActivo');
        window.location.reload();
      });
    }
  }

  // 🔐 SOLO ADMIN VE EL PANEL
  if (usuario === "admin") {
    if (panel) panel.style.display = "block";
  } else {
    if (panel) panel.style.display = "none";
  }

  // 📦 CARGAR DATOS
  cargarSemanas();
});

const usuarioActivo = localStorage.getItem("usuarioActivo");

if (usuarioActivo) {
  const btnLogout = document.getElementById("btn-logout");

  if (btnLogout) {
    btnLogout.style.display = "inline-block";

    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.reload();
    });
  }
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

function eliminarSemana(index) {

  const semanas = JSON.parse(localStorage.getItem("semanas")) || [];

  semanas.splice(index, 1);

  localStorage.setItem("semanas", JSON.stringify(semanas));

  location.reload();
}

let indexEditando = null;

function abrirEditar(index) {
  const semanas = JSON.parse(localStorage.getItem("semanas")) || [];
  const semana = semanas[index];

  indexEditando = index;

  document.getElementById("edit-titulo").value = semana.titulo;
  document.getElementById("edit-descripcion").value = semana.descripcion;

  document.getElementById("modal-editar").style.display = "block";
}

function cerrarEditar() {
  document.getElementById("modal-editar").style.display = "none";
}

function guardarEdicion() {
  let semanas = JSON.parse(localStorage.getItem("semanas")) || [];

  const nuevoTitulo = document.getElementById("edit-titulo").value;
  const nuevaDesc = document.getElementById("edit-descripcion").value;
  const archivoInput = document.getElementById("edit-archivo");

  semanas[indexEditando].titulo = nuevoTitulo;
  semanas[indexEditando].descripcion = nuevaDesc;

  if (archivoInput.files.length > 0) {
    const archivo = archivoInput.files[0];

    // reemplaza el primer trabajo
    semanas[indexEditando].trabajos[0] = {
      nombre: archivo.name,
      archivo: "archivos/" + archivo.name
    };
  }

  localStorage.setItem("semanas", JSON.stringify(semanas));
  location.reload();
}

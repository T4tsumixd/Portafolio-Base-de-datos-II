var supabase = window.supabase.createClient(
  "https://ruqcwexjzkyxaoazvxws.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1cWN3ZXhqemt5eGFvYXp2eHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MTA2NDIsImV4cCI6MjA5MjM4NjY0Mn0.Be3n-r7qRCUr1iuvFC1rA-triJIaFAKDUIlMEbUpChI"
);

function scrollToTrabajos() {
  document.getElementById("trabajos").scrollIntoView({
    behavior: "smooth"
  });
}

function verProyecto() {
  alert("Aquí puedes poner el link de tu proyecto");
}

window.agregarSemana = async function() {

  const titulo = document.getElementById("titulo-semana").value;
  const descripcion = document.getElementById("descripcion-semana").value;
  const unidad = document.getElementById("unidad-semana").value;
  const archivoInput = document.getElementById("archivo-semana");

  if (!titulo || !descripcion || archivoInput.files.length === 0) {
    alert("Completa todo");
    return;
  }

  const archivo = archivoInput.files[0];

  const nuevaSemana = {
    titulo,
    descripcion,
    unidad,
    trabajos: [
      {
        nombre: archivo.name,
        archivo: "archivos/" + archivo.name
      }
    ]
  };

  const { error } = await supabase
    .from("semanas")
    .insert([nuevaSemana]);

  if (error) {
    console.error(error);
    alert("Error al guardar");
  } else {
    alert("Guardado en la nube ☁️");
    location.reload();
  }
}

async function cargarSemanas() {

  const { data, error } = await supabase
    .from("semanas")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const usuario = localStorage.getItem("usuarioActivo");

  data.forEach((s, index) => {

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
          <span class="btn-eliminar" onclick="eliminarSemana('${s.id}')">🗑</span>
        ` : ""}

        <h5>${s.titulo}</h5>
        <p>${s.descripcion}</p>

        ${trabajosHTML}

      </div>
    `;

    contenedor.appendChild(div);
  });
}

async function agregarTrabajoExtra(id) {

  const archivoInput = document.createElement("input");
  archivoInput.type = "file";

  archivoInput.onchange = async function() {

    const archivo = archivoInput.files[0];

    // 🔍 obtener semana actual desde Supabase
    const { data, error } = await supabase
      .from("semanas")
      .select("trabajos")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    let trabajos = data.trabajos || [];

    trabajos.push({
      nombre: archivo.name,
      archivo: "archivos/" + archivo.name
    });

    // 🔥 actualizar en Supabase
    const { error: updateError } = await supabase
      .from("semanas")
      .update({ trabajos })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      alert("Error al agregar trabajo");
    } else {
      alert("Trabajo agregado ✅");
      location.reload();
    }
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

async function eliminarSemana(id) {

  const { error } = await supabase
    .from("semanas")
    .delete()
    .eq("id", id);

  if (!error) {
    location.reload();
  }
}

let idEditando = null;

async function abrirEditar(id) {

  const { data, error } = await supabase
    .from("semanas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  idEditando = id;

  document.getElementById("edit-titulo").value = data.titulo;
  document.getElementById("edit-descripcion").value = data.descripcion;

  document.getElementById("modal-editar").style.display = "block";
}

function cerrarEditar() {
  document.getElementById("modal-editar").style.display = "none";
}

async function guardarEdicion() {

  const nuevoTitulo = document.getElementById("edit-titulo").value;
  const nuevaDesc = document.getElementById("edit-descripcion").value;
  const archivoInput = document.getElementById("edit-archivo");

  // 🔍 traer trabajos actuales
  const { data, error } = await supabase
    .from("semanas")
    .select("trabajos")
    .eq("id", idEditando)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  let trabajos = data.trabajos || [];

  // 🔄 si sube nuevo archivo, reemplaza el primero
  if (archivoInput.files.length > 0) {
    const archivo = archivoInput.files[0];

    trabajos[0] = {
      nombre: archivo.name,
      archivo: "archivos/" + archivo.name
    };
  }

  // 🔥 actualizar todo
  const { error: updateError } = await supabase
    .from("semanas")
    .update({
      titulo: nuevoTitulo,
      descripcion: nuevaDesc,
      trabajos: trabajos
    })
    .eq("id", idEditando);

  if (updateError) {
    console.error(updateError);
    alert("Error al actualizar");
  } else {
    alert("Actualizado correctamente ✏️");
    location.reload();
  }
}

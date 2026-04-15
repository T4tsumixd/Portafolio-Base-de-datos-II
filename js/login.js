// ───────────────────────────────────────────────
// BASE DE DATOS SIMPLE EN localStorage
// Estructura: { "nombre": "password", ... }
// ───────────────────────────────────────────────

function obtenerUsuarios() {
  const datos = localStorage.getItem('baseDatos');
  if (!datos) {
    const inicial = { javier: '1234', admin: 'admin123' };
    localStorage.setItem('baseDatos', JSON.stringify(inicial));
    return inicial;
  }
  return JSON.parse(datos);
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('baseDatos', JSON.stringify(usuarios));
}

// ── LOGIN ──
function iniciarSesion() {
  const usuario  = document.getElementById('input-usuario').value.trim();
  const password = document.getElementById('input-password').value.trim();
  const usuarios = obtenerUsuarios();

  const msgError = document.getElementById('msg-error');
  const msgExito = document.getElementById('msg-exito');

  msgError.style.display = 'none';
  msgExito.style.display = 'none';

  if (!usuario || !password) {
    msgError.textContent = 'Completa todos los campos.';
    msgError.style.display = 'block';
    return;
  }

  if (usuarios[usuario] && usuarios[usuario] === password) {
    localStorage.setItem('usuarioActivo', usuario);
    msgExito.style.display = 'block';
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } else {
    msgError.textContent = 'Usuario o contraseña incorrectos.';
    msgError.style.display = 'block';
  }
}

// ── REGISTRO ──
function mostrarRegistro() {
  const panel = document.getElementById('panel-registro');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function registrarUsuario() {
  const nuevoUsuario  = document.getElementById('reg-usuario').value.trim();
  const nuevaPassword = document.getElementById('reg-password').value.trim();
  const usuarios      = obtenerUsuarios();

  const msgError = document.getElementById('msg-reg-error');
  const msgExito = document.getElementById('msg-reg-exito');

  msgError.style.display = 'none';
  msgExito.style.display = 'none';

  if (!nuevoUsuario || !nuevaPassword) {
    msgError.textContent = 'Completa todos los campos.';
    msgError.style.display = 'block';
    return;
  }

  if (usuarios[nuevoUsuario]) {
    msgError.textContent = 'Ese usuario ya existe.';
    msgError.style.display = 'block';
    return;
  }

  if (nuevaPassword.length < 4) {
    msgError.textContent = 'La contraseña debe tener al menos 4 caracteres.';
    msgError.style.display = 'block';
    return;
  }

  usuarios[nuevoUsuario] = nuevaPassword;
  guardarUsuarios(usuarios);

  msgExito.textContent = '¡Cuenta creada! Ya puedes iniciar sesión.';
  msgExito.style.display = 'block';

  document.getElementById('reg-usuario').value  = '';
  document.getElementById('reg-password').value = '';
}

// Permite presionar Enter para iniciar sesión
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') iniciarSesion();
});
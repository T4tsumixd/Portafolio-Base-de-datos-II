/* ═══════════════════════════════════════════════════════════
   trabajos.js — Lógica de UI exclusiva de trabajos.html
   Depende de: scripts.js (Supabase, agregarSemana, etc.)
   Se carga DESPUÉS de scripts.js
   ═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   1. PANEL ADMIN — mostrar / ocultar
══════════════════════════════════════════ */
function togglePanelAdmin() {
    const form    = document.getElementById('panel-admin-form');
    const btn     = document.getElementById('btn-toggle-panel');
    const visible = form.style.display === 'block';
  
    form.style.display = visible ? 'none' : 'block';
    btn.textContent    = visible ? '⚙'   : '✕';
  }
  
  /* ══════════════════════════════════════════
     2. VER MÁS / VER MENOS en cada card
  ══════════════════════════════════════════ */
  function verMas(btn) {
    const extra   = btn.nextElementSibling;
    const abierto = extra.classList.contains('abierto');
  
    extra.classList.toggle('abierto', !abierto);
    btn.textContent = abierto ? '+ Ver más trabajos' : '− Ver menos';
  }
  
  /* ══════════════════════════════════════════
     3. MODAL EDITAR — sincronizar clases DMC
     scripts.js abre/cierra el modal con style.display.
     Aquí lo conectamos con la clase .abierto del overlay.
  ══════════════════════════════════════════ */
  (function conectarModal() {
    const overlay = document.getElementById('modal-editar');
    if (!overlay) return;
  
    /* Observar cuando scripts.js cambia el display */
    const observer = new MutationObserver(() => {
      if (overlay.style.display === 'block') {
        overlay.classList.add('abierto');
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });
  
    /* Sobrescribir cerrarEditar para también quitar la clase */
    const _cerrarEditar = window.cerrarEditar;
    window.cerrarEditar = function () {
      overlay.classList.remove('abierto');
      overlay.style.display = 'none';
      if (typeof _cerrarEditar === 'function') _cerrarEditar();
    };
  })();
  
  /* ══════════════════════════════════════════
     4. CONVERSIÓN DE CARDS — Bootstrap → DMC
     scripts.js genera nodos con clase col-md-4.
     Interceptamos appendChild en cada contenedor
     y los convertimos al diseño DMC.
  ══════════════════════════════════════════ */
  (function parchearContenedores() {
    document.querySelectorAll('[id^="unidad-"]').forEach(function (contenedor) {
      const _appendChild = contenedor.appendChild.bind(contenedor);
  
      contenedor.appendChild = function (nodo) {
        /* Solo transformar nodos que vienen de scripts.js */
        if (nodo.classList && nodo.classList.contains('col-md-4')) {
          const cardVieja = nodo.querySelector('.card.p-3.semana-card');
          if (cardVieja) {
            return _appendChild(convertirCardDMC(cardVieja));
          }
        }
        return _appendChild(nodo);
      };
    });
  })();
  
  /**
   * Convierte una card generada por scripts.js al diseño DMC.
   * @param {HTMLElement} cardVieja - El div.card original de Bootstrap
   * @returns {HTMLElement} Nueva card con clases DMC
   */
  function convertirCardDMC(cardVieja) {
    /* ── Extraer datos ── */
    const titulo     = cardVieja.querySelector('h5')?.textContent?.trim() || '';
    const desc       = cardVieja.querySelector('p')?.textContent?.trim()  || '';
    const btnElim    = cardVieja.querySelector('.btn-eliminar');
    const btnEditar  = cardVieja.querySelector('.btn.btn-outline-warning');
    const btnAgregar = cardVieja.querySelector('.btn.btn-outline-success');
  
    /* Recopilar todos los enlaces de archivos */
    const linksPrimary   = Array.from(cardVieja.querySelectorAll('a.btn.btn-primary'));
    const linksSecondary = Array.from(cardVieja.querySelectorAll('a.btn.btn-secondary'));
    const todosLinks     = [...linksPrimary, ...linksSecondary];
  
    /* Número de semana (para el decorativo de fondo) */
    const numMatch  = titulo.match(/\d+/);
    const numSemana = numMatch ? numMatch[0] : '?';
    const numPad    = numSemana.padStart(2, '0');
  
    /* ── Construir HTML de trabajos ── */
    let trabajosHTML = '';
    if (todosLinks.length > 0) {
      const primero = todosLinks[0];
      trabajosHTML += `
        <a href="${primero.href}" target="_blank" class="btn-trabajo btn-trabajo-primary">
          📄 ${primero.textContent.trim()}
        </a>`;
  
      if (todosLinks.length > 1) {
        trabajosHTML += `
          <button class="btn-ver-mas" onclick="verMas(this)">+ Ver más trabajos</button>
          <div class="extra-trabajos">`;
        for (let i = 1; i < todosLinks.length; i++) {
          trabajosHTML += `
            <a href="${todosLinks[i].href}" target="_blank" class="btn-trabajo">
              📁 ${todosLinks[i].textContent.trim()}
            </a>`;
        }
        trabajosHTML += `</div>`;
      }
    }
  
    /* ── Construir HTML de acciones admin ── */
    let adminHTML = '';
    if (btnEditar || btnAgregar || btnElim) {
      adminHTML += `<div class="admin-card-acciones">`;
  
      if (btnEditar) {
        adminHTML += `
          <button class="btn-admin-mini btn-admin-editar"
                  onclick="${btnEditar.getAttribute('onclick')}">
            ✏ Editar
          </button>`;
      }
      if (btnAgregar) {
        adminHTML += `
          <button class="btn-admin-mini btn-admin-agregar"
                  onclick="${btnAgregar.getAttribute('onclick')}">
            + Trabajo
          </button>`;
      }
      if (btnElim) {
        adminHTML += `
          <button class="btn-admin-mini btn-admin-eliminar"
                  onclick="${btnElim.getAttribute('onclick')}">
            🗑 Borrar
          </button>`;
      }
  
      adminHTML += `</div>`;
    }
  
    /* ── Crear y devolver la nueva card DMC ── */
    const nuevaCard = document.createElement('div');
    nuevaCard.className = 'semana-card-dmc';
    nuevaCard.innerHTML = `
      <div class="semana-num-bg" aria-hidden="true">${numSemana}</div>
      <div class="semana-label">Semana ${numPad}</div>
      <div class="semana-titulo">${titulo}</div>
      <div class="semana-desc">${desc}</div>
      <div class="semana-sep"></div>
      <div class="semana-trabajos">${trabajosHTML}</div>
      ${adminHTML}
    `;
  
    return nuevaCard;
  }
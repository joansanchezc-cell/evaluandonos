const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');
let changes = [];

// ============================================================
// FIX 1: Eliminar el botón flotante "⚙️ Administrador de Datos"
// ============================================================
const floatingBtnRegex = /<div class="admin-trigger" onclick="toggleAdmin\(\)"\s*style="display:none; position:fixed; bottom:20px; right:20px;[^"]*">[\s\S]*?⚙️ Administrador de Datos<\/div>/;
if (floatingBtnRegex.test(content)) {
  content = content.replace(floatingBtnRegex, '<!-- Botón flotante admin eliminado -->');
  changes.push('✅ Botón flotante eliminado');
} else {
  changes.push('⚠️ No se encontró el botón flotante (puede que ya esté eliminado)');
}

// ============================================================
// FIX 2: Cambiar el botón sidebar de toggleAdmin() a switchMainTab('admin')
// ============================================================
const sidebarAdminBtn = `        <button onclick="toggleAdmin()" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: #4f46e5; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ⚙️ PANEL ADMIN
        </button>`;

const sidebarAdminBtnNew = `        <button onclick="switchMainTab('admin')" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: #4f46e5; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ⚙️ PANEL ADMIN
        </button>`;

if (content.includes('onclick="toggleAdmin()" class="admin-trigger"')) {
  content = content.replace(sidebarAdminBtn, sidebarAdminBtnNew);
  changes.push('✅ Botón sidebar actualizado a switchMainTab');
} else {
  changes.push('⚠️ Botón sidebar no encontrado con ese texto exacto');
}

// ============================================================
// FIX 3: Convertir admin-modal en una página (admin-container como page div)
// El admin-modal con su contenido pasa a ser un div de página normal
// ============================================================

// Reemplazar el admin-modal wrapper para que sea una sección de página
const oldAdminModalStart = `  <div class="admin-modal" id="admin-modal">
    <div class="admin-container">
      <div class="admin-header">
        <h2 style="color:var(--text); font-weight:800;">🛠️ Panel Administrativo</h2>
        <button onclick="toggleAdmin()"
          style="background:#f1f5f9; border:none; padding:8px 15px; border-radius:12px; cursor:pointer; font-weight:800; color:#ef4444;">CERRAR</button>
      </div>`;

const newAdminPageStart = `  <!-- Panel Admin como Página Completa -->
  <div id="admin-modal" style="display:none; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-height: 60vh; margin: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
      <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">🛠️ Panel Administrativo</h2>
    </div>`;

if (content.includes('class="admin-modal" id="admin-modal"')) {
  content = content.replace(oldAdminModalStart, newAdminPageStart);
  changes.push('✅ admin-modal convertido a página');
} else {
  changes.push('⚠️ admin-modal header no encontrado exactamente, intentando regex...');
  
  const modalRegex = /<div class="admin-modal" id="admin-modal">[\s\S]*?<div class="admin-header">[\s\S]*?<button onclick="toggleAdmin\(\)"[\s\S]*?CERRAR<\/button>\s*<\/div>/;
  if (modalRegex.test(content)) {
    content = content.replace(modalRegex, `  <!-- Panel Admin como Página Completa -->
  <div id="admin-modal" style="display:none; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-height: 60vh; margin: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
      <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">🛠️ Panel Administrativo</h2>
    </div>`);
    changes.push('✅ admin-modal convertido a página (via regex)');
  } else {
    changes.push('❌ No se pudo convertir admin-modal');
  }
}

// Cerrar los divs extra (admin-container)
// La estructura era: admin-modal > admin-container > admin-header + admin-grid
// Ahora admin-modal > (direct content)
// Necesitamos eliminar el </div></div> extra al final del modal
// Buscar y reemplazar el cierre del admin-container
const oldModalClose = `      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- SECCIÓN MAIN DE ARQUITECTURA LIMPIA`;
const newModalClose = `      </div>\r\n  </div>\r\n\r\n  <!-- SECCIÓN MAIN DE ARQUITECTURA LIMPIA`;
if (content.includes(oldModalClose)) {
  content = content.replace(oldModalClose, newModalClose);
  changes.push('✅ Cierre de admin-container ajustado');
} else {
  changes.push('⚠️ No se encontró el cierre de admin-container para ajustar (puede estar bien)');
}

// ============================================================
// FIX 4: Agregar 'admin' en switchMainTab y containerIds
// ============================================================

// Agregar admin-modal a containerIds en switchMainTab (segunda instancia - la principal)
const oldContainerIds = `const containerIds = ['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container'];`;
const newContainerIds = `const containerIds = ['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container', 'admin-modal'];`;

if (content.includes(oldContainerIds)) {
  content = content.replace(oldContainerIds, newContainerIds);
  changes.push('✅ containerIds actualizado');
} else {
  changes.push('⚠️ containerIds no encontrado exactamente');
}

// Agregar caso 'admin' en el switch/map de tabs
const oldTabMap = `'usuarios': ['usuarios-container'],`;
const newTabMap = `'usuarios': ['usuarios-container'],
            'admin': ['admin-modal'],`;

if (content.includes(oldTabMap) && !content.includes("'admin': ['admin-modal']")) {
  content = content.replace(oldTabMap, newTabMap);
  changes.push('✅ Caso admin agregado al mapa de tabs');
} else if (content.includes("'admin': ['admin-modal']")) {
  changes.push('✅ Caso admin ya existe en mapa');
} else {
  changes.push('⚠️ No se pudo agregar el caso admin al mapa de tabs');
}

// ============================================================
// FIX 5: Cambiar toggleAdmin() a que haga switchMainTab('admin')
// ============================================================
const oldToggleAdmin = `function toggleAdmin() {
        const modal = $('admin-modal');`;
const newToggleAdmin = `function toggleAdmin() {
        switchMainTab('admin');
        return;
        const modal = $('admin-modal'); // legacy - no usado`;

if (content.includes(oldToggleAdmin)) {
  content = content.replace(oldToggleAdmin, newToggleAdmin);
  changes.push('✅ toggleAdmin() redirigido a switchMainTab');
} else {
  changes.push('⚠️ toggleAdmin() no encontrado exactamente');
}

// ============================================================
// FIX 6: Remover admin-grid y admin-container CSS para que el layout sea fluido
// ============================================================
// No tocamos el CSS para no romper nada, pero dejamos el admin-grid como layout

// ============================================================
// FIX 7: Limpiar la llamada a cargarGradosAdminSelects en el tab switch
// ============================================================
const oldTabSwitch = `if (tab === 'estadisticas') await cargarEstadisticas();`;
const newTabSwitch = `if (tab === 'estadisticas') await cargarEstadisticas();
          if (tab === 'admin') await cargarGradosAdminSelects();`;
if (content.includes(newTabSwitch)) {
  changes.push('✅ cargarGradosAdminSelects ya está en tab switch');
} else if (content.includes(oldTabSwitch) && !content.includes("if (tab === 'admin') await cargarGradosAdminSelects()")) {
  content = content.replace(oldTabSwitch, newTabSwitch);
  changes.push('✅ cargarGradosAdminSelects agregado al tab switch');
} else {
  changes.push('⚠️ Tab switch not found o ya tiene cargarGradosAdminSelects');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n=== RESULTADOS ===');
changes.forEach(c => console.log(c));
console.log('\nDone!');

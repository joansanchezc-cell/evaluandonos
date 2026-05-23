const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Eliminar botón flotante
content = content.replace(
  /<div class="admin-trigger" onclick="toggleAdmin\(\)"[\s\S]*?⚙️ Administrador de Datos<\/div>/,
  ""
);

// 2. Cambiar onclick del botón del sidebar
content = content.replace(
  /<button onclick="toggleAdmin\(\)" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: #4f46e5; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px; box-shadow: 0 4px 6px rgba\(0,0,0,0.1\);">\s*⚙️ PANEL ADMIN\s*<\/button>/,
  `<button onclick="switchMainTab('admin_page')" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: #4f46e5; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ⚙️ PANEL ADMIN
        </button>`
);

// 3. Extraer admin-grid y envolver en admin-page-container
const modalMatch = content.match(/<div class="admin-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<!-- SECCIÓN MAIN DE ARQUITECTURA LIMPIA/);
if (modalMatch) {
  const adminGridContent = modalMatch[1];
  
  const adminPageContainer = `<!-- CONTENEDOR PÁGINA ADMIN -->
    <div id="admin-page-container" style="display: none; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-height: 80vh;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
         <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">🛠️ Panel Administrativo (Página Completa)</h2>
      </div>
      <div class="admin-grid">
        ${adminGridContent}
      </div>
    </div>\n\n`;

  // Insert before usuarios-container
  content = content.replace(
    /(<div id="usuarios-container")/,
    adminPageContainer + "$1"
  );

  // Remove the old admin-modal block completely
  content = content.replace(/<div class="admin-modal" id="admin-modal">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, "");
} else {
  console.log("No se pudo extraer admin-grid");
}

// 4. Modificar switchMainTab
content = content.replace(
  /const containerIds = \['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container'\];/,
  "const containerIds = ['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container', 'admin-page-container'];"
);

content = content.replace(
  /'usuarios': \['usuarios-container'\]/,
  "'usuarios': ['usuarios-container'],\n            'admin_page': ['admin-page-container']"
);

// Add the call to `cargarGradosAdminSelects()` when tab is admin_page
content = content.replace(
  /if \(tab === 'estadisticas'\) await cargarEstadisticas\(\);/,
  "if (tab === 'estadisticas') await cargarEstadisticas();\n          if (tab === 'admin_page') await cargarGradosAdminSelects();"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Panel admin migrado exitosamente.");

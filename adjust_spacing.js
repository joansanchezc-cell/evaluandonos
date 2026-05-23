const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Reducir padding de scrollable-views
content = content.replace(
  'id="scrollable-views" style="padding: 20px 30px; flex: 1;"',
  'id="scrollable-views" style="padding: 15px 20px; flex: 1;"'
);

// 2. Reducir paddings del filtros-container
content = content.replace(
  'gap: 1.5rem; align-items: end; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.5); width: 100%; box-sizing: border-box; margin-bottom: 2rem;',
  'gap: 1rem; align-items: end; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); padding: 1rem; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.5); width: 100%; box-sizing: border-box; margin-bottom: 1.2rem;'
);

// 3. Reducir el padding de los Selects (listas desplegables)
content = content.replace(/padding: 12px; border-radius: 12px; border: 1px solid #cbd5e1;/g, 'padding: 8px 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem;');
content = content.replace(/padding: 12px; border-radius: 12px; border: 2px solid #cbd5e1;/g, 'padding: 8px 12px; border-radius: 10px; border: 2px solid #cbd5e1; font-size: 0.9rem;');

// 4. Reducir el padding de la caja de pregunta y el margen inferior
content = content.replace(
  'padding: 1.5rem; margin-bottom: 2rem; backdrop-filter: blur(5px);',
  'padding: 1rem; margin-bottom: 1rem; backdrop-filter: blur(5px);'
);

// 5. Disminuir el font-size de la pregunta a algo más amigable con el espacio
content = content.replace(
  'font-size: 1.1rem; color: var(--text); font-weight: 500; margin: 0; line-height: 1.6;',
  'font-size: 0.95rem; color: var(--text); font-weight: 500; margin: 0; line-height: 1.5;'
);

// 6. CSS: Reducir el enorme padding de los botones A, B, C, D (clase .option)
content = content.replace(
  'padding: 1rem 1.2rem;',
  'padding: 0.5rem 1rem;'
);

// 7. Títulos h2 en las tarjetas
content = content.replace(
  '<h2 class="question-title" id="pregunta-display-num">Pregunta #</h2>',
  '<h2 class="question-title" id="pregunta-display-num" style="margin-bottom: 0.8rem; font-size: 1.1rem;">Pregunta #</h2>'
);
content = content.replace(
  '<h2 class="question-title">Distribución de Respuestas</h2>',
  '<h2 class="question-title" style="margin-bottom: 0.8rem; font-size: 1.1rem;">Distribución de Respuestas</h2>'
);

// 8. Gap de la dashboard-grid (columnas) para acercar las dos mitades
content = content.replace(
  'gap: 2rem;\n      margin-top: 2rem;',
  'gap: 1.5rem;\n      margin-top: 1rem;'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Ajuste de espaciado y tamaños completado.");

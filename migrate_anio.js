const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Reemplazar .eq('periodo', ...) por .eq('anio', window.currentYear).eq('periodo', ...)
// Esto aplica a todos los Select, Delete, Update de las tablas.
content = content.replace(/\.eq\('periodo'/g, ".eq('anio', window.currentYear).eq('periodo'");

// 2. Inyectar 'anio: window.currentYear,' en las construcciones de objetos para INSERT.
// Para batchPreguntas (alrededor de linea 4652)
content = content.replace(/periodo: periodoDetectado,/g, "anio: window.currentYear,\n            periodo: periodoDetectado,");

// Para batchResultados (alrededor de linea 4760)
// Para eval_estudiantes_notas (alrededor de linea 4880)
// Para eval_estudiantes_completos (alrededor de linea 4990)
content = content.replace(/periodo: p,/g, "anio: window.currentYear,\n            periodo: p,");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Migracion de codigo para 'anio' completada.");

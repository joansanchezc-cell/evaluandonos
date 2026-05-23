const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const oldCode = `if (e1 || e2 || e3) throw new Error('Error al leer de Supabase');`;

const newCode = `if (e1) { console.error('Error e1:', e1); throw new Error('Error leyendo eval_respuestas: ' + (e1.message || JSON.stringify(e1))); }
          if (e2) { console.error('Error e2:', e2); throw new Error('Error leyendo eval_preguntas: ' + (e2.message || JSON.stringify(e2))); }
          if (e3) { console.error('Error e3:', e3); throw new Error('Error leyendo maestro_estudiantes: ' + (e3.message || JSON.stringify(e3))); }`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated backup function to show detailed errors.');
} else {
  console.log('❌ Could not find the generic error throw in backup function.');
}

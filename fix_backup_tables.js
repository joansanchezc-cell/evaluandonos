const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const backupOld = `const { data: respuestas, error: e1 } = await supabaseClient.from('eval_respuestas').select('*');
          const { data: preguntas, error: e2 } = await supabaseClient.from('eval_preguntas').select('*');
          const { data: estudiantes, error: e3 } = await supabaseClient.from('maestro_estudiantes').select('*');
          
          if (e1) { console.error('Error e1:', e1); throw new Error('Error leyendo eval_respuestas: ' + (e1.message || JSON.stringify(e1))); }
          if (e2) { console.error('Error e2:', e2); throw new Error('Error leyendo eval_preguntas: ' + (e2.message || JSON.stringify(e2))); }
          if (e3) { console.error('Error e3:', e3); throw new Error('Error leyendo maestro_estudiantes: ' + (e3.message || JSON.stringify(e3))); }

          const backupData = {
            fecha: new Date().toISOString(),
            tablas: {
              respuestas: respuestas || [],
              preguntas: preguntas || [],
              estudiantes: estudiantes || []
            }
          };`;

const backupNew = `// Obtener TODAS las tablas relevantes de Evaluándonos
          const { data: resultados, error: e1 } = await supabaseClient.from('eval_resultados').select('*');
          const { data: preguntas, error: e2 } = await supabaseClient.from('eval_preguntas').select('*');
          const { data: estudiantes, error: e3 } = await supabaseClient.from('maestro_estudiantes').select('*');
          const { data: notas, error: e4 } = await supabaseClient.from('eval_estudiantes_notas').select('*');
          const { data: perfiles, error: e5 } = await supabaseClient.from('perfiles').select('*');
          const { data: privacidad, error: e6 } = await supabaseClient.from('docentes_privacidad').select('*');
          
          if (e1) throw new Error('Error en eval_resultados: ' + e1.message);
          if (e2) throw new Error('Error en eval_preguntas: ' + e2.message);
          if (e3) throw new Error('Error en maestro_estudiantes: ' + e3.message);
          if (e4) throw new Error('Error en eval_estudiantes_notas: ' + e4.message);
          if (e5) throw new Error('Error en perfiles: ' + e5.message);
          if (e6) throw new Error('Error en docentes_privacidad: ' + e6.message);

          const backupData = {
            fecha: new Date().toISOString(),
            tablas: {
              eval_resultados: resultados || [],
              eval_preguntas: preguntas || [],
              maestro_estudiantes: estudiantes || [],
              eval_estudiantes_notas: notas || [],
              perfiles: perfiles || [],
              docentes_privacidad: privacidad || []
            }
          };`;

if (content.includes(backupOld)) {
  content = content.replace(backupOld, backupNew);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Backup script updated to use the real database tables.');
} else {
  console.log('❌ Could not find the backup script block to replace.');
}

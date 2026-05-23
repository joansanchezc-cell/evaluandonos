const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const anchorPoint = `// Estilos de botones
        const btnGen = $('btn-sub-analisis-general');
        const btnEst = $('btn-sub-analisis-estudiante');`;

const endOfBrokenCode = `async function cargarGradosAdminSelects() {`;

const brokenStart = content.indexOf(anchorPoint);
const brokenEnd = content.indexOf(endOfBrokenCode, brokenStart);

if (brokenStart > -1 && brokenEnd > -1) {
  const fixedBlock = `// Estilos de botones
        const btnGen = $('btn-sub-analisis-general');
        const btnEst = $('btn-sub-analisis-estudiante');

        if (isGen) {
          if (btnGen) { btnGen.style.background = 'white'; btnGen.style.color = 'var(--primary)'; btnGen.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }
          if (btnEst) { btnEst.style.background = 'transparent'; btnEst.style.color = '#64748b'; btnEst.style.boxShadow = 'none'; }
        } else {
          if (btnEst) { btnEst.style.background = 'white'; btnEst.style.color = 'var(--primary)'; btnEst.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }
          if (btnGen) { btnGen.style.background = 'transparent'; btnGen.style.color = '#64748b'; btnGen.style.boxShadow = 'none'; }
          await cargarGradosDetalle();
        }
      }

      function toggleAdmin() {
        switchMainTab('admin');
      }

      // Función para descargar Backup de la App y los Datos (Superadmin)
      window.descargarBackupTotal = async function() {
        if (currentRole !== 'superadmin') {
          alert('Solo el Super Administrador puede hacer backups.');
          return;
        }

        const btn = document.getElementById('btn-backup-admin');
        const originalText = btn.innerText;
        btn.innerText = '⏳ Recopilando datos...';
        btn.disabled = true;

        try {
          const appContent = document.documentElement.outerHTML;

          btn.innerText = '⏳ Descargando Base de Datos...';
          const { data: resultados, error: e1 } = await supabaseClient.from('eval_resultados').select('*');
          const { data: preguntas, error: e2 } = await supabaseClient.from('eval_preguntas').select('*');
          const { data: estudiantes, error: e3 } = await supabaseClient.from('maestro_estudiantes').select('*');
          const { data: notas, error: e4 } = await supabaseClient.from('eval_estudiantes_notas').select('*');
          const { data: perfiles, error: e5 } = await supabaseClient.from('perfiles').select('*');
          const { data: privacidad, error: e6 } = await supabaseClient.from('docentes_privacidad').select('*');
          
          if (e1) { console.error('Error eval_resultados:', e1); throw new Error('Error en eval_resultados: ' + (e1.message || JSON.stringify(e1))); }
          if (e2) { console.error('Error eval_preguntas:', e2); throw new Error('Error en eval_preguntas: ' + (e2.message || JSON.stringify(e2))); }
          if (e3) { console.error('Error maestro_estudiantes:', e3); throw new Error('Error en maestro_estudiantes: ' + (e3.message || JSON.stringify(e3))); }
          if (e4) { console.error('Error eval_estudiantes_notas:', e4); throw new Error('Error en eval_estudiantes_notas: ' + (e4.message || JSON.stringify(e4))); }
          if (e5) { console.error('Error perfiles:', e5); throw new Error('Error en perfiles: ' + (e5.message || JSON.stringify(e5))); }
          if (e6) { console.error('Error docentes_privacidad:', e6); throw new Error('Error en docentes_privacidad: ' + (e6.message || JSON.stringify(e6))); }

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
          };

          const now = new Date();
          const fechaStr = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,'0') + "-" + String(now.getDate()).padStart(2,'0') + "_" + String(now.getHours()).padStart(2,'0') + "-" + String(now.getMinutes()).padStart(2,'0');

          const dataBlob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
          const dataUrl = URL.createObjectURL(dataBlob);
          const dataLink = document.createElement('a');
          dataLink.href = dataUrl;
          dataLink.download = \`Backup_Datos_Evaluandonos_\${fechaStr}.json\`;
          document.body.appendChild(dataLink);
          dataLink.click();
          document.body.removeChild(dataLink);

          btn.innerText = '⏳ Descargando App...';
          const appBlob = new Blob(['<!DOCTYPE html>\\n' + appContent], { type: 'text/html' });
          const appUrl = URL.createObjectURL(appBlob);
          const appLink = document.createElement('a');
          appLink.href = appUrl;
          appLink.download = \`Backup_App_Evaluandonos_\${fechaStr}.html\`;
          document.body.appendChild(appLink);
          appLink.click();
          document.body.removeChild(appLink);

          btn.innerText = '✅ Backup Completado';
          setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);

        } catch(error) {
          console.error(error);
          alert('Error al realizar el backup: ' + error.message);
          btn.innerText = '❌ Error';
          setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 3000);
        }
      };

      `;

  content = content.substring(0, brokenStart) + fixedBlock + content.substring(brokenEnd);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Archivo restaurado exitosamente y backup corregido con las tablas correctas.');
} else {
  console.log('❌ No encontré el bloque roto.');
}

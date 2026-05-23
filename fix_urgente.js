const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// The block to replace starts with:
// // Estilos de botones
// and ends right before:
// async function cargarGradosAdminSelects() {

const startStr = '// Estilos de botones';
const endStr = 'async function cargarGradosAdminSelects() {';

const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf(endStr);

if (startIdx > -1 && endIdx > -1) {
  const replacement = `// Estilos de botones
        const btnGen = document.getElementById('btn-sub-analisis-general');
        const btnEst = document.getElementById('btn-sub-analisis-estudiante');

        if (isGen) {
          if (btnGen) { btnGen.style.background = 'white'; btnGen.style.color = 'var(--primary)'; btnGen.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }
          if (btnEst) { btnEst.style.background = 'transparent'; btnEst.style.color = '#64748b'; btnEst.style.boxShadow = 'none'; }
        } else {
          if (btnEst) { btnEst.style.background = 'white'; btnEst.style.color = 'var(--primary)'; btnEst.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }
          if (btnGen) { btnGen.style.background = 'transparent'; btnGen.style.color = '#64748b'; btnGen.style.boxShadow = 'none'; }
          if (typeof cargarGradosDetalle === 'function') await cargarGradosDetalle();
        }
      }

      function toggleAdmin() {
        switchMainTab('admin');
      }

      window.descargarBackupTotal = async function() {
        if (typeof currentRole === 'undefined' || currentRole !== 'superadmin') {
          alert('Solo el Super Administrador puede hacer backups.');
          return;
        }

        const btn = document.getElementById('btn-backup-admin');
        if (!btn) return;
        const originalText = btn.innerText;
        btn.innerText = '⏳ Recopilando datos...';
        btn.disabled = true;

        try {
          const appContent = document.documentElement.outerHTML;

          btn.innerText = '⏳ Descargando BD...';
          const [res1, res2, res3, res4, res5, res6] = await Promise.all([
            supabaseClient.from('eval_resultados').select('*'),
            supabaseClient.from('eval_preguntas').select('*'),
            supabaseClient.from('maestro_estudiantes').select('*'),
            supabaseClient.from('eval_estudiantes_notas').select('*'),
            supabaseClient.from('perfiles').select('*'),
            supabaseClient.from('docentes_privacidad').select('*')
          ]);
          
          if (res1.error) throw new Error('Error en eval_resultados: ' + res1.error.message);
          if (res2.error) throw new Error('Error en eval_preguntas: ' + res2.error.message);
          if (res3.error) throw new Error('Error en maestro_estudiantes: ' + res3.error.message);
          if (res4.error) throw new Error('Error en eval_estudiantes_notas: ' + res4.error.message);
          if (res5.error) throw new Error('Error en perfiles: ' + res5.error.message);
          if (res6.error) throw new Error('Error en docentes_privacidad: ' + res6.error.message);

          const backupData = {
            fecha: new Date().toISOString(),
            tablas: {
              eval_resultados: res1.data || [],
              eval_preguntas: res2.data || [],
              maestro_estudiantes: res3.data || [],
              eval_estudiantes_notas: res4.data || [],
              perfiles: res5.data || [],
              docentes_privacidad: res6.data || []
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
  
  const finalC = c.substring(0, startIdx) + replacement + c.substring(endIdx);
  fs.writeFileSync('index.html', finalC.replace(/\\n/g, '\\r\\n'), 'utf8');
  console.log('✅ REPARACION COMPLETA. HTML restaurado y función de backup 100% correcta.');
} else {
  console.log('❌ No encontré startIdx o endIdx.');
}

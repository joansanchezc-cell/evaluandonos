const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Agregar el botón de Backup al Panel Administrativo
const headerOld = `<div style="display: flex; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
      <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">🛠️ Panel Administrativo</h2>
    </div>`;

const headerNew = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
      <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">🛠️ Panel Administrativo</h2>
      <button onclick="descargarBackupTotal()" id="btn-backup-admin" style="display: none; background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 6px rgba(16,185,129,0.2); font-size: 0.9rem;">
        💾 Descargar Backup
      </button>
    </div>`;

if (content.includes(headerOld)) {
  content = content.replace(headerOld, headerNew);
}

// 2. Modificar la función switchMainTab para mostrar el botón SOLO si es superadmin
// Wait, we can just do it in the render logic or verify userRole.
// Let's add the logic to show the button in the login flow or switchMainTab.
// Actually, it's easier to just check `currentRole === 'superadmin'` inside the backup function itself.
// But to hide/show the button, we can do it in the `switchMainTab('admin')` or when setting userRole.
const roleLogicOld = `if (role === 'admin' || role === 'superadmin') {
            document.body.classList.add('is-admin');
          } else {
            document.body.classList.remove('is-admin');
          }`;

const roleLogicNew = `if (role === 'admin' || role === 'superadmin') {
            document.body.classList.add('is-admin');
          } else {
            document.body.classList.remove('is-admin');
          }
          if (role === 'superadmin') {
            const btnBackup = document.getElementById('btn-backup-admin');
            if (btnBackup) btnBackup.style.display = 'block';
          }`;

if (content.includes(roleLogicOld)) {
  content = content.replace(roleLogicOld, roleLogicNew);
}


// 3. Agregar la función JS para descargar el backup
const jsInsertionPoint = `async function cargarGradosAdminSelects() {`;

const backupJS = `
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
          // 1. Obtener la App (HTML actual)
          const appContent = document.documentElement.outerHTML;

          // 2. Obtener Datos Clave (Respuestas y Preguntas)
          btn.innerText = '⏳ Descargando Base de Datos...';
          const { data: respuestas, error: e1 } = await supabaseClient.from('eval_respuestas').select('*');
          const { data: preguntas, error: e2 } = await supabaseClient.from('eval_preguntas').select('*');
          const { data: estudiantes, error: e3 } = await supabaseClient.from('maestro_estudiantes').select('*');
          
          if (e1 || e2 || e3) throw new Error('Error al leer de Supabase');

          const backupData = {
            fecha: new Date().toISOString(),
            tablas: {
              respuestas: respuestas || [],
              preguntas: preguntas || [],
              estudiantes: estudiantes || []
            }
          };

          const now = new Date();
          const fechaStr = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,'0') + "-" + String(now.getDate()).padStart(2,'0') + "_" + String(now.getHours()).padStart(2,'0') + "-" + String(now.getMinutes()).padStart(2,'0');

          // Descargar JSON de Datos
          const dataBlob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
          const dataUrl = URL.createObjectURL(dataBlob);
          const dataLink = document.createElement('a');
          dataLink.href = dataUrl;
          dataLink.download = \`Backup_Datos_Evaluandonos_\${fechaStr}.json\`;
          document.body.appendChild(dataLink);
          dataLink.click();
          document.body.removeChild(dataLink);

          // Descargar App (HTML)
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

content = content.replace(jsInsertionPoint, backupJS + jsInsertionPoint);

fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ Botón de Backup y lógica inyectados correctamente.');

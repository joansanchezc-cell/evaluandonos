const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines temporarily for matching
const normalized = content.replace(/\r\n/g, '\n');

const brokenStart = 'async function switchMainTab(tab) {\n        showLoading(true);\n          }\n';
const brokenEnd = '        } catch (err) {\n          console.error("Error switching tab:", err);\n        } finally {\n          showLoading(false);\n        }\n      }';

const startIdx = normalized.indexOf(brokenStart);
const endIdx = normalized.indexOf(brokenEnd);

if (startIdx === -1) {
  console.log('❌ No se encontró el inicio roto');
  process.exit(1);
}
if (endIdx === -1) {
  console.log('❌ No se encontró el final');
  process.exit(1);
}

console.log('✅ Encontrado bloque roto en chars:', startIdx, '-', endIdx + brokenEnd.length);

const before = normalized.substring(0, startIdx);
const after = normalized.substring(endIdx + brokenEnd.length);

const fixedFn = `async function switchMainTab(tab) {
        showLoading(true);
        try {
          currentView = tab;
          isEnPestañaGrupal = (tab === 'grupal');

          // Update Tab Visuals
          document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'transparent';
            b.style.color = 'inherit';
          });

          const activeBtn = document.getElementById(\`tab-\${tab}\`);
          if (activeBtn) {
            activeBtn.classList.add('active');
          }

          // Visibility Toggle
          const containerIds = ['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container', 'admin-modal'];
          containerIds.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

          const catTrigger = document.getElementById('clean-arch-trigger');
          if (catTrigger) catTrigger.style.background = '#6366f1';

          const tabMap = {
            'analisis': ['resultado-container'],
            'estudiante_detalle': ['resultado-container', 'estudiante-detalle-container'],
            'individual': ['individual-container'],
            'estadisticas': ['estadisticas-container'],
            'grupal': ['grupal-container'],
            'asignatura': ['asignatura-container'],
            'usuarios': ['usuarios-container'],
            'admin': ['admin-modal']
          };

          if (tabMap[tab]) {
            tabMap[tab].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; });
          }

          // Background Effect
          if (['individual', 'grupal', 'asignatura'].includes(tab)) {
            document.body.classList.add('blurred-bg');
          } else {
            document.body.classList.remove('blurred-bg');
          }

          // Specific Loaders
          if (tab === 'individual') await cargarGradosReporte();
          if (tab === 'estadisticas') await cargarEstadisticas();
          if (tab === 'admin') { try { await cargarGradosAdminSelects(); } catch(e) { console.warn('cargarGradosAdminSelects error:', e); } }
          if (tab === 'grupal') await cargarGruposInformeGrupal();
          if (tab === 'asignatura') {
            await cargarGruposInformeAsignatura();
            filtrarMateriasEstaticas();
          }
          if (tab === 'analisis') {
            const genVisible = document.getElementById('analisis-general-view') && document.getElementById('analisis-general-view').style.display !== 'none';
            const detVisible = document.getElementById('estudiante-detalle-container') && document.getElementById('estudiante-detalle-container').style.display !== 'none';
            if (!genVisible && !detVisible) {
              await switchSubAnalisis('general');
            }
          }
        } catch (err) {
          console.error("Error switching tab:", err);
        } finally {
          showLoading(false);
        }
      }`;

const newContent = (before + fixedFn + after).replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ switchMainTab restaurado y mejorado correctamente!');

const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar la función switchMainTab rota con la versión correcta completa
const brokenFn = `      async function switchMainTab(tab) {
        showLoading(true);
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
          if (tab === 'admin') await cargarGradosAdminSelects();
          if (tab === 'grupal') await cargarGruposInformeGrupal();
          if (tab === 'asignatura') {
            await cargarGruposInformeAsignatura();
            filtrarMateriasEstaticas();
          }
          if (tab === 'analisis') {
            // Solo abrir general si AMBOS están ocultos (primera vez)
            const genVisible = $('analisis-general-view') && $('analisis-general-view').style.display !== 'none';
            const detVisible = $('estudiante-detalle-container') && $('estudiante-detalle-container').style.display !== 'none';

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

const fixedFn = `      async function switchMainTab(tab) {
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

          const activeBtn = $(\`tab-\${tab}\`);
          if (activeBtn) {
            activeBtn.classList.add('active');
          }

          // Visibility Toggle
          const containerIds = ['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container', 'admin-modal'];
          containerIds.forEach(id => { if ($(id)) $(id).style.display = 'none'; });

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
            tabMap[tab].forEach(id => { if ($(id)) $(id).style.display = 'block'; });
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
          if (tab === 'admin') await cargarGradosAdminSelects();
          if (tab === 'grupal') await cargarGruposInformeGrupal();
          if (tab === 'asignatura') {
            await cargarGruposInformeAsignatura();
            filtrarMateriasEstaticas();
          }
          if (tab === 'analisis') {
            // Solo abrir general si AMBOS están ocultos (primera vez)
            const genVisible = $('analisis-general-view') && $('analisis-general-view').style.display !== 'none';
            const detVisible = $('estudiante-detalle-container') && $('estudiante-detalle-container').style.display !== 'none';

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

if (content.includes(brokenFn)) {
  content = content.replace(brokenFn, fixedFn);
  console.log('✅ switchMainTab restaurado correctamente');
} else {
  console.log('❌ No se encontró el bloque roto exacto. Revisando...');
  // Try to find what's there
  const idx = content.indexOf('async function switchMainTab');
  if (idx >= 0) {
    console.log('Found at char:', idx);
    console.log('Snippet:', content.substring(idx, idx + 500));
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

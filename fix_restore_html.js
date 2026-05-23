const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// The botched code we need to replace:
const brokenStart = `const btnEst = $('btn-sub-analisis-estudiante');`;

// We find where btnEst is assigned inside switchSubAnalisis:
const brokenIdx = content.indexOf(`const btnEst = $('btn-sub-analisis-estudiante');`);

if (brokenIdx > -1) {
  const endOfBrokenFunction = content.indexOf(`      window.descargarBackupTotal = async function() {`, brokenIdx);
  if (endOfBrokenFunction > -1) {
    
    // Extract everything from btnEst assignment to before descargarBackupTotal
    const brokenBlock = content.substring(brokenIdx, endOfBrokenFunction);
    
    // We want to replace this broken block with the CORRECT block
    const fixedBlock = `const btnEst = $('btn-sub-analisis-estudiante');

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
        // Redirige al panel admin como página
        switchMainTab('admin');
      }

`;
    content = content.substring(0, brokenIdx) + fixedBlock + content.substring(endOfBrokenFunction);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Restauradas las funciones switchSubAnalisis y toggleAdmin.');
  } else {
    console.log('❌ No encontré el final de la función rota.');
  }
} else {
  console.log('❌ No encontré la declaración btnEst.');
}

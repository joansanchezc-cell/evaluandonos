const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const footerStart = c.indexOf('<footer');
const scriptsStart = c.indexOf('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');

if (footerStart > -1 && scriptsStart > -1) {
  // Extraer el footer
  let footerHTML = c.substring(footerStart, scriptsStart);
  
  // Asegurarnos de que tenga cierre si no lo tiene
  if (!footerHTML.includes('</footer>')) {
    footerHTML += '\\n</footer>\\n';
  }

  // Quitar el margin-top exagerado que lo rompía si queremos y darle un estilo limpio
  footerHTML = footerHTML.replace('margin-top: 8rem;', 'margin-top: 4rem;');

  // Eliminar el footer de su posición original
  c = c.substring(0, footerStart) + '\\n\\n  ' + c.substring(scriptsStart);

  // Insertar el footer ANTES del cierre de </main>
  const mainEnd = c.lastIndexOf('</main>');
  if (mainEnd > -1) {
    c = c.substring(0, mainEnd) + '\\n\\n' + footerHTML + '\\n' + c.substring(mainEnd);
    fs.writeFileSync('index.html', c, 'utf8');
    console.log('✅ Footer movido dentro de <main> para arreglar scroll.');
  } else {
    console.log('❌ No encontré </main>');
  }
} else {
  console.log('❌ No encontré el footer o scriptsStart');
}

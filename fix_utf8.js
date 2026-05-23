const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const replacements = {
    'Ã': 'Á', 'Ã‰': 'É', 'Ã': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú',
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã‘': 'Ñ', 'Ã±': 'ñ', 'Â°': '°', 'Â¿': '¿', 'Â¡': '¡',
    'Ã¼': 'ü', 'Ãœ': 'Ü', 'Â´': '´', 'Ã ': 'À', 'Ãˆ': 'È',
    'ÃŒ': 'Ì', 'Ã’': 'Ò', 'Ã™': 'Ù', 'Ã¨': 'è', 'Ã¬': 'ì',
    'Ã²': 'ò', 'Ã¹': 'ù', 'Â¨': '¨'
};

for (const [bad, good] of Object.entries(replacements)) {
    c = c.split(bad).join(good);
}

// Special case for "ANÃ LISIS" because sometimes the hidden character is a space or similar
c = c.replace(/ANÃ\sLISIS/g, 'ANÁLISIS');
c = c.replace(/ESTADÃ\sSTICAS/g, 'ESTADÍSTICAS');
c = c.replace(/MenÃº/g, 'Menú');
c = c.replace(/AÃ±o/g, 'Año');
c = c.replace(/ConfiguraciÃ³n/g, 'Configuración');

fs.writeFileSync('index.html', c, 'utf8');
console.log('✅ UTF-8 encoding fixed in index.html');

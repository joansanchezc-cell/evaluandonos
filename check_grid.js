const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const adminGridStart = html.indexOf('<div class="admin-grid"');
const adminGridEnd = html.indexOf('<!-- SECCIÓN MAIN DE ARQUITECTURA LIMPIA');
const gridHtml = html.substring(adminGridStart, adminGridEnd);

let divLevel = 0;
const lines = gridHtml.split('\n');
for(let i=0; i<lines.length; i++) {
    const l = lines[i];
    const opens = (l.match(/<div/g) || []).length;
    const closes = (l.match(/<\/div>/g) || []).length;
    divLevel += opens - closes;
    if(divLevel < 0) {
        console.log("NEGATIVE at line " + i + ": " + l);
    }
}
console.log("Final divLevel for grid block:", divLevel);

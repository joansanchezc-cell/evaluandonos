const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const adminGridStart = html.indexOf('<div class="admin-grid"');
const adminGridEnd = html.indexOf('<!-- SECCIÓN MAIN DE ARQUITECTURA LIMPIA');
const gridHtml = html.substring(adminGridStart, adminGridEnd);

const cards = gridHtml.split('<!-- CARD');
for(let i=1; i<cards.length; i++) {
    const c = cards[i];
    const opens = (c.match(/<div/g) || []).length;
    const closes = (c.match(/<\/div>/g) || []).length;
    console.log(`CARD ${c.substring(0, 20).trim()} - Opens: ${opens}, Closes: ${closes}, Diff: ${opens - closes}`);
}

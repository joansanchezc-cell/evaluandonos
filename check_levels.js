const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let lvl = 0;
const lines = html.split('\n');
for(let i=0; i<lines.length; i++) {
    const l = lines[i];
    lvl += (l.match(/<div/g)||[]).length;
    lvl -= (l.match(/<\/div>/g)||[]).length;
    if(l.includes('id="admin-container"')) console.log('At admin-container start, level is:', lvl);
    if(l.includes('CARD 5')) console.log('At CARD 5 start, level is:', lvl);
    if(l.includes('<!-- SECCIÓN MAIN')) console.log('At MAIN start, level is:', lvl);
}

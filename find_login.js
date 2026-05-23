const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

const p = c.indexOf("switchLoginMode('docente')");
if (p > -1) {
    const start = c.lastIndexOf('<div', c.lastIndexOf('<div', p - 10) - 10);
    console.log(c.substring(start - 200, p));
}

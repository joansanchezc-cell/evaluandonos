const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("const sel = $('aimg-grado');")) {
        console.log(lines.slice(i-5, i+15).join('\n'));
        break;
    }
}

const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('cargarGradosAdminSelects')) {
        console.log(lines.slice(Math.max(0, i-5), i+5).join('\n'));
        console.log('---');
    }
}

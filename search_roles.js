const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
    if (l.includes('currentRole ===') || l.includes('currentRole !==') || l.includes('estudiante')) {
        console.log(`${i+1}: ${l.trim()}`);
    }
});

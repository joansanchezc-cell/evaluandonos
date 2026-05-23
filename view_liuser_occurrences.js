const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

let results = [];
let p = -1;
while ((p = c.indexOf('id="li-user"', p + 1)) > -1) {
    let context = c.substring(Math.max(0, p - 100), Math.min(c.length, p + 100));
    results.push(context.replace(/\\n/g, ' '));
}

results.forEach((r, i) => console.log(`Occurrence ${i+1}:`, r));

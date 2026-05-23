const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
let results = [];
let p = -1;
while ((p = c.indexOf('id="li-user"', p + 1)) > -1) {
    let start = c.lastIndexOf('<div', p);
    let end = c.indexOf('</div>', p);
    results.push(c.substring(start, end + 6));
}
results.forEach((r, i) => console.log(`Occurrence ${i+1}:`, r));

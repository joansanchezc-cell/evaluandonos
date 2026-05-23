const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let indices = [];
while ((p = c.indexOf('<aside id="sidebar"', p + 1)) > -1) {
    indices.push(p);
}
console.log('aside occurrences:', indices);

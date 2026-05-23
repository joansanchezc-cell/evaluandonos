const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let indices = [];
while ((p = c.indexOf('</html>', p + 1)) > -1) {
    indices.push(p);
}

console.log('</html> occurrences:', indices);

let htmlStarts = [];
p = -1;
while ((p = c.indexOf('<html', p + 1)) > -1) {
    htmlStarts.push(p);
}

console.log('<html occurrences:', htmlStarts);

const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

console.log(c.substring(1310508 - 200, 1310508 + 200));

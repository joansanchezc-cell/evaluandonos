const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = c.indexOf('<footer');
console.log('Footer context:');
console.log(c.substring(Math.max(0, p - 300), p + 200));

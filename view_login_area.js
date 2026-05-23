const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
let p = c.indexOf('id="li-user"');
let start = Math.max(0, p - 800);
let end = p + 800;
console.log(c.substring(start, end));

const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = c.indexOf('id="li-user"');
console.log(c.substring(Math.max(0, p - 600), p));

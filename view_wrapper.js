const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
let p = c.indexOf('id="form-docente"');
let start = c.lastIndexOf('<div', p - 5);
let end = c.indexOf('</div>', c.indexOf('</div>', p) + 5);
console.log(c.substring(start, end + 6));

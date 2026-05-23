const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
let p = c.indexOf('id="admin-modal"');
if (p > -1) console.log(c.substring(p-50, p+500));
else console.log('admin-modal not found');

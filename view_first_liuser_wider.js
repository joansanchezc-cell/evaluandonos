const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = c.indexOf('id="li-user"');
let start = Math.max(0, p - 1000);
console.log("FIRST OCCURRENCE CONTEXT WIDER:");
console.log(c.substring(start, p));

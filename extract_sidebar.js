const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const start = c.indexOf('<aside id="sidebar"');
console.log(c.substring(start, start+3500));

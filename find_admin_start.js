const fs = require('fs');
const lines = fs.readFileSync('index.html','utf8').split('\n');
let adminModalStart = lines.findIndex(l => l.includes('<div id="admin-modal"'));
console.log('admin-modal starts at line', adminModalStart + 1);

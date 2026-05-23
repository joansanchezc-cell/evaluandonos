const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const p = c.indexOf('id="sidebar"');
console.log(c.substring(p-200, p+50));

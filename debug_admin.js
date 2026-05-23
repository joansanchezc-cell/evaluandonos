const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const p = c.indexOf('id="view-admin"');
if(p > -1) console.log(c.substring(p-50, p+250));

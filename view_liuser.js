const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const p = c.indexOf('id="li-user"');
if(p > -1) console.log(c.substring(p-300, p+600));

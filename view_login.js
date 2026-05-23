const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const p = c.indexOf('id="login-view"');
if(p > -1) console.log(c.substring(p, p+1500));

const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const pFooter = c.indexOf('<footer');
const pAppBodyEnd = c.lastIndexOf('</div>', pFooter); 
console.log(c.substring(pFooter-100, pFooter+100));

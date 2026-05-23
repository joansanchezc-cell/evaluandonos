const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const p = [];
let i = -1;
while((i=c.indexOf('class="mobile-nav', i+1)) >= 0) p.push(c.substring(i-5, i+25));
console.log(p);

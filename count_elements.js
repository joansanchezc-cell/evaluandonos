const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
console.log('Mobile navs:', (c.match(/class=\"mobile-nav/g) || []).length);
console.log('Main containers:', (c.match(/id=\"app-body\"/g) || []).length);

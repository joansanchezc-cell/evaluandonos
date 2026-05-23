const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const start=c.indexOf('<nav class="sidebar');
const end=c.indexOf('<main class="main-content">')+30;
if(start>-1 && end>-1) console.log(c.substring(start, end));
else console.log('Not found');

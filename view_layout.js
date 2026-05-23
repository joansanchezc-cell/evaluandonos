const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const cheerio = require('cheerio'); // if available, or just regex
console.log(c.substring(c.indexOf('<nav class="sidebar'), c.indexOf('<main class="main-content">')+50));

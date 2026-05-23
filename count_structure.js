const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

let counts = {
    '<html>': c.split('<html').length - 1,
    '<body>': c.split('<body').length - 1,
    'id="app-body"': c.split('id="app-body"').length - 1,
    'id="sidebar"': c.split('id="sidebar"').length - 1,
    'class="main-content"': c.split('class="main-content"').length - 1,
    '<footer': c.split('<footer').length - 1,
    'class="mobile-nav"': c.split('class="mobile-nav"').length - 1
};

console.log(counts);

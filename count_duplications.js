const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of <div id="loading">
let p = -1;
let loadingIndices = [];
while ((p = c.indexOf('<div id="loading"', p + 1)) > -1) {
    loadingIndices.push(p);
}
console.log('loading indices:', loadingIndices);

// Find all occurrences of <div id="login-mask">
p = -1;
let loginIndices = [];
while ((p = c.indexOf('<div id="login-mask"', p + 1)) > -1) {
    loginIndices.push(p);
}
console.log('login mask indices:', loginIndices);

// Find all occurrences of <div id="app-body"
p = -1;
let appBodyIndices = [];
while ((p = c.indexOf('<div id="app-body"', p + 1)) > -1) {
    appBodyIndices.push(p);
}
console.log('app-body indices:', appBodyIndices);

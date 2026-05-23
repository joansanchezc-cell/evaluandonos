const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let indices = [];
while ((p = c.indexOf('id="login-view"', p + 1)) > -1) {
    indices.push(p);
}
console.log('login-view occurrences:', indices);

if (indices.length > 1) {
    // Keep only the first one
    console.log("We need to remove duplicates");
}

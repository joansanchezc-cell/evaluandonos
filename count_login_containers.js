const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let count = 0;
while ((p = c.indexOf('class="login-container"', p + 1)) > -1) {
    count++;
}
console.log('login-container occurrences:', count);

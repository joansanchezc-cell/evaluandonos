const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let count = 0;
let p = -1;
while ((p = c.indexOf('id="login-mask"', p + 1)) > -1) {
    count++;
}
console.log('login-mask occurrences:', count);

let countUser = 0;
p = -1;
while ((p = c.indexOf('id="li-user"', p + 1)) > -1) {
    countUser++;
}
console.log('li-user occurrences:', countUser);

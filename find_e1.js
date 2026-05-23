const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = c.indexOf('>E1<');
if (p > -1) {
    console.log(c.substring(p - 200, p + 200));
} else {
    p = c.indexOf('E1');
    if (p > -1) {
        console.log(c.substring(p - 200, p + 200));
    }
}

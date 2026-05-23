const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// The login overlay starts right after the body tag, or maybe it has id="login-overlay".
let occurrences = [];
let p = -1;
while ((p = c.indexOf('<div class="login-box"', p + 1)) > -1) {
    occurrences.push(p);
}
console.log('login-box occurrences:', occurrences.length);

if (occurrences.length === 0) {
    // maybe it has a different class
    let p2 = -1;
    let loginWrapperCount = 0;
    while ((p2 = c.indexOf('id="login-overlay"', p2 + 1)) > -1) {
        loginWrapperCount++;
    }
    console.log('login-overlay occurrences:', loginWrapperCount);
}

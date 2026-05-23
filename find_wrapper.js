const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

// Find the start of the login section
const loginStartToken = '<div id="login-overlay"';
let p1 = c.indexOf(loginStartToken);

if (p1 === -1) {
    console.log("No login-overlay found, checking other tokens...");
    p1 = c.indexOf('class="login-box"');
    if (p1 > -1) {
        // find previous div
        p1 = c.lastIndexOf('<div', p1);
    }
}

if (p1 === -1) {
    p1 = c.indexOf('<div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background:');
}

console.log('Login wrapper start index:', p1);
if (p1 > -1) {
    console.log(c.substring(p1, p1 + 300));
}

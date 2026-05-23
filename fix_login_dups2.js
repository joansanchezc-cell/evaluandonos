const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p1 = c.indexOf('id="login-mask"');
let p2 = c.indexOf('id="login-mask"', p1 + 1);

if (p2 > -1) {
    // There is a second login mask!
    // Let's find its start
    let start2 = c.lastIndexOf('<div', p2);
    
    // Now we need to find where it ends. It probably ends right before <div id="app-body" if there's no third one, or before another login-mask.
    // Let's just find the next <div id="app-body" after start2, or if it doesn't exist, the end of the body.
    let end2 = c.indexOf('<div id="app-body"', start2);
    
    if(end2 === -1) {
       end2 = c.indexOf('<script', start2); // end before scripts if app-body is not after
    }
    
    if (end2 > -1) {
        c = c.substring(0, start2) + c.substring(end2);
        fs.writeFileSync('index.html', c, 'utf8');
        console.log('✅ Removed the second login mask.');
    } else {
        console.log('❌ Could not find the end of the second login mask.');
    }
} else {
    console.log('✅ Only 1 login mask found.');
}

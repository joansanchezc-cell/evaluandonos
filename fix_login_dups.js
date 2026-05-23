const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let indices = [];
while ((p = c.indexOf('<div id="login-mask">', p + 1)) > -1) {
    indices.push(p);
}

console.log('login-mask occurrences:', indices.length);

if (indices.length > 1) {
    // Keep only the first occurrence
    let startOfSecond = indices[1];
    let beforeSecond = c.substring(0, startOfSecond);
    
    // find the end of the last occurrence
    // since we know there are 3, let's just find the closing </div> of the login mask for the last one?
    // Actually, let's just remove everything from the second occurrence to the end of the third occurrence.
    // Assuming each <div id="login-mask"> contains the same elements.
    // Let's find the closing </div> of login-mask by looking for <div id="app-body" (the next main element)
    
    let appBodyIndex = c.indexOf('<div id="app-body"', startOfSecond);
    if (appBodyIndex > -1) {
        c = c.substring(0, startOfSecond) + c.substring(appBodyIndex);
        fs.writeFileSync('index.html', c, 'utf8');
        console.log('✅ Duplicated login masks removed.');
    } else {
        console.log('Could not find app-body to cleanly remove duplicates.');
    }
}

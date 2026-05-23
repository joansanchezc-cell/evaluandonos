const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let indices = [];
while ((p = c.indexOf('<div id="app-body"', p + 1)) > -1) {
    indices.push(p);
}

if (indices.length >= 3) {
    let p1 = indices[0];
    let p2 = indices[1];
    let p3 = indices[2];
    
    // see what is just before p2
    console.log("Before 2nd app-body:");
    console.log(c.substring(p2 - 50, p2));
    
    // see what is just before p3
    console.log("Before 3rd app-body:");
    console.log(c.substring(p3 - 50, p3));
}

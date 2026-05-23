const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let occurrences = [];
while ((p = c.indexOf('id="li-user"', p + 1)) > -1) {
    occurrences.push(p);
}

if(occurrences.length > 1) {
    let secondPos = occurrences[1];
    let start = Math.max(0, secondPos - 500);
    console.log("SECOND OCCURRENCE CONTEXT:");
    console.log(c.substring(start, secondPos + 200));
}

const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let occurrences = 0;
while ((p = c.indexOf('id="li-user"', p + 1)) > -1) {
    occurrences++;
    console.log(`--- Occurrence ${occurrences} ---`);
    console.log(c.substring(p - 150, p + 50));
}

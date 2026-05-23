const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const regex = /<script [^>]*src=["']([^"']+)["'][^>]*>/g;
let m;
while ((m = regex.exec(c)) !== null) {
  console.log(m[1], 'at', m.index);
}

const fs = require('fs');
const lines = fs.readFileSync('index.html','utf8').split('\n');
let adminModalStart = lines.findIndex(l => l.includes('id="admin-modal"'));
let lvl = 0;
let foundEnd = false;
for(let i=adminModalStart; i<lines.length; i++) {
    lvl += (lines[i].match(/<div/g)||[]).length;
    lvl -= (lines[i].match(/<\/div>/g)||[]).length;
    if(lvl <= 0) {
        console.log('admin-modal closes at line', i+1);
        foundEnd = true;
        break;
    }
}
if(!foundEnd) console.log('admin-modal does not close!');

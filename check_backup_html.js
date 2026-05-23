const fs = require('fs');
const c = fs.readFileSync('Backups/Backup_App_Evaluandonos_2026-05-21_21-30.html', 'utf8');

let p = -1;
let occurrences = [];
while ((p = c.indexOf('<html', p + 1)) > -1) {
    occurrences.push(p);
}

console.log('html occurrences in backup:', occurrences);
for (let idx of occurrences) {
    console.log(`Around ${idx}:`);
    console.log(c.substring(Math.max(0, idx - 50), idx + 100));
    console.log('---');
}

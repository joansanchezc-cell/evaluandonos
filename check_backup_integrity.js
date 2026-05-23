const fs = require('fs');
const c = fs.readFileSync('Backups/Backup_App_Evaluandonos_2026-05-21_21-30.html', 'utf8');

console.log('login-mask:', c.split('id="login-mask"').length - 1);
console.log('app-body:', c.split('id="app-body"').length - 1);
console.log('footer:', c.split('<footer').length - 1);
console.log('html tag:', c.split('<html').length - 1);

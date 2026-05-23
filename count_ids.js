const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
let countUser = 0;
let countPass = 0;
let p = -1;
while((p = c.indexOf('id="li-user"', p+1)) > -1) countUser++;
p = -1;
while((p = c.indexOf('id="li-pass"', p+1)) > -1) countPass++;
console.log('li-user:', countUser, 'li-pass:', countPass);

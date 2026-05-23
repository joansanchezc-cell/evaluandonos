const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

console.log('period-toggle:', c.split('class="period-toggle"').length - 1);
console.log('user-profile-btn:', c.split('id="user-profile-btn"').length - 1);
console.log('header class="top-bar"', c.split('<header class="top-bar"').length - 1);

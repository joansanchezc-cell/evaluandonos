const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const p1 = c.indexOf('var CURRENT_APP_VERSION = "v91"');
const pEnd = c.indexOf('</script>', p1);
console.log('Size:', pEnd - p1);

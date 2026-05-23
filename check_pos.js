const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const pModal = c.indexOf('id="admin-modal"');
const pFooter = c.indexOf('<footer');
const pMainEnd = c.lastIndexOf('</main>');
console.log('admin-modal:', pModal);
console.log('main end:', pMainEnd);
console.log('footer:', pFooter);

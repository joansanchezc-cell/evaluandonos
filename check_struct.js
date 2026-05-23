const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
const adminIdx = lines.findIndex(l => l.includes('id="admin-container"'));
const footerIdx = lines.findIndex(l => l.includes('<footer'));
const mainIdx = lines.findIndex(l => l.includes('id="section-main"'));
const adminHtml = fs.readFileSync('index.html', 'utf8');
const adminGridMatch = adminHtml.match(/<div class="admin-grid"[^>]*>/);
if (adminGridMatch) {
    const adminGridStart = adminHtml.indexOf(adminGridMatch[0]);
    const footerStart = adminHtml.indexOf('<footer');
    const mainStart = adminHtml.indexOf('<section id="section-main"');
    console.log('AdminGrid Start:', adminGridStart);
    console.log('Main Start:', mainStart);
    console.log('Footer Start:', footerStart);
}

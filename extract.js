const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const p2 = c.indexOf('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', 800730);
const endIdx = c.indexOf('<script type="module" src="./src/app.js"></script>', p2);
const block = c.substring(p2 - 13, endIdx);
fs.writeFileSync('extracted_logic.html', block, 'utf8');
console.log('✅ Extracted logic!');

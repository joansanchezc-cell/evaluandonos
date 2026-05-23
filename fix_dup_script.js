const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const anchor = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>';
let firstStart = c.indexOf(anchor);
let secondStart = c.indexOf(anchor, firstStart + 1);

if (secondStart > -1) {
    let endOfSecond = c.indexOf('<script type="module" src="./src/app.js"></script>', secondStart);
    if (endOfSecond > -1) {
        c = c.substring(0, secondStart) + c.substring(endOfSecond);
        fs.writeFileSync('index.html', c, 'utf8');
        console.log('✅ Removed duplicate script block!');
    } else {
        console.log('❌ Could not find end of second block.');
    }
} else {
    console.log('❌ No duplicate block found.');
}

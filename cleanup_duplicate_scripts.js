const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Find the footer
let start = c.indexOf('<footer');
let scriptStart = c.indexOf('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', start);

if (scriptStart > start) {
    // We found the scripts inside the footer
    // Let's see if there is another set of scripts at the end of the file
    let secondScriptStart = c.indexOf('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', scriptStart + 10);
    
    if (secondScriptStart > -1) {
        // Yes, there are duplicated scripts!
        // We will remove everything from scriptStart to the end of the FIRST </footer> tag (which actually was at the end of the duplicated scripts)
        // Wait, the first </footer> tag is actually closing the duplicated scripts.
        let firstFooterEnd = c.indexOf('</footer>', scriptStart);
        
        if (firstFooterEnd > -1) {
            c = c.substring(0, scriptStart) + '\n  </footer>\n' + c.substring(firstFooterEnd + 9);
            fs.writeFileSync('index.html', c, 'utf8');
            console.log('✅ Removed duplicated scripts and closed footer properly.');
        } else {
            console.log('❌ Could not find closing footer tag for the duplicated scripts.');
        }
    } else {
        console.log('❌ Only one set of scripts found! If we delete them, the app will break!');
    }
} else {
    console.log('❌ Scripts not found inside footer.');
}

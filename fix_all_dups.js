const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Find the footer block
let footerStart = c.indexOf('<footer');
let footerEnd = c.indexOf('</footer>') + 9;
let footerHtml = c.substring(footerStart, footerEnd);

// Find indices
let p = -1;
let loadingIndices = [];
while ((p = c.indexOf('<div id="loading"', p + 1)) > -1) {
    loadingIndices.push(p);
}

let appBodyIndices = [];
p = -1;
while ((p = c.indexOf('<div id="app-body"', p + 1)) > -1) {
    appBodyIndices.push(p);
}

if (loadingIndices.length >= 3 && appBodyIndices.length >= 3) {
    // We want to delete from the start of the 2nd loading to the end of the 3rd app body
    let deleteStart = loadingIndices[1];
    
    // Find the end of the 3rd app body, which is before the <script> tag for supabase
    let p3 = appBodyIndices[2];
    let deleteEnd = c.indexOf('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', p3);
    
    // Before we delete, we must make sure the footer is NOT in the remaining text
    let newHTML = c.substring(0, deleteStart) + c.substring(deleteEnd);
    
    // Check if footer is in newHTML
    if (newHTML.indexOf('<footer') === -1) {
        // It's not, we must insert it.
        // Where to insert? Right before the </main> of the 1st app-body.
        // Wait, what if </main> is in newHTML?
        let mainEnd = newHTML.lastIndexOf('</main>');
        if (mainEnd > -1) {
            newHTML = newHTML.substring(0, mainEnd) + '\n\n' + footerHtml + '\n' + newHTML.substring(mainEnd);
            fs.writeFileSync('index.html', newHTML, 'utf8');
            console.log('✅ Removed duplicates and restored footer.');
        } else {
            console.log('❌ Could not find </main> in the cleaned HTML.');
        }
    } else {
        // Footer survived? Somehow? Then just save
        fs.writeFileSync('index.html', newHTML, 'utf8');
        console.log('✅ Removed duplicates, footer was already there.');
    }
} else {
    console.log('❌ Did not find 3 occurrences to delete.');
}

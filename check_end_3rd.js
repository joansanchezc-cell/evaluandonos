const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

let p = -1;
let indices = [];
while ((p = c.indexOf('<div id="app-body"', p + 1)) > -1) {
    indices.push(p);
}

if (indices.length >= 3) {
    let p3 = indices[2];
    
    // Find where the 3rd app-body ends
    // Usually it ends with </div> right before <script ...> for supabase.
    let scriptStart = c.indexOf('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>', p3);
    
    console.log("End of 3rd app body context:");
    console.log(c.substring(scriptStart - 200, scriptStart));
}

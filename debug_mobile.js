const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Ver sidebar media query
const mobileNavIdx = html.indexOf('class="mobile-nav');
if(mobileNavIdx > -1) {
    console.log("MOBILE NAV:");
    console.log(html.substring(mobileNavIdx, html.indexOf('</nav>', mobileNavIdx) + 6));
}

// Ver user profile HTML
const profileIdx = html.indexOf('class="user-profile"');
if(profileIdx > -1) {
    console.log("\\nUSER PROFILE:");
    console.log(html.substring(profileIdx - 50, html.indexOf('</div>', profileIdx) + 50));
}

// Ver period selector HTML
const periodIdx = html.indexOf('class="periodo-toggle"');
if(periodIdx > -1) {
    console.log("\\nPERIOD TOGGLE:");
    console.log(html.substring(periodIdx - 50, html.indexOf('</div>', periodIdx) + 50));
}

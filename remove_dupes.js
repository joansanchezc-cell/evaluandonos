const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const navStart = '<nav class="mobile-nav no-print">';
const navEnd = '</nav>';

let firstNavIndex = c.indexOf(navStart);
if (firstNavIndex > -1) {
    let firstNavEnd = c.indexOf(navEnd, firstNavIndex) + navEnd.length;
    let keepPart = c.substring(0, firstNavEnd);
    let restPart = c.substring(firstNavEnd);
    
    let countRemoved = 0;
    while (restPart.includes(navStart)) {
        let start = restPart.indexOf(navStart);
        let end = restPart.indexOf(navEnd, start) + navEnd.length;
        // remove any whitespace before start
        let preStart = start;
        while (preStart > 0 && (restPart[preStart-1] === ' ' || restPart[preStart-1] === '\n' || restPart[preStart-1] === '\r')) {
            preStart--;
        }
        restPart = restPart.substring(0, preStart) + restPart.substring(end);
        countRemoved++;
    }
    
    // Also remove duplicate mobile-sidebar-overlay
    const overlayStr = '<div id="mobile-sidebar-overlay" onclick="toggleMobileSidebar()"></div>';
    let overlayCount = 0;
    while (restPart.includes(overlayStr)) {
        restPart = restPart.replace(overlayStr, '');
        overlayCount++;
    }
    
    // Also remove duplicate "<footer>" block if any
    
    c = keepPart + restPart;
    fs.writeFileSync('index.html', c, 'utf8');
    console.log(`✅ Removed ${countRemoved} duplicate mobile navs and ${overlayCount} overlays.`);
} else {
    console.log('No mobile nav found.');
}

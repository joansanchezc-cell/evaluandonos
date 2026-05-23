const fs = require('fs');
let originalHTML = fs.readFileSync('Backups/Backup_App_Evaluandonos_2026-05-21_21-30.html', 'utf8');

// Find the footer in backup
let footerStart = originalHTML.indexOf('<footer');
let footerEnd = originalHTML.indexOf('</footer>', footerStart) + 9;
let originalFooter = originalHTML.substring(footerStart, footerEnd);

console.log("Original footer length:", originalFooter.length);

let currentHTML = fs.readFileSync('index.html', 'utf8');

// Remove current footer
let currentFooterStart = currentHTML.indexOf('<footer');
let currentFooterEnd = currentHTML.indexOf('</footer>', currentFooterStart) + 9;

if (currentFooterStart > -1) {
    currentHTML = currentHTML.substring(0, currentFooterStart) + originalFooter + currentHTML.substring(currentFooterEnd);
} else {
    // Append before </main>
    let mainEnd = currentHTML.lastIndexOf('</main>');
    currentHTML = currentHTML.substring(0, mainEnd) + originalFooter + '\n' + currentHTML.substring(mainEnd);
}

// Remove the weird '\n\n' literal if it exists in the html outside of a script tag
currentHTML = currentHTML.replace(/>\\n\\n</g, '><'); // remove literal \n\n if it was injected
currentHTML = currentHTML.replace(/\\n\\n/g, ''); // remove any other visible \n\n just in case (this shouldn't affect valid JS newlines as they are usually actual newlines \n, not literals \\n, but wait, if it's literal \\n\\n it should be replaced)

fs.writeFileSync('index.html', currentHTML, 'utf8');
console.log('✅ Footer restored and literal \\n cleaned.');

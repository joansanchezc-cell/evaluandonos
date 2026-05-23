const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all <div> and </div>
let divLevel = 0;
let issueFound = false;

const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    divLevel += opens - closes;
    if (divLevel < 0) {
        console.log(`Negative div level at line ${i+1}: ${line}`);
        divLevel = 0; // reset
        issueFound = true;
    }
}
if (!issueFound) console.log("No negative div levels found.");

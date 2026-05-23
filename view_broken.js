const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const brokenIdx = c.indexOf("const btnEst = $('btn-sub-analisis-estudiante');");
if (brokenIdx > -1) {
  console.log(c.substring(brokenIdx - 100, brokenIdx + 500));
} else {
  console.log("No encontré const btnEst");
}

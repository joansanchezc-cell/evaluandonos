const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. chartGrados
content = content.replace(
  /datalabels: { color: '#fff', font: { weight: 'bold', size: 12 }, anchor: 'end', align: 'bottom', formatter: v => v \+ '%' }/,
  "datalabels: { color: '#fff', font: { weight: 'bold', size: 16 }, anchor: 'end', align: 'bottom', formatter: v => v }"
);
content = content.replace(
  /scales: { y: { min: 0, max: 100, ticks: { callback: v => v \+ '%' } } }/,
  "scales: { y: { min: 0, max: 100, ticks: { callback: v => v } }, x: { ticks: { color: '#000', font: { weight: 'bold', size: 14 } } } }"
);

// 2. chartMaterias
content = content.replace(
  /datalabels: { color: '#1e293b', font: { weight: 'bold', size: 11 }, anchor: 'end', align: 'right', formatter: v => v \+ '%' }/,
  "datalabels: { color: '#1e293b', font: { weight: 'bold', size: 16 }, anchor: 'end', align: 'right', formatter: v => v }"
);
content = content.replace(
  /scales: { x: { min: 0, max: 100 } }/,
  "scales: { x: { min: 0, max: 100 }, y: { ticks: { color: '#000', font: { weight: 'bold', size: 14 } } } }"
);

// 3. chartComparativo
content = content.replace(
  /color: '#fff',\s*font: { weight: 'bold', size: 10 },\s*anchor: 'center',\s*align: 'center',\s*formatter: v => v > 0 \? v : ''/,
  "color: '#fff',\n                font: { weight: 'bold', size: 14 },\n                anchor: 'center',\n                align: 'center',\n                formatter: v => v > 0 ? v : ''"
);
content = content.replace(
  /x: { ticks: { font: { size: 9 }, autoSkip: false, maxRotation: 45, minRotation: 0 } }/,
  "x: { ticks: { color: '#000', font: { weight: 'bold', size: 12 }, autoSkip: false, maxRotation: 45, minRotation: 0 } }"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Chart fixes applied successfully.");

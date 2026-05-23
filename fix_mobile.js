const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// 1. Ocultar textos de usuario en móvil para evitar overlaps
const insertionStr = `      #user-badge > div:first-child { display: none !important; }
      #user-badge { gap: 5px !important; padding: 4px 8px !important; }
`;
c = c.replace('#user-badge {\r\n        position: relative !important;', insertionStr + '#user-badge {\r\n        position: relative !important;');
c = c.replace('#user-badge {\n        position: relative !important;', insertionStr + '#user-badge {\n        position: relative !important;');

fs.writeFileSync('index.html', c, 'utf8');
console.log('Mobile layout modified.');

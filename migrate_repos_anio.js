const fs = require('fs');
const path = require('path');

const repoPath = path.join(__dirname, 'src', 'data', 'repositories');
const files = fs.readdirSync(repoPath).filter(f => f.endsWith('.js'));

for (const file of files) {
    const filePath = path.join(repoPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Mismo reemplazo que index.html
    content = content.replace(/\.eq\('periodo'/g, ".eq('anio', window.currentYear).eq('periodo'");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Actualizado ${file}`);
}
console.log("Migracion de repositorios completada.");

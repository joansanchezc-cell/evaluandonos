const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Reducir padding de .controls
content = content.replace(
  /gap:\s*1\.5rem;([\s\S]*?)padding:\s*1\.5rem;([\s\S]*?)border-radius:\s*24px;/g,
  'gap: 0.8rem;$1padding: 1rem;$2border-radius: 16px;'
);

// 2. Reducir gap de .dashboard-grid
content = content.replace(
  /\.dashboard-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1\.6fr 1fr;\s*gap:\s*2rem;\s*margin-top:\s*2rem;\s*\}/g,
  '.dashboard-grid {\n      display: grid;\n      grid-template-columns: 1.6fr 1fr;\n      gap: 1rem;\n      margin-top: 1rem;\n    }'
);

// 3. Reducir padding de .option
content = content.replace(
  /\.option\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*padding:\s*1rem 1\.2rem;\s*border:\s*2px solid #f1f5f9;\s*background:\s*#ffffff;\s*border-radius:\s*16px;/g,
  '.option {\n      display: flex;\n      align-items: center;\n      padding: 0.5rem 1rem;\n      border: 2px solid #f1f5f9;\n      background: #ffffff;\n      border-radius: 12px;'
);

// 4. Eliminar el viejo banner gigante (id="top-banner")
content = content.replace(
  /\s*<!-- BANNER SUPERIOR FIJO -->\s*<header id="top-banner"[\s\S]*?<\/header>/,
  ''
);

// 5. Eliminar el botón MODULAR
content = content.replace(
  /\s*<button id="clean-arch-trigger"[\s\S]*?✨ MODULAR\s*<\/button>/,
  ''
);

// 6. Eliminar padding superior y márgenes (Blanco inútil encima de controles)
content = content.replace(
  /<div id="scrollable-views" style="padding: 20px 30px; flex: 1;">/,
  '<div id="scrollable-views" style="padding: 0 30px 20px 30px; flex: 1;">'
);
content = content.replace(
  /<main class="container" style="padding-top: 10px;">/,
  '<main class="container" style="padding-top: 0;">'
);
content = content.replace(
  /<!-- Espacio superior para separación -->\s*<div style="margin-top: 1rem;"><\/div>/g,
  ''
);

// 7. Insertar el logo en el sidebar (abajo)
content = content.replace(
  /<\/nav>\s*<\/aside>/,
  `  <div style="margin-top: auto; padding: 20px; display: flex; justify-content: center; opacity: 0.3;">
          <img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/logo%20solo%20copia.png" style="width: 120px; max-width: 100%; object-fit: contain;">
        </div>
      </nav>
    </aside>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Espacios eliminados y logo agregado.");

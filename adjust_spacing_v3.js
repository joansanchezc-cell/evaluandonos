const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Reducir padding de la .card de 2.5rem a 1.2rem
content = content.replace(
  'padding: 2.5rem;\n      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);',
  'padding: 1.2rem;\n      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);'
);

// 2. Hacer que el container ocupe el 100% de la pantalla para que las cards sean más anchas
content = content.replace(
  '    .container {\n      max-width: 1400px;\n      margin: 0 auto;\n      padding: 0 2rem;\n    }',
  '    .container {\n      max-width: 100%;\n      margin: 0;\n      padding: 0;\n    }'
);

// 3. Reducir padding y márgenes de Acción requerida
content = content.replace(
  '<div style="margin-bottom:14px; padding:10px 16px; background:${c.bg}; border:1px solid ${c.border}44; border-left:6px solid ${c.border}; border-radius:10px; color:${c.text}; font-weight:700; font-size:1em; box-shadow: 0 2px 4px rgba(0,0,0,0.05); line-height:1.4;">',
  '<div style="margin-bottom:8px; padding:6px 12px; background:${c.bg}; border:1px solid ${c.border}44; border-left:4px solid ${c.border}; border-radius:8px; color:${c.text}; font-weight:700; font-size:0.9em; box-shadow: 0 2px 4px rgba(0,0,0,0.05); line-height:1.3;">'
);

// 4. Reducir margin-bottom del texto de contexto
content = content.replace(
  '<div style="margin-bottom:12px; line-height:1.5; color:#334155;">${contextText.replace(/\\n/g, \'<br>\')}</div>',
  '<div style="margin-bottom:6px; line-height:1.4; color:#334155; font-size:0.95em;">${contextText.replace(/\\n/g, \'<br>\')}</div>'
);
content = content.replace(
  '<div style="margin-bottom:12px; line-height:1.5; color:#334155;">${contentPart.replace(/\\n/g, \'<br>\')}</div>',
  '<div style="margin-bottom:6px; line-height:1.4; color:#334155; font-size:0.95em;">${contentPart.replace(/\\n/g, \'<br>\')}</div>'
);

// 5. Agregar el logo al final del Sidebar
const endSidebarMarker = '      </nav>\n    </aside>';
const sidebarLogo = `        <div style="margin-top: auto; padding: 20px; display: flex; justify-content: center; opacity: 0.5;">
          <img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/logo%20solo%20copia.png" style="width: 100px; max-width: 100%; object-fit: contain;">
        </div>
      </nav>
    </aside>`;

if(content.includes(endSidebarMarker) && !content.includes('logo%20solo%20copia.png')) {
  content = content.replace(endSidebarMarker, sidebarLogo);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Ajuste V3 de espaciados completado exitosamente.");

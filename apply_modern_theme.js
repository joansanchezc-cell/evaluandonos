const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Arreglar el Logo (mix-blend-mode y tamaño)
content = content.replace(
  '<img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/evaluandonos.png" alt="Evaluándonos" style="height: 140px; margin-top: -5%;">',
  '<img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/evaluandonos.png" alt="Evaluándonos" style="height: 60px; transform: scale(1.4); transform-origin: right center; mix-blend-mode: multiply;">'
);

// 2. Corregir espaciados (como en fix_all.js)
content = content.replace(
  /padding:\s*2\.5rem;\s*box-shadow:\s*0\s*20px\s*40px\s*-10px\s*rgba\(0,\s*0,\s*0,\s*0\.05\);/g,
  'padding: 1.2rem;\n      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);'
);
content = content.replace(
  /\.container\s*\{\s*max-width:\s*1400px;\s*margin:\s*0\s*auto;\s*padding:\s*0\s*2rem;\s*\}/g,
  '.container {\n      max-width: 100%;\n      margin: 0;\n      padding: 0;\n    }'
);

// 3. Corregir "Acción Requerida"
content = content.replace(
  /const INSTRUCCION_COLORS = \[[\s\S]*?\];/g,
  "const INSTRUCCION_COLORS = [{ bg: 'rgba(238, 242, 255, 0.9)', border: '#6366f1', text: '#3730a3' }];"
);
content = content.replace(
  /padding:10px 16px;\s*background:\$\{c\.bg\};\s*border:1px solid \$\{c\.border\}44;\s*border-left:6px solid \$\{c\.border\};\s*border-radius:10px;\s*color:\$\{c\.text\};\s*font-weight:700;\s*font-size:1em;\s*box-shadow:\s*0\s*2px\s*4px\s*rgba\(0,0,0,0\.05\);\s*line-height:1\.4;/g,
  'padding:6px 12px; background:${c.bg}; border:1px solid ${c.border}44; border-left:4px solid ${c.border}; border-radius:8px; color:${c.text}; font-weight:700; font-size:0.85em; box-shadow: 0 2px 4px rgba(0,0,0,0.05); line-height:1.2;'
);

content = content.replace(
  /<div style="margin-bottom:12px; line-height:1\.5; color:#334155;">/g,
  '<div style="margin-bottom:6px; line-height:1.4; color:#334155; font-size:0.95em;">'
);

// 4. Armonía de colores: Quitar Arcoíris

// Tabs de periodo
content = content.replace(
  /#tab-1\.active \{\s*background: linear-gradient\(135deg, #3b82f6, #2563eb\);\s*color: white;\s*border: none;\s*box-shadow: 0 4px 12px rgba\(59, 130, 246, 0\.3\);\s*\}/g,
  '#tab-1.active { background: #4f46e5; color: white; border: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }'
);
content = content.replace(
  /#tab-2\.active \{\s*background: linear-gradient\(135deg, #10b981, #059669\);\s*color: white;\s*border: none;\s*box-shadow: 0 4px 12px rgba\(16, 185, 129, 0\.3\);\s*\}/g,
  '#tab-2.active { background: #4f46e5; color: white; border: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }'
);
content = content.replace(
  /#tab-3\.active \{\s*background: linear-gradient\(135deg, #ef4444, #dc2626\);\s*color: white;\s*border: none;\s*box-shadow: 0 4px 12px rgba\(239, 68, 68, 0\.3\);\s*\}/g,
  '#tab-3.active { background: #4f46e5; color: white; border: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }'
);
content = content.replace(/#tab-1 \{[\s\S]*?\}/g, '');
content = content.replace(/#tab-2 \{[\s\S]*?\}/g, '');
content = content.replace(/#tab-3 \{[\s\S]*?\}/g, '');

// Opciones correctas/incorrectas
content = content.replace(
  /\.option\.correct \{\s*border-color: #22c55e;\s*background: linear-gradient\(135deg, #22c55e 0%, #16a34a 100%\);\s*color: white !important;\s*font-weight: 600;\s*box-shadow: 0 10px 25px -5px rgba\(34, 197, 94, 0\.4\);\s*transform: scale\(1\.02\);\s*\}/g,
  '.option.correct { border-color: #10b981; background: #ecfdf5; color: #065f46 !important; font-weight: 700; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15); transform: scale(1.02); }'
);
content = content.replace(
  /\.option\.incorrect \{\s*border-color: #ef4444;\s*background: linear-gradient\(135deg, #ef4444 0%, #dc2626 100%\);\s*color: white !important;\s*font-weight: 600;\s*box-shadow: 0 10px 25px -5px rgba\(239, 68, 68, 0\.4\);\s*transform: scale\(1\.02\);\s*\}/g,
  '.option.incorrect { border-color: #f43f5e; background: #fff1f2; color: #9f1239 !important; font-weight: 700; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.15); transform: scale(1.02); }'
);
content = content.replace(
  /\.option\.correct \.option-letter \{\s*background: white;\s*color: #16a34a;\s*\}/g,
  '.option.correct .option-letter { background: #10b981; color: white; }'
);
content = content.replace(
  /(\.option\.incorrect \.option-letter \{\s*)([\s\S]*?)(\})/g,
  '.option.incorrect .option-letter { background: #f43f5e; color: white; }'
);

// Colores forzados de tabs (quitar)
content = content.replace(/\.option\.correct \{\s*background: #22c55e !important;\s*color: white !important;\s*border-color: #16a34a !important;\s*\}/g, '');
content = content.replace(/\.option\.incorrect \{\s*background: #ef4444 !important;\s*color: white !important;\s*border-color: #dc2626 !important;\s*\}/g, '');

// Agregar logo abajo del sidebar
const endSidebarMarker = /<\/nav>\s*<\/aside>/;
const sidebarLogo = `        <div style="margin-top: auto; padding: 20px; display: flex; justify-content: center; opacity: 0.5;">
          <img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/logo%20solo%20copia.png" style="width: 140px; max-width: 100%; object-fit: contain;">
        </div>
      </nav>
    </aside>`;
if (endSidebarMarker.test(content) && !content.includes('logo%20solo%20copia.png')) {
  content = content.replace(endSidebarMarker, sidebarLogo);
}

// 5. Cambiar alumno a estudiante globalmente
content = content.replace(/alumnos/g, 'estudiantes');
content = content.replace(/Alumnos/g, 'Estudiantes');
content = content.replace(/alumno/g, 'estudiante');
content = content.replace(/Alumno/g, 'Estudiante');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Modernización y armonía aplicada con éxito.");

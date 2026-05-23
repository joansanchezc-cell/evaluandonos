const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. ADD aimg-status
if (!content.includes('<div id="aimg-status"')) {
    content = content.replace(
        '<div id="aimg-detalle" style="display:none; background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:15px;">',
        '<div id="aimg-status" style="margin-bottom:10px; font-size:0.75rem; color:#64748b; font-weight:bold;"></div>\n        <div id="aimg-detalle" style="display:none; background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:15px;">'
    );
}

// 2. Add ZipGrade field to student form
if (!content.includes('ind-est-zip')) {
    content = content.replace(
        '<input type="text" id="ind-est-nom" placeholder="Nombre Completo" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">',
        '<input type="text" id="ind-est-zip" placeholder="Código ZipGrade (Opcional)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">\n            <input type="text" id="ind-est-nom" placeholder="Nombre Completo" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">'
    );
}

// 3. Modifying Docente Form
const oldDocenteForm = `<input type="text" id="ind-doc-rol" placeholder="Roles (Ej: docente, admin, superadmin)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-gra" placeholder="Grados (Ej: 301,401,5-PJ)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">`;

const newDocenteForm = `<select id="ind-doc-rol" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
              <option value="">-- Selecciona un Rol --</option>
              <option value="lector">Lector</option>
              <option value="admin">Administrador de Sede</option>
              <option value="superadmin">Súper Administrador</option>
            </select>
            <input type="text" id="ind-doc-asig" placeholder="Asignatura (Ej: MATEMATICAS)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-gra" placeholder="Grados Permitidos (Ej: 301,401,5-PJ)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <label style="display:flex; align-items:center; gap:8px; font-size:0.9rem; color:#475569;">
              <input type="checkbox" id="ind-doc-is-dir" onchange="document.getElementById('ind-doc-g-dir').style.display = this.checked ? 'block' : 'none'">
              Es Director de Grupo
            </label>
            <input type="text" id="ind-doc-g-dir" placeholder="Grupo Dirigido (Ej: 1101)" style="display:none; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">`;

content = content.replace(oldDocenteForm, newDocenteForm);

// 4. Update JS for Student
const oldEstJS = `const sed = $('ind-est-sede').value.trim() || 'Central';
        const statusDiv = $('ind-est-status');`;

const newEstJS = `const sed = $('ind-est-sede').value.trim() || 'Central';
        const zip = $('ind-est-zip') ? $('ind-est-zip').value.trim() : null;
        const statusDiv = $('ind-est-status');`;

content = content.replace(oldEstJS, newEstJS);

const oldEstInsert = `sede: sed,
            anio: window.currentYear || 2026
          };`;

const newEstInsert = `sede: sed,
            anio: window.currentYear || 2026,
            zipgrade_id: zip
          };`;

content = content.replace(oldEstInsert, newEstInsert);

// 5. Update JS for Docente
const oldDocJS = `const rol = $('ind-doc-rol').value.trim();
        const gra = $('ind-doc-gra').value.trim();
        const statusDiv = $('ind-doc-status');`;

const newDocJS = `const rol = $('ind-doc-rol').value;
        const gra = $('ind-doc-gra').value.trim();
        const asig = $('ind-doc-asig') ? $('ind-doc-asig').value.trim() : null;
        const isDir = $('ind-doc-is-dir') ? $('ind-doc-is-dir').checked : false;
        const gDir = $('ind-doc-g-dir') ? $('ind-doc-g-dir').value.trim() : null;
        const statusDiv = $('ind-doc-status');`;

content = content.replace(oldDocJS, newDocJS);

const oldDocInsert = `roles: rol || null,
            grados: gra || null
          };`;

const newDocInsert = `roles: rol || null,
            grados: gra || null,
            asignatura: asig || null,
            es_director_grupo: isDir,
            grupo_director: gDir || null
          };`;

content = content.replace(oldDocInsert, newDocInsert);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Correcciones inyectadas exitosamente.");

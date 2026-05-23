const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Modificar Formulario Estudiante
// Quitar "Mañana / Tarde" y convertir Sede en select
const oldEstudianteFields = `<div style="display:flex; gap:10px;">
              <input type="text" id="ind-est-gra" placeholder="Grado (Ej: 1101)" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
              <select id="ind-est-jor" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
                <option value="M">Mañana</option><option value="T">Tarde</option>
              </select>
            </div>
            <input type="text" id="ind-est-sede" placeholder="Sede (Opcional, defecto: Central)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">`;

const newEstudianteFields = `<input type="text" id="ind-est-gra" placeholder="Grado (Ej: 1101)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <select id="ind-est-sede" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
              <option value="Central">Central</option>
              <option value="Pisoje Bajo">Pisoje Bajo</option>
              <option value="Yanaconas">Yanaconas</option>
              <option value="Pueblillo">Pueblillo</option>
              <option value="Sendero">Sendero</option>
            </select>`;

content = content.replace(oldEstudianteFields, newEstudianteFields);

// Actualizar JS de Estudiante para remover "jor"
const oldEstJSVars = `const gra = parseInt($('ind-est-gra').value);
        const jor = $('ind-est-jor').value;
        const sed = $('ind-est-sede').value.trim() || 'Central';`;

const newEstJSVars = `const gra = parseInt($('ind-est-gra').value);
        const sed = $('ind-est-sede').value || 'Central';`;

content = content.replace(oldEstJSVars, newEstJSVars);

const oldEstInsert = `grado: gra,
            jornada: jor,
            sede: sed,`;

const newEstInsert = `grado: gra,
            sede: sed,`;

content = content.replace(oldEstInsert, newEstInsert);


// 2. Modificar Formulario Docentes (Asignaturas y Grados como Checkboxes)
const asignaturasList = ['MATEMATICAS', 'CIENCIAS NATURALES', 'BIOLOGIA', 'QUIMICA', 'FISICA', 'LENGUAJE', 'LECTURA CRITICA', 'CIENCIAS SOCIALES', 'COMPETENCIAS CIUDADANAS', 'INGLES', 'FILOSOFIA', 'ETICA'];
let asigHtml = '<div style="max-height:120px; overflow-y:auto; border:1px solid #cbd5e1; border-radius:10px; padding:10px; font-size:0.85rem; background:#f8fafc;">';
asignaturasList.forEach(a => {
    asigHtml += `<label style="display:block; margin-bottom:5px; cursor:pointer;"><input type="checkbox" class="doc-chk-asig" value="${a}"> ${a}</label>`;
});
asigHtml += '</div>';

const gradosList = ['301','302','401','402','501','502','601','602','701','702','801','802','901','902','1001','1002','1101','1102', '3-PJ','4-PJ','5-PJ','3-YA','4-YA','5-YA','3-PU','4-PU','5-PU','3-SE','4-SE','5-SE'];
let gradosHtml = '<div style="max-height:120px; overflow-y:auto; border:1px solid #cbd5e1; border-radius:10px; padding:10px; font-size:0.85rem; background:#f8fafc;">';
gradosList.forEach(g => {
    gradosHtml += `<label style="display:inline-block; width:30%; margin-bottom:5px; cursor:pointer;"><input type="checkbox" class="doc-chk-gra" value="${g}"> ${g}</label>`;
});
gradosHtml += '</div>';

const oldDocenteFields = `<input type="text" id="ind-doc-asig" placeholder="Asignatura (Ej: MATEMATICAS)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-gra" placeholder="Grados Permitidos (Ej: 301,401,5-PJ)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">`;

const newDocenteFields = `<label style="font-size:0.8rem; font-weight:bold; color:#475569;">Asignaturas (Selecciona una o varias):</label>
            ${asigHtml}
            <label style="font-size:0.8rem; font-weight:bold; color:#475569;">Grados Permitidos (Selecciona uno o varios):</label>
            ${gradosHtml}`;

content = content.replace(oldDocenteFields, newDocenteFields);


// 3. Modificar JS de Docentes para leer los checkboxes
const oldDocJSVars = `const rol = $('ind-doc-rol').value;
        const gra = $('ind-doc-gra').value.trim();
        const asig = $('ind-doc-asig') ? $('ind-doc-asig').value.trim() : null;`;

const newDocJSVars = `const rol = $('ind-doc-rol').value;
        
        // Leer checkboxes
        const asigCheckboxes = document.querySelectorAll('.doc-chk-asig:checked');
        const asigVals = Array.from(asigCheckboxes).map(c => c.value);
        const asig = asigVals.length > 0 ? asigVals.join(',') : null;
        
        const graCheckboxes = document.querySelectorAll('.doc-chk-gra:checked');
        const graVals = Array.from(graCheckboxes).map(c => c.value);
        const gra = graVals.length > 0 ? graVals.join(',') : null;
`;

content = content.replace(oldDocJSVars, newDocJSVars);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Formularios actualizados con listas de chequeo.");

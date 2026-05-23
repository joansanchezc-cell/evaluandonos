const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Añadir Interfaz Gráfica para Carga Académica al Formulario de Docentes
const oldDocenteFields = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Rol *</label>
                <select id="nu-rol" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
                  <option value="lector">Docente (Lector)</option>
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Super Administrador</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Grado Asignado</label>
                <input type="text" id="nu-grado" placeholder="Ej: 11A (Opcional)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
              </div>
            </div>`;

const newDocenteFields = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Rol *</label>
                <select id="nu-rol" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
                  <option value="lector">Docente (Lector)</option>
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Super Administrador</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Grado Resumen</label>
                <input type="text" id="nu-grado" placeholder="Ej: 11A (Informativo)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
              </div>
            </div>

            <!-- CARGA ACADÉMICA / DOCENTES PRIVACIDAD -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-top: 10px;">
              <h4 style="margin: 0 0 10px 0; font-size: 0.85rem; color: #1e293b; font-weight: 800;">📚 Carga Académica</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                  <input type="text" id="nu-carga-asig" placeholder="Materia (ej: MATEMATICAS)" style="width:100%; padding:8px; border-radius:6px; border:1px solid #cbd5e1; font-size:0.85rem; box-sizing:border-box;">
                </div>
                <div>
                  <input type="text" id="nu-carga-grado" placeholder="Grupo (ej: 11A)" style="width:100%; padding:8px; border-radius:6px; border:1px solid #cbd5e1; font-size:0.85rem; box-sizing:border-box;">
                </div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                <label style="font-size: 0.75rem; color: #475569; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                  <input type="checkbox" id="nu-carga-director"> Es Director (Añade ÉTICA)
                </label>
                <button onclick="agregarCargaDocente()" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">+ Añadir</button>
              </div>
              <ul id="lista-carga-docente" style="list-style: none; padding: 0; margin: 10px 0 0 0; font-size: 0.8rem; max-height: 120px; overflow-y: auto;">
              </ul>
            </div>`;

if (content.includes(oldDocenteFields)) {
  content = content.replace(oldDocenteFields, newDocenteFields);
} else {
  console.log('Error: no se encontró form-docente-fields original');
}

// 2. Lógica JS: Variables, Agregar, Renderizar y Eliminar
const oldStateVars = `let todosLosRegistros = [];
      let currentUserView = 'docente';`;

const newStateVars = `let todosLosRegistros = [];
      let currentUserView = 'docente';
      let cargaDocenteActual = []; // Array temporal {asignatura, grado}`;

content = content.replace(oldStateVars, newStateVars);

const jsFuncs = `
      window.agregarCargaDocente = function() {
        const asigEl = document.getElementById('nu-carga-asig');
        const gradoEl = document.getElementById('nu-carga-grado');
        const isDirector = document.getElementById('nu-carga-director').checked;
        
        let asig = asigEl.value.trim().toUpperCase();
        let grado = gradoEl.value.trim().toUpperCase();

        if (isDirector && grado) {
          asig = 'ETICA'; // Regla de negocio: Director = ETICA
        }

        if (!asig || !grado) return alert('Ingresa Asignatura y Grupo.');
        
        // Evitar duplicados exactos
        if (!cargaDocenteActual.some(c => c.asignatura === asig && c.grado === grado)) {
          cargaDocenteActual.push({ asignatura: asig, grado: grado, tipo: 'ASIGNACION' });
        }
        
        asigEl.value = '';
        gradoEl.value = '';
        document.getElementById('nu-carga-director').checked = false;
        renderCargaDocente();
      };

      window.eliminarCargaDocente = function(idx) {
        cargaDocenteActual.splice(idx, 1);
        renderCargaDocente();
      };

      window.renderCargaDocente = function() {
        const ul = document.getElementById('lista-carga-docente');
        if (!ul) return;
        ul.innerHTML = '';
        if (cargaDocenteActual.length === 0) {
          ul.innerHTML = '<li style="color:#94a3b8; font-style:italic; padding:5px 0;">Sin asignaciones...</li>';
          return;
        }
        cargaDocenteActual.forEach((c, idx) => {
          ul.innerHTML += \`<li style="display:flex; justify-content:space-between; align-items:center; background:#f1f5f9; padding:5px 8px; border-radius:4px; margin-bottom:4px; border-left:3px solid #3b82f6;">
            <span><strong style="color:#1e293b;">\${c.asignatura}</strong> en \${c.grado}</span>
            <button onclick="eliminarCargaDocente(\${idx})" style="background:transparent; border:none; color:#ef4444; font-weight:900; cursor:pointer;">x</button>
          </li>\`;
        });
      };
`;

const jsInsertionPoint = `window.switchUserView = function(type) {`;
content = content.replace(jsInsertionPoint, jsFuncs + '\n      ' + jsInsertionPoint);


// 3. Modificar prepararNuevoUsuario para limpiar
const prepOld = `const nr = document.getElementById('nu-rol'); if(nr) nr.value = 'lector';
          const ng = document.getElementById('nu-grado'); if(ng) ng.value = '';`;
const prepNew = `const nr = document.getElementById('nu-rol'); if(nr) nr.value = 'lector';
          const ng = document.getElementById('nu-grado'); if(ng) ng.value = '';
          cargaDocenteActual = []; renderCargaDocente(); document.getElementById('nu-carga-asig').value=''; document.getElementById('nu-carga-grado').value='';`;
content = content.replace(prepOld, prepNew);


// 4. Modificar editarUsuario para traer docentes_privacidad
const editOld = `window.editarUsuario = function(id) {
        const formType = document.getElementById('nu-form-type')?.value || 'docente';
        const user = todosLosRegistros.find(u => u.id === id || u.identificacion === id);
        if (!user) return;
        document.getElementById('nu-id').value = id;`;

const editNew = `window.editarUsuario = async function(id) {
        const formType = document.getElementById('nu-form-type')?.value || 'docente';
        const user = todosLosRegistros.find(u => u.id === id || u.identificacion === id);
        if (!user) return;
        document.getElementById('nu-id').value = id;
        
        if (formType === 'docente' && user.nombre) {
          // Consultar permisos actuales
          try {
             const { data } = await supabaseClient.from('docentes_privacidad').select('asignatura, grado, tipo').eq('nombre', user.nombre);
             cargaDocenteActual = data || [];
             renderCargaDocente();
          } catch(e) { console.error('Error fetching privacidad:', e); }
        }`;
content = content.replace(editOld, editNew);


// 5. Modificar guardarUsuario para DOCENTES
const oldSaveDocente = `const userId = data.user.id;
              const { error: pErr } = await supabaseClient.from('perfiles').insert({ id: userId, email, nombre, rol, grado_asignado });
              if (pErr) throw pErr;
            } else {
              const { error: pErr } = await supabaseClient.from('perfiles').update({ email, nombre, rol, grado_asignado }).eq('id', id);
              if (pErr) throw pErr;
            }`;

const newSaveDocente = `const userId = data.user.id;
              const { error: pErr } = await supabaseClient.from('perfiles').insert({ id: userId, email, nombre, rol, grado_asignado });
              if (pErr) throw pErr;
            } else {
              const { error: pErr } = await supabaseClient.from('perfiles').update({ email, nombre, rol, grado_asignado }).eq('id', id);
              if (pErr) throw pErr;
            }

            // --- ACTUALIZAR DOCENTES_PRIVACIDAD ---
            if (nombre) {
              // 1. Borrar todas las asignaciones anteriores
              await supabaseClient.from('docentes_privacidad').delete().eq('nombre', nombre);
              // 2. Insertar las nuevas
              if (cargaDocenteActual.length > 0) {
                 const insertData = cargaDocenteActual.map(c => ({
                    nombre: nombre,
                    asignatura: c.asignatura,
                    grado: c.grado,
                    tipo: c.tipo || 'ASIGNACION'
                 }));
                 const { error: privErr } = await supabaseClient.from('docentes_privacidad').insert(insertData);
                 if (privErr) throw privErr;
              }
            }`;
content = content.replace(oldSaveDocente, newSaveDocente);

// Save file
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ UI y Lógica de docentes_privacidad (Carga Académica) inyectada.');

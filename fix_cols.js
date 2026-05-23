const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Agregar el campo grado_asignado al form-docente-fields
const oldDocenteFields = `          <!-- === CAMPOS DOCENTE (tabla: perfiles) === -->
          <div id="form-docente-fields" style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Correo Electrónico *</label>
              <input type="email" id="nu-email" placeholder="docente@colegio.edu.co" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nombre Completo *</label>
              <input type="text" id="nu-nombre-doc" placeholder="Apellidos y Nombres" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Contraseña <span id="pass-hint" style="text-transform:none; font-weight:400;">(requerida para nuevo)</span></label>
              <input type="password" id="nu-pass" placeholder="Mínimo 6 caracteres" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Rol / Nivel de Acceso *</label>
              <select id="nu-rol" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
                <option value="lector">Docente (Lector)</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Super Administrador</option>
              </select>
            </div>
          </div>`;

const newDocenteFields = `          <!-- === CAMPOS DOCENTE (tabla: perfiles) === -->
          <div id="form-docente-fields" style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Correo Electrónico *</label>
              <input type="email" id="nu-email" placeholder="docente@colegio.edu.co" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nombre Completo *</label>
              <input type="text" id="nu-nombre-doc" placeholder="Apellidos y Nombres" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Contraseña <span id="pass-hint" style="text-transform:none; font-weight:400;">(requerida para nuevo)</span></label>
              <input type="password" id="nu-pass" placeholder="Mínimo 6 caracteres" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
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
            </div>
          </div>`;

if (content.includes(oldDocenteFields)) {
  content = content.replace(oldDocenteFields, newDocenteFields);
}

// 2. Modificar Thead
const oldTheadDocente = `thead.innerHTML = '<tr><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Nombre</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Email</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Rol</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Acción</th></tr>';`;
const newTheadDocente = `thead.innerHTML = '<tr><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Nombre</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Email</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Rol / Grado</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Acción</th></tr>';`;
content = content.replace(oldTheadDocente, newTheadDocente);

const oldTheadDocente2 = `thead.innerHTML = '<tr><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Nombre</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Email</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Rol</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Acción</th></tr>';`;
content = content.replace(oldTheadDocente2, newTheadDocente);

// 3. Modificar cargarUsuarios para traer grado_asignado
const oldSelect = `.select('id, email, nombre, rol')`;
const newSelect = `.select('id, email, nombre, rol, grado_asignado')`;
content = content.replace(oldSelect, newSelect);

// 4. Modificar renderUsuariosTabla para mostrar el grado_asignado
const oldRenderDocente = `<td style="padding:12px;"><span style="background:#e0e7ff;color:#3730a3;padding:3px 8px;border-radius:10px;font-size:0.75rem;font-weight:800;text-transform:uppercase;">\${u.rol||'-'}</span></td>`;
const newRenderDocente = `<td style="padding:12px;">
              <span style="background:#e0e7ff;color:#3730a3;padding:3px 8px;border-radius:10px;font-size:0.75rem;font-weight:800;text-transform:uppercase;display:block;width:fit-content;margin-bottom:4px;">\${u.rol||'-'}</span>
              \${u.grado_asignado ? \`<span style="color:#64748b;font-size:0.75rem;font-weight:700;">Grado: \${u.grado_asignado}</span>\` : ''}
            </td>`;
content = content.replace(oldRenderDocente, newRenderDocente);

// 5. Actualizar prepararNuevoUsuario
content = content.replace(`const nr = document.getElementById('nu-rol'); if(nr) nr.value = 'lector';`, `const nr = document.getElementById('nu-rol'); if(nr) nr.value = 'lector';\n          const ng = document.getElementById('nu-grado'); if(ng) ng.value = '';`);

// 6. Actualizar editarUsuario
content = content.replace(`const nr = document.getElementById('nu-rol'); if(nr) nr.value = user.rol || 'lector';`, `const nr = document.getElementById('nu-rol'); if(nr) nr.value = user.rol || 'lector';\n          const ng = document.getElementById('nu-grado'); if(ng) ng.value = user.grado_asignado || '';`);

// 7. Modificar guardarUsuario para incluir grado_asignado
const oldGuardarDocente = `const rol = (document.getElementById('nu-rol') || {}).value || 'lector';

            if (!email || !nombre) throw new Error('El nombre y el email son obligatorios.');

            if (!isEdit) {
              if (!pass) throw new Error('La contraseña es obligatoria para nuevos usuarios.');
              const { data, error } = await supabaseClient.auth.signUp({
                email, password: pass, options: { data: { nombre, name: nombre } }
              });
              if (error) {
                if (error.message.includes('already registered') || error.status === 422) throw new Error('El correo ya está registrado.');
                throw error;
              }
              const userId = data.user.id;
              const { error: pErr } = await supabaseClient.from('perfiles').insert({ id: userId, email, nombre, rol });
              if (pErr) throw pErr;
            } else {
              const { error: pErr } = await supabaseClient.from('perfiles').update({ email, nombre, rol }).eq('id', id);
              if (pErr) throw pErr;
            }`;

const newGuardarDocente = `const rol = (document.getElementById('nu-rol') || {}).value || 'lector';
            const grado_asignado = (document.getElementById('nu-grado') || {}).value?.trim() || null;

            if (!email || !nombre) throw new Error('El nombre y el email son obligatorios.');

            if (!isEdit) {
              if (!pass) throw new Error('La contraseña es obligatoria para nuevos usuarios.');
              const { data, error } = await supabaseClient.auth.signUp({
                email, password: pass, options: { data: { nombre, name: nombre } }
              });
              if (error) {
                if (error.message.includes('already registered') || error.status === 422) throw new Error('El correo ya está registrado.');
                throw error;
              }
              const userId = data.user.id;
              const { error: pErr } = await supabaseClient.from('perfiles').insert({ id: userId, email, nombre, rol, grado_asignado });
              if (pErr) throw pErr;
            } else {
              const { error: pErr } = await supabaseClient.from('perfiles').update({ email, nombre, rol, grado_asignado }).eq('id', id);
              if (pErr) throw pErr;
            }`;

if (content.includes(oldGuardarDocente)) {
  content = content.replace(oldGuardarDocente, newGuardarDocente);
}

fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log('✅ Columnas ajustadas: grado_asignado agregado a perfiles.');

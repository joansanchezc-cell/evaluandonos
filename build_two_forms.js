const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// HTML
const oldHTMLRegex = /<!-- Derecha: Formulario -->[\s\S]*?<div id="users-status".*?<\/div>\s*<\/div>/;

const newHTML = `<!-- Derecha: Formulario -->
        <div style="display:flex; flex-direction:column; gap:15px; background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; height: fit-content;">
          
          <div style="display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            <button id="tab-form-docente" onclick="switchUserForm('docente')" style="flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; font-weight: 800; font-size: 0.9rem; color: var(--primary); border-bottom: 3px solid var(--primary); transition: 0.2s;">👨‍🏫 Staff</button>
            <button id="tab-form-estudiante" onclick="switchUserForm('estudiante')" style="flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; font-weight: 800; font-size: 0.9rem; color: #64748b; border-bottom: 3px solid transparent; transition: 0.2s;">🎓 Estudiante</button>
          </div>

          <h3 id="users-form-title" style="margin:0; font-size:1.2rem; color:#1e293b; font-weight: 800;">Crear Nuevo Docente</h3>
          <p id="users-form-desc" style="font-size: 0.8rem; color: #64748b; margin-top: -10px;">Administradores o docentes.</p>
          
          <input type="hidden" id="nu-id">
          <input type="hidden" id="nu-form-type" value="docente">
          
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Correo / Identificación</label>
            <input type="email" id="nu-email" placeholder="ejemplo@colegio.edu.co" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
          </div>
          
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nombre Completo</label>
            <input type="text" id="nu-nombre" placeholder="Nombres y Apellidos" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
          </div>
          
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Contraseña <span id="pass-hint" style="text-transform:none; font-weight:normal;">(requerido)</span></label>
            <input type="password" id="nu-pass" placeholder="***" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
          </div>
          
          <div id="row-rol-grado" style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div id="col-rol">
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nivel de Acceso</label>
                <select id="nu-rol" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
                  <option value="lector">Docente (Lector)</option>
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Super Administrador</option>
                </select>
              </div>
              <div id="col-grado" style="display: none;">
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Grado Asignado</label>
                <input type="text" id="nu-grado" placeholder="Ej: 11A" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="guardarUsuario()" id="btn-save-user" style="flex: 1; background:var(--primary); color:white; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 1rem; transition: background 0.2s;">CREAR</button>
            <button onclick="prepararNuevoUsuario()" style="background:#e2e8f0; color:#475569; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 1rem;">CANCELAR</button>
          </div>
          <div id="users-status" style="font-size: 0.85rem; font-weight: 700; text-align: center; margin-top: 10px; padding: 10px; border-radius: 8px; display: none;"></div>
        </div>`;

content = content.replace(oldHTMLRegex, newHTML);

// JS logic additions
const oldJSRegex = /window\.prepararNuevoUsuario = function\(\) \{[\s\S]*?async function guardarUsuario\(\) \{[\s\S]*?\}[\s\S]*?\s*async function importarUsuariosCSV\(\) \{/;

const newJS = `window.switchUserForm = function(type) {
        $('nu-form-type').value = type;
        const btnD = $('tab-form-docente');
        const btnE = $('tab-form-estudiante');
        const colRol = $('col-rol');
        const colGrado = $('col-grado');
        const title = $('users-form-title');
        const desc = $('users-form-desc');
        const id = $('nu-id').value;
        const accion = id ? 'Editar' : 'Crear Nuevo';

        if (type === 'estudiante') {
          btnE.style.color = 'var(--primary)';
          btnE.style.borderBottomColor = 'var(--primary)';
          btnD.style.color = '#64748b';
          btnD.style.borderBottomColor = 'transparent';
          colRol.style.display = 'none';
          colGrado.style.display = 'block';
          title.innerText = accion + ' Estudiante';
          desc.innerText = 'Asigna el grado al que pertenece.';
        } else {
          btnD.style.color = 'var(--primary)';
          btnD.style.borderBottomColor = 'var(--primary)';
          btnE.style.color = '#64748b';
          btnE.style.borderBottomColor = 'transparent';
          colRol.style.display = 'block';
          colGrado.style.display = 'none';
          title.innerText = accion + ' Docente/Staff';
          desc.innerText = 'Administradores o docentes.';
        }
      };

      window.prepararNuevoUsuario = function() {
        $('nu-id').value = '';
        $('nu-nombre').value = '';
        $('nu-email').value = '';
        $('nu-pass').value = '';
        $('nu-pass').placeholder = '***';
        $('pass-hint').innerText = '(requerido)';
        $('nu-rol').value = 'lector';
        $('nu-grado').value = '';
        $('btn-save-user').innerText = 'CREAR';
        $('btn-save-user').style.background = 'var(--primary)';
        $('users-status').style.display = 'none';
        switchUserForm($('nu-form-type').value);
      };

      window.editarUsuario = function(id) {
        const user = todosLosUsuarios.find(u => u.id === id);
        if(!user) return;
        $('nu-id').value = user.id;
        $('nu-nombre').value = user.nombre || '';
        $('nu-email').value = user.email || '';
        $('nu-pass').value = '';
        $('nu-pass').placeholder = 'Dejar vacío para no cambiar';
        $('pass-hint').innerText = '(Opcional)';
        $('nu-grado').value = user.grado_asignado || '';
        
        $('users-status').style.display = 'none';
        $('btn-save-user').innerText = 'ACTUALIZAR';
        $('btn-save-user').style.background = '#f59e0b';
        
        if (user.rol === 'estudiante') {
          switchUserForm('estudiante');
        } else {
          $('nu-rol').value = user.rol || 'lector';
          switchUserForm('docente');
        }
        $('users-form-title').innerText += ': ' + (user.nombre || '').split(' ')[0];
      };

      async function guardarUsuario() {
        const id = $('nu-id').value;
        const email = $('nu-email').value.trim();
        const nombre = $('nu-nombre').value.trim();
        const pass = $('nu-pass').value;
        const formType = $('nu-form-type').value;
        
        // Si es estudiante, forzamos el rol 'estudiante' y tomamos el grado. Si es docente, tomamos el rol del select y sin grado.
        const rol = (formType === 'estudiante') ? 'estudiante' : $('nu-rol').value;
        const gradoAsig = (formType === 'estudiante') ? $('nu-grado').value.trim() : '';
        const status = $('users-status');

        if (!email || !nombre) {
            status.innerText = '❌ El nombre y el email/ID son obligatorios.';
            status.style.display = 'block';
            status.style.background = '#fef2f2';
            status.style.color = '#ef4444';
            return;
        }

        try {
          status.innerText = '⏳ Guardando...';
          status.style.display = 'block';
          status.style.background = '#f8fafc';
          status.style.color = '#475569';
          
          if (!id) {
            if(!pass) {
                status.innerText = '❌ La contraseña es obligatoria para nuevos usuarios.';
                status.style.background = '#fef2f2';
                status.style.color = '#ef4444';
                return;
            }
            
            const { data, error } = await supabaseClient.auth.signUp({
              email, password: pass, options: { data: { nombre, name: nombre } }
            });
            if (error) {
              if (error.message.includes('already registered') || error.status === 422) {
                 throw new Error('El correo o ID ya está registrado en Auth. Usa uno diferente.');
              }
              throw error;
            }
            const userId = data.user.id;
            const { error: pErr } = await supabaseClient.from('perfiles')
              .upsert({ id: userId, email, nombre, rol, grado_asignado: gradoAsig }, { onConflict: 'id' });
            if (pErr) throw pErr;
            status.innerText = '✅ Usuario CREADO exitosamente.';
            status.style.background = '#ecfdf5';
            status.style.color = '#10b981';
          } else {
            const { error: pErr } = await supabaseClient.from('perfiles')
              .update({ email, nombre, rol, grado_asignado: gradoAsig })
              .eq('id', id);
            if (pErr) throw pErr;
            status.innerText = '✅ Usuario ACTUALIZADO exitosamente.';
            status.style.background = '#ecfdf5';
            status.style.color = '#10b981';
          }
          
          setTimeout(() => { prepararNuevoUsuario(); }, 1500);
          await cargarUsuarios();
          
        } catch(e) {
          status.innerText = '❌ Error: ' + e.message;
          status.style.background = '#fef2f2';
          status.style.color = '#ef4444';
        }
      }

      async function importarUsuariosCSV() {`;

content = content.replace(oldJSRegex, newJS);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Dos formularios implementados exitosamente.");

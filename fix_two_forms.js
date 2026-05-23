const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// HTML: Replace the entire usuarios-container
const oldHTMLRegex = /<div id="usuarios-container"[\s\S]*?<!-- Derecha: Formulario -->[\s\S]*?<div id="users-status".*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newHTML = `<div id="usuarios-container" style="display: none; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-height: 80vh;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
         <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">👥 Gestión de Usuarios Avanzada</h2>
         
         <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; gap: 5px;">
            <button id="tab-view-docente" onclick="switchUserView('docente')" style="padding: 10px 20px; border: none; background: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; color: var(--primary); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: 0.2s;">👨‍🏫 Personal (Docentes)</button>
            <button id="tab-view-estudiante" onclick="switchUserView('estudiante')" style="padding: 10px 20px; border: none; background: transparent; cursor: pointer; font-weight: 800; font-size: 0.9rem; color: #64748b; border-radius: 8px; transition: 0.2s;">🎓 Estudiantes</button>
         </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px;">
        <!-- Izquierda: Lista y Buscador -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <input type="text" id="users-search" placeholder="Buscar por nombre, email o ID..." onkeyup="filtrarUsuarios()" style="padding:12px 20px; border-radius:12px; border:2px solid #e2e8f0; font-size:0.95rem; width: 100%; max-width: 400px; box-sizing:border-box; background: #f8fafc;">
             <button onclick="prepararNuevoUsuario()" style="background:#10b981; color:white; border:none; padding:12px 20px; border-radius:12px; font-weight:700; cursor:pointer; font-size: 0.9rem; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">+ Crear Nuevo</button>
           </div>
           
           <div id="users-table-container" style="overflow-y: auto; max-height: 60vh; border: 1px solid #e2e8f0; border-radius: 12px; background: white;">
             <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
               <thead style="background: #f1f5f9; position: sticky; top: 0;" id="users-thead">
                 <!-- Thead dinámico -->
               </thead>
               <tbody id="users-tbody">
                 <tr><td colspan="5" style="padding: 20px; text-align: center;">Cargando usuarios...</td></tr>
               </tbody>
             </table>
           </div>
           <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #64748b; font-weight: 700;">
             <span id="users-count">0 registros</span>
             <button onclick="cargarUsuarios()" style="background: transparent; border: none; color: #4f46e5; cursor: pointer; font-weight: 800;">↻ Refrescar Lista</button>
           </div>
        </div>

        <!-- Derecha: Formulario -->
        <div style="display:flex; flex-direction:column; gap:15px; background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; height: fit-content;">
          
          <h3 id="users-form-title" style="margin:0; font-size:1.2rem; color:#1e293b; font-weight: 800;">Crear Nuevo Docente</h3>
          <p id="users-form-desc" style="font-size: 0.8rem; color: #64748b; margin-top: -10px;">Guardado en tabla 'perfiles'.</p>
          
          <input type="hidden" id="nu-id">
          <input type="hidden" id="nu-form-type" value="docente">
          
          <!-- FORMULARIO DOCENTE (Auth + Perfiles) -->
          <div id="form-docente-fields" style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Correo Electrónico</label>
                <input type="email" id="nu-email" placeholder="ejemplo@colegio.edu.co" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nombre Completo</label>
                <input type="text" id="nu-nombre-doc" placeholder="Nombres y Apellidos" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Contraseña <span id="pass-hint" style="text-transform:none; font-weight:normal;">(requerido)</span></label>
                <input type="password" id="nu-pass" placeholder="***" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nivel de Acceso</label>
                <select id="nu-rol" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
                  <option value="lector">Docente / Lector</option>
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Super Administrador</option>
                </select>
              </div>
          </div>

          <!-- FORMULARIO ESTUDIANTE (maestro_estudiantes) -->
          <div id="form-estudiante-fields" style="display: none; flex-direction: column; gap: 10px;">
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nombre Completo</label>
                <input type="text" id="nu-nombre-est" placeholder="Apellidos y Nombres" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Identificación (ID)</label>
                <input type="text" id="nu-identificacion" placeholder="Documento o ID" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Sede / Grado</label>
                    <input type="text" id="nu-sede" placeholder="Ej: 11A" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
                  </div>
                  <div>
                    <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">ZipGrade ID</label>
                    <input type="text" id="nu-zipgrade" placeholder="Opcional" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
                  </div>
              </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="guardarUsuario()" id="btn-save-user" style="flex: 1; background:var(--primary); color:white; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 1rem; transition: background 0.2s;">CREAR</button>
            <button onclick="prepararNuevoUsuario()" style="background:#e2e8f0; color:#475569; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 1rem;">LIMPIAR</button>
          </div>
          <div id="users-status" style="font-size: 0.85rem; font-weight: 700; text-align: center; margin-top: 10px; padding: 10px; border-radius: 8px; display: none;"></div>
        </div>
      </div>
    </div>`;

// JS: Replace the logic block for the Users Page
const oldJSRegex = /window\.switchUserForm = function\(\w+\) \{[\s\S]*?async function importarUsuariosCSV\(\) \{/;

const newJS = `let todosLosRegistros = [];
      let currentViewType = 'docente'; // 'docente' o 'estudiante'

      window.switchUserView = function(type) {
        currentViewType = type;
        $('nu-form-type').value = type;
        
        const btnD = $('tab-view-docente');
        const btnE = $('tab-view-estudiante');
        
        if (type === 'estudiante') {
          btnE.style.background = 'white';
          btnE.style.color = 'var(--primary)';
          btnE.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
          
          btnD.style.background = 'transparent';
          btnD.style.color = '#64748b';
          btnD.style.boxShadow = 'none';
          
          $('form-docente-fields').style.display = 'none';
          $('form-estudiante-fields').style.display = 'flex';
          $('users-thead').innerHTML = '<tr><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Sede</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Nombre</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Identificación</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">ZipGrade ID</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Acción</th></tr>';
        } else {
          btnD.style.background = 'white';
          btnD.style.color = 'var(--primary)';
          btnD.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
          
          btnE.style.background = 'transparent';
          btnE.style.color = '#64748b';
          btnE.style.boxShadow = 'none';
          
          $('form-docente-fields').style.display = 'flex';
          $('form-estudiante-fields').style.display = 'none';
          $('users-thead').innerHTML = '<tr><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Nombre</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Email</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Rol</th><th style="padding: 15px; border-bottom: 2px solid #e2e8f0;">Acción</th></tr>';
        }
        
        prepararNuevoUsuario();
        cargarUsuarios();
      };

      async function cargarUsuarios() {
        const tbody = $('users-tbody');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 15px; text-align: center;">Cargando...</td></tr>';
        
        try {
          if (currentViewType === 'docente') {
            const { data, error } = await supabaseClient.from('perfiles').select('id, email, nombre, rol').order('nombre', { ascending: true });
            if(error) throw error;
            todosLosRegistros = data || [];
          } else {
            const { data, error } = await supabaseClient.from('maestro_estudiantes').select('*').order('sede', { ascending: true }).order('nombre', { ascending: true });
            if(error) throw error;
            todosLosRegistros = data || [];
          }
          
          $('users-search').value = '';
          renderUsuariosTabla(todosLosRegistros);
        } catch(e) {
          tbody.innerHTML = '<tr><td colspan="5" style="padding: 15px; text-align: center; color: red;">Error: ' + e.message + '</td></tr>';
        }
      }

      function renderUsuariosTabla(lista) {
        const tbody = $('users-tbody');
        if(!tbody) return;
        $('users-count').innerText = lista.length + ' registros';
        if(lista.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="padding: 15px; text-align: center;">No hay registros.</td></tr>';
          return;
        }
        
        if (currentViewType === 'docente') {
            tbody.innerHTML = lista.map(u => {
            return '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background=\\'#f8fafc\\'" onmouseout="this.style.background=\\'transparent\\'">\\
                <td style="padding: 15px; font-weight: 600;">' + (u.nombre || '-') + '</td>\\
                <td style="padding: 15px; color: #64748b;">' + (u.email || '-') + '</td>\\
                <td style="padding: 15px;">\\
                <span style="background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">' + (u.rol || '-') + '</span>\\
                </td>\\
                <td style="padding: 15px;">\\
                <button onclick="editarUsuario(\\'' + u.id + '\\')" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 4px rgba(59,130,246,0.2);">✏️ Editar</button>\\
                </td>\\
            </tr>';
            }).join('');
        } else {
            tbody.innerHTML = lista.map(u => {
            return '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background=\\'#f8fafc\\'" onmouseout="this.style.background=\\'transparent\\'">\\
                <td style="padding: 15px; font-weight: 700; color: #334155;">' + (u.sede || '-') + '</td>\\
                <td style="padding: 15px; font-weight: 600;">' + (u.nombre || '-') + '</td>\\
                <td style="padding: 15px; color: #64748b;">' + (u.identificacion || '-') + '</td>\\
                <td style="padding: 15px; color: #64748b;">' + (u.zipgrade_id || '-') + '</td>\\
                <td style="padding: 15px;">\\
                <button onclick="editarUsuario(\\'' + u.identificacion + '\\')" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 4px rgba(59,130,246,0.2);">✏️ Editar</button>\\
                </td>\\
            </tr>';
            }).join('');
        }
      }

      window.filtrarUsuarios = function() {
        const q = $('users-search').value.toLowerCase();
        const filtrados = todosLosRegistros.filter(u => {
            if (currentViewType === 'docente') {
                return (u.nombre || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
            } else {
                return (u.nombre || '').toLowerCase().includes(q) || (u.identificacion || '').toLowerCase().includes(q) || (u.sede || '').toLowerCase().includes(q);
            }
        });
        renderUsuariosTabla(filtrados);
      };

      window.prepararNuevoUsuario = function() {
        $('nu-id').value = '';
        if (currentViewType === 'docente') {
            $('nu-nombre-doc').value = '';
            $('nu-email').value = '';
            $('nu-pass').value = '';
            $('nu-pass').placeholder = '***';
            $('pass-hint').innerText = '(requerido)';
            $('nu-rol').value = 'lector';
            $('users-form-title').innerText = 'Crear Nuevo Docente/Staff';
            $('users-form-desc').innerText = 'Guardado en tabla \\'perfiles\\'.';
        } else {
            $('nu-nombre-est').value = '';
            $('nu-identificacion').value = '';
            $('nu-sede').value = '';
            $('nu-zipgrade').value = '';
            $('nu-identificacion').readOnly = false;
            $('nu-identificacion').style.background = 'white';
            $('users-form-title').innerText = 'Crear Nuevo Estudiante';
            $('users-form-desc').innerText = 'Guardado en \\'maestro_estudiantes\\'.';
        }
        
        $('btn-save-user').innerText = 'CREAR';
        $('btn-save-user').style.background = 'var(--primary)';
        $('users-status').style.display = 'none';
      };

      window.editarUsuario = function(id) {
        let user;
        if (currentViewType === 'docente') {
            user = todosLosRegistros.find(u => u.id === id);
            if(!user) return;
            $('nu-id').value = user.id;
            $('nu-nombre-doc').value = user.nombre || '';
            $('nu-email').value = user.email || '';
            $('nu-pass').value = '';
            $('nu-pass').placeholder = 'Dejar vacío para no cambiar';
            $('pass-hint').innerText = '(Opcional)';
            $('nu-rol').value = user.rol || 'lector';
            $('users-form-title').innerText = 'Editar Docente: ' + (user.nombre || '').split(' ')[0];
        } else {
            user = todosLosRegistros.find(u => u.identificacion === id);
            if(!user) return;
            $('nu-id').value = user.identificacion; // usamos nu-id para saber si editamos
            $('nu-nombre-est').value = user.nombre || '';
            $('nu-identificacion').value = user.identificacion || '';
            $('nu-identificacion').readOnly = true; // No permitir cambiar ID en edicion
            $('nu-identificacion').style.background = '#f1f5f9';
            $('nu-sede').value = user.sede || '';
            $('nu-zipgrade').value = user.zipgrade_id || '';
            $('users-form-title').innerText = 'Editar Estudiante: ' + (user.nombre || '').split(' ')[0];
        }
        
        $('users-status').style.display = 'none';
        $('btn-save-user').innerText = 'ACTUALIZAR';
        $('btn-save-user').style.background = '#f59e0b';
      };

      async function guardarUsuario() {
        const isEdit = $('nu-id').value !== '';
        const status = $('users-status');

        try {
          status.innerText = '⏳ Guardando...';
          status.style.display = 'block';
          status.style.background = '#f8fafc';
          status.style.color = '#475569';

          if (currentViewType === 'docente') {
              const id = $('nu-id').value;
              const email = $('nu-email').value.trim();
              const nombre = $('nu-nombre-doc').value.trim();
              const pass = $('nu-pass').value;
              const rol = $('nu-rol').value;

              if (!email || !nombre) throw new Error('El nombre y el email son obligatorios.');

              if (!isEdit) {
                  if(!pass) throw new Error('La contraseña es obligatoria para nuevos usuarios.');
                  const { data, error } = await supabaseClient.auth.signUp({
                      email, password: pass, options: { data: { nombre, name: nombre } }
                  });
                  if (error) {
                      if (error.message.includes('already registered') || error.status === 422) {
                          throw new Error('El correo ya está registrado en Auth.');
                      }
                      throw error;
                  }
                  const userId = data.user.id;
                  const { error: pErr } = await supabaseClient.from('perfiles')
                      .insert({ id: userId, email, nombre, rol });
                  if (pErr) throw pErr;
              } else {
                  const { error: pErr } = await supabaseClient.from('perfiles')
                      .update({ email, nombre, rol })
                      .eq('id', id);
                  if (pErr) throw pErr;
              }
          } else {
              // GUARDAR ESTUDIANTE
              const identificacion = $('nu-identificacion').value.trim();
              const nombre = $('nu-nombre-est').value.trim();
              const sede = $('nu-sede').value.trim();
              const zipgrade = $('nu-zipgrade').value.trim();

              if (!identificacion || !nombre || !sede) throw new Error('Nombre, Identificación y Sede son obligatorios.');

              if (!isEdit) {
                  const { error } = await supabaseClient.from('maestro_estudiantes')
                      .insert({ identificacion, nombre, sede, zipgrade_id: zipgrade });
                  if (error) {
                      if (error.code === '23505') throw new Error('La identificación ya existe en la base de datos.');
                      throw error;
                  }
              } else {
                  // Actualizar estudiante (buscando por su identificacion original)
                  const originalId = $('nu-id').value;
                  const { error } = await supabaseClient.from('maestro_estudiantes')
                      .update({ nombre, sede, zipgrade_id: zipgrade })
                      .eq('identificacion', originalId);
                  if (error) throw error;
              }
          }

          status.innerText = isEdit ? '✅ ACTUALIZADO exitosamente.' : '✅ CREADO exitosamente.';
          status.style.background = '#ecfdf5';
          status.style.color = '#10b981';
          
          setTimeout(() => { prepararNuevoUsuario(); }, 1500);
          await cargarUsuarios();
          
        } catch(e) {
          status.innerText = '❌ Error: ' + e.message;
          status.style.background = '#fef2f2';
          status.style.color = '#ef4444';
        }
      }

      async function importarUsuariosCSV() {`;

content = content.replace(oldHTMLRegex, newHTML);
content = content.replace(oldJSRegex, newJS);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Separación perfecta de formularios implementada.");

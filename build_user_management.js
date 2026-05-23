const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// HTML Replacement
const oldHTMLRegex = /<!-- CARD 3: USUARIOS -->[\s\S]*?<\/div>\s*<\/div>\s*<!-- CARD 4: BASE DE DATOS ESTUDIANTES -->/;

const newHTML = `<!-- CARD 3: USUARIOS (AVANZADO) -->
        <div class="admin-card" style="grid-column: 1 / -1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
             <h5>👥 Gestión de Usuarios Avanzada</h5>
             <button onclick="prepararNuevoUsuario()" style="background:#10b981; color:white; border:none; padding:8px 12px; border-radius:8px; font-weight:700; cursor:pointer; font-size: 0.8rem;">+ Nuevo Usuario</button>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
            <!-- Izquierda: Lista y Buscador -->
            <div style="display: flex; flex-direction: column; gap: 10px; border-right: 1px solid #e2e8f0; padding-right: 20px;">
               <input type="text" id="users-search" placeholder="Buscar por nombre o email..." onkeyup="filtrarUsuarios()" style="padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem; width: 100%; box-sizing:border-box;">
               <div id="users-table-container" style="overflow-y: auto; height: 350px; border: 1px solid #e2e8f0; border-radius: 8px;">
                 <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                   <thead style="background: #f8fafc; position: sticky; top: 0;">
                     <tr>
                       <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Nombre</th>
                       <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Email</th>
                       <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Rol</th>
                       <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Grado</th>
                       <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Acción</th>
                     </tr>
                   </thead>
                   <tbody id="users-tbody">
                     <tr><td colspan="5" style="padding: 15px; text-align: center;">Cargando usuarios...</td></tr>
                   </tbody>
                 </table>
               </div>
               <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b;">
                 <span id="users-count">0 usuarios</span>
                 <button onclick="cargarUsuarios()" style="background: transparent; border: none; color: #4f46e5; cursor: pointer; font-weight: 700;">↻ Refrescar</button>
               </div>
            </div>

            <!-- Derecha: Formulario -->
            <div style="display:flex; flex-direction:column; gap:10px;">
              <h6 id="users-form-title" style="margin:0; font-size:0.9rem; color:#1e293b;">Crear Nuevo Usuario</h6>
              <input type="hidden" id="nu-id">
              <input type="email" id="nu-email" placeholder="Email" style="padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem;">
              <input type="text" id="nu-nombre" placeholder="Nombre completo" style="padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem;">
              <input type="password" id="nu-pass" placeholder="Password (requerido)" style="padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem;">
              <select id="nu-rol" style="padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem;">
                <option value="lector">Lector</option>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <input type="text" id="nu-grado" placeholder="Grado asignado (Ej: 11A)" style="padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem;">
              
              <div style="display: flex; gap: 10px; margin-top: 5px;">
                <button onclick="guardarUsuario()" id="btn-save-user" style="flex: 1; background:var(--primary); color:white; border:none; padding:12px; border-radius:8px; font-weight:700; cursor:pointer;">CREAR</button>
                <button onclick="prepararNuevoUsuario()" style="background:#e2e8f0; color:#475569; border:none; padding:12px; border-radius:8px; font-weight:700; cursor:pointer;">CANCELAR</button>
              </div>
              <div id="users-status" style="font-size: 0.75rem; font-weight: 700; text-align: center; margin-top: 5px;"></div>
            </div>
          </div>
        </div>
        <!-- CARD 4: BASE DE DATOS ESTUDIANTES -->`;

// JS Replacement
const oldJSRegex = /async function crearUsuario\(\) \{[\s\S]*?\}\s*async function importarUsuariosCSV\(\) \{/;

const newJS = `let todosLosUsuarios = [];

      async function cargarUsuarios() {
        const tbody = $('users-tbody');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 15px; text-align: center;">Cargando...</td></tr>';
        try {
          const { data, error } = await supabaseClient.from('perfiles').select('*').order('nombre', { ascending: true });
          if(error) throw error;
          todosLosUsuarios = data || [];
          renderUsuariosTabla(todosLosUsuarios);
        } catch(e) {
          tbody.innerHTML = '<tr><td colspan="5" style="padding: 15px; text-align: center; color: red;">Error: ' + e.message + '</td></tr>';
        }
      }

      function renderUsuariosTabla(lista) {
        const tbody = $('users-tbody');
        if(!tbody) return;
        $('users-count').innerText = lista.length + ' usuarios';
        if(lista.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="padding: 15px; text-align: center;">No hay usuarios.</td></tr>';
          return;
        }
        
        tbody.innerHTML = lista.map(u => {
          return '<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background=\\'#f8fafc\\'" onmouseout="this.style.background=\\'transparent\\'">\\
            <td style="padding: 10px;">' + (u.nombre || '-') + '</td>\\
            <td style="padding: 10px; color: #64748b;">' + (u.email || '-') + '</td>\\
            <td style="padding: 10px;">\\
              <span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">' + (u.rol || '-') + '</span>\\
            </td>\\
            <td style="padding: 10px; font-weight: 600;">' + (u.grado_asignado || '-') + '</td>\\
            <td style="padding: 10px;">\\
              <button onclick="editarUsuario(\\'' + u.id + '\\')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.7rem; font-weight: bold;">✏️ Editar</button>\\
            </td>\\
          </tr>';
        }).join('');
      }

      window.filtrarUsuarios = function() {
        const q = $('users-search').value.toLowerCase();
        const filtrados = todosLosUsuarios.filter(u => 
          (u.nombre || '').toLowerCase().includes(q) || 
          (u.email || '').toLowerCase().includes(q)
        );
        renderUsuariosTabla(filtrados);
      };

      window.prepararNuevoUsuario = function() {
        $('nu-id').value = '';
        $('nu-nombre').value = '';
        $('nu-email').value = '';
        $('nu-pass').value = '';
        $('nu-pass').placeholder = 'Password (requerido)';
        $('nu-rol').value = 'lector';
        $('nu-grado').value = '';
        $('users-form-title').innerText = 'Crear Nuevo Usuario';
        $('btn-save-user').innerText = 'CREAR';
        $('btn-save-user').style.background = 'var(--primary)';
        $('users-status').innerText = '';
      };

      window.editarUsuario = function(id) {
        const user = todosLosUsuarios.find(u => u.id === id);
        if(!user) return;
        $('nu-id').value = user.id;
        $('nu-nombre').value = user.nombre || '';
        $('nu-email').value = user.email || '';
        $('nu-pass').value = '';
        $('nu-pass').placeholder = 'Dejar vacío para no cambiar';
        $('nu-rol').value = user.rol || 'lector';
        $('nu-grado').value = user.grado_asignado || '';
        $('users-form-title').innerText = 'Editar Usuario';
        $('btn-save-user').innerText = 'ACTUALIZAR';
        $('btn-save-user').style.background = '#f59e0b';
        $('users-status').innerText = '';
      };

      async function guardarUsuario() {
        const id = $('nu-id').value;
        const email = $('nu-email').value.trim();
        const nombre = $('nu-nombre').value.trim();
        const pass = $('nu-pass').value;
        const rol = $('nu-rol').value;
        const gradoAsig = $('nu-grado').value.trim();
        const status = $('users-status');

        if (!email || !nombre) return alert('El nombre y el email son obligatorios.');

        try {
          status.innerText = '⏳ Guardando...';
          status.style.color = '#475569';
          
          if (!id) {
            if(!pass) return alert('La contraseña es obligatoria para nuevos usuarios.');
            
            const { data, error } = await supabaseClient.auth.signUp({
              email, password: pass, options: { data: { nombre, name: nombre } }
            });
            if (error) {
              if (error.message.includes('already registered') || error.status === 422) {
                 throw new Error('El correo ya está registrado en Auth. Usa una cuenta diferente.');
              }
              throw error;
            }
            const userId = data.user.id;
            const { error: pErr } = await supabaseClient.from('perfiles')
              .upsert({ id: userId, email, nombre, rol, grado_asignado: gradoAsig }, { onConflict: 'id' });
            if (pErr) throw pErr;
            status.innerText = '✅ Usuario CREADO exitosamente.';
            status.style.color = '#10b981';
          } else {
            const { error: pErr } = await supabaseClient.from('perfiles')
              .update({ email, nombre, rol, grado_asignado: gradoAsig })
              .eq('id', id);
            if (pErr) throw pErr;
            status.innerText = '✅ Usuario ACTUALIZADO exitosamente.';
            status.style.color = '#10b981';
          }
          
          prepararNuevoUsuario();
          await cargarUsuarios();
          
        } catch(e) {
          status.innerText = '❌ Error: ' + e.message;
          status.style.color = '#ef4444';
        }
      }

      async function importarUsuariosCSV() {`;

// Insert cargarUsuarios() in toggleAdmin()
content = content.replace(
  /function toggleAdmin\(\) \{[\s\S]*?if \(isOpening\) \{/,
  "function toggleAdmin() {\n        const modal = $('admin-modal');\n        const isOpening = modal.style.display !== 'flex';\n        modal.style.display = isOpening ? 'flex' : 'none';\n        if (isOpening) {\n          cargarUsuarios();"
);

content = content.replace(oldHTMLRegex, newHTML);
content = content.replace(oldJSRegex, newJS);

fs.writeFileSync(filePath, content, 'utf8');
console.log("User Management Panel build successful.");

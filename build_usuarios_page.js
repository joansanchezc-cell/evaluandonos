const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Añadir el botón en el menú lateral
const oldAdminBtnRegex = /<button onclick="toggleAdmin\(\)" class="admin-trigger"/;
const newSidebarBtn = `<button id="tab-usuarios-item" onclick="switchMainTab('usuarios'); cargarUsuarios();" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: #cbd5e1; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px;">
          👥 USUARIOS
        </button>
        <button onclick="toggleAdmin()" class="admin-trigger"`;
if (!content.includes('id="tab-usuarios-item"')) {
    content = content.replace(oldAdminBtnRegex, newSidebarBtn);
}

// 2. Añadir el HTML de la vista Usuarios dentro de scrollable-views
const oldResultadoContainerRegex = /<div id="resultado-container" style="display: none;">/;
const newUsuariosContainer = `<div id="usuarios-container" style="display: none; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-height: 80vh;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
         <h2 style="font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0;">👥 Gestión de Usuarios Avanzada</h2>
         <button onclick="prepararNuevoUsuario()" style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:12px; font-weight:700; cursor:pointer; font-size: 0.9rem; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">+ Nuevo Usuario</button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px;">
        <!-- Izquierda: Lista y Buscador -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
           <input type="text" id="users-search" placeholder="Buscar por nombre o email..." onkeyup="filtrarUsuarios()" style="padding:12px 20px; border-radius:12px; border:2px solid #e2e8f0; font-size:0.95rem; width: 100%; box-sizing:border-box; background: #f8fafc;">
           <div id="users-table-container" style="overflow-y: auto; max-height: 60vh; border: 1px solid #e2e8f0; border-radius: 12px; background: white;">
             <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
               <thead style="background: #f1f5f9; position: sticky; top: 0;">
                 <tr>
                   <th style="padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Nombre</th>
                   <th style="padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Email</th>
                   <th style="padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Rol</th>
                   <th style="padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Grado</th>
                   <th style="padding: 15px; border-bottom: 2px solid #e2e8f0; color: #475569;">Acción</th>
                 </tr>
               </thead>
               <tbody id="users-tbody">
                 <tr><td colspan="5" style="padding: 20px; text-align: center;">Cargando usuarios...</td></tr>
               </tbody>
             </table>
           </div>
           <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #64748b; font-weight: 700;">
             <span id="users-count">0 usuarios</span>
             <button onclick="cargarUsuarios()" style="background: transparent; border: none; color: #4f46e5; cursor: pointer; font-weight: 800;">↻ Refrescar Lista</button>
           </div>
        </div>

        <!-- Derecha: Formulario -->
        <div style="display:flex; flex-direction:column; gap:15px; background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; height: fit-content;">
          <h3 id="users-form-title" style="margin:0; font-size:1.2rem; color:#1e293b; font-weight: 800;">Crear Nuevo Usuario</h3>
          <p style="font-size: 0.8rem; color: #64748b; margin-top: -10px;">Completa los datos para registrar o actualizar un perfil.</p>
          
          <input type="hidden" id="nu-id">
          
          <div>
            <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Correo Electrónico</label>
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
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Rol</label>
                <select id="nu-rol" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="lector">Lector</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Grado (opcional)</label>
                <input type="text" id="nu-grado" placeholder="Ej: 11A" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.95rem; margin-top: 4px; box-sizing:border-box;">
              </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="guardarUsuario()" id="btn-save-user" style="flex: 1; background:var(--primary); color:white; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 1rem; transition: background 0.2s;">CREAR</button>
            <button onclick="prepararNuevoUsuario()" style="background:#e2e8f0; color:#475569; border:none; padding:15px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 1rem;">CANCELAR</button>
          </div>
          <div id="users-status" style="font-size: 0.85rem; font-weight: 700; text-align: center; margin-top: 10px; padding: 10px; border-radius: 8px; display: none;"></div>
        </div>
      </div>
    </div>\n    <div id="resultado-container" style="display: none;">`;
if (!content.includes('id="usuarios-container"')) {
    content = content.replace(oldResultadoContainerRegex, newUsuariosContainer);
}

// 3. Modificar tabMap y containerIds en switchMainTab
content = content.replace(
  /const containerIds = \['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main'\];/,
  "const containerIds = ['resultado-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container', 'estudiante-detalle-container', 'section-main', 'usuarios-container'];"
);

content = content.replace(
  /'asignatura': \['asignatura-container'\]/,
  "'asignatura': ['asignatura-container'],\n            'usuarios': ['usuarios-container']"
);

// 4. Modificar el bloque JS de crearUsuario
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
            <td style="padding: 15px;">' + (u.nombre || '-') + '</td>\\
            <td style="padding: 15px; color: #64748b;">' + (u.email || '-') + '</td>\\
            <td style="padding: 15px;">\\
              <span style="background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">' + (u.rol || '-') + '</span>\\
            </td>\\
            <td style="padding: 15px; font-weight: 700; color: #334155;">' + (u.grado_asignado || '-') + '</td>\\
            <td style="padding: 15px;">\\
              <button onclick="editarUsuario(\\'' + u.id + '\\')" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 4px rgba(59,130,246,0.2);">✏️ Editar</button>\\
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
        $('nu-pass').placeholder = '***';
        $('pass-hint').innerText = '(requerido)';
        $('nu-rol').value = 'estudiante';
        $('nu-grado').value = '';
        $('users-form-title').innerText = 'Crear Nuevo Usuario';
        $('btn-save-user').innerText = 'CREAR';
        $('btn-save-user').style.background = 'var(--primary)';
        $('users-status').style.display = 'none';
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
        $('nu-rol').value = user.rol || 'estudiante';
        $('nu-grado').value = user.grado_asignado || '';
        $('users-form-title').innerText = 'Editar Usuario: ' + (user.nombre || '').split(' ')[0];
        $('btn-save-user').innerText = 'ACTUALIZAR';
        $('btn-save-user').style.background = '#f59e0b';
        $('users-status').style.display = 'none';
      };

      async function guardarUsuario() {
        const id = $('nu-id').value;
        const email = $('nu-email').value.trim();
        const nombre = $('nu-nombre').value.trim();
        const pass = $('nu-pass').value;
        const rol = $('nu-rol').value;
        const gradoAsig = $('nu-grado').value.trim();
        const status = $('users-status');

        if (!email || !nombre) {
            status.innerText = '❌ El nombre y el email son obligatorios.';
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
                 throw new Error('El correo ya está registrado en Auth. Usa una cuenta diferente.');
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
if (oldJSRegex.test(content)) {
    content = content.replace(oldJSRegex, newJS);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Página de usuarios inyectada exitosamente.");

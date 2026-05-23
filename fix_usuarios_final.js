const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// ============================================================
// 1. REEMPLAZAR el formulario del lado derecho del usuarios-container
//    para que tenga dos paneles separados: Docente y Estudiante
// ============================================================

const oldRightPanel = `        <!-- Derecha: Formulario -->
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
        </div>
      </div>
    </div>`;

const newRightPanel = `        <!-- Derecha: Formulario con dos pestañas reales -->
        <div style="display:flex; flex-direction:column; gap:15px; background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; height: fit-content;">
          
          <!-- Selector de tipo de formulario -->
          <div style="display: flex; background: #e2e8f0; padding: 4px; border-radius: 12px; gap: 4px;">
            <button id="tab-view-docente" onclick="switchUserView('docente')" style="flex:1; padding: 10px; border: none; background: white; cursor: pointer; font-weight: 800; font-size: 0.85rem; color: #4f46e5; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: 0.2s;">👨‍🏫 Docentes/Staff</button>
            <button id="tab-view-estudiante" onclick="switchUserView('estudiante')" style="flex:1; padding: 10px; border: none; background: transparent; cursor: pointer; font-weight: 800; font-size: 0.85rem; color: #64748b; border-radius: 8px; transition: 0.2s;">🎓 Estudiantes</button>
          </div>

          <h3 id="users-form-title" style="margin:0; font-size:1.1rem; color:#1e293b; font-weight: 800;">Nuevo Docente / Staff</h3>
          <p id="users-form-desc" style="font-size: 0.75rem; color: #64748b; margin-top: -10px;">Guardado en tabla 'perfiles'.</p>
          
          <input type="hidden" id="nu-id">
          <input type="hidden" id="nu-form-type" value="docente">

          <!-- === CAMPOS DOCENTE (tabla: perfiles) === -->
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
          </div>

          <!-- === CAMPOS ESTUDIANTE (tabla: maestro_estudiantes) === -->
          <div id="form-estudiante-fields" style="display: none; flex-direction: column; gap: 10px;">
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Nombre Completo *</label>
              <input type="text" id="nu-nombre-est" placeholder="Apellidos y Nombres" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Identificación *</label>
              <input type="text" id="nu-identificacion" placeholder="Número de documento" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Sede / Grado *</label>
                <input type="text" id="nu-sede" placeholder="Ej: 11A" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">ZipGrade ID</label>
                <input type="text" id="nu-zipgrade" placeholder="Opcional" style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.9rem; margin-top: 3px; box-sizing:border-box;">
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button onclick="guardarUsuario()" id="btn-save-user" style="flex: 1; background:#4f46e5; color:white; border:none; padding:13px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 0.95rem;">CREAR</button>
            <button onclick="prepararNuevoUsuario()" style="background:#e2e8f0; color:#475569; border:none; padding:13px; border-radius:12px; font-weight:800; cursor:pointer; font-size: 0.95rem;">LIMPIAR</button>
          </div>
          <div id="users-status" style="font-size: 0.85rem; font-weight: 700; text-align: center; margin-top: 5px; padding: 10px; border-radius: 8px; display: none;"></div>
        </div>
      </div>
    </div>`;

if (content.includes(oldRightPanel)) {
  content = content.replace(oldRightPanel, newRightPanel);
  console.log('✅ Formulario usuarios reemplazado correctamente');
} else {
  console.log('❌ No se encontró el panel derecho exacto. Verificando alternativa...');
  // Probar con normalize
  const norm = content.replace(/\r\n/g, '\n');
  const oldNorm = oldRightPanel.replace(/\r\n/g, '\n');
  if (norm.includes(oldNorm)) {
    const newNorm = newRightPanel.replace(/\r\n/g, '\n');
    content = norm.replace(oldNorm, newNorm).replace(/\n/g, '\r\n');
    console.log('✅ Formulario usuarios reemplazado (normalizado)');
  } else {
    console.log('❌ No se encontró ni normalizado. Revisar manualmente.');
  }
}

// ============================================================
// 2. AGREGAR / REEMPLAZAR la lógica JS de usuarios
//    Buscamos la función cargarUsuarios y la reemplazamos
// ============================================================

const OLD_CARGAR_USUARIOS = `async function cargarUsuarios() {`;

const SEARCH_END = `window.switchUserForm = function(type)`;

const startIdx = content.indexOf(OLD_CARGAR_USUARIOS);
const endIdx = content.indexOf(SEARCH_END);

if (startIdx > -1 && endIdx > -1) {
  const before = content.substring(0, startIdx);
  const after = content.substring(endIdx);
  
  const newJS = `// ===== GESTIÓN DE USUARIOS (2 tablas: perfiles + maestro_estudiantes) =====
      let todosLosRegistros = [];
      let currentUserView = 'docente';

      window.switchUserView = function(type) {
        currentUserView = type;
        document.getElementById('nu-form-type').value = type;

        const btnD = document.getElementById('tab-view-docente');
        const btnE = document.getElementById('tab-view-estudiante');
        const fdoc = document.getElementById('form-docente-fields');
        const fest = document.getElementById('form-estudiante-fields');
        const thead = document.getElementById('users-thead');

        if (type === 'estudiante') {
          btnE.style.background = 'white'; btnE.style.color = '#4f46e5'; btnE.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
          btnD.style.background = 'transparent'; btnD.style.color = '#64748b'; btnD.style.boxShadow = 'none';
          fdoc.style.display = 'none'; fest.style.display = 'flex';
          document.getElementById('users-form-title').innerText = 'Nuevo Estudiante';
          document.getElementById('users-form-desc').innerText = "Guardado en 'maestro_estudiantes'.";
          if (thead) thead.innerHTML = '<tr><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Sede/Grado</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Nombre</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Identificación</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">ZipGrade ID</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Acción</th></tr>';
        } else {
          btnD.style.background = 'white'; btnD.style.color = '#4f46e5'; btnD.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
          btnE.style.background = 'transparent'; btnE.style.color = '#64748b'; btnE.style.boxShadow = 'none';
          fdoc.style.display = 'flex'; fest.style.display = 'none';
          document.getElementById('users-form-title').innerText = 'Nuevo Docente / Staff';
          document.getElementById('users-form-desc').innerText = "Guardado en 'perfiles'.";
          if (thead) thead.innerHTML = '<tr><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Nombre</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Email</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Rol</th><th style="padding:12px;border-bottom:2px solid #e2e8f0;color:#475569;">Acción</th></tr>';
        }

        prepararNuevoUsuario();
        cargarUsuarios();
      };

      async function cargarUsuarios() {`;

  content = before + newJS + after;
  console.log('✅ Lógica JS de usuarios reemplazada');
} else {
  console.log('❌ No se encontró cargarUsuarios o switchUserForm para reemplazar');
  console.log('cargarUsuarios idx:', startIdx, '| switchUserForm idx:', endIdx);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ Done! Archivo guardado.');

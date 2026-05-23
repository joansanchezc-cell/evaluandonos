const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// The new HTML block for the admin view
const newAdminHTML = `
  <!-- VISTA ADMINISTRADOR A PANTALLA COMPLETA -->
  <div id="admin-view" style="display:none; position:fixed; top:0; left:0; width:100%; height:100vh; background:#f8fafc; z-index:9999; overflow-y:auto;">
    
    <!-- Navbar del Admin -->
    <div style="background:#1e293b; color:white; padding:15px 30px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:10;">
      <h2 style="margin:0; font-weight:900; font-size:1.5rem; display:flex; align-items:center; gap:10px;">
        ⚙️ Panel Administrativo Central
      </h2>
      <div style="display:flex; gap:15px;">
        <button onclick="generarBackupJSON()" style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.9rem; display:flex; align-items:center; gap:8px;">
          💾 Descargar Backup
        </button>
        <button onclick="cerrarAdminView()" style="background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.9rem;">
          ❌ CERRAR ADMIN
        </button>
      </div>
    </div>

    <!-- Contenido del Admin -->
    <div style="padding:30px; max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(350px, 1fr)); gap:20px;">
      
      <!-- Carga Masiva (Consolidada) -->
      <div class="admin-card" style="background:white; padding:25px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
        <h3 style="margin:0 0 15px 0; color:#334155; display:flex; align-items:center; gap:8px;">📥 Carga Masiva de Datos</h3>
        <p style="font-size:0.8rem; color:#64748b; margin-bottom:15px;">Sube archivos TSV/CSV seleccionando su destino.</p>
        
        <label style="font-size:0.8rem; font-weight:bold; color:#475569; display:block; margin-bottom:5px;">Tipo de Archivo a Subir:</label>
        <select id="upload-type-select" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; margin-bottom:15px; font-size:0.9rem;">
          <option value="auto">🤖 Detección Automática</option>
          <option value="consolidado">📋 Resultados / Notas (TSV Consolidado)</option>
          <option value="estudiantes">👥 Estudiantes Oficiales (Base de Datos)</option>
          <option value="completos">📝 Reportes FULL (Quizizz)</option>
        </select>
        
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; color:#ef4444; font-weight:700; font-size:0.8rem; margin-bottom:15px; background:#fef2f2; padding:10px; border-radius:8px;">
          <input type="checkbox" id="auto-reset-all"> 🔥 Limpiar datos de este tipo antes de cargar
        </label>
        
        <input type="file" id="csv-file" accept=".csv,.tsv" multiple style="width:100%; padding:10px; border:1px dashed #cbd5e1; border-radius:10px; margin-bottom:15px; background:#f8fafc;">
        
        <button onclick="previsualizarDatos()" style="background:#4f46e5; color:white; border:none; padding:12px; border-radius:10px; font-weight:800; cursor:pointer; width:100%; margin-bottom:10px;">
          🔍 Analizar Archivo
        </button>

        <div id="admin-debug" style="display:none; background:#f1f5f9; padding:15px; border-radius:10px; font-size:0.75rem; margin-top:10px;">
          <div style="max-height:200px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:10px; background:white;">
            <table id="debug-table" style="width:100%; border-collapse:collapse;"></table>
          </div>
          <button id="btn-confirm-upload" onclick="finalizarSubida()" style="width:100%; background:#10b981; color:white; border:none; padding:12px; border-radius:10px; font-weight:800; cursor:pointer;">
            ✅ CONFIRMAR Y SUBIR
          </button>
        </div>
        <div id="admin-status" style="margin-top:10px; font-size:0.8rem; color:#64748b; font-weight:bold;"></div>
      </div>

      <!-- Gestor de Imágenes -->
      <div class="admin-card" style="background:white; padding:25px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
        <h3 style="margin:0 0 15px 0; color:#334155; display:flex; align-items:center; gap:8px;">🖼️ Gestor de Imágenes (Assets)</h3>
        <p style="font-size:0.8rem; color:#64748b; margin-bottom:15px;">Sube imágenes directamente al servidor para las preguntas u opciones.</p>
        
        <div style="background:#f1f5f9; padding:12px; border-radius:10px; margin-bottom:15px; font-size:0.75rem; color:#475569;">
          <b>Nomenclatura requerida:</b><br>
          Preguntas: <code>[Num][Mat][Grado].png</code> (Ej: 15M9.png)<br>
          Opciones: <code>[Num][Mat][Grado][A/B/C/D].png</code> (Ej: 15M9A.png)
        </div>

        <div style="display:flex; gap:10px; margin-bottom:15px;">
          <select id="aimg-grado" onchange="cargarAsignaturasAdminImg()" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <option value="">Grado...</option>
          </select>
          <select id="aimg-periodo" onchange="cargarAsignaturasAdminImg()" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <option value="1">E1</option><option value="2">E2</option><option value="3">EF</option>
          </select>
        </div>
        <select id="aimg-asig" onchange="cargarPreguntasAdminImg()" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; margin-bottom:15px; font-size:0.9rem;">
          <option value="">Asignatura...</option>
        </select>
        <select id="aimg-preg" onchange="verDetallePreguntaAdmin()" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; margin-bottom:15px; font-size:0.9rem;">
          <option value="">Pregunta...</option>
        </select>

        <div id="aimg-detalle" style="display:none; background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:15px;">
          <div id="aimg-fields" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>
        
        <!-- Zona de subida individual (Nuevo) -->
        <div style="border-top:1px solid #e2e8f0; padding-top:15px; margin-top:10px;">
          <label style="font-size:0.8rem; font-weight:bold; color:#475569; display:block; margin-bottom:5px;">Subir Nueva Imagen:</label>
          <input type="text" id="img-upload-name" placeholder="Nombre (Ej: 15M9.png)" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; margin-bottom:10px; font-size:0.9rem;">
          <input type="file" id="img-upload-file" accept="image/png, image/jpeg" style="width:100%; margin-bottom:10px;">
          <button onclick="subirImagenStorage()" style="background:#0ea5e9; color:white; border:none; padding:10px; border-radius:10px; font-weight:800; cursor:pointer; width:100%;">
            📤 Subir al Servidor
          </button>
          <div id="img-upload-status" style="margin-top:5px; font-size:0.75rem; font-weight:bold;"></div>
        </div>
      </div>

      <!-- Ingreso Individual: Estudiantes y Docentes -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        
        <!-- Formulario Estudiantes -->
        <div class="admin-card" style="background:white; padding:25px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 15px 0; color:#334155; display:flex; align-items:center; gap:8px;">🎓 Ingreso Individual (Estudiante)</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="text" id="ind-est-id" placeholder="Identificación" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-est-nom" placeholder="Nombre Completo" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <div style="display:flex; gap:10px;">
              <input type="text" id="ind-est-gra" placeholder="Grado (Ej: 1101)" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
              <select id="ind-est-jor" style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
                <option value="M">Mañana</option><option value="T">Tarde</option>
              </select>
            </div>
            <input type="text" id="ind-est-sede" placeholder="Sede (Opcional, defecto: Central)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <button onclick="guardarEstudianteIndividual()" style="background:#8b5cf6; color:white; border:none; padding:12px; border-radius:10px; font-weight:800; cursor:pointer; width:100%;">
              ➕ AGREGAR ESTUDIANTE
            </button>
            <div id="ind-est-status" style="font-size:0.8rem; font-weight:bold;"></div>
          </div>
        </div>

        <!-- Formulario Docentes -->
        <div class="admin-card" style="background:white; padding:25px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 15px 0; color:#334155; display:flex; align-items:center; gap:8px;">👨‍🏫 Registro Individual (Docente/Privacidad)</h3>
          <p style="font-size:0.75rem; color:#64748b; margin-bottom:10px;">Agrega o actualiza permisos de acceso.</p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="text" id="ind-doc-nom" placeholder="Nombre Docente (Para login)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-id" placeholder="Identificación / Contraseña" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-sed" placeholder="Sede (Ej: Pisoje Bajo, Yanaconas)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-rol" placeholder="Roles (Ej: docente, admin, superadmin)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <input type="text" id="ind-doc-gra" placeholder="Grados (Ej: 301,401,5-PJ)" style="padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-size:0.9rem;">
            <button onclick="guardarDocenteIndividual()" style="background:#eab308; color:white; border:none; padding:12px; border-radius:10px; font-weight:800; cursor:pointer; width:100%;">
              ➕ AGREGAR DOCENTE
            </button>
            <div id="ind-doc-status" style="font-size:0.8rem; font-weight:bold;"></div>
          </div>
        </div>

      </div>

      <!-- Controles Adicionales de Sistema -->
      <div class="admin-card" style="background:white; padding:25px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #e2e8f0; grid-column: 1 / -1;">
        <h3 style="margin:0 0 15px 0; color:#ef4444; display:flex; align-items:center; gap:8px;">⚠️ Gestión Peligrosa de Datos</h3>
        <div style="display:flex; gap:15px; flex-wrap:wrap;">
          <button onclick="resetearBaseDeDatos()" style="background:#ef4444; color:white; border:none; padding:12px 24px; border-radius:10px; font-weight:800; cursor:pointer; flex:1;">
            🔥 BORRADO TOTAL DE TABLAS (RESET)
          </button>
          <button onclick="corregirNombresBaseDeDatos()" style="background:#f59e0b; color:white; border:none; padding:12px 24px; border-radius:10px; font-weight:800; cursor:pointer; flex:1;">
            🔧 CORREGIR NOMBRES INVERTIDOS
          </button>
        </div>
      </div>

    </div>
  </div>
`;

// Extract the exact HTML block to replace
const startMarker = '<div class="admin-trigger" onclick="toggleAdmin()"';
const endMarker = '<!-- SECCIÓN MAIN DE ARQUITECTURA LIMPIA (DEMO / PARALELO) -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    
    // Inject the new Admin view right where the old trigger and modal were
    content = before + newAdminHTML + "\n  " + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("HTML del Administrador reemplazado con éxito.");
} else {
    console.error("No se encontraron los marcadores HTML para reemplazar.");
}

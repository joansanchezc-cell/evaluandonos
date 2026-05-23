const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '<!-- BANNER SUPERIOR FIJO -->';
const endMarker = '<!-- Contenedor general de vistas scrollable -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("No se encontraron los marcadores.");
    process.exit(1);
}

const replacement = `<!-- CUERPO DE LA APP -->
  <div id="app-body" style="display: flex; height: 100vh; overflow: hidden; background: #f8fafc;">
    
    <!-- SIDEBAR DE PIE A CABEZA -->
    <aside id="sidebar" style="width: 250px; min-width: 250px; background: #4f46e5; color: white; display: flex; flex-direction: column; overflow-y: auto; padding: 20px 15px; box-sizing: border-box; transition: all 0.3s ease; box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index: 900;">
       
       <div id="user-badge" style="display: none; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); align-items: center; gap: 10px; margin-bottom: 15px;">
         <div id="user-avatar" style="width:36px; height:36px; background:white; color:#4f46e5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1rem; flex-shrink: 0;">U</div>
         <div style="flex: 1; overflow: hidden;">
           <div id="user-nombre" style="font-size: 0.85rem; font-weight: 800; color: white; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Cargando...</div>
           <div id="user-role-label" style="font-size: 0.7rem; font-weight: 700; color: #a5b4fc; text-transform: uppercase;">Rol</div>
         </div>
         <button onclick="logout()" style="background:rgba(255, 255, 255, 0.2); border:none; color:white; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; transition: 0.2s;" title="Cerrar Sesión">
           <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3">
             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
             <polyline points="16 17 21 12 16 7" />
             <line x1="21" y1="12" x2="9" y2="12" />
           </svg>
         </button>
      </div>

      <nav style="display: flex; flex-direction: column; gap: 8px;">
        <p style="font-size: 0.7rem; font-weight: 800; color: #a5b4fc; margin: 0 0 5px 5px; text-transform: uppercase; letter-spacing: 1px;">Principal</p>

        <!-- Dropdown ANÁLISIS -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-analisis')" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: white; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📊 ANÁLISIS</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-analisis" style="display: none; flex-direction: column; background: rgba(0,0,0,0.15); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button onclick="selectAnalisis('general')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #e0e7ff; text-align: left; cursor: pointer; font-size: 0.85rem;">📊 Análisis General</button>
             <button id="tab-estudiante-detalle-item" onclick="selectAnalisis('estudiante')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #e0e7ff; text-align: left; cursor: pointer; font-size: 0.85rem;">👤 Por Estudiante</button>
          </div>
        </div>

        <button onclick="switchMainTab('estadisticas')" id="tab-estadisticas" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: white; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
          📈 ESTADÍSTICAS
        </button>

        <!-- Dropdown INFORMES -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-informes')" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: white; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📄 INFORMES</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-informes" style="display: none; flex-direction: column; background: rgba(0,0,0,0.15); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button id="tab-individual-item" onclick="switchMainTab('individual')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #e0e7ff; text-align: left; cursor: pointer; font-size: 0.85rem;">📄 Individual</button>
             <button id="tab-grupal-item" onclick="switchMainTab('grupal')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #e0e7ff; text-align: left; cursor: pointer; font-size: 0.85rem;">👥 Grupal</button>
             <button id="tab-asignatura-item" onclick="switchMainTab('asignatura')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #e0e7ff; text-align: left; cursor: pointer; font-size: 0.85rem;">📚 Por Asignatura</button>
          </div>
        </div>

        <p style="font-size: 0.7rem; font-weight: 800; color: #a5b4fc; margin: 15px 0 5px 5px; text-transform: uppercase; letter-spacing: 1px;">Configuración</p>

        <!-- Dropdown AÑO -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-anio')" style="width: 100%; text-align: left; padding: 12px 15px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(255,255,255,0.1); color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📅 Año: <span id="lbl-anio">2026</span></span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-anio" style="display: none; flex-direction: column; background: rgba(0,0,0,0.15); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button onclick="setAnio(2026)" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: white; text-align: left; cursor: pointer; font-size: 0.85rem; font-weight:bold;">📅 2026</button>
             <button onclick="setAnio(2027)" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: white; text-align: left; cursor: pointer; font-size: 0.85rem; font-weight:bold;">📅 2027</button>
          </div>
        </div>

        <button onclick="toggleAdmin()" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: white; color: #4f46e5; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ⚙️ PANEL ADMIN
        </button>
        <button id="clean-arch-trigger" onclick="toggleCleanArchitecture()" style="display:none !important; width: 100%; text-align: left; padding: 12px 15px; border: 1px solid rgba(255,255,255,0.5); border-radius: 8px; background: transparent; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px;">
          ✨ MODULAR
        </button>

      </nav>
    </aside>

    <!-- ÁREA PRINCIPAL DERECHA (DESLIZABLE) -->
    <div id="main-content" style="flex: 1; display: flex; flex-direction: column; overflow-y: auto; position: relative;">
      
      <!-- BANNER DENTRO DEL CONTENIDO DERECHO -->
      <header id="top-banner" style="position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.05); background: white;">
        <div class="header-banner" style="width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; height: 110px;">
          <img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/evaluandonos.png" alt="Evaluándonos" style="width: 100%; max-width: 1200px; margin: -5% auto -6% auto;">
        </div>
      </header>

      <!-- Topbar Interno para Tabs de Período -->
      <div style="padding: 10px 30px; border-bottom: 1px solid #e2e8f0; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); display: flex; justify-content: flex-end; position: sticky; top: 110px; z-index: 999;">
        <div class="period-tabs" style="margin: 0; background: #f1f5f9; padding: 4px; border-radius: 12px; display: flex; gap: 5px; border: 1px solid #cbd5e1;">
           <div id="tab-1" class="period-tab active" onclick="setPeriodo(1)" style="font-size: 0.85rem; padding: 6px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">E1</div>
           <div id="tab-2" class="period-tab" onclick="setPeriodo(2)" style="font-size: 0.85rem; padding: 6px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">E2</div>
           <div id="tab-3" class="period-tab" onclick="setPeriodo(3)" style="font-size: 0.85rem; padding: 6px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">EF</div>
        </div>
      </div>
      
      `;

const finalContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("Ajuste a la V2 completado exitosamente.");

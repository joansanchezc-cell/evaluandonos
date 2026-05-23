const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '<!-- CUERPO DE LA APP (DIVIDIDO EN 2) -->';
const endMarker = '<main class="container" style="padding-top: 10px;">';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("No se encontraron los marcadores.");
    process.exit(1);
}

const replacement = `<!-- CUERPO DE LA APP V3 -->
  <div id="app-body" style="display: flex; height: 100vh; overflow: hidden; background: #f8fafc;">
    
    <!-- SIDEBAR -->
    <aside id="sidebar" style="width: 250px; min-width: 250px; background: #1e293b; color: white; display: flex; flex-direction: column; overflow-y: auto; box-sizing: border-box; transition: all 0.3s ease; box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index: 900;">
       
       <!-- LOGO EN LA PARTE SUPERIOR DEL SIDEBAR -->
       <div style="background: white; width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px 0; border-bottom: 1px solid #e2e8f0; height: 80px; box-sizing: border-box;">
         <div style="width: 100%; height: 100%; overflow: hidden; display: flex; justify-content: center; align-items: center;">
           <img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/evaluandonos.png" alt="Evaluándonos" style="width: 150%; margin-top: -6%;">
         </div>
       </div>

      <nav style="display: flex; flex-direction: column; gap: 8px; padding: 20px 15px;">
        <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin: 0 0 5px 5px; text-transform: uppercase; letter-spacing: 1px;">Principal</p>

        <!-- Dropdown ANÁLISIS -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-analisis')" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: white; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📊 ANÁLISIS</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-analisis" style="display: none; flex-direction: column; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button onclick="selectAnalisis('general')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #cbd5e1; text-align: left; cursor: pointer; font-size: 0.85rem;">📊 Análisis General</button>
             <button id="tab-estudiante-detalle-item" onclick="selectAnalisis('estudiante')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #cbd5e1; text-align: left; cursor: pointer; font-size: 0.85rem;">👤 Por Estudiante</button>
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
          <div id="menu-informes" style="display: none; flex-direction: column; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button id="tab-individual-item" onclick="switchMainTab('individual')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #cbd5e1; text-align: left; cursor: pointer; font-size: 0.85rem;">📄 Individual</button>
             <button id="tab-grupal-item" onclick="switchMainTab('grupal')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #cbd5e1; text-align: left; cursor: pointer; font-size: 0.85rem;">👥 Grupal</button>
             <button id="tab-asignatura-item" onclick="switchMainTab('asignatura')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #cbd5e1; text-align: left; cursor: pointer; font-size: 0.85rem;">📚 Por Asignatura</button>
          </div>
        </div>

        <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin: 15px 0 5px 5px; text-transform: uppercase; letter-spacing: 1px;">Configuración</p>

        <!-- Dropdown AÑO -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-anio')" style="width: 100%; text-align: left; padding: 12px 15px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📅 Año: <span id="lbl-anio">2026</span></span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-anio" style="display: none; flex-direction: column; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button onclick="setAnio(2026)" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: white; text-align: left; cursor: pointer; font-size: 0.85rem; font-weight:bold;">📅 2026</button>
             <button onclick="setAnio(2027)" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: white; text-align: left; cursor: pointer; font-size: 0.85rem; font-weight:bold;">📅 2027</button>
          </div>
        </div>

        <button onclick="toggleAdmin()" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: #4f46e5; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ⚙️ PANEL ADMIN
        </button>
        <button id="clean-arch-trigger" onclick="toggleCleanArchitecture()" style="display:none !important; width: 100%; text-align: left; padding: 12px 15px; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; background: transparent; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px;">
          ✨ MODULAR
        </button>

      </nav>
    </aside>

    <!-- ÁREA PRINCIPAL DERECHA (DESLIZABLE) -->
    <div id="main-content" style="flex: 1; display: flex; flex-direction: column; overflow-y: auto; position: relative;">
      
      <!-- TOP BAR DERECHO -->
      <header style="height: 80px; min-height: 80px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; position: sticky; top: 0; z-index: 999; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
        
        <!-- Pestañas de Período -->
        <div class="period-tabs" style="margin: 0; background: #f1f5f9; padding: 4px; border-radius: 12px; display: flex; gap: 5px; border: 1px solid #cbd5e1;">
           <div id="tab-1" class="period-tab active" onclick="setPeriodo(1)" style="font-size: 0.85rem; padding: 8px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">E1</div>
           <div id="tab-2" class="period-tab" onclick="setPeriodo(2)" style="font-size: 0.85rem; padding: 8px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">E2</div>
           <div id="tab-3" class="period-tab" onclick="setPeriodo(3)" style="font-size: 0.85rem; padding: 8px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">EF</div>
        </div>

        <!-- Usuario -->
        <div id="user-badge" style="display: none; align-items: center; gap: 12px;">
           <div style="text-align: right;">
             <div id="user-nombre" style="font-size: 0.9rem; font-weight: 800; color: #1e293b;">Cargando...</div>
             <div id="user-role-label" style="font-size: 0.75rem; font-weight: 700; color: #4f46e5; text-transform: uppercase;">Rol</div>
           </div>
           <div id="user-avatar" style="width:42px; height:42px; background:#4f46e5; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.1rem; flex-shrink: 0; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);">U</div>
           <button onclick="logout()" style="background:rgba(239, 68, 68, 0.1); border:none; color:#ef4444; cursor:pointer; padding:10px; border-radius:10px; display:flex; align-items:center; transition: 0.2s; margin-left:5px;" title="Cerrar Sesión">
             <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3">
               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
               <polyline points="16 17 21 12 16 7" />
               <line x1="21" y1="12" x2="9" y2="12" />
             </svg>
           </button>
        </div>
      </header>

      <!-- Contenedor general de vistas scrollable -->
      <div id="scrollable-views" style="padding: 20px 30px; flex: 1;">
`;

const finalContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("Ajuste V3 completado exitosamente.");

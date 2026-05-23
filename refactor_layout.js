const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Encontrar el inicio de <header> y el fin de </header>
const headerStartIdx = content.indexOf('<header style="background: white; border-bottom: 2px solid #f1f5f9;">');
const mainStartIdx = content.indexOf('<main class="container" style="padding-top: 10px;">');

if (headerStartIdx === -1 || mainStartIdx === -1) {
    console.error("No se pudo encontrar el header o main original.");
    process.exit(1);
}

// 2. Extraer todo antes del header
const beforeHeader = content.substring(0, headerStartIdx);

// 3. Extraer todo desde el inicio del main hasta antes del </body>
const bodyEndIdx = content.lastIndexOf('</body>');
const afterMain = content.substring(mainStartIdx, bodyEndIdx);
const afterBody = content.substring(bodyEndIdx);

// 4. Construir el nuevo layout HTML (Header + Sidebar + Contenedores)
const newLayoutHtml = `  <!-- BANNER SUPERIOR FIJO -->
  <header id="top-banner" style="position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); background: white;">
    <div class="header-banner" style="width: 100%; display: flex; justify-content: center; align-items: center; height: 100px; overflow: hidden;">
      <img src="https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/evaluandonos.png" alt="Evaluándonos" style="width: 100%; max-width: 1200px; margin-top: -6%;">
    </div>
  </header>

  <!-- CUERPO DE LA APP (DIVIDIDO EN 2) -->
  <div id="app-body" style="display: flex; height: calc(100vh - 100px); overflow: hidden; background: #f8fafc;">
    
    <!-- SIDEBAR FIJO -->
    <aside id="sidebar" style="width: 250px; min-width: 250px; background: #1e293b; color: white; display: flex; flex-direction: column; overflow-y: auto; padding: 20px 15px; box-sizing: border-box; transition: all 0.3s ease; box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index: 900;">
       
       <div id="user-badge" style="display: none; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); align-items: center; gap: 10px; margin-bottom: 15px;">
         <div id="user-avatar" style="width:36px; height:36px; background:#4f46e5; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1rem; flex-shrink: 0;">U</div>
         <div style="flex: 1; overflow: hidden;">
           <div id="user-nombre" style="font-size: 0.85rem; font-weight: 800; color: white; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Cargando...</div>
           <div id="user-role-label" style="font-size: 0.7rem; font-weight: 700; color: #818cf8; text-transform: uppercase;">Rol</div>
         </div>
         <button onclick="logout()" style="background:rgba(239, 68, 68, 0.2); border:none; color:#fca5a5; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; transition: 0.2s;" title="Cerrar Sesión">
           <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3">
             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
             <polyline points="16 17 21 12 16 7" />
             <line x1="21" y1="12" x2="9" y2="12" />
           </svg>
         </button>
      </div>

      <nav style="display: flex; flex-direction: column; gap: 8px;">
        <p style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin: 0 0 5px 5px; text-transform: uppercase; letter-spacing: 1px;">Principal</p>

        <!-- Dropdown ANÁLISIS -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-analisis')" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: #e2e8f0; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📊 ANÁLISIS</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-analisis" style="display: none; flex-direction: column; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button onclick="selectAnalisis('general')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #94a3b8; text-align: left; cursor: pointer; font-size: 0.85rem;">📊 Análisis General</button>
             <button id="tab-estudiante-detalle-item" onclick="selectAnalisis('estudiante')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #94a3b8; text-align: left; cursor: pointer; font-size: 0.85rem;">👤 Por Estudiante</button>
          </div>
        </div>

        <button onclick="switchMainTab('estadisticas')" id="tab-estadisticas" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: #e2e8f0; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
          📈 ESTADÍSTICAS
        </button>

        <!-- Dropdown INFORMES -->
        <div style="position: relative;">
          <button onclick="toggleSidebarMenu('menu-informes')" style="width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: transparent; color: #e2e8f0; cursor: pointer; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 8px;">📄 INFORMES</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div id="menu-informes" style="display: none; flex-direction: column; background: rgba(0,0,0,0.2); border-radius: 8px; margin-top: 4px; overflow: hidden;">
             <button id="tab-individual-item" onclick="switchMainTab('individual')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #94a3b8; text-align: left; cursor: pointer; font-size: 0.85rem;">📄 Individual</button>
             <button id="tab-grupal-item" onclick="switchMainTab('grupal')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #94a3b8; text-align: left; cursor: pointer; font-size: 0.85rem;">👥 Grupal</button>
             <button id="tab-asignatura-item" onclick="switchMainTab('asignatura')" style="padding: 10px 15px 10px 35px; border: none; background: transparent; color: #94a3b8; text-align: left; cursor: pointer; font-size: 0.85rem;">📚 Por Asignatura</button>
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

        <button onclick="toggleAdmin()" class="admin-trigger" style="display:none; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px;">
          ⚙️ PANEL ADMIN
        </button>
        <button id="clean-arch-trigger" onclick="toggleCleanArchitecture()" style="display:none !important; width: 100%; text-align: left; padding: 12px 15px; border: none; border-radius: 8px; background: #6366f1; color: white; cursor: pointer; font-weight: 800; font-size: 0.9rem; align-items: center; gap: 8px; margin-top: 10px;">
          ✨ MODULAR
        </button>

      </nav>
    </aside>

    <!-- ÁREA PRINCIPAL DERECHA (DESLIZABLE) -->
    <div id="main-content" style="flex: 1; display: flex; flex-direction: column; overflow-y: auto; position: relative;">
      
      <!-- Topbar Interno para Tabs de Período -->
      <div style="padding: 15px 30px; border-bottom: 1px solid #e2e8f0; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); display: flex; justify-content: flex-end; position: sticky; top: 0; z-index: 10;">
        <div class="period-tabs" style="margin: 0; background: #f1f5f9; padding: 4px; border-radius: 12px; display: flex; gap: 5px; border: 1px solid #cbd5e1;">
           <div id="tab-1" class="period-tab active" onclick="setPeriodo(1)" style="font-size: 0.85rem; padding: 6px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">E1</div>
           <div id="tab-2" class="period-tab" onclick="setPeriodo(2)" style="font-size: 0.85rem; padding: 6px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">E2</div>
           <div id="tab-3" class="period-tab" onclick="setPeriodo(3)" style="font-size: 0.85rem; padding: 6px 20px; font-weight: 800; border-radius: 8px; cursor:pointer;">EF</div>
        </div>
      </div>
      
      <!-- Contenedor general de vistas scrollable -->
      <div id="scrollable-views" style="padding: 20px 30px; flex: 1;">
`;

const closingLayoutHtml = `
      </div> <!-- #scrollable-views -->
    </div> <!-- #main-content -->
  </div> <!-- #app-body -->
`;

const finalContent = beforeHeader + newLayoutHtml + afterMain + closingLayoutHtml + afterBody;

fs.writeFileSync(filePath, finalContent, 'utf8');

// 5. Agregar la función toggleSidebarMenu a los scripts
let jsContent = fs.readFileSync(filePath, 'utf8');
if(!jsContent.includes('function toggleSidebarMenu')) {
    const customJS = `
      function toggleSidebarMenu(id) {
        const el = document.getElementById(id);
        const isVisible = el.style.display === 'flex';
        // Opcional: Cerrar los demás
        // ['menu-analisis', 'menu-informes', 'menu-anio'].forEach(menuId => {
        //   if(menuId !== id) document.getElementById(menuId).style.display = 'none';
        // });
        el.style.display = isVisible ? 'none' : 'flex';
      }
    `;
    // Insertar justo antes del cierre </script> del final (o de <script>)
    jsContent = jsContent.replace('function toggleDropdown(id) {', customJS + '\n      function toggleDropdown(id) {');
    fs.writeFileSync(filePath, jsContent, 'utf8');
}

console.log("¡Refactorización de Layout completada!");

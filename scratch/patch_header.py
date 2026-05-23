import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      <!-- TOP BAR DERECHO CON LOGO INCLUIDO -->
      <header style="height: 80px; min-height: 80px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; position: sticky; top: 0; z-index: 999; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">"""

replacement = """      <!-- TOP BAR DERECHO CON LOGO INCLUIDO -->
      
      <!-- MOBILE HEADER -->
      <header class="mobile-header" style="display: none; height: 60px; min-height: 60px; background: white; border-bottom: 1px solid #e2e8f0; justify-content: space-between; align-items: center; padding: 0 15px; position: sticky; top: 0; z-index: 999; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button onclick="document.getElementById('sidebar').classList.toggle('mobile-open')" style="background: transparent; border: none; padding: 5px; cursor: pointer; color: #1e293b;">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <span style="font-weight: 900; font-size: 1.1rem; color: #1e293b; letter-spacing: -0.5px;">Evaluándonos</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 20px; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; background: #16a34a; border-radius: 50%; display: inline-block;"></span> En línea
          </span>
          <span id="mobile-role-badge" style="background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 20px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">
            DOCENTE
          </span>
        </div>
      </header>

      <!-- MOBILE GREETING SECTION -->
      <div class="mobile-greeting" style="display: none; background: #fdfbf7; padding: 20px 15px; border-bottom: 1px solid #f1f5f9;">
        <h2 style="margin: 0; font-size: 1.4rem; color: #0f172a; font-weight: 900; letter-spacing: -0.5px;">Buenos días, <span id="mobile-greeting-name">Usuario</span> 👋</h2>
        <p style="margin: 5px 0 15px 0; font-size: 0.85rem; color: #64748b; font-weight: 500;" id="mobile-date">...</p>
        
        <!-- Pestañas E1 E2 EF en móvil -->
        <div class="period-tabs-mobile" style="background: white; padding: 4px; border-radius: 12px; display: flex; gap: 5px; border: 1px solid #e2e8f0; width: fit-content; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
           <div id="tab-mob-1" class="period-tab active" onclick="setPeriodo(1)" style="font-size: 0.8rem; padding: 6px 15px; font-weight: 800; border-radius: 8px; cursor:pointer;">E1</div>
           <div id="tab-mob-2" class="period-tab" onclick="setPeriodo(2)" style="font-size: 0.8rem; padding: 6px 15px; font-weight: 800; border-radius: 8px; cursor:pointer;">E2</div>
           <div id="tab-mob-3" class="period-tab" onclick="setPeriodo(3)" style="font-size: 0.8rem; padding: 6px 15px; font-weight: 800; border-radius: 8px; cursor:pointer;">EF</div>
        </div>
      </div>

      <header class="desktop-header" style="height: 80px; min-height: 80px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; position: sticky; top: 0; z-index: 999; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">"""

target_normalized = target.replace('\r\n', '\n')
content_normalized = content.replace('\r\n', '\n')

if target_normalized in content_normalized:
    new_content = content_normalized.replace(target_normalized, replacement.replace('\r\n', '\n'))
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print("Success: Replaced HTML structure.")
else:
    print("Error: Target HTML not found.")

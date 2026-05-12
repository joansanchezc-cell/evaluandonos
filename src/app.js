/**
 * Aplicación Principal
 * Punto de entrada que inicializa toda la arquitectura
 * 
 * Este archivo se importaría en el footer de index.html:
 * <script type="module" src="./src/app.js"></script>
 */

import { supabaseDatasource } from './data/index.js';
import { authController } from './presentation/controllers/index.js';
import { analisisController } from './presentation/controllers/index.js';

/**
 * Inicializa la aplicación
 * Se ejecuta cuando el DOM está listo
 */
async function initApp() {
  console.log('🚀 Inicializando Evaluándonos...');

  try {
    // 1. Inicializar Supabase
    console.log('🔌 Conectando a Supabase...');
    await supabaseDatasource.initialize();
    
    const connected = await supabaseDatasource.validateConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a Supabase');
    }
    console.log('✅ Supabase conectado');

    // 2. Inicializar Controllers (se enganchan automáticamente a eventos HTML)
    console.log('🎮 Inicializando Controllers...');
    authController.init();
    await analisisController.init();
    console.log('✅ Controllers inicializados');

    // 3. App lista
    console.log('✨ Aplicación lista');
  } catch (err) {
    console.error('❌ Error inicializando aplicación:', err);
    document.body.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

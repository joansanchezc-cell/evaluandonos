/**
 * Aplicación Principal
 * Punto de entrada que inicializa toda la arquitectura
 * 
 * Este archivo se importa en el footer de index.html:
 * <script type="module" src="./src/app.js"></script>
 */

import { supabaseDatasource } from './data/index.js';
import { 
  authController, 
  analisisController, 
  adminController, 
  reportController 
} from './presentation/controllers/index.js';

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
    adminController.init();
    reportController.init();
    console.log('✅ Controllers inicializados');

    // 3. Exposición global para garantizar 100% de compatibilidad con botones onclick legado
    window.authController = authController;
    window.analisisController = analisisController;
    window.adminController = adminController;
    window.reportController = reportController;
    
    // Callbacks globales compatibles
    window.logout = async () => {
      if (typeof window.logoutLegacy === 'function') {
        await window.logoutLegacy();
      } else {
        await authController.bindLogout();
      }
    };

    console.log('✨ Aplicación lista para producción');
  } catch (err) {
    console.error('❌ Error inicializando aplicación:', err);
    // Para no romper la experiencia si falla la inicialización modular en paralelo
    console.warn('⚠️ Se mantiene la ejecución fallback del script inline.');
  }
}

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


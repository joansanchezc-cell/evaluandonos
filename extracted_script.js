
    // --- PRE-INICIALIZACIÃ“N BLINDADA (STABLE SCOPE HOISTING) ---
    // Garantiza que los controladores de la interfaz existan en memoria antes de renderizar los botones, evitando ReferenceErrors.
    window.$ = id => document.getElementById(id);
    window.switchLoginMode = function (mode) {
      const isEst = mode === 'estudiante';
      const fDoc = document.getElementById('form-docente');
      const fEst = document.getElementById('form-estudiante');
      if (fDoc) fDoc.style.display = isEst ? 'none' : 'block';
      if (fEst) fEst.style.display = isEst ? 'block' : 'none';

      const btnDoc = document.getElementById('mode-docente');
      const btnEst = document.getElementById('mode-estudiante');

      if (btnDoc && btnEst) {
        if (isEst) {
          btnDoc.style.background = 'transparent'; btnDoc.style.color = '#64748b'; btnDoc.style.boxShadow = 'none';
          btnEst.style.background = 'white'; btnEst.style.color = '#4f46e5'; btnEst.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
          btnEst.style.background = 'transparent'; btnEst.style.color = '#64748b'; btnEst.style.boxShadow = 'none';
          btnDoc.style.background = 'white'; btnDoc.style.color = '#4f46e5'; btnDoc.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
      }
      const err = document.getElementById('login-err');
      if (err) err.style.display = 'none';
    };

    // Controladores de espera seguros para evitar que clics prematuros causen excepciones no capturadas
    window.intentarLogin = function () {
      const err = document.getElementById('login-err');
      if (err) {
        err.innerText = "Estableciendo conexiÃ³n segura con el servidor. Por favor espera un segundo...";
        err.style.display = 'block';
      }
    };
    window.intentarLoginEstudiante = function () {
      const err = document.getElementById('login-err');
      if (err) {
        err.innerText = "Conectando al sistema escolar. Por favor espera un segundo...";
        err.style.display = 'block';
      }
    };
  
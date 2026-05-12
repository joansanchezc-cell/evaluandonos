/**
 * Controlador de Autenticación
 * Vincula eventos HTML con AuthService
 * 
 * Responsabilidades:
 * - Capturar eventos de login
 * - Validar entrada de usuario
 * - Actualizar UI con resultado
 * - Manejar errores
 */

import { AuthService } from '../../domain/services/index.js';

export class AuthController {
  constructor() {
    this.currentUser = null;
    this.userType = null; // 'docente' | 'estudiante'
  }

  /**
   * Inicializa event listeners en el HTML
   * Se llama una sola vez al cargar la app
   */
  init() {
    console.log('🔐 AuthController inicializado');
    
    // Vincular botones de login
    this.bindLoginEstudiante();
    this.bindLoginDocente();
    this.bindLogout();
    
    // Validar sesión existente
    this.validarSesionExistente();
  }

  /**
   * Vincula evento de login de estudiante
   * HTML esperado: <button id="btn-login-estudiante">
   *                <input id="input-id-estudiante">
   */
  bindLoginEstudiante() {
    const btnLogin = document.getElementById('btn-login-estudiante');
    const inputId = document.getElementById('input-id-estudiante');

    if (!btnLogin || !inputId) {
      console.warn('⚠️ Elementos de login estudiante no encontrados');
      return;
    }

    btnLogin.addEventListener('click', async () => {
      const identificacion = inputId.value.trim();

      if (!identificacion) {
        this.mostrarError('Ingresa tu identificación');
        return;
      }

      try {
        btnLogin.disabled = true;
        btnLogin.textContent = 'Autenticando...';

        const { success, student, error } = await AuthService.loginEstudiante(identificacion);

        if (success) {
          this.currentUser = student;
          this.userType = 'estudiante';
          this.mostrarExito('¡Bienvenido!');
          this.mostrarVistaPrincipal();
        } else {
          this.mostrarError(error || 'No se encontró el estudiante');
        }
      } catch (err) {
        this.mostrarError(err.message);
      } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Ingresar';
      }
    });
  }

  /**
   * Vincula evento de login de docente
   * HTML esperado: <form id="form-login-docente">
   *                <input id="input-email-docente">
   *                <input id="input-password-docente">
   *                <button type="submit">
   */
  bindLoginDocente() {
    const form = document.getElementById('form-login-docente');

    if (!form) {
      console.warn('⚠️ Formulario de login docente no encontrado');
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('input-email-docente')?.value.trim();
      const password = document.getElementById('input-password-docente')?.value;

      if (!email || !password) {
        this.mostrarError('Email y contraseña son requeridos');
        return;
      }

      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Autenticando...';

        const { success, user, error } = await AuthService.loginDocente(email, password);

        if (success) {
          this.currentUser = user;
          this.userType = 'docente';
          this.mostrarExito('¡Bienvenido docente!');
          this.mostrarVistaPrincipal();
        } else {
          this.mostrarError(error || 'Email o contraseña incorrectos');
        }
      } catch (err) {
        this.mostrarError(err.message);
      } finally {
        form.querySelector('button[type="submit"]').disabled = false;
        form.querySelector('button[type="submit"]').textContent = 'Ingresar';
      }
    });
  }

  /**
   * Vincula evento de logout
   * HTML esperado: <button id="btn-logout">
   */
  bindLogout() {
    const btnLogout = document.getElementById('btn-logout');

    if (!btnLogout) {
      console.warn('⚠️ Botón de logout no encontrado');
      return;
    }

    btnLogout.addEventListener('click', async () => {
      try {
        await AuthService.logout();
        this.currentUser = null;
        this.userType = null;
        this.mostrarExito('Sesión cerrada');
        this.mostrarVistaLogin();
      } catch (err) {
        this.mostrarError('Error al cerrar sesión');
      }
    });
  }

  /**
   * Valida si ya hay sesión activa
   */
  async validarSesionExistente() {
    try {
      const hasSession = await AuthService.validarSesion();

      if (hasSession) {
        console.log('✅ Sesión activa encontrada');
        this.mostrarVistaPrincipal();
      } else {
        this.mostrarVistaLogin();
      }
    } catch (err) {
      console.error('Error validando sesión:', err);
      this.mostrarVistaLogin();
    }
  }

  /**
   * Utilidades de UI
   */

  mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = `❌ ${mensaje}`;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    } else {
      alert(`❌ ${mensaje}`);
    }
  }

  mostrarExito(mensaje) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
      successDiv.textContent = `✅ ${mensaje}`;
      successDiv.style.display = 'block';
      setTimeout(() => {
        successDiv.style.display = 'none';
      }, 3000);
    }
  }

  mostrarVistaLogin() {
    const loginSection = document.getElementById('section-login');
    const mainSection = document.getElementById('section-main');

    if (loginSection) loginSection.style.display = 'block';
    if (mainSection) mainSection.style.display = 'none';
  }

  mostrarVistaPrincipal() {
    const loginSection = document.getElementById('section-login');
    const mainSection = document.getElementById('section-main');

    if (loginSection) loginSection.style.display = 'none';
    if (mainSection) mainSection.style.display = 'block';
  }

  /**
   * Getters públicos
   */

  getUsuarioActual() {
    return this.currentUser;
  }

  getTipodeUsuario() {
    return this.userType;
  }
}

// Singleton instance
export const authController = new AuthController();

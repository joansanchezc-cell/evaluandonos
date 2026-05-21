/**
 * AnalisisController - Modo de Integración Dual
 *
 * Este controlador opera en modo "observador pasivo" sobre el HTML legacy:
 *   - Escucha cambios en los selectores reales: sel-grado, sel-asig, sel-pregunta
 *   - Escucha los tabs de período: tab-1, tab-2, tab-3
 *   - Sincroniza el estado interno con el del monolito vía window.currentPeriodo
 *
 * Si se agregan IDs nuevos (select-grado, select-periodo, btn-cargar-analisis)
 * también los bindeará para soportar la nueva arquitectura HTML.
 */

import { AnalisisService } from '../../domain/services/index.js';
import { ResultadosRepository } from '../../data/index.js';

export class AnalisisController {
  constructor() {
    this.analisisActual = null;
    this.gradoSeleccionado = null;
    this.periodoSeleccionado = null;
  }

  /**
   * Inicializa event listeners
   */
  async init() {
    console.log('📊 AnalisisController inicializado');

    this.bindSelectGrado();
    this.bindSelectPeriodo();
    this.bindBtnCargarAnalisis();
  }

  /**
   * Vincula selección de grado.
   * Soporta: <select id="select-grado"> (nueva arch.) o <select id="sel-grado"> (legacy)
   */
  bindSelectGrado() {
    const selectGrado =
      document.getElementById('select-grado') ||
      document.getElementById('sel-grado');

    if (!selectGrado) {
      console.warn('⚠️ Select de grado no encontrado (select-grado / sel-grado)');
      return;
    }

    selectGrado.addEventListener('change', (e) => {
      this.gradoSeleccionado = e.target.value ? parseInt(e.target.value, 10) : null;
      console.log(`📌 [AnalisisController] Grado: ${this.gradoSeleccionado}`);
    });
  }

  /**
   * Vincula selección de período.
   * Soporta: <select id="select-periodo"> (nueva arch.)
   * y los tabs legacy <div id="tab-1|tab-2|tab-3">.
   */
  bindSelectPeriodo() {
    // Nueva arquitectura
    const selectPeriodo = document.getElementById('select-periodo');
    if (selectPeriodo) {
      selectPeriodo.addEventListener('change', (e) => {
        this.periodoSeleccionado = e.target.value ? parseInt(e.target.value, 10) : null;
        console.log(`📌 [AnalisisController] Período (select): ${this.periodoSeleccionado}`);
      });
    }

    // Tabs legacy (tab-1, tab-2, tab-3)
    [1, 2, 3].forEach(p => {
      const tab = document.getElementById(`tab-${p}`);
      if (tab) {
        tab.addEventListener('click', () => {
          this.periodoSeleccionado = p;
          console.log(`📌 [AnalisisController] Período (tab): ${this.periodoSeleccionado}`);
        });
      }
    });

    // Inicializar con período activo actual desde el monolito
    const periodoActivo = [1, 2, 3].find(p => {
      const tab = document.getElementById(`tab-${p}`);
      return tab && tab.classList.contains('active');
    });
    if (periodoActivo) {
      this.periodoSeleccionado = periodoActivo;
    } else {
      // Fallback: usar la variable global del monolito si existe
      this.periodoSeleccionado = (typeof window.currentPeriodo !== 'undefined')
        ? parseInt(window.currentPeriodo, 10)
        : 1;
    }
  }

  /**
   * Vincula botón de cargar análisis (solo nueva arquitectura).
   * El legacy carga automáticamente con onchange en los selects.
   */
  bindBtnCargarAnalisis() {
    const btn = document.getElementById('btn-cargar-analisis');
    if (!btn) return; // Silencioso: en legacy no existe

    btn.addEventListener('click', () => {
      this.cargarAnalisis();
    });
  }

  /**
   * Carga análisis del grado y período seleccionado (solo nueva arquitectura).
   */
  async cargarAnalisis() {
    if (!this.gradoSeleccionado || !this.periodoSeleccionado) {
      this.mostrarError('Selecciona grado y período');
      return;
    }

    try {
      const btn = document.getElementById('btn-cargar-analisis');
      if (btn) { btn.disabled = true; btn.textContent = 'Cargando...'; }

      console.log(`🔄 Cargando análisis grado ${this.gradoSeleccionado}, período ${this.periodoSeleccionado}`);

      const { resultados, estadisticas, error } = await AnalisisService.obtenerAnalisisGrado(
        this.gradoSeleccionado,
        this.periodoSeleccionado
      );

      if (error) { this.mostrarError(error); return; }

      this.analisisActual = { resultados, estadisticas };
      this.renderizarEstadisticas(estadisticas);
      this.renderizarTablaResultados(resultados);
      this.mostrarExito(`✅ ${resultados.length} resultados cargados`);
    } catch (err) {
      this.mostrarError(err.message);
    } finally {
      const btn = document.getElementById('btn-cargar-analisis');
      if (btn) { btn.disabled = false; btn.textContent = 'Cargar Análisis'; }
    }
  }

  /**
   * Carga períodos disponibles (solo nueva arquitectura con select-periodo).
   */
  async cargarPeriodosDisponibles() {
    try {
      const selectPeriodo = document.getElementById('select-periodo');
      if (!selectPeriodo) return;

      const periodoMasReciente = await ResultadosRepository.obtenerPeriodoMasReciente();
      if (periodoMasReciente) {
        [1, 2, 3].forEach(p => {
          const option = document.createElement('option');
          option.value = p;
          option.textContent = p === 3 ? 'Final' : `Período ${p}`;
          if (p === periodoMasReciente) { option.selected = true; this.periodoSeleccionado = p; }
          selectPeriodo.appendChild(option);
        });
      }
    } catch (err) {
      console.error('Error cargando períodos:', err);
    }
  }

  /**
   * Carga grados disponibles (solo nueva arquitectura con select-grado).
   */
  async cargarGradosDisponibles() {
    try {
      if (!this.periodoSeleccionado) return;
      const selectGrado = document.getElementById('select-grado');
      if (!selectGrado) return;

      const grados = await ResultadosRepository.obtenerGradosConResultados(this.periodoSeleccionado);
      selectGrado.innerHTML = '<option value="">-- Selecciona grado --</option>';
      grados.forEach(grado => {
        const option = document.createElement('option');
        option.value = grado;
        option.textContent = `Grado ${grado}`;
        selectGrado.appendChild(option);
      });
    } catch (err) {
      console.error('Error cargando grados:', err);
    }
  }

  renderizarEstadisticas(estadisticas) {
    const container = document.getElementById('stats-container');
    if (!container) return;
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Estudiantes</h3>
          <p class="stat-value">${estadisticas.totalEstudiantes}</p>
        </div>
        <div class="stat-card">
          <h3>Promedio %</h3>
          <p class="stat-value">${estadisticas.porcentajePromedio}%</p>
        </div>
        <div class="stat-card">
          <h3>Nivel Superior</h3>
          <p class="stat-value">${estadisticas.rangosPorcentajes.superior}</p>
        </div>
        <div class="stat-card">
          <h3>Nivel Bajo</h3>
          <p class="stat-value">${estadisticas.rangosPorcentajes.bajo}</p>
        </div>
      </div>
    `;
  }

  renderizarTablaResultados(resultados) {
    const container = document.getElementById('resultados-container');
    if (!container) return;
    if (!resultados || resultados.length === 0) {
      container.innerHTML = '<p>Sin resultados</p>';
      return;
    }
    const ranking = AnalisisService.calcularRanking(resultados, 'porcentaje');
    container.innerHTML = `
      <table class="resultados-table">
        <thead>
          <tr>
            <th>Pos.</th>
            <th>Nombre</th>
            <th>Porcentaje</th>
            <th>Nivel</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(r => `
            <tr>
              <td>${r.posicion}</td>
              <td>${r.nombre}</td>
              <td>${r.porcentaje}%</td>
              <td class="nivel-${this.getNivelCSS(r.porcentaje)}">${this.getNivelLabel(r.porcentaje)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  getNivelLabel(porcentaje) {
    if (porcentaje >= 91) return 'Superior';
    if (porcentaje >= 71) return 'Alto';
    if (porcentaje >= 51) return 'Básico';
    return 'Bajo';
  }

  getNivelCSS(porcentaje) {
    if (porcentaje >= 91) return 'superior';
    if (porcentaje >= 71) return 'alto';
    if (porcentaje >= 51) return 'basico';
    return 'bajo';
  }

  mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = `❌ ${mensaje}`;
      errorDiv.style.display = 'block';
      setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
    }
  }

  mostrarExito(mensaje) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
      successDiv.textContent = mensaje;
      successDiv.style.display = 'block';
      setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
    }
  }
}

// Singleton instance
export const analisisController = new AnalisisController();

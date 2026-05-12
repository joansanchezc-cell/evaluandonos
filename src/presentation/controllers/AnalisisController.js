/**
 * Controlador de Análisis
 * Vincula eventos HTML con AnalisisService
 * 
 * Responsabilidades:
 * - Capturar selección de grado/período
 * - Obtener datos de análisis
 * - Renderizar resultados
 * - Actualizar gráficos
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
    
    // Cargar períodos disponibles
    await this.cargarPeriodosDisponibles();
    // Cargar grados disponibles
    await this.cargarGradosDisponibles();
  }

  /**
   * Vincula evento de selección de grado
   * HTML esperado: <select id="select-grado">
   */
  bindSelectGrado() {
    const selectGrado = document.getElementById('select-grado');

    if (!selectGrado) {
      console.warn('⚠️ Select de grado no encontrado');
      return;
    }

    selectGrado.addEventListener('change', (e) => {
      this.gradoSeleccionado = parseInt(e.target.value, 10);
      console.log(`📌 Grado seleccionado: ${this.gradoSeleccionado}`);
    });
  }

  /**
   * Vincula evento de selección de período
   * HTML esperado: <select id="select-periodo">
   */
  bindSelectPeriodo() {
    const selectPeriodo = document.getElementById('select-periodo');

    if (!selectPeriodo) {
      console.warn('⚠️ Select de período no encontrado');
      return;
    }

    selectPeriodo.addEventListener('change', (e) => {
      this.periodoSeleccionado = parseInt(e.target.value, 10);
      console.log(`📌 Período seleccionado: ${this.periodoSeleccionado}`);
    });
  }

  /**
   * Vincula botón de cargar análisis
   * HTML esperado: <button id="btn-cargar-analisis">
   */
  bindBtnCargarAnalisis() {
    const btn = document.getElementById('btn-cargar-analisis');

    if (!btn) {
      console.warn('⚠️ Botón de cargar análisis no encontrado');
      return;
    }

    btn.addEventListener('click', () => {
      this.cargarAnalisis();
    });
  }

  /**
   * Carga análisis del grado y período seleccionado
   */
  async cargarAnalisis() {
    if (!this.gradoSeleccionado || !this.periodoSeleccionado) {
      this.mostrarError('Selecciona grado y período');
      return;
    }

    try {
      const btn = document.getElementById('btn-cargar-analisis');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Cargando...';
      }

      console.log(`🔄 Cargando análisis grado ${this.gradoSeleccionado}, período ${this.periodoSeleccionado}`);

      const { resultados, estadisticas, error } = await AnalisisService.obtenerAnalisisGrado(
        this.gradoSeleccionado,
        this.periodoSeleccionado
      );

      if (error) {
        this.mostrarError(error);
        return;
      }

      this.analisisActual = { resultados, estadisticas };
      this.renderizarEstadisticas(estadisticas);
      this.renderizarTablaResultados(resultados);
      
      this.mostrarExito(`✅ ${resultados.length} resultados cargados`);
    } catch (err) {
      this.mostrarError(err.message);
    } finally {
      const btn = document.getElementById('btn-cargar-analisis');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Cargar Análisis';
      }
    }
  }

  /**
   * Carga períodos disponibles en select
   */
  async cargarPeriodosDisponibles() {
    try {
      const selectPeriodo = document.getElementById('select-periodo');
      if (!selectPeriodo) return;

      const periodoMasReciente = await ResultadosRepository.obtenerPeriodoMasReciente();

      if (periodoMasReciente) {
        const periodos = [1, 2, 3]; // Configurar según necesidad

        periodos.forEach(p => {
          const option = document.createElement('option');
          option.value = p;
          option.textContent = `Período ${p}`;
          if (p === periodoMasReciente) {
            option.selected = true;
            this.periodoSeleccionado = p;
          }
          selectPeriodo.appendChild(option);
        });
      }
    } catch (err) {
      console.error('Error cargando períodos:', err);
    }
  }

  /**
   * Carga grados disponibles en select
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

  /**
   * Renderiza estadísticas en tarjetas
   * HTML esperado: <div id="stats-container">
   */
  renderizarEstadisticas(estadisticas) {
    const container = document.getElementById('stats-container');
    if (!container) return;

    const html = `
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

    container.innerHTML = html;
  }

  /**
   * Renderiza tabla de resultados
   * HTML esperado: <div id="resultados-container">
   */
  renderizarTablaResultados(resultados) {
    const container = document.getElementById('resultados-container');
    if (!container) return;

    if (!resultados || resultados.length === 0) {
      container.innerHTML = '<p>Sin resultados</p>';
      return;
    }

    const ranking = AnalisisService.calcularRanking(resultados, 'porcentaje');

    const html = `
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

    container.innerHTML = html;
  }

  /**
   * Utilidades
   */

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

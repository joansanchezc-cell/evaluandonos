/**
 * Controlador de Reportes
 * Gestiona eventos de interfaz, renderizado de tablas e integración con Chart.js para los reportes
 */

import { ReportService } from '../../domain/services/index.js';
import { ResultadosRepository, EstudianteRepository } from '../../data/index.js';
import { extraerGradoBase, detectarSede } from '../../shared/utils/normalization.js';

export class ReportController {
  constructor() {
    this.chartComparativo = null;
  }

  /**
   * Inicializa event listeners de la sección de reportes
   */
  init() {
    console.log('📄 ReportController inicializado');
    this.bindReporteIndividual();
    this.bindReporteGrupal();
    this.bindReporteAsignatura();
  }

  /**
   * Vincula la lógica de búsqueda para el reporte individual
   */
  bindReporteIndividual() {
    const btnBuscar = document.getElementById('btn-buscar-individual');
    const inputSearch = document.getElementById('input-search-individual');

    if (btnBuscar && inputSearch) {
      btnBuscar.addEventListener('click', async () => {
        const query = inputSearch.value.trim();
        if (!query) {
          alert('Ingresa una identificación o ZipGrade ID');
          return;
        }
        await this.cargarReporteIndividual(query);
      });
    }
  }

  /**
   * Carga y renderiza el reporte individual de un estudiante
   */
  async cargarReporteIndividual(query) {
    try {
      const student = await EstudianteRepository.buscarPorIdentificacion(query);
      if (!student) {
        alert('Estudiante no encontrado');
        return;
      }

      // Buscar resultados del estudiante
      const client = window.supabaseClient || null;
      if (!client) return;

      const { data: resData, error } = await client
        .from('eval_resultados')
        .select('*')
        .eq('zipgrade_id', student.zipgrade_id);

      if (error || !resData || resData.length === 0) {
        alert('No se encontraron respuestas registradas para este estudiante');
        return;
      }

      const gBase = extraerGradoBase(student.grupo || '');
      const dataProcesada = ReportService.procesarReporteIndividual(resData[0], gBase);

      this.renderReporteIndividual(dataProcesada);
    } catch (err) {
      console.error('Error al cargar reporte individual:', err);
    }
  }

  /**
   * Renderiza el reporte individual en el contenedor DOM correspondiente
   */
  renderReporteIndividual(data) {
    const container = document.getElementById('individual-content');
    if (!container || !data) return;

    container.innerHTML = `
      <div class="report-card" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 15px;">
        <h3 style="margin-top: 0; color: #1e293b;">${data.nombre}</h3>
        <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
          <strong>ID:</strong> ${data.identificacion} | <strong>ZipGrade ID:</strong> ${data.zipgradeId}
        </p>
        <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
          <strong>Grupo:</strong> ${data.grupo} | <strong>Sede:</strong> ${data.sede}
        </p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 15px 0;" />
        
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:2px solid #e2e8f0; text-align:left;">
              <th style="padding:8px 0;">Asignatura</th>
              <th style="padding:8px 0; text-align:center;">Correctas</th>
              <th style="padding:8px 0; text-align:center;">Total</th>
              <th style="padding:8px 0; text-align:right;">Porcentaje</th>
              <th style="padding:8px 0; text-align:right;">Desempeño</th>
            </tr>
          </thead>
          <tbody>
            ${data.asignaturas.map(a => `
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:8px 0; font-weight: 700;">${a.label}</td>
                <td style="padding:8px 0; text-align:center; color:#22c55e; font-weight:800;">${a.correctas}</td>
                <td style="padding:8px 0; text-align:center; color:#64748b;">${a.total}</td>
                <td style="padding:8px 0; text-align:right; font-weight:800;">${a.porcentaje}%</td>
                <td style="padding:8px 0; text-align:right; font-weight:900; color:${a.valoracion.color};">${a.valoracion.label}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top:20px; background:#f8fafc; padding:12px 20px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:800; color:#1e293b;">PROMEDIO GENERAL:</span>
          <span style="font-size:1.1rem; font-weight:900; color:${data.valoracionGeneral.color};">${data.porcentajeGeneral}% (${data.valoracionGeneral.label})</span>
        </div>
      </div>
    `;
  }

  /**
   * Vincula la lógica de generación del reporte grupal
   */
  bindReporteGrupal() {
    const btnCargar = document.getElementById('btn-cargar-grupal');
    if (btnCargar) {
      btnCargar.addEventListener('click', async () => {
        const selectGrupo = document.getElementById('select-grupo-reporte');
        const grupo = selectGrupo ? selectGrupo.value : '';
        if (!grupo) {
          alert('Selecciona un grupo primero');
          return;
        }
        await this.cargarReporteGrupal(grupo);
      });
    }
  }

  /**
   * Carga y procesa el reporte grupal
   */
  async cargarReporteGrupal(grupo) {
    try {
      const client = window.supabaseClient || null;
      if (!client) return;

      const { data, error } = await client
        .from('eval_resultados')
        .select('*');

      if (error || !data || data.length === 0) {
        alert('No se encontraron registros de resultados en el sistema.');
        return;
      }

      // Filtrar alumnos que pertenezcan al grupo de acuerdo a su zipgrade_id o mapeo
      const baseGrade = extraerGradoBase(grupo);
      const filtered = data.filter(d => {
        const dSede = detectarSede(d.zipgrade_id || '');
        const targetSede = detectarSede(grupo);
        return d.grado === baseGrade && dSede === targetSede;
      });

      if (filtered.length === 0) {
        alert('No se encontraron resultados para el grupo seleccionado');
        return;
      }

      const resGrupal = ReportService.procesarReporteGrupal(filtered, baseGrade);
      this.renderReporteGrupal(grupo, resGrupal);
    } catch (err) {
      console.error('Error al cargar reporte grupal:', err);
    }
  }

  /**
   * Renderiza el reporte grupal en la UI
   */
  renderReporteGrupal(grupo, data) {
    const container = document.getElementById('grupal-content');
    if (!container || !data) return;

    container.innerHTML = `
      <div class="report-card" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 15px;">
        <h3 style="margin-top: 0; color: #1e293b;">Informe Grupal: ${grupo}</h3>
        <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
          <strong>Total Estudiantes Evaluados:</strong> ${data.alumnosCount}
        </p>
        <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
          <strong>Promedio General del Grupo:</strong> ${data.promedioGeneral}%
        </p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 15px 0;" />

        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:2px solid #e2e8f0; text-align:left;">
              <th style="padding:8px 0;">Asignatura</th>
              <th style="padding:8px 0; text-align:right;">Porcentaje Acierto</th>
              <th style="padding:8px 0; text-align:right;">Desempeño</th>
            </tr>
          </thead>
          <tbody>
            ${data.promediosAsignaturas.map(a => `
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:8px 0; font-weight:700;">${a.label}</td>
                <td style="padding:8px 0; text-align:right; font-weight:800;">${a.promedio}%</td>
                <td style="padding:8px 0; text-align:right; font-weight:900; color:${a.valoracion.color};">${a.valoracion.label}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Vincula la lógica de visualización del reporte comparativo por asignatura
   */
  bindReporteAsignatura() {
    const btnCargar = document.getElementById('btn-cargar-asignatura');
    if (btnCargar) {
      btnCargar.addEventListener('click', async () => {
        const selectGrado = document.getElementById('select-grado-asignatura');
        const grado = selectGrado ? selectGrado.value : '';
        if (!grado) {
          alert('Selecciona un grado base primero');
          return;
        }
        await this.cargarReporteAsignatura(parseInt(grado, 10));
      });
    }
  }

  /**
   * Carga y renderiza el reporte por asignatura con gráfico comparativo de sedes
   */
  async cargarReporteAsignatura(gradoBase) {
    try {
      const client = window.supabaseClient || null;
      if (!client) return;

      const { data, error } = await client
        .from('eval_resultados')
        .select('*')
        .eq('grado', gradoBase);

      if (error || !data || data.length === 0) {
        alert('No se encontraron registros de resultados para este grado');
        return;
      }

      const comparativo = ReportService.procesarComparativoSedes(data, gradoBase);
      this.renderReporteAsignatura(gradoBase, comparativo);
    } catch (err) {
      console.error('Error al cargar reporte de asignatura:', err);
    }
  }

  /**
   * Renderiza el reporte por asignatura e inicializa el gráfico Chart.js
   */
  renderReporteAsignatura(gradoBase, data) {
    const container = document.getElementById('asignatura-content');
    const canvas = document.getElementById('chart-comparativo-sedes-canvas');
    if (!container || !data || !canvas) return;

    container.innerHTML = `
      <div class="report-card" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 15px;">
        <h3 style="margin-top: 0; color: #1e293b;">Grado ${gradoBase} - Comparativo de Sedes</h3>
        <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
          <strong>Sedes Presentes:</strong> ${data.sedes.join(', ')}
        </p>
      </div>
    `;

    // Renderizar gráfico
    const COLORES_SEDE = {
      'Central':    '#4f46e5',
      'Yanaconas':  '#10b981',
      'Sendero':    '#f59e0b',
      'Pisoje Bajo':'#ef4444',
      'Pueblillo':  '#06b6d4'
    };

    const datasets = data.promedios.map(p => ({
      label: p.sede,
      data: p.data,
      backgroundColor: COLORES_SEDE[p.sede] || '#6366f1',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'white'
    }));

    if (this.chartComparativo) {
      this.chartComparativo.destroy();
    }

    const ctx = canvas.getContext('2d');
    this.chartComparativo = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: v => v + '%'
            }
          }
        }
      }
    });
  }
}

// Singleton instance
export const reportController = new ReportController();

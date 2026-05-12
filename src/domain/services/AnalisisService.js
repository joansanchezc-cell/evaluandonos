/**
 * Servicio de Análisis
 * Encapsula lógica de cálculos y transformaciones para análisis
 * 
 * Responsabilidades:
 * - Obtener y filtrar resultados
 * - Calcular porcentajes y valoraciones
 * - Agrupar datos por criterios
 * 
 * Fuente original: index.html líneas ~2558+, ~3696+
 */

import { ResultadosRepository, PreguntasRepository } from '../../data/index.js';
import { getValoration, detectarSede, normalizeText } from '../../shared/utils/index.js';

export class AnalisisService {
  /**
   * Obtiene análisis general de un grado
   * @param {number} grado - Número de grado
   * @param {number} periodo - Número de período
   * @returns {Promise<Object>} { resultados, estadisticas, error }
   */
  static async obtenerAnalisisGrado(grado, periodo) {
    try {
      const resultados = await ResultadosRepository.obtenerResultadosPorGradoYPeriodo(grado, periodo);
      const estadisticas = await this.calcularEstadisticasResultados(resultados);

      return {
        resultados,
        estadisticas,
        error: null
      };
    } catch (err) {
      console.error('Error obtenerAnalisisGrado:', err);
      return { resultados: [], estadisticas: {}, error: err.message };
    }
  }

  /**
   * Calcula estadísticas de un conjunto de resultados
   * @param {Array} resultados - Array de resultados
   * @returns {Object} { totalEstudiantes, porcentajePromedio, distribucionValoraciones, ... }
   */
  static calcularEstadisticasResultados(resultados) {
    if (!resultados || resultados.length === 0) {
      return {
        totalEstudiantes: 0,
        porcentajePromedio: 0,
        distribucionValoraciones: {},
        rangosPorcentajes: { bajo: 0, basico: 0, alto: 0, superior: 0 }
      };
    }

    // Extrae porcentajes
    const porcentajes = resultados
      .map(r => r.porcentaje || 0)
      .filter(p => typeof p === 'number');

    // Calcula promedio
    const porcentajePromedio = porcentajes.length > 0
      ? Math.round(porcentajes.reduce((a, b) => a + b, 0) / porcentajes.length)
      : 0;

    // Distribuye por valoración
    const distribucionValoraciones = {};
    porcentajes.forEach(p => {
      const valoracion = getValoration(p);
      distribucionValoraciones[valoracion.label] =
        (distribucionValoraciones[valoracion.label] || 0) + 1;
    });

    // Rangos
    const rangosPorcentajes = {
      bajo: porcentajes.filter(p => p < 51).length,
      basico: porcentajes.filter(p => p >= 51 && p < 71).length,
      alto: porcentajes.filter(p => p >= 71 && p < 91).length,
      superior: porcentajes.filter(p => p >= 91).length
    };

    return {
      totalEstudiantes: resultados.length,
      porcentajePromedio,
      distribucionValoraciones,
      rangosPorcentajes
    };
  }

  /**
   * Obtiene análisis por sede
   * @param {Array} resultados - Array de resultados
   * @returns {Object} Mapa { sede: [resultados] }
   */
  static agruparResultadosPorSede(resultados) {
    const agrupado = {};

    resultados.forEach(resultado => {
      const sede = detectarSede(resultado.grado);

      if (!agrupado[sede]) {
        agrupado[sede] = [];
      }
      agrupado[sede].push(resultado);
    });

    return agrupado;
  }

  /**
   * Obtiene análisis de un estudiante específico
   * @param {string} zipgradeId - ID del estudiante en ZipGrade
   * @param {Array} resultados - Pool de resultados a buscar
   * @returns {Object|null} Resultado del estudiante o null
   */
  static obtenerAnalisisEstudiante(zipgradeId, resultados) {
    if (!zipgradeId || !resultados) return null;

    const resultado = resultados.find(r => r.zipgrade_id === zipgradeId);

    if (!resultado) return null;

    return {
      ...resultado,
      valoracion: getValoration(resultado.porcentaje || 0),
      sede: detectarSede(resultado.grado)
    };
  }

  /**
   * Calcula ranking de estudiantes
   * @param {Array} resultados - Array de resultados
   * @param {string} sortBy - Campo para ordenar ('porcentaje', 'nombre')
   * @returns {Array} Resultados ordenados con posición
   */
  static calcularRanking(resultados, sortBy = 'porcentaje') {
    if (!resultados || resultados.length === 0) return [];

    const sorted = [...resultados].sort((a, b) => {
      if (sortBy === 'porcentaje') {
        return (b.porcentaje || 0) - (a.porcentaje || 0);
      } else if (sortBy === 'nombre') {
        return normalizeText(a.nombre || '').localeCompare(
          normalizeText(b.nombre || '')
        );
      }
      return 0;
    });

    return sorted.map((resultado, index) => ({
      ...resultado,
      posicion: index + 1
    }));
  }
}

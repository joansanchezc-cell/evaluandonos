/**
 * Matriz de rangos por grado
 * Define las asignaturas y sus rangos de preguntas para cada grupo de grados
 * Fuente: index.html línea 2572
 */

export const MATRIZ_RANGOS = {
  '3-4': [
    { start: 1, end: 10, label: 'Matemáticas' },
    { start: 11, end: 20, label: 'Ciencias Sociales' },
    { start: 21, end: 30, label: 'Lenguaje' },
    { start: 31, end: 40, label: 'Biología' },
    { start: 41, end: 45, label: 'Inglés' }
  ],
  '5': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 40, label: 'Ciencias Sociales' },
    { start: 41, end: 60, label: 'Lenguaje' },
    { start: 61, end: 80, label: 'Biología' },
    { start: 81, end: 90, label: 'Inglés' }
  ],
  '6-9': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 40, label: 'Competencias Ciudadanas' },
    { start: 41, end: 60, label: 'Ciencias Sociales' },
    { start: 61, end: 80, label: 'Lenguaje' },
    { start: 81, end: 100, label: 'Biología' },
    { start: 101, end: 120, label: 'Inglés' }
  ],
  '10-11': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 30, label: 'Competencias Ciudadanas' },
    { start: 31, end: 50, label: 'Ciencias Sociales' },
    { start: 51, end: 70, label: 'Lenguaje' },
    { start: 71, end: 80, label: 'Biología' },
    { start: 81, end: 100, label: 'Inglés' }
  ]
};

/**
 * Obtiene la configuración de asignaturas para un grado
 * @param {string} grado - Grado (ej: "3", "5", "9", "10")
 * @returns {Array} Array de configuración de asignaturas
 */
export function obtenerConfigAsignaturas(grado) {
  if (!grado) return MATRIZ_RANGOS['6-9'];
  
  const g = parseInt(grado);
  
  if (g <= 4) return MATRIZ_RANGOS['3-4'];
  if (g === 5) return MATRIZ_RANGOS['5'];
  if (g <= 9) return MATRIZ_RANGOS['6-9'];
  return MATRIZ_RANGOS['10-11'];
}

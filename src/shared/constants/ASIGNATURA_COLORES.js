/**
 * Paleta de colores por asignatura
 * Utilizado en gráficos, badges y visualización de datos
 * Fuente: index.html línea 2965
 */

export const ASIGNATURA_COLORES = {
  "MATEMATICAS": "#2563eb",
  "CIENCIAS NATURALES": "#059669",
  "BIOLOGIA": "#059669",
  "QUIMICA": "#f59e0b",
  "FISICA": "#ef4444",
  "LENGUAJE": "#d946ef",
  "LECTURA CRITICA": "#8b5cf6",
  "CIENCIAS SOCIALES": "#7c3aed",
  "COMPETENCIAS CIUDADANAS": "#ca8a04",
  "INGLES": "#06b6d4",
  "FILOSOFIA": "#6366f1",
  "ETICA": "#84cc16"
};

/**
 * Color por defecto para asignaturas no reconocidas
 */
export const COLOR_DEFAULT = "#cbd5e1";

/**
 * Obtiene el color asociado a una asignatura
 * @param {string} nombre - Nombre de la asignatura
 * @returns {string} Código hex del color
 */
export function obtenerColorAsignatura(nombre) {
  if (!nombre) return COLOR_DEFAULT;
  
  const normalizado = nombre.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  // Búsqueda aproximada para mayor robustez
  if (normalizado.includes("COMPETENCIAS")) return ASIGNATURA_COLORES["COMPETENCIAS CIUDADANAS"];
  if (normalizado.includes("SOCIALES")) return ASIGNATURA_COLORES["CIENCIAS SOCIALES"];
  if (normalizado.includes("LECTURA")) return ASIGNATURA_COLORES["LECTURA CRITICA"];
  if (normalizado.includes("MATEMATICA")) return ASIGNATURA_COLORES["MATEMATICAS"];
  if (normalizado.includes("NATURALES")) return ASIGNATURA_COLORES["CIENCIAS NATURALES"];
  if (normalizado.includes("BIOLOGIA")) return ASIGNATURA_COLORES["BIOLOGIA"];

  return ASIGNATURA_COLORES[normalizado] || COLOR_DEFAULT;
}

/**
 * Datasource Supabase
 * Punto centralizado de conexión a la base de datos
 * Reemplaza las credenciales hardcodeadas en index.html
 * 
 * Mejora: Las credenciales pueden moverse a .env en Fase 6 (hardening)
 */

import { getSupabaseUrl, getSupabaseKey } from '../../shared/constants/CONFIG.js';

export class SupabaseDatasource {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Inicializa el cliente de Supabase
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Valida que supabase library esté disponible
      if (typeof supabase === 'undefined') {
        throw new Error('Supabase library no está cargada en index.html');
      }

      const url = getSupabaseUrl();
      const key = getSupabaseKey();

      if (!url || !key) {
        throw new Error('Credenciales de Supabase no configuradas');
      }

      this.client = supabase.createClient(url, key);
      this.initialized = true;
      console.log('✅ SupabaseDatasource inicializado');
    } catch (err) {
      console.error('❌ Error inicializando SupabaseDatasource:', err);
      throw err;
    }
  }

  /**
   * Obtiene el cliente de Supabase
   * @returns {Object} Cliente Supabase
   */
  getClient() {
    if (!this.initialized) {
      throw new Error('SupabaseDatasource no inicializado. Llama a initialize() primero.');
    }
    return this.client;
  }

  async validateConnection() {
    try {
      // Avoid querying tables that might be blocked by RLS for unauthenticated users
      const client = this.getClient();
      return !!client;
    } catch (err) {
      console.error('❌ Fallo validación de conexión Supabase:', err);
      return false;
    }
  }

  /**
   * Ejecuta query genérica (solo lectura)
   * @param {string} table - Nombre de tabla
   * @param {string} select - Columnas a seleccionar
   * @param {Object} filters - Filtros a aplicar
   * @returns {Promise<Object>} { data, error }
   */
  async query(table, select = '*', filters = {}) {
    try {
      let query = this.getClient().from(table).select(select);

      // Aplicar filtros
      Object.entries(filters).forEach(([column, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(column, value);
        }
      });

      return await query;
    } catch (err) {
      console.error(`❌ Error en query tabla ${table}:`, err);
      return { data: null, error: err };
    }
  }

  /**
   * Cierra conexión (si fuera necesario)
   */
  dispose() {
    this.client = null;
    this.initialized = false;
  }
}

// Singleton instance
export const supabaseDatasource = new SupabaseDatasource();

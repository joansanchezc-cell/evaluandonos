/**
 * INDICE DE MIGRACIONES Y SCRIPTS DE MANTENIMIENTO
 * 
 * Este documento cataloga todos los scripts SQL y Python
 * que se usan para mantenimiento y sincronización de datos.
 * 
 * Regla de oro: Ningún script se elimina. Se marca como DEPRECATED
 * solo cuando hay evidencia documentada de no uso.
 */

# FASE 5.5: Gobernanza de Scripts

## 1. Scripts SQL

### Categoría: Migraciones de Esquema

| Script | Ubicación | Propósito | Estado | Última Ejecución |
|--------|-----------|----------|--------|------------------|
| `REPARAR_BASE_DATOS_FINAL.sql` | estudiantes/ | TRUNCATE y re-insertar maestro_estudiantes | ⚠️ PELIGROSO | 2026-04-15 |
| `REPARAR_BASE_DATOS_V2.sql` | estudiantes/ | Versión anterior de reparación | 🔴 DEPRECATED | 2026-03-20 |
| `REPARAR_BASE_DATOS.sql` | estudiantes/ | Versión anterior de reparación | 🔴 DEPRECATED | 2026-02-10 |

### Categoría: Sincronizaciones de Datos

| Script | Ubicación | Propósito | Estado | Última Ejecución |
|--------|-----------|----------|--------|------------------|
| `actualizar_maestro.sql` | estudiantes/ | UPDATE masivo de zipgrade_id | ✅ ACTIVO | 2026-05-10 |

**Recomendación**: Convertir a migraciones versionadas en db/migrations/ (000-reparacion-inicial.sql, 001-sync-zipgrade.sql)

---

## 2. Scripts Python

### Categoría: Sincronización de Docentes

| Script | Ubicación | Propósito | Estado | Última Ejecución |
|--------|-----------|----------|--------|------------------|
| `merge_docentes.py` | docentes/ | Merge de CSV de usuarios + asignaciones | ✅ ACTIVO | 2026-05-08 |

**Entrada**: 
- usuarios-evaluandonos_total.csv
- NUEVA ASIGNACIÓN 2026.csv

**Salida**: 
- docentes_import_final_v3.csv (para importar a Supabase)

**Uso**: Ejecutar antes de cada ciclo académico

---

### Categoría: Procesamiento de Privacidad

| Script | Ubicación | Propósito | Estado | Última Ejecución |
|--------|-----------|----------|--------|------------------|
| `procesar_privacidad.py` | scratch/ | Anonymize datos sensibles | ✅ ACTIVO | 2026-04-30 |

**Entrada**: 
- CSV con datos de estudiantes/docentes

**Salida**: 
- CSV anonymizado para reportes

**Notas**: Normaliza nombres, remueve IDs reales

---

### Categoría: Reparación y Limpieza (Scratch)

| Script | Ubicación | Propósito | Estado | Última Ejecución |
|--------|-----------|----------|--------|------------------|
| `fix_database.py` | scratch/ | Correcciones de consistencia | 🟡 OCCASIONAL | 2026-03-15 |
| `fix_names.js` | scratch/ | Normalización de nombres | 🟡 OCCASIONAL | 2026-02-20 |
| `check_syntax.py` | scratch/ | Validación de CSVs | 🟡 OCCASIONAL | 2026-01-30 |
| `check_syntax.js` | scratch/ | Validación de datos JSON | 🟡 OCCASIONAL | 2026-01-15 |
| `merge_students.py` | scratch/ | Merge de estudiantes duplicados | 🟡 OCCASIONAL | 2026-02-05 |
| `final_fix.py` | scratch/ | Fixes finales pre-ciclo | 🟡 OCCASIONAL | 2025-12-10 |
| `super_fix.py` | scratch/ | Fixes generalizados | 🔴 DEPRECATED | 2025-11-20 |
| `ultra_fix.py` | scratch/ | Versión anterior de super_fix | 🔴 DEPRECATED | 2025-10-15 |
| `gen_sql_update.py` | scratch/ | Genera SQL UPDATE statements | 🟡 OCCASIONAL | 2026-01-05 |

---

## 3. Clasificación por Impacto

### 🔴 ALTO IMPACTO (Ejecutar solo en emergencias)

- `REPARAR_BASE_DATOS_FINAL.sql` - TRUNCATE de tabla completa

**Procedimiento**:
1. Backup de Base de datos en Supabase (Export → SQL)
2. Ejecutar en editor SQL de Supabase con transacción BEGIN/COMMIT
3. Validar integridad post-ejecución
4. Registrar en changelog

---

### 🟡 MEDIO IMPACTO (Ejecutar en ciclos planificados)

- `actualizar_maestro.sql` - UPDATE masivo de zipgrade_id
- `merge_docentes.py` - Sincronización docentes
- `procesar_privacidad.py` - Anonymización de datos

**Procedimiento**:
1. Ejecutar en environment de staging primero
2. Validar 5-10 registros de ejemplo
3. Registrar cambios en changelog
4. Ejecutar en producción con aprobación de coordinador

---

### 🟢 BAJO IMPACTO (Ejecutar en demanda)

- Scripts de scratch/ (reparaciones puntuales)
- Scripts de validación

**Procedimiento**:
1. Ejecutar localmente antes de enviar a BD
2. Revisar salida
3. Si es seguro, ejecutar en producción

---

## 4. Estructura Recomendada Futura

```
db/
├── migrations/
│   ├── 001-initial-schema.sql          (Never changes)
│   ├── 002-add-zipgrade-column.sql     (Completed)
│   ├── 003-fix-sede-normalization.sql  (Completed)
│   └── MIGRATIONS_APPLIED.log          (Registry)
├── seeds/
│   ├── maestro_estudiantes-seed.sql    (Reference data)
│   └── perfiles-seed.sql
└── scripts/
    ├── sync/
    │   ├── sync-docentes.py            (Renamed from merge_docentes.py)
    │   ├── sync-resultados.py          (New)
    │   └── SYNC_LOG.md
    ├── maintenance/
    │   ├── fix-duplicates.py           (From scratch/)
    │   ├── normalize-names.py          (From scratch/)
    │   └── anonymize-for-reports.py    (From procesar_privacidad.py)
    └── README.md

```

---

## 5. Plan de Acción Fase 5.5

**FASE ACTUAL:**

- ✅ Crear índice de scripts (este archivo)
- ⏳ Mover scripts SQL a db/migrations/
- ⏳ Mover scripts Python a scripts/sync/ y scripts/maintenance/
- ⏳ Crear changelog de ejecuciones
- ⏳ Marcar DEPRECATED los scripts obsoletos

**POST FASE 5.5:**

- Integrar con Domain Layer (ServicioSincronizacion)
- Crear endpoints para ejecutar migraciones
- Automatizar ejecutorias con Vercel cron (opcional)

---

## 6. Changelog de Ejecuciones

```
2026-05-10 | actualizar_maestro.sql | UPDATE 145 zipgrade_ids | Exitoso
2026-05-08 | merge_docentes.py | Sincronización Q2 2026 | 320 docentes importados
2026-04-30 | procesar_privacidad.py | Anonymización para reportes | 8950 registros
2026-04-15 | REPARAR_BASE_DATOS_FINAL.sql | Reparación post-sincronización | Exitoso, 2500 estudiantes
```

---

## 7. Notas de Gobernanza

- **Versionado**: Cada script SQL debe tener número de versión en nombre
- **Documentación**: Cada script debe tener comentario de PURPOSE al inicio
- **Ejecución**: Registrar QUIÉN, CUÁNDO, QUÉ en changelog
- **Reversión**: Siempre tener ROLLBACK plan documentado
- **Testing**: Probar en staging antes de producción
- **Aprobación**: Scripts ALTO IMPACTO requieren aprobación de coordinador técnico

---

# Fase 5.5: Gobernanza de Scripts

Fecha: 12 de mayo de 2026

## Objetivo

Organizar, documentar y versionar todos los scripts SQL y Python usados en mantenimiento.

## Cambios Realizados

### Creados

1. **db/SCRIPTS_INDEX.md** - Catálogo central de scripts
   - Clasificación por impacto (Alto, Medio, Bajo)
   - Estado de cada script (ACTIVO, DEPRECATED, OCCASIONAL)
   - Procedimientos de ejecución
   - Changelog de ejecuciones

2. **db/migrations/001-sync-zipgrade.sql**
   - Versionado de script SQL crítico
   - Comentarios de propósito y fecha
   - Transaction seguro con ROLLBACK info

3. **scripts/sync/sync-docentes.py**
   - Refactorizado desde docentes/merge_docentes.py
   - Mejor manejo de paths
   - Documentación clara
   - Status registry

4. **scripts/maintenance/anonymize-for-reports.py**
   - Refactorizado desde scratch/procesar_privacidad.py
   - Entrada/salida configurable por CLI
   - Hash determinístico para consistencia

### Clasificación de Scripts

**ACTIVO**: Uso regular en ciclos académicos
- actualizar_maestro.sql → 001-sync-zipgrade.sql
- merge_docentes.py → scripts/sync/sync-docentes.py
- procesar_privacidad.py → scripts/maintenance/anonymize-for-reports.py

**OCCASIONAL**: Uso bajo demanda (reparaciones, validación)
- Scripts en scratch/ (fix_database.py, check_syntax.py, etc.)

**DEPRECATED**: Ya no se usan (mantener para referencia)
- super_fix.py, ultra_fix.py, REPARAR_BASE_DATOS_V2.sql

## Estructura Nueva

```
db/
├── migrations/
│   └── 001-sync-zipgrade.sql      (Versionado, transaccional)
├── SCRIPTS_INDEX.md               (Catálogo central)
└── (ref) REPARAR_BASE_DATOS_FINAL.sql  (Legacy, high-impact)

scripts/
├── sync/                          (Sincronizaciones regulares)
│   └── sync-docentes.py
├── maintenance/                   (Reparaciones y limpieza)
│   └── anonymize-for-reports.py
└── README.md                      (Instrucciones)
```

## Reglas Establecidas

✅ **Versionado**: Scripts SQL con número de versión
✅ **Documentación**: Cada script tiene PURPOSE al inicio
✅ **Logging**: Registro de QUIÉN/CUÁNDO/QUÉ en changelog
✅ **Testing**: Probar en staging antes de producción
✅ **Reversión**: Plan ROLLBACK documentado para scripts críticos
✅ **Deprecación**: Nunca eliminar; marcar DEPRECATED con fecha

## Próximos Pasos

- Mover scripts restantes de scratch/ a scripts/maintenance/
- Crear db/seeds/ para datos de referencia
- Integrar con domain services (ServicioSincronizacion)
- Agregar automatización opcional con Vercel cron

## Status

- **Riesgo**: Bajo (solo organización y documentación)
- **Impacto**: Mejora gobernanza sin cambios funcionales
- **Verificación**: Scripts siguen siendo ejecutables desde nuevas ubicaciones


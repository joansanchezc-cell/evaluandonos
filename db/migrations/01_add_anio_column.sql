-- Migración: Añadir columna `anio` para manejo de histórico (Multi-tenant por año)
-- Ejecutar esto en el SQL Editor de Supabase

-- 1. eval_resultados
ALTER TABLE eval_resultados ADD COLUMN IF NOT EXISTS anio int2 DEFAULT 2026;
UPDATE eval_resultados SET anio = 2026 WHERE anio IS NULL;

-- 2. eval_preguntas
ALTER TABLE eval_preguntas ADD COLUMN IF NOT EXISTS anio int2 DEFAULT 2026;
UPDATE eval_preguntas SET anio = 2026 WHERE anio IS NULL;

-- 3. eval_estudiantes_notas
ALTER TABLE eval_estudiantes_notas ADD COLUMN IF NOT EXISTS anio int2 DEFAULT 2026;
UPDATE eval_estudiantes_notas SET anio = 2026 WHERE anio IS NULL;

-- 4. maestro_estudiantes
ALTER TABLE maestro_estudiantes ADD COLUMN IF NOT EXISTS anio int2 DEFAULT 2026;
UPDATE maestro_estudiantes SET anio = 2026 WHERE anio IS NULL;

-- 5. eval_estudiantes_completos
ALTER TABLE eval_estudiantes_completos ADD COLUMN IF NOT EXISTS anio int2 DEFAULT 2026;
UPDATE eval_estudiantes_completos SET anio = 2026 WHERE anio IS NULL;

-- OPCIONAL: Para asegurar integridad, se puede hacer que la columna no sea nula a futuro
-- ALTER TABLE eval_resultados ALTER COLUMN anio SET NOT NULL;

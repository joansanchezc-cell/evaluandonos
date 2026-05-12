# db

Gobernanza de scripts SQL y activos de base de datos.

## Estructura

- migrations: cambios versionados del esquema y evolutivos.
- repairs: reparaciones puntuales con trazabilidad.
- seeds: datos de prueba/control para validaciones.

## Reglas

1. No ejecutar scripts destructivos sin respaldo y plan de rollback.
2. Toda reparacion debe registrar fecha, motivo y resultado.
3. No borrar scripts existentes en esta etapa; mover a deprecated si aplica.

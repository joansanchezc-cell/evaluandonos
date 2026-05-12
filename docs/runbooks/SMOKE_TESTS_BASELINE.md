# SMOKE TESTS BASELINE

Objetivo: validar no regresion funcional en cada fase de migracion.

## Flujos criticos

1. Acceso/autenticacion de docente.
2. Carga de grados y asignaturas.
3. Visualizacion de analisis y estadisticas.
4. Generacion/consulta de reportes principales.
5. Comportamiento PWA base (carga y cache minimo).

## Procedimiento

1. Ejecutar flujo en version base y registrar evidencia.
2. Ejecutar el mismo flujo tras cada cambio.
3. Comparar resultado funcional, mensajes de error y tiempos percibidos.
4. Si hay desviacion no esperada, detener avance y corregir.

## Criterio de aprobacion

- 100 por ciento de flujos criticos sin ruptura.
- Sin errores bloqueantes en consola para flujo principal.

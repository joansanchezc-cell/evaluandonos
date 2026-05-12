# ESTADO TECNICO DEL PROYECTO EVALUANDONOS

Fecha: 12 de mayo de 2026
Estado general: Operativo en produccion, con deuda tecnica alta por arquitectura monolitica.

## 1. Resumen Ejecutivo

El proyecto funciona actualmente y cumple su objetivo funcional principal (gestion y analisis de evaluaciones). Sin embargo, la base de codigo presenta un nivel alto de acoplamiento tecnico: la mayor parte de la logica de negocio, acceso a datos y renderizado de interfaz se encuentra concentrada en un unico punto de entrada.

Esto incrementa riesgo de regresiones, dificulta el mantenimiento, retrasa nuevas funcionalidades y complica el onboarding. Se recomienda una migracion incremental con estrategia strangler para pasar a una arquitectura limpia de nivel mid-level, sin romper la operacion existente.

## 2. Contexto de Operacion

- Frontend: HTML/CSS/JS con logica principal concentrada.
- Base de datos: Supabase.
- Hosting/Deploy: Vercel.
- Repositorio: GitHub.
- Referencias de UX mobile: mockups en carpeta app evaluandonos.

## 3. Diagnostico Tecnico Actual (AS-IS)

### 3.1 Hallazgos principales

1. Monolito funcional con concentracion de logica en index.html.
2. Mezcla de responsabilidades en la misma capa:
- presentacion (DOM/UI)
- acceso a datos (queries/cliente Supabase)
- reglas de negocio (calculo/analitica)
3. Estado global y funciones extensas con alto acoplamiento.
4. Scripts de soporte y reparacion dispersos en varias carpetas.
5. Backups y versiones historicas dentro del repo activo.

### 3.2 Riesgos

- Riesgo de regresion alto ante cambios pequenos.
- Mantenimiento costoso por falta de separacion por capas.
- Dificultad para pruebas automatizadas aisladas.
- Trazabilidad parcial de scripts de reparacion de datos.
- Riesgo operativo por activos legacy no clasificados formalmente.

### 3.3 Fortalezas

- Aplicacion actualmente operativa.
- Flujo de despliegue existente en Vercel.
- Base de datos en servicio administrado (Supabase).
- Material de diseno mobile ya disponible como referencia.

## 4. Inventario Tecnico Resumido

### 4.1 Runtime principal

- index.html: shell + logica concentrada (monolito actual).
- style.css: estilos base.
- app.js: punto de entrada potencial para modularizacion.
- sw.js + manifest.json + app-manifest.json: capacidades PWA.

### 4.2 Datos, scripts y soporte

- estudiantes/*.sql: scripts de actualizacion/reparacion.
- docentes/merge_docentes.py: mantenimiento de informacion.
- scratch/*: utilidades de diagnostico y reparacion puntual.

### 4.3 UX y prototipos

- app evaluandonos/*/code.html: mockups mobile reutilizables.
- app evaluandonos/modern_educational_analytics/DESIGN.md: guia visual de referencia.

### 4.4 Historial y respaldo

- versiones de respaldo/: snapshots historicos dentro del repo activo.

## 5. Nivel Objetivo (TO-BE): Mid-Level

Se busca una madurez tecnica mid-level con:

1. Arquitectura por capas con responsabilidades claras.
2. Convenciones de codigo y revisiones de cambio estandarizadas.
3. Pruebas minimas por modulo migrado (smoke + integracion selectiva).
4. Trazabilidad de cambios y criterio de rollback por release.
5. Politica formal para legado (deprecacion antes de eliminacion).

## 6. Arquitectura Objetivo (Clean Architecture)

Propuesta de estructura objetivo inicial:

src/
- presentation/
  - controllers/
  - views/
  - state/
- domain/
  - entities/
  - use-cases/
  - services/
- data/
  - repositories/
  - datasources/
- shared/
  - constants/
  - utils/

docs/
- arquitectura
- decisiones tecnicas
- runbooks

db/
- migrations/
- repairs/
- seeds/

scripts/
- maintenance/
- diagnostics/
- deprecated/

## 7. Estrategia de Migracion

Estrategia: incremental por fases, sin freeze total, sin reescritura big-bang.

### Fase 0. Baseline y resguardo funcional

- Documentar flujos criticos actuales (login, carga de grados, analisis, reportes, PWA base).
- Registrar evidencia de funcionamiento para comparacion post-cambio.

### Fase 1. Fundacion documental y normas

- Definir convenciones de capas, nombres y contratos.
- Publicar AGENTS.md con reglas obligatorias de cambio seguro.

### Fase 2. Estructura sin mover logica critica

- Crear carpetas destino y contratos base.
- Preparar entrada modular con ES Modules nativos.

### Fase 3. Extraccion segura desde monolito

Orden recomendado:
1. constants y utils puras
2. data (cliente y repositorios)
3. domain (casos de uso)
4. presentation (controladores y render)

Regla: mantener index.html como shell hasta lograr paridad funcional.

### Fase 4. Normalizacion de estilos y UI

- Separar estilos por responsabilidades.
- Reutilizar componentes de mockups mobile sin romper desktop.

### Fase 5. Gobernanza de scripts y SQL

- Clasificar scripts por uso real.
- Versionar SQL de cambios en db/migrations.
- Mover scripts legacy a carpeta deprecated con etiqueta explicita.

### Fase 6. Hardening

- Revisar secretos/configuracion y manejo de entorno.
- Establecer checklists de seguridad y release.

### Fase 7. Rollout progresivo

- Liberacion por modulos con smoke tests por fase.
- Rollback definido por release/tag.

## 8. Politica de Activos Legacy

Regla vigente para esta etapa:

- No eliminar archivos por defecto.
- Primero deprecar, documentar y comprobar no uso.
- Solo considerar eliminacion en una etapa futura con evidencia tecnica y aprobacion.

## 9. Criterios de Exito de la Migracion

1. Paridad funcional comprobada en flujos criticos.
2. Separacion real de capas (presentation/domain/data/shared).
3. Reduccion de riesgo de regresion por cambios locales.
4. Tiempos de mantenimiento y entrega mas predecibles.
5. Onboarding tecnico mas rapido para nuevos desarrolladores.

## 10. Proximos Pasos Inmediatos

1. Alinear equipo con AGENTS.md y checklists de cambio.
2. Crear estructura src/ por capas (sin mover logica aun).
3. Iniciar Fase 3 con extraccion de constants y utils puras.
4. Validar cada paso contra baseline funcional antes de continuar.

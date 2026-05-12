# Fase 6: Presentation Controllers

Fecha: 12 de mayo de 2026

## Objetivo

Crear controladores que vinculen eventos HTML con domain services. 
Los controllers son la cara visible de la arquitectura limpia.

## Módulos Creados

### src/presentation/controllers/

- **AuthController.js**: Gestiona autenticación
  - `bindLoginEstudiante()` - Vincula formulario de estudiante
  - `bindLoginDocente()` - Vincula formulario de docente
  - `bindLogout()` - Vincula botón de logout
  - `validarSesionExistente()` - Chequea sesión activa
  - Métodos de UI: mostrarError, mostrarExito, mostrarVistaLogin, mostrarVistaPrincipal

- **AnalisisController.js**: Gestiona análisis de resultados
  - `bindSelectGrado()` - Selección de grado
  - `bindSelectPeriodo()` - Selección de período
  - `bindBtnCargarAnalisis()` - Carga y procesa análisis
  - `renderizarEstadisticas()` - Renderiza tarjetas de stats
  - `renderizarTablaResultados()` - Renderiza tabla de ranking
  - `cargarGradosDisponibles()` - Llena select dinámicamente
  - `cargarPeriodosDisponibles()` - Llena select dinámicamente

### src/presentation/controllers/index.js

- Barrel export

### src/app.js

- **Punto de entrada de la aplicación**
- Inicializa Supabase
- Inicializa Controllers (automáticamente se enganchan a eventos HTML)
- Valida conexión

## Flujo de Ejecución

```
index.html (carga)
    ↓
<script type="module" src="./src/app.js">
    ↓
initApp()
    ├─ supabaseDatasource.initialize()
    ├─ authController.init()
    │   ├─ bindLoginEstudiante() → vincula btn-login-estudiante
    │   ├─ bindLoginDocente() → vincula form-login-docente
    │   └─ bindLogout() → vincula btn-logout
    ├─ analisisController.init()
    │   ├─ cargarPeriodosDisponibles() → llena select-periodo
    │   ├─ cargarGradosDisponibles() → llena select-grado
    │   ├─ bindSelectGrado() → escucha cambios
    │   ├─ bindSelectPeriodo() → escucha cambios
    │   └─ bindBtnCargarAnalisis() → ejecuta análisis
    └─ ✨ App lista

Usuario interactúa:
    ↓
Evento HTML (click, change)
    ↓
Controller captura evento
    ↓
Controller llama Domain Service
    ↓
Service usa Repository
    ↓
Repository usa Supabase
    ↓
Datos vuelven → Controller renderiza UI
```

## Cómo Usar en index.html

### 1. Agregar script al footer de index.html

```html
<!-- Antes del cierre de </body> -->
<script type="module" src="./src/app.js"></script>
```

### 2. Crear elementos HTML con IDs correctos

```html
<!-- LOGIN SECCIÓN -->
<section id="section-login">
  <h1>Evaluándonos</h1>
  
  <!-- Login Estudiante -->
  <div id="estudiante-tab">
    <input id="input-id-estudiante" placeholder="Ingresa tu ID">
    <button id="btn-login-estudiante">Ingresar</button>
  </div>

  <!-- Login Docente -->
  <div id="docente-tab">
    <form id="form-login-docente">
      <input id="input-email-docente" type="email" placeholder="Email">
      <input id="input-password-docente" type="password" placeholder="Contraseña">
      <button type="submit">Ingresar</button>
    </form>
  </div>
</section>

<!-- MAIN SECTION (se muestra después de login) -->
<section id="section-main" style="display: none;">
  <button id="btn-logout">Cerrar Sesión</button>

  <!-- Análisis -->
  <div id="analisis-section">
    <select id="select-periodo"></select>
    <select id="select-grado"></select>
    <button id="btn-cargar-analisis">Cargar Análisis</button>

    <div id="stats-container"></div>
    <div id="resultados-container"></div>
  </div>
</section>

<!-- Mensajes -->
<div id="error-message" style="display: none; color: red;"></div>
<div id="success-message" style="display: none; color: green;"></div>
```

### 3. Eventos se enganchan automáticamente

No necesitas escribir JavaScript adicional. Los controllers se encargan de todo.

## Estado

- **Riesgo**: Bajo (controllers están listos pero no integrados a index.html aún)
- **Monolito**: Aún intacto
- **Integración**: Agregar 1 línea a index.html: `<script type="module" src="./src/app.js"></script>`

## Próximos Pasos

- Integración gradual en index.html
- Crear más controllers (SincronizacionController, ReportesController, etc.)
- Agregar formularios reactivos
- Testing de controllers


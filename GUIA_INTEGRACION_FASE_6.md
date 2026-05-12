# Guía de Integración: Activar Arquitectura Limpia en index.html

**Status**: ✅ LISTA PARA INTEGRACIÓN
**Riesgo**: BAJO (cambios mínimos, reversibles)
**Tiempo estimado**: 15-30 min

---

## 📋 Resumen

Toda la arquitectura limpia (Data + Domain + Presentation) está lista en `src/`.
Para activarla, solo necesitas **agregar 1 línea a index.html** y **actualizar algunos IDs de HTML**.

---

## Paso 1: Agregar Script de Inicialización

**Ubicación**: Footer de `index.html`, antes de `</body>`

```html
<!-- AGREGAR ESTO AL FINAL DEL ARCHIVO, ANTES DE </body> -->
<script type="module" src="./src/app.js"></script>
```

**Efecto**: 
- ✅ Inicializa Supabase automáticamente
- ✅ Vincula todos los controllers a eventos HTML
- ✅ App está lista para usar

---

## Paso 2: Reemplazar Secciones HTML (Gradualmente)

### Opción A: Reemplazo Completo (Más Rápido)

Reemplaza toda la sección de login por esta (idéntica funcionalmente):

```html
<!-- SECCIÓN LOGIN (reemplazar la sección existente de login) -->
<section id="section-login" class="login-container">
  <div class="login-box">
    <h1>Evaluándonos 2026</h1>
    
    <!-- Tabs de selección -->
    <div class="login-tabs">
      <button class="tab-btn active" data-tab="estudiante">Estudiante</button>
      <button class="tab-btn" data-tab="docente">Docente</button>
    </div>

    <!-- Tab Estudiante -->
    <div id="estudiante-tab" class="tab-content active">
      <h2>Ingresa tu Identificación</h2>
      <input 
        id="input-id-estudiante" 
        type="text" 
        placeholder="Ej: 1061765779"
        autocomplete="off"
      >
      <button id="btn-login-estudiante" class="btn-primary">
        Ingresar
      </button>
    </div>

    <!-- Tab Docente -->
    <div id="docente-tab" class="tab-content">
      <h2>Acceso de Docente</h2>
      <form id="form-login-docente">
        <input 
          id="input-email-docente" 
          type="email" 
          placeholder="Email"
          autocomplete="email"
          required
        >
        <input 
          id="input-password-docente" 
          type="password" 
          placeholder="Contraseña"
          autocomplete="current-password"
          required
        >
        <button type="submit" class="btn-primary">
          Ingresar
        </button>
      </form>
    </div>
  </div>

  <!-- Mensajes -->
  <div id="error-message" class="message error" style="display: none;"></div>
  <div id="success-message" class="message success" style="display: none;"></div>
</section>
```

### Opción B: Agregar IDs a HTML Existente (Menos Invasivo)

Si prefieres no reemplazar, simplemente agrega estos IDs a elementos existentes:

```html
<!-- En tu input de ID estudiante -->
<input id="input-id-estudiante" ... >

<!-- En tu botón de ingreso de estudiante -->
<button id="btn-login-estudiante" ... >Ingresar</button>

<!-- En tu formulario de docente -->
<form id="form-login-docente" ... >
  <input id="input-email-docente" ... >
  <input id="input-password-docente" ... >
  <button type="submit">Ingresar</button>
</form>

<!-- Botón logout (agregar en header/navbar) -->
<button id="btn-logout" style="display: none;">
  Cerrar Sesión
</button>

<!-- Divs para mensajes -->
<div id="error-message" style="display: none; color: red;"></div>
<div id="success-message" style="display: none; color: green;"></div>
```

---

## Paso 3: Agregar Sección de Análisis

**Ubicación**: Después de la sección de login, dentro de `section-main`

```html
<!-- SECCIÓN ANÁLISIS (reemplazar o actualizar la sección existente) -->
<section id="section-main" class="main-container" style="display: none;">
  <div class="header">
    <h1>Análisis de Resultados</h1>
    <button id="btn-logout" class="btn-logout">Cerrar Sesión</button>
  </div>

  <div class="analisis-container">
    <!-- Filtros -->
    <div class="filtros">
      <div class="filter-group">
        <label for="select-periodo">Período:</label>
        <select id="select-periodo"></select>
      </div>

      <div class="filter-group">
        <label for="select-grado">Grado:</label>
        <select id="select-grado">
          <option value="">-- Selecciona grado --</option>
        </select>
      </div>

      <button id="btn-cargar-analisis" class="btn-primary">
        Cargar Análisis
      </button>
    </div>

    <!-- Estadísticas -->
    <div id="stats-container" class="stats-section"></div>

    <!-- Tabla de Resultados -->
    <div id="resultados-container" class="resultados-section"></div>
  </div>

  <!-- Mensajes -->
  <div id="error-message" class="message error" style="display: none;"></div>
  <div id="success-message" class="message success" style="display: none;"></div>
</section>
```

---

## Paso 4: CSS Sugerido (Opcional)

Agrega estilos mínimos para que se vea bien:

```css
/* Estilos para controllers */

.login-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 8px;
}

.login-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 10px 20px;
  background: #ddd;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.tab-btn.active {
  background: #007bff;
  color: white;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.message {
  padding: 15px;
  margin-top: 20px;
  border-radius: 4px;
  text-align: center;
}

.message.error {
  background: #fee;
  color: #c33;
}

.message.success {
  background: #efe;
  color: #3c3;
}

.btn-primary {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary:hover {
  background: #0056b3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
}

.resultados-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.resultados-table th,
.resultados-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.resultados-table th {
  background: #007bff;
  color: white;
}

.resultados-table tr:hover {
  background: #f5f5f5;
}

.nivel-superior { color: green; font-weight: bold; }
.nivel-alto { color: blue; }
.nivel-basico { color: orange; }
.nivel-bajo { color: red; }
```

---

## Paso 5: Verificación

Después de hacer los cambios, abre la Developer Console (F12):

✅ **Busca estos mensajes en Console**:
```
🚀 Inicializando Evaluándonos...
🔌 Conectando a Supabase...
✅ Supabase conectado
🎮 Inicializando Controllers...
🔐 AuthController inicializado
📊 AnalisisController inicializado
✅ Controllers inicializados
✨ Aplicación lista
```

✅ **Prueba la funcionalidad**:
1. Ingresa con ID de estudiante (ej: 1061765779)
2. Verifica que login funcione
3. Selecciona grado y período
4. Haz clic en "Cargar Análisis"
5. Verifica que datos aparezcan

❌ **Si hay errores**:
- Abre DevTools (F12)
- Busca mensajes de error en Console (rojo)
- Verifica que todos los IDs de HTML coincidan con los del código

---

## Rollback Plan (Si Algo Falla)

Si algo no funciona:

```bash
# 1. Revertir cambios a index.html
git checkout index.html

# 2. O eliminar la línea del script que agregaste
```

La arquitectura es 100% reversible porque no modificamos el monolito.

---

## Próximos Pasos (Después de Integración)

- [ ] Completar sección de reportes (Fase 7)
- [ ] Agregar módulos CSS (Fase 7)
- [ ] Testing automatizado (Fase 8)
- [ ] Migración del resto de la lógica (Fase 9+)

---

## Checklist de Integración

- [ ] Agregar `<script type="module" src="./src/app.js"></script>` al footer
- [ ] Actualizar IDs HTML (login, análisis, mensajes)
- [ ] Agregar CSS (opcional)
- [ ] Abrir DevTools y verificar mensajes de inicio
- [ ] Probar login con estudiante
- [ ] Probar análisis de grado
- [ ] Verificar que no hay errores en console
- [ ] Probar logout
- [ ] Verificar que monolito sigue 100% funcional en paralelo

---

**⚠️ IMPORTANTE**: 
Los controllers y la arquitectura limpia corren EN PARALELO con el monolito.
Puedes usar ambos simultáneamente sin problemas.
Gradualmente vas reemplazando secciones del monolito a medida que la nueva arquitectura demuestre paridad.


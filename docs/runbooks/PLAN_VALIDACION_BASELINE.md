# PLAN DE VALIDACION DE BASELINE FUNCIONAL

Fecha: 12 de mayo de 2026
Estado: Listo para ejecución manual

## Objetivo

Confirmar que después de las Fases 1-3 (documentación + estructura + extracción de constantes/utils):
- El monolito [index.html](../../../index.html) sigue **100% operativo**
- No hay regresiones en flujos críticos
- No hay ruptura en integración con Supabase
- PWA y offline mode siguen funcionales
- Despliegue en Vercel no se ve afectado

## Flujos Críticos a Validar

### 1. Autenticación Docente
**Duración**: 2-3 minutos
**Prerequisitos**: Acceso a credenciales de docente de prueba (o usar test)

**Pasos**:
1. Abre [https://evaluandonos.vercel.app](https://evaluandonos.vercel.app) (producción)
2. Pestaña: "DOCENTE"
3. Ingresa email: [usar credencial de prueba]
4. Ingresa contraseña: [usar credencial de prueba]
5. Haz click "Iniciar Sesión"

**Criterios de éxito**:
- ✅ Login sin errores
- ✅ Pantalla principal carga (análisis, estadísticas, opciones)
- ✅ No hay alertas de error en consola (F12)
- ✅ Token se guarda en localStorage

**Evidencia a registrar**:
- Screenshot de página cargada
- Timestamp de login
- Versión de navegador

---

### 2. Carga de Grados y Asignaturas
**Duración**: 1-2 minutos
**Prerequisitos**: Haber completado login docente

**Pasos**:
1. En sección "Análisis" → dropdown "Seleccione grado"
2. Abre el dropdown y verifica que se cargan grados
3. Selecciona un grado (ej: "3", "5", "9", "10")
4. Verifica que se cargan asignaturas en segundo dropdown

**Criterios de éxito**:
- ✅ Dropdown de grados se carga sin demora > 2s
- ✅ Al seleccionar grado, asignaturas aparecen instantáneamente
- ✅ Colores de asignaturas coinciden con paleta ASIGNATURA_COLORES
- ✅ Sin errores en consola

**Evidencia a registrar**:
- Screenshot de grados cargados
- Screenshot de asignaturas seleccionadas
- Tiempo de carga percibido

---

### 3. Visualización de Análisis
**Duración**: 2-3 minutos
**Prerequisitos**: Grado y asignatura seleccionados

**Pasos**:
1. Con grado y asignatura seleccionados, observa carga de gráficos
2. Verifica que aparecen gráficos (barras, líneas, o estadísticas)
3. Haz scroll en tabla de alumnos y verifica carga incremental
4. Abre pestaña "Estadísticas" y verifica que carga datos

**Criterios de éxito**:
- ✅ Gráficos cargan en < 3 segundos
- ✅ Tabla de alumnos es interactiva (scroll, click)
- ✅ Estadísticas muestran números sin NaN o undefined
- ✅ Sin errores de Supabase en consola

**Evidencia a registrar**:
- Screenshot de análisis cargado
- Screenshot de estadísticas
- Timestamp de carga

---

### 4. Reportes (PDF/Impresión)
**Duración**: 2 minutos
**Prerequisitos**: Haber navegado análisis

**Pasos**:
1. Pestaña "Informes" (si es accesible para rol)
2. Selecciona grado y tipo de reporte
3. Haz clic "Generar Reporte"
4. Verifica que aparecen datos en contenedor
5. Prueba "Imprimir" (Ctrl+P o botón)

**Criterios de éxito**:
- ✅ Reporte genera en < 2 segundos
- ✅ PDF/print preview muestra datos correctamente formateados
- ✅ Sin saltos de página inesperados
- ✅ Estilos de impresión aplican correctamente

**Evidencia a registrar**:
- Screenshot de reporte generado
- Screenshot de preview de impresión

---

### 5. PWA - Instalación y Modo Offline
**Duración**: 3-5 minutos
**Prerequisitos**: Navegador que soporte PWA (Chrome, Edge, Firefox)

**Pasos**:
1. En navegador (Chrome), busca botón de instalación (esquina superior derecha)
2. O accede desde menú: Más > Instalar app
3. Completa instalación
4. Desconecta internet (modo avión o desactiva WiFi)
5. Abre la app instalada
6. Verifica que carga la última pantalla accedida (cache)

**Criterios de éxito**:
- ✅ App se instala sin errores
- ✅ Funciona en modo offline (al menos shell)
- ✅ Service Worker está activo (DevTools > Application > Service Workers)
- ✅ Cache contiene archivos principales

**Evidencia a registrar**:
- Screenshot de app instalada en escritorio
- Screenshot de DevTools mostrando Service Worker
- Confirmación de carga offline

---

### 6. Comportamiento en Diferentes Dispositivos (Mobile)
**Duración**: 3 minutos
**Prerequisitos**: Navegador con mode responsive o dispositivo real

**Pasos**:
1. Abre DevTools (F12)
2. Activa modo Responsive Design (Ctrl+Shift+M)
3. Selecciona tamaño mobile (ej: iPhone 12, 390x844)
4. Recarga página (F5)
5. Verifica que layout es responsive (no hay overflow horizontal)
6. Prueba tap en botones y verificación de texto

**Criterios de éxito**:
- ✅ Menú mobile aparece y es accesible
- ✅ No hay overflow horizontal
- ✅ Texto es legible (tamaño mínimo 12px)
- ✅ Botones son tapeable (mínimo 48x48px)

**Evidencia a registrar**:
- Screenshot de layout mobile
- Screenshot de menú mobile
- Confirmación de tapabilidad

---

## Checklist de Validación

Marca cada uno a medida que validas:

```
FLUJO 1 - Autenticación Docente
- [ ] Login exitoso
- [ ] Token en localStorage
- [ ] Sin errores de consola
- [ ] Evidencia registrada

FLUJO 2 - Carga de Grados/Asignaturas
- [x ] Grados cargan (cargan grados que no existen)
- [ ] Asignaturas cargan
- [ ] Colores correctos
- [ x] Sin errores
- [ ] Evidencia registrada

FLUJO 3 - Análisis y Estadísticas
- [ ] Gráficos cargan
- [ ] Tabla interactiva
- [ ] Datos sin NaN
- [ ] Sin errores Supabase
- [ ] Evidencia registrada

FLUJO 4 - Reportes
- [ ] Reporte genera
- [ ] Formato correcto
- [ ] Print preview OK
- [ ] Evidencia registrada

FLUJO 5 - PWA Offline
- [ ] App instala
- [ ] Funciona offline
- [ ] Service Worker activo
- [ ] Cache presente
- [ ] Evidencia registrada

FLUJO 6 - Mobile Responsive
- [ ] Layout responsive
- [ ] Menú mobile funciona
- [ ] Texto legible
- [ ] Botones tapeable
- [ ] Evidencia registrada
```

## Procedimiento de Validación

### Paso 1: Preparación
1. Abre navegador (Chrome recomendado)
2. Abre [https://evaluandonos.vercel.app](https://evaluandonos.vercel.app)
3. Abre DevTools (F12) en pestaña "Console"

### Paso 2: Ejecuta Flujos en Orden
- Ve por cada flujo de arriba
- Marca checkboxes según criterios de éxito
- Captura screenshots o notas de cada paso

### Paso 3: Registra Evidencia
Crea archivo `docs/runbooks/BASELINE_VALIDATION_LOG.md` con:
```markdown
# Log de Validación Baseline

Fecha: [hoy]
Responsable: [tu nombre]
Versión de app: v96
Navegador: Chrome 130.x

## Resultados

### Flujo 1 - Autenticación ✅/❌
[Resumen de resultado]
[Screenshots si aplica]

### Flujo 2 - Grados/Asignaturas ✅/❌
[Resumen]

[... etc]

## Conclusión
Estado general: ✅ VALIDADO / ❌ ENCONTRADOS PROBLEMAS
Próximo paso: [Fase 4 | Investigar problemas | Rollback]
```

### Paso 4: Commit de Validación
```bash
git add docs/runbooks/BASELINE_VALIDATION_LOG.md
git commit -m "docs: registrar validacion de baseline post-fase-3"
```

---

## Criterios de Aceptación

**Validación exitosa** si:
- ✅ 5 de 6 flujos críticos funcionan sin regresiones
- ✅ No hay nuevos errores de consola
- ✅ Supabase conecta correctamente
- ✅ Tiempos de carga son aceptables (< 3s por operación)

**Validación fallida** si:
- ❌ > 2 flujos quebrados
- ❌ Errores críticos de Supabase
- ❌ Regresión en PWA

En caso de fallo → revisar commits y hacer rollback si es necesario.

---

## Notas Importantes

1. **Cambios mínimos realizados**: Solo se agregaron archivos en `src/shared/`. El monolito `index.html` **no se tocó**.
2. **Riesgo bajo**: Los cambios son 100% reversibles.
3. **Reversión rápida** si algo falla: `git revert 423d11e` y listo.

---

## Próximos Pasos Después de Validación

Si validación es **exitosa**:
- Continúa a Fase 4 (Data Layer)
- Crea repositories para Supabase

Si hay **problemas menores**:
- Documento de análisis de causas
- Correcciones puntuales

Si hay **problemas críticos**:
- Rollback automático
- Revisar AGENTS.md sección de escalamiento

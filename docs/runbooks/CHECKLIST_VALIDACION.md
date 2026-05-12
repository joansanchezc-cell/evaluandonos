# CHECKLIST DE VALIDACION INTERACTIVO

Use este checklist mientras ejecuta los flujos en [PLAN_VALIDACION_BASELINE.md](PLAN_VALIDACION_BASELINE.md).

## Estado General

**Fecha inicio**: _______________
**Responsable**: _______________
**Navegador**: _______________
**Dispositivo**: _______________

---

## FLUJO 1: Autenticación Docente

| Item | Estado | Notas |
|------|--------|-------|
| Página carga sin 404 | ⬜ | |
| Selector "DOCENTE" visible | ⬜ | |
| Inputs de email/password cargan | ⬜ | |
| Login sin error 500 | ⬜ | |
| Dashboard carga post-login | ⬜ | |
| Token en localStorage | ⬜ | |
| Console sin errores críticos | ⬜ | |
| **Resultado Flujo 1** | ⬜ ✅ ❌ | |

---

## FLUJO 2: Grados y Asignaturas

| Item | Estado | Notas |
|------|--------|-------|
| Dropdown grados carga | ⬜ | Tiempo: ___ ms |
| Grados aparecen en lista | ⬜ | Cantidad: ___ |
| Seleccionar grado no produce error | ⬜ | |
| Asignaturas cargan tras seleccionar grado | ⬜ | Tiempo: ___ ms |
| Colores de asignaturas visibles | ⬜ | |
| Colores coinciden con paleta | ⬜ | |
| Console sin errores Supabase | ⬜ | |
| **Resultado Flujo 2** | ⬜ ✅ ❌ | |

---

## FLUJO 3: Análisis y Estadísticas

| Item | Estado | Notas |
|------|--------|-------|
| Pestaña "Análisis" carga | ⬜ | Tiempo: ___ ms |
| Gráficos renderizan (sin NaN) | ⬜ | Tipo: _______ |
| Tabla de alumnos carga | ⬜ | Cantidad: ___ registros |
| Tabla es scrolleable | ⬜ | |
| Pestaña "Estadísticas" accesible | ⬜ | |
| Estadísticas muestran números válidos | ⬜ | |
| Cálculos de porcentajes correctos | ⬜ | Prueba: ___/___% |
| Console sin errores críticos | ⬜ | |
| **Resultado Flujo 3** | ⬜ ✅ ❌ | |

---

## FLUJO 4: Reportes

| Item | Estado | Notas |
|------|--------|-------|
| Pestaña "Informes" accesible | ⬜ | |
| Selector de grado para reporte carga | ⬜ | |
| Botón "Generar Reporte" funciona | ⬜ | Tiempo: ___ ms |
| Contenedor de reporte se llena | ⬜ | |
| Datos del reporte son legibles | ⬜ | |
| Botón "Imprimir" carga print preview | ⬜ | |
| Formato de impresión es correcto | ⬜ | |
| PDF descarga sin error (si aplica) | ⬜ | |
| **Resultado Flujo 4** | ⬜ ✅ ❌ | |

---

## FLUJO 5: PWA y Modo Offline

| Item | Estado | Notas |
|------|--------|-------|
| Botón de instalación visible | ⬜ | Ubicación: _______ |
| App se instala sin error | ⬜ | Tiempo: ___ s |
| App aparece en escritorio/home | ⬜ | |
| App se abre sin error | ⬜ | |
| DevTools > Service Workers: activo | ⬜ | Estado: _______ |
| DevTools > Cache Storage > tiene datos | ⬜ | Tamaño aprox: ___ KB |
| **Desconectar internet (modo avión)** | ⬜ | |
| App funciona sin conexión | ⬜ | Última pantalla: _______ |
| Shell HTML carga (al menos) | ⬜ | |
| Reconectar internet | ⬜ | |
| App sincroniza datos | ⬜ | |
| **Resultado Flujo 5** | ⬜ ✅ ❌ | |

---

## FLUJO 6: Responsive Mobile

| Item | Estado | Notas |
|------|--------|-------|
| DevTools Responsive Design activo | ⬜ | Device: _______ |
| Layout mobile no tiene overflow horizontal | ⬜ | |
| Menú mobile visible/accesible | ⬜ | |
| Botones son tapeable (48x48 px) | ⬜ | |
| Texto legible (mín 12px) | ⬜ | |
| Imágenes escalan correctamente | ⬜ | |
| Formularios son usables en mobile | ⬜ | |
| Pestaña "Estadísticas" responsive | ⬜ | |
| **Resultado Flujo 6** | ⬜ ✅ ❌ | |

---

## RESUMEN DE VALIDACIÓN

| Flujo | Resultado |
|-------|-----------|
| 1 - Autenticación | ⬜ ✅ ❌ |
| 2 - Grados/Asignaturas | ⬜ ✅ ❌ |
| 3 - Análisis/Estadísticas | ⬜ ✅ ❌ |
| 4 - Reportes | ⬜ ✅ ❌ |
| 5 - PWA Offline | ⬜ ✅ ❌ |
| 6 - Mobile Responsive | ⬜ ✅ ❌ |

**Total exitosos**: ___ / 6

---

## NOTAS Y OBSERVACIONES

```
[Espacio libre para notas, cambios inesperados, tiempos atípicos, etc.]

__________________________________________________________________

__________________________________________________________________

__________________________________________________________________

__________________________________________________________________
```

---

## DECISIÓN FINAL

```
☐ VALIDACION EXITOSA - Continuar a Fase 4 (Data Layer)
☐ VALIDACION CON PROBLEMAS MENORES - Investigar y documentar
☐ VALIDACION FALLIDA - Iniciar análisis de causa y consideración de rollback
```

**Responsable**: _______________
**Firma**: _______________
**Fecha/Hora**: _______________

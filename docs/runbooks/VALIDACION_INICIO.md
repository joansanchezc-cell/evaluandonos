# VALIDACION DE BASELINE - INICIO

**Estado**: Listo para ejecutar manual
**Fecha**: 12 de mayo de 2026
**Cambios desde baseline**: Mínimos (solo `src/shared/`, monolito intacto)

---

## ¿Por Qué Esta Etapa?

Después de 3 fases de refactorización (Fase 1-3):
- Se documentó el proyecto
- Se creó estructura de clean architecture
- Se extrajeron constantes y utilidades puras

**Ahora**: Validar que **nada se rompió** durante este proceso.

---

## Documentos a Usar

| Documento | Propósito |
|-----------|-----------|
| [PLAN_VALIDACION_BASELINE.md](PLAN_VALIDACION_BASELINE.md) | Instrucciones detalladas de 6 flujos críticos |
| [CHECKLIST_VALIDACION.md](CHECKLIST_VALIDACION.md) | Formulario interactivo para marcar progreso |
| [BASELINE_VALIDATION_LOG_TEMPLATE.md](BASELINE_VALIDATION_LOG_TEMPLATE.md) | Template para registrar resultados finales |

---

## Procedimiento Rápido (10-15 minutos)

### 1. Abre Navegador (Chrome recomendado)
```
https://evaluandonos.vercel.app
```

### 2. Abre DevTools
```
F12 → Pestaña "Console"
```

### 3. Sigue los 6 Flujos
Para cada flujo en [PLAN_VALIDACION_BASELINE.md](PLAN_VALIDACION_BASELINE.md):
- Lee los pasos
- Ejecuta en la app
- Marca resultado en [CHECKLIST_VALIDACION.md](CHECKLIST_VALIDACION.md)
- Toma notas si encuentras algo raro

### 4. Completa Log Final
Copia [BASELINE_VALIDATION_LOG_TEMPLATE.md](BASELINE_VALIDATION_LOG_TEMPLATE.md) con tus hallazgos:
```bash
cp BASELINE_VALIDATION_LOG_TEMPLATE.md BASELINE_VALIDATION_LOG_2026-05-12.md
# Edita y completa
```

### 5. Commit si Está Validado
```bash
git add docs/runbooks/BASELINE_VALIDATION_LOG_2026-05-12.md
git commit -m "docs: registrar validacion exitosa de baseline post-fase-3"
```

---

## Criterios de Éxito

### ✅ VALIDACION EXITOSA
- 5-6 de 6 flujos funcionan sin problemas
- No hay nuevos errores en consola
- Supabase conecta sin fallos
- Tiempos de carga aceptables

### ⚠️ VALIDACION CON PROBLEMAS MENORES
- 4 de 6 flujos OK
- Problemas no-críticos (UI, rendimiento)
- Decisión: investigar vs continuar

### ❌ VALIDACION FALLIDA
- < 4 flujos funcionan
- Errores críticos (Supabase, auth)
- Recomendación: rollback/investigación

---

## Fácil de Rollback

Si algo falla gravemente durante validación:
```bash
git revert 423d11e  # Revierte Fase 3
# El monolito vuelve a estado anterior
```

**Riesgo**: Bajo (solo se agregaron archivos, nada se modificó)

---

## Después de Validación

Si todo OK:
```
✅ VALIDACION EXITOSA
   ↓
   Procede a FASE 4: Data Layer
   (Crear repositories y datasources en src/data/)
```

Si hay problemas:
```
⚠️ PROBLEMAS MENORES
   ↓
   Documenta en BASELINE_VALIDATION_LOG
   ↓
   Decide: continuar o investigar
```

---

## Preguntas Frecuentes

**P: ¿Cuánto tiempo tarda la validación?**
R: 10-15 minutos si todo fluye bien, más si encuentras problemas.

**P: ¿Qué pasa si falla un flujo?**
R: Es información valiosa. Docúmenta el error y el stack trace en DevTools.

**P: ¿Puedo usar otro navegador?**
R: Sí, pero Chrome es recomendado (mejor soporte PWA, DevTools).

**P: ¿Y si falla la validación?**
R: Tienes dos opciones: a) investigar la causa, b) revertir con `git revert`.

**P: ¿Esto es obligatorio?**
R: Para seguir a Fase 4 con confianza, sí. AGENTS.md sección 8 lo requiere.

---

## Comienza Aquí

👉 Abre [PLAN_VALIDACION_BASELINE.md](PLAN_VALIDACION_BASELINE.md) y sigue los 6 flujos.

Buena suerte. 🚀

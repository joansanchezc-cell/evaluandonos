# Fase 3: Extracción de Constantes y Utilidades Puras

Fecha: 12 de mayo de 2026

## Objetivo

Extraer desde [index.html](../../../index.html) todas las constantes y funciones puras (sin efectos colaterales) hacia módulos ES 6 en src/shared/, sin modificar el monolito aún.

## Módulos creados

### src/shared/constants/

- **MATRIZ_RANGOS.js**: Configuración de asignaturas por grado
- **ASIGNATURA_COLORES.js**: Paleta de colores por materia
- **CONFIG.js**: Configuración global y credenciales (TODO: mover a .env en Fase 6)
- **index.js**: Barrel export

### src/shared/utils/

- **normalization.js**: Funciones puras de normalización, cálculo y detección
- **index.js**: Barrel export

## Funciones extraídas

- `normalizeText()`: Normalización de texto (acentos, espacios, minúsculas)
- `getValoration()`: Cálculo de nivel de desempeño (Bajo/Básico/Alto/Superior)
- `detectarSede()`: Detección de sede por patrón de grado
- `detectarPeriodo()`: Detección de periodo en nombre de quiz
- `calcularPorcentaje()`: Cálculo de porcentaje (acertadas/total)
- `isValidEmail()`: Validación básica de email

## Constantes extraídas

- `MATRIZ_RANGOS`: Mapeo de grados -> asignaturas
- `ASIGNATURA_COLORES`: Mapeo de asignatura -> color hex
- `APP_CONFIG`: Configuración global

## Regla de uso

Estos módulos pueden ser importados inmediatamente en nuevos código, pero **NO se modifica el index.html aún**. El monolito sigue usando sus definiciones locales hasta que toda la migración esté completa y validada.

```javascript
// PERMITIDO: Usar en código nuevo
import { normalizeText, getValoration } from './src/shared/utils/index.js';

// NO PERMITIDO: Modificar index.html para usar estos imports (aún)
// Eso se hace en Fase 3.5 cuando hay paridad funcional 100%
```

## Próximos pasos

1. Crear data layer (repositories y datasources) en src/data/
2. Crear domain layer (use-cases y services) en src/domain/
3. Vincular index.html gradualmente sin romper funcionalidad
4. Validar contra baseline funcional tras cada cambio

## Verificación

Para verificar que los módulos están bien escritos y exportando correctamente:

```bash
# En navegador console (si se vincula app.js)
import { normalizeText } from './src/shared/utils/index.js';
console.log(normalizeText("Pruébame"));  // "pruebame"
```

**Estado**: Pendiente vinculación. Módulos listos para usar en siguientes fases.

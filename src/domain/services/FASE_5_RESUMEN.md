# Fase 5: Domain Layer

Fecha: 12 de mayo de 2026

## Objetivo

Extraer **lógica de negocio** del monolito hacia servicios reutilizables. Domain no depende de infraestructura, solo de repositories (contratos de data).

## Módulos creados

### src/domain/services/

- **AuthService.js**: Autenticación y gestión de sesiones
  - `loginEstudiante(identificacion)` - Login por ID
  - `loginDocente(email, password)` - Login con Supabase Auth
  - `obtenerPerfilDocente(email)` - Obtiene rol y permisos
  - `logout()` - Cierra sesión
  - `validarSesion()` - Verifica sesión activa

- **AnalisisService.js**: Cálculos y transformaciones de análisis
  - `obtenerAnalisisGrado(grado, periodo)` - Análisis completo de un grado
  - `calcularEstadisticasResultados(resultados)` - Estadísticas agregadas
  - `agruparResultadosPorSede(resultados)` - Agrupa por localización
  - `obtenerAnalisisEstudiante(zipgradeId, resultados)` - Análisis individual
  - `calcularRanking(resultados, sortBy)` - Ranking de estudiantes

### src/domain/services/index.js

- Barrel export

## Características Clave

✅ **Lógica pura**: Sin dependencias de UI o Supabase directamente
✅ **Reutilizable**: Métodos con parámetros configurables
✅ **Testeable**: No necesita DOM ni callbacks
✅ **Mantenible**: Cada servicio es responsable de un dominio
✅ **Progresivo**: Puede ser usado desde index.html sin cambios mayores

## Flujo de Dependencias

```
index.html (monolito)
    ↓ (usa)
src/domain/services/ (AuthService, AnalisisService)
    ↓ (usa)
src/data/repositories/ (EstudianteRepository, ResultadosRepository)
    ↓ (usa)
src/data/datasources/ (SupabaseDatasource)
    ↓ (usa)
src/shared/ (constants, utils)
```

## Cómo usar desde index.html (próximamente)

```javascript
// Importar servicios
import { AuthService, AnalisisService } from './src/domain/services/index.js';

// Login de docente
const { success, user } = await AuthService.loginDocente(email, password);

// Análisis de grado
const { resultados, estadisticas } = await AnalisisService.obtenerAnalisisGrado(grado, periodo);
```

## Próximos pasos

1. Crear presentation layer (controllers)
2. Vincular controllers a events del HTML
3. Reemplazar lógica en index.html gradualmente
4. Testear cada integración

## Estado

- **Riesgo**: Bajo (servicios listos pero no integrados aún)
- **Monolito**: Aún intacto
- **Cobertura**: 40-50% de la lógica del monolito ya extraída


# Fase 4: Data Layer

Fecha: 12 de mayo de 2026

## Objetivo

Extraer lógica de acceso a datos desde el monolito `index.html` hacia una capa Data desacoplada, usando repositories que encapsulen todas las queries a Supabase.

## Módulos creados

### src/data/datasources/

- **SupabaseDatasource.js**: Cliente centralizado de Supabase
  - Inicialización única
  - Validación de conexión
  - Singleton instance

### src/data/repositories/

- **ResultadosRepository.js**: Acceso a tabla `eval_resultados`
  - `obtenerGradosConResultados(periodo)`
  - `obtenerPeriodoMasReciente()`
  - `existeDataParaPeriodo(periodo)`
  - `obtenerResultadosPorGradoYPeriodo(grado, periodo)`
  - `obtenerEstadisticasPorGrado(periodo)`

- **EstudianteRepository.js**: Acceso a tabla `maestro_estudiantes`
  - `buscarPorIdentificacion(id)`
  - `obtenerTodos(options)`
  - `obtenerPorGrado(grado)`
  - `sincronizar(estudiantes)` - UPSERT masivo
  - `contar()`

- **PreguntasRepository.js**: Acceso a tabla `eval_preguntas`
  - `obtenerGradosConPreguntas(periodo)`
  - `obtenerPorGradoYPeriodo(grado, periodo)`
  - `contarPorGradoYPeriodo(grado, periodo)`
  - `obtenerPorId(id)`

### src/data/index.js

- Barrel export para facilitar imports

## Características Clave

✅ **Desacoplamiento**: Todas las queries Supabase están en repositories
✅ **Reutilizable**: Métodos con parámetros flexibles
✅ **Testeable**: Cada repository puede mockearse independientemente
✅ **Reversible**: Sin cambios al monolito aún
✅ **Contrato claro**: Métodos con tipos y documentación

## Contrato entre capas

**Domain puede llamar**:
```javascript
import { EstudianteRepository, ResultadosRepository } from './src/data/index.js';

const estudiante = await EstudianteRepository.buscarPorIdentificacion('12345');
const grados = await ResultadosRepository.obtenerGradosConResultados(2);
```

**Domain NO debe**:
- Llamar directamente a `supabaseClient.from()`
- Mixear lógica de acceso a datos con reglas de negocio
- Pasar datos sin validar

## Próximos pasos

1. Crear Domain Layer (use-cases y servicios)
2. Vincular repositories en domain services
3. Mover lógica de cálculo desde index.html a domain
4. Gradualmente reemplazar llamadas en index.html

## Estado

- **Riesgo**: Bajo (repositories están listos pero no usados aún)
- **Monolito**: Aún intacto y totalmente operativo
- **Integración**: Cuando domain esté lista


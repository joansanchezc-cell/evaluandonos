# src

Estructura de codigo objetivo para la migracion incremental hacia clean architecture.

## Reglas

1. No mover logica critica desde index.html sin validacion de paridad funcional.
2. Cada extraccion debe ser pequena, reversible y con smoke tests.
3. Domain no depende de infraestructura.
4. Data implementa contratos de domain.
5. Presentation coordina UI sin contener reglas de negocio profundas.

## Capas

- presentation: controladores, vistas, estado UI.
- domain: entidades, casos de uso, servicios de negocio.
- data: repositorios y datasources.
- shared: constantes y utilidades puras.

1. Principios de Ingeniería

Priorizar claridad, simplicidad y previsibilidad.

Diseñar el código para ser leído por humanos, no solo ejecutado por máquinas.

Favorecer diseños explícitos sobre comportamientos implícitos.

Optimizar primero por mantenibilidad, luego por performance.

Toda decisión técnica debe poder justificarse en términos de impacto, costo y beneficio.

2. Clean Code (Cumplimiento Estricto)
   2.1 Nomenclatura

Nombres claros, precisos y orientados al dominio.

Evitar abreviaciones ambiguas.

Convenciones:

Variables y funciones: camelCase

Clases, interfaces y tipos: PascalCase

Constantes: SCREAMING_SNAKE_CASE

Ejemplo:

getUserByEmail()
calculateInvoiceTotal()
2.2 Funciones y Métodos

Responsabilidad única.

Longitud máxima recomendada: 30 líneas.

Máximo 3 parámetros (usar objetos de configuración cuando sea necesario).

Evitar efectos colaterales no explícitos.

Retornos tempranos en lugar de condicionales anidados.

2.3 Estructura del Código

Eliminar duplicación sistemáticamente (DRY).

No introducir complejidad accidental.

No usar any salvo justificación documentada.

Preferir expresiones claras sobre soluciones ingeniosas.

3. TypeScript – Estándar Obligatorio

strict: true habilitado.

Prohibido silenciar errores de tipo sin causa técnica válida.

Preferir unknown antes que any.

Tipos explícitos en:

Límites de API

Persistencia

Integraciones externas

3.1 Tipos vs Interfaces

interface: contratos públicos y extensibles.

type: uniones, intersecciones y composición avanzada.

4. Principios SOLID (Aplicación Práctica)

SRP: cada unidad tiene una sola razón para cambiar.

OCP: extender comportamiento sin modificar código existente.

LSP: sustitución sin romper expectativas.

ISP: interfaces pequeñas y enfocadas.

DIP: depender de abstracciones, no de implementaciones concretas.

Copilot debe advertir cuando una sugerencia viole alguno de estos principios.

5. Arquitectura
   5.1 Backend

Arquitectura modular o Clean Architecture.

Separación clara de capas:

Dominio

Aplicación

Infraestructura

El dominio no depende de frameworks ni librerías externas.

Patrones aceptados:

Controller / Service / Repository

Dependency Injection

Factory

Strategy

Adapter

5.2 Frontend

Separación estricta entre:

Presentación (UI)

Estado

Lógica de negocio

Acceso a datos

Patrones recomendados:

Container / Presentational

Custom Hooks

Compound Components

State Machines para flujos complejos

6. Manejo de Errores

Prohibido catch vacío.

Usar errores tipados y consistentes.

Nunca lanzar strings.

Los errores deben ser:

Predecibles

Observables

Manejables

7. Testing

Diseñar código pensando en testabilidad.

Prioridad:

Unit tests

Integration tests

E2E tests

Usar patrón AAA (Arrange, Act, Assert).

Evitar mocks innecesarios o frágiles.

8. Seguridad

Validar entradas siempre.

Nunca confiar en el cliente.

No exponer secretos ni datos sensibles.

No hardcodear credenciales.

9. Performance

Evitar optimizaciones prematuras.

Medir antes de optimizar.

Evitar renders innecesarios en frontend.

10. Convenciones de Git

Commits pequeños, atómicos y descriptivos.

Formato:

feat: nueva funcionalidad

fix: corrección

refactor: mejora interna

11. Restricciones para Copilot

Copilot NO DEBE:

Introducir dependencias sin justificación.

Generar código sin tipos.

Mezclar capas arquitectónicas.

Asumir reglas de negocio implícitas.

12. Expectativa de Calidad

Toda sugerencia debe:

Ser coherente con la arquitectura existente.

Mantener o mejorar la calidad del código.

Proponer refactors cuando detecte code smells.

Priorizar mantenibilidad sobre rapidez.

Declaración Final

Este documento define el estándar profesional del proyecto. Toda contribución generada o asistida por Copilot debe alinearse estrictamente con estas reglas.

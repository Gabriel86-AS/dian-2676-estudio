# Current State (2026-11-03)

**Fases 1 y 2 hechas (reinicio).** Shell, esquema de contenido, motor de lecciones con los 10 tipos de ítem y mazo de tarjetas. Aún no hay progreso guardado (fase 3) ni contenido real (fases 4–6).

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (también en GitHub).
- Código: `js/app.js` (rutas y pantallas), `js/content.js`, `js/util.js`, `js/engine/player.js`, `js/engine/flashcards.js`, `js/engine/items/*.js`, `js/engine/md.js`, `js/engine/events.js`.
- Eventos para la fase 3 (`js/engine/events.js`): `answer {itemId, unitId, type, correct, partial, ms, given}`, `lessonComplete {unitId, lessonId, correctFirstTry, total, ms}`, `card {cardId, unitId, knew}`. Likert envía `correct: null`.
- Rutas listas: `#/`, `#/unidad/:id`, `#/leccion/:unit/:lesson`, `#/practicar/:unit`, `#/tarjetas/:unit`, `#/recursos`. Stubs: `repaso`, `simulacros`, `simulacro`, `progreso`, `ajustes`.
- Demo temporal: unidad `_ejemplo` en el manifiesto (`"demo": true`). Quitarla antes del lanzamiento.
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ · `gh` no está instalado; basta `git push`.

**Siguiente:** Fase 3 (`plan/03_PROGRESS_AND_MISTAKES.md`). Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

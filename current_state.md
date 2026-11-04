# Current State (2026-11-04)

**Fases 1–6 hechas (reinicio).** Shell, motor de lecciones (10 tipos), mazo de tarjetas, progreso con repaso espaciado, panel y ajustes. **Contenido real:** las 13 unidades del manifiesto (61 lecciones, 256 tarjetas, 470 preguntas, de ellas 50 afirmaciones Likert). Faltan los simulacros (fase 7) y el QA y lanzamiento (fase 8).

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (también en GitHub).
- Código: `js/app.js` (rutas, inicio, unidad), `js/content.js`, `js/engine/*`, `js/progress/*`, `js/screens/*`.
- Herramientas: `node tools/validate.mjs [unidad]` (correr antes de cada commit de contenido) y `node tools/art.mjs <archivo> <art…>` para leer artículos del paquete `dian_2676_recursos/` (gitignored).
- Al crear una unidad: quitar `"pending": true` de su entrada en `content/manifest.json` (el validador lo exige).
- Para la fase 7: guardar resultados con `recordTest({ id, title, at, score, byUnit, ms, answers })` de `js/progress/store.js`; las sesiones que usen el reproductor deben ser `virtual: true`.
- Demo temporal: unidad `_ejemplo` en el manifiesto (`"demo": true`). Quitarla antes del lanzamiento.
- Pruebas: `node tests/progress.test.js` (14/14).
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ · `gh` no está instalado; basta `git push`.

**Siguiente:** Fase 7 (`plan/07_PRACTICE_TESTS.md`): simulacros. Para el autoinforme se puede reutilizar `likertReflection(givens)` de `js/engine/items/likert.js`. Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

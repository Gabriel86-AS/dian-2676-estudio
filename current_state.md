# Current State (2026-11-04)

**Fases 1–7 hechas (reinicio).** Shell, motor de lecciones (10 tipos), mazo de tarjetas, progreso con repaso espaciado, panel y ajustes. **Contenido real:** las 13 unidades del manifiesto (61 lecciones, 256 tarjetas, 470 preguntas, de ellas 50 afirmaciones Likert). Simulacros: 7 fijos (`content/tests/`, se regeneran con `node tools/build-tests.mjs`) y uno aleatorio. Falta la fase 8 (QA y lanzamiento).

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (también en GitHub).
- Código: `js/app.js` (rutas, inicio, unidad), `js/content.js`, `js/engine/*`, `js/progress/*`, `js/screens/*`.
- Herramientas: `node tools/validate.mjs [unidad]` (correr antes de cada commit de contenido) y `node tools/art.mjs <archivo> <art…>` para leer artículos del paquete `dian_2676_recursos/` (gitignored).
- Al crear una unidad: quitar `"pending": true` de su entrada en `content/manifest.json` (el validador lo exige).
- Simulacros: `js/tests/runner.js` (ejecución y resultados) y `js/tests/score.js` (puntaje truncado a dos decimales); los resultados se guardan con `recordTest`.
- Demo temporal: unidad `_ejemplo` en el manifiesto (`"demo": true`). Quitarla antes del lanzamiento.
- Pruebas: `node tests/progress.test.js` (14/14), `node tests/simulacro.test.js` (9/9) y E2E en `tests/e2e/` (15/15 y 10/10).
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ · `gh` no está instalado; basta `git push`.

**Siguiente:** Fase 8 (`plan/08_QA_AND_LAUNCH.md`): QA y lanzamiento. Quitar la unidad demo `_ejemplo` y revisar el ajuste `hideLikert` (hoy oculta unidades enteras). Pruebas: `node tests/progress.test.js`, `node tests/simulacro.test.js` y los E2E de `tests/e2e/` (requieren `python -m http.server 8765`). Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

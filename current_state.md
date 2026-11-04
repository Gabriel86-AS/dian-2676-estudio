# Current State (2026-11-04)

**Fases 1–8 hechas (reinicio). Sitio lanzado.** Shell, motor de lecciones (10 tipos), mazo de tarjetas, progreso con repaso espaciado, panel y ajustes. **Contenido real:** las 13 unidades del manifiesto (61 lecciones, 256 tarjetas, 470 preguntas, de ellas 50 afirmaciones Likert). Simulacros: 7 fijos (`content/tests/`, se regeneran con `node tools/build-tests.mjs`) y uno aleatorio. Auditoría de hechos y QA completas (ver `plan/PROGRESS_LOG.md`, fase 8).

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (también en GitHub).
- Código: `js/app.js` (rutas, inicio, unidad), `js/content.js`, `js/engine/*`, `js/progress/*`, `js/screens/*`.
- Herramientas: `node tools/validate.mjs [unidad]` (correr antes de cada commit de contenido) y `node tools/art.mjs <archivo> <art…>` para leer artículos del paquete `dian_2676_recursos/` (gitignored).
- Al crear una unidad: quitar `"pending": true` de su entrada en `content/manifest.json` (el validador lo exige).
- Simulacros: `js/tests/runner.js` (ejecución y resultados) y `js/tests/score.js` (puntaje truncado a dos decimales); los resultados se guardan con `recordTest`.
- Pruebas: `node tests/progress.test.js` (14/14), `node tests/simulacro.test.js` (9/9) y E2E en `tests/e2e/` (`qa-site` 31/31, `simulacro-basico` 15/15, `simulacro-examen` 10/10).
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ · `gh` no está instalado; basta `git push`.

**Siguiente:** solo mantenimiento. Si se cambia contenido: `node tools/validate.mjs`; si cambia el banco, `node tools/build-tests.mjs`; si cambian `index.html`, `css` o `js`, subir `VERSION` en `sw.js`. Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

# Current State (2026-11-03)

**Fases 1, 2 y 3 hechas (reinicio).** Shell, motor de lecciones (10 tipos), mazo de tarjetas, progreso en localStorage con repaso espaciado, mis errores, panel de progreso y ajustes. **Aún no hay contenido real** (fases 4–6) ni simulacros (fase 7).

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (también en GitHub).
- Código: `js/app.js` (rutas, inicio, unidad), `js/content.js` (carga + `buildIndex`), `js/engine/*` (reproductor, ítems, mazo, eventos), `js/progress/*` (store, scheduler, merge, stats), `js/screens/*` (repaso, progreso, ajustes, data).
- Para la fase 7: guardar resultados con `recordTest({ id, title, at, score, byUnit, ms, answers })` de `js/progress/store.js`; el historial ya se muestra en Progreso. Marcar sesiones de simulacro como `virtual: true` si usan el reproductor.
- Al crear una unidad (fases 4–6): quitar `"pending": true` de su entrada en `content/manifest.json`.
- Demo temporal: unidad `_ejemplo` en el manifiesto (`"demo": true`). Quitarla antes del lanzamiento.
- Pruebas: `node tests/progress.test.js` (14/14).
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ · `gh` no está instalado; basta `git push`.

**Siguiente:** Fase 4 (`plan/04_CONTENT_TAX.md`): unidades `fiscalizacion`, `sanciones`, `obligaciones`, `liquidacion`. Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

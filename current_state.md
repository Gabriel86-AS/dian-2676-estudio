# Current State (2026-11-03)

**Fase 1 hecha (reinicio).** Hay shell de la app, esquema de contenido y manifiesto con las 13 unidades; aún no hay motor de lecciones, progreso ni contenido real.

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (commit 2c87cd6).
- Archivos: `index.html`, `css/app.css`, `js/app.js` (router + pantallas base), `js/content.js` (carga JSON), `content/manifest.json`, `content/SCHEMA.md`, `content/units/_ejemplo.json` (un ítem de cada tipo, datos verificados ET 703–713 y Res. DIAN 65/2024), `content/resources.json` (vacío).
- Rutas listas: `#/`, `#/unidad/:id`, `#/recursos`. Las demás (`leccion`, `tarjetas`, `repaso`, `simulacros`, `simulacro`, `progreso`, `ajustes`) muestran "disponible muy pronto".
- Pasos en lecciones pueden ser un ítem completo o `{ "ref": "<id>" }` a una pregunta del banco (ver SCHEMA.md).
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ (ver PROGRESS_LOG para saber si el reinicio ya se publicó).
- `gh` no está instalado; el repo y Pages ya existen, basta `git push`.

**Siguiente:** Fase 2 (`plan/02_LESSON_ENGINE.md`). Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

# Current State (2026-11-04)

**Fases 1–8 hechas (reinicio). Sitio lanzado.** Shell, motor de lecciones (10 tipos), mazo de tarjetas, progreso con repaso espaciado, panel y ajustes. **Contenido real:** las 16 unidades del manifiesto (77 lecciones, 336 tarjetas, 611 preguntas, de ellas 50 afirmaciones Likert). Simulacros: 7 fijos (`content/tests/`, se regeneran con `node tools/build-tests.mjs`) y uno aleatorio. Auditoría de hechos y QA completas (ver `plan/PROGRESS_LOG.md`, fase 8).

- Versión anterior respaldada en el tag git `backup-v1-before-restart` (también en GitHub).
- Código: `js/app.js` (rutas, inicio, unidad), `js/content.js`, `js/engine/*`, `js/progress/*`, `js/screens/*`.
- Herramientas: `node tools/validate.mjs [unidad]` (correr antes de cada commit de contenido) y `node tools/art.mjs <archivo> <art…>` para leer artículos del paquete `dian_2676_recursos/` (gitignored).
- Al crear una unidad: quitar `"pending": true` de su entrada en `content/manifest.json` (el validador lo exige).
- Simulacros: `js/tests/runner.js` (ejecución y resultados) y `js/tests/score.js` (puntaje truncado a dos decimales); los resultados se guardan con `recordTest`.
- Pruebas: `node tests/progress.test.js` (14/14), `node tests/simulacro.test.js` (9/9) y E2E en `tests/e2e/` (`qa-site` 31/31, `simulacro-basico` 15/15, `simulacro-examen` 10/10). Crear antes las carpetas de capturas..
- Sitio: https://gabriel86-as.github.io/dian-2676-estudio/ · `gh` no está instalado; basta `git push`.

**Referencia principal (2026-11-04):** la ficha **AF-LF-3005, Gestor III** (`manual_de_funciones-gestor3_jiovani.pdf`, sin versionar). **OPEC 236739** (dato de la persona usuaria; el sitio se construyó con los indicadores de la OPEC 236767, Gestor I). Confirmada por el PDF de SIMO `GESTOR III_descripcion_del_cargo_jiovani.pdf` (28 vacantes, DIAN 2676 Ingreso). La lista de indicadores requiere el número de inscripción de la persona aspirante (el sitio se prepara para otra persona); mientras tanto, las funciones de la ficha sirven de guía.

**Fase 9 en curso.** Hecho (2026-11-04): unidad `disposicion-mercancias` (prefijo `merc`; Ley 2586 arts. 7, 28, 40, 44, 53, 54 y D1165 arts. 171, 260, 293, 732–753) y prioridades según la ficha: 1 = disposicion-mercancias, gestion-documental; 2 = fiscalizacion, sanciones, estructura, misionalidad, razonamiento, comportamentales, integridad; 3 = obligaciones, liquidacion, lavado, cambiaria, auditoria. Unidad `procedimiento-administrativo` (prefijo `proc`; CPACA arts. 1–12, 13–33 con texto de la Ley 1755, 34–45, 56, 65–97; fuente nueva `dian_material/12_CPACA_Ley1437_Ley1755.txt`), con prioridad 1. Unidad `contratacion` (prefijo `contr`; Ley 80 arts. 3–5, 14–18, 23–26, 32, 39–43, 53, 60; Ley 1150 arts. 2, 5, 7, 8, 11, 17; D1082 sistema de compras; Ley 1474 arts. 83–84; fuentes `dian_material/13_`–`16_`), con prioridad 1. `tools/art.mjs` acepta números con puntos (D1082). Simulacros regenerados; `sw.js` en `dian2676-v4`.

**Siguiente:** los niveles de `comportamentales` (ético N4, adaptabilidad N4, innovación N3, solución de problemas N4). Cada unidad nueva entra con prioridad 1. Al cambiar contenido: `node tools/validate.mjs`; si cambia el banco, `node tools/build-tests.mjs`; si cambian `index.html`, `css` o `js`, subir `VERSION` en `sw.js`. Examen **8 nov 2026**. Al terminar cada ejecución, actualizar este archivo y `plan/PROGRESS_LOG.md`.

# Progress log

**Regla permanente:** al terminar cada ejecución, `current_state.md` y este log deben quedar al día (qué está hecho, qué falta, siguiente paso, URL), de modo que sea seguro borrar el contexto (`/clear`) en cualquier momento y retomar solo con estos archivos.

Sitio en vivo: https://gabriel86-as.github.io/dian-2676-estudio/ · Repo: https://github.com/Gabriel86-AS/dian-2676-estudio

## 2026-11-03 — Reinicio
- Se borró todo el código y el contenido; versión anterior en el tag `backup-v1-before-restart`.
- Lecciones de la versión anterior (evitarlas):
  - En 166 de 183 preguntas la opción correcta era la más larga: igualar longitud y plausibilidad de las opciones.
  - Faltaba ET art. 709 (aceptar el requerimiento especial reduce la sanción por inexactitud a la **cuarta parte**; distinto del art. 713, a la mitad).
  - Volumen bajo (19–27 preguntas por unidad), pocos PJS de dificultad 3, sin `liquidacion`, `razonamiento` ni `integridad`.
  - Los datos verificados con grep eran correctos: mantener ese método.
- Siguiente: Fase 1.

## 2026-11-03 — Fase 1 (reinicio)
- Shell nuevo: router por hash con las 10 rutas, barra inferior en móvil / superior en escritorio, tema claro/oscuro, cuenta regresiva al 8-nov-2026 8:00 (Bogotá), 13 tarjetas de unidad desde `content/manifest.json`, aviso amable si falta el archivo de una unidad.
- `content/SCHEMA.md` documenta los 10 tipos con un ejemplo JSON cada uno, reglas de IDs, prefijos por unidad y la regla de opciones equilibradas. Novedad: paso `{ "ref": id }` para reutilizar preguntas del banco en lecciones.
- QA: probado en Edge headless a 375 px (sin scroll horizontal, sin errores de consola). Nota: Edge headless impone ~500 px de ancho mínimo; para medir 375 px usar un iframe.
- Publicado (push del reinicio, a pedido del usuario): https://gabriel86-as.github.io/dian-2676-estudio/ sirve el shell nuevo. Tag de respaldo también subido a GitHub.
- Pendiente: Fase 2 (motor de lecciones).

## 2026-11-03 — Fase 2 (motor de lecciones)
- `js/engine/player.js` (un paso por pantalla, barra de avance, Comprobar/Continuar, ítem fallado se repite una vez al final, pantalla final con aciertos, tiempo y "Ver explicación"), `js/engine/items/*.js` (un módulo por tipo; contrato en `items/index.js`), `js/engine/flashcards.js` (mazo con voltear, deslizar, teclas), `js/engine/md.js`, `js/engine/events.js` (eventos `answer`, `lessonComplete`, `card`; por ahora solo `console.debug`), `js/util.js`.
- Nuevas rutas: `#/practicar/:unit` (10 preguntas al azar). La unidad muestra Tarjetas / Practicar / Mis errores (este último apunta a `#/repaso`, stub hasta fase 3).
- Desviación: en vez de `_demo.json`, el demo es `_ejemplo.json` (lección `ej-01` con los 10 tipos), listado en el manifiesto como "Demo (temporal)" con `"demo": true`. **Quitarlo del manifiesto antes del lanzamiento (fase 8).**
- Decisiones: "Parcial" (abierta) no se repite al final pero sí aparece en "Para repasar". Likert y concept no cuentan en el puntaje.
- QA automatizado en Edge headless a 375 px: los 10 tipos, repetición, pantalla final, teclado (1–4, Enter, Ctrl+Enter en abierta), mazo, sin errores de consola.

## 2026-11-03 — Fase 3 (progreso, errores, repaso espaciado)
- `js/progress/store.js` (clave `dian2676:v1`, memoria si no hay localStorage + aviso), `scheduler.js` (Leitner 5 cajas: 0/1/2/4/7 días; tope 3 días desde el 6-nov), `merge.js` (migración, validación, fusión por ítem: más intentos, luego más reciente), `stats.js` (dominio = preguntas en caja ≥ 3; preparación ponderada 3/2/1 sin la demo; temas débiles con ≥ 5 intentos).
- Pantallas: `js/screens/repaso.js` (Mis errores ≤ 15, Repaso del día ≤ 20, filtros por unidad y tipo, "Ver explicación"), `progreso.js` (resumen, barra de preparación vs 70, gráfico SVG de 14 días, por unidad, historial de simulacros), `ajustes.js` (exportar/importar/reiniciar, ocultar autoinforme, letra grande). Inicio: barra de dominio, "Continuar", chip "Repaso pendiente". Unidad: ✓ y mejor % por lección.
- Rutas nuevas: `#/repaso/errores`, `#/repaso/dia`, `#/repaso/unidad/:id`.
- Detalles: un ítem sale de errores tras 2 aciertos seguidos (racha `streak`, cuenta también la repetición dentro de la misma lección). Tiempo de estudio = tiempo por paso con tope de 3 min (evento `time` para conceptos). Sesiones `practica`/`repaso` son `virtual` y no marcan lecciones completas. Las unidades sin archivo llevan `"pending": true` en el manifiesto (evita 404 en consola): **quitarlo al crear cada unidad**.
- Pruebas: `node tests/progress.test.js` o abrir `tests/progress.html` (14/14). QA de extremo a extremo en Edge headless: errores → 2 sesiones → salen; recarga conserva; exportar → reiniciar → importar deja el panel idéntico; sin errores de consola.

## 2026-11-03 — Fase 4 (contenido tributario)
- Unidades: `fiscalizacion` (7 lecciones, 30 tarjetas, 53 preguntas, 72 % PJS), `sanciones` (5/30/48, 71 %), `obligaciones` (4/20/31, 61 %), `liquidacion` (4/20/28, 64 %). 5/5/3/3 abiertas. La correcta es la más larga en solo 19 de 119 preguntas de opción.
- Herramientas: `node tools/validate.mjs [unidad]` (IDs, campos, respuestas, fuentes, refs, manifiesto + estadísticas y equilibrio de opciones); `node tools/art.mjs <01|02|03…> <art…>` imprime el texto vigente de un artículo del paquete (los encabezados usan «Í» multibyte y a veces espacios duros: no usar `grep [IÍ]`).
- Fuentes leídas: ET 555–807 (selección), Ley 2586 arts. 3–29, 56–98, 112; D1165 arts. 576–601. Incluye ET 709 (cuarta parte) vs 713 (mitad).
- Spot-check (10 al azar, verificados contra el texto): fisc-q-016 (710), oblig-q-002 (572), sanc-q-024 (L2586 art. 20), fisc-q-032 (art. 67), fisc-q-035 (arts. 94/96), fisc-q-036 (D1165 578/579), fisc-q-025 (764), fisc-q-038 (art. 112), sanc-q-017 (648/709), liq-q-017 (794).
- Desviaciones: (1) `liquidacion` no tiene tarifas de renta, IVA ni retención: el paquete solo trae el Libro V; se centró en liquidación privada/oficial, periodos, UVT, anticipo (art. 807), pago e imputación (802–804), intereses y solidaridad. (2) Dificultad 3 algo baja en obligaciones (19 %) y liquidación (21 %) frente al 30 % pedido. (3) Volumen por encima del mínimo en fiscalización y sanciones.
- Vista previa en Edge headless a 375 px: una o más lecciones por unidad, mazos y práctica; sin desbordes ni errores de consola.

## 2026-11-04 — Fase 5 (contenido institucional y de control)
- Unidades: `estructura` (4 lecciones, 20 tarjetas, 28 preguntas, 54 % PJS), `misionalidad` (4/20/30, 50 %), `gestion-documental` (4/20/30, 50 %), `lavado` (4/20/30, 53 %), `cambiaria` (4/20/30, 57 %), `auditoria` (4/22/36, 53 %). Todas con 3 abiertas y mezcla cercana a 30/40/30.
- Spot-check `cambiaria` contra el DL 2245/2011: art. 3 num. 6 (40 UVT por mes o fracción, tope 400), num. 28 (30 % ingreso / 40 % egreso), par. 3 (UVT y TRM de la fecha del hecho), par. 4 (+1/3 por reincidencia en 5 años), par. 5 (−1/3 en frontera, num. 19–23), art. 5 (5 años para cargos; 2 años para decidir; continuada), art. 8 (sin reserva bancaria), art. 21 (traslado de 2 meses), art. 23 (40/60/75 %), arts. 26, 28 y 30 (1 mes; 7 meses; silencio positivo).
- `auditoria`: basada en la Guía de auditoría interna de Función Pública v5, que cita la Ley 87/1993, el D1083/2015 y las Normas Globales IIA 2024. **La v5 es de julio de 2026 (posterior al corte del 19-jun-2026)**: los ítems que dependen solo de la metodología de la guía (rotación por criticidad, reuniones previas, técnicas y muestreo según la guía, aprobación del plan) llevan `"tags": ["post-corte"]`.
- Desviación: el paquete no trae el texto de las NIA (D2420/2015 anexo 4 / D2270/2019). Por eso no hay preguntas sobre las técnicas NIA (inspección, observación, indagación, reejecución), ni sobre materialidad o riesgo de auditoría. Las técnicas cubiertas son las de la guía: comprobación, seguimiento, recálculo, confirmación independiente y procedimientos analíticos.
- Vista previa en Edge headless (375 px): `aud-04` y `laft-01` se ven bien. El recorte a la derecha que aparece en ambas capturas viene del viewport de `--screenshot` en headless, no del sitio.

## 2026-11-04 — Fase 6 (razonamiento, comportamentales, integridad)
- `razonamiento` (4 lecciones, 16 tarjetas de estrategia, 26 preguntas mcq/pjs de 3 opciones, 27/46/27): tablas y porcentajes, proporciones y días hábiles, lógica si-entonces, necesario vs suficiente, negaciones, secuencias y lectura crítica (conclusión, supuesto, causa alternativa, tasa base). Ítems originales con el estilo de la Guía Icfes; cada `explain` resuelve paso a paso. El generador comprueba cada resultado con `assert` y reparte la clave a/b/c (9/8/9).
- `comportamentales` (9 lecciones): 6 lecciones de diccionario, una por competencia básica, con los niveles que el plan asume para Gestor I (30 ítems puntuados: mcq, match, V/F, cloze). Además, 3 bloques de autoinforme con 30 afirmaciones Likert, cada una con `competency`, `level` e `insight`, que cita literalmente la conducta observable de la Res. 065/2024. Las conductas por nivel se leyeron por filas en las tablas del Cap. IV, verificadas contra el nivel 1 del Cap. II.
- `integridad` (4 lecciones): 2 lecciones puntuadas (los 5 valores con «lo que hago / no hago»; conflicto de interés, regalos, reserva por ET 583, canales de denuncia y PTEP), con 20 preguntas en total, y 2 bloques de autoinforme con 20 afirmaciones Likert.
- Motor: pantalla de reflexión al final de cualquier lección con Likert (`likertReflection` en `js/engine/items/likert.js`). Muestra la distribución de respuestas y, si más del 80 % son «Totalmente de acuerdo», una nota neutral sobre las subescalas de control. Nunca dice qué respuesta puntúa más. Las lecciones solo Likert muestran «afirmaciones respondidas» en vez de un %. El `case` de las PJS y los `explain` de varias líneas ahora admiten markdown de bloque (tablas y listas), también en Repaso.
- Desviaciones: (1) Los niveles de Gestor I vienen del plan; el paquete no trae la ficha del empleo (está en SIMO), y la unidad lo advierte. (2) El Código de Integridad propio de la DIAN (CG-TAH-0002 v3) no es público; se usa el código general de Función Pública (copia adoptada por Santa Marta). (3) El PTEP DIAN es la v3 de jun-2026 (alrededor del corte). (4) Comportamentales e integridad tienen menos de 20 tarjetas; el plan no pedía mazo para estas unidades.
- Nota: el ajuste «ocultar autoinforme» (`hideLikert`) oculta las unidades completas de área comportamental e integridad, incluidas sus lecciones puntuadas. Es un comportamiento previo que se mantiene; revisarlo en la fase 8.
- Vista previa en Edge headless: pantalla de reflexión con 90 % de «Totalmente de acuerdo» (aparece la nota), PJS con tabla en el caso y explicación paso a paso, y concepto con tabla en `raz-03`. Se corrigió un salto de línea literal que rompía `mcq.js` (lo detectó la importación de todos los módulos en Node).

## 2026-11-04 — Fase 7 (simulacros)
- `tools/build-tests.mjs` genera 7 simulacros desde el banco (solo mcq/pjs funcionales, prioridad 1/2/3 ≈ 50/35/15 %, sin repetir ítems dentro del mismo nivel, semilla fija): `test-basico-1/2` (30 ítems, d1/d2/d3 22/8/0, 45 min), `test-medio-1/2` (40, 6/28/6, 60 min), `test-avanzado-1/2` (40, 0/12/28 y 0/14/26, 70 min) y `test-examen-1` (60 ítems, 18/24/18, más 40 Likert: 25 comportamentales y 15 de integridad; 5 h, modo examen). No hizo falta escribir preguntas nuevas.
- Validador: revisa `content/tests/` (IDs del banco, tipo mcq/pjs, duplicados, blueprint = ítems, Likert válidos, coincidencia con `index.json`).
- Ejecución (`js/tests/runner.js`, rutas `#/simulacros` y `#/simulacro/:id`): sin retroalimentación hasta entregar, una pregunta por pantalla o hoja completa, marcar para revisar, navegador en cuadrícula, reloj (pausa solo en práctica; en examen el reloj sigue al salir y entrega sola al llegar a 0), autoguardado en `localStorage` (`dian2676:simulacro`) con «Continuar simulacro». Simulacro aleatorio: unidades, cantidad, dificultad y temporizador opcional de 1,5 min por pregunta.
- Resultados: puntaje 0–100 truncado a dos decimales (`js/tests/score.js`), Aprobado / «Aún no» frente a 70,00, desglose por unidad, tiempo total y promedio, preguntas falladas con la respuesta dada, explicación, fuente y tiempo, y reflexión Likert. Cada respuesta se registra como intento (los errores y las vacías van a Mis errores) y el resultado se guarda en `progress.tests`. Progreso muestra la curva de puntajes (SVG con línea en 70) y el historial con dos decimales.
- `content/resources.json`: enlaces oficiales (GOA, protocolo, Acuerdo 21, Res. 065) y videos y simulacros externos verificados en el README del paquete. Los marcados `simulacro: true` salen también en la página Simulacros. No se copia ninguna pregunta externa.
- Pruebas: `node tests/simulacro.test.js` (9/9: truncamiento, 21/30 = 70,00 aprueba, 20/30 = 66,66 no aprueba, desglose = blueprint). E2E en Edge headless a 390 px (`tests/e2e/simulacro-basico.mjs`, 15/15): completa `test-basico-1` con respuestas hechas a mano (21 bien, 3 mal, 6 vacías), recarga a mitad y reanuda en la pregunta 15 con la marca, cambia a hoja completa, entrega → 70,00 Aprobado, 9 ítems en Mis errores, historial en Progreso, sin errores de consola. `tests/e2e/simulacro-examen.mjs` (10/10): modo examen sin pausa, reloj de 5 h, sección Likert con reflexión y nota, solo puntúan las 60 funcionales, simulacro aleatorio de 10 con 15 min y oferta de «Continuar simulacro».
- Desviación: el plan pedía el video LbYvlyMjCow, pero no está en la lista verificada del README y no se incluyó.

## 2026-11-04 — Fase 8 (auditoría de hechos, QA y lanzamiento)
**En vivo:** https://gabriel86-as.github.io/dian-2676-estudio/

**Auditoría de hechos**
- Verificados contra el texto del paquete: ET 685 (1 mes), 705 (3 años), 707 (3 meses), 710 (6 meses), 714 (3 años), 717 (5 años), 640 (50 % con 2 años o 4 años si la propone la DIAN; 75 % con 1 año o 2 años; reincidencia 2 años), 641 (5 % por mes, tope 100 %), 642 (10 %, tope 200 %), 648 (100 %), 651 (hasta 7.500 UVT; 1 / 0,7 / 0,5 %), 720 (per saltum 4 meses) y 588 (3 años). Ley 2586: arts. 14 (leves, graves y gravísimas), 17 num. 3 (tercera amonestación → 100 UVT), 20 (caducidad 3 años) y 21 (prescripción 5 años). UVT 2026 = $52.374 y todas las conversiones (10, 950, 1.400, 4.500, 15.000 y 92.000 UVT) son correctas.
- `tools/fact-scan.mjs` revisa todas las frases de alto riesgo del contenido: sin contradicciones.
- `tools/audit-sample.mjs` tomó una muestra fija del 15 % por unidad (103 ítems). Los 55 con artículo citado pasan la comparación automática de cifras. De los 48 con fuentes no articuladas (PEI, AGN, Circular 170, guía de auditoría, Res. 065, PTEP, Icfes) se revisaron a mano, con grep, los de cifras o listas (seis lineamientos y estrategia RE, principios de la visión, Templanza, 60 días hábiles de publicación, hoja de control sin foliar, agravante de 1/3 a la mitad, ROS inmediato). Errores encontrados: 0. Se corrigió un fallo del propio script con artículos guionados (689-3, 555-1, 580-1).
- El plan pedía `scripts/audit_sample.py`; se hizo en Node (`tools/audit-sample.mjs`) para usar `tools/art.mjs`.

**Cambios**
- Los ítems con la etiqueta `post-corte` muestran el aviso «Norma posterior al corte (19-jun-2026)» en lecciones, tarjetas y simulacros (21 ítems).
- «Ocultar autoinforme» ahora oculta solo las lecciones de práctica Likert (y la parte Likert de la simulación); las unidades y sus lecciones puntuadas siguen visibles. «Practicar preguntas» ya no mezcla afirmaciones Likert.
- Se quitó la unidad demo `_ejemplo`. Inicio tiene la tarjeta «Cómo usar» (abierta mientras no se haya hecho ninguna lección).
- Recursos agrupados (oficiales, normas, simulacros externos, videos). Se añadieron el índice del ET y el micrositio de renta de la DIAN (ambos verificados en el README del paquete).
- Accesibilidad: las opciones corregidas muestran ✓ / ✗ y texto para lector de pantalla (antes solo color); los enlaces externos anuncian que abren otra pestaña.
- Service worker (`sw.js`, red primero con respaldo en caché; precarga las 13 unidades y los 7 simulacros) para estudiar sin conexión.
- `README.md` del repositorio.

**QA** (`tests/e2e/qa-site.mjs`, 31/31): 21 páginas sin desbordes horizontales a 375, 768 y 1280 px en claro y oscuro; una lección completa por cada una de las 13 unidades, alternando claro y oscuro; mazo de tarjetas; Mis errores; aviso post-corte; ajuste de autoinforme; sin conexión (recarga, lección de otra unidad y simulacro); sin errores de consola. También: `simulacro-basico.mjs` 15/15, `simulacro-examen.mjs` 10/10, `progress.test.js` 14/14, `simulacro.test.js` 9/9, validador sin errores. JS total: 107 KB (< 150 KB).

**Contenido final**

| Unidad | Lecciones | Tarjetas | Preguntas puntuables | Likert |
|---|---|---|---|---|
| fiscalizacion | 7 | 30 | 53 | 0 |
| sanciones | 5 | 30 | 48 | 0 |
| obligaciones | 4 | 20 | 31 | 0 |
| liquidacion | 4 | 20 | 28 | 0 |
| estructura | 4 | 20 | 28 | 0 |
| misionalidad | 4 | 20 | 30 | 0 |
| gestion-documental | 4 | 20 | 30 | 0 |
| lavado | 4 | 20 | 30 | 0 |
| cambiaria | 4 | 20 | 30 | 0 |
| auditoria | 4 | 22 | 36 | 0 |
| razonamiento | 4 | 16 | 26 | 0 |
| comportamentales | 9 | 9 | 30 | 30 |
| integridad | 4 | 9 | 20 | 20 |

**Vacíos conocidos**
- `liquidacion` no tiene tarifas de renta, IVA ni retención (el paquete solo trae el Libro V del ET).
- `auditoria` no cubre el texto de las NIA (no está en el paquete).
- Niveles de competencia de Gestor I tomados del plan; confirmar en la ficha de SIMO.
- Código de Integridad propio de la DIAN (CG-TAH-0002) no es público; se usa el código general de Función Pública.
- La prueba en un celular real y la descarga del archivo de exportación en el teléfono quedan a cargo de la candidata o el candidato (la QA se hizo con emulación móvil en Edge headless).

## 2026-11-04 — Plan: fase 9 (brechas de la ficha de empleo)
- Revisado `manual_de_funciones-gestor3_jiovani.pdf`: ficha Gestor III (303-03, AF-LF-3005, Res. 067/2024), proceso Administrativo y Financiero. No coincide con Gestor I (OPEC 236767).
- Brechas frente al sitio: contratación pública, Ley 1437 (notificaciones, recursos), PQRSF, inventarios, SIIF y disposición de mercancías aprehendidas (esta última solo parcial).
- Creado `plan/09_JOB_PROFILE_GAPS.md` (copiado en `plan_and_context/`), con una condición previa: confirmar con la persona usuaria si la ficha es su cargo. No se cambió contenido.
- El paquete no trae el anexo de 466 fichas ni las fuentes de Ley 1437, Ley 80/1150 o D1082: hay que conseguirlas antes de escribir contenido.
- Confirmado por la persona usuaria: la ficha Gestor III es su cargo. Falta confirmar la OPEC.

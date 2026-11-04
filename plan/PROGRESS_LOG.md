# Progress log

**Regla permanente:** al terminar cada ejecución, `current_state.md` y este log deben quedar al día (qué está hecho, qué falta, siguiente paso, URL), de modo que sea seguro borrar el contexto (`/clear`) en cualquier momento y retomar solo con estos archivos.

Sitio en vivo: https://gabriel86-as.github.io/dian-2676-estudio/ · Repo: https://github.com/Gabriel86-AS/dian-2676-estudio

## 2026-11-03 — Fase 1 (parcial)
- Hecho: estructura, shell (router, countdown, 13 tarjetas), manifest, SCHEMA.md, unidad _ejemplo, .gitignore, .nojekyll, git local.
- Desviación: recursos en `dian_2676_recursos/` (gitignored).

## 2026-11-03 - Fase 2 (codigo escrito)
- Hecho: md.js, items.js (10 tipos), player.js (cola con reintento unico, eventos dian:answer / dian:lessonComplete), flashcards.js, rutas leccion/practica/tarjetas, unidad _ejemplo como demo.

## 2026-11-03 — Despliegue
- Repo público creado y Pages activado desde `main` (/). Fases 1 y 2 publicadas.

## 2026-11-03 — Fase 3 (progreso y errores)
- Hecho: `js/progress/scheduler.js` (Leitner 5 cajas, tope 3 días desde 6-nov, banco de errores con salida tras 2 aciertos seguidos, fusión, migración), `stats.js` (dominio, preparación ponderada vs 70, temas débiles, listas de errores/vencidos), `store.js` (clave `dian2676:v1`, respaldo en memoria + aviso), `js/content.js` (carga con caché + índice de ítems), pantallas `#/repaso` (errores, repaso del día, ver explicaciones, filtros), `#/progreso` (SVG de minutos, por unidad, preparación), `#/ajustes` (exportar/importar/reiniciar, letra grande, ocultar unidades Likert); inicio con barra de progreso, "Continuar" y chip de repaso pendiente.
- Pruebas: `tests/progress.html` (también corre en Node) 20/20 pasan.
- Decisiones: las repeticiones dentro de la misma sesión (`retry`) no puntúan; Likert no puntúa; el demo `_ejemplo` se excluye de la preparación.
- Verificado: capturas headless de inicio/progreso cargan sin errores (Edge recorta el ancho a ~500 px, no es un fallo del sitio). Falta probar con un dispositivo real: flujo completo responder → error → repaso → exportar/importar.
- Siguiente: Fase 4 (`plan/04_*.md`, contenido).

## 2026-11-03 — Fase 4 (parcial: 3 de 4 unidades)
- Hecho: `fiscalizacion` (6 lecciones, 29 tarjetas, 59 preguntas), `sanciones` (5 / 25 / 45, con cálculos paso a paso), `obligaciones` (4 / 16 / 25). `tools/validate.mjs` valida ids únicos, campos por tipo, `answer` en opciones, PJS con 3 opciones, fuente en cada ítem (OK).
- Verificado contra el texto fuente (grep antes de escribir): ET 639, 640, 641, 642, 643, 644, 647, 648, 651, 685, 686, 689-3, 697–701, 703–708, 710–714, 715–722, 732–733, 571, 574, 580, 588, 589, 614, 615, 632; Ley 2586/2026 arts. 5, 14, 17–21, 57, 59, 66, 67, 70–72, 88, 94, 98. UVT 2026 = $52.374 (README del paquete).
- Desviaciones: la proporción de PJS está por debajo de la meta (fiscalizacion 12/59, sanciones 14/45, obligaciones 6/25); dificultad 3 escasa en obligaciones. No se incluyó D1165 Título 13 ni umbrales del art. 592 (no verificados/vigencia). Los ítems de `obligaciones` sobre sustancial vs formal son conceptuales.
- Pendiente: `liquidacion` (el paquete solo tiene enlaces, sin texto fuente; solo contenido conceptual verificable), más PJS y ítems de dificultad 3, quitar `_ejemplo` del manifest al final, probar flujo completo en dispositivo.
- Siguiente: Fase 5 (`plan/05_*.md`), luego 6–8.

## 2026-11-03 — Fase 5 (6 de 6 unidades, volumen por debajo del mínimo)
- Hecho: `estructura` (D1742 arts. 1, 4–7, 28, 55, 60, 63, 76–77), `misionalidad` (PEI 2024–2026 §4.1–4.2), `gestion-documental` (Acuerdo AGN 001/2024 arts. 4.3–4.4; Ley 594 arts. 23–24), `lavado` (Circular 170/2002; C. Penal 323 y 345; definiciones de la política DIAN con etiqueta `post-corte`), `cambiaria` (D2245/2011 arts. 1–5, 11, 21, 23–26, 28, 30, 32, 37), `auditoria` (Guía Función Pública v5). Validador OK en todas.
- Desviaciones: cada unidad tiene 19–27 preguntas y 12–16 tarjetas (mínimo del plan: 25 y 20); PJS por debajo de 50 %; la dificultad 3 es escasa. `cambiaria`: no se incluyó el reparto de competencias con Supersociedades/Superfinanciera ni R.E. 1/2018 (no verificados en el paquete). `auditoria`: las NIA no están en el paquete; el contenido sale de la guía de auditoría interna pública.
- Siguiente: Fase 6 (`comportamentales`, `integridad`, `razonamiento`), Fase 7 (simulacros), Fase 8 (QA). Refuerzo posible: más PJS y dificultad 3 en todas las unidades; `liquidacion` sigue sin escribir.

## 2026-11-03 — Fase 6 (parcial)
- Hecho: `comportamentales` (5 lecciones: diccionario de las 6 competencias básicas N1 + niveles N1–N4 de Comportamiento ético y N1–N2 de Adaptabilidad, todo de Res. DIAN 065/2024; 18 ítems Likert sin respuesta correcta). Pantalla de reflexión al final de lecciones con Likert (distribución de respuestas; nota neutral si >80 % "Totalmente de acuerdo"; nunca indica qué respuesta puntúa más) en `js/engine/player.js`.
- Desviaciones: no se cubrieron los niveles N2–N4 de las demás competencias (no leídos). 18 Likert en vez de 30.
- No hecho: `integridad` (el paquete no trae el Código de Integridad de la DIAN; solo el de Santa Marta, que no se debe usar) y `razonamiento` (requiere ítems originales; fuente Icfes). Quedan fuera del manifest con contenido hasta que se escriban.
- Siguiente: Fase 7 (simulacros) con el banco existente, o `razonamiento`; luego Fase 8 (QA, quitar `_ejemplo`).

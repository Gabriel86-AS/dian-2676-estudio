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

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

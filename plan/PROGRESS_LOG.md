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

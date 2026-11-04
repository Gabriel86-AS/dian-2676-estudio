# Esquema de contenido

Cada unidad es `content/units/<id>.json` y se lista en `content/manifest.json` (`{units:[{id,file,title,area,priority}], tests:[]}`). Ver el ejemplo completo en `units/_ejemplo.json`.

## Unidad
`id`, `title`, `area` (`funcional|comportamental|integridad`), `priority` (1–3), `summary`, `sources[]`, `lessons[]`, `flashcards[]`, `questions[]`.
- Lección: `{id, title, minutes, steps[]}`; los pasos mezclan `concept` e ítems.
- Flashcard: `{id, front, back, source}`.

## Ítems
Todos llevan `id`, `type`, `difficulty` (1–3), `source` y opcional `tags[]`.

| type | Campos |
|---|---|
| `concept` | `title`, `body` (Markdown: **negrita**, listas, tablas), `example?` |
| `mcq` | `prompt`, `options[{id,text}]`, `answer`, `explain`, `optionWhy{id:texto}` |
| `pjs` | como `mcq` + `case`; siempre 3 opciones A–C |
| `truefalse` | `statement`, `answer` (bool), `explain` |
| `open` | `prompt`, `modelAnswer`, `keyPoints[]`, `keywords[]`, `minKeywords` |
| `order` | `prompt`, `items[]` en orden correcto (se barajan), `explain` |
| `match` | `prompt`, `pairs[{left,right}]`, `explain` |
| `cloze` | `text` con `{{respuesta}}`, `alternatives{respuesta:[…]}` |
| `likert` | `statement`, `competency`, `level`, `insight`; sin respuesta correcta |
| `flashcard` | `front`, `back` (dentro de una lección) |

## IDs
`<prefijo>-<tipo>-<nnn>` (`sanc-q-014`, `sanc-fc-003`, `sanc-01`). **Son permanentes**: el progreso se guarda por id; nunca renumerar.

## Reglas
Citar siempre la fuente legal; no inventar artículos, plazos ni cifras; verificar contra `dian_2676_recursos/`.

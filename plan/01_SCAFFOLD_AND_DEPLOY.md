# Phase 1 — Scaffold, content schema, deploy

Prerequisite: read `plan/00_OVERVIEW.md`.

## Tasks
1. **Repo**
   - Create a public GitHub repo, e.g. `dian-2676-estudio` (`gh repo create --public`). If `gh` is not authenticated, ask the user to run `gh auth login` once.
   - Add `.gitignore` with `resources/`, `.DS_Store`, `node_modules/`.
   - Unzip `dian_2676_recursos.zip` into `resources/` (ask the user for its path if not present).
2. **Folder structure** exactly as in the overview. Create stub files so every path exists.
3. **App shell** (`index.html`, `css/app.css`, `js/app.js`)
   - Hash router with routes: `#/` (home), `#/unidad/:id`, `#/leccion/:unit/:lesson`, `#/tarjetas/:unit`, `#/repaso` (mistakes/review), `#/simulacros`, `#/simulacro/:id`, `#/progreso`, `#/recursos`, `#/ajustes`.
   - Bottom tab bar on mobile (Inicio, Repaso, Simulacros, Progreso), top nav on desktop.
   - Design: clean, high contrast, large tap targets (≥ 44 px), system font stack, CSS variables for colors, light + dark (`prefers-color-scheme`). Calm palette (blue/green); red only for "incorrect" feedback.
   - Home shows a countdown to **8 Nov 2026 8:00 a.m. (America/Bogota)** and a grid of unit cards (title, area, priority badge, progress bar placeholder).
   - Loads `content/manifest.json` with `fetch`; graceful message if a unit file is missing.
4. **Content schema** — write `content/SCHEMA.md` and one example unit `content/units/_ejemplo.json`:

```jsonc
// content/units/<unit-id>.json
{
  "id": "fiscalizacion",
  "title": "Fiscalización y liquidación tributaria y aduanera",
  "area": "funcional",            // funcional | comportamental | integridad
  "priority": 1,
  "summary": "2–3 líneas",
  "sources": ["ET arts. 683–719-2", "Ley 2586/2026 arts. 3–12, 56–75"],
  "lessons": [
    {
      "id": "fisc-01",
      "title": "Emplazamiento para corregir",
      "minutes": 6,
      "steps": [ /* ordered mix of concept screens and items, see below */ ]
    }
  ],
  "flashcards": [
    { "id": "fisc-fc-001", "front": "¿Plazo para responder el requerimiento especial?",
      "back": "3 meses desde su notificación.", "source": "ET art. 707" }
  ],
  "questions": [ /* question bank used by review and tests */ ]
}
```

Step / item types (all items share `id`, `type`, `difficulty` 1–3, `source`, optional `tags`):
| type | Fields |
|---|---|
| `concept` | `title`, `body` (Markdown subset: **bold**, lists, tables), optional `example` |
| `mcq` | `prompt`, `options[{id,text}]`, `answer` (option id), `explain` (why correct), `optionWhy{id:text}` (why each wrong option fails) |
| `pjs` | like `mcq` but adds `case` (situación) and always 3 options A–C; `prompt` is the enunciado. Mirrors the official format. |
| `truefalse` | `statement`, `answer` (bool), `explain` |
| `open` | `prompt`, `modelAnswer`, `keyPoints[]` (rubric), `keywords[]` (lowercase, accents optional), `minKeywords` |
| `order` | `prompt`, `items[]` in correct order (shuffled on display), `explain` |
| `match` | `prompt`, `pairs[{left,right}]`, `explain` |
| `cloze` | `text` with `{{answer}}` gaps, `alternatives{answer:[…]}` |
| `likert` | `statement`, `competency`, `level`, `insight` (which observable behavior of Res. 065/2024 it maps to). No correct answer. |
| `flashcard` | inline flashcard inside a lesson: `front`, `back` |

ID convention: `<unitprefix>-<kind>-<nnn>` (e.g. `sanc-q-014`, `sanc-fc-003`, `sanc-01`). **IDs are permanent** — progress is keyed by them; never renumber.

5. **Manifest**: `content/manifest.json` = `{ "units": [{ "id", "file", "title", "area", "priority" }], "tests": [] }` listing all 13 units from the overview (files may not exist yet).
6. **Deploy**: enable GitHub Pages (`gh api -X POST repos/{owner}/{repo}/pages -f "source[branch]=main" -f "source[path]=/"`, or via settings). Add an empty `.nojekyll`.
7. Create `plan/PROGRESS_LOG.md` and copy the plan files into `/plan/`.

## Acceptance checks
- `python3 -m http.server` locally → home renders, countdown works, 13 unit cards show, no console errors.
- Pages URL loads on a phone-sized viewport (375 px) without horizontal scroll.
- `content/SCHEMA.md` documents every type above with one JSON example each.
- Commit + push; log entry written with the live URL.

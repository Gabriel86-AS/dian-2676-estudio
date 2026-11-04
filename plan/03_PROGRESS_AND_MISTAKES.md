# Phase 3 — Progress tracking, mistake bank, spaced review

Prerequisite: phase 2 done (engine emits `onAnswer` / `onLessonComplete`). Read `plan/00_OVERVIEW.md`.

**Track progress, never punish.** No lives, no streak loss messages, no locked content. Everything is unlocked from the start.

## Data model (`js/progress/store.js`)
Single `localStorage` key `dian2676:v1`:
```jsonc
{
  "version": 1,
  "createdAt": "ISO",
  "items": {                       // keyed by permanent item id
    "sanc-q-014": {
      "unit": "sanciones", "type": "pjs",
      "attempts": 3, "correct": 2, "partial": 0,
      "lastResult": "correct",      // correct | partial | wrong
      "lastAt": "ISO", "avgMs": 41000,
      "inMistakes": false,          // true after a wrong/partial, false after 2 consecutive correct in review
      "box": 3, "due": "ISO"        // Leitner scheduling
    }
  },
  "lessons": { "fisc-01": { "completedAt": "ISO", "bestAccuracy": 0.9, "runs": 2 } },
  "tests":   [ { "id": "test-medio-1", "at": "ISO", "score": 76.0, "byUnit": { "sanciones": [7, 9] }, "ms": 3600000, "answers": { "itemId": "B" } } ],
  "studyDays": { "2026-11-03": 42 }  // minutes studied per day (positive stat only)
}
```
- Wrap all reads/writes in try/catch; if storage is unavailable, keep state in memory and show a small banner "El progreso no se guardará en este navegador".
- Migration hook keyed on `version`.

## Spaced review (Leitner, 5 boxes)
- Intervals: box 1 = same session/now, 2 = 1 day, 3 = 2 days, 4 = 4 days, 5 = 7 days. Exam is close, so cap intervals at 3 days after 6 Nov.
- Correct → box +1; partial → stay; wrong → box 1 and `inMistakes = true`.
- Flashcards use the same scheduler ("Lo sabía" = correct, "Repasar" = wrong).

## Screens
1. **Repaso** (`#/repaso`)
   - "Mis errores" session: up to 15 items with `inMistakes`, oldest-wrong first, mixed units, played through the lesson player. Leave the mistake bank after 2 consecutive correct answers.
   - "Repaso del día": items/cards with `due <= now`, highest-priority units first.
   - Filter chips by unit and by type.
   - Each missed item can be opened in "ver explicación" mode (read-only with explanation and source).
2. **Progreso** (`#/progreso`)
   - Overall: items seen / total, accuracy (first try), minutes studied per day (bar chart in plain SVG), lessons completed.
   - Per unit: mastery % = share of the unit's questions currently in box ≥ 3; accuracy; open mistakes count; button "Practicar esta unidad".
   - **Readiness estimate** for the functional test: weighted mastery of functional units (priority 1 ×3, 2 ×2, 3 ×1) shown against the **70/100** bar, with the label "estimación, no oficial".
   - "Temas más débiles": the 3 units with lowest accuracy (min 5 attempts).
   - Test history table (from phase 7).
3. Home cards: show unit progress bar + "Continuar" pointing to the next incomplete lesson. Show a "Repaso pendiente: N" chip if due items exist.
4. **Ajustes** (`#/ajustes`)
   - Exportar progreso (download JSON), Importar progreso (file input, validate, merge by taking the higher `attempts`/later `lastAt` per item), Reiniciar progreso (with confirmation).
   - Hide/show Likert units, font size (normal/large).

## Acceptance checks
- Answering items updates the stats immediately; reload keeps them.
- A wrong answer appears in "Mis errores"; after 2 correct reviews it leaves.
- Export → reset → import restores the same dashboard.
- Unit test (simple `tests/progress.html` page with asserts, no framework) for the scheduler and merge.
- Commit, push, log entry.

# Phase 2 — Lesson engine (Duolingo / Brilliant style)

Prerequisite: phase 1 done. Read `plan/00_OVERVIEW.md` and `content/SCHEMA.md`.

## Experience to build
One step per screen, a thin progress bar at the top, big "Comprobar" button, immediate feedback, then "Continuar". Concept screens teach in small pieces (Brilliant); items test right after (Duolingo). **No lives, no hearts, no timers in lessons, no lockouts.** Wrong answers are welcome: they go to the mistake bank and the item is re-queued once at the end of the lesson.

## Tasks
1. `js/engine/player.js` — lesson player
   - Input: unit + lesson. Renders steps in order. Keeps a queue; an item answered wrong is appended once more at the end ("Repasemos esta").
   - Emits events `onAnswer({itemId, unitId, type, correct, partial, ms, given})` and `onLessonComplete({unitId, lessonId, correctFirstTry, total, ms})`. Phase 3 subscribes; for now log to console.
   - End screen: accuracy, time, list of missed items with links "ver explicación", buttons "Repetir lección" / "Volver a la unidad".
2. Renderers in `js/engine/items/` — one module per type, same interface: `render(item, container) → { check(): Result, reveal() }`.
   - `concept`: renders Markdown subset (write a tiny safe renderer: escape HTML, then bold/italics/lists/tables). Button "Entendido".
   - `mcq` / `pjs`: options as large cards labeled A, B, C (D…). After check: mark correct in green, chosen wrong in red, show `explain` and the specific `optionWhy` for the chosen option, plus the `source` citation. `pjs` shows the **Caso** in a shaded box and the **Enunciado** in bold, exactly like the official format.
   - `truefalse`: two big buttons.
   - `open`: textarea → "Comprobar" runs keyword matching (normalize: lowercase, strip accents and punctuation; count matched `keywords`; pass if ≥ `minKeywords`). Then **always** show `modelAnswer` and the `keyPoints` checklist and ask the user to self-grade: "Lo tenía" / "Parcial" / "No lo tenía". Final result = self-grade (keyword score shown as a hint only). Partial counts as `partial: true`.
   - `order`: tap-to-move or drag list (support touch; tap two items to swap is enough).
   - `match`: two columns, tap left then right to pair; check all pairs.
   - `cloze`: inputs inside text; accept `alternatives`, normalized.
   - `flashcard` (inline): flip card, then "Lo sabía" / "No lo sabía".
   - `likert`: 4 buttons (Totalmente en desacuerdo … Totalmente de acuerdo). No right/wrong. After answering show `insight` (which Res. 065 behavior the statement reflects) and a neutral note: answer honestly and consistently; extreme answers on everything are flagged by the control subscales. Never label a Likert answer as "correct".
3. `js/engine/flashcards.js` — deck mode for `#/tarjetas/:unit`: flip with tap/space, swipe or buttons "Lo sabía" / "Repasar". Shuffle; show count remaining. (Scheduling logic comes in phase 3; for now keep an in-memory "again" pile.)
4. Unit page `#/unidad/:id`: summary, sources, list of lessons with minutes, buttons "Tarjetas", "Practicar preguntas" (random 10 from `questions`, mixed types), "Mis errores en esta unidad" (stub until phase 3).
5. Keyboard: 1–4 select option, Enter = comprobar/continuar. Touch targets ≥ 44 px. Respect `prefers-reduced-motion` (small animations only: card flip, correct pulse).
6. Write `content/units/_demo.json` with one lesson containing **every** step type, and add it to the manifest temporarily as "Demo".

## Acceptance checks
- Demo lesson plays end to end on a 375 px viewport with touch, and on desktop with keyboard.
- Wrong answer re-appears once at the end; end screen lists it.
- Open answer: keyword hint + model answer + self-grade all work; accented and unaccented answers match equally.
- Likert never shows correct/incorrect.
- No console errors. Commit, push, log entry.

# Phase 7 — Full practice tests

Prerequisite: phases 2–3 and at least phase 4 content. Read `plan/00_OVERVIEW.md` and `content/SCHEMA.md`.

## External open tests (link, don't embed)
Research found **no openly embeddable official practice test**. CNSC publishes only the 3 PJS + 4 Likert examples in the guide. Free external options (add to `content/resources.json` and the "Simulacros" page as links, opening in a new tab):
- Grupo Geard "Intensivo DIAN 2676" (free, registration required): https://www.grupogeard.com/simulacro/29-intensivo-dian-2676 and list https://www.grupogeard.com/simulacros-gratis
- YouTube simulacros (IDs in `resources/README.md`): hNiNOahMjuo, hwlVn-fNgA8 (+ answers O61pgxwsT6I), hhRrT0ovyl4, 5-SxDj10ZhA, bpB3Bgn3yq8, LbYvlyMjCow.
Do not scrape or copy their questions.

## Crafted tests (`content/tests/<id>.json`)
```jsonc
{ "id": "test-medio-1", "title": "Simulacro intermedio 1", "difficulty": 2,
  "minutes": 75, "mode": "practice",            // practice | exam
  "blueprint": { "fiscalizacion": 8, "sanciones": 7, ... },
  "items": ["fisc-q-012", "sanc-q-003", ...],   // references to bank question IDs
  "likert": ["comp-lk-004", ...] }              // optional, exam mode only
```
Tests reference bank IDs, so mistakes made in tests feed the same mistake bank.

Create:
| Test | Items | Difficulty mix | Timer |
|---|---|---|---|
| `test-basico-1`, `test-basico-2` | 30 functional | mostly 1 | 45 min (optional) |
| `test-medio-1`, `test-medio-2` | 40 functional | mostly 2 | 60 min |
| `test-avanzado-1`, `test-avanzado-2` | 40 functional | mostly 3 | 70 min |
| `test-examen-1` (simulación) | 60 functional + 40 Likert | 30/40/30 | 5 h overall, countdown visible |
| "Aleatorio" (generated at runtime) | user picks units, count and difficulty | — | optional |

Blueprint weights by unit priority: priority 1 units ≈ 50 % of functional items, priority 2 ≈ 35 %, priority 3 ≈ 15 %. If the bank lacks enough questions, **write new bank questions first** (in the unit files, following phase 4 rules) — tests never contain items outside the bank.
Avoid repeating items across tests of the same difficulty where the bank allows.

## Runner (`js/tests/runner.js`, route `#/simulacro/:id`)
- Exam-like mode: all questions on a scrollable answer-sheet view or one per screen (toggle); **no feedback until submit**; mark-for-review flag; question navigator grid; timer (pause allowed in practice mode, not in exam mode).
- Submit → results: score 0–100 with **two truncated decimals** (like the official scale), PASS/NOT YET against **70.00**, breakdown by unit, time per question, list of wrong answers with explanations and sources, button "Añadir errores a repaso" (automatic anyway).
- Likert section in simulation: answered, not scored; only the answer-distribution reflection from phase 6.
- Save to `progress.tests`; Progreso page shows the history and the score trend (SVG line).
- Leaving mid-test: autosave answers to `localStorage` and offer "Continuar simulacro".

## Acceptance checks
- Each test file validates (all IDs exist in the bank, counts match the blueprint).
- Complete `test-basico-1` end to end on mobile; score and breakdown correct (verify with a hand-made answer set).
- Resume after reload works. Commit, push, log entry.

# Phase 6 — Content: analytical reasoning, behavioral competencies, integrity

Prerequisite: phase 1 schema, phase 2 Likert renderer. Read `plan/00_OVERVIEW.md`, `content/SCHEMA.md`, `resources/00_GOA_datos_clave.md` and the Authoring rules in `plan/04_CONTENT_TAX.md`.

## Unit `razonamiento` (functional, scored)
Source for style: `resources/10_razonamiento_icfes_saberpro.txt` (Icfes items — use as models, write original items).
- Lessons (4): reading a table/graph, percentages and proportions, logical deduction (if-then, necessary vs sufficient), sequences and patterns, critical reading (identify the assumption / conclusion).
- Contextualize in DIAN: tables of declarations filed, percentages of compliance, deadlines counting.
- 25 bank questions (mcq/pjs, 3 options to mirror the exam), 15 flashcards with strategies, difficulty mix 30/40/30. Every item has a fully worked `explain`.

## Unit `comportamentales` (Likert, not scored right/wrong)
Source: `resources/11_competencias_Res065_integridad.txt` → Res. DIAN 065/2024 Capítulo IV. `grep -n` each competency name and read its level table.
Competencies and levels for Gestor I: Adaptabilidad N1–N2, Comportamiento ético N1 and N4, Comunicación efectiva N1–N2, Orientación al logro N1, Orientación al usuario y al ciudadano N1, Trabajo en equipo N1 and N3.
- **Learning lessons (scored normally):** one lesson per competency with `concept` screens describing each required level's observable behaviors in plain words, plus `match` items (behavior ↔ competency/level) and `mcq` items ("¿Qué conducta corresponde al nivel 4 de Comportamiento ético?"). These ARE scored — they teach the dictionary.
- **Self-assessment practice (not scored):** 30 `likert` statements in the official style (first person, a concrete action with a trade-off: extra time, end of shift, urgency — see the 4 official examples in `00_GOA_datos_clave.md`). Each with `competency`, `level`, `insight`.
- After a Likert set, show a reflection screen: distribution of the user's answers; if > 80 % are "Totalmente de acuerdo", show a neutral note that the real test includes control subscales for exaggeratedly favorable answering and that honest, consistent answers are best. **Never** tell the user which answer "scores higher".

## Unit `integridad`
Sources: the Código de Integridad text in `resources/11_…txt` (5 values + "lo que hago / lo que no hago") and DIAN's transparency programme in the same file.
- Lessons (2): the 5 values with do/don't behaviors; conflicts of interest, gifts, confidentiality of tax information, reporting irregularities (scored `mcq`/`pjs`/`match`).
- 20 scored questions + 20 `likert` practice statements (same rules as above).

## Acceptance checks
Validator passes; Likert items never have `answer`; reflection screen works; commit, push, log entry.

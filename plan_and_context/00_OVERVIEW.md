# DIAN 2676 Study Site — Master Plan (read this first in every session)

## Goal
A static learning website on GitHub Pages for one candidate preparing for the **DIAN 2676 written exam (CNSC/Areandina), Gestor I, nivel Profesional, OPEC 236767**. Exam: **Sunday 8 Nov 2026, 8:00 a.m.–1:00 p.m.** The site must be usable **today** and grow over the next days.

> **Update 2026-11-04:** the user's job ficha **AF-LF-3005, Gestor III (303-03), Administrativo y Financiero** (`manual_de_funciones-gestor3_jiovani.pdf`, repo root, untracked) is the **main reference**. See phase 9.

Style: Duolingo/Brilliant-like interactive lessons, flashcards, multiple-choice ("ABC") questions, open-answer questions and full practice tests at different difficulties. **Progress and mistake tracking. No lives, hearts, streak penalties or gamified punishments.**

All UI text and content in **Spanish (Colombia)**. Mobile-first: the user will mostly study on a phone.

## Hard constraints
- Static site only: no backend, no API keys, no login. Hosting: GitHub Pages from `main` branch root (or `/docs`).
- **No build step.** Plain HTML + CSS + vanilla JavaScript ES modules. Content in JSON files. Opening `index.html` through any static server must work.
- Progress stored in `localStorage`, with **Export / Import JSON** so it can move between devices.
- Every content item cites its legal source (e.g., "ET art. 705"). Never invent articles, deadlines or figures; verify against the resource pack.
- Do not copy text from third-party prep sites (Grupo Geard, Gerencie, etc.). Laws and official CNSC/DIAN documents may be quoted.

## Resource pack (source of truth)
The user has `dian_2676_recursos.zip`. Unzip it into `resources/` at the repo root and add `resources/` to `.gitignore` (it is study source material, not part of the site). Contents:
- `00_GOA_datos_clave.md` — verified facts from the official guide (format, weights, schedule, official example questions). **Read this before writing any content.**
- `01_ET_libro5_procedimiento_sanciones.txt` — Estatuto Tributario arts. ~552–790 (formal duties, sanctions, fiscalización, recursos).
- `02_D1165_titulo13_controles_aduaneros.txt` — Decreto 1165/2019 arts. 576–601.
- `03_Ley2586_2026_sancionatorio_aduanero.txt` — new customs sanctions law (**IS evaluable**; cutoff is "hasta el 19-jun-2026").
- `04_D1742_2020_estructura_DIAN.txt`, `05_PEI_DIAN_2024_2026_misionalidad.txt`, `06_gestion_documental_…txt`, `07_LAFT_ROS_…txt`, `08_cambiario_…txt`, `09_auditoria_…txt`, `10_razonamiento_icfes_saberpro.txt`, `11_competencias_Res065_integridad.txt`.
- `README.md` — topic → file → article map, verified links and 25 verified YouTube video IDs.
Files are large. **Never read a whole file; use `grep -n` to locate article numbers and read only those line ranges.**

## Exam facts the site must reflect (from the official guide)
- Functional competencies test: **eliminatory, minimum 70/100**, weight 65 % (if the OPEC requires experience) or 70 % (if not). Format **PJS (Prueba de Juicio Situacional)**: 1 case + 1 statement + **3 options (A–C)**, one correct.
- Behavioral (15–20 %) and Integrity (10 %) tests: **4-point Likert self-report, no right answers**, with two control subscales that flag exaggeratedly favorable answering.
- Integrity measures the values of DIAN's Código de Integridad (honestidad, respeto, compromiso, diligencia, justicia).

## Exam indicators (unit IDs used everywhere)
| Unit id | Indicator | Area | Priority |
|---|---|---|---|
| `fiscalizacion` | Procedimiento de fiscalización y liquidación tributaria y aduanera | funcional | 1 |
| `sanciones` | Imposición de sanciones | funcional | 1 |
| `obligaciones` | Obligaciones formales y sustanciales en materia tributaria | funcional | 1 |
| `liquidacion` | Liquidación de impuestos nacionales | funcional | 2 |
| `estructura` | Estructura organizacional de la DIAN | funcional | 2 |
| `misionalidad` | Misionalidad de la DIAN | funcional | 2 |
| `gestion-documental` | Gestión documental y trazabilidad de expedientes | funcional | 2 |
| `lavado` | Lavado de activos, FT, ROS y denuncias | funcional | 2 |
| `cambiaria` | Normativa cambiaria | funcional | 3 |
| `auditoria` | Normas y técnicas de auditoría | funcional | 3 |
| `razonamiento` | Razonamiento analítico | funcional | 3 |
| `comportamentales` | Adaptabilidad N1–N2, Comportamiento ético N1/N4, Comunicación efectiva N1–N2, Orientación al logro N1, Orientación al usuario N1, Trabajo en equipo N1/N3 | comportamental | 3 |
| `integridad` | Compromiso, Diligencia, Honestidad, Justicia, Respeto | integridad | 3 |

## Phases (one Claude Code session each; run in order)
| # | File | Output | Est. time |
|---|---|---|---|
| 1 | `01_SCAFFOLD_AND_DEPLOY.md` | Repo, folder structure, content schema, empty shell live on GitHub Pages | 30 min |
| 2 | `02_LESSON_ENGINE.md` | Lesson player + all item types (flashcard, ABC, PJS, true/false, open answer, ordering, matching, Likert) | 1.5 h |
| 3 | `03_PROGRESS_AND_MISTAKES.md` | Progress store, mistake bank, spaced review, dashboard, export/import | 1 h |
| 4 | `04_CONTENT_TAX.md` | Units `fiscalizacion`, `sanciones`, `obligaciones`, `liquidacion` | 1.5 h |
| 5 | `05_CONTENT_INSTITUTIONAL_CONTROL.md` | Units `estructura`, `misionalidad`, `gestion-documental`, `lavado`, `cambiaria`, `auditoria` | 1.5 h |
| 6 | `06_CONTENT_BEHAVIORAL_REASONING.md` | Units `razonamiento`, `comportamentales`, `integridad` | 1 h |
| 7 | `07_PRACTICE_TESTS.md` | Full practice tests (3 difficulties + exam simulation) and external simulacro links | 1 h |
| 8 | `08_QA_AND_LAUNCH.md` | Fact audit, mobile QA, accessibility, final deploy, user guide | 45 min |
| 9 | `09_JOB_PROFILE_GAPS.md` | Ficha AF-LF-3005 (Gestor III) is the main reference: update `comportamentales` levels; new units `disposicion-mercancias`, `procedimiento-administrativo`, `contratacion` | 3 h |

After phase 3 plus phase 4 the site is already useful: **deploy at the end of every phase** so the candidate can start studying immediately.

Phases 4, 5 and 6 only add JSON files and can run in parallel sessions once phase 2 is done.

## Repo structure (created in phase 1)
```
/index.html              app shell (hash router)
/css/app.css
/js/app.js               router + bootstrapping
/js/engine/*.js          lesson player + item renderers   (phase 2)
/js/progress/*.js        storage, stats, review queue      (phase 3)
/js/tests/*.js           practice test runner              (phase 7)
/content/manifest.json   list of units + test files
/content/units/<unit-id>.json
/content/tests/<test-id>.json
/content/resources.json  videos + external links
/resources/              (gitignored) the resource pack
/plan/                   these plan files
```

## Session protocol (for every phase)
1. Read `plan/00_OVERVIEW.md` and the phase file only. Read `content/SCHEMA.md` when touching content.
2. Do the phase's tasks; keep files small and modular.
3. Run the phase's checks (each file has an "Acceptance checks" section).
4. Commit with a clear message, push, confirm the Pages URL loads.
5. Append a 3–5 line entry to `plan/PROGRESS_LOG.md` (what was done, what's left, any deviations) so the next session has context without re-reading code.

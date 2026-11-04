# Phase 4 — Content: tax procedure units (highest weight)

Prerequisite: phase 1 schema (phase 2 engine helps to preview). Read `plan/00_OVERVIEW.md`, `content/SCHEMA.md` and `resources/00_GOA_datos_clave.md`.

Units: `fiscalizacion`, `sanciones`, `obligaciones`, `liquidacion` → `content/units/<id>.json`.

## Authoring rules (apply to phases 4–6)
- **Source-first.** For every fact, `grep -n "ARTICULO 705" resources/01_ET_…txt` (try both `ARTICULO` and `ARTÍCULO`) and read only the surrounding lines. Put the exact article in `source`. If a fact can't be found in the resource pack, leave it out.
- Check the article is current: the Senado text marks repealed or modified articles; use the version in force before 19-jun-2026.
- Write PJS items the way the official guide does: a realistic DIAN workplace **case** (the candidate is the Gestor I), an **enunciado** ("Al gestor le corresponde…"), 3 options that are all plausible actions. Wrong options should be typical confusions: the **step of a different stage**, the **wrong deadline**, the **wrong act**, or an action outside the official's competence. Each option gets an `optionWhy` with the article.
- Difficulty: **1 = básico** (recall a term, deadline or definition), **2 = intermedio** (apply one rule to a case), **3 = avanzado** (multi-step case: compute dates, choose the act in the right sequence, combine two rules).
- Open answers: short ("Explique en 2–3 líneas…", "Enumere los requisitos…") with 3–5 `keyPoints` and 4–8 `keywords`.
- Spanish, plain language, short sentences. No content copied from prep websites.

## Volume per unit (minimum)
| | fiscalizacion | sanciones | obligaciones | liquidacion |
|---|---|---|---|---|
| Lessons (6–10 steps each, ≥ 50 % items) | 6 | 5 | 4 | 4 |
| Flashcards | 30 | 30 | 20 | 20 |
| Bank questions (`questions`) | 40 | 35 | 25 | 25 |
| of which PJS | ≥ 60 % | ≥ 60 % | ≥ 50 % | ≥ 50 % |
| of which open | 5 | 5 | 3 | 3 |
| Difficulty mix 1/2/3 | 30/40/30 % | same | same | same |

## Coverage checklist
**fiscalizacion** (ET Libro V Título IV + Ley 2586/2026 + D1165 Título 13)
- Facultades de fiscalización (ET 684), requerimientos ordinarios (686), emplazamiento para corregir (685, 1 mes), beneficio de auditoría (689-3).
- Corrección aritmética (697–701), requerimiento especial (703–707: contenido, término de notificación 705, respuesta 3 meses 707, ampliación 708), liquidación oficial de revisión (710–714: 6 meses, correspondencia 711, firmeza 714).
- Emplazamiento previo por no declarar (715), liquidación de aforo (716–719).
- Recursos: reconsideración (720–722, requisitos), términos para resolver.
- Liquidación provisional (ET 764 and following, if in the resource file).
- Aduanero: controles y gestión del riesgo (D1165 arts. 576–601), fiscalización aduanera, gestión persuasiva (Ley 2586 art. 5), medidas cautelares (art. 7), requerimiento especial aduanero (arts. 66–70), liquidación oficial (56–64), recurso de reconsideración y firmeza (88–98), transición (112).
- Comparison lessons: tributario vs aduanero sequence (emplazamiento ↔ gestión persuasiva; requerimiento especial ↔ REA; liquidación de revisión ↔ liquidación oficial).

**sanciones** (ET 634–682 + Ley 2586 arts. 14–26)
- Intereses moratorios (634–635), sanción mínima (639, in UVT; UVT 2026 = $52.374), prescripción (638), independencia de sanciones (637), gradualidad y reducción (640).
- Extemporaneidad (641, 642), no declarar (643), corrección (644), inexactitud (647–648), información (651), facturación (652), clausura (657), others present in the file.
- Aduanero: clasificación leve/grave/gravísima and UVT/% ranges (art. 14), gradualidad, reducción, allanamiento (17–19), caducidad 3 años (20), aprehensión y decomiso (26).
- Calculation items (difficulty 2–3): compute a late-filing sanction, apply the 50 % reduction when conditions hold, check the minimum sanction. **Show the worked calculation in `explain`.**

**obligaciones** (ET 555–633)
- Sustancial vs formal; sujetos obligados (571 ff.), clases de declaraciones (574), declaraciones que se tienen por no presentadas (580), firmas (580-1 / 596 / 597 as applicable), correcciones que aumentan / disminuyen (588–589), no declarantes (592 ff.), RUT, facturación, deber de informar, conservar documentos (632).

**liquidacion** (keep to concepts; ET Libro I/II/III via grep)
- Structure of the renta depuration (ingresos → renta líquida → renta gravable → impuesto), cedular system for personas naturales, tarifa general personas jurídicas, renta presuntiva status, IVA (hecho generador, responsables, tarifa general, bienes excluidos vs exentos), retención en la fuente (concepto, agentes, declaración mensual).
- Use only figures you find in the resource pack or `resources/README.md` (e.g., UVT 2026). If a rate cannot be verified, frame the item conceptually.

## Acceptance checks
- `node -e` or a small Python script validates every unit file: unique IDs, required fields per type, `answer` exists among options, PJS has exactly 3 options, every item has `source`, difficulty in 1–3.
- Spot-check 10 random items against the resource text (record which in the log).
- Preview at least one lesson per unit in the browser. Commit, push, log entry.

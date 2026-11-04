# Phase 8 — QA, fact audit, launch

Prerequisite: all previous phases. Read `plan/00_OVERVIEW.md` and `plan/PROGRESS_LOG.md`.

## 1. Fact audit (most important — wrong facts cost points)
- Write `scripts/audit_sample.py` that picks ~15 % of all scored items, stratified by unit, and prints `id | source | key claim`.
- For each sampled item, `grep` the cited article in `resources/` and confirm deadline, percentage, competent body and act name. Fix errors in place (keep the same IDs).
- Global greps for high-risk facts across all content and make them consistent:
  - Requerimiento especial: notify within 3 years (ET 705), reply 3 months (707); liquidación de revisión 6 months after the reply term (710); firmeza 3 years (714); aforo 5 years (717); emplazamiento para corregir 1 month (685).
  - Extemporaneidad 5 % per month up to 100 % (641); inexactitud 100 % (648); gradualidad reduction 50 % (640).
  - Ley 2586: caducidad 3 years (art. 20); infraction classes (art. 14).
  - UVT 2026 = $52.374.
  - Exam facts: 5 hours, 8:00–1:00, minimum 70.00, PJS with 3 options, Likert with 4 levels.
  Each must match the resource text; correct any item that disagrees.
- Flag any item tagged `post-corte` in the UI with a small note "norma posterior al corte (19-jun-2026)".

## 2. Functional QA
- Validator passes on all unit and test files.
- Play one lesson per unit, one flashcard deck, the mistake review and one full practice test on: phone (375 px), tablet, desktop; light and dark mode.
- Offline-ish: after first load, the app should keep working if the connection drops mid-lesson (content already fetched). Optional: add a tiny service worker caching `index.html`, `css`, `js`, `content` (cache-first, versioned). Skip if time is short.
- Accessibility: focus visible, buttons have labels, color is never the only signal (✓/✗ icons with text), contrast AA.
- Performance: no framework, total JS < 150 KB; content files lazy-loaded per unit.

## 3. Launch
- Home: replace the demo unit; add a short "Cómo usar" card: (1) haz las lecciones de prioridad 1, (2) repasa tus errores cada día, (3) haz un simulacro intermedio el jueves y el de examen el viernes, (4) sábado: solo repaso de errores y tarjetas.
- Recursos page: the verified YouTube videos and official links from `resources/README.md` (CNSC guide, Acuerdo, Anexo, normograma links), grouped by unit.
- Add `README.md` to the repo: what the site is, live URL, how to add content (schema), how progress is stored, export/import.
- Final commit, push, confirm Pages build; open the live URL on a phone.
- Log entry with the live URL, item counts per unit, and known gaps.

## Acceptance checks
- Audit sample fully checked; no contradictions in high-risk facts.
- Live URL works on the candidate's phone; export file downloads.

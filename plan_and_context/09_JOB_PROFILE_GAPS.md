# Phase 9 — Ficha AF-LF-3005 (Gestor III): main reference

Added 2026-11-04. **The user's instruction: the ficha PDF `manual_de_funciones-gestor3_jiovani.pdf` (untracked, repo root, never commit it) is the main reference for the site.** Exam is **8 Nov 2026**: build the highest-value gaps first, deploy after each unit.

## What the ficha says (read from the PDF, 2 pages)
- **Gestor III**, código 303, grado 03, nivel Profesional, carrera administrativa. Ficha **AF-LF-3005**, format FT-TAH-1824 v5, vigencia desde 15/04/2024, adopted by **Res. DIAN 0067 de 11/04/2024**.
- Proceso Administrativo y Financiero; subproceso Recursos administrativos, operación logística, compras y contratos. Niveles central y seccional.
- Propósito: gestionar las acciones del subproceso de recursos administrativos y de logística.
- Funciones esenciales F1–F11: F1 contratación y plan de adquisiciones; F2 notificación, comunicación y publicación de actos administrativos, mejoras a la herramienta informática; F3 inventarios y parque automotor; F4 servicios generales, etapa precontractual, seguimiento de contratos, proyección de actos; F5 instrumentos archivísticos; F6 infraestructura; F7–F9 ingreso, custodia y disposición de mercancías aprehendidas, decomisadas o abandonadas y bienes adjudicados en cobro coactivo y procesos concursales; F10 análisis de ingresos, disposición, egresos, certificación de IVA, facturación, venta; F11 funciones comunes.
- Competencias funcionales básicas: los 6 comportamentales básicos; evasión, elusión y contrabando, Ley de transparencia; herramientas informáticas; gestión documental; MIPG; Código de Buen Gobierno y de Integridad; principios de la función pública y CPACA (Ley 1437/2011 Títulos I, II, III caps. I, V–VIII); Sistema PQRSF; políticas de servicio al ciudadano; Constitución (derechos fundamentales, principios, estructura del Estado); generalidades de los recursos administrativos.
- Competencias funcionales: custodia y disposición de mercancías; infraestructura; servicios; contratación pública; control de ingresos, almacenamiento y registro de mercancías; gestión documental; SIIF Nación II.
- Comportamentales específicas: **Comportamiento ético N4, Adaptabilidad N4, Innovación N3, Solución de problemas N4.**
- The PDF has **no OPEC number**. The site was built on OPEC 236767 (Gestor I) indicators; keep those units, but the ficha now sets priorities.

## Gap analysis (ficha vs site)
| Ficha item | Site coverage | Source in pack? |
|---|---|---|
| CPACA: notificación, comunicación, publicación, recursos; PQRSF / derecho de petición | None | No: get Ley 1437/2011 and Ley 1755/2015 |
| Contratación pública, plan anual de adquisiciones, supervisión | None | No: get Ley 80/1993, Ley 1150/2007, D1082/2015 |
| Custodia y disposición de mercancías aprehendidas, decomisadas, abandonadas | Partial (`sanciones`, `fiscalizacion`) | **Yes**: `src/d1165_2019.txt` from art. 736 (Formas de disposición); abandono legal |
| Comportamentales N4/N3 + Innovación, Solución de problemas | Partial (Gestor I levels) | **Yes**: `11_competencias_Res065_integridad.txt` (Innovación ~l.654, Solución de problemas ~l.759) |
| Constitución, principios función pública, Buen Gobierno, Ley de transparencia (Ley 1712/2014) | Partial | Partial (`00_GOA_datos_clave.md` cites Ley 1712 arts. 3, 7) |
| Gestión documental, instrumentos archivísticos | Yes | Yes |
| MIPG, integridad | Yes | Yes |
| Inventarios, parque automotor, infraestructura, SIIF Nación II | None | No primary sources; **skip** unless the user provides them |

## Tasks (in order)
1. **Update `comportamentales`** to the ficha's levels: Comportamiento ético N4, Adaptabilidad N4 (+ N3 contrast), new lessons for Innovación N3 and Solución de problemas N4, from Res. 065. Fix the intro text that says "niveles que este curso asume para Gestor I". Add Likert items for the two new competencies.
2. **New unit `disposicion-mercancias`** (D1165 arts. 736 ff., abandono legal, aprehensión/decomiso links to `sanciones`): formas de disposición, quién decide, custodia, informes. 3 lessons, 15 cards, 20 questions (≥ 50 % PJS).
3. **New unit `procedimiento-administrativo`** (Ley 1437 + Ley 1755): principios (art. 3), derecho de petición y plazos, notificación personal / por aviso / electrónica, comunicación y publicación, recursos (reposición, apelación, queja), firmeza. Same volume. Download official texts first; verify every article number.
4. **New unit `contratacion`** (Ley 80, Ley 1150, D1082): principios, etapas, modalidades de selección, plan anual de adquisiciones, estudios previos, supervisión vs interventoría. Same volume.
5. Update home/overview text and `00_OVERVIEW.md` goal line to name Gestor III / AF-LF-3005 as the reference.
6. Add the new units to the random simulacro pool; leave the 7 fixed tests as they are unless time allows.

New sources go under `dian_2676_recursos/dian_material/src/` (gitignored) and into its README map. Authoring rules: `04_CONTENT_TAX.md`. Every item cites its article; never invent articles or figures.

## Acceptance checks
- `node tools/validate.mjs` passes after each unit; new units in `content/manifest.json` without `pending`.
- `node tools/build-tests.mjs` if the bank changed; bump `VERSION` in `sw.js` when the manifest, `index.html`, `css` or `js` change.
- Commit and push after each unit; log in `plan/PROGRESS_LOG.md`; update `current_state.md`.

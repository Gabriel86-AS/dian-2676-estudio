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
- The PDF has no OPEC number. **The user gave it on 2026-11-04: OPEC 236739.** The site was built on the indicators of OPEC 236767 (Gestor I), which is not the user's OPEC.

## Step 0 — indicators of OPEC 236739
- Second PDF `GESTOR III_descripcion_del_cargo_jiovani.pdf` (SIMO listing, untracked, never commit) **confirms**: OPEC 236739, Gestor III 303-03, ficha AF-LF-3005, Proceso de Selección DIAN 2676 – Ingreso, 28 vacantes, cierre de inscripciones 2026-02-07, same functions as the ficha. Experience is required, so the functional test weighs **65 %** (eliminatory, 70/100).
- The user is preparing the site **for another person** (the candidate). The indicator list (http://dian-2676-areandina.com.co/indicadores-dian-2667/) needs the candidate's inscription number; neither PDF has it.
- **Working assumption until the candidate sends the list:** the ficha's functions are the proxy for the indicators. If the list arrives, map each indicator to a unit and reorder.

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

## Tasks (in order: functional test first, it is eliminatory and 65 %)
1. ✅ **Done 2026-11-04** (5 lessons, 22 cards, 34 questions, prefix `merc`; priorities updated in the manifest). **New unit `disposicion-mercancias`** (functions F7–F10, 3 of the 11): D1165 arts. 736 ff. (formas de disposición), abandono legal, aprehensión/decomiso links to `sanciones`, custodia, inspección y clasificación, informes. Source in pack. 3–4 lessons, 15 cards, 20 questions (≥ 50 % PJS).
2. **New unit `procedimiento-administrativo`** (F2, F4; básicas CPACA, recursos, PQRSF): Ley 1437 + Ley 1755: principios (art. 3), derecho de petición y plazos, notificación personal / por aviso / electrónica, comunicación y publicación, recursos (reposición, apelación, queja), firmeza. Download official texts first; verify every article number.
3. **New unit `contratacion`** (F1, F4): Ley 80, Ley 1150, D1082: principios, etapas, modalidades de selección, plan anual de adquisiciones, estudios previos, supervisión vs interventoría.
4. **Update `comportamentales`** to the ficha's levels: Comportamiento ético N4, Adaptabilidad N4, new Innovación N3 and Solución de problemas N4 (Res. 065). Fix the "Gestor I" intro text and `index.html` meta description.
5. Mark existing units outside the ficha (`cambiaria`, `auditoria`, `lavado`, `liquidacion`, `obligaciones`) as lower priority in the home screen copy; keep them available.
6. Add the new units to the random simulacro pool and build one fixed simulacro weighted to the ficha's functions.

New sources go under `dian_2676_recursos/dian_material/src/` (gitignored) and into its README map. Authoring rules: `04_CONTENT_TAX.md`. Every item cites its article; never invent articles or figures.

## Acceptance checks
- `node tools/validate.mjs` passes after each unit; new units in `content/manifest.json` without `pending`.
- `node tools/build-tests.mjs` if the bank changed; bump `VERSION` in `sw.js` when the manifest, `index.html`, `css` or `js` change.
- Commit and push after each unit; log in `plan/PROGRESS_LOG.md`; update `current_state.md`.

# Phase 9 — Job-profile gaps (ficha de empleo, optional)

Added 2026-11-04 after the user placed `manual_de_funciones-gestor3_jiovani.pdf` (untracked, repo root). Exam is **8 Nov 2026**, so this phase is small and gated.

## What the PDF is
- Ficha **AF-LF-3005**, **Gestor III**, código 303, grado 03, nivel Profesional, carrera administrativa. Format FT-TAH-1824 v5, vigencia desde 15/04/2024, adopted by **Res. DIAN 0067 de 11/04/2024** (MERF, 466 fichas).
- Proceso Administrativo y Financiero; subproceso Recursos administrativos, operación logística, compras y contratos. Niveles central y seccional.
- **Mismatch:** the site targets **Gestor I, OPEC 236767**. The pack's `src/res067_2024.txt` has the resolution body but not the 466-ficha annex, so the Gestor I ficha is still unknown (it is in SIMO).

## Step 0 — gate (ask the user before writing content)
**2026-11-04: the user confirmed AF-LF-3005 / Gestor III is their job (Q1 = yes). Q2 (OPEC number) still open.**
1. Is AF-LF-3005 / Gestor III the job the user applies to, or someone else's ficha?
2. Is the OPEC still 236767? If the OPEC changed, re-check the indicators at http://dian-2676-areandina.com.co/indicadores-dian-2667/ (needs inscription number). **Exam content follows the OPEC's indicators, not the ficha.**
3. If the ficha is not the user's, stop here: log it and do nothing else.

## Gap analysis (ficha vs site, checked 2026-11-04)
| Ficha item | Site coverage |
|---|---|
| F1, F4: contratación en sus etapas, plan anual de adquisiciones; comp. funcional "Contratación Pública" | None |
| F2: notificación, comunicación, publicación de actos administrativos; básica "Ley 1437/2011 Títulos I, II, III (Caps. I, V–VIII)"; "Generalidades de los recursos administrativos" | None (ET recursos only, in `fiscalizacion`) |
| F3: control de inventarios y parque automotor | None |
| F7–F10: ingreso, custodia, disposición y egreso de mercancías aprehendidas, decomisadas o abandonadas; bienes adjudicados en cobro coactivo; comp. "Administración de la custodia y disposición de mercancías", "Control de ingresos, almacenamiento y registro" | Partial (`sanciones`, `fiscalizacion` mention aprehensión/decomiso) |
| Comp. "Operación SIIF Nación II" | None |
| Básicas: Sistema PQRSF, políticas de servicio al ciudadano | None |
| F5, básica/funcional: gestión documental, instrumentos archivísticos | Yes (`gestion-documental`) |
| Básicas: Código de Integridad, Buen Gobierno, MIPG, Constitución, principios función pública | Mostly (`integridad`, `auditoria`, `misionalidad`) |
| Comportamentales: Comportamiento ético N4, Adaptabilidad N4, Innovación N3, Solución de problemas N4 | Partial: `comportamentales` uses Gestor I levels (ético N1/N4, adaptabilidad N1–N2); Innovación and Solución de problemas absent |

## Sources (none are in the pack yet; get them first, never invent articles)
- Ley 1437 de 2011 (CPACA): Títulos I–III, esp. notificaciones (arts. 65–73) and recursos (arts. 74–82). Verify article numbers against the official text before citing. The pack already cites Ley 1437 art. 5 num. 2 in `00_GOA_datos_clave.md`.
- Contratación: Ley 80 de 1993, Ley 1150 de 2007, Decreto 1082 de 2015 (plan anual de adquisiciones, modalidades). DIAN MN-ADF-0013 Manual de Contratación is named in `11_competencias_Res065_integridad.txt` (line ~2224) but its text is not in the pack.
- Mercancías aprehendidas: Decreto 1165 de 2019 (disposición de mercancías). Check `src/d1165_2019.txt` with `node tools/art.mjs` before looking elsewhere.
- PQRSF: Ley 1755 de 2015 (derecho de petición, plazos).
Save new sources under `dian_2676_recursos/dian_material/src/` (gitignored) and add them to its README map.

## Tasks (only if Step 0 says the ficha is the user's)
Priority by likely PJS weight and time left:
1. **New unit `procedimiento-administrativo`** (Ley 1437 + Ley 1755): notificación personal / por aviso / electrónica, recursos de reposición / apelación / queja, plazos, derecho de petición. 3 lessons, 15 cards, 20 questions (≥ 50 % PJS).
2. **New unit `contratacion`** (Ley 80, Ley 1150, D1082): etapas precontractual / contractual / poscontractual, modalidades de selección, plan anual de adquisiciones, supervisión vs interventoría. Same volume.
3. **Extend `sanciones` or new lesson** on disposición de mercancías aprehendidas (D1165) only if the source text is in the pack.
4. Skip SIIF and parque automotor: no exam indicator covers them and there are no primary sources in the pack.
5. Behavioral levels: if the user's OPEC changed, re-check `comportamentales` levels against the new ficha.

For each new unit: add it to `content/manifest.json` (no `pending`), follow the authoring rules in `04_CONTENT_TAX.md`, and tag items `"tags": ["ficha"]` so they can be filtered out of exam-indicator practice.

## Acceptance checks
- `node tools/validate.mjs` passes; `node tools/build-tests.mjs` only if the bank should include the new units (default: **no**, since simulacros mirror the OPEC indicators).
- Bump `VERSION` in `sw.js` if the manifest changes.
- Log in `plan/PROGRESS_LOG.md`; update `current_state.md`.

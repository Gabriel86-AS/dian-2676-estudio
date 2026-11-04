// #/progreso — dashboard. Positive stats only.
import { esc } from '../engine/md.js';
import { buildIndex } from '../content.js';
import { getState } from '../progress/store.js';
import { dayKey, DAY } from '../progress/scheduler.js';
import { unitStats, readiness, weakest } from '../progress/stats.js';

const pct = x => Math.round(x * 100);

function chart(st) {
  const now = Date.now(), days = [];
  for (let i = 13; i >= 0; i--) { const k = dayKey(now - i * DAY); days.push([k, st.studyDays[k] || 0]); }
  const max = Math.max(30, ...days.map(d => d[1]));
  const bars = days.map(([k, m], i) => { const h = Math.round((m / max) * 70); return `<g><title>${k}: ${Math.round(m)} min</title><rect x="${i * 24 + 3}" y="${78 - h}" width="18" height="${h}" rx="3" fill="var(--primary)"/><text x="${i * 24 + 12}" y="92" font-size="8" text-anchor="middle" fill="var(--muted)">${k.slice(8)}</text></g>`; }).join('');
  return `<svg viewBox="0 0 336 96" role="img" aria-label="Minutos estudiados en los últimos 14 días" style="width:100%;height:auto"><line x1="0" y1="78" x2="336" y2="78" stroke="var(--line)"/>${bars}</svg>`;
}

export async function progreso(app) {
  const st = getState();
  const { units } = await buildIndex(st.settings);
  const rows = units.filter(u => u.pool.length || Object.values(st.items).some(r => r.unit === u.entry.id)).map(u => ({ u, stats: unitStats(st, u.pool) }));
  const tot = rows.reduce((a, r) => ({ total: a.total + r.stats.total, seen: a.seen + r.stats.seen, attempts: a.attempts + r.stats.attempts, correct: a.correct + r.stats.correct }), { total: 0, seen: 0, attempts: 0, correct: 0 });
  const lessons = Object.keys(st.lessons).length;
  const rd = readiness(st, units);
  const weak = weakest(rows.map(r => ({ ...r, id: r.u.entry.id })));
  const hist = [...st.tests].reverse();
  const todayMin = Math.round(st.studyDays[dayKey()] || 0);

  app.innerHTML = `<h1>Progreso</h1>
    <div class="stats"><div class="card"><b>${tot.seen}/${tot.total}</b><small>ítems vistos</small></div><div class="card"><b>${tot.attempts ? pct(tot.correct / tot.attempts) + '%' : '–'}</b><small>acierto al primer intento</small></div><div class="card"><b>${lessons}</b><small>lecciones completadas</small></div></div>
    <div class="card"><h2>Preparación para la prueba funcional</h2>
      <p class="prep"><b>${Math.round(rd.pct)}</b> / 100 <span class="muted">· mínimo para aprobar: 70</span></p>
      <div class="bar gate"><i style="width:${Math.min(100, rd.pct)}%"></i><span style="left:70%"></span></div>
      <p class="muted">Estimación, no oficial. Maestría ponderada (prioridad 1 ×3, 2 ×2, 3 ×1) de ${rd.used} de ${rd.total} unidades funcionales con contenido publicado.</p></div>
    <h2>Minutos por día <small class="muted">(hoy: ${todayMin} min)</small></h2><div class="card">${chart(st)}</div>
    <h2>Temas más débiles</h2>
    ${weak.length ? weak.map(w => `<a class="card unit" href="#/practica/${esc(w.id)}"><h3>${esc(w.u.entry.title)}</h3><small class="muted">Acierto ${pct(w.stats.accuracy)}% en ${w.stats.attempts} intentos</small></a>`).join('<br>') : '<p class="msg">Aparecerán cuando tengas al menos 5 intentos en una unidad.</p>'}
    <h2>Por unidad</h2>
    ${rows.length ? rows.map(({ u, stats: s }) => `<div class="card" style="margin-bottom:12px"><h3>${esc(u.entry.title)}</h3>
      <div class="bar"><i style="width:${pct(s.mastery)}%"></i></div>
      <p class="muted">Dominio ${pct(s.mastery)}% · Acierto ${s.accuracy === null ? '–' : pct(s.accuracy) + '%'} · Errores abiertos ${s.mistakes} · Vistos ${s.seen}/${s.total}</p>
      ${u.unit?.questions?.length ? `<a class="btn alt" href="#/practica/${esc(u.entry.id)}">Practicar esta unidad</a>` : ''}</div>`).join('') : '<p class="msg">Todavía no hay contenido con progreso.</p>'}
    <h2>Simulacros</h2>
    ${hist.length ? `<div class="tbl"><table><tr><th>Fecha</th><th>Simulacro</th><th>Puntaje</th></tr>${hist.map(t => `<tr><td>${esc(t.at.slice(0, 10))}</td><td>${esc(t.id)}</td><td>${Number(t.score).toFixed(1)}</td></tr>`).join('')}</table></div>` : '<p class="msg">Aún no has hecho simulacros.</p>'}`;
}

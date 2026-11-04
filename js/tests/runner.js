// Practice-test runner: one question per screen, no feedback until submit, timer, navigator, autosave.
import { esc } from '../engine/md.js';
import { shuffle } from '../engine/items.js';
import { loadManifest, buildIndex } from '../content.js';
import { getState, recordTest } from '../progress/store.js';
import { dayKey } from '../progress/scheduler.js';

const runKey = id => `dian2676:run:${id}`;
const readRun = id => { try { return JSON.parse(localStorage.getItem(runKey(id))); } catch (e) { return null; } };
const writeRun = (id, r) => { try { localStorage.setItem(runKey(id), JSON.stringify(r)); } catch (e) { /* sin almacenamiento */ } };
const clearRun = id => { try { localStorage.removeItem(runKey(id)); } catch (e) { /* nada */ } };
const fmt = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h ? h + ':' : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(s % 60).padStart(2, '0')}`; };
const optsOf = it => it.type === 'truefalse' ? [{ id: 'V', text: 'Verdadero' }, { id: 'F', text: 'Falso' }] : it.options;
const keyOf = it => it.type === 'truefalse' ? (it.answer ? 'V' : 'F') : it.answer;

export async function simulacros(app) {
  const m = await loadManifest();
  const st = getState();
  const { units } = await buildIndex(st.settings);
  const withQ = units.filter(u => u.entry.area === 'funcional' && u.pool.some(i => ['mcq', 'pjs', 'truefalse'].includes(i.type)) && !u.entry.id.startsWith('_'));
  const last = id => [...st.tests].reverse().find(t => t.id === id);
  app.innerHTML = `<h1>Simulacros</h1>
    <p class="muted">Preguntas del banco, sin retroalimentación hasta enviar. Tus errores pasan al banco de repaso.</p>
    <div class="grid">${(m.tests || []).map(t => { const l = last(t.id), run = readRun(t.id); return `<div class="card unit"><span class="badge">${esc(t.mode === 'exam' ? 'Examen' : 'Práctica')}</span><h3>${esc(t.title)}</h3><small class="muted">${t.count} preguntas · ${t.minutes} min${l ? ` · último puntaje ${Number(l.score).toFixed(2)}` : ''}</small><div class="actions"><a class="btn" href="#/simulacro/${esc(t.id)}">${run ? 'Continuar simulacro' : 'Empezar'}</a></div></div>`; }).join('')}</div>
    <h2>Aleatorio</h2>
    <div class="card"><label class="row">Unidad&nbsp;<select id="ru"><option value="">Todas</option>${withQ.map(u => `<option value="${esc(u.entry.id)}">${esc(u.entry.title)}</option>`).join('')}</select></label>
      <label class="row">Preguntas&nbsp;<select id="rn"><option>10</option><option selected>20</option><option>30</option></select></label>
      <label class="row">Dificultad&nbsp;<select id="rd"><option value="">Todas</option><option value="1">Básica</option><option value="2">Intermedia</option><option value="3">Avanzada</option></select></label>
      <div class="actions"><button type="button" class="btn" id="rgo">Generar simulacro</button></div></div>
    <h2>Práctica externa gratuita</h2>
    <p class="muted">No hay simulacro oficial embebible. Estos enlaces abren en otra pestaña (requieren registro o son videos):</p>
    <ul><li><a href="https://www.grupogeard.com/simulacro/29-intensivo-dian-2676" target="_blank" rel="noopener">Grupo Geard · Intensivo DIAN 2676</a></li>
    <li><a href="https://www.grupogeard.com/simulacros-gratis" target="_blank" rel="noopener">Grupo Geard · simulacros gratis</a></li>
    <li><a href="https://www.youtube.com/watch?v=hNiNOahMjuo" target="_blank" rel="noopener">Simulacro gratuito DIAN 2676 (Talento Público)</a></li>
    <li><a href="https://www.youtube.com/watch?v=hwlVn-fNgA8" target="_blank" rel="noopener">Simulacro final + consejos (Misión Mérito)</a></li></ul>`;
  app.querySelector('#rgo').addEventListener('click', () => {
    const u = app.querySelector('#ru').value, n = +app.querySelector('#rn').value, d = app.querySelector('#rd').value;
    const ids = shuffle(withQ.filter(x => !u || x.entry.id === u).flatMap(x => x.pool).filter(i => ['mcq', 'pjs', 'truefalse'].includes(i.type) && (!d || i.difficulty === +d)).map(i => i.id)).slice(0, n);
    if (!ids.length) { alert('No hay preguntas con esos filtros.'); return; }
    const id = 'aleatorio';
    clearRun(id);
    writeRun(id, { id, title: 'Simulacro aleatorio', minutes: Math.max(5, Math.round(n * 1.5)), mode: 'practice', items: ids, answers: {}, flags: [], idx: 0, startedAt: Date.now() });
    location.hash = '#/simulacro/aleatorio';
  });
}

export async function simulacro(app, id) {
  const st = getState();
  const { index } = await buildIndex({});
  let run = readRun(id);
  if (!run) {
    const m = await loadManifest();
    const t = (m.tests || []).find(x => x.id === id);
    if (!t) { app.innerHTML = '<p><a href="#/simulacros">← Simulacros</a></p><h1>Simulacro no encontrado</h1>'; return; }
    const def = await (await fetch('content/' + t.file)).json();
    run = { id, title: def.title, minutes: def.minutes, mode: def.mode, items: def.items, answers: {}, flags: [], idx: 0, startedAt: Date.now() };
    writeRun(id, run);
  }
  const items = run.items.map(i => index.get(i)).filter(Boolean);
  if (!items.length) { app.innerHTML = '<p><a href="#/simulacros">← Simulacros</a></p><h1>Simulacro sin preguntas</h1>'; clearRun(id); return; }
  let timer = null, done = false, showNav = false;
  const remaining = () => run.minutes * 60 - (Date.now() - run.startedAt) / 1000;
  const save = () => writeRun(id, run);

  function render() {
    if (done) return;
    const e = items[run.idx], it = e.item, sel = run.answers[it.id];
    const answered = Object.keys(run.answers).length;
    app.innerHTML = `<div class="lp"><div class="lp-top"><a class="x" href="#/simulacros" aria-label="Salir (se guarda)">✕</a><div class="pbar"><i style="width:${(answered / items.length) * 100}%"></i></div><b id="tm">${fmt(remaining())}</b></div>
      <div class="lp-body"><p class="muted">Pregunta ${run.idx + 1} de ${items.length} · ${answered} respondidas</p>
      ${it.case ? `<div class="caso"><span class="lbl">Caso</span><p>${esc(it.case)}</p></div>` : ''}
      <p class="prompt">${esc(it.prompt || it.statement)}</p>
      <div class="opts">${optsOf(it).map(o => `<button type="button" class="opt${sel === o.id ? ' sel' : ''}" data-o="${esc(o.id)}"><span class="lt">${esc(o.id)}</span><span>${o.text ? esc(o.text) : ''}</span></button>`).join('')}</div>
      <div class="actions"><button type="button" class="btn alt" id="flag">${run.flags.includes(it.id) ? '★ Marcada' : '☆ Marcar para revisar'}</button><button type="button" class="btn alt" id="nav">Ver preguntas</button></div>
      ${showNav ? `<div class="navgrid">${items.map((x, i) => `<button type="button" class="chip${i === run.idx ? ' on' : ''}${run.answers[x.item.id] ? ' ans' : ''}${run.flags.includes(x.item.id) ? ' flg' : ''}" data-i="${i}">${i + 1}</button>`).join('')}</div>` : ''}</div>
      <div class="lp-foot"><div class="grade"><button type="button" class="btn alt" id="prev"${run.idx ? '' : ' disabled'}>Anterior</button>${run.idx < items.length - 1 ? '<button type="button" class="btn" id="next">Siguiente</button>' : '<button type="button" class="btn" id="submit">Enviar simulacro</button>'}</div>${run.idx < items.length - 1 ? '<button type="button" class="btn alt big" id="submit2">Enviar simulacro</button>' : ''}</div></div>`;
    document.body.classList.add('in-lesson');
    app.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => { run.answers[it.id] = b.dataset.o; save(); render(); }));
    app.querySelector('#flag').addEventListener('click', () => { const i = run.flags.indexOf(it.id); if (i < 0) run.flags.push(it.id); else run.flags.splice(i, 1); save(); render(); });
    app.querySelector('#nav').addEventListener('click', () => { showNav = !showNav; render(); });
    app.querySelectorAll('.navgrid .chip').forEach(b => b.addEventListener('click', () => { run.idx = +b.dataset.i; save(); render(); }));
    app.querySelector('#prev')?.addEventListener('click', () => { run.idx--; save(); render(); });
    app.querySelector('#next')?.addEventListener('click', () => { run.idx++; save(); render(); });
    app.querySelector('#submit')?.addEventListener('click', () => submit(false));
    app.querySelector('#submit2')?.addEventListener('click', () => submit(false));
  }

  function submit(auto) {
    const blank = items.filter(x => !run.answers[x.item.id]).length;
    if (!auto && blank && !confirm(`Tienes ${blank} pregunta(s) sin responder. ¿Enviar de todos modos?`)) return;
    done = true; clearInterval(timer);
    const ms = Date.now() - run.startedAt;
    const per = Math.round(ms / items.length);
    let good = 0; const byUnit = {}, wrong = [];
    for (const { item, unitId } of items) {
      const ok = run.answers[item.id] === keyOf(item);
      byUnit[unitId] = byUnit[unitId] || [0, 0]; byUnit[unitId][1]++;
      if (ok) { good++; byUnit[unitId][0]++; } else wrong.push({ item, given: run.answers[item.id] });
      window.dispatchEvent(new CustomEvent('dian:answer', { detail: { itemId: item.id, unitId, type: item.type, correct: ok, partial: false, ms: per, retry: false } }));
    }
    const score = Math.floor((good / items.length) * 10000) / 100; // dos decimales truncados
    recordTest({ id, at: new Date().toISOString(), score, byUnit, ms, answers: run.answers });
    clearRun(id);
    document.body.classList.remove('in-lesson');
    const label = o => o ? `${o.id}${o.text ? '. ' + o.text : ''}` : 'Sin respuesta';
    app.innerHTML = `<p><a href="#/simulacros">← Simulacros</a></p><h1>${esc(run.title)}: resultado</h1>
      <div class="card"><p class="prep"><b>${score.toFixed(2)}</b> / 100</p><p>${score >= 70 ? '<b>Superas el mínimo de 70.00</b> (referencia de la prueba funcional).' : 'Aún no llegas al mínimo de 70.00. Repasa tus errores y vuelve a intentarlo.'}</p><p class="muted">${good} de ${items.length} correctas · tiempo ${fmt(ms / 1000)}${auto ? ' · se agotó el tiempo' : ''}. Estimación, no oficial.</p></div>
      <h2>Por unidad</h2>${Object.entries(byUnit).map(([u, [g, t]]) => `<p>${esc(u)}: <b>${g}/${t}</b></p>`).join('')}
      <h2>Para repasar (${wrong.length})</h2>${wrong.length ? wrong.map(({ item, given }) => { const opts = optsOf(item); return `<details class="card miss"><summary>${esc(item.prompt || item.statement)}</summary>${item.case ? `<p class="muted">${esc(item.case)}</p>` : ''}<p>Tu respuesta: ${esc(label(opts.find(o => o.id === given)))}</p><p><b>Correcta:</b> ${esc(label(opts.find(o => o.id === keyOf(item))))}</p>${item.explain ? `<p>${esc(item.explain)}</p>` : ''}${item.source ? `<p class="src">Fuente: ${esc(item.source)}</p>` : ''}</details>`; }).join('') : '<p>Sin errores. ¡Excelente!</p>'}
      <div class="actions"><a class="btn" href="#/repaso">Ir a mis errores</a><a class="btn alt" href="#/progreso">Ver progreso</a></div>`;
  }

  render();
  timer = setInterval(() => { const r = remaining(); const tm = document.getElementById('tm'); if (tm) tm.textContent = fmt(r); if (r <= 0 && !done) submit(true); }, 1000);
  return { destroy() { clearInterval(timer); document.body.classList.remove('in-lesson'); } };
}

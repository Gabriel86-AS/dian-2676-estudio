// #/repaso — mistake bank, due items, read-only explanations.
import { esc } from '../engine/md.js';
import { play } from '../engine/player.js';
import { shuffle } from '../engine/items.js';
import { buildIndex } from '../content.js';
import { getState } from '../progress/store.js';
import { mistakeList, dueList } from '../progress/stats.js';

const TYPES = { mcq: 'Opción múltiple', pjs: 'Juicio situacional', truefalse: 'Verdadero/falso', open: 'Abierta', order: 'Ordenar', match: 'Relacionar', cloze: 'Completar', flashcard: 'Tarjeta' };
const filt = { unit: '', type: '' };

export function answerText(it) {
  switch (it.type) {
    case 'mcq': case 'pjs': { const o = it.options.find(x => x.id === it.answer); return o ? `${o.id}. ${o.text}` : ''; }
    case 'truefalse': return it.answer ? 'Verdadero' : 'Falso';
    case 'open': return it.modelAnswer || '';
    case 'order': return it.items.join(' → ');
    case 'match': return it.pairs.map(p => `${p.left} — ${p.right}`).join('; ');
    case 'cloze': return (it.text || '').replace(/\{\{(.+?)\}\}/g, '$1');
    case 'flashcard': return it.back || '';
    default: return '';
  }
}
const promptOf = it => it.prompt || it.statement || (it.type === 'cloze' ? answerText(it) : '') || it.front || '';

function chips(label, key, opts) {
  return `<div class="chips" role="group" aria-label="${label}"><button type="button" class="chip${filt[key] ? '' : ' on'}" data-k="${key}" data-v="">Todas</button>${opts.map(([v, t]) => `<button type="button" class="chip${filt[key] === v ? ' on' : ''}" data-k="${key}" data-v="${esc(v)}">${esc(t)}</button>`).join('')}</div>`;
}

export async function repaso(app, mode) {
  const st = getState();
  const { units, index } = await buildIndex(st.settings);
  const o = { unit: filt.unit, type: filt.type };
  const steps = list => list.map(e => ({ ...e.item, _unit: e.unitId }));

  if (mode === 'errores' || mode === 'dia') {
    const list = mode === 'errores' ? mistakeList(st, index, o).slice(0, 15) : dueList(st, index, o);
    if (!list.length) { app.innerHTML = `<p><a href="#/repaso">← Repaso</a></p><h1>Nada pendiente</h1><p class="msg">No hay ${mode === 'errores' ? 'errores por repasar' : 'ítems para hoy'} con estos filtros.</p>`; return; }
    return play({ unitId: 'repaso', lessonId: 'repaso', title: mode === 'errores' ? 'Mis errores' : 'Repaso del día', steps: shuffle(steps(list)), container: app, backHref: '#/repaso' });
  }

  if (mode === 'ver') {
    const list = mistakeList(st, index, o);
    app.innerHTML = `<p><a href="#/repaso">← Repaso</a></p><h1>Mis errores: explicaciones</h1>
      ${list.length ? list.map(e => { const it = e.item; return `<details class="card miss"><summary>${esc(promptOf(it))}</summary>
        ${it.case ? `<p class="muted">${esc(it.case)}</p>` : ''}<p><b>Respuesta:</b> ${esc(answerText(it))}</p>${it.explain ? `<p>${esc(it.explain)}</p>` : ''}${it.source ? `<p class="src">Fuente: ${esc(it.source)}</p>` : ''}</details>`; }).join('') : '<p class="msg">No tienes errores abiertos.</p>'}`;
    return;
  }

  const present = list => [...new Set(list.map(e => e.item.type))].map(t => [t, TYPES[t] || t]);
  const allWrong = mistakeList(st, index), allDue = dueList(st, index);
  const unitOpts = units.filter(u => allWrong.concat(allDue).some(e => e.unitId === u.entry.id)).map(u => [u.entry.id, u.entry.title]);
  const nWrong = mistakeList(st, index, o).length, nDue = dueList(st, index, o).length;
  app.innerHTML = `<h1>Repaso</h1>
    <div class="card"><h2>Mis errores</h2><p><b>${nWrong}</b> ${nWrong === 1 ? 'ítem abierto' : 'ítems abiertos'}. Salen del banco tras 2 aciertos seguidos.</p>
      <div class="actions"><a class="btn${nWrong ? '' : ' disabled'}" href="#/repaso/errores"${nWrong ? '' : ' aria-disabled="true"'}>Repasar errores (máx. 15)</a><a class="btn alt" href="#/repaso/ver">Ver explicaciones</a></div></div>
    <div class="card" style="margin-top:12px"><h2>Repaso del día</h2><p><b>${nDue}</b> ${nDue === 1 ? 'ítem toca' : 'ítems tocan'} hoy según tu calendario de repaso.</p>
      <div class="actions"><a class="btn${nDue ? '' : ' disabled'}" href="#/repaso/dia"${nDue ? '' : ' aria-disabled="true"'}>Empezar repaso</a></div></div>
    ${unitOpts.length ? `<h2>Filtros</h2>${chips('Unidad', 'unit', unitOpts)}${chips('Tipo', 'type', present(allWrong.concat(allDue)))}` : '<p class="msg">Cuando respondas preguntas, aquí verás tus errores y los repasos pendientes. Todo está desbloqueado desde el inicio.</p>'}`;
  app.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => { filt[b.dataset.k] = b.dataset.v; repaso(app); }));
}

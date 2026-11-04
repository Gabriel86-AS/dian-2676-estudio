// Lesson player: one step per screen, wrong items are re-queued once. No lives, no lockouts.
import { renderItem } from './items.js';
import { esc } from './md.js';

const emit = (name, detail) => { console.log(name, detail); window.dispatchEvent(new CustomEvent(name, { detail })); };
const fmtMs = ms => { const s = Math.round(ms / 1000); return s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} s` : `${s} s`; };

export function play({ unitId, lessonId, title, steps, container, backHref }) {
  document.body.classList.add('in-lesson');
  const queue = [...steps];
  const requeued = new Set();
  const first = new Map(); // itemId -> first-try result
  const missed = new Map();
  const t0 = Date.now();
  let idx = 0, api = null, answered = false, tStep = 0;

  container.innerHTML = `<div class="lp"><div class="lp-top"><a class="x" href="${esc(backHref)}" aria-label="Salir">✕</a><div class="pbar"><i></i></div></div><div class="lp-body" id="lpb"></div><div class="lp-foot"><button type="button" class="btn big" id="lpmain">Comprobar</button></div></div>`;
  const body = container.querySelector('#lpb'), main = container.querySelector('#lpmain'), bar = container.querySelector('.pbar i');

  function show() {
    if (idx >= queue.length) return finish();
    const step = queue[idx];
    answered = false; tStep = Date.now();
    bar.style.width = `${(idx / queue.length) * 100}%`;
    body.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'item t-' + step.type;
    body.appendChild(box);
    api = renderItem(step, box, result => settle(step, result));
    main.hidden = false; main.disabled = false;
    main.textContent = step.type === 'concept' ? 'Entendido' : 'Comprobar';
    main.hidden = !!(api.manual && step.type === 'flashcard');
    window.scrollTo(0, 0);
  }

  function settle(step, r) {
    if (answered) return;
    answered = true;
    const ms = Date.now() - tStep;
    if (!r.concept) {
      const rec = { itemId: step.id, unitId: step._unit || unitId, type: step.type, correct: r.correct, partial: !!r.partial, ms, given: r.given, retry: !!step._retry };
      emit('dian:answer', rec);
      if (!step._retry && !first.has(step.id)) first.set(step.id, rec);
      if (r.correct === false) {
        missed.set(step.id, step);
        if (!requeued.has(step.id)) { requeued.add(step.id); queue.push({ ...step, _retry: true }); }
      }
    }
    main.hidden = false;
    main.textContent = 'Continuar';
    if (queue[idx]._retry) body.querySelector('.item').insertAdjacentHTML('afterbegin', '<p class="retry">Repasemos esta</p>');
  }

  main.addEventListener('click', () => {
    const step = queue[idx];
    if (answered) { idx++; show(); return; }
    const r = api.check();
    if (r) settle(step, r);
    else if (api.manual) main.hidden = true;
  });

  const onKey = e => {
    if (e.target.matches('textarea, input')) { if (e.key === 'Enter' && e.target.matches('input') && !main.hidden) main.click(); return; }
    if (e.key === 'Enter' && !main.hidden) { e.preventDefault(); main.click(); }
    else if (/^[1-9]$/.test(e.key) && !answered) { const o = body.querySelectorAll('.opt:not(.ordi):not([data-l]):not([data-r])')[+e.key - 1]; o?.click(); }
  };
  document.addEventListener('keydown', onKey);

  function finish() {
    bar.style.width = '100%';
    const scored = [...first.values()].filter(r => r.correct !== null);
    const good = scored.filter(r => r.correct).length;
    const total = scored.length, ms = Date.now() - t0;
    emit('dian:lessonComplete', { unitId, lessonId, correctFirstTry: good, total, ms });
    const missedList = [...missed.values()];
    const lik = [...first.values()].filter(r => r.type === 'likert');
    const L = ['Totalmente en desacuerdo', 'En desacuerdo', 'De acuerdo', 'Totalmente de acuerdo'];
    const dist = [1, 2, 3, 4].map(n => lik.filter(r => r.given === String(n)).length);
    const reflect = lik.length ? `<h2>Tu reflexión</h2><div class="card">${dist.map((c, i) => `<p>${L[i]}: <b>${c}</b></p>`).join('')}${dist[3] / lik.length > 0.8 ? '<p class="muted">Más del 80 % de tus respuestas fueron "Totalmente de acuerdo". La prueba real incluye subescalas de control para respuestas exageradamente favorables; lo mejor es responder de forma honesta y coherente.</p>' : '<p class="muted">No hay respuestas correctas ni incorrectas. Lo mejor es responder de forma honesta y coherente.</p>'}</div>` : '';
    body.innerHTML = `<div class="end"><h1>¡Lección completada!</h1>
      <div class="stats"><div class="card"><b>${total ? Math.round((good / total) * 100) : 100}%</b><small>acierto al primer intento</small></div><div class="card"><b>${good}/${total}</b><small>correctas</small></div><div class="card"><b>${fmtMs(ms)}</b><small>tiempo</small></div></div>
      ${missedList.length ? `<h2>Para repasar</h2>${missedList.map(m => `<details class="card miss"><summary>${esc(m.prompt || m.statement || m.text || m.front || '')}</summary><p>${esc(m.explain || m.modelAnswer || m.back || '')}</p>${m.source ? `<p class="src">Fuente: ${esc(m.source)}</p>` : ''}</details>`).join('')}` : '<p>No hubo errores. ¡Buen trabajo!</p>'}
      ${reflect}
      </div>`;
    main.hidden = false; main.textContent = 'Repetir lección';
    main.replaceWith(main.cloneNode(true));
    const m2 = container.querySelector('#lpmain');
    m2.addEventListener('click', () => { self.destroy(); Object.assign(self, play({ unitId, lessonId, title, steps, container, backHref })); });
    m2.insertAdjacentHTML('afterend', `<a class="btn big alt" href="${esc(backHref)}">Volver a la unidad</a>`);
  }

  show();
  const self = { destroy() { document.removeEventListener('keydown', onKey); document.body.classList.remove('in-lesson'); } };
  return self;
}

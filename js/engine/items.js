// Item renderers. Interface: render(item, box, done) -> { check(), manual? }
// check() returns a Result { correct, partial?, given } or null when not ready.
// Items that grade themselves (open, flashcard) call done(result) instead.
import { md, esc } from './md.js';

export const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
export const shuffle = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

const src = item => (item.source ? `<p class="src">Fuente: ${esc(item.source)}</p>` : '');
const fb = (box, ok, html) => { const f = box.querySelector('.fb'); f.className = 'fb ' + (ok === null ? 'neutral' : ok ? 'ok' : 'bad'); f.innerHTML = html; };
const head = item => `${item.case ? `<div class="caso"><b>Caso</b><p>${esc(item.case)}</p></div>` : ''}<p class="prompt">${item.type === 'pjs' ? '<span class="lbl">Enunciado</span> ' : ''}<b>${esc(item.prompt ?? item.statement)}</b></p>`;

function choices(item, box, options, answer, whyMap) {
  let sel = null;
  box.innerHTML = `${head(item)}<div class="opts" role="group">${options.map(o => `<button type="button" class="opt" data-id="${esc(o.id)}"><span class="lt">${esc(o.label ?? o.id)}</span><span>${esc(o.text)}</span></button>`).join('')}</div><div class="fb" aria-live="polite"></div>`;
  const btns = [...box.querySelectorAll('.opt')];
  btns.forEach(b => b.addEventListener('click', () => {
    if (b.disabled) return;
    sel = b.dataset.id;
    btns.forEach(x => x.classList.toggle('sel', x === b));
  }));
  return {
    check() {
      if (sel === null) return null;
      const ok = String(sel) === String(answer);
      btns.forEach(b => {
        b.disabled = true;
        if (b.dataset.id === String(answer)) b.classList.add('right');
        else if (b.dataset.id === sel) b.classList.add('wrong');
      });
      const why = !ok && whyMap?.[sel] ? `<p><b>Tu opción:</b> ${esc(whyMap[sel])}</p>` : '';
      fb(box, ok, `<p><b>${ok ? '¡Correcto!' : 'No es esa.'}</b> ${esc(item.explain || '')}</p>${why}${src(item)}`);
      return { correct: ok, given: sel };
    },
  };
}

const R = {
  concept(item, box) {
    box.innerHTML = `<h2>${esc(item.title)}</h2><div class="md">${md(item.body)}</div>${item.example ? `<div class="example"><b>Ejemplo</b>${md(item.example)}</div>` : ''}${src(item)}`;
    return { check: () => ({ concept: true }) };
  },
  mcq: (item, box) => choices(item, box, item.options, item.answer, item.optionWhy),
  pjs: (item, box) => choices(item, box, item.options, item.answer, item.optionWhy),
  truefalse: (item, box) => choices(item, box, [{ id: 'true', text: 'Verdadero', label: 'V' }, { id: 'false', text: 'Falso', label: 'F' }], String(item.answer), null),

  open(item, box, done) {
    box.innerHTML = `${head(item)}<textarea class="ta" rows="5" placeholder="Escribe tu respuesta…" aria-label="Respuesta"></textarea><div class="fb" aria-live="polite"></div>`;
    const ta = box.querySelector('textarea');
    const api = {
      manual: true,
      check() {
        const text = ta.value.trim();
        if (!text || ta.disabled) return null;
        ta.disabled = true;
        const n = norm(text);
        const hits = (item.keywords || []).filter(k => n.includes(norm(k))).length;
        const need = item.minKeywords ?? 1;
        fb(box, null, `<p class="hint">Pista automática: ${hits} de ${(item.keywords || []).length} palabras clave (se pedían ${need}). Tú decides cómo te fue.</p>
          <p><b>Respuesta modelo:</b> ${esc(item.modelAnswer)}</p>
          ${item.keyPoints?.length ? `<p><b>Puntos clave:</b></p><ul>${item.keyPoints.map(k => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}${src(item)}
          <div class="grade"><button type="button" class="btn" data-g="ok">Lo tenía</button><button type="button" class="btn alt" data-g="part">Parcial</button><button type="button" class="btn alt" data-g="no">No lo tenía</button></div>`);
        box.querySelectorAll('.grade button').forEach(b => b.addEventListener('click', () => {
          const g = b.dataset.g;
          box.querySelectorAll('.grade button').forEach(x => (x.disabled = true));
          done({ correct: g === 'ok', partial: g === 'part', given: text, hits });
        }));
        return null;
      },
    };
    return api;
  },

  order(item, box) {
    let cur = shuffle(item.items);
    if (item.items.length > 1) while (cur.every((x, i) => x === item.items[i])) cur = shuffle(item.items);
    let pick = null, locked = false;
    const draw = () => {
      box.querySelector('.ord').innerHTML = cur.map((t, i) => `<button type="button" class="opt ordi${pick === i ? ' sel' : ''}" data-i="${i}" ${locked ? 'disabled' : ''}><span class="lt">${i + 1}</span><span>${esc(t)}</span></button>`).join('');
      box.querySelectorAll('.ordi').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.i;
        if (pick === null) pick = i;
        else { if (pick !== i) [cur[pick], cur[i]] = [cur[i], cur[pick]]; pick = null; }
        draw();
      }));
    };
    box.innerHTML = `${head(item)}<p class="muted">Toca dos elementos para intercambiarlos.</p><div class="opts ord"></div><div class="fb" aria-live="polite"></div>`;
    draw();
    return {
      check() {
        locked = true; draw();
        const ok = cur.every((t, i) => t === item.items[i]);
        fb(box, ok, `<p><b>${ok ? '¡Correcto!' : 'Orden correcto:'}</b></p>${ok ? '' : `<ol>${item.items.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`}<p>${esc(item.explain || '')}</p>${src(item)}`);
        return { correct: ok, given: cur.join(' > ') };
      },
    };
  },

  match(item, box) {
    const lefts = item.pairs.map(p => p.left);
    const rights = shuffle(item.pairs.map(p => p.right));
    const map = {}; // left index -> right index
    let selL = null, locked = false;
    const draw = () => {
      const pairIdx = r => Object.keys(map).find(l => map[l] === r);
      box.querySelector('.mt').innerHTML = `<div class="col">${lefts.map((t, i) => `<button type="button" class="opt${selL === i ? ' sel' : ''}${map[i] !== undefined ? ' paired' : ''}" data-l="${i}" ${locked ? 'disabled' : ''}>${map[i] !== undefined ? `<span class="lt">${+map[i] + 1}</span>` : ''}<span>${esc(t)}</span></button>`).join('')}</div>
        <div class="col">${rights.map((t, i) => `<button type="button" class="opt${pairIdx(i) !== undefined ? ' paired' : ''}" data-r="${i}" ${locked ? 'disabled' : ''}><span class="lt">${i + 1}</span><span>${esc(t)}</span></button>`).join('')}</div>`;
      box.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.l; if (map[i] !== undefined) delete map[i]; selL = i; draw(); }));
      box.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => {
        if (selL === null) return;
        const r = +b.dataset.r;
        Object.keys(map).forEach(l => { if (map[l] === r) delete map[l]; });
        map[selL] = r; selL = null; draw();
      }));
    };
    box.innerHTML = `${head(item)}<p class="muted">Toca un elemento de la izquierda y luego su pareja a la derecha.</p><div class="mt"></div><div class="fb" aria-live="polite"></div>`;
    draw();
    return {
      check() {
        if (Object.keys(map).length < lefts.length) return null;
        locked = true; draw();
        const wrong = lefts.filter((l, i) => rights[map[i]] !== item.pairs[i].right);
        const ok = wrong.length === 0;
        fb(box, ok, `<p><b>${ok ? '¡Correcto!' : 'Parejas correctas:'}</b></p>${ok ? '' : `<ul>${item.pairs.map(p => `<li>${esc(p.left)} → ${esc(p.right)}</li>`).join('')}</ul>`}<p>${esc(item.explain || '')}</p>${src(item)}`);
        return { correct: ok, partial: !ok && wrong.length < lefts.length, given: JSON.stringify(map) };
      },
    };
  },

  cloze(item, box) {
    const parts = item.text.split(/\{\{(.+?)\}\}/);
    const answers = [];
    const html = parts.map((p, i) => (i % 2 ? (answers.push(p), `<input class="gap" type="text" autocomplete="off" aria-label="Espacio ${answers.length}" size="${Math.max(6, p.length + 2)}">`) : esc(p))).join('');
    box.innerHTML = `<p class="prompt"><b>Completa</b></p><p class="cloze">${html}</p><div class="fb" aria-live="polite"></div>`;
    const inputs = [...box.querySelectorAll('.gap')];
    return {
      check() {
        if (inputs.some(x => !x.value.trim())) return null;
        const res = inputs.map((x, i) => {
          x.disabled = true;
          const ok = [answers[i], ...(item.alternatives?.[answers[i]] || [])].some(a => norm(a) === norm(x.value));
          x.classList.add(ok ? 'right' : 'wrong');
          return ok;
        });
        const n = res.filter(Boolean).length, ok = n === res.length;
        fb(box, ok, `<p><b>${ok ? '¡Correcto!' : 'Respuesta: ' + esc(answers.join(', '))}</b></p>${src(item)}`);
        return { correct: ok, partial: !ok && n > 0, given: inputs.map(x => x.value).join(' | ') };
      },
    };
  },

  likert(item, box) {
    const L = ['Totalmente en desacuerdo', 'En desacuerdo', 'De acuerdo', 'Totalmente de acuerdo'];
    const inner = choices({ ...item, prompt: item.statement }, box, L.map((t, i) => ({ id: String(i + 1), text: t, label: i + 1 })), null, null);
    const btns = [...box.querySelectorAll('.opt')];
    return {
      check() {
        const sel = box.querySelector('.opt.sel');
        if (!sel) return null;
        btns.forEach(b => (b.disabled = true));
        fb(box, null, `<p><b>No hay respuesta correcta ni incorrecta.</b> Responde con sinceridad y coherencia: contestar de forma extrema en todo se detecta con las subescalas de control.</p>${item.insight ? `<p><b>${esc(item.competency || '')}${item.level ? ' ' + esc(item.level) : ''}:</b> ${esc(item.insight)}</p>` : ''}${src(item)}`);
        return { correct: null, given: sel.dataset.id };
      },
    };
  },

  flashcard(item, box, done) {
    box.innerHTML = `<div class="fcard" tabindex="0" role="button" aria-label="Voltear tarjeta"><div class="face front">${esc(item.front)}</div><div class="face back" hidden>${esc(item.back)}${src(item)}</div></div><div class="grade" hidden><button type="button" class="btn" data-g="ok">Lo sabía</button><button type="button" class="btn alt" data-g="no">No lo sabía</button></div>`;
    const card = box.querySelector('.fcard'), grade = box.querySelector('.grade');
    const flip = () => { card.classList.add('flipped'); card.querySelector('.front').hidden = true; card.querySelector('.back').hidden = false; grade.hidden = false; };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); flip(); } });
    grade.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { grade.querySelectorAll('button').forEach(x => (x.disabled = true)); done({ correct: b.dataset.g === 'ok', given: b.dataset.g }); }));
    return { manual: true, check: () => { flip(); return null; } };
  },
};

export function renderItem(item, box, done) {
  const r = R[item.type];
  if (!r) { box.innerHTML = `<p class="msg">Tipo de ítem desconocido: ${esc(item.type)}</p>`; return { check: () => ({ concept: true }) }; }
  return r(item, box, done);
}

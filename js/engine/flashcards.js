// Deck mode: flip, then "Lo sabía" / "Repasar". Cards marked "Repasar" return to the end of the deck.
import { shuffle } from './items.js';
import { esc } from './md.js';

export function deck({ unitId, cards, container, backHref }) {
  const q = shuffle(cards);
  let known = 0, flipped = false, x0 = null;
  container.innerHTML = `<p><a href="${esc(backHref)}">← Unidad</a></p><h1>Tarjetas</h1><p class="muted" id="cnt"></p><div class="fcard big" id="fc" tabindex="0" role="button" aria-label="Voltear tarjeta"></div><div class="grade"><button type="button" class="btn alt" id="again">Repasar</button><button type="button" class="btn" id="knew">Lo sabía</button></div><p class="muted">Toca la tarjeta o pulsa espacio para voltear. Desliza → si la sabías, ← para repasar.</p>`;
  const fc = container.querySelector('#fc'), cnt = container.querySelector('#cnt');
  const draw = () => {
    if (!q.length) { container.innerHTML = `<h1>¡Mazo completado!</h1><p>Sabías ${known} tarjetas.</p><a class="btn" href="${esc(backHref)}">Volver a la unidad</a>`; cleanup(); return; }
    flipped = false;
    cnt.textContent = `Quedan ${q.length} · sabidas ${known}`;
    fc.innerHTML = `<div class="face">${esc(q[0].front)}</div>`;
  };
  const flip = () => { if (!q.length) return; flipped = !flipped; fc.innerHTML = `<div class="face${flipped ? ' back' : ''}">${esc(flipped ? q[0].back : q[0].front)}${flipped && q[0].source ? `<p class="src">Fuente: ${esc(q[0].source)}</p>` : ''}</div>`; };
  const grade = ok => {
    if (!q.length) return;
    const c = q.shift();
    window.dispatchEvent(new CustomEvent('dian:answer', { detail: { itemId: c.id, unitId, type: 'flashcard', correct: ok, partial: false, ms: 0 } }));
    if (ok) known++; else q.push(c);
    draw();
  };
  fc.addEventListener('click', flip);
  fc.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  fc.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 60) grade(dx > 0); });
  container.querySelector('#knew').addEventListener('click', () => grade(true));
  container.querySelector('#again').addEventListener('click', () => grade(false));
  const onKey = e => { if (e.key === ' ') { e.preventDefault(); flip(); } else if (e.key === 'ArrowRight') grade(true); else if (e.key === 'ArrowLeft') grade(false); };
  const cleanup = () => document.removeEventListener('keydown', onKey);
  document.addEventListener('keydown', onKey);
  draw();
  return { destroy: cleanup };
}

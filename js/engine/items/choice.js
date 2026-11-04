// Grupo de opciones grandes seleccionables (A, B, C… o etiquetas libres).
import { esc } from '../../util.js';

export const LETTERS = 'ABCDEFGH';

export function choiceGroup(container, options, { onSelect, label = 'Opciones', letters = true } = {}) {
  container.innerHTML = `<div class="options" role="radiogroup" aria-label="${esc(label)}">${options.map((o, i) => `
    <button type="button" class="opt" role="radio" aria-checked="false" data-id="${esc(o.id)}">
      ${letters ? `<span class="opt-letter" aria-hidden="true">${LETTERS[i]}</span>` : ''}<span class="opt-text">${esc(o.text)}</span>
    </button>`).join('')}</div>`;
  const btns = [...container.querySelectorAll('.opt')];
  let chosen = null;
  let locked = false;
  const select = (b) => {
    if (locked || !b) return;
    chosen = b.dataset.id;
    btns.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    onSelect?.(chosen);
  };
  btns.forEach((b) => b.addEventListener('click', () => select(b)));
  return {
    get chosen() { return chosen; },
    selectIndex: (n) => select(btns[n]),
    lock(correctId) {
      locked = true;
      btns.forEach((b) => {
        b.disabled = true;
        if (correctId == null) return;
        if (b.dataset.id === String(correctId)) b.classList.add('is-correct');
        else if (b.dataset.id === chosen) b.classList.add('is-wrong');
      });
    },
  };
}

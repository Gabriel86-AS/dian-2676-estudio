// Autoinforme Likert de 4 niveles. Nunca hay respuesta correcta.
import { esc } from '../../util.js';
import { inline } from '../md.js';
import { choiceGroup } from './choice.js';

export const LIKERT = ['Totalmente en desacuerdo', 'En desacuerdo', 'De acuerdo', 'Totalmente de acuerdo'];

export function render(item, el, ctx) {
  el.innerHTML = `
    <p class="prompt muted small">Autoinforme · ${esc(item.competency)}${item.level ? ` · nivel ${esc(item.level)}` : ''}</p>
    <p class="statement">${inline(item.statement)}</p>
    <div class="choices likert"></div>
    <div class="feedback neutral" hidden></div>`;
  const group = choiceGroup(el.querySelector('.choices'), LIKERT.map((text, i) => ({ id: String(i + 1), text })),
    { onSelect: () => ctx.setReady(true), label: 'Grado de acuerdo', letters: false });

  return {
    checkLabel: 'Responder',
    onKey: (n) => group.selectIndex(n - 1),
    check() {
      const given = Number(group.chosen);
      group.lock(null);
      const fb = el.querySelector('.feedback');
      fb.hidden = false;
      fb.innerHTML = `
        ${item.insight ? `<p><strong>Qué observa este enunciado:</strong> ${inline(item.insight)}</p>` : ''}
        <p class="small">No hay respuestas correctas o incorrectas. Responde con honestidad y coherencia:
        las subescalas de control detectan respuestas exageradamente favorables, como marcar siempre el extremo.</p>`;
      return { neutral: true, correct: null, partial: false, given };
    },
  };
}

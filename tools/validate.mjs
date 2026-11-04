// Validates content/units/*.json against SCHEMA.md. Usage: node tools/validate.mjs [unit ...]
import fs from 'node:fs';
const dir = new URL('../content/units/', import.meta.url);
const files = (process.argv.length > 2 ? process.argv.slice(2).map(f => f + '.json') : fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_')));
let bad = 0;
const err = (f, id, m) => { bad++; console.log(`  ✗ ${f} ${id}: ${m}`); };
for (const f of files) {
  const u = JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
  const seen = new Set();
  const chk = (it, inLesson) => {
    const id = it.id || '(sin id)';
    if (!it.id) return err(f, id, 'falta id');
    if (!it.source) err(f, id, 'falta source');
    if (it.type === 'concept') return;
    if (!inLesson && seen.has(it.id)) err(f, id, 'id duplicado');
    if (!inLesson) seen.add(it.id);
    if (it.type !== 'likert' && it.type !== 'flashcard' && ![1, 2, 3].includes(it.difficulty)) err(f, id, 'difficulty 1–3');
    if (it.type === 'mcq' || it.type === 'pjs') {
      if (!it.options?.some(o => o.id === it.answer)) err(f, id, 'answer no está en options');
      if (it.type === 'pjs' && (it.options.length !== 3 || !it.case)) err(f, id, 'PJS: 3 opciones y case');
      if (!it.explain) err(f, id, 'falta explain');
      for (const o of it.options) if (o.id !== it.answer && !it.optionWhy?.[o.id]) err(f, id, 'falta optionWhy ' + o.id);
    }
    if (it.type === 'truefalse' && typeof it.answer !== 'boolean') err(f, id, 'answer booleano');
    if (it.type === 'open' && !(it.modelAnswer && it.keyPoints?.length && it.keywords?.length)) err(f, id, 'open incompleto');
    if (it.type === 'order' && !(it.items?.length >= 3)) err(f, id, 'order ≥ 3');
    if (it.type === 'match' && !(it.pairs?.length >= 2)) err(f, id, 'match ≥ 2');
    if (it.type === 'cloze' && !/\{\{.+?\}\}/.test(it.text)) err(f, id, 'cloze sin hueco');
  };
  u.questions.forEach(q => chk(q, false));
  u.flashcards.forEach(c => { if (!c.id || !c.front || !c.back || !c.source) err(f, c.id, 'flashcard incompleta'); if (seen.has(c.id)) err(f, c.id, 'id duplicado'); seen.add(c.id); });
  const qids = new Set(u.questions.map(q => q.id));
  u.lessons.forEach(l => { if (l.steps.length < 6 || l.steps.length > 12) console.log(`  ! ${f} ${l.id}: ${l.steps.length} pasos`); l.steps.forEach(s => { chk(s, true); if (s.type !== 'concept' && !qids.has(s.id)) err(f, s.id, 'paso de lección no está en questions'); }); });
  const by = t => u.questions.filter(q => t.includes(q.type)).length;
  const d = [1, 2, 3].map(n => u.questions.filter(q => q.difficulty === n).length);
  console.log(`${f}: ${u.lessons.length} lecciones, ${u.flashcards.length} tarjetas, ${u.questions.length} preguntas (PJS ${by(['pjs'])}, abiertas ${by(['open'])}), dificultad ${d.join('/')}`);
}
console.log(bad ? `${bad} errores` : 'OK');
process.exit(bad ? 1 : 0);

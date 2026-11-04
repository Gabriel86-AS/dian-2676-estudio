// Generates content/tests/*.json from the question bank (mcq/pjs/truefalse only) and updates manifest.tests.
import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('content/manifest.json', root), 'utf8'));
const units = manifest.units.filter(u => !u.id.startsWith('_') && u.area === 'funcional' && fs.existsSync(new URL('content/' + u.file, root))).map(u => {
  const d = JSON.parse(fs.readFileSync(new URL('content/' + u.file, root), 'utf8'));
  return { id: u.id, priority: u.priority, items: d.questions.filter(q => ['mcq', 'pjs', 'truefalse'].includes(q.type)) };
}).filter(u => u.items.length);

const SHARE = { 1: 0.5, 2: 0.35, 3: 0.15 };
function build(total, pref, used) {
  const picked = [];
  const quota = { 1: Math.round(total * SHARE[1]), 2: Math.round(total * SHARE[2]) };
  quota[3] = total - quota[1] - quota[2];
  for (const p of [1, 2, 3]) {
    const group = units.filter(u => u.priority === p);
    const pools = group.map(u => ({ id: u.id, list: [...u.items].filter(q => !used.has(q.id)).sort((a, b) => pref.indexOf(a.difficulty) - pref.indexOf(b.difficulty) || (a.id < b.id ? -1 : 1)) }));
    let n = 0;
    while (n < quota[p] && pools.some(x => x.list.length)) for (const x of pools) { if (n >= quota[p]) break; const q = x.list.shift(); if (q) { picked.push(q.id); used.add(q.id); n++; } }
  }
  return picked;
}
function mix(total, cycle, used) { // exam: cycle of difficulties
  const picked = []; let i = 0;
  const quota = { 1: Math.round(total * 0.5), 2: Math.round(total * 0.35) }; quota[3] = total - quota[1] - quota[2];
  for (const p of [1, 2, 3]) {
    const group = units.filter(u => u.priority === p); let n = 0, guard = 0;
    while (n < quota[p] && guard++ < 1000) {
      const d = cycle[i++ % cycle.length];
      const u = group[n % group.length];
      const q = u.items.find(x => x.difficulty === d && !used.has(x.id)) || u.items.find(x => !used.has(x.id));
      if (q) { used.add(q.id); picked.push(q.id); n++; }
      else if (group.every(g => g.items.every(x => used.has(x.id)))) break;
    }
  }
  return picked;
}
const defs = [
  ['test-basico-1', 'Simulacro básico 1', 1, 30, 45, [1, 2, 3]],
  ['test-medio-1', 'Simulacro intermedio 1', 2, 40, 60, [2, 1, 3]],
  ['test-avanzado-1', 'Simulacro avanzado 1', 3, 40, 70, [3, 2, 1]],
];
fs.mkdirSync(new URL('content/tests/', root), { recursive: true });
const out = [];
const usedByDiff = { 1: new Set(), 2: new Set(), 3: new Set() };
for (const [id, title, difficulty, count, minutes, pref] of defs) {
  const items = build(count, pref, usedByDiff[difficulty]);
  fs.writeFileSync(new URL(`content/tests/${id}.json`, root), JSON.stringify({ id, title, difficulty, minutes, mode: 'practice', items }, null, 2));
  out.push({ id, file: `tests/${id}.json`, title, count: items.length, minutes, mode: 'practice' });
}
const ex = mix(60, [2, 1, 3, 2, 3, 1, 2, 2, 1, 3], new Set());
fs.writeFileSync(new URL('content/tests/test-examen-1.json', root), JSON.stringify({ id: 'test-examen-1', title: 'Simulación de examen 1', difficulty: 2, minutes: 120, mode: 'exam', items: ex }, null, 2));
out.push({ id: 'test-examen-1', file: 'tests/test-examen-1.json', title: 'Simulación de examen 1', count: ex.length, minutes: 120, mode: 'exam' });
manifest.tests = out;
fs.writeFileSync(new URL('content/manifest.json', root), JSON.stringify(manifest, null, 2));
console.log(out.map(t => `${t.id}: ${t.count} ítems, ${t.minutes} min`).join('\n'));

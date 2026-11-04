// Pure selectors over the progress state. `units` = [{ entry, pool }] from content.js.
const WEIGHT = { 1: 3, 2: 2, 3: 1 };

export function unitStats(st, pool) {
  let seen = 0, attempts = 0, correct = 0, mastered = 0, mistakes = 0;
  for (const it of pool) {
    const r = st.items[it.id];
    if (!r) continue;
    seen++; attempts += r.attempts; correct += r.correct;
    if (r.attempts > 0 && r.box >= 3) mastered++;
    if (r.inMistakes) mistakes++;
  }
  return { total: pool.length, seen, attempts, correct, accuracy: attempts ? correct / attempts : null, mastery: pool.length ? mastered / pool.length : 0, mistakes };
}

// Estimación de la prueba funcional: maestría ponderada (prioridad 1×3, 2×2, 3×1) de las unidades con contenido.
export function readiness(st, units) {
  const fun = units.filter(u => u.entry.area === 'funcional' && !u.entry.id.startsWith('_'));
  const withContent = fun.filter(u => u.pool.length);
  let num = 0, den = 0;
  for (const u of withContent) { const w = WEIGHT[u.entry.priority] || 1; num += w * unitStats(st, u.pool).mastery; den += w; }
  return { pct: den ? (num / den) * 100 : 0, used: withContent.length, total: fun.length };
}

export function weakest(rows, n = 3) {
  return rows.filter(r => r.stats.attempts >= 5).sort((a, b) => a.stats.accuracy - b.stats.accuracy).slice(0, n);
}

// index: Map id -> { item, unitId, priority }. opts: { unit, type, now }
const pass = (e, o) => e && e.item.type !== 'likert' && (!o.unit || e.unitId === o.unit) && (!o.type || e.item.type === o.type);

export function mistakeList(st, index, o = {}) {
  return Object.entries(st.items)
    .filter(([id, r]) => r.inMistakes && pass(index.get(id), o))
    .sort((a, b) => (a[1].wrongAt || '') < (b[1].wrongAt || '') ? -1 : 1)
    .map(([id]) => index.get(id));
}

export function dueList(st, index, o = {}) {
  const now = o.now ?? Date.now();
  return Object.entries(st.items)
    .filter(([id, r]) => !r.inMistakes && r.attempts > 0 && Date.parse(r.due) <= now && pass(index.get(id), o))
    .sort((a, b) => (index.get(a[0]).priority - index.get(b[0]).priority) || (a[1].due < b[1].due ? -1 : 1))
    .map(([id]) => index.get(id));
}

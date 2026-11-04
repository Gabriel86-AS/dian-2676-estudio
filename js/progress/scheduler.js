// Pure progress logic (no DOM, no storage): Leitner scheduling, mistake bank, merge, migration.
export const DAY = 864e5;
export const KEY = 'dian2676:v1';
const CAP_FROM = Date.parse('2026-11-06T00:00:00-05:00'); // desde aquí los intervalos se acotan a 3 días
const DAYS_BY_BOX = [0, 0, 1, 2, 4, 7]; // índice = caja (1–5)
const REAL_LESSON = id => id && id !== 'practica' && id !== 'repaso';

const iso = t => new Date(t).toISOString();
export const dayKey = (now = Date.now()) => new Date(now - 5 * 36e5).toISOString().slice(0, 10); // America/Bogota

export function intervalDays(box, now = Date.now()) {
  const d = DAYS_BY_BOX[box] ?? 0;
  return now >= CAP_FROM ? Math.min(d, 3) : d;
}

export function emptyState(now = Date.now()) {
  return { version: 1, createdAt: iso(now), items: {}, lessons: {}, tests: [], studyDays: {}, settings: { hideLikert: false, large: false } };
}

// rec: { itemId, unitId, type, correct (true|false|null), partial, ms, retry }
export function applyAnswer(st, rec, now = Date.now()) {
  const k = dayKey(now);
  st.studyDays[k] = Math.round(((st.studyDays[k] || 0) + Math.min(rec.ms || 0, 3e5) / 6e4) * 100) / 100;
  let it = st.items[rec.itemId];
  if (!it) it = st.items[rec.itemId] = { unit: rec.unitId, type: rec.type, attempts: 0, correct: 0, partial: 0, lastResult: null, lastAt: null, avgMs: 0, inMistakes: false, okStreak: 0, box: 1, due: iso(now) };
  it.lastAt = iso(now);
  if (rec.retry) return it; // repetición dentro de la misma sesión: no puntúa
  if (rec.correct === null || rec.correct === undefined) { it.lastResult = 'seen'; return it; } // Likert
  it.avgMs = Math.round((it.avgMs * it.attempts + (rec.ms || 0)) / (it.attempts + 1));
  it.attempts++;
  if (rec.partial) {
    it.partial++; it.lastResult = 'partial'; it.okStreak = 0;
    if (!it.inMistakes) { it.inMistakes = true; it.wrongAt = iso(now); }
  } else if (rec.correct) {
    it.correct++; it.lastResult = 'correct'; it.box = Math.min(5, it.box + 1); it.okStreak++;
    if (it.inMistakes && it.okStreak >= 2) { it.inMistakes = false; delete it.wrongAt; }
  } else {
    it.lastResult = 'wrong'; it.box = 1; it.okStreak = 0;
    if (!it.inMistakes) { it.inMistakes = true; it.wrongAt = iso(now); }
  }
  it.due = iso(now + intervalDays(it.box, now) * DAY);
  return it;
}

export function applyLesson(st, rec, now = Date.now()) {
  if (!REAL_LESSON(rec.lessonId)) return null;
  const acc = rec.total ? rec.correctFirstTry / rec.total : 1;
  const l = st.lessons[rec.lessonId] || (st.lessons[rec.lessonId] = { completedAt: iso(now), bestAccuracy: 0, runs: 0 });
  l.completedAt = iso(now); l.bestAccuracy = Math.max(l.bestAccuracy, acc); l.runs++;
  return l;
}

// Fusión de dos estados: por ítem gana más intentos, luego lastAt más reciente.
export function merge(a, b) {
  const out = emptyState();
  out.createdAt = [a.createdAt, b.createdAt].filter(Boolean).sort()[0] || out.createdAt;
  for (const id of new Set([...Object.keys(a.items), ...Object.keys(b.items)])) {
    const x = a.items[id], y = b.items[id];
    if (!x || !y) { out.items[id] = { ...(x || y) }; continue; }
    out.items[id] = { ...((y.attempts > x.attempts || (y.attempts === x.attempts && (y.lastAt || '') > (x.lastAt || ''))) ? y : x) };
  }
  for (const id of new Set([...Object.keys(a.lessons), ...Object.keys(b.lessons)])) {
    const x = a.lessons[id], y = b.lessons[id];
    out.lessons[id] = !x || !y ? { ...(x || y) } : { completedAt: x.completedAt > y.completedAt ? x.completedAt : y.completedAt, bestAccuracy: Math.max(x.bestAccuracy, y.bestAccuracy), runs: Math.max(x.runs, y.runs) };
  }
  const seen = new Set();
  out.tests = [...a.tests, ...b.tests].filter(t => { const k = t.id + '|' + t.at; return seen.has(k) ? false : (seen.add(k), true); }).sort((p, q) => (p.at < q.at ? -1 : 1));
  for (const d of new Set([...Object.keys(a.studyDays), ...Object.keys(b.studyDays)])) out.studyDays[d] = Math.max(a.studyDays[d] || 0, b.studyDays[d] || 0);
  out.settings = { ...b.settings, ...a.settings };
  return out;
}

// Valida y migra un objeto leído de disco o importado. Lanza Error si no es válido.
export function migrate(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('Formato no válido');
  if (typeof obj.version !== 'number' || obj.version > 1) throw new Error('Versión no compatible');
  if (!obj.items || typeof obj.items !== 'object' || Array.isArray(obj.items)) throw new Error('Faltan los ítems');
  const base = emptyState();
  const st = { ...base, ...obj, settings: { ...base.settings, ...(obj.settings || {}) } };
  for (const f of ['lessons', 'studyDays']) if (!st[f] || typeof st[f] !== 'object') st[f] = {};
  if (!Array.isArray(st.tests)) st.tests = [];
  for (const [id, it] of Object.entries(st.items)) {
    if (!it || typeof it !== 'object' || !Number.isFinite(it.attempts)) throw new Error('Ítem no válido: ' + id);
  }
  return st;
}

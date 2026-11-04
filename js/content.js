// Content loading (cached) and the item index used by progress screens.
let manifest = null;
const units = new Map();

export async function loadManifest() {
  if (manifest) return manifest;
  try {
    const r = await fetch('content/manifest.json');
    if (!r.ok) throw new Error(r.status);
    manifest = await r.json();
  } catch (e) {
    manifest = { units: [], tests: [], error: true };
  }
  return manifest;
}

export async function loadUnit(id) {
  if (units.has(id)) return units.get(id);
  const m = await loadManifest();
  const entry = m.units.find(u => u.id === id);
  let data = null;
  if (entry) {
    try {
      const r = await fetch('content/' + entry.file);
      if (!r.ok) throw new Error(r.status);
      data = await r.json();
    } catch (e) { data = null; }
  }
  units.set(id, data);
  return data;
}

// Every answerable item of a unit once (questions, flashcards, lesson steps), tagged with `_unit`.
export function poolOf(unit, unitId) {
  const seen = new Map();
  const add = (it, type) => { if (it?.id && it.type !== 'concept' && !seen.has(it.id)) seen.set(it.id, { ...it, type: it.type || type, _unit: unitId }); };
  (unit?.questions || []).forEach(q => add(q));
  (unit?.flashcards || []).forEach(c => add(c, 'flashcard'));
  (unit?.lessons || []).forEach(l => l.steps.forEach(s => add(s)));
  return [...seen.values()];
}

const LIKERT_AREAS = ['comportamental', 'integridad'];

// → { units: [{ entry, unit, pool }], index: Map id -> { item, unitId, priority } }
export async function buildIndex({ hideLikert = false } = {}) {
  const m = await loadManifest();
  const all = await Promise.all(m.units.map(e => loadUnit(e.id)));
  const list = m.units.map((entry, i) => ({ entry, unit: all[i], pool: poolOf(all[i], entry.id) }))
    .filter(u => !(hideLikert && LIKERT_AREAS.includes(u.entry.area)));
  const index = new Map();
  for (const u of list) for (const item of u.pool) index.set(item.id, { item, unitId: u.entry.id, priority: u.entry.priority });
  return { units: list, index, error: !!m.error };
}

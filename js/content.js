// Carga de contenido JSON con caché en memoria.
const cache = new Map();

export async function loadJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const p = fetch(path, { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error(`No se pudo cargar ${path} (${r.status})`);
    return r.json();
  });
  cache.set(path, p);
  p.catch(() => cache.delete(path));
  return p;
}

export const loadManifest = () => loadJSON('content/manifest.json');

export async function loadUnit(id) {
  const manifest = await loadManifest();
  const entry = manifest.units.find((u) => u.id === id);
  if (!entry) return { entry: null, unit: null };
  try {
    return { entry, unit: await loadJSON(`content/${entry.file}`) };
  } catch {
    return { entry, unit: null };
  }
}

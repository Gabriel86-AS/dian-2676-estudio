// Router + bootstrapping. Feature screens are filled in by later phases.
const app = document.getElementById('app');
const EXAM = new Date('2026-11-08T08:00:00-05:00'); // America/Bogota (UTC-5, sin DST)
const AREAS = { funcional: 'Funcional', comportamental: 'Comportamental', integridad: 'Integridad' };
let manifest = null;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function loadManifest() {
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

async function loadUnit(id) {
  const m = await loadManifest();
  const entry = m.units.find(u => u.id === id);
  if (!entry) return null;
  try {
    const r = await fetch('content/' + entry.file);
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) {
    return null;
  }
}

function tickCountdown() {
  const d = document.getElementById('cd-d');
  if (!d) return;
  const ms = Math.max(0, EXAM - Date.now());
  d.textContent = Math.floor(ms / 864e5);
  document.getElementById('cd-h').textContent = Math.floor(ms / 36e5) % 24;
  document.getElementById('cd-m').textContent = Math.floor(ms / 6e4) % 60;
}

async function home() {
  const m = await loadManifest();
  const units = [...m.units].sort((a, b) => a.priority - b.priority);
  app.innerHTML = `<h1>Examen DIAN 2676 · Gestor I</h1>
    <p>Domingo 8 de noviembre de 2026, 8:00 a. m. (hora de Bogotá).</p>
    <div class="countdown"><div><b id="cd-d">–</b><small>días</small></div><div><b id="cd-h">–</b><small>horas</small></div><div><b id="cd-m">–</b><small>min</small></div></div>
    <h2>Unidades</h2>
    ${m.error ? '<p class="msg">No se pudo cargar el contenido. Abre el sitio desde un servidor web.</p>' : ''}
    <div class="grid">${units.map(u => `
      <a class="card unit" href="#/unidad/${esc(u.id)}">
        <span class="badge${u.priority === 1 ? ' p1' : ''}">Prioridad ${u.priority}</span>
        <span class="badge">${AREAS[u.area] || esc(u.area)}</span>
        <h3>${esc(u.title)}</h3>
        <div class="bar"><i style="width:0%"></i></div>
      </a>`).join('')}</div>`;
  tickCountdown();
}

async function unit(id) {
  const u = await loadUnit(id);
  if (!u) {
    app.innerHTML = '<p><a href="#/">← Inicio</a></p><h1>Unidad no disponible</h1><p class="msg">El contenido de esta unidad aún no se ha publicado.</p>';
    return;
  }
  app.innerHTML = `<p><a href="#/">← Inicio</a></p><h1>${esc(u.title)}</h1><p>${esc(u.summary || '')}</p>
    <p class="msg">Lecciones, tarjetas y preguntas se activan en la fase 2.</p>`;
}

const placeholder = title => () => {
  app.innerHTML = `<h1>${title}</h1><p class="msg">Disponible en una fase posterior del plan.</p>`;
};

const routes = [
  [/^#?\/?$/, 'inicio', home],
  [/^#\/unidad\/([^/]+)$/, 'inicio', unit],
  [/^#\/leccion\/([^/]+)\/([^/]+)$/, 'inicio', placeholder('Lección')],
  [/^#\/tarjetas\/([^/]+)$/, 'inicio', placeholder('Tarjetas')],
  [/^#\/repaso$/, 'repaso', placeholder('Repaso')],
  [/^#\/simulacros$/, 'simulacros', placeholder('Simulacros')],
  [/^#\/simulacro\/([^/]+)$/, 'simulacros', placeholder('Simulacro')],
  [/^#\/progreso$/, 'progreso', placeholder('Progreso')],
  [/^#\/recursos$/, 'recursos', placeholder('Recursos')],
  [/^#\/ajustes$/, 'ajustes', placeholder('Ajustes')],
];

async function route() {
  const hash = location.hash || '#/';
  for (const [re, tab, fn] of routes) {
    const mt = hash.match(re);
    if (!mt) continue;
    document.querySelectorAll('[data-tab]').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
    await fn(...mt.slice(1).map(decodeURIComponent));
    window.scrollTo(0, 0);
    return;
  }
  app.innerHTML = '<h1>Página no encontrada</h1><p><a href="#/">Volver al inicio</a></p>';
}

window.addEventListener('hashchange', route);
route();
setInterval(tickCountdown, 30000);

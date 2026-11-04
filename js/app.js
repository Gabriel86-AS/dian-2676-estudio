// Shell de la app: enrutador por hash y pantallas base.
import { loadManifest, loadUnit, loadJSON } from './content.js';

const view = document.getElementById('view');
// 8 nov 2026, 8:00 a. m. hora de Bogotá (UTC−5).
const EXAM_DATE = new Date('2026-11-08T08:00:00-05:00');

const AREA_LABEL = { funcional: 'Funcional', comportamental: 'Comportamental', integridad: 'Integridad' };

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let cleanup = null;
function onLeave(fn) { cleanup = fn; }

// ---------- Rutas ----------
const routes = [
  { re: /^\/?$/, tab: 'inicio', render: home },
  { re: /^\/unidad\/([\w-]+)$/, tab: 'inicio', render: unitPage },
  { re: /^\/leccion\/([\w-]+)\/([\w-]+)$/, tab: 'inicio', render: () => soon('Lección') },
  { re: /^\/tarjetas\/([\w-]+)$/, tab: 'inicio', render: () => soon('Tarjetas') },
  { re: /^\/repaso$/, tab: 'repaso', render: () => soon('Repaso de errores') },
  { re: /^\/simulacros$/, tab: 'simulacros', render: () => soon('Simulacros') },
  { re: /^\/simulacro\/([\w-]+)$/, tab: 'simulacros', render: () => soon('Simulacro') },
  { re: /^\/progreso$/, tab: 'progreso', render: () => soon('Progreso') },
  { re: /^\/recursos$/, tab: 'recursos', render: recursos },
  { re: /^\/ajustes$/, tab: 'ajustes', render: () => soon('Ajustes') },
];

async function router() {
  if (cleanup) { cleanup(); cleanup = null; }
  const path = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  const route = routes.find((r) => r.re.test(path));
  setActiveTab(route?.tab);
  try {
    if (!route) return notFound();
    await route.render(...path.match(route.re).slice(1));
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="card notice"><h1>Algo salió mal</h1><p>${esc(err.message)}</p><a class="btn" href="#/">Volver al inicio</a></div>`;
  }
  view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function setActiveTab(tab) {
  document.querySelectorAll('[data-tab]').forEach((a) => {
    if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ---------- Pantallas ----------
async function home() {
  view.innerHTML = `
    <section class="card countdown" aria-labelledby="cd-title">
      <h1 id="cd-title">Prueba escrita DIAN 2676</h1>
      <p>Domingo 8 de noviembre de 2026 · 8:00 a. m. a 1:00 p. m.</p>
      <div class="cd-grid" id="cd" role="timer" aria-live="off"></div>
      <p class="small">Competencias funcionales: eliminatoria, mínimo 70/100.</p>
    </section>
    <h2 class="section-title">Unidades</h2>
    <div class="unit-grid" id="units"><p class="muted">Cargando unidades…</p></div>`;

  const cd = document.getElementById('cd');
  const tick = () => { cd.innerHTML = countdownHTML(EXAM_DATE - Date.now()); };
  tick();
  const timer = setInterval(tick, 1000);
  onLeave(() => clearInterval(timer));

  const box = document.getElementById('units');
  try {
    const { units } = await loadManifest();
    box.innerHTML = units.map(unitCard).join('');
  } catch (err) {
    box.innerHTML = `<div class="card notice"><p>No se pudo cargar la lista de unidades. ${esc(err.message)}</p></div>`;
  }
}

function countdownHTML(ms) {
  if (ms <= 0) return '<p style="grid-column:1/-1">¡Llegó el día! Mucha calma y éxito.</p>';
  const s = Math.floor(ms / 1000);
  const parts = [
    [Math.floor(s / 86400), 'días'],
    [Math.floor((s % 86400) / 3600), 'horas'],
    [Math.floor((s % 3600) / 60), 'min'],
    [s % 60, 'seg'],
  ];
  return parts.map(([n, l]) => `<div class="cd-cell"><span class="cd-num">${n}</span><span class="cd-lbl">${l}</span></div>`).join('');
}

function unitCard(u) {
  return `
    <a class="card unit-card" href="#/unidad/${esc(u.id)}">
      <h3>${esc(u.title)}</h3>
      <div class="progress" aria-label="Progreso de la unidad: 0 %"><span style="width:0%"></span></div>
      <div class="unit-meta">
        <span class="badge">${esc(AREA_LABEL[u.area] || u.area)}</span>
        <span class="badge p${u.priority}">Prioridad ${u.priority}</span>
      </div>
    </a>`;
}

async function unitPage(id) {
  view.innerHTML = '<p class="muted">Cargando…</p>';
  const { entry, unit } = await loadUnit(id);
  if (!entry) return notFound();
  const head = `<a class="back" href="#/">← Unidades</a><h1>${esc(entry.title)}</h1>`;
  if (!unit) {
    view.innerHTML = `${head}
      <div class="card notice"><p>Esta unidad todavía no tiene contenido. Se está preparando; vuelve pronto.</p></div>`;
    return;
  }
  const lessons = unit.lessons || [];
  view.innerHTML = `${head}
    ${unit.summary ? `<p class="muted">${esc(unit.summary)}</p>` : ''}
    ${unit.sources?.length ? `<p class="small muted">Fuentes: ${unit.sources.map(esc).join(' · ')}</p>` : ''}
    <section class="card">
      <h2>Lecciones</h2>
      ${lessons.length ? `<ul class="lesson-list">${lessons.map((l) => `
        <li><a href="#/leccion/${esc(unit.id)}/${esc(l.id)}"><span>${esc(l.title)}</span><span class="muted small">${l.minutes ? `${l.minutes} min` : ''}</span></a></li>`).join('')}
      </ul>` : '<p class="muted">Aún no hay lecciones.</p>'}
    </section>
    ${unit.flashcards?.length ? `<a class="btn" href="#/tarjetas/${esc(unit.id)}">Tarjetas (${unit.flashcards.length})</a>` : ''}`;
}

async function recursos() {
  view.innerHTML = '<h1>Recursos</h1><p class="muted">Cargando…</p>';
  let data = { videos: [], links: [] };
  try { data = await loadJSON('content/resources.json'); } catch { /* sin recursos aún */ }
  const items = [...(data.links || []), ...(data.videos || [])];
  view.innerHTML = `<h1>Recursos</h1>${items.length
    ? items.map((r) => `<div class="card"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>${r.note ? `<p class="small muted">${esc(r.note)}</p>` : ''}</div>`).join('')
    : '<div class="card"><p class="muted">Pronto encontrarás aquí videos y enlaces oficiales.</p></div>'}`;
}

function soon(title) {
  view.innerHTML = `<h1>${esc(title)}</h1>
    <div class="card"><p>Esta sección estará disponible muy pronto.</p><a class="btn secondary" href="#/">Volver al inicio</a></div>`;
}

function notFound() {
  view.innerHTML = `<h1>Página no encontrada</h1><div class="card"><a class="btn" href="#/">Volver al inicio</a></div>`;
}

window.addEventListener('hashchange', router);
router();

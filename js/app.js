// Shell de la app: enrutador por hash y pantallas.
import { loadManifest, loadUnit, loadJSON } from './content.js';
import { esc, shuffle } from './util.js';
import { playLesson } from './engine/player.js';
import { playDeck } from './engine/flashcards.js';
import { on } from './engine/events.js';

const view = document.getElementById('view');
// 8 nov 2026, 8:00 a. m. hora de Bogotá (UTC−5).
const EXAM_DATE = new Date('2026-11-08T08:00:00-05:00');
const PRACTICE_SIZE = 10;

const AREA_LABEL = { funcional: 'Funcional', comportamental: 'Comportamental', integridad: 'Integridad' };

// Hasta la fase 3 los eventos solo se registran en consola.
on('answer', (e) => console.debug('[answer]', e));
on('lessonComplete', (e) => console.debug('[lessonComplete]', e));
on('card', (e) => console.debug('[card]', e));

let cleanup = null;
function onLeave(fn) { cleanup = fn; }

// ---------- Rutas ----------
const routes = [
  { re: /^\/?$/, tab: 'inicio', render: home },
  { re: /^\/unidad\/([\w-]+)$/, tab: 'inicio', render: unitPage },
  { re: /^\/leccion\/([\w-]+)\/([\w-]+)$/, tab: 'inicio', render: lessonPage },
  { re: /^\/practicar\/([\w-]+)$/, tab: 'inicio', render: practicePage },
  { re: /^\/tarjetas\/([\w-]+)$/, tab: 'inicio', render: deckPage },
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
    if (!route) notFound();
    else await route.render(...path.match(route.re).slice(1));
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="card notice"><h1>Algo salió mal</h1><p>${esc(err.message)}</p><a class="btn" href="#/">Volver al inicio</a></div>`;
  }
  if (!document.body.classList.contains('in-lesson')) view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function setActiveTab(tab) {
  document.querySelectorAll('[data-tab]').forEach((a) => {
    if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ---------- Inicio ----------
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

// ---------- Unidad ----------
async function requireUnit(id) {
  view.innerHTML = '<p class="muted">Cargando…</p>';
  const { entry, unit } = await loadUnit(id);
  if (!entry) { notFound(); return null; }
  if (!unit) {
    view.innerHTML = `<a class="back" href="#/">← Unidades</a><h1>${esc(entry.title)}</h1>
      <div class="card notice"><p>Esta unidad todavía no tiene contenido. Se está preparando; vuelve pronto.</p></div>`;
    return null;
  }
  return unit;
}

async function unitPage(id) {
  const unit = await requireUnit(id);
  if (!unit) return;
  const lessons = unit.lessons || [];
  const nQ = unit.questions?.length || 0;
  const nC = deckCards(unit).length;
  view.innerHTML = `
    <a class="back" href="#/">← Unidades</a>
    <h1>${esc(unit.title)}</h1>
    ${unit.summary ? `<p class="muted">${esc(unit.summary)}</p>` : ''}
    ${unit.sources?.length ? `<p class="small muted">Fuentes: ${unit.sources.map(esc).join(' · ')}</p>` : ''}
    <div class="unit-actions">
      ${nC ? `<a class="btn secondary" href="#/tarjetas/${esc(unit.id)}">Tarjetas (${nC})</a>` : ''}
      ${nQ ? `<a class="btn secondary" href="#/practicar/${esc(unit.id)}">Practicar preguntas</a>` : ''}
      <a class="btn secondary" href="#/repaso">Mis errores en esta unidad</a>
    </div>
    <section class="card">
      <h2>Lecciones</h2>
      ${lessons.length ? `<ul class="lesson-list">${lessons.map((l) => `
        <li><a href="#/leccion/${esc(unit.id)}/${esc(l.id)}"><span>${esc(l.title)}</span><span class="muted small">${l.minutes ? `${l.minutes} min` : ''}</span></a></li>`).join('')}
      </ul>` : '<p class="muted">Aún no hay lecciones.</p>'}
    </section>`;
}

async function lessonPage(unitId, lessonId) {
  const unit = await requireUnit(unitId);
  if (!unit) return;
  const lesson = unit.lessons?.find((l) => l.id === lessonId);
  if (!lesson) return notFound();
  onLeave(playLesson({ unit, lesson, el: view, backHref: `#/unidad/${unit.id}` }));
}

async function practicePage(unitId) {
  const unit = await requireUnit(unitId);
  if (!unit) return;
  const picks = shuffle(unit.questions || []).slice(0, PRACTICE_SIZE);
  const lesson = { id: 'practica', title: `Práctica · ${unit.title}`, steps: picks.map((q) => ({ ref: q.id })) };
  onLeave(playLesson({ unit, lesson, el: view, backHref: `#/unidad/${unit.id}` }));
}

// Mazo = tarjetas de la unidad + tarjetas sueltas dentro de las lecciones.
function deckCards(unit) {
  const inline = (unit.lessons || []).flatMap((l) => (l.steps || []).filter((s) => s.type === 'flashcard'));
  const seen = new Set();
  return [...(unit.flashcards || []), ...inline].filter((c) => !seen.has(c.id) && seen.add(c.id));
}

async function deckPage(unitId) {
  const unit = await requireUnit(unitId);
  if (!unit) return;
  onLeave(playDeck({ unit, cards: deckCards(unit), el: view, backHref: `#/unidad/${unit.id}` }));
}

// ---------- Otras ----------
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

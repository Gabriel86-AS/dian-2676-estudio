// Router + bootstrapping. Feature screens are filled in by later phases.
const app = document.getElementById('app');
const EXAM = new Date('2026-11-08T08:00:00-05:00'); // America/Bogota (UTC-5, sin DST)
const AREAS = { funcional: 'Funcional', comportamental: 'Comportamental', integridad: 'Integridad' };

import { esc } from './engine/md.js';
import { play } from './engine/player.js';
import { deck } from './engine/flashcards.js';
import { shuffle } from './engine/items.js';
import { loadManifest, loadUnit, buildIndex } from './content.js';
import { initStore, getState, isPersistent } from './progress/store.js';
import { unitStats, dueList } from './progress/stats.js';
import { repaso } from './screens/repaso.js';
import { progreso } from './screens/progreso.js';
import { ajustes, applySettings } from './screens/ajustes.js';
import { simulacros, simulacro } from './tests/runner.js';

let current = null; // active player/deck, destroyed on route change

function tickCountdown() {
  const d = document.getElementById('cd-d');
  if (!d) return;
  const ms = Math.max(0, EXAM - Date.now());
  d.textContent = Math.floor(ms / 864e5);
  document.getElementById('cd-h').textContent = Math.floor(ms / 36e5) % 24;
  document.getElementById('cd-m').textContent = Math.floor(ms / 6e4) % 60;
}

async function home() {
  const st = getState();
  const { units, index, error } = await buildIndex(st.settings);
  const sorted = [...units].sort((a, b) => a.entry.priority - b.entry.priority);
  const due = dueList(st, index).length;
  app.innerHTML = `<h1>Examen DIAN 2676 · Gestor I</h1>
    <p>Domingo 8 de noviembre de 2026, 8:00 a. m. (hora de Bogotá).</p>
    <div class="countdown"><div><b id="cd-d">–</b><small>días</small></div><div><b id="cd-h">–</b><small>horas</small></div><div><b id="cd-m">–</b><small>min</small></div></div>
    ${due ? `<p><a class="chip on" href="#/repaso/dia">Repaso pendiente: ${due}</a></p>` : ''}
    <h2>Unidades</h2>
    ${error ? '<p class="msg">No se pudo cargar el contenido. Abre el sitio desde un servidor web.</p>' : ''}
    <div class="grid">${sorted.map(({ entry: u, unit, pool }) => {
      const s = unitStats(st, pool);
      const next = unit?.lessons?.find(l => !st.lessons[l.id]);
      return `
      <div class="card unit">
        <a href="#/unidad/${esc(u.id)}" class="ulink">
          <span class="badge${u.priority === 1 ? ' p1' : ''}">Prioridad ${u.priority}</span>
          <span class="badge">${AREAS[u.area] || esc(u.area)}</span>
          <h3>${esc(u.title)}</h3>
          <div class="bar"><i style="width:${s.total ? Math.round((s.seen / s.total) * 100) : 0}%"></i></div>
          <small class="muted">${s.total ? `${s.seen}/${s.total} ítems vistos` : 'Contenido en preparación'}</small>
        </a>
        ${next ? `<a class="btn alt cont" href="#/leccion/${esc(u.id)}/${esc(next.id)}">Continuar: ${esc(next.title)}</a>` : ''}
      </div>`;
    }).join('')}</div>`;
  tickCountdown();
}

async function unit(id) {
  const u = await loadUnit(id);
  if (!u) {
    app.innerHTML = '<p><a href="#/">← Inicio</a></p><h1>Unidad no disponible</h1><p class="msg">El contenido de esta unidad aún no se ha publicado.</p>';
    return;
  }
  const done = getState().lessons;
  const lessons = u.lessons || [];
  app.innerHTML = `<p><a href="#/">← Inicio</a></p><h1>${esc(u.title)}</h1><p>${esc(u.summary || '')}</p>
    ${u.sources?.length ? `<p class="muted">Fuentes: ${u.sources.map(esc).join('; ')}</p>` : ''}
    <div class="actions">
      <a class="btn" href="#/tarjetas/${esc(u.id)}"${u.flashcards?.length ? '' : ' hidden'}>Tarjetas (${(u.flashcards || []).length})</a>
      <a class="btn" href="#/practica/${esc(u.id)}"${u.questions?.length ? '' : ' hidden'}>Practicar preguntas</a>
      <a class="btn alt" href="#/repaso">Mis errores</a>
    </div>
    <h2>Lecciones</h2>
    ${lessons.length ? lessons.map(l => `<a class="card unit" href="#/leccion/${esc(u.id)}/${esc(l.id)}"><h3>${done[l.id] ? '✓ ' : ''}${esc(l.title)}</h3><small class="muted">${l.minutes || '?'} min · ${l.steps.length} pasos${done[l.id] ? ` · mejor acierto ${Math.round(done[l.id].bestAccuracy * 100)}%` : ''}</small></a>`).join('<br>') : '<p class="msg">Aún no hay lecciones.</p>'}`;
}

async function lesson(unitId, lessonId) {
  const u = await loadUnit(unitId);
  const l = u?.lessons?.find(x => x.id === lessonId);
  if (!l) { app.innerHTML = '<p><a href="#/">← Inicio</a></p><h1>Lección no disponible</h1>'; return; }
  return play({ unitId, lessonId, title: l.title, steps: l.steps, container: app, backHref: `#/unidad/${unitId}` });
}

async function practice(unitId) {
  const u = await loadUnit(unitId);
  const qs = (u?.questions || []).filter(q => q.type !== 'concept');
  if (!qs.length) { app.innerHTML = '<p><a href="#/">← Inicio</a></p><h1>Sin preguntas todavía</h1>'; return; }
  return play({ unitId, lessonId: 'practica', title: 'Práctica', steps: shuffle(qs).slice(0, 10), container: app, backHref: `#/unidad/${unitId}` });
}

async function cards(unitId) {
  const u = await loadUnit(unitId);
  if (!u?.flashcards?.length) { app.innerHTML = '<p><a href="#/">← Inicio</a></p><h1>Sin tarjetas todavía</h1>'; return; }
  return deck({ unitId, cards: u.flashcards, container: app, backHref: `#/unidad/${unitId}` });
}

const placeholder = title => () => {
  app.innerHTML = `<h1>${title}</h1><p class="msg">Disponible en una fase posterior del plan.</p>`;
};

const routes = [
  [/^#?\/?$/, 'inicio', home],
  [/^#\/unidad\/([^/]+)$/, 'inicio', unit],
  [/^#\/leccion\/([^/]+)\/([^/]+)$/, 'inicio', lesson],
  [/^#\/practica\/([^/]+)$/, 'inicio', practice],
  [/^#\/tarjetas\/([^/]+)$/, 'inicio', cards],
  [/^#\/repaso(?:\/(errores|dia|ver))?$/, 'repaso', mode => repaso(app, mode)],
  [/^#\/simulacros$/, 'simulacros', () => simulacros(app)],
  [/^#\/simulacro\/([^/]+)$/, 'simulacros', id => simulacro(app, id)],
  [/^#\/progreso$/, 'progreso', () => progreso(app)],
  [/^#\/recursos$/, 'recursos', placeholder('Recursos')],
  [/^#\/ajustes$/, 'ajustes', () => ajustes(app)],
];

let navId = 0;
async function route() {
  const hash = location.hash || '#/';
  const me = ++navId;
  current?.destroy?.(); current = null;
  document.body.classList.remove('in-lesson');
  for (const [re, tab, fn] of routes) {
    const mt = hash.match(re);
    if (!mt) continue;
    document.querySelectorAll('[data-tab]').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
    const res = await fn(...mt.slice(1).map(s => (s == null ? s : decodeURIComponent(s))));
    if (me !== navId) { res?.destroy?.(); return; } // el usuario navegó mientras cargaba
    if (res?.destroy) current = res;
    window.scrollTo(0, 0);
    return;
  }
  app.innerHTML = '<h1>Página no encontrada</h1><p><a href="#/">Volver al inicio</a></p>';
}

initStore();
applySettings();
if (!isPersistent()) app.insertAdjacentHTML('beforebegin', '<p class="msg nostore" role="status">El progreso no se guardará en este navegador.</p>');
window.addEventListener('hashchange', route);
route();
setInterval(tickCountdown, 30000);

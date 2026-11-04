// localStorage-backed progress store. Falls back to memory if storage is unavailable.
import { KEY, emptyState, applyAnswer, applyLesson, merge, migrate } from './scheduler.js';

let state = null, persistent = true;
const subs = new Set();

function load() {
  let raw = null;
  try { localStorage.setItem(KEY + ':probe', '1'); localStorage.removeItem(KEY + ':probe'); raw = localStorage.getItem(KEY); }
  catch (e) { persistent = false; return emptyState(); }
  if (!raw) return emptyState();
  try { return migrate(JSON.parse(raw)); }
  catch (e) {
    try { localStorage.setItem(KEY + ':corrupt', raw); } catch (e2) { /* nada que hacer */ }
    return emptyState();
  }
}

function save() {
  if (persistent) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { persistent = false; }
  }
  subs.forEach(fn => fn(state));
}

export function getState() { return state || (state = load()); }
export const isPersistent = () => { getState(); return persistent; };
export const subscribe = fn => { subs.add(fn); return () => subs.delete(fn); };
export const exportJSON = () => JSON.stringify(getState(), null, 2);

export function setSetting(k, v) { getState().settings[k] = v; save(); }
export function recordTest(t) { getState().tests.push(t); save(); }
export function reset() { const s = getState(); state = emptyState(); state.settings = s.settings; save(); }
export function importMerge(text) {
  const incoming = migrate(JSON.parse(text)); // lanza si no es válido
  state = merge(getState(), incoming);
  save();
  return Object.keys(state.items).length;
}

export function initStore() {
  getState();
  window.addEventListener('dian:answer', e => { applyAnswer(getState(), e.detail); save(); });
  window.addEventListener('dian:lessonComplete', e => { applyLesson(getState(), e.detail); save(); });
}

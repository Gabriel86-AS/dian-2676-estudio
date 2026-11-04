// Asserts for the scheduler, mistake bank, merge and stats. Runs in the browser (progress.html) and in Node.
import { emptyState, applyAnswer, applyLesson, intervalDays, merge, migrate, dayKey, DAY } from '../js/progress/scheduler.js';
import { unitStats, readiness, mistakeList, dueList, weakest } from '../js/progress/stats.js';

export function run() {
  const results = [];
  const t = (name, fn) => { try { fn(); results.push([name, true]); } catch (e) { results.push([name, false, e.message]); } };
  const eq = (a, b, m = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} esperado ${JSON.stringify(b)}, obtenido ${JSON.stringify(a)}`); };
  const ok = (c, m) => { if (!c) throw new Error(m); };
  const T0 = Date.parse('2026-11-03T12:00:00-05:00');
  const ans = (st, id, correct, extra = {}, now = T0) => applyAnswer(st, { itemId: id, unitId: 'u1', type: 'mcq', correct, partial: false, ms: 6000, ...extra }, now);

  t('intervalos Leitner', () => {
    eq([1, 2, 3, 4, 5].map(b => intervalDays(b, T0)), [0, 1, 2, 4, 7]);
  });
  t('tope de 3 días desde el 6 de nov', () => {
    eq([4, 5].map(b => intervalDays(b, Date.parse('2026-11-06T10:00:00-05:00'))), [3, 3]);
  });
  t('correcta sube de caja y programa due', () => {
    const st = emptyState(T0); const it = ans(st, 'a', true);
    eq(it.box, 2); eq(it.attempts, 1); eq(it.correct, 1);
    eq(Date.parse(it.due), T0 + DAY);
  });
  t('la caja máxima es 5', () => {
    const st = emptyState(T0); let it; for (let i = 0; i < 8; i++) it = ans(st, 'a', true);
    eq(it.box, 5);
  });
  t('incorrecta vuelve a caja 1 y entra al banco de errores', () => {
    const st = emptyState(T0); ans(st, 'a', true); ans(st, 'a', true); const it = ans(st, 'a', false);
    eq(it.box, 1); ok(it.inMistakes, 'inMistakes'); eq(it.lastResult, 'wrong'); eq(Date.parse(it.due), T0);
  });
  t('parcial no cambia de caja pero entra al banco', () => {
    const st = emptyState(T0); ans(st, 'a', true); const it = ans(st, 'a', false, { partial: true });
    eq(it.box, 2); ok(it.inMistakes, 'inMistakes'); eq(it.partial, 1); eq(it.lastResult, 'partial');
  });
  t('sale del banco tras 2 aciertos seguidos', () => {
    const st = emptyState(T0); ans(st, 'a', false);
    ok(ans(st, 'a', true).inMistakes, 'sigue con 1 acierto');
    ok(!ans(st, 'a', true).inMistakes, 'sale con 2');
  });
  t('un fallo intermedio reinicia la racha', () => {
    const st = emptyState(T0); ans(st, 'a', false); ans(st, 'a', true); ans(st, 'a', false);
    ok(ans(st, 'a', true).inMistakes, 'aún dentro');
  });
  t('las repeticiones (retry) no puntúan', () => {
    const st = emptyState(T0); ans(st, 'a', false); const it = ans(st, 'a', true, { retry: true });
    eq(it.attempts, 1); ok(it.inMistakes, 'inMistakes'); eq(it.box, 1);
  });
  t('Likert (correct null) no puntúa ni programa', () => {
    const st = emptyState(T0); const it = ans(st, 'l', null, { type: 'likert' });
    eq(it.attempts, 0); eq(it.lastResult, 'seen'); ok(!it.inMistakes, 'sin errores');
  });
  t('minutos estudiados por día (zona Bogotá)', () => {
    const st = emptyState(T0); ans(st, 'a', true); ans(st, 'b', true);
    eq(st.studyDays[dayKey(T0)], 0.2);
    eq(dayKey(Date.parse('2026-11-04T02:00:00-05:00')), '2026-11-04');
  });
  t('lección: acierto, ejecuciones y mejor acierto', () => {
    const st = emptyState(T0);
    applyLesson(st, { lessonId: 'l1', correctFirstTry: 5, total: 10 }, T0);
    const l = applyLesson(st, { lessonId: 'l1', correctFirstTry: 9, total: 10 }, T0 + 1);
    eq(l.runs, 2); eq(l.bestAccuracy, 0.9);
    eq(applyLesson(st, { lessonId: 'practica', correctFirstTry: 1, total: 1 }), null);
  });
  t('fusión: gana más intentos, luego lastAt', () => {
    const a = emptyState(T0), b = emptyState(T0);
    ans(a, 'x', true); ans(a, 'x', true); ans(b, 'x', false);
    ans(a, 'y', true, {}, T0); ans(b, 'y', false, {}, T0 + 5000);
    ans(b, 'z', true);
    const m = merge(a, b);
    eq(m.items.x.attempts, 2); eq(m.items.y.lastResult, 'wrong'); ok(m.items.z, 'z presente');
  });
  t('exportar → reiniciar → importar restaura las mismas estadísticas', () => {
    const st = emptyState(T0); ans(st, 'a', true); ans(st, 'b', false);
    const text = JSON.stringify(st);
    const restored = merge(emptyState(T0), migrate(JSON.parse(text)));
    const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    eq(unitStats(restored, pool), unitStats(st, pool));
    eq(restored.studyDays, st.studyDays);
  });
  t('migrate rechaza formatos no válidos', () => {
    for (const bad of [null, [], { version: 2, items: {} }, { version: 1 }, { version: 1, items: { a: {} } }]) {
      let threw = false; try { migrate(bad); } catch (e) { threw = true; } ok(threw, JSON.stringify(bad));
    }
  });
  t('stats por unidad: dominio = caja ≥ 3', () => {
    const st = emptyState(T0); ans(st, 'a', true); ans(st, 'a', true); ans(st, 'b', true); ans(st, 'c', false);
    const s = unitStats(st, [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]);
    eq([s.total, s.seen, s.attempts, s.correct, s.mistakes], [4, 3, 4, 3, 1]); eq(s.mastery, 0.25);
  });
  t('preparación ponderada ×3/×2/×1 y excluye unidades vacías y demo', () => {
    const st = emptyState(T0);
    const mk = (id, priority, area = 'funcional') => ({ entry: { id, priority, area }, pool: [{ id: id + '1' }] });
    for (let i = 0; i < 2; i++) ans(st, 'p11', true); // unidad p1 dominada
    const units = [mk('p1', 1), mk('p3', 3), { entry: { id: 'vacia', priority: 1, area: 'funcional' }, pool: [] }, mk('_demo', 1), mk('c', 3, 'comportamental')];
    const r = readiness(st, units); // (3·1 + 1·0)/(3+1) = 75
    eq(r.pct, 75); eq(r.used, 2);
  });
  t('lista de errores ordenada por antigüedad y filtros', () => {
    const st = emptyState(T0);
    ans(st, 'b', false, {}, T0 + 2000); ans(st, 'a', false, {}, T0 + 1000); ans(st, 'l', null, { type: 'likert' });
    const index = new Map([['a', { item: { id: 'a', type: 'mcq' }, unitId: 'u1', priority: 1 }], ['b', { item: { id: 'b', type: 'pjs' }, unitId: 'u2', priority: 1 }], ['l', { item: { id: 'l', type: 'likert' }, unitId: 'u1', priority: 1 }]]);
    eq(mistakeList(st, index).map(e => e.item.id), ['a', 'b']);
    eq(mistakeList(st, index, { unit: 'u2' }).map(e => e.item.id), ['b']);
    eq(mistakeList(st, index, { type: 'mcq' }).map(e => e.item.id), ['a']);
  });
  t('repaso del día: vencidos, prioridad primero, sin errores abiertos', () => {
    const st = emptyState(T0);
    ans(st, 'a', true); ans(st, 'b', true); ans(st, 'c', false);
    const index = new Map(['a', 'b', 'c'].map((id, i) => [id, { item: { id, type: 'mcq' }, unitId: 'u', priority: i === 1 ? 1 : 2 }]));
    eq(dueList(st, index, { now: T0 }).length, 0);
    eq(dueList(st, index, { now: T0 + 2 * DAY }).map(e => e.item.id), ['b', 'a']);
  });
  t('temas débiles: mínimo 5 intentos, 3 más bajos', () => {
    const row = (id, attempts, accuracy) => ({ id, stats: { attempts, accuracy } });
    eq(weakest([row('a', 4, 0), row('b', 5, 0.5), row('c', 9, 0.2), row('d', 6, 0.9), row('e', 7, 0.6)]).map(r => r.id), ['c', 'b', 'e']);
  });
  return results;
}

// #/ajustes — export / import / reset and display options.
import { getState, setSetting, exportJSON, importMerge, reset, isPersistent } from '../progress/store.js';
import { dayKey } from '../progress/scheduler.js';

export const applySettings = () => document.documentElement.classList.toggle('large', !!getState().settings.large);

export function ajustes(app) {
  const s = getState().settings;
  app.innerHTML = `<h1>Ajustes</h1>
    ${isPersistent() ? '' : '<p class="msg">El progreso no se guardará en este navegador. Exporta una copia antes de cerrar.</p>'}
    <div class="card"><h2>Tu progreso</h2><p class="muted">Se guarda solo en este navegador. Exporta una copia para pasarla a otro dispositivo.</p>
      <div class="actions"><button type="button" class="btn" id="exp">Exportar progreso</button>
      <label class="btn alt" for="imp">Importar progreso</label><input type="file" id="imp" accept="application/json,.json" hidden>
      <button type="button" class="btn alt" id="rst">Reiniciar progreso</button></div><p id="out" role="status"></p></div>
    <div class="card" style="margin-top:12px"><h2>Pantalla</h2>
      <label class="row"><input type="checkbox" id="large"${s.large ? ' checked' : ''}> Letra grande</label>
      <label class="row"><input type="checkbox" id="likert"${s.hideLikert ? ' checked' : ''}> Ocultar unidades tipo Likert (comportamentales e integridad)</label></div>`;
  const out = app.querySelector('#out');
  app.querySelector('#exp').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportJSON()], { type: 'application/json' }));
    a.download = `dian2676-progreso-${dayKey()}.json`;
    a.click(); URL.revokeObjectURL(a.href);
    out.textContent = 'Copia exportada.';
  });
  app.querySelector('#imp').addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try { out.textContent = `Importado: ${importMerge(await f.text())} ítems en total.`; }
    catch (err) { out.textContent = 'No se pudo importar: ' + err.message; }
    e.target.value = '';
  });
  app.querySelector('#rst').addEventListener('click', () => {
    if (confirm('¿Borrar todo tu progreso en este navegador? Esta acción no se puede deshacer. Exporta una copia primero si quieres conservarla.')) { reset(); out.textContent = 'Progreso reiniciado.'; }
  });
  app.querySelector('#large').addEventListener('change', e => { setSetting('large', e.target.checked); applySettings(); });
  app.querySelector('#likert').addEventListener('change', e => setSetting('hideLikert', e.target.checked));
}

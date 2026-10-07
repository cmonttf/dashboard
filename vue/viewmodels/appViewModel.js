// ---------------------------------------------------------------
// VIEWMODEL · Estado global de la app: datos, preferencias, tema y rutas
// ---------------------------------------------------------------
import { reactive, computed, watch, watchEffect } from 'vue';
import { loadData, saveData, dataSize, loadPrefs, savePrefs, onExternalChange } from '../models/repository.js';
import { STORAGE_QUOTA } from '../models/constants.js';
import { MENU, VIEWS, TABLE_VIEWS } from '../models/navigation.js';
import { hexToRgb } from '../utils/format.js';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

export const state = reactive({
  db: loadData(),
  prefs: loadPrefs(),
  ui: { view: 'dashboard', mobileOpen: false, openGroups: [], search: '' },
  toasts: [],
  storageBytes: dataSize(),
  systemDark: darkQuery.matches,
});

/* ---------------- Persistencia (Model ⇄ ViewModel) ---------------- */
watch(() => state.db, val => { state.storageBytes = saveData(val); }, { deep: true });
watch(() => state.prefs, savePrefs, { deep: true });

onExternalChange({
  data: d => { state.db = d; },
  prefs: p => { state.prefs = p; },
});

export const storagePct = computed(() => Math.min(100, (state.storageBytes / STORAGE_QUOTA) * 100));

/* ---------------- Tema ---------------- */
darkQuery.addEventListener('change', e => { state.systemDark = e.matches; });

export const isDark = computed(() =>
  state.prefs.theme === 'dark' || (state.prefs.theme === 'auto' && state.systemDark));

watchEffect(() => {
  const root = document.documentElement;
  root.setAttribute('data-bs-theme', isDark.value ? 'dark' : 'light');
  root.style.setProperty('--accent', state.prefs.accent);
  root.style.setProperty('--accent-rgb', hexToRgb(state.prefs.accent).join(', '));
});

export function toggleTheme() { state.prefs.theme = isDark.value ? 'light' : 'dark'; }

/* ---------------- Navegación (hash) ---------------- */
export const currentView = computed(() => VIEWS[state.ui.view]);
export const isTableView = computed(() => TABLE_VIEWS.includes(state.ui.view));

export function syncRoute() {
  const v = location.hash.replace(/^#\/?/, '');
  state.ui.view = VIEWS[v] ? v : 'dashboard';
  state.ui.search = '';
  state.ui.mobileOpen = false;
  // Abre el grupo del menú que contiene la vista actual
  const group = MENU.flatMap(s => s.items).find(i => i.children?.some(c => c.view === state.ui.view));
  if (group && !state.ui.openGroups.includes(group.id)) state.ui.openGroups.push(group.id);
}

// Ruta inicial resuelta antes de montar, para no pasar por el dashboard al abrir un enlace directo
syncRoute();
window.addEventListener('hashchange', syncRoute);

export const go = view => { location.hash = `#/${view}`; };

/* ---------------- Menú lateral ---------------- */
export function toggleSidebar() {
  if (window.innerWidth < 992) state.ui.mobileOpen = !state.ui.mobileOpen;
  else state.prefs.sidebarMini = !state.prefs.sidebarMini;
}

export function toggleGroup(id) {
  const groups = state.ui.openGroups;
  groups.includes(id) ? groups.splice(groups.indexOf(id), 1) : groups.push(id);
}

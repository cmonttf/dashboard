// ---------------------------------------------------------------
// VIEWMODEL · Búsqueda, orden y paginación para las tablas
// ---------------------------------------------------------------
import { ref, reactive, computed, watch } from 'vue';
import { state } from './appViewModel.js';

/**
 * @param {import('vue').Ref<object[]>} source  filas de origen (computed/ref)
 * @param {{ sortKey?: string, sortDir?: 'asc'|'desc', filter?: (row) => boolean }} options
 */
export function useTable(source, { sortKey = '', sortDir = 'asc', filter = null } = {}) {
  const sort = reactive({ key: sortKey, dir: sortDir });
  const page = ref(1);

  const filtered = computed(() => {
    const q = state.ui.search.trim().toLowerCase();
    let rows = source.value.filter(r => !q || Object.values(r).join(' ').toLowerCase().includes(q));
    if (filter) rows = rows.filter(filter);
    if (sort.key) {
      const k = sort.key, dir = sort.dir === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) =>
        (typeof a[k] === 'number' ? a[k] - b[k] : String(a[k]).localeCompare(String(b[k]), 'es')) * dir);
    }
    return rows;
  });

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / state.prefs.pageSize)));

  const pageRows = computed(() => {
    const start = (page.value - 1) * state.prefs.pageSize;
    return filtered.value.slice(start, start + state.prefs.pageSize);
  });

  watch(() => state.ui.search, () => { page.value = 1; });
  watch(totalPages, n => { if (page.value > n) page.value = n; });

  function sortBy(key) {
    if (sort.key === key) sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
    else Object.assign(sort, { key, dir: 'asc' });
  }

  return { sort, page, filtered, totalPages, pageRows, sortBy };
}

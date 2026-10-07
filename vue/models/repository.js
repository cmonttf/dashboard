// ---------------------------------------------------------------
// MODEL · Acceso a LocalStorage (única capa que lee/escribe el navegador)
// ---------------------------------------------------------------
import { STORAGE_KEY, PREFS_KEY, DEFAULT_PREFS } from './constants.js';
import { seedData } from './seed.js';

const isValidData = d => d && ['products', 'customers', 'orders'].every(k => Array.isArray(d[k]));

/** Lee los datos; si no existen o están corruptos, genera datos de ejemplo. */
export function loadData() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isValidData(d)) return d;
  } catch (e) { /* datos corruptos → se regeneran */ }
  const fresh = seedData();
  saveData(fresh);
  return fresh;
}

/** Guarda los datos y devuelve el tamaño aproximado en bytes (UTF-16). */
export function saveData(data) {
  const json = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, json);
  return json.length * 2;
}

export const dataSize = () => (localStorage.getItem(STORAGE_KEY) || '').length * 2;

export function loadPrefs() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY)) }; }
  catch (e) { return { ...DEFAULT_PREFS }; }
}

export const savePrefs = prefs => localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

/** Valida y normaliza un respaldo importado; lanza error si el formato no sirve. */
export function parseBackup(text) {
  const d = JSON.parse(text);
  if (!isValidData(d)) throw new Error('formato');
  return { products: d.products, customers: d.customers, orders: d.orders };
}

/** Notifica cambios hechos desde otra pestaña. */
export function onExternalChange({ data, prefs }) {
  window.addEventListener('storage', e => {
    if (!e.newValue) return;
    if (e.key === STORAGE_KEY) data(JSON.parse(e.newValue));
    if (e.key === PREFS_KEY) prefs({ ...DEFAULT_PREFS, ...JSON.parse(e.newValue) });
  });
}

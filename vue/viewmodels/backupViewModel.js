// ---------------------------------------------------------------
// VIEWMODEL · Respaldo: exportar, importar, regenerar y vaciar datos
// ---------------------------------------------------------------
import { state } from './appViewModel.js';
import { notify, askConfirm } from './dialogViewModel.js';
import { parseBackup } from '../models/repository.js';
import { seedData } from '../models/seed.js';
import { isoDate } from '../utils/format.js';

export function exportData() {
  const json = JSON.stringify({ ...state.db, exportedAt: new Date().toISOString() }, null, 2);
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([json], { type: 'application/json' })),
    download: `dashboard-respaldo-${isoDate(new Date())}.json`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
  notify('Respaldo descargado');
}

export async function importData(file) {
  try {
    state.db = parseBackup(await file.text());
    notify('Datos importados correctamente');
  } catch (e) {
    notify('El archivo no tiene un formato válido', 'danger');
  }
}

export async function resetData() {
  const ok = await askConfirm({
    title: 'Restablecer datos', message: 'Se reemplazarán todos los datos por datos de ejemplo nuevos.',
    okText: 'Restablecer', variant: 'warning',
  });
  if (ok) { state.db = seedData(); notify('Datos de ejemplo regenerados', 'warning'); }
}

export async function clearData() {
  const ok = await askConfirm({
    title: 'Vaciar datos', message: 'Se eliminarán todos los productos, clientes y pedidos. Esta acción no se puede deshacer.',
    okText: 'Vaciar todo', variant: 'danger',
  });
  if (ok) { state.db = { products: [], customers: [], orders: [] }; notify('Todos los datos fueron eliminados', 'danger'); }
}

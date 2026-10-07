// ---------------------------------------------------------------
// VIEWMODEL · Avisos flotantes (toasts) y diálogo de confirmación
// ---------------------------------------------------------------
import { reactive } from 'vue';
import { state } from './appViewModel.js';
import { uid } from '../utils/format.js';

export function notify(msg, type = 'success') {
  const id = uid('t');
  state.toasts.push({ id, msg, type });
  setTimeout(() => { state.toasts = state.toasts.filter(t => t.id !== id); }, 3200);
}

export const confirmState = reactive({ open: false, title: '', message: '', okText: 'Eliminar', variant: 'danger' });
let confirmResolver = null;

/** Abre el diálogo y devuelve una promesa que resuelve true/false. */
export function askConfirm(opts) {
  Object.assign(confirmState, opts, { open: true });
  return new Promise(resolve => { confirmResolver = resolve; });
}

export function resolveConfirm(value) {
  confirmResolver?.(value);
  confirmResolver = null;
  confirmState.open = false;
}

// ---------------------------------------------------------------
// VIEWMODEL · Formulario y acciones CRUD (productos, clientes, pedidos)
// ---------------------------------------------------------------
import { reactive, computed } from 'vue';
import { state } from './appViewModel.js';
import { productMap } from './catalogViewModel.js';
import { notify, askConfirm } from './dialogViewModel.js';
import { ENTITIES } from '../models/schemas.js';
import { STATUSES } from '../models/constants.js';
import { uid } from '../utils/format.js';

export const formState = reactive({ open: false, entity: 'products', id: null, data: {}, validated: false });

export const formEntity = computed(() => ENTITIES[formState.entity]);

export const formOrderTotal = computed(() => {
  if (formState.entity !== 'orders') return 0;
  return (productMap.value[formState.data.productId]?.price || 0) * (Number(formState.data.qty) || 0);
});

export function openForm(entity, row = null) {
  if (entity === 'orders' && (!state.db.customers.length || !state.db.products.length)) {
    return notify('Necesitas al menos un cliente y un producto para crear pedidos', 'warning');
  }
  const raw = row && state.db[entity].find(r => r.id === row.id);
  Object.assign(formState, {
    open: true, entity, id: raw?.id ?? null, validated: false,
    data: raw ? { ...raw } : ENTITIES[entity].defaults(state.db),
  });
}

export function saveForm() {
  const { entity, id } = formState;
  const data = { ...formState.data };
  ENTITIES[entity].fields.filter(f => f.type === 'number').forEach(f => { data[f.key] = Number(data[f.key]); });
  if (entity === 'orders') data.total = formOrderTotal.value;

  const list = state.db[entity];
  if (id) list.splice(list.findIndex(r => r.id === id), 1, { ...data, id });
  else list.unshift({ ...data, id: uid(entity[0]) });

  formState.open = false;
  const name = ENTITIES[entity].singular;
  notify(`${name[0].toUpperCase() + name.slice(1)} ${id ? 'actualizado' : 'creado'} correctamente`);
}

export async function removeRow(entity, row) {
  const fk = { customers: 'customerId', products: 'productId' }[entity];
  const linked = fk ? state.db.orders.filter(o => o[fk] === row.id).length : 0;
  const ok = await askConfirm({
    title: `Eliminar ${ENTITIES[entity].singular}`,
    message: `¿Seguro que deseas eliminar «${row.name ?? row.id}»?` +
      (linked ? ` También se eliminarán ${linked} pedido(s) asociados.` : ''),
    okText: 'Eliminar', variant: 'danger',
  });
  if (!ok) return;
  state.db[entity] = state.db[entity].filter(r => r.id !== row.id);
  if (linked) state.db.orders = state.db.orders.filter(o => o[fk] !== row.id);
  notify('Registro eliminado', 'danger');
}

export function setStatus(order, status) {
  const o = state.db.orders.find(x => x.id === order.id);
  if (o) { o.status = status; notify(`Pedido ${o.id} → ${STATUSES[status].label}`); }
}

export function adjustStock(product, delta) {
  const p = state.db.products.find(x => x.id === product.id);
  if (p) p.stock = Math.max(0, p.stock + delta);
}

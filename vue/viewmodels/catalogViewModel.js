// ---------------------------------------------------------------
// VIEWMODEL · Datos derivados listos para mostrar en las vistas
// ---------------------------------------------------------------
import { computed } from 'vue';
import { state } from './appViewModel.js';
import { STATUSES } from '../models/constants.js';

export const productMap = computed(() => Object.fromEntries(state.db.products.map(p => [p.id, p])));
export const customerMap = computed(() => Object.fromEntries(state.db.customers.map(c => [c.id, c])));

/** Pedidos con nombre de cliente y producto resueltos. */
export const ordersView = computed(() => state.db.orders.map(o => ({
  ...o,
  customer: customerMap.value[o.customerId]?.name ?? '—',
  product: productMap.value[o.productId]?.name ?? '—',
})));

/** Clientes con su cantidad de pedidos y total comprado. */
export const customersView = computed(() => {
  const stats = {};
  state.db.orders.forEach(o => {
    const s = stats[o.customerId] ??= { orders: 0, spent: 0 };
    s.orders++;
    if (o.status !== 'cancelado') s.spent += o.total;
  });
  return state.db.customers.map(c => ({ ...c, orders: stats[c.id]?.orders ?? 0, spent: stats[c.id]?.spent ?? 0 }));
});

export const lowStockProducts = computed(() => state.db.products.filter(p => p.stock <= state.prefs.lowStock));
export const pendingOrders = computed(() => state.db.orders.filter(o => o.status === 'pendiente'));
export const badges = computed(() => ({ pending: pendingOrders.value.length, lowstock: lowStockProducts.value.length }));

export const statusCounts = computed(() => {
  const c = Object.fromEntries(Object.keys(STATUSES).map(k => [k, 0]));
  state.db.orders.forEach(o => c[o.status]++);
  return c;
});

export const notifications = computed(() => [
  ...pendingOrders.value.slice(0, 3).map(o => ({
    icon: 'bi-hourglass-split', color: STATUSES.pendiente.color,
    text: `Pedido ${o.id} pendiente`, sub: customerMap.value[o.customerId]?.name, view: 'orders',
  })),
  ...lowStockProducts.value.slice(0, 3).map(p => ({
    icon: 'bi-exclamation-triangle', color: STATUSES.cancelado.color,
    text: `${p.name}: quedan ${p.stock}`, sub: 'Stock bajo', view: 'lowstock',
  })),
]);

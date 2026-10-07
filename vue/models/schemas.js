// ---------------------------------------------------------------
// MODEL · Esquema de cada entidad (campos del formulario y valores por defecto)
// ---------------------------------------------------------------
import { CATEGORIES, CITIES, STATUSES } from './constants.js';
import { money, isoDate } from '../utils/format.js';

const opts = list => list.map(v => ({ value: v, label: v }));

export const ENTITIES = {
  products: {
    singular: 'producto',
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', col: 12, required: true },
      { key: 'category', label: 'Categoría', type: 'select', col: 12, options: () => opts(CATEGORIES) },
      { key: 'price', label: 'Precio (CLP)', type: 'number', col: 6, min: 0, step: 10, required: true },
      { key: 'stock', label: 'Stock', type: 'number', col: 6, min: 0, step: 1, required: true },
    ],
    defaults: () => ({ name: '', category: CATEGORIES[0], price: 0, stock: 0 }),
  },
  customers: {
    singular: 'cliente',
    fields: [
      { key: 'name', label: 'Nombre completo', type: 'text', col: 12, required: true },
      { key: 'email', label: 'Correo', type: 'email', col: 12, required: true },
      { key: 'city', label: 'Ciudad', type: 'select', col: 6, options: () => opts(CITIES) },
      { key: 'createdAt', label: 'Fecha de registro', type: 'date', col: 6, required: true },
    ],
    defaults: () => ({ name: '', email: '', city: CITIES[0], createdAt: isoDate(new Date()) }),
  },
  orders: {
    singular: 'pedido',
    fields: [
      { key: 'customerId', label: 'Cliente', type: 'select', col: 12, required: true,
        options: db => db.customers.map(c => ({ value: c.id, label: c.name })) },
      { key: 'productId', label: 'Producto', type: 'select', col: 12, required: true,
        options: db => db.products.map(p => ({ value: p.id, label: `${p.name} — ${money(p.price)}` })) },
      { key: 'qty', label: 'Cantidad', type: 'number', col: 4, min: 1, step: 1, required: true },
      { key: 'status', label: 'Estado', type: 'select', col: 4,
        options: () => Object.entries(STATUSES).map(([value, s]) => ({ value, label: s.label })) },
      { key: 'date', label: 'Fecha', type: 'date', col: 4, required: true },
    ],
    defaults: db => ({
      customerId: db.customers[0]?.id ?? '',
      productId: db.products[0]?.id ?? '',
      qty: 1, status: 'pendiente', date: isoDate(new Date()),
    }),
  },
};

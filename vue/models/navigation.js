// ---------------------------------------------------------------
// MODEL · Menú lateral y vistas disponibles
// ---------------------------------------------------------------
export const MENU = [
  { title: 'Principal', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2', view: 'dashboard' },
  ]},
  { title: 'Gestión', items: [
    { id: 'ventas', label: 'Ventas', icon: 'bi-bag', children: [
      { label: 'Pedidos', view: 'orders', badge: 'pending' },
      { label: 'Clientes', view: 'customers' },
    ]},
    { id: 'inventario', label: 'Inventario', icon: 'bi-box-seam', children: [
      { label: 'Productos', view: 'products' },
      { label: 'Stock bajo', view: 'lowstock', badge: 'lowstock' },
    ]},
  ]},
  { title: 'Sistema', items: [
    { id: 'config', label: 'Configuración', icon: 'bi-gear', children: [
      { label: 'Preferencias', view: 'settings' },
      { label: 'Datos y respaldo', view: 'data' },
    ]},
  ]},
];

export const VIEWS = {
  dashboard: { title: 'Dashboard',        crumb: ['Inicio'] },
  orders:    { title: 'Pedidos',          crumb: ['Ventas'] },
  customers: { title: 'Clientes',         crumb: ['Ventas'] },
  products:  { title: 'Productos',        crumb: ['Inventario'] },
  lowstock:  { title: 'Stock bajo',       crumb: ['Inventario'] },
  settings:  { title: 'Preferencias',     crumb: ['Configuración'] },
  data:      { title: 'Datos y respaldo', crumb: ['Configuración'] },
};

export const TABLE_VIEWS = ['orders', 'customers', 'products', 'lowstock'];

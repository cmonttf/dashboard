// ---------------------------------------------------------------
// MODEL · Constantes del dominio
// ---------------------------------------------------------------
export const STORAGE_KEY = 'dashboard:data';
export const PREFS_KEY = 'dashboard:prefs';
export const STORAGE_QUOTA = 5 * 1024 * 1024; // ~5 MB típico por origen

export const CATEGORIES = ['Electrónica', 'Accesorios', 'Oficina', 'Hogar'];
export const CITIES = ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Santiago', 'Temuco', 'Valparaíso'];

export const STATUSES = {
  pendiente: { label: 'Pendiente', color: '#f59e0b' },
  enviado:   { label: 'Enviado',   color: '#0ea5e9' },
  entregado: { label: 'Entregado', color: '#10b981' },
  cancelado: { label: 'Cancelado', color: '#f43f5e' },
};

export const ACCENTS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6'];

export const DEFAULT_PREFS = {
  theme: 'light',        // light | dark | auto
  accent: ACCENTS[0],
  company: 'Mi Empresa',
  userName: 'Usuario',
  lowStock: 10,
  pageSize: 8,
  sidebarMini: false,    // menú minimizado (solo iconos) en escritorio
};

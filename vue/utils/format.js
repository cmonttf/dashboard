// ---------------------------------------------------------------
// Utilidades de formato y helpers generales
// ---------------------------------------------------------------
const moneyFmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export const money = n => moneyFmt.format(n || 0);

export const isoDate = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const fmtDate = s => parseDate(s).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

export const fmtBytes = b => (b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`);

export const uid = prefix => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = arr => arr[rand(0, arr.length - 1)];

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const rgba = (hex, a) => `rgba(${hexToRgb(hex).join(',')},${a})`;

export const initialsOf = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

export function avatarColor(name = '') {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return { background: `hsl(${h} 65% 55%)` };
}

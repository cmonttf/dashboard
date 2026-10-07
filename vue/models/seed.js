// ---------------------------------------------------------------
// MODEL · Datos de ejemplo (se generan la primera vez o al restablecer)
// ---------------------------------------------------------------
import { CITIES } from './constants.js';
import { isoDate, rand, pick } from '../utils/format.js';

export function seedData() {
  const products = [
    ['Notebook Pro 14"', 'Electrónica', 899990], ['Monitor 27" 4K', 'Electrónica', 349990],
    ['Tablet 11"', 'Electrónica', 279990], ['Audífonos ANC', 'Electrónica', 129990],
    ['Teclado mecánico', 'Accesorios', 59990], ['Mouse inalámbrico', 'Accesorios', 19990],
    ['Webcam Full HD', 'Accesorios', 39990], ['Hub USB-C 7 en 1', 'Accesorios', 29990],
    ['Silla ergonómica', 'Oficina', 189990], ['Escritorio elevable', 'Oficina', 299990],
    ['Impresora láser', 'Oficina', 159990], ['Lámpara LED escritorio', 'Hogar', 24990],
  ].map(([name, category, price], i) => ({
    id: `p-${i + 1}`, name, category, price,
    stock: i % 4 === 1 ? rand(0, 8) : rand(12, 85),
  }));

  const names = ['Camila Rojas', 'Matías González', 'Valentina Muñoz', 'Benjamín Soto', 'Antonia Pérez',
    'Joaquín Contreras', 'Isidora Silva', 'Tomás Sepúlveda', 'Florencia Morales', 'Vicente Fuentes',
    'Martina Araya', 'Agustín Torres', 'Josefa Espinoza', 'Lucas Castillo'];
  const today = new Date();
  const customers = names.map((name, i) => {
    const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(' ', '.');
    const created = new Date(today); created.setDate(today.getDate() - rand(5, 240));
    return { id: `c-${i + 1}`, name, email: `${slug}@correo.cl`, city: pick(CITIES), createdAt: isoDate(created) };
  });

  const orders = Array.from({ length: 90 }, (_, i) => {
    const daysAgo = rand(0, 175);
    const date = new Date(today); date.setDate(today.getDate() - daysAgo);
    const product = pick(products);
    const qty = rand(1, 4);
    let status;
    if (daysAgo < 4) status = pick(['pendiente', 'pendiente', 'enviado']);
    else if (daysAgo < 12) status = pick(['enviado', 'entregado', 'pendiente']);
    else status = Math.random() < .1 ? 'cancelado' : 'entregado';
    return {
      id: `o-${1000 + i}`, customerId: pick(customers).id, productId: product.id,
      qty, total: product.price * qty, status, date: isoDate(date),
    };
  });

  return { products, customers, orders };
}

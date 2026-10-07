// ---------------------------------------------------------------
// VIEWMODEL · Indicadores y gráficos del Dashboard
// ---------------------------------------------------------------
import { computed } from 'vue';
import { state, isDark } from './appViewModel.js';
import { ordersView, productMap, statusCounts } from './catalogViewModel.js';
import { STATUSES } from '../models/constants.js';
import { money, parseDate, rgba } from '../utils/format.js';

export function useDashboard() {
  /* ---- KPIs: últimos 30 días vs. 30 días anteriores ---- */
  const kpis = computed(() => {
    const now = new Date();
    const cut1 = new Date(now); cut1.setDate(now.getDate() - 30);
    const cut2 = new Date(now); cut2.setDate(now.getDate() - 60);
    const valid = state.db.orders.filter(o => o.status !== 'cancelado');
    const cur = valid.filter(o => parseDate(o.date) > cut1);
    const prev = valid.filter(o => { const d = parseDate(o.date); return d > cut2 && d <= cut1; });
    const sum = list => list.reduce((s, o) => s + o.total, 0);
    const delta = (a, b) => (b ? Math.round(((a - b) / b) * 100) : a ? 100 : 0);
    const newCustomers = state.db.customers.filter(c => parseDate(c.createdAt) > cut1).length;
    const ticket = valid.length ? sum(valid) / valid.length : 0;
    return [
      { label: 'Ingresos (30 días)', value: money(sum(cur)), delta: delta(sum(cur), sum(prev)), icon: 'bi-currency-dollar', tone: 'indigo' },
      { label: 'Pedidos (30 días)', value: cur.length, delta: delta(cur.length, prev.length), icon: 'bi-receipt', tone: 'emerald' },
      { label: 'Clientes', value: state.db.customers.length, note: `+${newCustomers} nuevos este mes`, icon: 'bi-people', tone: 'sky' },
      { label: 'Ticket promedio', value: money(ticket), note: `${valid.length} pedidos válidos`, icon: 'bi-graph-up-arrow', tone: 'amber' },
    ];
  });

  const recentOrders = computed(() => [...ordersView.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6));

  const topProducts = computed(() => {
    const acc = {};
    state.db.orders.filter(o => o.status !== 'cancelado').forEach(o => {
      acc[o.productId] = (acc[o.productId] || 0) + o.total;
    });
    const list = Object.entries(acc)
      .map(([id, total]) => ({ id, total, name: productMap.value[id]?.name ?? '—' }))
      .sort((a, b) => b.total - a.total).slice(0, 5);
    const max = list[0]?.total || 1;
    return list.map(p => ({ ...p, pct: Math.round((p.total / max) * 100) }));
  });

  const monthlySeries = computed(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1));
    const key = d => `${d.getFullYear()}-${d.getMonth()}`;
    const totals = Object.fromEntries(months.map(m => [key(m), { revenue: 0, orders: 0 }]));
    state.db.orders.forEach(o => {
      const t = totals[key(parseDate(o.date))];
      if (t && o.status !== 'cancelado') { t.revenue += o.total; t.orders++; }
    });
    return {
      labels: months.map(m => m.toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')),
      revenue: months.map(m => totals[key(m)].revenue),
      orders: months.map(m => totals[key(m)].orders),
    };
  });

  /* ---- Configuración de Chart.js (se recalcula con datos, tema y acento) ---- */
  const palette = computed(() => (isDark.value
    ? { text: '#94a3b8', grid: '#1f2a3d', surface: '#111827' }
    : { text: '#64748b', grid: '#e7eaf3', surface: '#ffffff' }));

  const legend = { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 14 } };

  const salesConfig = computed(() => {
    const s = monthlySeries.value, c = palette.value, accent = state.prefs.accent;
    return {
      data: {
        labels: s.labels,
        datasets: [
          {
            type: 'line', label: 'Ingresos', data: s.revenue, yAxisID: 'y',
            borderColor: accent, fill: true, tension: .4, borderWidth: 3,
            pointRadius: 4, pointBackgroundColor: c.surface, pointBorderWidth: 2,
            backgroundColor: ({ chart }) => {
              const { ctx, chartArea } = chart;
              if (!chartArea) return rgba(accent, .2);
              const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, rgba(accent, .35));
              g.addColorStop(1, rgba(accent, 0));
              return g;
            },
          },
          { type: 'bar', label: 'Pedidos', data: s.orders, yAxisID: 'y1', backgroundColor: rgba(accent, .15), borderRadius: 6, maxBarThickness: 28 },
        ],
      },
      options: {
        maintainAspectRatio: false,
        color: c.text,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend,
          tooltip: { callbacks: { label: t => (t.dataset.yAxisID === 'y' ? ` Ingresos: ${money(t.raw)}` : ` Pedidos: ${t.raw}`) } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.text } },
          y: {
            grid: { color: c.grid }, border: { display: false },
            ticks: { color: c.text, callback: v => (v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1e3)}k`) },
          },
          y1: { position: 'right', grid: { display: false }, border: { display: false }, ticks: { color: c.text, precision: 0 } },
        },
      },
    };
  });

  const statusConfig = computed(() => {
    const keys = Object.keys(STATUSES);
    return {
      type: 'doughnut',
      data: {
        labels: keys.map(k => STATUSES[k].label),
        datasets: [{
          data: keys.map(k => statusCounts.value[k]),
          backgroundColor: keys.map(k => STATUSES[k].color),
          borderColor: palette.value.surface, borderWidth: 3, hoverOffset: 6,
        }],
      },
      options: { maintainAspectRatio: false, cutout: '72%', color: palette.value.text, plugins: { legend } },
    };
  });

  return { kpis, recentOrders, topProducts, salesConfig, statusConfig };
}

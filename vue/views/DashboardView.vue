<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h2 class="h4 fw-bold mb-1">Hola, {{ state.prefs.userName.split(' ')[0] }} 👋</h2>
        <p class="text-muted mb-0">Este es el resumen de tu negocio. Los datos se guardan en tu navegador.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-soft" @click="go('orders')"><i class="bi bi-list-ul me-1"></i> Ver pedidos</button>
        <button class="btn btn-primary" @click="openForm('orders')"><i class="bi bi-plus-lg me-1"></i> Nuevo pedido</button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="row g-3 mb-4">
      <div v-for="k in kpis" :key="k.label" class="col-sm-6 col-xl-3">
        <KpiCard v-bind="k" />
      </div>
    </div>

    <!-- Gráficos -->
    <div class="row g-3 mb-4">
      <div class="col-xl-8">
        <div class="panel">
          <div class="panel-header">
            <div><h2>Ingresos y pedidos</h2><small>Últimos 6 meses (excluye cancelados)</small></div>
          </div>
          <div class="panel-body"><BaseChart :config="salesConfig" /></div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="panel">
          <div class="panel-header">
            <div><h2>Estado de pedidos</h2><small>{{ state.db.orders.length }} pedidos en total</small></div>
          </div>
          <div class="panel-body"><BaseChart :config="statusConfig" /></div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <!-- Pedidos recientes -->
      <div class="col-xl-8">
        <div class="panel">
          <div class="panel-header">
            <h2>Pedidos recientes</h2>
            <a href="#/orders" class="small text-decoration-none">Ver todos <i class="bi bi-arrow-right"></i></a>
          </div>
          <div class="table-responsive">
            <table class="table table-modern table-hover">
              <thead><tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                <tr v-for="o in recentOrders" :key="o.id">
                  <td><span class="fw-semibold">{{ o.id }}</span><br><small class="text-muted">{{ fmtDate(o.date) }}</small></td>
                  <td>
                    <div class="d-flex align-items-center gap-2"><UserAvatar :name="o.customer" size="sm" />{{ o.customer }}</div>
                  </td>
                  <td class="text-muted">{{ o.product }}</td>
                  <td class="fw-semibold">{{ money(o.total) }}</td>
                  <td><StatusPill :status="o.status" /></td>
                </tr>
              </tbody>
            </table>
            <div v-if="!recentOrders.length" class="empty-state"><i class="bi bi-inbox"></i>Sin pedidos aún</div>
          </div>
        </div>
      </div>

      <div class="col-xl-4 d-flex flex-column gap-3">
        <!-- Más vendidos -->
        <div class="panel">
          <div class="panel-header"><h2>Productos más vendidos</h2></div>
          <div class="panel-body">
            <div v-for="(p, i) in topProducts" :key="p.id" class="mb-3">
              <div class="d-flex justify-content-between small mb-1">
                <span><span class="text-muted me-1">#{{ i + 1 }}</span> <span class="fw-medium">{{ p.name }}</span></span>
                <span class="fw-semibold">{{ money(p.total) }}</span>
              </div>
              <div class="progress progress-thin"><div class="progress-bar" :style="{ width: p.pct + '%' }"></div></div>
            </div>
            <div v-if="!topProducts.length" class="text-muted small">Sin ventas registradas.</div>
          </div>
        </div>

        <!-- Alerta de stock -->
        <div class="alert d-flex gap-3 align-items-start mb-0 rounded-4"
             :class="lowStockProducts.length ? 'alert-warning' : 'alert-success'">
          <i class="bi fs-4" :class="lowStockProducts.length ? 'bi-exclamation-triangle' : 'bi-check2-circle'"></i>
          <div>
            <strong v-if="lowStockProducts.length">{{ lowStockProducts.length }} producto(s) con stock bajo</strong>
            <strong v-else>Inventario en buen estado</strong>
            <div class="small">Umbral configurado: {{ state.prefs.lowStock }} unidades.</div>
            <a v-if="lowStockProducts.length" href="#/lowstock" class="small alert-link">Revisar inventario →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// VIEW: solo enlaza la plantilla con su ViewModel
import { state, go } from '../viewmodels/appViewModel.js';
import { lowStockProducts } from '../viewmodels/catalogViewModel.js';
import { openForm } from '../viewmodels/crudViewModel.js';
import { useDashboard } from '../viewmodels/dashboardViewModel.js';
import { money, fmtDate } from '../utils/format.js';
import KpiCard from './components/KpiCard.vue';
import BaseChart from './components/BaseChart.vue';
import StatusPill from './components/StatusPill.vue';
import UserAvatar from './components/UserAvatar.vue';

const { kpis, recentOrders, topProducts, salesConfig, statusConfig } = useDashboard();
</script>

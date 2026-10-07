<template>
  <div class="row g-3">
    <div class="col-lg-7">
      <div class="panel">
        <div class="panel-header">
          <div><h2>Almacenamiento local</h2><small>Clave: <code>{{ STORAGE_KEY }}</code></small></div>
        </div>
        <div class="panel-body">
          <div class="row g-3 mb-4">
            <div v-for="t in tiles" :key="t.label" class="col-6 col-md-3">
              <div class="stat-tile"><div class="value">{{ t.value }}</div><div class="label">{{ t.label }}</div></div>
            </div>
          </div>
          <div class="d-flex justify-content-between small mb-1">
            <span class="text-muted">Uso estimado de la cuota (~5 MB)</span><span>{{ storagePct.toFixed(2) }}%</span>
          </div>
          <div class="progress progress-thin"><div class="progress-bar" :style="{ width: Math.max(storagePct, 1) + '%' }"></div></div>
        </div>
      </div>
    </div>

    <div class="col-lg-5">
      <div class="panel">
        <div class="panel-header"><h2>Respaldo</h2></div>
        <div class="panel-body d-grid gap-2">
          <button class="btn btn-primary" @click="exportData"><i class="bi bi-download me-1"></i> Exportar JSON</button>
          <label class="btn btn-soft mb-0">
            <i class="bi bi-upload me-1"></i> Importar JSON
            <input type="file" accept="application/json,.json" class="d-none" @change="onImport">
          </label>
          <hr>
          <button class="btn btn-outline-warning" @click="resetData"><i class="bi bi-arrow-counterclockwise me-1"></i> Regenerar datos de ejemplo</button>
          <button class="btn btn-outline-danger" @click="clearData"><i class="bi bi-trash3 me-1"></i> Vaciar todos los datos</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { state, storagePct } from '../viewmodels/appViewModel.js';
import { exportData, importData, resetData, clearData } from '../viewmodels/backupViewModel.js';
import { STORAGE_KEY } from '../models/constants.js';
import { fmtBytes } from '../utils/format.js';

const tiles = computed(() => [
  { label: 'Productos', value: state.db.products.length },
  { label: 'Clientes', value: state.db.customers.length },
  { label: 'Pedidos', value: state.db.orders.length },
  { label: 'Tamaño', value: fmtBytes(state.storageBytes) },
]);

async function onImport(e) {
  const file = e.target.files[0];
  if (file) await importData(file);
  e.target.value = '';
}
</script>

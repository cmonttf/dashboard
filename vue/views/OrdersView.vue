<template>
  <TablePanel title="Pedidos" :count="filtered.length" :rows="pageRows.length"
              v-model:page="page" :total-pages="totalPages">
    <template #actions>
      <div class="segmented">
        <button class="btn" :class="{ active: !statusFilter }" @click="statusFilter = ''">Todos</button>
        <button v-for="(s, key) in STATUSES" :key="key" class="btn" :class="{ active: statusFilter === key }"
                @click="statusFilter = key">
          {{ s.label }} <span class="opacity-50">{{ statusCounts[key] }}</span>
        </button>
      </div>
      <button class="btn btn-primary" @click="openForm('orders')"><i class="bi bi-plus-lg me-1"></i> Nuevo pedido</button>
    </template>

    <table class="table table-modern table-hover">
      <thead>
        <tr>
          <SortTh field="id" :sort="sort" @sort="sortBy">Pedido</SortTh>
          <SortTh field="date" :sort="sort" @sort="sortBy">Fecha</SortTh>
          <SortTh field="customer" :sort="sort" @sort="sortBy">Cliente</SortTh>
          <SortTh field="product" :sort="sort" @sort="sortBy">Producto</SortTh>
          <SortTh field="qty" :sort="sort" class="text-end" @sort="sortBy">Cant.</SortTh>
          <SortTh field="total" :sort="sort" class="text-end" @sort="sortBy">Total</SortTh>
          <th>Estado</th>
          <th class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in pageRows" :key="o.id">
          <td class="fw-semibold">{{ o.id }}</td>
          <td class="text-muted">{{ fmtDate(o.date) }}</td>
          <td><div class="d-flex align-items-center gap-2"><UserAvatar :name="o.customer" size="sm" />{{ o.customer }}</div></td>
          <td>{{ o.product }}</td>
          <td class="text-end">{{ o.qty }}</td>
          <td class="text-end fw-semibold">{{ money(o.total) }}</td>
          <td><StatusPill :status="o.status" editable @change="setStatus(o, $event)" /></td>
          <td class="text-end"><RowActions @edit="openForm('orders', o)" @remove="removeRow('orders', o)" /></td>
        </tr>
      </tbody>
    </table>
  </TablePanel>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ordersView, statusCounts } from '../viewmodels/catalogViewModel.js';
import { openForm, removeRow, setStatus } from '../viewmodels/crudViewModel.js';
import { STATUSES } from '../models/constants.js';
import { money, fmtDate } from '../utils/format.js';
import { useTable } from '../viewmodels/tableViewModel.js';
import TablePanel from './components/TablePanel.vue';
import SortTh from './components/SortTh.vue';
import StatusPill from './components/StatusPill.vue';
import UserAvatar from './components/UserAvatar.vue';
import RowActions from './components/RowActions.vue';

const statusFilter = ref('');

const { sort, page, filtered, totalPages, pageRows, sortBy } = useTable(ordersView, {
  sortKey: 'date',
  sortDir: 'desc',
  filter: o => !statusFilter.value || o.status === statusFilter.value,
});

watch(statusFilter, () => { page.value = 1; });
</script>

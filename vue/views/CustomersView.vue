<template>
  <TablePanel title="Clientes" :count="filtered.length" :rows="pageRows.length"
              v-model:page="page" :total-pages="totalPages">
    <template #actions>
      <button class="btn btn-primary" @click="openForm('customers')"><i class="bi bi-plus-lg me-1"></i> Nuevo cliente</button>
    </template>

    <table class="table table-modern table-hover">
      <thead>
        <tr>
          <SortTh field="name" :sort="sort" @sort="sortBy">Cliente</SortTh>
          <SortTh field="city" :sort="sort" @sort="sortBy">Ciudad</SortTh>
          <SortTh field="createdAt" :sort="sort" @sort="sortBy">Registro</SortTh>
          <SortTh field="orders" :sort="sort" class="text-end" @sort="sortBy">Pedidos</SortTh>
          <SortTh field="spent" :sort="sort" class="text-end" @sort="sortBy">Total comprado</SortTh>
          <th class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in pageRows" :key="c.id">
          <td>
            <div class="d-flex align-items-center gap-2">
              <UserAvatar :name="c.name" />
              <div><div class="fw-semibold">{{ c.name }}</div><small class="text-muted">{{ c.email }}</small></div>
            </div>
          </td>
          <td><i class="bi bi-geo-alt text-muted me-1"></i>{{ c.city }}</td>
          <td class="text-muted">{{ fmtDate(c.createdAt) }}</td>
          <td class="text-end">{{ c.orders }}</td>
          <td class="text-end fw-semibold">{{ money(c.spent) }}</td>
          <td class="text-end"><RowActions @edit="openForm('customers', c)" @remove="removeRow('customers', c)" /></td>
        </tr>
      </tbody>
    </table>
  </TablePanel>
</template>

<script setup>
import { customersView } from '../viewmodels/catalogViewModel.js';
import { openForm, removeRow } from '../viewmodels/crudViewModel.js';
import { money, fmtDate } from '../utils/format.js';
import { useTable } from '../viewmodels/tableViewModel.js';
import TablePanel from './components/TablePanel.vue';
import SortTh from './components/SortTh.vue';
import UserAvatar from './components/UserAvatar.vue';
import RowActions from './components/RowActions.vue';

const { sort, page, filtered, totalPages, pageRows, sortBy } = useTable(customersView, { sortKey: 'name' });
</script>

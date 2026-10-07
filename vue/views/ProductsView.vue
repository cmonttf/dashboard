<template>
  <TablePanel :title="lowOnly ? 'Stock bajo' : 'Productos'" :count="filtered.length" :rows="pageRows.length"
              v-model:page="page" :total-pages="totalPages">
    <template #actions>
      <span v-if="lowOnly" class="chip">Umbral: {{ state.prefs.lowStock }} unidades</span>
      <button v-else class="btn btn-primary" @click="openForm('products')"><i class="bi bi-plus-lg me-1"></i> Nuevo producto</button>
    </template>

    <table class="table table-modern table-hover">
      <thead>
        <tr>
          <SortTh field="name" :sort="sort" @sort="sortBy">Producto</SortTh>
          <SortTh field="category" :sort="sort" @sort="sortBy">Categoría</SortTh>
          <SortTh field="price" :sort="sort" class="text-end" @sort="sortBy">Precio</SortTh>
          <SortTh field="stock" :sort="sort" style="min-width: 190px" @sort="sortBy">Stock</SortTh>
          <th class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pageRows" :key="p.id">
          <td class="fw-semibold">{{ p.name }}</td>
          <td><span class="chip">{{ p.category }}</span></td>
          <td class="text-end">{{ money(p.price) }}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-soft" :disabled="p.stock === 0" @click="adjustStock(p, -1)"><i class="bi bi-dash"></i></button>
                <span class="btn btn-soft disabled fw-semibold" style="min-width: 44px">{{ p.stock }}</span>
                <button class="btn btn-soft" @click="adjustStock(p, 1)"><i class="bi bi-plus"></i></button>
              </div>
              <div class="progress progress-thin flex-grow-1">
                <div class="progress-bar" :class="stockClass(p)" :style="{ width: Math.max(Math.min(p.stock, 100), 3) + '%' }"></div>
              </div>
            </div>
          </td>
          <td class="text-end"><RowActions @edit="openForm('products', p)" @remove="removeRow('products', p)" /></td>
        </tr>
      </tbody>
    </table>
  </TablePanel>
</template>

<script setup>
import { computed } from 'vue';
import { state } from '../viewmodels/appViewModel.js';
import { lowStockProducts } from '../viewmodels/catalogViewModel.js';
import { openForm, removeRow, adjustStock } from '../viewmodels/crudViewModel.js';
import { money } from '../utils/format.js';
import { useTable } from '../viewmodels/tableViewModel.js';
import TablePanel from './components/TablePanel.vue';
import SortTh from './components/SortTh.vue';
import RowActions from './components/RowActions.vue';

const props = defineProps({
  lowOnly: { type: Boolean, default: false }, // true → vista "Stock bajo"
});

const source = computed(() => (props.lowOnly ? lowStockProducts.value : state.db.products));
const { sort, page, filtered, totalPages, pageRows, sortBy } = useTable(source, {
  sortKey: props.lowOnly ? 'stock' : '',
});

function stockClass(p) {
  if (p.stock === 0) return 'bg-danger';
  if (p.stock <= state.prefs.lowStock) return 'bg-warning';
  return '';
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2>{{ title }}</h2>
        <small>{{ count }} registro(s)</small>
      </div>
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <slot name="actions"></slot>
        <div class="search-box d-md-none">
          <i class="bi bi-search"></i>
          <input v-model="state.ui.search" type="search" class="form-control" placeholder="Buscar...">
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <slot></slot>
      <div v-if="!rows" class="empty-state">
        <i class="bi bi-search"></i>
        {{ state.ui.search ? `Sin resultados para «${state.ui.search}»` : 'No hay registros para mostrar' }}
      </div>
    </div>

    <TablePagination v-if="count" :page="page" :total-pages="totalPages" :count="count"
                     @update:page="emit('update:page', $event)" />
  </div>
</template>

<script setup>
import { state } from '../../viewmodels/appViewModel.js';
import TablePagination from './TablePagination.vue';

defineProps({
  title: { type: String, required: true },
  count: { type: Number, required: true },   // filas tras filtrar
  rows: { type: Number, required: true },    // filas en la página actual
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});
const emit = defineEmits(['update:page']);
</script>

<template>
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 py-3 border-top">
    <small class="text-muted">Mostrando {{ from }}–{{ to }} de {{ count }}</small>
    <ul class="pagination pagination-sm mb-0">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <a class="page-link" href="#" @click.prevent="setPage(page - 1)"><i class="bi bi-chevron-left"></i></a>
      </li>
      <li v-for="n in numbers" :key="n" class="page-item" :class="{ active: n === page }">
        <a class="page-link" href="#" @click.prevent="setPage(n)">{{ n }}</a>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <a class="page-link" href="#" @click.prevent="setPage(page + 1)"><i class="bi bi-chevron-right"></i></a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { state } from '../../viewmodels/appViewModel.js';

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  count: { type: Number, required: true },
});
const emit = defineEmits(['update:page']);

const from = computed(() => (props.page - 1) * state.prefs.pageSize + 1);
const to = computed(() => Math.min(props.page * state.prefs.pageSize, props.count));

// Muestra hasta 5 números alrededor de la página actual
const numbers = computed(() => {
  const total = props.totalPages;
  const start = Math.max(1, Math.min(props.page - 2, total - 4));
  return Array.from({ length: Math.min(5, total) }, (_, i) => start + i);
});

function setPage(n) {
  if (n >= 1 && n <= props.totalPages) emit('update:page', n);
}
</script>

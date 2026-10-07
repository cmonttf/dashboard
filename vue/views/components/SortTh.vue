<template>
  <th class="sortable" @click="emit('sort', field)">
    <slot></slot> <i :class="icon"></i>
  </th>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  field: { type: String, required: true },
  sort: { type: Object, required: true }, // { key, dir } de useTable()
});
const emit = defineEmits(['sort']);

const icon = computed(() => {
  if (props.sort.key !== props.field) return 'bi bi-chevron-expand opacity-50';
  return props.sort.dir === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down';
});
</script>

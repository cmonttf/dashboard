<template>
  <div class="kpi" :class="'tone-' + tone">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <div class="kpi-label">{{ label }}</div>
        <div class="kpi-value">{{ value }}</div>
      </div>
      <div class="kpi-icon"><i class="bi" :class="icon"></i></div>
    </div>
    <div v-if="delta !== null" class="kpi-delta" :class="delta >= 0 ? 'text-success' : 'text-danger'">
      <i class="bi" :class="delta >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i>
      {{ Math.abs(delta) }}% <span class="text-muted fw-normal">vs. 30 días previos</span>
    </div>
    <div v-else class="kpi-delta text-muted fw-normal">{{ note }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'bi-bar-chart' },
  tone: { type: String, default: 'indigo' }, // indigo | emerald | amber | rose | sky
  delta: { type: Number, default: null },
  note: { type: String, default: '' },
});
</script>

<template>
  <!-- Solo lectura -->
  <span v-if="!editable" class="status-pill" :class="'s-' + status">{{ STATUSES[status].label }}</span>

  <!-- Con dropdown para cambiar el estado -->
  <div v-else class="dropdown">
    <button class="status-pill dropdown-toggle" :class="'s-' + status" data-bs-toggle="dropdown"
            data-bs-popper-config='{"strategy":"fixed"}'>
      {{ STATUSES[status].label }}
    </button>
    <ul class="dropdown-menu">
      <li><h6 class="dropdown-header">Cambiar estado</h6></li>
      <li v-for="(s, key) in STATUSES" :key="key">
        <a class="dropdown-item" :class="{ active: status === key }" href="#" @click.prevent="emit('change', key)">
          <i class="bi bi-circle-fill" :style="{ color: s.color, fontSize: '.5rem' }"></i> {{ s.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { STATUSES } from '../../models/constants.js';

defineProps({
  status: { type: String, required: true },
  editable: { type: Boolean, default: false },
});
const emit = defineEmits(['change']);
</script>

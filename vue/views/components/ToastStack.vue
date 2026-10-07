<template>
  <transition-group name="toast" tag="div" class="toast-stack">
    <div v-for="t in state.toasts" :key="t.id" class="toast-item" :class="'t-' + t.type">
      <i class="bi fs-5" :class="ICONS[t.type]"></i>
      <span>{{ t.msg }}</span>
    </div>
  </transition-group>
</template>

<script setup>
import { state } from '../../viewmodels/appViewModel.js';

const ICONS = {
  success: 'bi-check-circle-fill text-success',
  danger: 'bi-trash3-fill text-danger',
  warning: 'bi-exclamation-circle-fill text-warning',
};
</script>

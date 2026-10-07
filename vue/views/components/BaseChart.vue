<template>
  <div class="chart-box"><canvas ref="canvas"></canvas></div>
</template>

<script setup>
// Envoltorio de Chart.js: recrea el gráfico cuando cambia la configuración
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  config: { type: Object, required: true },
});

const canvas = ref(null);
let chart = null; // fuera del estado reactivo a propósito

function render() {
  chart?.destroy();
  chart = new window.Chart(canvas.value, props.config);
}

onMounted(render);
watch(() => props.config, render);
onBeforeUnmount(() => chart?.destroy());
</script>

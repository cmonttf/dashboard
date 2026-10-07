<template>
  <div class="row-actions">
    <button class="btn btn-sm btn-soft" title="Editar" @click="emit('edit')"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-sm btn-soft text-danger ms-1" title="Eliminar" @click="emit('remove')"><i class="bi bi-trash3"></i></button>
  </div>
</template>

<script setup>
const emit = defineEmits(['edit', 'remove']);
</script>

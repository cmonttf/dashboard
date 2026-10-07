<template>
  <div ref="el" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content text-center p-3">
        <div class="modal-body">
          <div class="mb-3"><i class="bi bi-exclamation-octagon fs-1" :class="'text-' + confirmState.variant"></i></div>
          <h5 class="fw-bold">{{ confirmState.title }}</h5>
          <p class="text-muted small mb-0">{{ confirmState.message }}</p>
        </div>
        <div class="d-flex gap-2 px-3 pb-2">
          <button class="btn btn-soft flex-fill" data-bs-dismiss="modal">Cancelar</button>
          <button class="btn flex-fill" :class="'btn-' + confirmState.variant" @click="resolveConfirm(true)">
            {{ confirmState.okText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { confirmState, resolveConfirm } from '../../viewmodels/dialogViewModel.js';

const el = ref(null);
let modal = null;

onMounted(() => {
  modal = window.bootstrap.Modal.getOrCreateInstance(el.value);
  // Cerrar sin confirmar equivale a "no" (si ya se resolvió, no hace nada)
  el.value.addEventListener('hidden.bs.modal', () => resolveConfirm(false));
});

watch(() => confirmState.open, open => (open ? modal.show() : modal.hide()));
</script>

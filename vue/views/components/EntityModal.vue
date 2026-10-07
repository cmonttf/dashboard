<template>
  <div ref="el" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" novalidate :class="{ 'was-validated': formState.validated }" @submit.prevent="submit">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi me-2" :class="formState.id ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
            {{ formState.id ? 'Editar' : 'Nuevo' }} {{ entity.singular }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div v-for="f in entity.fields" :key="f.key" :class="'col-md-' + f.col">
              <label class="form-label" :for="'f-' + f.key">{{ f.label }}</label>
              <select v-if="f.type === 'select'" :id="'f-' + f.key" v-model="formState.data[f.key]"
                      class="form-select" :required="f.required">
                <option v-for="o in f.options(state.db)" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
              <input v-else :id="'f-' + f.key" v-model="formState.data[f.key]" :type="f.type" class="form-control"
                     :required="f.required" :min="f.min" :step="f.step">
              <div class="invalid-feedback">Campo obligatorio o inválido.</div>
            </div>
          </div>

          <div v-if="formState.entity === 'orders'" class="stat-tile d-flex justify-content-between align-items-center mt-3">
            <span class="label">Total calculado</span>
            <span class="value">{{ money(formOrderTotal) }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-soft" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary"><i class="bi bi-check2 me-1"></i> Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { state } from '../../viewmodels/appViewModel.js';
import { formState, formEntity as entity, formOrderTotal, saveForm } from '../../viewmodels/crudViewModel.js';
import { money } from '../../utils/format.js';

const el = ref(null);
let modal = null;

onMounted(() => {
  modal = window.bootstrap.Modal.getOrCreateInstance(el.value);
  // Cerrar con la X, Esc o clic fuera también actualiza el estado
  el.value.addEventListener('hidden.bs.modal', () => { formState.open = false; });
});

watch(() => formState.open, open => (open ? modal.show() : modal.hide()));

function submit(e) {
  if (!e.target.checkValidity()) { formState.validated = true; return; }
  saveForm();
}
</script>

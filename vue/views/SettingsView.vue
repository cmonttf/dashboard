<template>
  <div class="row g-3">
    <div class="col-lg-7">
      <div class="panel">
        <div class="panel-header"><div><h2>General</h2><small>Los cambios se guardan automáticamente</small></div></div>
        <div class="panel-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre de la empresa</label>
              <input v-model="state.prefs.company" class="form-control">
            </div>
            <div class="col-md-6">
              <label class="form-label">Nombre de usuario</label>
              <input v-model="state.prefs.userName" class="form-control">
            </div>
            <div class="col-md-6">
              <label class="form-label">Umbral de stock bajo: <strong>{{ state.prefs.lowStock }}</strong></label>
              <input v-model.number="state.prefs.lowStock" type="range" class="form-range" min="0" max="50">
            </div>
            <div class="col-md-6">
              <label class="form-label">Filas por página</label>
              <select v-model.number="state.prefs.pageSize" class="form-select">
                <option v-for="n in [5, 8, 10, 15, 25]" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="col-12">
              <div class="form-check form-switch">
                <input id="pref-mini" v-model="state.prefs.sidebarMini" class="form-check-input" type="checkbox">
                <label class="form-check-label" for="pref-mini">Menú lateral minimizado (escritorio)</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-5">
      <div class="panel">
        <div class="panel-header"><h2>Apariencia</h2></div>
        <div class="panel-body">
          <label class="form-label d-block">Tema</label>
          <div class="segmented mb-4">
            <button v-for="t in THEMES" :key="t.value" class="btn" :class="{ active: state.prefs.theme === t.value }"
                    @click="state.prefs.theme = t.value">
              <i class="bi me-1" :class="t.icon"></i> {{ t.label }}
            </button>
          </div>

          <label class="form-label d-block">Color de acento</label>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <span v-for="c in ACCENTS" :key="c" class="accent-swatch" :class="{ selected: state.prefs.accent === c }"
                  :style="{ background: c }" :title="c" @click="state.prefs.accent = c"></span>
          </div>

          <label class="form-label d-block">Vista previa</label>
          <div class="d-flex flex-wrap gap-2 align-items-center">
            <button class="btn btn-primary btn-sm">Primario</button>
            <button class="btn btn-outline-primary btn-sm">Contorno</button>
            <span class="badge text-bg-primary">Badge</span>
            <div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" checked></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { state } from '../viewmodels/appViewModel.js';
import { ACCENTS } from '../models/constants.js';

const THEMES = [
  { value: 'light', label: 'Claro', icon: 'bi-sun' },
  { value: 'dark', label: 'Oscuro', icon: 'bi-moon-stars' },
  { value: 'auto', label: 'Sistema', icon: 'bi-circle-half' },
];
</script>

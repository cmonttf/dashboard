<template>
  <header class="topbar">
    <button class="icon-btn" title="Expandir/minimizar menú" @click="toggleSidebar"><i class="bi bi-list"></i></button>

    <div class="page-heading me-auto">
      <nav aria-label="breadcrumb" class="d-none d-sm-block">
        <ol class="breadcrumb">
          <li v-for="c in currentView.crumb" :key="c" class="breadcrumb-item">{{ c }}</li>
          <li class="breadcrumb-item active">{{ currentView.title }}</li>
        </ol>
      </nav>
      <h1 class="text-truncate">{{ currentView.title }}</h1>
    </div>

    <div v-if="isTableView" class="search-box d-none d-md-block">
      <i class="bi bi-search"></i>
      <input ref="searchInput" v-model="state.ui.search" type="search" class="form-control" placeholder="Buscar...">
      <kbd v-if="!state.ui.search">/</kbd>
    </div>

    <button class="icon-btn" :title="isDark ? 'Tema claro' : 'Tema oscuro'" @click="toggleTheme">
      <i class="bi" :class="isDark ? 'bi-sun' : 'bi-moon-stars'"></i>
    </button>

    <!-- Notificaciones -->
    <div class="dropdown">
      <button class="icon-btn" data-bs-toggle="dropdown" aria-expanded="false" title="Notificaciones">
        <i class="bi bi-bell"></i>
        <span v-if="notifications.length" class="dot"></span>
      </button>
      <div class="dropdown-menu dropdown-menu-end notif-menu">
        <div class="d-flex justify-content-between align-items-center px-2 py-1 mb-1">
          <strong class="small">Notificaciones</strong>
          <span class="badge text-bg-primary rounded-pill">{{ notifications.length }}</span>
        </div>
        <a v-for="(n, i) in notifications" :key="i" class="dropdown-item notif-item" href="#" @click.prevent="go(n.view)">
          <span class="notif-icon" :style="{ background: n.color + '22', color: n.color }"><i class="bi" :class="n.icon"></i></span>
          <span>
            <span class="d-block fw-medium">{{ n.text }}</span>
            <small class="text-muted">{{ n.sub }}</small>
          </span>
        </a>
        <div v-if="!notifications.length" class="text-center text-muted small py-3">Todo al día 🎉</div>
      </div>
    </div>

    <!-- Usuario -->
    <div class="dropdown">
      <button class="user-chip" data-bs-toggle="dropdown" aria-expanded="false">
        <UserAvatar :name="state.prefs.userName" size="sm" />
        <span class="name d-none d-md-inline">{{ state.prefs.userName }}</span>
        <i class="bi bi-chevron-down small text-muted d-none d-md-inline"></i>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><h6 class="dropdown-header">{{ state.prefs.company }}</h6></li>
        <li><a class="dropdown-item" href="#/settings"><i class="bi bi-person-gear"></i> Preferencias</a></li>
        <li><a class="dropdown-item" href="#" @click.prevent="exportData"><i class="bi bi-download"></i> Exportar datos</a></li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item text-danger" href="#" @click.prevent="resetData">
            <i class="bi bi-arrow-counterclockwise"></i> Restablecer datos
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  state, isDark, currentView, isTableView, toggleSidebar, toggleTheme, go,
} from '../../viewmodels/appViewModel.js';
import { notifications } from '../../viewmodels/catalogViewModel.js';
import { exportData, resetData } from '../../viewmodels/backupViewModel.js';
import UserAvatar from './UserAvatar.vue';

const searchInput = ref(null);

// Atajo "/" para enfocar la búsqueda
function onKeydown(e) {
  if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.value?.focus();
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

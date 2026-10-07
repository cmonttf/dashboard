<template>
  <aside class="sidebar">
    <a class="sidebar-brand" href="#/dashboard">
      <span class="brand-logo"><i class="bi bi-lightning-charge-fill"></i></span>
      <span class="brand-text">
        <span class="brand-name d-block">{{ state.prefs.company }}</span>
        <span class="brand-sub">Panel de gestión</span>
      </span>
    </a>

    <nav class="sidebar-nav">
      <template v-for="section in MENU" :key="section.title">
        <div class="nav-section">{{ section.title }}</div>

        <template v-for="item in section.items" :key="item.id">
          <!-- Enlace simple -->
          <a v-if="!item.children" class="nav-link-item" :class="{ active: state.ui.view === item.view }"
             :href="'#/' + item.view">
            <i class="bi" :class="item.icon"></i> <span class="label">{{ item.label }}</span>
          </a>

          <!-- Grupo desplegable -->
          <div v-else class="nav-group" :class="{ open: isOpen(item), 'has-active': isGroupActive(item) }">
            <button type="button" class="nav-link-item" :aria-expanded="isOpen(item)" @click="toggleGroup(item.id)">
              <i class="bi" :class="item.icon"></i> <span class="label">{{ item.label }}</span>
              <span v-if="hasBadge(item)" class="mini-dot"></span>
              <i class="bi bi-chevron-down caret"></i>
            </button>
            <div class="nav-submenu" :style="{ maxHeight: isOpen(item) ? item.children.length * 46 + 'px' : 0 }">
              <div class="submenu-title">{{ item.label }}</div>
              <a v-for="child in item.children" :key="child.view" class="nav-link-item"
                 :class="{ active: state.ui.view === child.view }" :href="'#/' + child.view">
                {{ child.label }}
                <span v-if="child.badge && badges[child.badge]" class="badge rounded-pill"
                      :class="child.badge === 'lowstock' ? 'text-bg-danger' : 'text-bg-warning'">
                  {{ badges[child.badge] }}
                </span>
              </a>
            </div>
          </div>
        </template>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div class="storage-card">
        <div class="d-flex justify-content-between mb-2">
          <span :title="'LocalStorage: ' + fmtBytes(state.storageBytes)">
            <i class="bi bi-database me-1"></i> <span class="label">LocalStorage</span>
          </span>
          <span class="label text-white">{{ fmtBytes(state.storageBytes) }}</span>
        </div>
        <div class="progress"><div class="progress-bar" :style="{ width: Math.max(storagePct, 2) + '%' }"></div></div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { state, storagePct, toggleGroup } from '../../viewmodels/appViewModel.js';
import { badges } from '../../viewmodels/catalogViewModel.js';
import { MENU } from '../../models/navigation.js';
import { fmtBytes } from '../../utils/format.js';

const isOpen = item => state.ui.openGroups.includes(item.id);
const isGroupActive = item => item.children.some(c => c.view === state.ui.view);
const hasBadge = item => item.children.some(c => c.badge && badges.value[c.badge]);
</script>

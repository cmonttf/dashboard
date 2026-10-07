<template>
  <div class="layout" :class="{ 'is-mini': state.prefs.sidebarMini, 'is-mobile-open': state.ui.mobileOpen }">
    <AppSidebar />
    <div v-if="state.ui.mobileOpen" class="sidebar-backdrop d-lg-none" @click="state.ui.mobileOpen = false"></div>

    <div class="main">
      <AppTopbar />

      <main class="content">
        <transition name="view" mode="out-in">
          <component :is="page.component" :key="state.ui.view" v-bind="page.props" />
        </transition>
      </main>

      <footer class="footer d-flex flex-wrap justify-content-between gap-2">
        <span>© {{ year }} {{ state.prefs.company }}</span>
        <span>Vue 3 · Bootstrap 5.3 · Sass · LocalStorage</span>
      </footer>
    </div>

    <EntityModal />
    <ConfirmModal />
    <ToastStack />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { state } from './viewmodels/appViewModel.js';
import AppSidebar from './views/components/AppSidebar.vue';
import AppTopbar from './views/components/AppTopbar.vue';
import EntityModal from './views/components/EntityModal.vue';
import ConfirmModal from './views/components/ConfirmModal.vue';
import ToastStack from './views/components/ToastStack.vue';
import DashboardView from './views/DashboardView.vue';
import OrdersView from './views/OrdersView.vue';
import CustomersView from './views/CustomersView.vue';
import ProductsView from './views/ProductsView.vue';
import SettingsView from './views/SettingsView.vue';
import DataView from './views/DataView.vue';

// Vista que corresponde a cada ruta (#/nombre)
const ROUTES = {
  dashboard: { component: DashboardView },
  orders:    { component: OrdersView },
  customers: { component: CustomersView },
  products:  { component: ProductsView },
  lowstock:  { component: ProductsView, props: { lowOnly: true } },
  settings:  { component: SettingsView },
  data:      { component: DataView },
};

const page = computed(() => ROUTES[state.ui.view] ?? ROUTES.dashboard);
const year = new Date().getFullYear();
</script>

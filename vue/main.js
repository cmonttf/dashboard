/* ==================================================================
   Punto de entrada: carga los componentes .vue en el navegador con
   vue3-sfc-loader (sin Vite ni paso de compilación) y monta App.vue.
   ================================================================== */
const { loadModule } = window['vue3-sfc-loader'];

const loaderOptions = {
  // Módulos "bare" disponibles para los import de los .vue/.js
  moduleCache: { vue: Vue },

  // Resuelve rutas relativas ('./x.vue', '../models/constants.js') a URL absolutas
  pathResolve({ refPath, relPath }) {
    if (!/^\.{0,2}\//.test(relPath)) return relPath; // 'vue' u otro módulo del moduleCache
    return new URL(relPath, new URL(refPath ?? '.', location.href)).href;
  },

  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
    return {
      getContentData: asBinary => (asBinary ? res.arrayBuffer() : res.text()),
      // Los .js del proyecto usan import/export: se tratan como módulos ES
      type: url.endsWith('.js') ? '.mjs' : undefined,
    };
  },

  // Por si algún componente declara <style>; los estilos globales vienen de Sass
  addStyle(textContent) {
    document.head.appendChild(Object.assign(document.createElement('style'), { textContent }));
  },
};

Chart.defaults.font.family = 'Inter, system-ui, sans-serif';

const App = Vue.defineAsyncComponent({
  loader: () => loadModule('./vue/App.vue', loaderOptions),
  loadingComponent: {
    render: () => Vue.h('div', { class: 'app-loading' }, [
      Vue.h('div', { class: 'spinner-border text-primary', role: 'status' }),
    ]),
  },
  errorComponent: {
    props: ['error'],
    render() {
      return Vue.h('div', { class: 'app-loading' }, [
        Vue.h('div', { class: 'alert alert-danger m-4', style: 'max-width: 560px' }, [
          Vue.h('strong', 'No se pudo cargar la aplicación. '),
          location.protocol === 'file:'
            ? 'Los componentes .vue se cargan con fetch(), así que abre el proyecto con un servidor local (por ejemplo, Live Server en VS Code).'
            : String(this.error),
        ]),
      ]);
    },
  },
});

Vue.createApp(App).mount('#app');

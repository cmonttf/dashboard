# Dashboard de Gestión

Panel de administración interactivo para gestionar **pedidos, clientes y productos**, construido con **Vue 3 (sin Vite)**, **Bootstrap 5.3** y **Sass**. Los datos se guardan en el navegador mediante **LocalStorage**, por lo que no requiere backend ni base de datos.

## Características

- **Dashboard** con indicadores (ingresos, pedidos, clientes, ticket promedio) comparados con los 30 días previos, gráfico de ingresos/pedidos de los últimos 6 meses, gráfico de estados, pedidos recientes y productos más vendidos.
- **CRUD completo** de pedidos, clientes y productos con formularios validados en ventanas modales.
- **Tablas** con búsqueda, orden por columna y paginación.
- **Pedidos**: filtro por estado y cambio de estado desde la misma tabla.
- **Inventario**: ajuste rápido de stock y vista de *Stock bajo* según un umbral configurable.
- **Menú lateral fijo** con submenús desplegables:
  - en escritorio se puede **minimizar** a solo iconos (los submenús se abren como paneles flotantes);
  - en móvil se abre sobre el contenido.
- **Tema claro / oscuro / sistema** y **color de acento** personalizable.
- **Respaldo**: exportar e importar datos en JSON, regenerar datos de ejemplo o vaciar todo.
- Sincronización automática entre pestañas abiertas.

## Tecnologías

| Herramienta | Uso | Origen |
|---|---|---|
| [Vue 3](https://vuejs.org/) | Interfaz reactiva y componentes `.vue` | CDN |
| [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader) | Compila los `.vue` en el navegador (sin Vite) | CDN |
| [Bootstrap 5.3](https://getbootstrap.com/) + Bootstrap Icons | Estilos base, dropdowns y modales | CDN |
| [Chart.js 4](https://www.chartjs.org/) | Gráficos | CDN |
| [Sass](https://sass-lang.com/) | Estilos propios | npm (global) |
| LocalStorage | Persistencia de datos y preferencias | Navegador |

## Requisitos

- Un navegador moderno.
- Un **servidor local** para abrir el proyecto (por ejemplo, la extensión **Live Server** de VS Code).
- [Sass](https://sass-lang.com/install/) instalado globalmente, solo si vas a modificar los estilos:

  ```bash
  npm install -g sass
  ```

## Cómo ejecutarlo

1. Abre la carpeta del proyecto en VS Code.
2. Haz clic derecho sobre `index.html` → **Open with Live Server**.

> **Importante:** no funciona abriendo `index.html` con doble clic (`file://`). Los componentes `.vue` se cargan con `fetch()`, y el navegador lo bloquea fuera de un servidor. En ese caso la página muestra un aviso.

La primera vez se generan datos de ejemplo (12 productos, 14 clientes y 90 pedidos).

## Compilar los estilos

Los estilos fuente están en `sass/` y se compilan a `css/main.css`:

```bash
npm run sass         # compila una vez
npm run sass:watch   # recompila automáticamente al guardar
```

## Estructura del proyecto

El código Vue sigue el patrón **MVVM (Model – View – ViewModel)**:

```
dashboard/
├── index.html                  ← carga las librerías y monta la app
├── package.json                ← scripts para compilar Sass
├── css/
│   └── main.css                ← CSS compilado (no editar a mano)
├── sass/
│   ├── main.scss               ← punto de entrada de estilos
│   ├── abstracts/              ← variables y mixins
│   ├── base/                   ← tokens de tema (claro/oscuro) y estilos base
│   ├── components/             ← botones, formularios, tablas, tarjetas, modales, toasts…
│   └── layouts/                ← menú lateral, barra superior y estructura principal
└── vue/
    ├── main.js                 ← configura vue3-sfc-loader y monta App.vue
    ├── App.vue                 ← layout raíz y enrutamiento de vistas
    ├── models/                 ← MODEL: datos y reglas, sin dependencias de Vue
    │   ├── constants.js        ← estados, categorías, ciudades, preferencias por defecto
    │   ├── schemas.js          ← campos de formulario de cada entidad
    │   ├── navigation.js       ← menú lateral y vistas
    │   ├── repository.js       ← única capa que lee/escribe LocalStorage
    │   └── seed.js             ← datos de ejemplo
    ├── viewmodels/             ← VIEWMODEL: estado reactivo y lógica
    │   ├── appViewModel.js     ← estado global, persistencia, tema, rutas y menú
    │   ├── catalogViewModel.js ← datos derivados (pedidos con nombres, stock bajo, avisos)
    │   ├── crudViewModel.js    ← formulario y acciones CRUD
    │   ├── dialogViewModel.js  ← toasts y diálogo de confirmación
    │   ├── backupViewModel.js  ← exportar, importar, regenerar y vaciar
    │   ├── dashboardViewModel.js ← KPIs y configuración de gráficos
    │   └── tableViewModel.js   ← búsqueda, orden y paginación
    ├── views/                  ← VIEW: plantillas .vue
    │   ├── DashboardView.vue, OrdersView.vue, CustomersView.vue,
    │   │   ProductsView.vue, SettingsView.vue, DataView.vue
    │   └── components/         ← componentes reutilizables (sidebar, topbar, tablas, modales…)
    └── utils/
        └── format.js           ← formato de moneda y fechas, colores de avatar
```

### Responsabilidades de cada capa

- **Model**: define los datos y cómo se guardan. No conoce a Vue ni a las vistas.
- **ViewModel**: mantiene el estado reactivo, calcula datos derivados y expone acciones. Solo accede a LocalStorage a través de `models/repository.js`.
- **View**: muestra datos y llama a funciones del ViewModel; no contiene lógica de negocio.

## Rutas

La navegación usa el *hash* de la URL:

| Ruta | Vista |
|---|---|
| `#/dashboard` | Resumen general |
| `#/orders` | Pedidos |
| `#/customers` | Clientes |
| `#/products` | Productos |
| `#/lowstock` | Productos con stock bajo |
| `#/settings` | Preferencias |
| `#/data` | Datos y respaldo |

## Datos en LocalStorage

| Clave | Contenido |
|---|---|
| `uds-dashboard:data` | `{ products, customers, orders }` |
| `uds-dashboard:prefs` | Tema, color de acento, empresa, usuario, umbral de stock, filas por página y estado del menú |

Para empezar de cero puedes usar **Configuración → Datos y respaldo**, o borrar esas claves desde las herramientas de desarrollo del navegador (*Application → Local Storage*).

## Atajos

- <kbd>/</kbd> enfoca el buscador en las vistas con tabla.

import type { RouteRecordRaw } from 'vue-router'
import { boot } from '../../boot'
import Dashboard from './dashboard.vue'

const routes: RouteRecordRaw[] = []

routes.push({
  path: '/iframe',
  component: () => import('./components/iframe-view/iframe-view.vue'),
})
routes.push({
  path: '/schema',
  component: () => import('./components/schema-view/schema-view.vue'),
})
routes.push({
  path: '/sider',
  component: () => import('./components/sider-view/sider-view.vue'),
  children: [
    {
      path: 'schema',
      component: () => import('./components/schema-view/schema-view.vue'),
    },
    {
      path: 'iframe',
      component: () => import('./components/iframe-view/iframe-view.vue'),
    },
    {
      path: 'todo',
      component: () => import('./components/the-todo/the-todo.vue'),
    },
  ],
})
routes.push({
  path: '/sider/:chapters+',
  component: () => import('./components/sider-view/sider-view.vue'),
})

boot(Dashboard, {
  routes,
})

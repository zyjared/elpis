import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todo',
  },
  {
    path: '/todo',
    component: () => import('@/components/dashboard/layout/container/todo.vue'),
  },
  {
    path: '/sidebar',
    component: () => import('@/components/dashboard/layout/container/sidebar.vue'),
    children: [
      {
        path: '/sidebar/todo',
        component: () => import('@/components/dashboard/layout/container/todo.vue'),
      },
    ],
  },
  {
    path: '/schema',
    component: () => import('@/components/dashboard/layout/container/schema/index.vue'),
  },
  {
    path: '/iframe',
    component: () => import('@/components/dashboard/layout/container/iframe.vue'),
  },
]

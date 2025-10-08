import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/projects',
  },
  {
    path: '/projects',
    component: () => import('@/entries/index/views/projects.vue'),
  },
]

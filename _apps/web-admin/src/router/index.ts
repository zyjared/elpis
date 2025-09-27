import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router'

import AboutView from '../pages/About.vue'
import HomeView from '../pages/Home.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  })
}

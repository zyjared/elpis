import type { Component, Plugin } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'element-plus/dist/index.css'
import '@/asserts/normalize.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

interface BootOptions {
  routes?: RouteRecordRaw[]
  plugins?: Plugin[]
}

/**
 * 主入口
 */
export function boot(page: Component, options: BootOptions = {}) {
  const { routes, plugins } = options

  const app = createApp(page)
  const pinia = createPinia()
  app.use(pinia)

  // plugins
  if (plugins && plugins.length > 0) {
    plugins.forEach((plugin) => {
      app.use(plugin)
    })
  }

  // routes
  if (routes && routes.length > 0) {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    router.isReady().then(() => {
      app.use(router)
      app.mount('#root')
    })
  }
  else {
    app.mount('#root')
  }
}

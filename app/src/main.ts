import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createSSRApp, createApp as createVueApp } from 'vue'
import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import 'virtual:uno.css'

import '@/style.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

export async function createApp(options: {
  routes?: RouteRecordRaw[]
  appComponent?: Component
  mount?: boolean | string
  url?: string
} = {}) {
  const { url, routes, appComponent = App, mount = '#app' } = options

  const mountId = mount && typeof options.mount === 'string'
    ? options.mount
    : '#app'

  const isSSR = import.meta.env.SSR

  const app = isSSR
    ? createSSRApp(appComponent)
    : createVueApp(appComponent)

  const pinia = createPinia()
  app.use(pinia)
  app.use(ElementPlus)

  let router = null

  // 存在路由时
  if (routes && routes.length > 0) {
    router = createRouter({
      routes,
      history: isSSR
        ? createMemoryHistory()
        : createWebHashHistory(),
    })
    app.use(router)

    // 客户端挂载
    if (!isSSR && mountId) {
      router?.isReady().then(() => {
        app.mount(mountId)
      })
    }

    // 服务端路由跳转
    if (isSSR && url) {
      await router.push(url)
      await router.isReady()
    }
  }
  // 不存在路由时
  else {
    mountId && !isSSR && app.mount(mountId)
  }

  return {
    app,
    router,
  }
}

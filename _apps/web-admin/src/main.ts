// import { createPinia } from 'pinia'
import { createSSRApp, createApp as createVueApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import './style.css'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  console.log('createApp SSR', import.meta.env.SSR)
  const app = import.meta.env.SSR ? createSSRApp(App) : createVueApp(App)
  //   const pinia = createPinia()
  //   app.use(pinia)
  const router = createRouter()
  app.use(router)
  return { app, router }
}

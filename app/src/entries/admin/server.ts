import { renderToString } from 'vue/server-renderer'
import { createApp } from '../../main'
import App from './App.vue'
import { routes } from './router'

export async function render(url: string, _manifest?: any) {
  const { app } = await createApp({
    routes,
    url,
    appComponent: App,
  })

  const ctx = {} as any
  const html = await renderToString(app, ctx)

  return { html }
}

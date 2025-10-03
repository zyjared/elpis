import { renderToString } from 'vue/server-renderer'
import { createApp } from '../../main'
import App from './App.vue'

export async function render(url: string, _manifest?: any) {
  const { app } = await createApp({
    appComponent: App,
    url,
  })

  const ctx = {} as any
  const html = await renderToString(app, ctx)

  return { html }
}

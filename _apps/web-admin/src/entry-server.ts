import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url: string, _manifest?: any) {
  const { app, router } = createApp()

  await router.push(url)
  await router.isReady()

  const ctx = {} as any
  const html = await renderToString(app, ctx)

  return { html }
}

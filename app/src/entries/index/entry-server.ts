import { renderToString } from 'vue/server-renderer'
import { createApp } from '../../main'

export async function render(url: string, _manifest?: any) {
  const { app } = await createApp({
    url,
  })

  const ctx = {} as any
  const html = await renderToString(app, ctx)

  return { html }
}

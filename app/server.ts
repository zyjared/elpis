import type { Router as ElpisRouter } from '@elpis/core'
import type { ViteDevServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp as createElpisApp } from '@elpis/core'
import fs from 'fs-extra'
import c2k from 'koa-connect'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  const app = await createElpisApp({
    server: {
      port: 5173,
    },
  })

  if (!app) {
    throw new Error('创建 Elpis 应用失败')
  }

  app.use(c2k(vite.middlewares))
  app.use(createViteRouterMiddleware(vite))

  const { server } = app.options

  const { logger } = app

  app.listen(server.port, () => {
    logger.success(`🎉 Server is running on ${server.url}`)
  })

  return app
}

function createViteRouterMiddleware(vite: ViteDevServer) {
  const middleware: ElpisRouter.Middleware = async (ctx, next) => {
    const { req } = ctx

    const url = req.url

    if (!url) {
      ctx.status = 404
      ctx.body = 'Elpis SSR Not Found'
      return
    }

    try {
      const entry = url.match(/^\/(admin|index)$/)?.[1] ?? 'index'

      const templatePath = path.resolve(__dirname, `src/entries/${entry}/index.html`)

      let template = fs.readFileSync(templatePath, 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      const { render } = await vite.ssrLoadModule(`/src/entries/${entry}/entry-server.ts`)

      const { html: appHtml } = await render(url)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      ctx.status = 200
      ctx.set({ 'Content-Type': 'text/html' })
      ctx.body = html
    }
    catch (e) {
      vite.ssrFixStacktrace(e)
      console.error('SSR Error:', e)
      ctx.status = 500
      ctx.body = 'Internal Server Error'
      await next()
    }
  }

  return middleware
}

createServer()

import { createApp as createElpisApp } from '@elpis/core'
import c2k from 'koa-connect'
import { createServer as createViteServer } from 'vite'
import { createViteRouterMiddleware } from './middleware/router'

export async function createServer(options: { inputDir?: string } = {}) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
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
  app.use(createViteRouterMiddleware(vite, options))

  const { server } = app.options

  const { logger } = app

  app.listen(server.port, () => {
    logger.success(`🎉 Server is running on ${server.url}`)
  })

  return app
}

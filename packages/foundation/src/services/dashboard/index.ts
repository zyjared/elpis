import type { ElpisApp } from '@elpis/core'

export function routerMiddleware(app: ElpisApp, router: ElpisApp['router']) {
  router.get('/menu', async (ctx, _next) => {
    ctx.body = 'Hello World'
  })
}

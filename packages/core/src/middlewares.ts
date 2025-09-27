import type { ElpisApp } from './app'
import koaStatic from 'koa-static'

export function useMiddlewares(app: ElpisApp) {
  const { assetsDir } = app.options
  assetsDir && app.use(koaStatic(assetsDir))
}

import type { Context } from 'koa'
import type { ElpisApp } from '../../elpis-core/types'

export default function (_app: ElpisApp) {
  return class ViewController {
    async renderPage(ctx: Context) {
      const { id } = ctx.params
      await ctx.render('view', { id })
    }
  }
}

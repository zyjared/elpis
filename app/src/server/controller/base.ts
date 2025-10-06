import type { ElpisApp } from '@elpis/core'
import type { Context } from 'koa'

export default class BaseController {
  app: ElpisApp
  config: ElpisApp['options']
  service: ElpisApp['service']

  constructor(app: ElpisApp) {
    this.app = app
    this.config = app.options
    this.service = app.service
  }

  success(ctx: Context, data: unknown = {}, metadata: Record<string, unknown> = {}) {
    ctx.status = 200
    ctx.body = {
      success: true,
      data,
      metadata,
    }
  }

  fail(ctx: Context, message: string, code: number = 500) {
    ctx.status = code
    ctx.body = {
      success: false,
      message,
      code,
    }
  }
}

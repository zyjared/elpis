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

  success<T = any, D = any>(ctx: Context, data: T, metadata?: D) {
    ctx.status = 200
    ctx.body = {
      success: true,
      data,
      metadata,
    }

    return ctx as {
      status: 200
      body: {
        success: true
        data: T
        metadata: D
      }
    }
  }

  fail<T, D extends number = number>(ctx: Context, message: T, code: D = 500 as D) {
    ctx.status = code
    ctx.body = {
      success: false,
      message,
      code,
    }
    return ctx as unknown as {
      status: D
      body: {
        success: false
        message: T
        code: D
      }
    }
  }

  getQuery<T = Record<string, string | string[]>>(ctx: Context) {
    return ctx.request.query as T
  }

  getBody<T = Record<string, any>>(ctx: Context) {
    return (ctx.request as any).body as T
  }
}

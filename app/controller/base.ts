import type { Context } from 'koa'
import type { ControllerModule, ElpisApp } from '../../elpis-core/types'

const controller: ControllerModule = (app) => {
  return class BaseController {
    app: ElpisApp
    config: ElpisApp['config']
    service: ElpisApp['service']

    constructor() {
      this.app = app
      this.config = app.config
      this.service = app.service
    }

    /**
     * API 处理成功时统一的返回结构
     */
    success(ctx: Context, data: unknown = {}, metadata: Record<string, unknown> = {}) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data,
        metadata,
      }
    }

    /**
     * API 处理失败时统一的返回结构
     */
    fail(ctx: Context, message: string, code: number = 500) {
      ctx.status = code
      ctx.body = {
        success: false,
        message,
        code,
      }
    }
  }
}

export default controller

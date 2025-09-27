import type { MiddlewareModule } from '../../elpis-core/types'

/**
 * 捕获全局错误
 */
const errorHandler: MiddlewareModule = (app) => {
  return async (ctx, next) => {
    try {
      await next()
    }
    catch (error: unknown) {
      // FIXME: 这里需要类型
      const { status, message, detail } = error as {
        status: number
        message: string
        detail: string
      }
      app.logger.info(JSON.stringify(error))
      app.logger.error('[-- exception --]', error)
      app.logger.error('[-- exception --]', status, message, detail)

      // 这里处理模板不存在的情况
      if (message && (message as string).includes('template not found')) {
        ctx.status = 302 // 临时重定向
        return
      }

      const resBody = {
        success: false,
        code: 50000,
        message: '网络异常 请稍后重试',
      }

      ctx.status = 200
      ctx.body = resBody
    }
  }
}

export default errorHandler

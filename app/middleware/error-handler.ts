import type { MiddlewareModule } from '../../elpis-core/types'

/**
 * 捕获全局错误
 */
const errorHandler: MiddlewareModule = (app) => {
  return async (ctx, next) => {
    try {
      await next()
    }
    catch (error) {
      const { status, message, detail } = error
      app.logger.info(JSON.stringify(error))
      app.logger.error('[-- exception --]', error)
      app.logger.error('[-- exception --]', status, message, detail)

      // 这里处理模板不存在的情况
      // FIXME: 注意，如果 homePage 就不存在，会导致无限重定向
      if (message && (message as string).includes('template not found') && app.options.homePage) {
        ctx.status = 302 // 临时重定向
        ctx.redirect(app.options.homePage)
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

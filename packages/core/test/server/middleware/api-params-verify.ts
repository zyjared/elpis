import { defineMiddleware } from '../../../src'

export default defineMiddleware((app) => {
  app.logger.debug('[middleware api params verify]', 'api params verify middleware')
  return async (ctx, next) => {
    await next()
  }
})

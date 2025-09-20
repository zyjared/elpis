import { defineRouter } from '../../../src'

export default defineRouter((app, router) => {
  app.logger.debug('[router error]', 'error router')
  router.get('/error', async (ctx) => {
    ctx.body = {
      success: false,
      message: 'error',
    }
  })
})

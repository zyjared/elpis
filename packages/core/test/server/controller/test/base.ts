import { defineController } from '../../../../src'

export default defineController((app) => {
  app.logger.debug('[controller base]', 'base controller')
  return class BaseController {
  }
})

import { defineService } from '../../../src'

export default defineService((app) => {
  app.logger.debug('[service base]', 'base service')
  return class BaseService {
  }
})

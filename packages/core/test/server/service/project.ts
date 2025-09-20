import { defineService } from '../../../src'

export default defineService((app) => {
  app.logger.debug('[service project]', 'project service')
  return class ProjectService {
  }
})

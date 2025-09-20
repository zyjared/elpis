import { defineController } from '../../../src'

export default defineController((app) => {
  app.logger.debug('[controller project]', 'project controller')
  return class ProjectController {
  }
})

import { defineExtend } from '../../../src'

export default defineExtend((app) => {
  app.logger.debug('[extend log]', 'log extend')
  return console
})

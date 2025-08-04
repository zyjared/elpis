import type { Logger } from 'log4js'
import type { ElpisApp, ExtendModule } from '../../elpis-core/types'
import path from 'node:path'
import log4js from 'log4js'

const logger: ExtendModule = (app: ElpisApp) => {
  let logger: Logger | Console
  if (app.env.dev) {
    logger = console
  }
  else {
    log4js.configure({
      appenders: {
        console: { type: 'console' },
        dateFile: {
          type: 'dateFile',
          filename: path.resolve(app.baseDir, 'logs', 'application.log'),
          pattern: 'yyyy-MM-dd',
          alwaysIncludePattern: true,
        },
      },
      categories: {
        default: {
          appenders: ['console', 'dateFile'],
          level: 'trace',
        },
      },
    })
    logger = log4js.getLogger()
  }

  return logger
}

export default logger

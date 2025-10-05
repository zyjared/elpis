import type { Logger } from 'log4js'
import path from 'node:path'
import process from 'node:process'
import { defineExtend } from '@elpis/core'
import log4js from 'log4js'

export default defineExtend((app) => {
  const { baseDir } = app.options
  let logger: Logger | Console
  if (process.env.NODE_ENV === 'development') {
    logger = console
  }
  else {
    log4js.configure({
      appenders: {
        console: { type: 'console' },
        dateFile: {
          type: 'dateFile',
          filename: path.resolve(baseDir, 'runtime/logs', 'application.log'),
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
})

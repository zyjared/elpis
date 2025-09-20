import path from 'node:path'
import { start } from '../src/app'

main()

async function main() {
  const result = await start({
    debug: true,

    baseDir: path.resolve('./test'),
    serverDir: path.resolve('./test/server'),
  })

  if (!result) {
    return
  }

  const app = result.app
  const { logger } = app

  logger.info('dev app', JSON.stringify({
    middlewares: app.middlewares,
    routerSchema: app.routerSchema,
    controller: app.controller,
    service: app.service,
  }, null, 2))
}

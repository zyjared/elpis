import type KoaRouter from '@koa/router'
import type Application from 'koa'
import type { defineController } from './loader/controller'
import type { RouterSchema } from './loader/router-schema'
import type { defineService } from './loader/service'
import type { Logger } from './logger'
import type { Options } from './options'
import type { ElpisOptions } from './options/define'
import Koa from 'koa'
import { controllerLoader } from './loader/controller'
import { extendLoader } from './loader/extend'
import { middlewaresLoader } from './loader/middlewares'
import { routerLoader } from './loader/router'
import { routerSchemaLoader } from './loader/router-schema'
import { serviceLoader } from './loader/service'
import { createLogger } from './logger'
import { useMiddlewares } from './middlewares'
import { getRootOptions } from './options'
import { mergeOptions } from './options/define'
import { importModule } from './utils/imports'
import { findAvailablePort } from './utils/port'

export interface ElpisState extends Application.DefaultState {

}

interface ElpisRequest extends Application.Request {
  body: Record<string, unknown>
}

export interface ElpisContext extends Application.Context {
  request: ElpisRequest
}

interface Middlewares {
  [key: string]: any
}

interface Controller {
  [key: string]: ReturnType<Parameters<typeof defineController>[0]> | Controller
}

interface Service {
  [key: string]: ReturnType<Parameters<typeof defineService>[0]> | Service
}

export interface ElpisApp extends Omit<Koa<ElpisState, ElpisContext>, 'env'> {

  // 中间件
  // 注意：Koa 内部有 middleware 属性，注意 s
  middlewares: Middlewares

  routerSchema: RouterSchema

  controller: Controller

  service: Service

  options: ElpisOptions

  logger: Logger

  router: KoaRouter
}

export async function createApp(startOptions: Options = {}) {
  const options = mergeOptions(await getRootOptions(), startOptions)

  const logger = createLogger({
    title: 'Elpis',
    debug: options.debug,
  })

  logger.debug('options', options)

  const app = new Koa() as unknown as ElpisApp
  if (!app) {
    logger.error('实例化 Koa 失败')
    return null
  }

  app.options = options
  app.logger = logger

  // ------------------------------------------------------------
  // 加载中间件
  // ------------------------------------------------------------

  await extendLoader(app)

  await Promise.all([
    middlewaresLoader(app),
    routerSchemaLoader(app),
  ])

  await serviceLoader(app)
  await controllerLoader(app)

  // ------------------------------------------------------------
  // 根级中间件
  // ------------------------------------------------------------
  const { serverDir } = options
  const rootMiddleware = await importModule('middleware', serverDir)

  if (rootMiddleware) {
    rootMiddleware.default(app)
  }

  useMiddlewares(app)

  // ------------------------------------------------------------
  // 加载路由
  // ------------------------------------------------------------
  await routerLoader(app)

  return app
}

export async function startServer(app: ElpisApp) {
  const { logger } = app
  try {
    const { server: options } = app.options

    if (options.dynamicPort) {
      const port = await findAvailablePort(options.port)
      if (!port) {
        logger.error('没有找到可用的端口')
        return null
      }
      options.port = port
    }

    return app.listen(options.port, options.host, () => {
      logger.success(`🎉 Server is running on ${options.url}`)
    })
  }
  catch (e) {
    logger.error('开启服务失败', e)
    return null
  }
}

export async function start(startOptions: Options = {}) {
  const app = await createApp(startOptions)

  if (!app) {
    return null
  }

  const server = await startServer(app)

  if (!server) {
    return null
  }

  return {
    app,
    server,
  }
}

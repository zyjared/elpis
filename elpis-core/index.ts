import type { ElpisApp, ElpisStartOptions } from './types'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import Koa from 'koa'
import { env } from './env'
import { configLoader } from './loader/config'
import { controllerLoader } from './loader/controller'
import { extendLoader } from './loader/extend'
import { middlewaresLoader } from './loader/middlewares'
import { routerLoader } from './loader/router'
import { routerSchemaLoader } from './loader/router-schema'
import { serviceLoader } from './loader/service'

function log(name: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('---', `[${name}]`, ...args, '---')
}

const {
//   sep, // 兼容不同操作系统的路径分隔符
  resolve,
} = path

export default {
  /**
   * 启动项目
   */
  async start(options: ElpisStartOptions = {}) {
    const {
      baseDir = process.cwd(),
      businessDir = './app',
    } = options

    const basePath = resolve(baseDir)
    const businessPath = resolve(basePath, businessDir)

    const app = new Koa() as unknown as ElpisApp
    app.options = options
    app.env = env
    log('start', 'env is', env.mode)

    app.baseDir = basePath
    app.businessDir = businessPath

    // ------------------------------------------------------------
    // 加载中间件
    // ------------------------------------------------------------

    await Promise.all([
      middlewaresLoader(app),
      routerSchemaLoader(app),
      serviceLoader(app),
      configLoader(app),
    ])

    await controllerLoader(app)

    // 单独加载
    await extendLoader(app)

    // 全局中间件
    try {
      const ext = app.env.prod ? 'js' : 'ts'
      const modulePath = resolve(app.businessDir, `middleware.${ext}`)

      if (fs.existsSync(modulePath)) {
        const moduleUrl = new URL(`file://${modulePath}`).href
        const module = await import(moduleUrl)
        module.default(app)
      }
    }
    catch (error) {
      console.error(error)
    }

    // 单独加载，router 参数需要完整的 app
    await routerLoader(app)

    try {
      const port = process.env.PORT || 3000
      const host = process.env.IP || 'localhost'
      app.use(async (ctx, next) => {
        ctx.render('index')
        await next()
      })
      app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server is running on http://${host}:${port}`)
      })
    }
    catch (e) {
      console.error(e)
    }
  },
}

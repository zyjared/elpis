import type { ElpisApp } from './types'
import path from 'node:path'
import process from 'node:process'
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

interface StartOptions {
  /**
   * 基础路径
   *
   * @default process.cwd()
   */
  baseDir?: string
  /**
   * 业务文件路径
   *
   * @default './app'
   */
  businessDir?: string
}

export default {
  /**
   * 启动项目
   */
  async start(options: StartOptions = {}) {
    const {
      baseDir = process.cwd(),
      businessDir = './app',
    } = options

    const basePath = resolve(baseDir)
    const businessPath = resolve(basePath, businessDir)
    // console.log(baseDirPath, businessDirPath)

    const app = new Koa() as unknown as ElpisApp
    app.env = env
    log('start', 'env is production', env.prod)

    app.baseDir = basePath
    app.businessDir = businessPath

    // ------------------------------------------------------------
    // 加载中间件
    // ------------------------------------------------------------

    await middlewaresLoader(app)
    log('start', 'load middleware done')

    routerSchemaLoader(app)
    log('start', 'load router schema done')

    controllerLoader(app)
    log('start', 'load controller done')

    serviceLoader(app)
    log('start', 'load service done')

    configLoader(app)
    log('start', 'load config done')

    extendLoader(app)
    log('start', 'load extend done')

    routerLoader(app)
    log('start', 'load router done')

    try {
      const port = process.env.PORT || 3000
      const host = process.env.IP || '0.0.0.0'
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

import type { Server } from 'node:http'
import type { ElpisApp } from './types'
import type { ElpisStartOptions } from './types/options'
import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
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

export class Elpis {
  server: Server | null = null
  app: ElpisApp | null = null
  options: Required<ElpisStartOptions> = {
    baseDir: process.cwd(),
    serverDir: './server',
    appDir: './app',
    publicDir: './public',
    onDev: () => {},
  }

  serverInfo: {
    port: number
    host: string
    url: string
  }

  constructor() {
    this.serverInfo = {
      port: 3000,
      host: '127.0.0.1',
      url: 'http://127.0.0.1:3000',
    }
  }

  /**
   * 配置挂载到 app 上
   */
  private mountOptions(options: ElpisStartOptions) {
    const {
      baseDir,
      serverDir,
      appDir,
      publicDir,
      onDev,
    } = {
      ...this.options,
      ...options,
    }

    const basePath = resolve(baseDir)

    this.options = {
      baseDir,
      serverDir: resolve(basePath, serverDir),
      appDir: resolve(basePath, appDir),
      publicDir: resolve(basePath, publicDir),
      onDev,
    }
  }

  /**
   * 启动项目
   */
  async start(options: ElpisStartOptions = {}) {
    this.mountOptions(options)

    const app = new Koa() as unknown as ElpisApp
    this.app = app
    app.env = env
    app.options = this.options

    // ------------------------------------------------------------
    // 加载中间件
    // ------------------------------------------------------------
    if (app.env.dev) {
      await this.options.onDev?.(app)
    }

    await Promise.all([
      middlewaresLoader(app),
      routerSchemaLoader(app),
      configLoader(app),
      extendLoader(app),
    ])

    await serviceLoader(app)
    await controllerLoader(app)

    // 单独加载

    // 全局中间件
    try {
      const { serverDir } = this.options

      const ext = app.env.prod ? 'js' : 'ts'
      const modulePath = resolve(serverDir, `middleware.${ext}`)

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
      let port = Number(process.env.PORT) || this.serverInfo.port
      const host = process.env.IP || this.serverInfo.host

      port = await this.findAvailablePort(port)

      this.serverInfo.port = port
      this.serverInfo.host = host
      this.serverInfo.url = `http://${host}:${port}`

      //   app.use(async (ctx, next) => {
      //     ctx.render('index')
      //     await next()
      //   })

      this.server = app.listen(port, host, () => {
        if (app.env.prod) {
        // eslint-disable-next-line no-console
          console.clear()
        }
        else {
          // eslint-disable-next-line no-console
          console.table(app.options)
        }

        // eslint-disable-next-line no-console
        console.log(`Server is running on ${this.serverInfo.url}`)
      })
    }
    catch (e) {
      console.error(e)
    }

    return this
  }

  async close() {
    const server = this.server
    if (!server)
      return

    return new Promise((resolve) => {
      server.close((err) => {
        if (err) {
          console.error(err)
          resolve(false)
        }
        else {
          this.app = null
          this.server = null
          resolve(true)
        }
      })
    })
  }

  private async isPortAvailable(port: number): Promise<boolean> {
    try {
      if (process.platform === 'win32') {
        const { stdout } = await execa('netstat', ['-an'])
        return !stdout.includes(`:${port}`)
      }
      else {
        const { stdout } = await execa('lsof', ['-i', `:${port}`])
        return !stdout.trim()
      }
    }
    catch {
      return true
    }
  }

  private async findAvailablePort(startPort: number, maxAttempts: number = 100): Promise<number> {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i
      if (await this.isPortAvailable(port)) {
        return port
      }
    }
    throw new Error(`没有找到可用的端口，范围：${startPort}-${startPort + maxAttempts}`)
  }
}

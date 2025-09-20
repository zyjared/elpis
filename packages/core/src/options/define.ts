import { join, resolve } from 'node:path'
import process from 'node:process'

export interface Options {
  /**
   * 基础路径
   *
   * @default process.cwd()
   */
  baseDir?: string

  /**
   * 后端文件夹
   *
   * @default './server'
   */
  serverDir?: string

  /**
   * 前端文件夹
   *
   * @default './app'
   */
  appDir?: string

  /**
   * 静态资源
   *
   * @default './assets'
   */
  assetsDir?: string

  server?: {
    port?: number
    host?: string
    url?: string

    /**
     * 是否动态更换 port
     *
     * @default false
     */
    dynamicPort?: boolean
  }

  debug?: boolean
}

export type ElpisOptions = Required<Options> & { server: Required<Options['server']> }

export function mergeOptions(elpisOptions: ElpisOptions, options: Options) {
  const final = {
    ...elpisOptions,
    ...options,
    server: {
      ...elpisOptions.server,
      ...options.server,
    },
  }

  const baseDir = resolve(final.baseDir)
  const serverDir = resolve(baseDir, final.serverDir)
  const appDir = resolve(baseDir, final.appDir)
  const assetsDir = resolve(baseDir, final.assetsDir)

  return {
    ...final,
    baseDir,
    serverDir,
    appDir,
    assetsDir,
    server: {
      ...final.server,
      url: `http://${final.server.host}:${final.server.port}`,
    },
  }
}

export async function defineElpisOptions(
  options: Options | ((ctx: { mode: 'development' | 'production' }) => PromiseLike<Options>),
) {
  const defaultOptions = {
    baseDir: process.cwd(),
    serverDir: './server',
    appDir: './app',
    assetsDir: './assets',
    server: {
      port: 3000,
      host: '127.0.0.1',
      url: 'http://127.0.0.1:3000',
      dynamicPort: false,
    },
    debug: false,
  }

  const opts = typeof options === 'function'
    ? await options({ mode: process.env.NODE_ENV as 'development' | 'production' })
    : options

  return mergeOptions(defaultOptions, opts)
}

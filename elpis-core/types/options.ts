import type { ElpisApp } from '.'

export interface ElpisStartOptions {
  /**
   * 基础路径
   *
   * @default process.cwd()
   */
  baseDir?: string

  /**
   * 后端路径
   *
   * @default './server'
   */
  serverDir?: string

  /**
   * 前端路径
   *
   * @default './app'
   */
  appDir?: string

  /**
   * 静态资源路径
   *
   * @default './public'
   */
  publicDir?: string

  /**
   * 开发时回调
   */
  onDev?: (app: ElpisApp) => Promise<void> | void
}

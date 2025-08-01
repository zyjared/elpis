import type Koa from 'koa'

export interface ElpisState extends Omit<Koa.DefaultState, 'middleware'> {
}

export interface Env {
  dev: boolean
  prod: boolean
  beta: boolean
  mode: 'development' | 'beta' | 'production'
  alias: 'dev' | 'beta' | 'prod'
}

interface Middlewares {
  [key: string]: any
}

interface RouterSchema {
  [key: string]: any
}

interface Controller {
  [key: string]: any
}

interface Service {
  [key: string]: any
}

interface Config {
  [key: string]: any
}

interface BaseElpisApp extends Omit<Koa, 'env'> {
  env: Env

  baseDir: string
  businessDir: string

  // 中间件
  // 注意：Koa 内部有 middleware 属性，注意 s
  middlewares: Middlewares

  routerSchema: RouterSchema

  controller: Controller

  service: Service

  config: Config

}

// 拓展 app 的属性
type Extend = {
  // TODO: 待确定返回值
  [K in Exclude<string, keyof BaseElpisApp>]?: (app: ElpisApp) => any
}

export type ElpisApp = Extend & BaseElpisApp

// ------------------------------------------------------------
// 启动参数
// ------------------------------------------------------------

export interface ElpisStartOptions {
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

import type KoaRouter from '@koa/router'
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
// Loader 类型定义
// ------------------------------------------------------------

/**
 * Router 模块导出类型
 * 用于 app/router/ 目录下的文件
 */
export type RouterModule = (app: ElpisApp, router: KoaRouter) => void

/**
 * Controller 模块导出类型
 * 用于 app/controller/ 目录下的文件
 */
export type ControllerModule = (app: ElpisApp) => new () => any

/**
 * Service 模块导出类型
 * 用于 app/service/ 目录下的文件
 */
export type ServiceModule = (app: ElpisApp) => new () => any

/**
 * Middleware 模块导出类型
 * 用于 app/middleware/ 目录下的文件
 */
export type MiddlewareModule = (app: ElpisApp) => any

/**
 * RouterSchema 模块导出类型
 * 用于 app/router-schema/ 目录下的文件
 */
export type RouterSchemaModule = (app: ElpisApp) => any

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

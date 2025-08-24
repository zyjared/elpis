import type KoaRouter from '@koa/router'
import type Koa from 'koa'
import type { ElpisContext } from './context'
import type { ExtendElpisApp } from './extend'
import type { ElpisStartOptions } from './options'
import type { ElpisState } from './state'

export type { ElpisContext, ElpisStartOptions, ElpisState }

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

interface BaseElpisApp extends Omit<Koa<ElpisState, ElpisContext>, 'env'> {
  env: Env

  // 中间件
  // 注意：Koa 内部有 middleware 属性，注意 s
  middlewares: Middlewares

  routerSchema: RouterSchema

  controller: Controller

  service: Service

  config: Config

  options: Required<ElpisStartOptions>

}

export type ElpisApp = ExtendElpisApp & BaseElpisApp

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
export type MiddlewareModule = (app: ElpisApp) => (ctx: ElpisContext, next: () => Promise<void>) => Promise<void>

/**
 * RouterSchema 模块导出类型
 * 用于 app/router-schema/ 目录下的文件
 */
export type RouterSchemaModule = Record<string, any>

/**
 * ExtendModule 模块导出类型
 * 用于 app/extend/ 目录下的文件
 */
export type ExtendModule = (app: ElpisApp) => any

import type Koa from 'koa'

export interface ElpisState extends Omit<Koa.DefaultState, 'middleware'> {
}

export interface Env {
  dev: boolean
  prod: boolean
  mode: string
}

interface Middlewares {
  [key: string]: any
}

export interface ElpisApp extends Omit<Koa, 'env'> {
  env: Env

  baseDir: string
  businessDir: string

  // 中间件
  // 注意：Koa 内部有 middleware 属性，注意 s
  middlewares: Middlewares
}

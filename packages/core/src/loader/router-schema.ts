import type { SomeJSONSchema } from 'ajv/dist/types/json-schema'
import type { ElpisApp } from '../app'
import { resolve } from 'node:path'
import fs from 'fs-extra'

import glob from 'tiny-glob'

export type JSONSchema = Omit<SomeJSONSchema, 'required'> & Partial<Pick<SomeJSONSchema, 'required'>>
export type RequestSchema = Partial<Record<'query' | 'body' | 'params' | 'header', JSONSchema>>
export type MethodSchema = Partial<Record<'get' | 'post' | 'put' | 'delete' | 'patch', RequestSchema>>
export type RouterSchema = Record<string, MethodSchema>

export function defineRouterSchema(schema: RouterSchema | ((app: ElpisApp) => RouterSchema)) {
  return schema
}

/**
 * json-schema & ajv 对 api 规则进行约束，配合 api-params-verify 中间件使用
 *
 * @example
 * ```txt
 * app/router-schema/**.js
 *
 * output:
 * app.routerSchema = {
 *     ${api1}: ${jsonSchema},
 * }
 * ```
 */
export async function routerSchemaLoader(app: ElpisApp) {
  const { serverDir } = app.options
  const logger = app.logger.child('loader:router-schema')

  let routerSchema: ElpisApp['routerSchema'] = {}

  const routerSchemaPath = resolve(serverDir, 'router-schema')

  if (!fs.existsSync(routerSchemaPath)) {
    app.routerSchema = routerSchema
    return
  }

  const ext = '{js,mjs,ts}'
  const filterList = await glob(
    `**/*.${ext}`,
    {
      cwd: routerSchemaPath,
      filesOnly: true,
    },
  )

  for (const file of filterList) {
    const modulePath = resolve(routerSchemaPath, file)
    const moduleUrl = new URL(`file://${modulePath}`).href

    try {
      const module = await import(moduleUrl)
      routerSchema = {
        ...routerSchema,
        // 这要求 router-schema 是默认导出一个 json-schema
        ...(typeof module.default === 'function' ? module.default(app) : module.default),
      }
      logger.debug(`${file} 加载成功`)
    }
    catch (error) {
      logger.error(`Failed to load router schema from ${modulePath}:`, error)
    }
  }

  app.routerSchema = routerSchema
}

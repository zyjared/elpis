import type { ElpisApp } from '../types'
import { resolve } from 'node:path'
import fs from 'fs-extra'
import glob from 'tiny-glob'

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

  let routerSchema: ElpisApp['routerSchema'] = {}

  const routerSchemaPath = resolve(serverDir, 'router-schema')

  if (!fs.existsSync(routerSchemaPath)) {
    app.routerSchema = routerSchema
    return
  }

  const ext = app.env.prod ? 'js' : '{ts,js}'
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
        ...module.default,
      }
    }
    catch (error) {
      console.error(`Failed to load router schema from ${modulePath}:`, error)
    }
  }

  app.routerSchema = routerSchema
}

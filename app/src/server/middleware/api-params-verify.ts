import type { ElpisApp } from '@elpis/core'
import type { ValidateFunction } from 'ajv'
import type Koa from 'koa'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv()
addFormats(ajv)

export default function (app: ElpisApp): Koa.Middleware {
  // @see https://json-schema.org/understanding-json-schema/reference/schema#schema
  // 使用 Draft 7 的元架构，因为 AJV 8.x 默认支持 Draft 7
  const $schema = 'http://json-schema.org/draft-07/schema#'

  return async (ctx, next) => {
    const { query, headers, body } = ctx.request as any
    const { params, path } = ctx

    const method = ctx.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch'

    const schema = app.routerSchema[path]?.[method]

    // 不需要校验
    if (!schema) {
      return await next()
    }

    // app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`)
    // app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`)
    // app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`)
    // app.logger.info(`[${method} ${path}] headers: ${JSON.stringify(headers)}`)

    let valid = true

    // ajv 校验器
    let validate: ValidateFunction | undefined

    const validationTargets = [
      {
        key: 'headers',
        value: headers,
      },
      {
        key: 'query',
        value: query,
      },
      {
        key: 'params',
        value: params,
      },
      {
        key: 'body',
        value: body,
      },
    ] as const

    for (const target of validationTargets) {
      const key = target.key
      if (valid && target.value && schema[key]) {
        schema[key].$schema = $schema
        validate = ajv.compile(schema[key])
        valid = validate(target.value)
      }

      if (!valid) {
        ctx.status = 200
        ctx.body = {
          success: false,
          message: `request validate failed: ${JSON.stringify(validate?.errors)}`,
          code: 442,
        }
        return
      }
    }

    await next()
  }
}

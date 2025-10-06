/* eslint-disable ts/ban-ts-comment */
import type { ElpisApp } from '@elpis/core'
import path from 'node:path'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import logger from 'koa-logger'
import koaStatic from 'koa-static'
// import pug from 'pug'

export default async function (app: ElpisApp) {
  // 允许跨域
  app.use(cors())

  // 模板
  const { baseDir } = app.options

  // 静态文件
  app.use(koaStatic(path.join(baseDir, 'public')))

  // 模板引擎
  //   app.use(async (ctx, next) => {
  //     ctx.render = (template: string, data = {}) => {
  //       const templatePath = template.startsWith('/')
  //         ? path.join(serverDir, `${template.slice(1)}.pug`)
  //         : path.join(serverDir, 'views', `${template}.pug`)

  //       ctx.type = 'text/html'

  //       if (!fs.existsSync(templatePath)) {
  //         ctx.throw(404, 'template not found')
  //       }

  //       ctx.body = pug.renderFile(templatePath, data)
  //     }
  //     await next()
  //   })

  //  解析 ctx.body
  app.use(bodyParser({
    jsonLimit: '10mb',
    enableTypes: ['json', 'form', 'text'],
  }))

  // 日志
  app.use(logger())

  // 错误处理
  // @ts-expect-error
  app.use(app.middlewares.errorHandler)

  //  签名合法性校验
  // @ts-expect-error
  app.use(app.middlewares.apiSignVerify)

  //  API 参数校验
  // @ts-expect-error
  app.use(app.middlewares.apiParamsVerify)
}

import type { ElpisApp } from '../elpis-core/types'
import path from 'node:path'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import fs from 'fs-extra'
import logger from 'koa-logger'
import koaStatic from 'koa-static'
import pug from 'pug'

export default function (app: ElpisApp) {
  const { env } = app

  // 允许跨域
  app.use(cors())

  // 模板
  const businessDir = app.businessDir

  // 静态文件
  app.use(koaStatic(path.join(businessDir, 'public')))

  // 模板引擎
  app.use(async (ctx, next) => {
    ctx.render = (template: string, data = {}) => {
      if (env.prod) {
        const templatePath = path.join(app.pagesDir, `${template}.pug`)
        ctx.type = 'text/html'

        if (!fs.existsSync(templatePath)) {
          ctx.throw(404, 'template not found')
        }

        ctx.body = pug.renderFile(templatePath, data)
      }
    }
    await next()
  })

  //  解析 ctx.body
  app.use(bodyParser({
    jsonLimit: '10mb',
    enableTypes: ['json', 'form', 'text'],
  }))

  // 日志
  app.use(logger())

  // 错误处理
  app.use(app.middlewares.errorHandler)

  //  签名合法性校验
  app.use(app.middlewares.apiSignVerify)

  //  API 参数校验
  app.use(app.middlewares.apiParamsVerify)
}

import type { ElpisApp } from '../elpis-core/types'
import path from 'node:path'
import fs from 'fs-extra'
import pug from 'pug'

export default function (app: ElpisApp) {
  // 模板
  const businessDir = app.businessDir

  app.use(async (ctx, next) => {
    ctx.render = (template: string, data = {}) => {
      const templatePath = path.join(businessDir, 'views', `${template}.pug`)
      ctx.type = 'text/html'

      ctx.body = fs.existsSync(templatePath)
        ? pug.renderFile(templatePath, data)
        : 'Elpis template not found'
    }
    await next()
  })
}

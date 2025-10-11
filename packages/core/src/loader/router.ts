import type { ElpisApp } from '../app'
import path, { resolve } from 'node:path'
import KoaRouter from '@koa/router'
import fs from 'fs-extra'
import glob from 'tiny-glob'

export function defineRouter(router: (app: ElpisApp, router: KoaRouter) => void) {
  return router
}

/**
 * router loader
 *
 * 解析所有 app/router 目录下的文件，并挂载到 app 上
 */
export async function routerLoader(app: ElpisApp) {
  const { serverDir } = app.options
  const logger = app.logger.child('loader:router')

  const router = new KoaRouter()
  app.router = router

  // router 路径
  const routerPath = resolve(serverDir, 'router')

  if (!fs.existsSync(routerPath)) {
    app.use(router.routes())
    app.use(router.allowedMethods())
    return
  }

  // 实例化 KoaRouter

  // 注册所有路由
  const ext = '{js,mjs,ts}'
  const filterList = await glob(
    `**/*.${ext}`,
    {
      cwd: routerPath,
      filesOnly: true,
    },
  )

  const moduleList = await Promise.all(filterList.map(async (file) => {
    const modulePath = resolve(routerPath, file)
    try {
      const moduleUrl = new URL(`file://${modulePath}`).href
      const module = await import(moduleUrl)
      return {
        name: file,
        module: module.default,
        file: modulePath,
        success: true,
      }
    }
    catch (error) {
      return {
        name: file,
        module: null,
        file: modulePath,
        success: false,
        error,
      }
    }
  }))

  for (const module of moduleList) {
    try {
      if (module.success) {
        // export default (app: ElpisApp, router: KoaRouter) => {
        //    router.get('**/**', ...)
        // }
        module.module(app, router)
        logger.debug(`${path.basename(module.file)} 加载成功`)
      }
      else {
        logger.error(`${module.file}`, module.error)
      }
    }
    catch (error) {
      logger.error(`${module.file}`, error)
    }
  }

  //  路由注册到 app 上
  app.use(router.routes())
  app.use(router.allowedMethods())
}

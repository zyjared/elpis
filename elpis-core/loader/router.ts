import type { ElpisApp } from '../types'
import { resolve } from 'node:path'
import KoaRouter from '@koa/router'
import fs from 'fs-extra'
import glob from 'tiny-glob'

/**
 * router loader
 *
 * 解析所有 app/router 目录下的文件，并挂载到 app 上
 */
export async function routerLoader(app: ElpisApp) {
  const { serverDir } = app.options

  // router 路径
  const routerPath = resolve(serverDir, 'router')

  if (!fs.existsSync(routerPath)) {
    return
  }

  // 实例化 KoaRouter
  const router = new KoaRouter()

  // 注册所有路由
  const ext = app.env.prod ? 'js' : '{ts,js}'
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
      }
      else {
        console.error(`Failed to load router from ${module.file}:`, module.error)
      }
    }
    catch (error) {
      console.error(`Failed to load router from ${module.file}:`, error)
    }
  }

  // 路由兜底（健壮性）
  router.get('(.*)', async (ctx, _next) => {
    ctx.status = 404
    ctx.body = {
      error: 'Not Found',
      message: 'The requested resource was not found',
      path: ctx.path,
      timestamp: new Date().toISOString(),
    }
  })

  //  路由注册到 app 上
  app.use(router.routes())
  app.use(router.allowedMethods())
}

import type { ElpisApp } from '../types'
import { resolve, sep } from 'node:path'
import fs from 'fs-extra'
import glob from 'tiny-glob'

/**
 * middleware loader
 *
 * 加载所有 middleware，可通过 'app.middleware.${目录}.${文件}' 获取
 *
 * @example
 * ```txt
 * app/middleware/
 * ├── custom-module/
 * |   └── custom-middleware.ts  --> app.middleware.customModule.customMiddleware
 * └── user/
 *     └── user-middleware.ts    --> app.middleware.user.userMiddleware
 * ```
 */
export async function middlewaresLoader(app: ElpisApp) {
  // 为 app 添加 middlewares 属性
  const middlewares: ElpisApp['middlewares'] = {}
  app.middlewares = middlewares

  // 遍历 app/middleware 目录下的所有文件
  const middlewarePath = resolve(app.businessDir, 'middleware')

  // 如果目录不存在，tiny-glob 会报错
  if (!fs.existsSync(middlewarePath))
    return

  const ext = app.env.prod ? 'js' : '{ts,js}'
  const filterList = await glob(
    `**/*.${ext}`,
    {
      cwd: middlewarePath,
      filesOnly: true,
    },
  )

  // 准备并行导入的任务
  const importTasks = filterList.map(async (file) => {
    try {
      // 提取文件名称
      // 统一 '-’ 或 '_' 为驼峰式
      // custom-module/custom-middleware.ts  --> customModule.customMiddleware
      // curtom_module/curtom_middleware.ts  --> curtomModule.curtomMiddleware
      const name = file
        .replace(new RegExp(`\\.${ext}$`), '') // 移除文件扩展名
        .replace(/[-_][a-z]/g, s => s.at(1)?.toUpperCase() || '')

      // 使用绝对路径导入模块
      const modulePath = resolve(middlewarePath, file)

      // 使用 file:// 协议确保跨平台兼容性
      const moduleUrl = new URL(`file://${modulePath}`).href

      const module = await import(moduleUrl)

      return {
        name,
        module,
        file,
        success: true,
      }
    }
    catch (error) {
      return {
        name: '',
        module: null,
        file,
        success: false,
        error,
      }
    }
  })

  // 并行执行所有导入任务
  const results = await Promise.all(importTasks)

  // 处理导入结果
  for (const result of results) {
    if (!result.success) {
      console.error(`Failed to load middleware from ${result.file}:`, result.error)
      continue
    }

    const { name, module, file } = result

    let tempMiddlewares = middlewares
    const names = name.split(sep)

    for (let i = 0; i < names.length; i++) {
      const k = names[i]

      if (i === names.length - 1) {
        // 这要求 middleware 是默认导出
        if (module.default && typeof module.default === 'function') {
          tempMiddlewares[k] = module.default(app)
        }
        else if (module.default) {
          console.error(`Middleware ${file} 必须默认导出函数`)
        }
        else {
          console.error(`Middleware ${file} 必须使用默认导出`)
        }
        break
      }

      // 确保 tempMiddlewares[k] 存在
      if (!tempMiddlewares[k]) {
        tempMiddlewares[k] = {}
      }
      tempMiddlewares = tempMiddlewares[k]
    }
  }
}

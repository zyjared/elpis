import type { ElpisApp } from '../app'

import { resolve } from 'node:path'
import fs from 'fs-extra'
import glob from 'tiny-glob'

export function defineExtend(extend: (app: ElpisApp) => any) {
  return extend
}

/**
 * extend loader
 *
 * 加载所有 extend，挂在到 app 上
 *
 * @example
 * ```txt
 * app/extend/
 *     └── user-extend.ts    --> app.extend.userExtend
 * ```
 */
export async function extendLoader(app: ElpisApp) {
  const { serverDir } = app.options
  const logger = app.logger.child('loader:extend')

  // 遍历 app/extend 目录下的所有文件
  const extendPath = resolve(serverDir, 'extend')

  // 如果目录不存在，tiny-glob 会报错
  if (!fs.existsSync(extendPath)) {
    logger.debug('extendPath not found')
    return
  }

  const ext = '{js,mjs,ts}'
  const filterList = await glob(
    `./*.${ext}`,
    {
      cwd: extendPath,
      filesOnly: true,
    },
  )

  // 准备并行导入的任务
  const importTasks = filterList.map(async (file) => {
    try {
      // 提取文件名称
      // 统一 '-’ 或 '_' 为驼峰式
      // custom-module/custom-extend.ts  --> customModule.customExtend
      // curtom_module/curtom_extend.ts  --> curtomModule.curtomExtend
      const name = file
        .replace(/\.(ts|js)$/, '') // 移除文件扩展名
        .replace(/[-_][a-z]/g, s => s.at(1)?.toUpperCase() || '')

      // 如果 name 在 app 中，不应该加载
      if (Object.hasOwn(app, name)) {
        throw new Error(`Extend ${name} 已经存在`)
      }

      // 使用绝对路径导入模块
      const modulePath = resolve(extendPath, file)

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
      logger.error(result.file, result.error)
      continue
    }

    const { name, module, file } = result

    try {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      app[name] = module.default(app)
      logger.debug(`${file} 加载成功`)
    }
    catch (error) {
      logger.error(file, error)
    }
  }
}

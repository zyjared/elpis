import type { ElpisApp } from '../types'
import { resolve, sep } from 'node:path'
import fs from 'fs-extra'
import glob from 'tiny-glob'

/**
 * controller loader
 *
 * 加载所有 controller，可通过 'app.controller.${目录}.${文件}' 获取
 *
 * @example
 * ```txt
 * app/controller/
 * ├── custom-module/
 * |   └── custom-controller.ts  --> app.controller.customModule.customController
 * └── user/
 *     └── user-controller.ts    --> app.controller.user.userController
 * ```
 */
export async function controllerLoader(app: ElpisApp) {
  // 为 app 添加 controller 属性
  const controller: ElpisApp['controller'] = {}
  app.controller = controller

  // 遍历 app/controller 目录下的所有文件
  const controllerPath = resolve(app.businessDir, 'controller')

  // 如果目录不存在，tiny-glob 会报错
  if (!fs.existsSync(controllerPath))
    return

  const ext = app.env.prod ? 'js' : '{ts,js}'
  const filterList = await glob(
    `**/*.${ext}`,
    {
      cwd: controllerPath,
      filesOnly: true,
    },
  )

  // 准备并行导入的任务
  const importTasks = filterList.map(async (file) => {
    try {
      // 提取文件名称
      // 统一 '-’ 或 '_' 为驼峰式
      // custom-module/custom-controller.ts  --> customModule.customController
      // curtom_module/curtom_controller.ts  --> curtomModule.curtomController
      const name = file
        .replace(new RegExp(`\\.${ext}$`), '') // 移除文件扩展名
        .replace(/[-_][a-z]/g, s => s.at(1)?.toUpperCase() || '')

      // 使用绝对路径导入模块
      const modulePath = resolve(controllerPath, file)

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
      console.error(`Failed to load controller from ${result.file}:`, result.error)
      continue
    }

    const { name, module, file } = result

    let tempController = controller
    const names = name.split(sep)

    for (let i = 0; i < names.length; i++) {
      const k = names[i]

      if (i === names.length - 1) {
        // 这要求 controller 是默认导出函数，且返回一个类
        if (module.default && typeof module.default === 'function') {
          const _class = module.default(app)
          tempController[k] = new _class()
        }
        else if (module.default) {
          console.error(`Controller ${file} 必须默认导出函数，且返回一个类`)
        }
        else {
          console.error(`Controller ${file} 必须使用默认导出`)
        }
        break
      }

      // 确保 tempController[k] 存在
      if (!tempController[k]) {
        tempController[k] = {}
      }
      tempController = tempController[k]
    }
  }
}

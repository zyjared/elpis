import type { ElpisApp } from './app'
import path from 'node:path'
import fs from 'fs-extra'
import glob from 'tiny-glob'

export class TypeGenerator {
  app: ElpisApp

  cwd: string
  filename = 'elpis-auto-types.d.ts'
  logger: ElpisApp['logger']

  constructor(app: ElpisApp) {
    this.app = app
    this.cwd = path.join(app.options.serverDir)
    this.logger = app.logger.child('types')
  }

  toAttrName(name: string) {
    return name
      .replace(/\.(m?[tj]s)$/, '')
      .replace(/[-_][a-z]/g, s => s.at(1)?.toUpperCase() || '')
  }

  toTypeName(name: string, prefix: string = 'I') {
    const n = this.toAttrName(name)
    return prefix + n.charAt(0).toUpperCase() + n.slice(1)
  }

  /**
   * 转换为相对于 cwd 的路径，并使用 / 分割
   */
  toPath(filePath: string) {
    const relativePath = path.relative(this.cwd, filePath)
    const result = relativePath.split(path.sep).join('/')
    return result.startsWith('.') ? result : `./${result}`
  }

  /**
   * 将指定目录下的所有文件中的默认导出都收集起来
   */
  async collectDefaultExports(
    dir: string,
    options: {
      /**
       * 类型前缀
       */
      prefix?: string
    } = {},
  ) {
    const { prefix = 'I' } = options

    const cwd = path.join(this.cwd, dir)
    this.logger.debug(`扫描目录: ${cwd}`)

    if (!fs.existsSync(cwd)) {
      this.logger.error(`${cwd} 目录不存在`)
      return null
    }

    const ext = '{js,mjs,ts}'
    const files = await glob(
      `**/*.${ext}`,
      {
        cwd: path.join(this.cwd, dir),
        filesOnly: true,
      },
    )

    this.logger.debug(`找到文件: ${files.length} 个`, files)

    const result: Record<string, any> = {}
    for (const file of files) {
      let temp = result
      const names = file.split(path.sep)
      if (names.length === 0) {
        continue
      }
      const ancestors = names.length > 1 ? names.slice(0, -1) : []
      const current = names.at(-1) as string // 一定存在
      for (const name of ancestors) {
        const attrName = this.toAttrName(name)
        temp = temp[attrName] ?? (temp[attrName] = {})
      }
      const attr = this.toAttrName(current)
      const fullFilePath = path.join(cwd, file)

      const dirName = path.resolve(file, '..') === this.cwd ? '' : path.dirname(file)
      const moduleName = !dirName ? '' : dirName.split(path.sep).join('.')
      const typeName = this.toTypeName(
        path.basename(file).replace(/\.(m?[tj]s)$/, ''),
        prefix + moduleName,
      )
      const relativePath = this.toPath(fullFilePath)

      this.logger.debug(`处理文件: ${file} -> ${attr} (${typeName})`)

      temp[attr] = {
        type: typeName,
        path: relativePath,
      }
    }

    this.logger.debug(`收集结果:`, result)
    return result
  }

  generateImpl(types: Record<string, any>) {
    return Object.entries(types).map(([_key, value]) => {
      return `import type ${value.type} from '${value.path}'`
    }).join('\n')
  }

  /**
   * 生成接口定义
   * @param types 类型映射
   * @param _interfaceName 接口名称（未使用，保持接口一致性）
   */
  generateInterface(types: Record<string, any>, _interfaceName: string) {
    const entries = this.generateInterfaceEntries(types)
    return `{
${entries}
}`
  }

  /**
   * 生成接口条目
   */
  generateInterfaceEntries(types: Record<string, any>, indent: string = '  '): string {
    const entries: string[] = []

    for (const [key, value] of Object.entries(types)) {
      if (typeof value === 'object' && value !== null && 'type' in value) {
        // 这是一个具体的类型
        entries.push(`${indent}${key}: InstanceType<typeof ${value.type}>`)
      }
      else if (typeof value === 'object' && value !== null) {
        // 这是一个嵌套对象
        const nestedEntries = this.generateInterfaceEntries(value, `${indent}  `)
        entries.push(`${indent}${key}: {\n${nestedEntries}\n${indent}}`)
      }
    }

    // 如果没有条目，返回一个注释
    if (entries.length === 0) {
      return `${indent}// 暂无类型定义`
    }

    return entries.join('\n')
  }

  /**
   * 生成带内联导入的接口条目
   */
  generateInterfaceEntriesWithImports(types: Record<string, any>, indent: string = '  '): string {
    const entries: string[] = []

    for (const [key, value] of Object.entries(types)) {
      if (typeof value === 'object' && value !== null && 'type' in value) {
        // 这是一个具体的类型，直接使用 import 类型
        const importPath = value.path.replace(/\.ts$/, '')
        entries.push(`${indent}${key}: InstanceType<typeof import('${importPath}').default>`)
      }
      else if (typeof value === 'object' && value !== null) {
        // 这是一个嵌套对象
        const nestedEntries = this.generateInterfaceEntriesWithImports(value, `${indent}  `)
        entries.push(`${indent}${key}: {\n${nestedEntries}\n${indent}}`)
      }
    }

    // 如果没有条目，返回一个注释
    if (entries.length === 0) {
      return `${indent}// 暂无类型定义`
    }

    return entries.join('\n')
  }

  /**
   * 生成完整的类型定义文件
   */
  generateTypeDefinition(serviceTypes: Record<string, any> | null, controllerTypes: Record<string, any> | null): string {
    const serviceEntries = this.generateInterfaceEntriesWithImports(serviceTypes || {})
    const controllerEntries = this.generateInterfaceEntriesWithImports(controllerTypes || {})

    return `// 自动生成的 ElpisApp 类型定义
// 请勿手动修改此文件

/// <reference types="@elpis/core" />

interface ElpisService {
${serviceEntries}
}

interface ElpisController {
${controllerEntries}
}

declare module '@elpis/core' {
  interface ElpisApp {
    service: ElpisService
    controller: ElpisController
  }
}

export {}
`
  }

  /**
   * 生成导入语句
   */
  generateImports(serviceTypes: Record<string, any> | null, controllerTypes: Record<string, any> | null): string {
    const imports: string[] = []

    if (serviceTypes) {
      const serviceImports = this.generateTypeImports(serviceTypes)
      imports.push(...serviceImports)
    }

    if (controllerTypes) {
      const controllerImports = this.generateTypeImports(controllerTypes)
      imports.push(...controllerImports)
    }

    return imports.length > 0 ? imports.sort().join('\n') : ''
  }

  /**
   * 生成类型导入语句
   */
  generateTypeImports(types: Record<string, any>): string[] {
    const imports: string[] = []

    const collectImports = (obj: Record<string, any>, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && 'type' in value) {
          // 移除 .ts 扩展名，ES 模块不需要
          const importPath = value.path.replace(/\.ts$/, '')
          imports.push(`import type ${value.type} from '${importPath}'`)
        }
        else if (typeof value === 'object' && value !== null) {
          collectImports(value, `${prefix}${key}.`)
        }
      }
    }

    collectImports(types)

    // 按类型名称排序
    return imports.sort()
  }

  async generate() {
    this.logger.debug(`开始生成类型，cwd: ${this.cwd}`)

    const serviceTypes = await this.collectDefaultExports('service', { prefix: 'IService' })
    const controllerTypes = await this.collectDefaultExports('controller', { prefix: 'IController' })

    this.logger.debug('Service 类型收集结果:', serviceTypes)
    this.logger.debug('Controller 类型收集结果:', controllerTypes)

    // 检查类型收集是否成功
    if (!serviceTypes) {
      this.logger.warn('Service 类型收集失败')
    }
    if (!controllerTypes) {
      this.logger.warn('Controller 类型收集失败')
    }

    const typeContent = this.generateTypeDefinition(serviceTypes, controllerTypes)

    const outputPath = path.join(this.cwd, this.filename)
    await fs.writeFile(outputPath, typeContent)

    this.logger.success(`类型定义已生成: ${outputPath}`)

    return {
      serviceTypes,
      controllerTypes,
      outputPath,
      typeContent,
    }
  }
}

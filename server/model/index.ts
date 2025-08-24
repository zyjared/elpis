import type { ElpisApp } from '../../elpis-core/types'
import path from 'node:path'
import * as R from 'ramda'
import glob from 'tiny-glob'

interface BaseMenuItem {
  /**
   * 菜单唯一描述
   */
  key: string

  /**
   * 菜单名称
   */
  name: string
}

interface IframeConfig {
  path: string
}

export interface SchemaConfigSchema<T> {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array' | 'null'
  properties: Record<string, SchemaConfigSchema<T> & T>
}

interface SchemaProperty {
  label: string
  type: string
}

export interface SchemaConfig {
  api: string
  schema: SchemaConfigSchema<SchemaProperty>
  tableConfig: Record<string, unknown>
  searchConfig: Record<string, unknown>
  components: Record<string, unknown>
}

interface CustomConfig {
  path: string
}

interface SiderConfig {
  menu: Array<ModuleMenuItem<'iframe'> | ModuleMenuItem<'schema'> | ModuleMenuItem<'custom'>>
}

interface ModuleConfigMap {
  iframe: IframeConfig
  schema: SchemaConfig
  custom: CustomConfig
  sider: SiderConfig
}

export type ModuleMenuItem<T extends keyof ModuleConfigMap> = BaseMenuItem & {
  menuType?: 'module'
  moduleType?: T
} & {
  [K in `${T}Config`]?: ModuleConfigMap[T]
}

type AnyModuleMenuItem
            = | ModuleMenuItem<'iframe'>
              | ModuleMenuItem<'schema'>
              | ModuleMenuItem<'custom'>
              | ModuleMenuItem<'sider'>

interface GroupMenuItem extends BaseMenuItem {
  menuType: 'group'
  subMenu: Array<AnyModuleMenuItem | GroupMenuItem>
}

export interface DashboardModel {
  key?: string
  modelKey?: string
  mode: 'dashboard'
  name: string
  desc?: string
  homePage?: string
  menu: Array<GroupMenuItem | AnyModuleMenuItem>
}

export interface DtoModel {
  key: string
  name: string
  desc: string
  modelKey?: string
}

export interface DtoProject extends DtoModel {
  homePage: string
}

export interface DtoModelItem {
  model: DtoModel
  project: Record<string, DtoProject>
}

export interface ModelItem {
  model: DashboardModel
  project: Record<string, DashboardModel>
}

function mergeModel<T = any>(model: T, project: T): T {
  // https://ramdajs.com/docs/#mergeDeepWith
  // 该函数提供了深度遍历，但具体返回值需要自行定义
  return R.mergeDeepWith(
    (l, r) => {
      if (Array.isArray(l) && Array.isArray(r)) {
        const result: T[] = []
        // 覆盖与继承
        l.forEach((lItem) => {
          const rItem = r.find(rItem => rItem.key === lItem.key)
          result.push(rItem ? mergeModel(lItem, rItem) : lItem)
        })
        // 新增
        r.forEach((rItem) => {
          if (!l.find(lItem => lItem.key === rItem.key)) {
            result.push(rItem)
          }
        })
        return result
      }

      // r 没有该值时，使用 l 的值
      return r === undefined ? l : r
    },
    model,
    project,
  )
}

/**
 * 解析 model 配置，并返回组织且继承后的数据结构
 *
 * [
 *   {
 *      model: ${model}
 *      project: {
 *        proj1: ${proj1},
 *        proj2: ${proj2},
 *      }
 *   }
 * ]
 */
export async function loadModel(app: ElpisApp) {
  const { serverDir } = app.options

  const modelList: ModelItem[] = []

  const modelPath = path.resolve(serverDir, './model')
  const files = await glob('**/*.{ts,js}', { cwd: modelPath })

  for (const file of files) {
    if (file.includes('index.'))
      continue

    const type = file.includes('project') ? 'project' : 'model'

    const url = new URL(`file://${path.resolve(modelPath, file)}`)
    const module = await import(url.href)

    if (type === 'project') {
      const matched = file.match(/[\\/]?(.*?)[\\/]project[\\/](.*?)\.[jt]s/)
      const moduleKey = matched?.[1]
      const projectKey = matched?.[2]

      if (!moduleKey || !projectKey) {
        console.error(`[model] moduleKey || projectKey 生成失败 ${file}`)
        continue
      }

      let modelItem = modelList.find(item => item.model.key === moduleKey)
      if (!modelItem) {
        modelItem = {
          project: {},
        } as ModelItem
        modelList.push(modelItem)
      }

      modelItem.project[projectKey] = module.default
      modelItem.project[projectKey].key = projectKey
      modelItem.project[projectKey].modelKey = moduleKey
    }

    if (type === 'model') {
      const moduleKey = file.match(/[\\/]?(.*?)[\\/]model\.[jt]s/)?.[1]
      if (!moduleKey) {
        console.error(`[model] moduleKey 生成失败 ${file}`)
        continue
      }
      let modelItem = modelList.find(item => item.model.key === moduleKey)
      if (!modelItem) {
        modelItem = {
          project: {},
        } as ModelItem
        modelList.push(modelItem)
      }

      modelItem.model = module.default
      modelItem.model.key = moduleKey
    }
  }

  // project 继承 model
  for (const modelItem of modelList) {
    const projKeys = Object.keys(modelItem.project)
    projKeys.forEach((projKey) => {
      modelItem.project[projKey] = mergeModel(modelItem.model, modelItem.project[projKey])
    })
  }

  return modelList
}

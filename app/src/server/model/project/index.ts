import type { ElpisApp } from '@elpis/core'
import type { Data, ProjectConfig, ProjectGroupConfig } from '@/types'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as R from 'ramda'

import glob from 'tiny-glob'

function mergeProject<T = any>(origin: T, project: T): T {
  // https://ramdajs.com/docs/#mergeDeepWith
  // 该函数提供了深度遍历，但具体返回值需要自行定义
  return R.mergeDeepWith(
    (l, r) => {
      if (Array.isArray(l) && Array.isArray(r)) {
        const result: T[] = []
        // 覆盖与继承
        l.forEach((lItem) => {
          const rItem = r.find(rItem => rItem.id === lItem.id)
          result.push(
            rItem
              ? mergeProject(lItem, rItem)
              : lItem,
          )
        })
        // 新增
        r.forEach((rItem) => {
          if (!l.find(lItem => lItem.id === rItem.id)) {
            result.push(rItem)
          }
        })
        return result
      }

      // r 没有该值时，使用 l 的值
      return r === undefined ? l : r
    },
    origin,
    project,
  )
}

type Projects = Data<ProjectConfig>
type Group = Omit<ProjectGroupConfig, 'projects'> & {
  projects: Projects
  shared: Partial<ProjectConfig>
}

export function defineProject(project: ProjectConfig) {
  return project
}

export function defineGroup(group: ProjectGroupConfig) {
  return group
}

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

function createGroup(groupId: string): Group {
  return {
    id: groupId,
    title: '默认分类标题',
    description: '默认分类描述',
    projects: {},
    shared: {
      id: 'default',
      groupId,
      title: '默认标题',
      description: '默认描述',
      menu: [],
    },
  }
}

/**
 * 解析 model 配置，并返回组织且继承后的数据结构
 */
export async function loadProjects(app: ElpisApp) {
  const { serverDir } = app.options

  const groups: Data<Group> = {}

  const groupPath = path.resolve(serverDir, 'model', path.basename(__dirname))

  const files = await glob('**/*.{ts,js}', { cwd: groupPath })

  for (const file of files) {
    if (/^index\.m?[tj]s/.test(file))
      continue

    const type = file.includes('project') ? 'project' : 'index'

    const url = new URL(`file://${path.resolve(groupPath, file)}`)
    const config = (await import(url.href))?.default as ProjectGroupConfig | Group

    if (!config) {
      console.error(`[model] 配置文件 ${file} 导入失败`)
      continue
    }

    if (type === 'project') {
      const matched = file.match(/[\\/]?(.*?)[\\/]project[\\/](.*?)\.[jt]s/)
      const groupId = matched?.[1]
      const projectId = matched?.[2]

      if (!groupId || !projectId) {
        console.error(`[model] groupId || projectId 生成失败 ${file}`)
        continue
      }

      let group = groups[groupId]
      if (!group) {
        group = createGroup(groupId)
      }

      const project: ProjectConfig = {
        groupId,
        ...config,
      } as ProjectConfig

      group.projects[projectId] = project
    }

    if (type === 'index') {
      const groupId = file.match(/[\\/]?(.*?)[\\/]index\.[jt]s/)?.[1]
      if (!groupId) {
        console.error(`[project] groupId 生成失败 ${file}`)
        continue
      }
      let group = groups[groupId]
      if (!group) {
        group = createGroup(groupId)
      }
      group = {
        ...group,
        ...config,
      } as Group

      groups[groupId] = group
    }
  }

  const result: ProjectGroupConfig[] = []

  Object.values(groups).forEach((group) => {
    const { shared, projects, ...rest } = group
    const mergedProjects = Object.values(group.projects).map((project) => {
      return mergeProject(shared, project)
    }, []) as ProjectConfig[]

    result.push({
      ...rest,
      projects: mergedProjects,
    })
  })

  return result
}

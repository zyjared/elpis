import type { MenuItem, ProjectConfig } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { curl } from '@/utils/curl'

/**
 * 模型下的项目列表
 */
export const useProjectStore = defineStore('project', () => {
  const projects = shallowRef<ProjectConfig[]>([])

  const currentId = ref<string | null>(null)

  const project = computed(() => {
    return projects.value.find(project => project.id === currentId.value)
  })

  const menu = computed(() => project.value?.menu)

  function setProjects(value: ProjectConfig[]) {
    projects.value = value
  }

  async function loadProjects(modelId?: string) {
    const res = await curl<ProjectConfig[]>({
      url: '/api/project/list',
      method: 'get',
      data: modelId ? { model_id: modelId } : {},
    })

    if (!res.success) {
      return
    }

    setProjects(res.data)
  }

  /**
   * 可以传递 id 或 index
   */
  function setCurrent(value: string | number | null) {
    if (value === null) {
      value = 0
    }

    currentId.value = typeof value === 'number'
      ? projects.value[value]?.id || null
      : projects.value.find(project => project.id === value)?.id || null
  }

  // 预留菜单接口
  async function loadMenu(projectId: string) {
    setCurrent(projectId)
  }

  function findMenuItem(idPath: string[], onGet?: (item?: MenuItem) => void, items = menu.value): MenuItem | undefined {
    const [id, ...ids] = idPath

    const item = items?.find(menu => menu.id === id)

    onGet?.(item)

    return ids.length && item?.children?.length
      ? findMenuItem(ids, onGet, item.children)
      : item
  }

  // 统一跳转
  function resolveMenuItemPath(keyPath: string[], query?: Record<string, string>) {
    const item = findMenuItem(keyPath)

    if (!item) {
      throw new Error('路径生成错误')
    }
    const search = new URLSearchParams(location.search)

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        search.set(key, value)
      })
    }

    const model = item.type === 'route'
      ? item.path
      : `/${item.type}`

    switch (item.type) {
      case 'iframe':
        search.set('url', item.url)
        break
      case 'sidebar':
        search.set('sidebar', item.id)
        break
      default:
        break
    }

    return `${model}?${search.toString()}`
  }

  return {
    projects,
    currentId,
    project,
    menu,
    setProjects,
    setCurrent,
    loadProjects,
    loadMenu,
    findMenuItem,
    resolveMenuItemPath,
  }
})

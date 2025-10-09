import type { MenuItem, ProjectConfig } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { curl } from '@/utils/curl'

/**
 * 模型下的项目列表
 *
 * 根据 route 的 query 中的 model_id 和 project_id 来获取当前项目。
 *
 * 可以手动控制改变，但路由变化时会自动更新。
 */
export const useProjectStore = defineStore('project', () => {
  const route = useRoute()

  // ------------------------------------
  // 模型
  // ------------------------------------

  // 当前项目 id
  const modelId = ref<string | undefined>()

  function setModelId(value?: string) {
    modelId.value = value
  }

  // ------------------------------------
  // 项目
  // ------------------------------------

  // 当前项目 id
  const projectId = ref<string | undefined>()

  const projects = shallowRef<ProjectConfig[]>([])

  // 当前项目
  const project = computed(() => {
    if (!projectId.value) {
      return null
    }
    return projects.value.find(project => project.id === projectId.value)
  })

  function setProjects(value: ProjectConfig[]) {
    projects.value = value
  }

  /**
   * 载入项目列表。
   *
   * 如果不定义 model_id，则使用当前路由中的 model_id。
   */
  async function loadProjects(model_id?: string) {
    model_id && setModelId(model_id)
    const model = model_id || modelId.value

    const res = await curl<ProjectConfig[]>({
      url: '/api/project/list',
      method: 'get',
      data: model ? { model } : {},
    })

    if (!res.success) {
      return
    }

    setProjects(res.data || [])
  }

  /**
   * 可以传递 id 或 index
   */
  function setProjectId(value: string | number | null) {
    if (value === null) {
      value = 0
    }

    projectId.value = typeof value === 'number'
      ? projects.value[value]?.id
      : projects.value.find(project => project.id === value)?.id
  }

  // ------------------------------------
  // 菜单
  // ------------------------------------

  // 当前菜单的 id 路径
  const menuIdPath = ref<string[]>([])

  function setMenuIdPath(value: string[]) {
    menuIdPath.value = value
  }

  const menu = computed(() => project.value?.menu || [])

  /**
   * 预留的获取菜单接口。
   *
   * 如果不定义 project_id，则使用当前路由中的 project_id。
   */
  async function loadMenu(project_id?: string) {
    // 当前的 menu 会根据路由自动更新
    if (!project_id) {
      return menu.value
    }

    setProjectId(project_id)
  }

  /**
   * 根据 id 路径查找菜单项。
   */
  function findMenuItem(idPath: string[], onGet?: null | ((item?: MenuItem) => void), items = menu.value): MenuItem | undefined {
    const [id, ...ids] = idPath

    const item = items?.find(menu => menu.id === id)

    onGet?.(item)

    return ids.length && item?.children?.length
      ? findMenuItem(ids, onGet, item.children)
      : item
  }

  /**
   * 根据 id 路径获得路由路径
   */
  function resolveMenuPath(keyPath: string[], query?: Record<string, string>, items = menu.value) {
    const item = findMenuItem(keyPath, null, items)

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

  const currentMenuItem = computed(() => findMenuItem(menuIdPath.value, null, menu.value))

  if (!import.meta.env.SSR) {
    watch(() => route.query, async (query) => {
      const { model, project } = query as Record<string, string>

      if (model !== modelId.value) {
        setModelId(model)
        await loadProjects()
      }

      if (project !== projectId.value) {
        setProjectId(project || 0)
      }
    }, { immediate: true })
  }

  return {
    modelId,
    setModelId,

    // 关联项目
    projects,
    setProjects,
    loadProjects,

    // 当前项目
    projectId,
    project,
    setProjectId,

    // 菜单
    menu,
    currentMenuItem,
    menuIdPath,
    setMenuIdPath,
    loadMenu,
    findMenuItem,
    resolveMenuPath,
  }
})

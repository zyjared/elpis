import type { ProjectConfig } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { curl } from '@/utils/curl'

export const useProjectStore = defineStore('project', () => {
  const projects = shallowRef<ProjectConfig[]>([])

  const currentId = ref<string | null>(null)

  const project = computed(() => {
    return projects.value.find(project => project.id === currentId.value)
  })

  const menu = computed(() => {
    return project.value?.menu
  })

  function setProjects(value: ProjectConfig[]) {
    projects.value = value
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

  async function loadProjects(groupId?: string) {
    const res = await curl<ProjectConfig[]>({
      url: '/api/project/list',
      method: 'get',
      data: groupId ? { group_id: groupId } : {},
    })

    if (!res.success) {
      return
    }

    setProjects(res.data)
  }

  return {
    projects,
    currentId,
    project,
    menu,
    setProjects,
    setCurrent,
    loadProjects,
  }
})

import type { DtoProject } from '~/types/model'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const projectList = ref<DtoProject[]>([])

  function setProjectList(projects: DtoProject[]) {
    projectList.value = projects
  }

  return {
    projectList,
    setProjectList,
  }
})

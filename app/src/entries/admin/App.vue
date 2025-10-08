<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Avatar from '@/assets/avatar.jpg?url'
import { Layout, MenuItem } from '@/components/dashboard'

import { useProjectStore } from '@/store/project'
import '@/style.css'

const projectStore = useProjectStore()
const { menu, projects, project } = storeToRefs(projectStore)
const { loadProjects, setCurrent } = projectStore

// 相关的应用

onMounted(async () => {
  await loadProjects()
  setCurrent(0)
})

const username = 'admin'
const settings = computed(() => {
  const showProjects = projects.value && projects.value.length
  return [
    showProjects && {
      id: 'projects',
      title: '项目',
      children: projects.value,
    },
    {
      id: 'logout',
      title: '退出',
    },
  ]
})

function handleSelect(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log('app menu', key, keyPath)
}
</script>

<template>
  <Layout :menu="menu" @select-menu="handleSelect">
    <template #menu>
      <el-sub-menu
        v-if="project"
        :index="project.id"
        :item="project"
      >
        <template #title>
          <span class="flex items-center">
            <img :src="Avatar" alt="avatar" class="w-8 rounded-full mr-2">
            <span class="">
              {{ username }}
            </span>
          </span>
        </template>
        <MenuItem v-for="s in settings" :key="s.id" :item="s" />
      </el-sub-menu>
    </template>

    <RouterView />
  </Layout>
</template>

<style scoped>
/* .el-icon--right {
  transition: transform 0.3s ease-in-out;
}

.el-dropdown span[aria-expanded='true'] .el-icon--right {
  transform: rotate(180deg);
} */
</style>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, useTemplateRef } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Avatar from '@/assets/avatar.jpg?url'

import { Layout, MenuItem } from '@/components/dashboard'
import { useProjectStore } from '@/store/project'
import '@/style.css'

const router = useRouter()
const route = useRoute()

const projectStore = useProjectStore()
const { menu, projects } = storeToRefs(projectStore)
const { loadProjects, loadMenu, setCurrent, resolveMenuItemPath } = projectStore

const layoutRef = useTemplateRef<InstanceType<typeof Layout>>('layoutRef')

onBeforeMount(async () => {
  const query = route.query

  const modelId = query.model_id as string
  const projectId = query.project_id as string

  await loadProjects(modelId)

  setCurrent(projectId || 0)
})

const username = 'admin'

// 头部右侧头像区作为更多设置菜单
enum SETTINGS_ID {
  SELF = '__settings',
  PROJECTS = '__projects',
  LOGOUT = '__logout',
}
const settings = computed(() => {
  const showProjects = projects.value && projects.value.length
  const project_id = route.query.project_id
  return [
    showProjects && {
      id: SETTINGS_ID.PROJECTS,
      title: '项目',
      children: projects.value.map(project => ({
        id: project.id,
        title: project.title,
        disabled: project.id === project_id,
      })),
    },
    {
      id: SETTINGS_ID.LOGOUT,
      title: '退出',
      onClick: () => {
        ElMessage({
          message: '假装退出',
          type: 'warning',
        })
      },
    },
  ].filter(Boolean)
})

async function handleSelect(key: string, keyPath: string[]) {
  const firstPath = keyPath[0]
  if (!firstPath) {
    throw new Error('菜单缺少 index 值')
  }

  // 非设置菜单
  const query = route.query
  if (firstPath !== SETTINGS_ID.SELF) {
    const url = resolveMenuItemPath(keyPath, {
      project_id: query.project_id as string,
      model_id: query.model_id as string,
    })
    router.push(url)
    return
  }

  const secondPath = keyPath[1]

  // 如果有 onClick，应该执行 onClick
  const item = settings.value.find(s => s.id === secondPath)
  if (item?.onClick) {
    item.onClick()
    return
  }

  // 菜单操作
  await loadMenu(key)
  await router.push({
    query: { ...query, project_id: key },
  })
  layoutRef.value?.updateActiveMenuIndex(menu.value[0]?.id)
}
</script>

<template>
  <Layout ref="layoutRef" :menu="menu" @select-menu="handleSelect">
    <template #menu>
      <el-sub-menu
        :index="SETTINGS_ID.SELF"
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

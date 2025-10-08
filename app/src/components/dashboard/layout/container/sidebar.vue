<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MenuItem } from '@/components/dashboard'
import { useProjectStore } from '@/store/project'

const route = useRoute()
const router = useRouter()

const projectStore = useProjectStore()
const { resolveMenuItemPath } = projectStore
const { menu } = storeToRefs(projectStore)

const asideMenu = computed(() => {
  const menuId = route.query.sidebar as string
  if (!menuId) {
    return []
  }
  const menuItem = menu.value?.find(item => item.id === menuId)

  if (!menuItem || menuItem.type !== 'sidebar') {
    return []
  }

  return menuItem?.menu || []
})

function handleSelect(key: string, keyPath: string[]) {
  const url = resolveMenuItemPath(keyPath, route.query as Record<string, string>, asideMenu.value)
  router.push(url)
}
</script>

<template>
  <el-container class="flex min-h-[calc(100vh-106px)]">
    <el-aside width="200px">
      <el-menu
        class="h-full"
        @select="handleSelect"
      >
        <MenuItem v-for="item in asideMenu" :key="item.id" :item="item" />
      </el-menu>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { DtoProject, ModelMenuItem } from '~/types/model'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/store/menu'
import { useProjectStore } from '@/store/project'
import { curl } from '~/shared/client/curl'
import SubMenu from './components/the-header/sub-menu/sub-menu.vue'
import TheHeader from './components/the-header/the-header.vue'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const projectStore = useProjectStore()

const activeKey = ref('')
const projectName = ref('')

watch(() => route.query, () => {
  activeKey.value = route.query?.key as string || ''
  const projKey = route.query?.proj_key as string || ''
  loadProject(projKey)
  loadProjectList()
})

async function loadProjectList() {
  const res = await curl<DtoProject[]>({
    url: '/api/project/project_list',
    method: 'get',
  })

  if (!res || !res.success || !res.data) {
    return
  }

  projectStore.setProjectList(res.data)
}

async function loadProject(projKey: string) {
  const res = await curl<DtoProject>({
    url: `/api/project?proj_key=${projKey}`,
    method: 'get',
  })

  if (!res || !res.success || !res.data) {
    return
  }

  const { name, menu } = res.data
  projectName.value = name
  menuStore.setMenuList(menu)
}

function findMenu(menuList: ModelMenuItem[], key: string): ModelMenuItem | null {
  for (const item of menuList) {
    if (item.key === key) {
      return item
    }
    if (item.menuType === 'group' && item.subMenu) {
      const menu = findMenu(item.subMenu, key)
      if (menu) {
        return menu
      }
    }
  }
  return null
}

function handleMenuSelect(key: string) {
  activeKey.value = key

  const menu = findMenu(menuStore.menuList, key)

  if (!menu || menu.menuType === 'group') {
    ElMessage.error('菜单不存在')
    return
  }

  const path = menu.moduleType === 'custom' ? menu.customConfig?.path : menu.moduleType

  if (!path) {
    ElMessage.error('路径错误')
    return
  }

  router.push({
    path: `/${path}`.replace(/\/+/g, '/'),
    query: {
      proj_key: route.query?.proj_key as string || '',
      key,
    },
  })
}
</script>

<template>
  <el-config-provider :locale="zhCn">
    <TheHeader :project-name="projectName">
      <template #menu>
        <el-menu
          :default-active="activeKey"
          class="el-menu-demo"
          :ellipsis="false"
          mode="horizontal"
          @select="handleMenuSelect"
        >
          <template v-for="menu in menuStore.menuList" :key="menu.key">
            <SubMenu v-if="menu.menuType === 'group'" :menu-item="menu" :index="menu.key" />
            <el-menu-item v-else :index="menu.key">
              {{ menu.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </template>
      <router-view />
    </TheHeader>
  </el-config-provider>
</template>

<style scoped>
</style>

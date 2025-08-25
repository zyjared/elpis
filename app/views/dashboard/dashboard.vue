<script setup lang="ts">
import type { DtoModelItem, DtoProject } from '~/types/model'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { onBeforeMount, ref } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/store/menu'
import { useProjectStore } from '@/store/project'
import { curl } from '~/shared/client/curl'
import SubMenu from './components/the-header/sub-menu/sub-menu.vue'
import TheHeader from './components/the-header/the-header.vue'

// const route = useRoute()
const menuStore = useMenuStore()
const projectStore = useProjectStore()

const activeKey = ref('')
const projectName = ref('')

onBeforeMount(() => {
  // const projKey = route.params
//   console.log(route)
})

loadProjectList()
loadProject()

async function loadProjectList() {
  const res = await curl<DtoModelItem[]>({
    url: '/api/project/project_list',
    // url: '/api/project/raw_model_list',
    method: 'get',
  })

  if (!res || !res.success || !res.data) {
    return
  }

  projectStore.setProjectList(res.data)
}

async function loadProject() {
  const res = await curl<DtoProject>({
    url: '/api/project?proj_key=pdd',
    method: 'get',
  })

  if (!res || !res.success || !res.data) {
    return
  }

  const { name, menu } = res.data
  projectName.value = name
  menuStore.setMenuList(menu)
}

function handleMenuSelect(key: string) {
  activeKey.value = key
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
    </TheHeader>
  </el-config-provider>
</template>

<style scoped>
</style>

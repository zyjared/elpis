<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref } from 'vue'
import { useMenuStore } from '@/store/menu'
import { useProjectStore } from '@/store/project'
import { curl } from '~/shared/client/curl'
import TheHeader from './components/the-header/the-header.vue'

const menuStore = useMenuStore()
const projectStore = useProjectStore()

const projectName = ref('')

loadProjectList()
loadProject()

async function loadProjectList() {
  const res = await curl({
    url: '/api/project/project_list',
    method: 'get',
  })

  if (!res || !res.success || !res.data) {
    return
  }

  projectStore.setProjectList(res.data)
}

async function loadProject() {
  const res = await curl({
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
</script>

<template>
  <el-config-provider :locale="zhCn">
    <TheHeader project-name="test" />
  </el-config-provider>
</template>

<style scoped>
</style>

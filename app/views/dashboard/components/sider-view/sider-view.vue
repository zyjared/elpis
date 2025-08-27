<script lang="ts" setup>
import type { ModelMenuItem } from '~/types/model'
import { ElMessage } from 'element-plus'
import { onBeforeMount, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '~/app/store/menu'
import SiderContainer from '~/app/widgets/sider-container/sider-container.vue'
import SubMenu from './sub-menu/sub-menu.vue'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const activeKey = ref('')
const menuList = shallowRef<ModelMenuItem[]>([])

function findCurrentMenu(menuList: ModelMenuItem[], key: string): ModelMenuItem[] | null | undefined {
  for (const item of menuList) {
    if (item.key === key) {
      if (item.menuType === 'group') {
        ElMessage.error('该菜单是 group 类型，无 sider 配置')
        return null
      }

      if (item.moduleType !== 'sider') {
        ElMessage.error('该菜单不是 sider 类型')
        return null
      }

      const { siderConfig } = item

      if (!siderConfig?.menu) {
        ElMessage.error('缺少 sider 配置')
        return null
      }

      return siderConfig?.menu
    }

    if (
      item.menuType === 'module'
      && item.moduleType === 'sider'
      && item.siderConfig?.menu
    ) {
      const result = findCurrentMenu(item.siderConfig?.menu, key)
      if (result) {
        return result
      }
    }
  }

  return null
}

onBeforeMount(() => {
  const key = route.query.key as string | undefined
  if (!key) {
    ElMessage.error('没有找到菜单 key')
  }
})

watch(() => menuStore.menuList, (menus) => {
  if (!menus || menus.length === 0) {
    return
  }

  const key = route.query.key as string | undefined
  if (!key) {
    ElMessage.error('没有找到菜单 key')
    return
  }

  const menuArray = findCurrentMenu(menus, key)
  if (!menuArray) {
    ElMessage.error(`未配置当前菜单的 sider 配置, key: ${key}`)
    return
  }

  menuList.value = menuArray
}, { immediate: true })

function onMenuSelect(key: string) {
  const projKey = route.query.proj_key as string
  router.replace(`/sider?proj_key=${projKey}&key=${key}`)
}
</script>

<template>
  <SiderContainer>
    <template #aside>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        mode="vertical"
        @select="onMenuSelect"
      >
        <template v-for="item in menuList" :key="item.key">
          <SubMenu :menu-item="item" />
        </template>
      </el-menu>
    </template>
    <router-view />
  </SiderContainer>
</template>

<style scoped>

</style>

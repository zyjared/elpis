<script lang="ts" setup>
import type { ModelMenuItem } from '~/types/model'
import { computed } from 'vue'

const props = defineProps<{
  menuItem: ModelMenuItem
}>()

const menu = computed(() => {
  const item = props.menuItem
  // eslint-disable-next-line no-console
  console.log('sider', item)
  if (item.menuType !== 'module') {
    return null
  }

  if (item.moduleType !== 'sider') {
    return null
  }

  const menu = item.siderConfig?.menu

  return !menu || menu.length === 0 ? null : menu
})
</script>

<template>
  <el-sub-menu v-if="menu" :index="props.menuItem.key">
    <template #title>
      <span>{{ props.menuItem.name }}</span>
    </template>
    <template v-for="item in menu" :key="item.key">
      <SubMenu v-if="item.menuType === 'group' && item.subMenu" :menu-item="item" />
      <el-menu-item v-else :index="item.key">
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="props.menuItem.key">
    <span>{{ props.menuItem.name }}</span>
  </el-menu-item>
</template>

<style scoped>

</style>

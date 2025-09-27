<script lang="ts" setup>
import type { ModelMenuItem } from '~/types/model'

const {
  menuItem,
} = defineProps<{
  menuItem: ModelMenuItem
}>()
</script>

<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>
      <span>{{ menuItem.name }}</span>
    </template>
    <template v-if="menuItem.menuType === 'group'">
      <div v-for="item in menuItem.subMenu" :key="item.key">
        <sub-menu v-if="item.menuType === 'group'" :menu-item="item" />
        <el-menu-item v-else :index="item.key">
          {{ item.name }}
        </el-menu-item>
      </div>
    </template>
  </el-sub-menu>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts" setup>
import type { MenuItem as Item } from './types'

interface Props {
  item: Item
}

const {
  item,
} = defineProps<Props>()
</script>

<template>
  <el-sub-menu v-if="item.children" :index="item.id" :disabled="item.disabled">
    <template #title>
      {{ item.title }}
    </template>
    <MenuItem v-for="child in item.children" :key="child.id" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.id" :disabled="item.disabled">
    {{ item.title }}
  </el-menu-item>
</template>

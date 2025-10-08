<script lang="ts" setup>
import type { MenuItem as Item } from './types'
import { computed } from 'vue'
import MenuItem from './menu-item.vue'

export interface Props {
  menu: Item[]
}

const {
  menu,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', key: string, keyPath: string[]): void
}>()

const modelCurrent = defineModel<string | null>('current')

const current = computed(() => modelCurrent.value || menu[0]?.id)

function handleSelect(key: string, keyPath: string[]) {
  modelCurrent.value = key
  emit('select', key, keyPath)
}
</script>

<template>
  <el-menu
    :default-active="current"
    class=""
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item>
      <slot name="before" />
    </el-menu-item>

    <MenuItem v-for="item in menu" :key="item.id" :item="item" />

    <slot name="after" />
  </el-menu>
</template>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-of-type(1) {
  margin-right: auto;
}
</style>

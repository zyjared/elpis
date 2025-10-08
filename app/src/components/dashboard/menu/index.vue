<script lang="ts" setup>
import type { MenuItem as Item } from './types'
import { ElMenu } from 'element-plus'
import { computed, useTemplateRef } from 'vue'
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

function findItem(keyPath: string[], items = menu): Item | undefined {
  const [id, ...ids] = keyPath
  const item = items.find(item => item.id === id)
  return ids.length && item?.children?.length
    ? findItem(ids, item.children)
    : item
}

function handleSelect(key: string, keyPath: string[]) {
  modelCurrent.value = key
  const item = findItem(keyPath)

  // 有自己的事件时，不执行 select 事件
  if (item?.onClick) {
    item.onClick(item)
    return
  }

  emit('select', key, keyPath)
}

const menuRef = useTemplateRef<InstanceType<typeof ElMenu>>('menuRef')

defineExpose({
  updateActiveIndex: (value: string) => {
    if (!menuRef.value) {
      return
    }
    (menuRef.value as any).updateActiveIndex(value)
  },
})
</script>

<template>
  <ElMenu
    ref="menuRef"
    :default-active="current"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <div class="mr-auto flex items-center">
      <slot name="before" />
    </div>

    <MenuItem v-for="item in menu" :key="item.id" :item="item" />

    <slot name="after" />
  </ElMenu>
</template>

<style scoped>
.el-menu {
    padding: 0 1rem;
}
</style>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

import Avatar from '@/assets/avatar.jpg?url'
import { Layout, MenuItem } from '@/components/dashboard'
import '@/style.css'

const username = 'admin'

// 头部右侧头像区作为更多设置菜单
enum SETTINGS_ID {
  SELF = '__settings',
  LOGOUT = '__logout',
}
const settings = computed(() => {
  return [
    {
      id: SETTINGS_ID.LOGOUT,
      title: '退出',
      onClick: () => {
        ElMessage({
          message: '假装退出',
          type: 'warning',
        })
      },
    },
  ]
})

async function handleSelect(key: string, keyPath: string[]) {
  const firstPath = keyPath[0]
  if (!firstPath) {
    throw new Error('菜单缺少 index 值')
  }

  if (firstPath !== SETTINGS_ID.SELF) {
    // eslint-disable-next-line no-console
    console.log('do nothing')
    return
  }

  const secondPath = keyPath[1]
  const item = settings.value.find(s => s.id === secondPath)
  if (item?.onClick) {
    item.onClick()
  }
}
</script>

<template>
  <Layout @select-menu="handleSelect">
    <template #menu>
      <el-sub-menu
        :index="SETTINGS_ID.SELF"
      >
        <template #title>
          <span class="flex items-center">
            <img :src="Avatar" alt="avatar" class="w-8 rounded-full mr-2">
            <span class="">
              {{ username }}
            </span>
          </span>
        </template>
        <MenuItem v-for="s in settings" :key="s.id" :item="s" />
      </el-sub-menu>
    </template>
    <RouterView />
  </Layout>
</template>

<style scoped>
/* .el-icon--right {
  transition: transform 0.3s ease-in-out;
}

.el-dropdown span[aria-expanded='true'] .el-icon--right {
  transform: rotate(180deg);
} */
</style>

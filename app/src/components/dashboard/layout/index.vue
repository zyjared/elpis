<script lang="ts" setup>
import type { ProjectConfig } from '@/types'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { useTemplateRef } from 'vue'
import ThemeMode from '@/components/mode/index.vue'
import Menu from '../menu/index.vue'

interface Props {
  title?: string
  userName?: string
  avatar?: string
  menu?: ProjectConfig['menu']
  defaultMenuItem?: string
}

const {
  title = 'Elpis',
  menu = [],
  defaultMenuItem = '',
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectMenu', key: string, keyPath: string[]): void
}>()

function handleSelectMenu(key: string, keyPath: string[]) {
  emit('selectMenu', key, keyPath)
}

const menuRef = useTemplateRef<InstanceType<typeof Menu>>('menuRef')

defineExpose({
  updateActiveMenuIndex: (value: string) => {
    if (!menuRef.value) {
      return
    }
    menuRef.value.updateActiveIndex(value)
  },
})

/**
 * 跳转倒主页
 */
function goHome() {
  if (location.pathname === '/') {
    return
  }
  location.assign('/')
}
</script>

<template>
  <el-config-provider :locale="zhCn">
    <el-container class="">
      <el-header>
        <Menu ref="menuRef" :menu="menu" :current="defaultMenuItem" @select="handleSelectMenu">
          <template #before>
            <el-row align="middle" class="cursor-pointer" @click="goHome">
              <img src="/logo.png" alt="logo" class="w-8 mr-2 rounded-full">
              <span>{{ title }}</span>
            </el-row>
          </template>
          <template #after>
            <slot name="menu" />
            <ThemeMode />
          </template>
        </Menu>
      </el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
.el-header {
    --el-header-padding: 0;
}
</style>

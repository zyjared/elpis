<script lang="ts" setup>
import type { ProjectConfig } from '@/types'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

import ThemeMode from '@/components/mode/index.vue'
import Menu from '../menu/index.vue'

interface Props {
  title?: string
  userName?: string
  avatar?: string
  menu?: ProjectConfig['menu']
}

const {
  title = 'Elpis',
  menu = [],
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectMenu', key: string, keyPath: string[]): void
}>()

function handleSelectMenu(key: string, keyPath: string[]) {
  emit('selectMenu', key, keyPath)
}
</script>

<template>
  <el-config-provider :locale="zhCn">
    <el-container class="">
      <el-header>
        <Menu :menu="menu" @select="handleSelectMenu">
          <template #before>
            <el-row align="middle">
              <img src="/logo.png" alt="logo" class="w-8 mr-2 rounded-full">
              <span>{{ title }}</span>
            </el-row>
          </template>
          <template #after>
            <slot name="menu" />
            <ThemeMode class="ml-4 mr-5" />
          </template>
        </Menu>
      </el-header>
      <el-main class="main">
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

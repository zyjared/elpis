<script lang="ts" setup>
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <span class="cursor-pointer flex items-center" @click="() => toggleDark()">
    <el-icon v-show="isDark" :size="24" class="text-2xl" color="#eeeeee"><Sunny /></el-icon>
    <el-icon v-show="!isDark" :size="24" class="text-2xl" color="#aaa"><Moon /></el-icon>
  </span>
</template>

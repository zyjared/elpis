<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import TheHeader from './components/the-header/the-header.vue'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <TheHeader />
  </el-config-provider>
</template>

<style scoped>
</style>

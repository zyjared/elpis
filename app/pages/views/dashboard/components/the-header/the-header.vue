<script setup lang="ts">
import HeaderContainer from '$widgets/header-container/header-container.vue'
</script>

<template>
  <HeaderContainer title="Dashboard">
    <template #menu>
      <el-menu>
        <el-menu-item index="1">
          <span>Dashboard</span>
        </el-menu-item>
      </el-menu>
    </template>
    <template #main>
      <slot name="main" />
    </template>
  </HeaderContainer>
</template>

<style scoped>
</style>

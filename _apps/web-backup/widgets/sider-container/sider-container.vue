<script setup lang="ts">

</script>

<template>
  <el-container class="sider-container">
    <el-aside width="200px" class="aside">
      <slot name="aside" />
    </el-aside>
    <el-main class="main">
      <slot />
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
</style>

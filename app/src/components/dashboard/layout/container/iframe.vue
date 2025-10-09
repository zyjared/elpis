<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const url = computed(() => {
  const p = route.query.url
  return !p || Array.isArray(p) ? null : p
})
</script>

<template>
  <div class="h-[calc(100vh-106px)] w-full flex items-center justify-center">
    <el-empty v-if="!url" />
    <iframe v-else :src="url" frameborder="0" class="w-full h-full" />
  </div>
</template>

<style scoped>

</style>

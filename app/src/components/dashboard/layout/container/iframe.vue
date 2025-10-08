<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const url = ref<string | undefined>()

const route = useRoute()

onMounted(() => {
  const paramUrl = route.query.url as string
  url.value = paramUrl || ''
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

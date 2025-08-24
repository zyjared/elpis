<script setup lang="ts">
import HeaderContainer from '@/widgets/header-container/header-container.vue'

const props = defineProps<{
  projectName: string
}>()
</script>

<template>
  <HeaderContainer title="Dashboard">
    <template #menu />
    <template #setting />
    <template #main />
  </HeaderContainer>
</template>

<style scoped>
</style>

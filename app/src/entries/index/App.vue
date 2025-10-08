<script setup lang="ts">
import { onMounted } from 'vue'

import { curl } from '../../utils/curl'
import '@/style.css'

onMounted(() => {
  curl({
    url: '/api/project/groups',
    method: 'GET',
  }).then((res) => {
    // eslint-disable-next-line no-console
    console.log(res)
  })
})
</script>

<template>
  <h1>
    Projects
    <a href="/view/admin">
      Admin
    </a>
  </h1>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

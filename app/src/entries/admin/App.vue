<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import vueLogo from '@/assets/vue.svg'
import HelloWorld from '@/components/HelloWorld.vue'

import '@/style.css'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo">
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img :src="vueLogo" class="logo vue" alt="Vue logo">
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />

  <div class="p-4 rounded flex gap-4 justify-center">
    <RouterLink to="/">
      Home
    </RouterLink>
    <RouterLink to="/about">
      About
    </RouterLink>
    <a href="/">
      Index
    </a>
  </div>
  <RouterView />
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

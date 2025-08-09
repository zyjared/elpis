<script setup lang="ts">
import { test } from '$pages/common/test'
import { ref } from 'vue'
// eslint-disable-next-line unused-imports/no-unused-vars
const a = ref(2)

test()
</script>

<template lang="pug">
h1 Page 2
p Welcome to Page 2
p {{ a }}
</template>

<style scoped>
h1 {
  color: blue;
}
</style>

<script setup lang="ts">
import { test } from '$pages/common/test'
import { ref } from 'vue'

test()

// eslint-disable-next-line unused-imports/no-unused-vars
const a = ref(1)
</script>

<template lang="pug">
h1 Page 1
p Welcome to Page 1
p {{ a }}
</template>

<style scoped>
h1 {
    color: red;
}

p {
    color: blue;
}
</style>

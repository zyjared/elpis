<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { curl } from '~/shared/client/curl'

const a = ref(2)

function getModelList() {
  curl({
    url: 'http://127.0.0.1:3000/api/project/model_list',
    method: 'get',
  }).then((res) => {
    // eslint-disable-next-line no-console
    console.log(res)
  })
}

getModelList()
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

<script setup lang="ts">
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import { onBeforeMount, ref, shallowRef } from 'vue'
import { curl } from '~/shared/client/curl'

const a = ref(1)
const data = shallowRef([])

// 热更新测试 - 修改这个值来测试热更新
const hotReloadTest = ref('热更新测试 1')

onBeforeMount(() => {
  curl({
    url: '/api/project/model_list',
    method: 'get',
  }).then((res) => {
    //
    data.value = res.data
  })
})
</script>

<template>
  <div>
    <!-- 热更新测试区域 -->
    <div style="padding: 20px; background: #f0f0f0; margin-bottom: 20px; border-radius: 8px;">
      <h3>{{ hotReloadTest }}</h3>
      <p>当前时间: {{ new Date().toLocaleTimeString() }}</p>
      <p>计数器: {{ a }}</p>
      <ElButton @click="a++">
        点击 +1
      </ElButton>
    </div>

    <h1>test</h1>
    <ElTable :data="data" style="width: 100%">
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  </div>
</template>

<style scoped>
h1 {
    color: red;
}

p {
    color: blue;
}

h3, h4 {
    color: green;
}
</style>

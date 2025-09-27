<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '~/app/store/menu'

const route = useRoute()
const menuStore = useMenuStore()

const path = ref('')
function setPath() {
  const { key, sider_key: siderKey } = route.query
  const k = (siderKey || key) as string | undefined
  if (!k) {
    return
  }
  const menuItem = menuStore.findIframeMenuItem(k)
  if (!menuItem) {
    return
  }
  path.value = menuItem.iframeConfig?.path || ''
}

watch(() => route.query, () => {
  setPath()
}, { immediate: true })
</script>

<template>
  <iframe
    :src="path"
    class="iframe-view"
  />
</template>

<style scoped>
.iframe-view {
  border:0;
  width: 100%;
  height: calc(100vh - 104px);
}
</style>

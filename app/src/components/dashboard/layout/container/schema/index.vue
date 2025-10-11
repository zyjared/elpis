<script setup lang="ts">
import { onMounted } from 'vue'
import { useSchema } from '@/components/dashboard/layout/container/schema/schema'
import SearchPanel from './search-panel.vue'
import TablePanel from './table-panel.vue'

const { schema } = useSchema()

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log(schema.value)
})
</script>

<template>
  <div>
    <SearchPanel class="mb-4" />
    <TablePanel />
  </div>
</template>

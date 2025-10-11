<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useSchema } from '@/components/dashboard/layout/container/schema/schema'
import SearchPanel from './search-panel.vue'
import TablePanel from './table-panel.vue'

const { schema } = useSchema()

const tableRef = useTemplateRef<InstanceType<typeof TablePanel>>('tableRef')

function reset() {
  tableRef.value?.reset()
}

function search(filters: Record<string, any>) {
  tableRef.value?.fetchData(filters, true)
}

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log(schema.value)
})
</script>

<template>
  <div>
    <SearchPanel class="mb-4" @search="search" @reset="reset" />
    <TablePanel ref="tableRef" />
  </div>
</template>

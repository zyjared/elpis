import { storeToRefs } from 'pinia'

import { computed } from 'vue'
import { useProjectStore } from '@/store/project'

export function useSchema() {
  const projectStore = useProjectStore()
  const { currentMenuItem } = storeToRefs(projectStore)

  const schema = computed(() => {
    if (!currentMenuItem.value || currentMenuItem.value.type !== 'schema') {
      return null
    }

    return currentMenuItem.value.schema
  })

  //   const table = computed(() => schema.value?.table)
  //   const search = computed(() => schema.value?.search)

  return {
    schema,
    // table,
    // search,
  }
}

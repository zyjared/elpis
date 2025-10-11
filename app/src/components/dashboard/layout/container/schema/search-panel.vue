<script setup lang="ts">
import type { SchemaSearch } from '@/types'
import { computed, reactive, watch } from 'vue'
import { useSchema } from './schema'

const emit = defineEmits(['search', 'reset'])

const { schema } = useSchema()

const search = computed(() => schema.value?.search)

const model = reactive({})

function resetModel(cols?: SchemaSearch['props']) {
  if (!cols)
    return

  const form = cols.reduce((res, cur) => {
    res[cur.prop] = cur.defaultValue
    return res
  }, {})

  Object.assign(model, form)
}

watch(search, (value) => {
  resetModel(value?.props)
}, { immediate: true })

async function handleSearch() {
  emit('search', model)
}

function handleReset() {
  resetModel(search.value?.props)
  emit('reset')
}
</script>

<template>
  <el-card>
    <el-form v-if="search" :model="search" inline>
      <el-form-item v-for="col in search.props" :key="col.prop" :label="col.label">
        <el-input v-if="col.type === 'input'" v-model="model[col.prop]" :placeholder="col.placeholder" />
        <el-select v-else-if="col.type === 'select'" v-model="model[col.prop]" :style="{ width: col.width || '120px' }" :placeholder="col.placeholder">
          <el-option
            v-for="opt in col.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-tag v-else type="danger">
          unknow
        </el-tag>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain @click="handleSearch">
          搜索
        </el-button>
        <el-button plain @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

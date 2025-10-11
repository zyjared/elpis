<script lang="ts" setup>
import type { Data } from '@/types'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, reactive, shallowRef, watch } from 'vue'
import { showDialog } from '@/components/dialog'
import { curl } from '@/utils/curl'
import { useSchema } from './schema'

const { schema } = useSchema()

const table = computed(() => schema.value?.table)
const buttons = computed(() => table.value?.buttons || {})

const data = shallowRef<Data[]>([])

const DEFAULT_PAGE = {
  pageSize: 10,
  page: 1,
}

const pagination = reactive({
  total: 0,
  ...DEFAULT_PAGE,
})

function resetPagination() {
  const { pageSize, page } = {
    ...DEFAULT_PAGE,
    ...schema.value?.table,
  }
  pagination.page = page
  pagination.pageSize = pageSize
  pagination.total = 0
}

function isInitPagination() {
  const { pageSize, page } = {
    ...DEFAULT_PAGE,
    ...schema.value?.table,
  }
  return pagination.page === page && pagination.pageSize === pageSize
}

const filters = shallowRef<Record<string, any>>({})

function setFilters(conditions: Record<string, any>) {
  filters.value = conditions
}

async function fetchData() {
  const api = table.value?.api
  if (!api) {
    ElMessage({
      message: '缺少 api',
      type: 'error',
    })
    return
  }

  const res = await curl({
    url: api,
    method: table.value.method || 'GET',
    data: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters.value,
    },
  })

  if (!res || !res.success) {
    ElMessage({
      message: 'table 请求错误',
      type: 'error',
    })
    return
  }

  pagination.total = res.metadata?.total || 0
  data.value = res.data
}

watch(schema, (newSchema) => {
  if (!newSchema?.table)
    return

  resetPagination()
  fetchData()
}, { immediate: true })

async function handleDelete(row: Data) {
  const button = buttons.value?.delete
  if (!button)
    return

  const { prop, promptProp } = button
  const prompt = row[promptProp || 'id']

  const confirm = await showDialog({
    message: `确定删除 ${prompt} 吗？`,
    type: 'warning',
  })

  if (!confirm)
    return

  const { api, method } = button

  const key = prop || 'id'
  const res = await curl({
    // 注意 https:// 两个斜杠不能删除
    // url: (`${api}/${row[key]}`).replace(/[^:]\/+$/, '/'),
    url: api,
    data: {
      [key]: row[key],
    },
    method: method || 'post',
  })

  if (!res || !res.success) {
    ElMessage({
      message: '删除失败',
      type: 'error',
    })
    return
  }

  ElMessage({
    message: `删除成功`,
    type: 'success',
  })

  fetchData()
}

async function handleEdit(row: Data) {
  const button = buttons.value?.edit
  if (!button)
    return

  // TODO: 编辑
  ElMessage({
    message: `编辑 ${row.name}`,
    type: 'info',
  })
}

function handleAdd() {
  // TODO: 新增
  ElMessage({
    message: '新增',
    type: 'success',
  })
}

defineExpose({
  fetchData: (filters: Record<string, any> = {}, reset?: boolean) => {
    setFilters(filters)
    if (reset && !isInitPagination()) {
      // 自动触发请求
      resetPagination()
      return
    }

    fetchData()
  },
  reset: () => {
    setFilters({})
    if (!isInitPagination()) {
      resetPagination()
      return
    }
    fetchData()
  },
})
</script>

<template>
  <el-card v-if="table">
    <div class="flex justify-end mb-4">
      <!-- outline -->
      <el-button v-if="buttons.add" type="primary" plain @click="handleAdd">
        <el-icon><Plus /></el-icon>
        <span>新增{{ buttons.add.name || '' }}</span>
      </el-button>
    </div>

    <el-table :data="data" v-bind="table.options">
      <el-table-column
        v-for="col in table.columns"
        :key="col.prop"
        v-bind="col"
      />

      <el-table-column v-if="buttons.edit || buttons.delete" v-slot="scope" label="操作" width="125">
        <div class="flex justify">
          <el-button v-if="buttons.edit" type="primary" text @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button v-if="buttons.delete" type="danger" text @click="handleDelete(scope.row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </el-table-column>
    </el-table>

    <div class="flex justify-end pt-4">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :pager-count="5"
        layout="prev, pager, next, ->"
        :total="pagination.total"
        prev-text="上一页"
        next-text="下一页"
        @change="fetchData"
      />
    </div>
  </el-card>
</template>

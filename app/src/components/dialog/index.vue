<script lang="ts" setup>
import type { DialogOptions } from './index'
import { Check, Close, InfoFilled, Warning } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElIcon } from 'element-plus'
import { computed, ref, shallowReactive } from 'vue'

const dialogVisible = ref(false)
const dialogOptions = shallowReactive<DialogOptions>({
  title: '',
  message: '',
  type: 'info',
  showCancel: false,
  confirmText: '确定',
  cancelText: '取消',
})

let resolve: ((value: boolean) => void) | null = null

async function showDialog(options: Partial<DialogOptions>) {
  Object.assign(dialogOptions, {
    title: '',
    message: '',
    type: 'info',
    showCancel: true,
    confirmText: '确定',
    cancelText: '取消',
    ...options,
  })

  dialogVisible.value = true

  const promise = new Promise<boolean>((res) => {
    resolve = res
  })

  return promise
}

async function hideDialog(confirm = false) {
  dialogVisible.value = false
  resolve?.(confirm)
  resolve = null
}

const typeTheme = computed(() => {
  const { color, title } = {
    success: { color: '#67c23a', title: '成功' },
    warning: { color: '#e6a23c', title: '警告' },
    error: { color: '#f56c6c', title: '错误' },
    info: { color: '#909399', title: '提示' },
  }[dialogOptions.type]

  return {
    color,
    title: title || '提示',
  }
})

function getConfirmButtonType(): 'primary' | 'success' | 'warning' | 'danger' {
  const typeMap = {
    success: 'success' as const,
    warning: 'warning' as const,
    error: 'danger' as const,
  }
  return typeMap[dialogOptions.type as keyof typeof typeMap] || 'primary'
}

defineExpose({
  showDialog,
  hideDialog,
})
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div class="flex items-center gap-2" :style="{ color: typeTheme.color }">
        <ElIcon>
          <Check v-if="dialogOptions.type === 'success'" />
          <Warning v-else-if="dialogOptions.type === 'warning'" />
          <Close v-else-if="dialogOptions.type === 'error'" />
          <InfoFilled v-else />
        </ElIcon>
        <span>{{ typeTheme.title }}</span>
      </div>
    </template>
    <p>{{ dialogOptions.message }}</p>
    <template #footer>
      <div class="flex justify-end gap-1">
        <ElButton
          v-if="dialogOptions.showCancel"
          @click="hideDialog(false)"
        >
          {{ dialogOptions.cancelText }}
        </ElButton>
        <ElButton
          :type="getConfirmButtonType()"
          @click="hideDialog(true)"
        >
          {{ dialogOptions.confirmText }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
</style>

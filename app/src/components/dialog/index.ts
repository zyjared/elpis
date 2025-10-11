import type { App } from 'vue'
import { createApp } from 'vue'
import Dialog from './index.vue'

export { default as Dialog } from './index.vue'

export interface DialogOptions {
  title?: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
}

interface DialogInstance {
  app: App
  container: HTMLElement
  show: (options: Partial<DialogOptions>) => Promise<boolean>
  hide: (confirm: boolean) => void
  destroy: () => void
}

let dialogInstance: DialogInstance | null = null

function createDialogInstance(): DialogInstance {
  const container = document.createElement('div')
  container.id = 'app-dialog'
  document.body.appendChild(container)

  const app = createApp(Dialog)
  const instance = app.mount(container) as any

  return {
    app,
    container,
    show: instance.showDialog,
    hide: instance.hideDialog,
    destroy: () => {
      app.unmount()
      document.body.removeChild(container)
      dialogInstance = null
    },
  }
}

export function showDialog(options: Partial<DialogOptions>): Promise<boolean> {
  if (!dialogInstance) {
    dialogInstance = createDialogInstance()
  }

  return dialogInstance.show(options)
}

export function hideDialog(confirm = false) {
  if (dialogInstance) {
    dialogInstance.hide(confirm)
  }
}

export function destroyDialog() {
  if (dialogInstance) {
    dialogInstance.destroy()
  }
}

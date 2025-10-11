// 自动生成的 ElpisApp 类型定义
// 请勿手动修改此文件

/// <reference types="@elpis/core" />

interface ElpisService {
  base: InstanceType<typeof import('./service/base').default>
  project: InstanceType<typeof import('./service/project').default>
}

interface ElpisController {
  base: InstanceType<typeof import('./controller/base').default>
  example: InstanceType<typeof import('./controller/example').default>
  project: InstanceType<typeof import('./controller/project').default>
}

declare module '@elpis/core' {
  interface ElpisApp {
    service: ElpisService
    controller: ElpisController
  }
}

export {}

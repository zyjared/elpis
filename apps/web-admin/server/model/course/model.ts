import type { DashboardModel } from '~/types/model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: '课程系统',
  menu: [
    {
      key: 'video',
      name: '视频管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
    {
      key: 'user',
      name: '用户管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo',
      },
    },
  ],
}

export default model

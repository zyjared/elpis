import type { DashboardModel } from '../../../docs/dashboard-model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: '电商系统',
  menu: [
    {
      key: 'product',
      name: '商品管理（拼多多）',
    },
    {
      key: 'data',
      name: '数据分析',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'analysis',
            name: '电商罗盘',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/pdd',
            },
          },
        ],
      },
    },
    {
      key: 'search',
      name: '信息查询',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/pdd',
      },
    },
  ],
}

export default model

import type { DashboardModel } from '~/types/model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: '电商系统',
  menu: [
    {
      key: 'product',
      name: '商品管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/taobao',
      },
    },
    {
      key: 'order',
      name: '订单管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/taobao',
      },
    },
    {
      key: 'client',
      name: '客户管理',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/client',
      },
    },
  ],
}

export default model

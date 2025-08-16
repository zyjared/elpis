import type { DashboardModel } from '../../../docs/dashboard-model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: '抖音课程',
  desc: '抖音课程管理系统',
  menu: [
    {
      key: 'traffic',
      name: '流量管理',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'user-traffic',
            name: '学员流量',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/taobao',
            },
          },
        ],
      },
    },
  ],
}

export default model

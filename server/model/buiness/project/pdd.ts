import type { DashboardModel } from '~/types/model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: '拼多多电商系统',
  homePage: '/todo?proj_key=pdd&key=product',
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
              path: '/todo',
            },
          },
          {
            key: 'analysis2',
            name: '电商罗盘2',
            menuType: 'group',
            subMenu: [
              {
                key: 'analysis2-1',
                name: '电商罗盘2-1',
              },
              {
                key: 'analysis2-2',
                name: '电商罗盘2-2',
              },
            ],
          },
        ],
      },
    },
    {
      key: 'search',
      name: '信息查询',
      menuType: 'group',
      subMenu: [
        {
          key: 'search',
          name: '信息查询',
          menuType: 'module',
          moduleType: 'custom',
          customConfig: {
            path: '/todo',
          },
        },
      ],
    },
  ],
}

export default model

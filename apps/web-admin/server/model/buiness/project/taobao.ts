import type { DashboardModel } from '~/types/model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: '淘宝电商系统',
  homePage: '/todo?proj_key=taobao&key=order',
  menu: [
    {
      key: 'order',
      name: '订单管理',
      menuType: 'module',
      moduleType: 'iframe',
      iframeConfig: {
        path: 'https://baidu.com',
      },
    },
    {
      key: 'operating',
      name: '运营活动',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'coupon',
            name: '优惠券',
            menuType: 'module',
            moduleType: 'iframe',
            iframeConfig: {
              path: 'https://bilibili.com',
            },
          },
          {
            key: 'limited',
            name: '限量购',
            menuType: 'group',
            subMenu: [
              {
                key: 'limited2',
                name: '限量购2',
                menuType: 'module',
                moduleType: 'custom',
                customConfig: {
                  path: '/todo',
                },
              },
            ],
          },
          {
            key: 'festival',
            name: '节日活动',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
        ],
      },
    },
  ],

}

export default model

import type { ProjectModelConfig } from '@/types'

const model: ProjectModelConfig = {
  id: 'shopping',
  title: '购物系统',
  description: '购物系统',
  shared: {
    id: 'default',
    groupId: 'shopping',
    title: '默认购物系统',
    description: '默认购物系统',
    menu: [
      {
        id: 'product',
        title: '商品管理',
        type: 'route',
        path: '/todo',
      },
      {
        id: 'cart',
        title: '购物车',
        type: 'route',
        path: '/todo',
      },
      {
        id: 'order',
        title: '订单管理',
        type: 'route',
        path: '/todo',
        children: [
          {
            id: 'pdf',
            title: 'PDF',
            type: 'route',
            path: '/todo',
            children: [
              {
                id: 'pdf',
                title: 'PDF',
                type: 'route',
                path: '/todo',
              },
              {
                id: 'excel',
                title: 'Excel',
                type: 'route',
                path: '/todo',
              },
            ],
          },
        ],
      },
    ],
  },

}

export default model

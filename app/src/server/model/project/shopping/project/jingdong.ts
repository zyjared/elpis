import type { ProjectConfig } from '@/types'

const project: ProjectConfig = {
  id: 'jingdong',
  groupId: 'shopping',
  title: '京东',
  description: '京东管理系统',
  menu: [
    {
      id: 'logistics',
      title: '京东物流',
      type: 'route',
      path: '/logistics',
      children: [
        {
          id: 'logistics-track',
          title: '物流跟踪',
          type: 'route',
          path: '/logistics/track',
        },
      ],
    },
  ],
}

export default project

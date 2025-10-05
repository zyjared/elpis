import type { ProjectGroupConfig } from '@/types'

const group: ProjectGroupConfig = {
  id: 'course',
  title: '课程系统',
  description: '课程系统',
  shared: {
    id: 'default',
    groupId: 'course',
    title: '默认课程系统',
    description: '默认课程系统',
    menu: [
      {
        id: 'video',
        name: '视频管理',
        type: 'route',
        path: '/todo',
      },
      {
        id: 'user',
        name: '用户管理',
        type: 'route',
        path: '/todo',
      },
      {
        id: 'course',
        name: '课程管理',
        type: 'sidebar',
        menu: [
          {
            id: 'course',
            name: '课程管理',
            type: 'route',
            path: '/todo',
          },
        ],
      },
      {
        id: 'course-material',
        name: '课程资料',
        type: 'multi',
        children: [
          {
            id: 'course-material',
            name: '课程资料',
            type: 'route',
            path: '/todo',
          },
        ],
      },
    ],
  },

}

export default group

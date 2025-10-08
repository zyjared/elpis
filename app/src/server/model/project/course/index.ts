import type { ProjectModelConfig } from '@/types'

const model: ProjectModelConfig = {
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
        title: '视频管理',
        type: 'route',
        path: '/todo',
      },
      {
        id: 'user',
        title: '用户管理',
        type: 'iframe',
        url: '/iframe/user',
      },
      {
        id: 'course',
        title: '课程管理',
        type: 'sidebar',
        menu: [
          {
            id: 'course',
            title: '课程管理',
            type: 'route',
            path: '/todo',
          },
        ],
      },
      {
        id: 'course-material',
        title: '课程资料',
        type: 'multi',
        children: [
          {
            id: 'course-material',
            title: '课程资料',
            type: 'route',
            path: '/todo',
          },
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

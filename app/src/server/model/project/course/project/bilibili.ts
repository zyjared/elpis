import type { ProjectConfig } from '@/types'

const project: ProjectConfig = {
  id: 'bilibili',
  groupId: 'course',
  title: 'B站课程',
  description: 'B站课程管理系统',
  menu: [
    {
      id: 'video',
      title: '视频管理',
      type: 'route',
      path: '/todo',
    },
  ],
}

export default project

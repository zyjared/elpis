import type { ProjectConfig } from '@/types'

const project: ProjectConfig = {
  id: 'douyin',
  groupId: 'course',
  title: '抖音课程',
  description: '抖音课程管理系统',
  menu: [
    {
      id: 'video',
      name: '视频管理',
      type: 'route',
      path: '/todo',
    },
  ],
}

export default project

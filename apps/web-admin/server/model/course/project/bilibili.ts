import type { DashboardModel } from '~/types/model'

const model: DashboardModel = {
  mode: 'dashboard',
  name: 'B站课程',
  desc: 'B站课程管理系统',
  homePage: '/todo?proj_key=bilibili&key=video',
  menu: [
    {
      key: 'course-material',
      name: '课程资料',
      menuType: 'module',
      moduleType: 'sider',
      siderConfig: {
        menu: [
          {
            key: 'pdf',
            name: 'PDF',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'excel',
            name: 'Excel',
            menuType: 'module',
            moduleType: 'custom',
            customConfig: {
              path: '/todo',
            },
          },
          {
            key: 'ppt',
            name: 'PPT',
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

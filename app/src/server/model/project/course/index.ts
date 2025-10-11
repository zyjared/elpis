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
        title: '视频管理(route)',
        type: 'route',
        path: '/todo',
      },
      {
        id: 'customer',
        title: '客户管理(schema)',
        type: 'schema',
        schema: {
          table: {
            api: '/api/example/table',
            method: 'GET',
            columns: [
              {
                prop: 'id',
                label: 'ID',
              },
              {
                prop: 'name',
                label: '姓名',
              },
              {
                prop: 'address',
                label: '地址',
              },
              {
                prop: 'createdAt',
                label: '创建时间',
              },
              {
                prop: 'updatedAt',
                label: '更新时间',
              },
            ],
            options: {
              border: true,
              stripe: true,
            },
            buttons: {
              add: {
                api: '/api/example/add',
                name: '示例',
              },
              delete: {
                api: '/api/example/remove',
                prop: 'id',
                promptProp: 'name',
              },
            },
          },
          search: {
            api: '/api/customer',
          },
        },
      },
      {
        id: 'user',
        title: '用户管理(iframe)',
        type: 'iframe',
        url: 'https://bilibili.com',
      },
      {
        id: 'course',
        title: '课程管理(sidebar)',
        type: 'sidebar',
        menu: [
          {
            id: 'course',
            title: '课程管理',
            type: 'route',
            path: '/sidebar/todo',
          },
          {
            id: 'course-material',
            title: '课程资料 ',
            type: 'route',
            path: '/sidebar/todo',
          },
          {
            id: 'course-material2',
            title: '课程资料2',
            type: 'route',
            path: '/sidebar/todo',
            children: [
              {
                id: 'course-material-1',
                title: '课程资料',
                type: 'route',
                path: '/sidebar/todo',
              },
              {
                id: 'course-material-2',
                title: '课程资料2',
                type: 'route',
                path: '/sidebar/todo',
              },
            ],
          },
        ],
      },
      {
        id: 'course-material',
        title: '课程资料',
        type: 'route',
        children: [
          {
            id: 'course-material',
            title: '课程资料(iframe)',
            type: 'iframe',
            url: 'https://baidu.com',
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

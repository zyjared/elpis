import type { DashboardModel } from '~/types/model'

// 示例用法
export const exampleModel: DashboardModel = {
  mode: 'dashboard',
  name: 'Dashboard',
  menu: [
    {
      key: 'dashboard',
      name: 'Dashboard',
      menuType: 'module',
      moduleType: 'iframe',
      iframeConfig: {
        path: '/dashboard',
      },
    },
    {
      key: 'schema-example',
      name: 'Schema Example',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/schema',
        schema: {
          type: 'object',
          properties: {
            name: {
              label: 'Name',
              type: 'string',
              properties: {},
            },
            age: {
              label: 'Age',
              type: 'number',
              properties: {},
            },
          },
        },
        tableConfig: {},
        searchConfig: {},
        components: {},
      },
    },
    {
      key: 'group-example',
      name: 'Group Example',
      menuType: 'group',
      subMenu: [],
    },
  ],
}
